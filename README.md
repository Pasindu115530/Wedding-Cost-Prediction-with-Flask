# 💍 Wedding Cost Prediction System 🚀

Planning a wedding but worried about the budget? 💸 This **End-to-End Machine Learning** application helps couples estimate their wedding expenses in Sri Lankan Rupees (LKR) based on historical data and specific preferences! 🌸✨

---

## 🌟 Key Features

* **🔮 Cost Prediction:** Uses a **Random Forest Regressor** to predict total wedding costs with high accuracy.
* **📊 Smart Budgeting:** Automatically breaks down your budget into categories like Venue & Catering (48%), Photography (12%), and Decor (10%).
* **📦 Package Matching:** Recommends the best-predefined wedding packages based on your guest count and budget.
* **💾 Database Integration:** Saves every prediction to **MongoDB** for history tracking and easy retrieval.
* **🎨 Beautiful UI:** A modern, responsive frontend built with **React** and **Tailwind CSS**, featuring a multi-page flow from home to results.
* **⚙️ Robust Backend:** Scalable **Flask API** that handles data preprocessing, label encoding, and model inference.

---

## 🏗️ Project Architecture

The project is divided into two main components:

1. **Backend (`/backend`):**
* `train_model.py`: The ML pipeline that cleans data, scales features, and trains the model.
* `app.py`: Flask server providing endpoints for predictions and history retrieval.
* `wedding_cost_model.pkl`: The trained intelligence of the app.


2. **Frontend (`/frontend`):**
* Built with **Vite + React + TypeScript**.
* Interactive forms to capture user preferences like Season, Venue Type, and Guest Count.



---

## 🚀 Getting Started

### 🐍 Backend Setup

1. Navigate to the backend folder:
```bash
cd backend

```


2. Install dependencies:
```bash
pip install -r requirements.txt

```


3. Set up your `.env` file with your `MONGODB_URI` and `DATABASE_NAME`.
4. Run the server:
```bash
python app.py

```



### 💻 Frontend Setup

1. Navigate to the frontend folder:
```bash
cd frontend

```


2. Install packages:
```bash
npm install

```


3. Launch the app:
```bash
npm run dev

```



---

## 🧪 Machine Learning Details

The model considers both **Categorical** and **Numeric** factors to ensure a realistic estimate:

| Categorical Features 🎭 | Numeric Features 🔢 |
| --- | --- |
| Wedding Season | Guest Count |
| Venue Type | Venue & Catering Costs |
| Decoration Level | Photography Costs |
| Photography Package | Entertainment Costs |
| Entertainment Type | ...and more! |

> **Note:** A **10% safety buffer** is automatically added to every prediction to account for unexpected inflation or last-minute changes! 🛡️

---

## 🛠️ Technologies Used

* **Frontend:** React, TypeScript, Tailwind CSS, Lucide Icons.
* **Backend:** Flask, Python, Pandas, Scikit-Learn, Joblib.
* **Database:** MongoDB.
* **Deployment:** Vercel (Frontend).

---

## 🤝 Contributing

Contributions make the open-source community an amazing place!

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 💖 Show your support

Give a ⭐️ if this project helped you plan your big day! 🥂✨

**Repository Link:** [https://github.com/Pasindu115530/Wedding-Cost-Prediction-with-Flask](https://github.com/Pasindu115530/Wedding-Cost-Prediction-with-Flask)
**Online Link**:**https://wedding-cost-prediction-with-flask-one.vercel.app/**
