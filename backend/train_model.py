import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestRegressor
import joblib

# 1. Load dataset
# Ensure the file name matches your actual Excel file
df = pd.read_excel('Wedding_Dataset_file_final.xlsx')

# 2. Define Features and Target
target = 'Total_Wedding_Cost_LKR'
categorical_columns = [
    'Wedding_Season', 'Venue_Type', 'Catering_Type',
    'Decoration_Level', 'Photography_Package', 'Entertainment_Type'
]
numeric_columns = [
    'Guest_Count', 'Venue_Cost_LKR', 'Catering_Cost_LKR',
    'Decoration_Cost_LKR', 'Photography_Cost_LKR', 'Entertainment_Cost_LKR'
]

# Feature order must be consistent for app.py
feature_order = categorical_columns + numeric_columns

# 3. Handle Missing Values & Normalize Text
for col in numeric_columns:
    df[col] = df[col].fillna(df[col].median())

for col in categorical_columns:
    # Fill missing values and convert to lowercase for consistency
    df[col] = df[col].fillna(df[col].mode()[0]).astype(str).str.lower().str.strip()

# 4. Save Medians (Crucial for app.py defaults)
medians = df[numeric_columns].median().to_dict()
joblib.dump(medians, 'medians.pkl')

# 5. Encode Categorical Columns
label_encoders = {}
for col in categorical_columns:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    label_encoders[col] = le

# 6. Scale Numeric Features
scaler = StandardScaler()
df[numeric_columns] = scaler.fit_transform(df[numeric_columns])

# 7. Train/Test Split
X = df[feature_order]
y = df[target]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 8. Train Model
model = RandomForestRegressor(n_estimators=200, random_state=42)
model.fit(X_train, y_train)

# 9. Save Artifacts
joblib.dump(model, 'wedding_cost_model.pkl')
joblib.dump(scaler, 'scaler.pkl')
joblib.dump(label_encoders, 'label_encoders.pkl')

print("Success: Model, Encoders, Scaler, and Medians saved successfully!")