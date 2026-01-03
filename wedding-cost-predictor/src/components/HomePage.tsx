import { useState } from 'react';
import BudgetInputCard from './BudgetInputCard';
import PredictionCard from './PredictionCard';
import LoadingSpinner from './LoadingSpinner';
import { makePrediction } from '../lib/api';

export default function HomePage() {
  const [budget, setBudget] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBudgetChange = (value) => {
    setBudget(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await makePrediction({ budget: parseFloat(budget) });
      setPrediction(result);
    } catch (err) {
      setError('Failed to fetch prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <BudgetInputCard budget={budget} onBudgetChange={handleBudgetChange} onSubmit={handleSubmit} />
      {loading && <LoadingSpinner />}
      {error && <div className="text-red-500">{error}</div>}
      {prediction && <PredictionCard prediction={prediction} budget={budget} />}
    </div>
  );
}