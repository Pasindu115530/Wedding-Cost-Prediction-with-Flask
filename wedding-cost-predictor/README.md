# Wedding Cost Predictor

This project is a wedding cost prediction application built with Next.js and a Flask backend. It allows users to input their wedding budget and receive cost estimates based on various factors.

## Features

- **Budget Input**: Users can input their wedding budget with validation.
- **Cost Prediction**: The application sends the budget to a Flask backend to receive a cost estimate.
- **Responsive Design**: The UI is designed to be mobile-friendly and visually appealing.
- **Loading Indicator**: A loading spinner is displayed while waiting for predictions.

## Technologies Used

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Flask
- **State Management**: React Hooks

## Project Structure

```
wedding-cost-predictor
├── src
│   ├── app
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components
│   │   ├── ui
│   │   │   ├── Card.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Label.tsx
│   │   ├── HomePage.tsx
│   │   ├── BudgetInputCard.tsx
│   │   ├── PredictionCard.tsx
│   │   └── LoadingSpinner.tsx
│   ├── lib
│   │   ├── api.ts
│   │   └── utils.ts
│   ├── types
│   │   └── index.ts
│   └── hooks
│       └── usePrediction.ts
├── public
│   └── favicon.ico
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

## Setup Instructions

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd wedding-cost-predictor
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Run the application**:
   ```
   npm run dev
   ```

4. **Access the application**:
   Open your browser and navigate to `http://localhost:3000`.

## Usage

- Input your wedding budget in the provided card.
- Click on the "Predict" button to send the data to the backend.
- View the estimated costs and budget comparison in the prediction card.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.