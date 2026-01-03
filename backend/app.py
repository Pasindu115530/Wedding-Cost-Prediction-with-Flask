from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import os
import traceback
from datetime import datetime
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# --- MongoDB Setup ---
try:
    MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
    DATABASE_NAME = os.getenv('DATABASE_NAME', 'wedding_predictions')
    
    mongo_client = MongoClient(MONGODB_URI)
    db = mongo_client[DATABASE_NAME]
    predictions_collection = db['predictions']
    
    print("✅ MongoDB connected successfully")
except Exception as e:
    print(f"❌ MongoDB connection error: {e}")
    mongo_client = None

# --- Global Initialization ---
model = None
scaler = None
label_encoders = None
medians = None
packages_df = pd.DataFrame()

# --- Load ML Artifacts & Data ---
def load_artifacts():
    global model, scaler, label_encoders, medians, packages_df
    try:
        model = joblib.load("wedding_cost_model.pkl")
        scaler = joblib.load("scaler.pkl")
        label_encoders = joblib.load("label_encoders.pkl")
        medians = joblib.load("medians.pkl")
        
        csv_name = 'Wedding_Dataset_file_final.xlsx - Wedding_Package_Data.csv'
        if os.path.exists(csv_name):
            packages_df = pd.read_csv(csv_name)
        else:
            print(f"Warning: {csv_name} not found.")
        print("All ML artifacts loaded successfully.")
    except Exception as e:
        print(f"Error loading files: {e}")

load_artifacts()

# Feature definitions - must match your training data exactly
categorical_features = [
    'Wedding_Season', 'Venue_Type', 'Catering_Type',
    'Decoration_Level', 'Photography_Package', 'Entertainment_Type'
]
numeric_features = [
    'Guest_Count', 'Venue_Cost_LKR', 'Catering_Cost_LKR',
    'Decoration_Cost_LKR', 'Photography_Cost_LKR', 'Entertainment_Cost_LKR'
]
model_features = categorical_features + numeric_features

def find_best_package(budget, guests, preferences):
    """Finds a package that fits the budget and matches preferences."""
    if packages_df.empty:
        return None

    matches = packages_df[
        (packages_df['Package_Price_LKR'] <= budget) & 
        (packages_df['Max_Guests'] >= guests)
    ].copy()

    if matches.empty:
        return None

    def calculate_score(row):
        score = 0
        # Compare against the mapped keys
        if str(row['Venue_Type']).lower() == str(preferences.get('Venue_Type', '')).lower(): score += 3
        if str(row['Catering_Type']).lower() == str(preferences.get('Catering_Type', '')).lower(): score += 2
        return score

    matches['match_score'] = matches.apply(calculate_score, axis=1)
    best = matches.sort_values(by=['match_score', 'Package_Price_LKR'], ascending=[False, True]).iloc[0]
    return best.to_dict()

def save_to_mongodb(data):
    """Save prediction data to MongoDB"""
    try:
        if mongo_client is None:
            print("⚠️ MongoDB not connected, skipping save")
            return None
            
        # Add timestamp
        data['timestamp'] = datetime.now()
        data['created_at'] = datetime.now().isoformat()
        
        # Insert into MongoDB
        result = predictions_collection.insert_one(data)
        print(f"✅ Data saved to MongoDB with ID: {result.inserted_id}")
        return str(result.inserted_id)
    except Exception as e:
        print(f"❌ Error saving to MongoDB: {e}")
        return None

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No input provided"}), 400

        print("📥 Received from React:", data)

        # 1. Map React keys to Model keys
        mapped_input = {
            'Wedding_Season': data.get('wedding_season'),
            'Venue_Type': data.get('venue_type'),
            'Catering_Type': data.get('catering_type', 'Standard'),
            'Decoration_Level': data.get('decoration_type'),
            'Photography_Package': data.get('photography_package'),
            'Entertainment_Type': data.get('entertainment'),
            'Guest_Count': data.get('guest_count', 150)
        }

        # 2. Add numeric cost features using medians
        for feature in numeric_features:
            if feature not in mapped_input:
                mapped_input[feature] = medians.get(feature, 0)

        # 3. Create DataFrame with the exact column order required by the model
        user_df = pd.DataFrame([mapped_input])[model_features]

        # 4. Encode Categorical Features
        for col in categorical_features:
            le = label_encoders.get(col)
            if le:
                val = str(user_df[col][0]).lower().strip()
                # Handle case-insensitive matching for encoder classes
                classes_lower = [str(c).lower() for c in le.classes_]
                if val in classes_lower:
                    class_idx = classes_lower.index(val)
                    user_df[col] = le.transform([le.classes_[class_idx]])
                else:
                    user_df[col] = le.transform([le.classes_[0]])

        # 5. Scale Numeric Features
        user_df[numeric_features] = scaler.transform(user_df[numeric_features])

        # 6. Model Prediction
        predicted_raw = float(model.predict(user_df)[0])
        total_needed = predicted_raw * 1.10  # 10% safety buffer

        # 7. Recommendation and Budgeting
        user_budget = float(data.get("budget", 0))
        search_limit = user_budget if user_budget > 0 else total_needed
        best_pkg = find_best_package(search_limit, mapped_input['Guest_Count'], mapped_input)

        division_base = user_budget if user_budget > 0 else total_needed
        division = {
            "Venue_and_Catering": round(division_base * 0.48, 2),
            "Photography_and_Video": round(division_base * 0.12, 2),
            "Flowers_and_Decor": round(division_base * 0.10, 2),
            "Music_and_Entertainment": round(division_base * 0.08, 2),
            "Attire_and_Beauty": round(division_base * 0.09, 2),
            "Miscellaneous_and_Buffer": round(division_base * 0.13, 2)
        }

        # Prepare response
        response_data = {
            "status": "Success",
            "is_within_budget": user_budget >= total_needed if user_budget > 0 else True,
            "estimated_cost": round(predicted_raw, 2),
            "predicted_cost_with_buffer": round(total_needed, 2),
            "suggested_division_LKR": division,
            "best_matching_package": best_pkg,
            "user_budget": user_budget,
            "budget_difference": round(user_budget - total_needed, 2) if user_budget > 0 else 0
        }
        print()

        # 8. Save complete data to MongoDB
        mongodb_document = {
            **data,  # Original user input
            **response_data,  # Prediction results
            "division_breakdown": division,  # Store division separately for easy querying
            "user_preferences": {
                "Wedding_Season": mapped_input['Wedding_Season'],
                "Venue_Type": mapped_input['Venue_Type'],
                "Catering_Type": mapped_input['Catering_Type'],
                "Decoration_Level": mapped_input['Decoration_Level'],
                "Photography_Package": mapped_input['Photography_Package'],
                "Entertainment_Type": mapped_input['Entertainment_Type'],
                "Guest_Count": mapped_input['Guest_Count']
            }
        }
        
        # Save to MongoDB
        saved_id = save_to_mongodb(mongodb_document)
        if saved_id:
            response_data['prediction_id'] = saved_id

        print("✅ Prediction completed and saved")
        return jsonify(response_data)

    except Exception as e:
        print("❌ Error Details:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500

from flask import request, jsonify

@app.route("/predictions/recent", methods=["GET"])
def get_recent_predictions():
    try:
        if mongo_client is None:
            return jsonify({"status": "Error", "message": "Database not connected"}), 500
        
        limit = int(request.args.get('limit', 10))
        cursor = predictions_collection.find().sort('timestamp', -1).limit(limit)
        
        formatted_predictions = []
        
        for doc in cursor:
            # Map only the specific fields you requested
            clean_record = {
                "wedding_season": doc.get("wedding_season"),
                "venue_type": doc.get("venue_type"),
                "decoration_type": doc.get("decoration_type"),
                "photography_package": doc.get("photography_package"),
                "entertainment": doc.get("entertainment"),
                "guest_count": doc.get("guest_count"),
                "is_within_budget": doc.get("is_within_budget"),
                "estimated_cost": doc.get("estimated_cost"),
                "predicted_cost_with_buffer": doc.get("predicted_cost_with_buffer"),
                "division_breakdown": doc.get("division_breakdown"),
                "budget_difference": doc.get("budget_difference")
            }
            
            # Print the cleaned record to terminal
            print(f"SENDING TO FRONTEND: {clean_record}")
            
            formatted_predictions.append(clean_record)
            
        return jsonify({
            "status": "Success",
            "count": len(formatted_predictions),
            "predictions": formatted_predictions
        })

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"status": "Error", "message": str(e)}), 500

@app.route("/predictions", methods=["GET"])
def get_all_predictions():
    """Get all predictions from MongoDB"""
    try:
        if mongo_client is None:
            return jsonify({"error": "Database not connected"}), 500
            
        predictions = list(predictions_collection.find().sort('timestamp', -1).limit(50))
        
        # Convert ObjectId to string
        for pred in predictions:
            pred['_id'] = str(pred['_id'])
            if 'timestamp' in pred:
                pred['timestamp'] = pred['timestamp'].isoformat()
        
        return jsonify({
            "status": "Success",
            "count": len(predictions),
            "predictions": predictions
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/predictions/<prediction_id>", methods=["GET"])
def get_prediction_by_id(prediction_id):
    """Get a specific prediction by ID"""
    try:
        if mongo_client is None:
            return jsonify({"error": "Database not connected"}), 500
            
        from bson.objectid import ObjectId
        prediction = predictions_collection.find_one({'_id': ObjectId(prediction_id)})
        
        if prediction:
            prediction['_id'] = str(prediction['_id'])
            if 'timestamp' in prediction:
                prediction['timestamp'] = prediction['timestamp'].isoformat()
            return jsonify(prediction)
        else:
            return jsonify({"error": "Prediction not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    print("\n🚀 Starting Flask Backend Server with MongoDB...")
    print("="*60)
    print("   Server: http://localhost:5000")
    print("   Database:", DATABASE_NAME)
    print("="*60 + "\n")
    app.run(debug=True, port=5000)