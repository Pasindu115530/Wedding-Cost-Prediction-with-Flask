import { useState } from 'react';
import { fetchPrediction } from '../lib/api';

export function usePrediction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<number | null>(null);

  const makePrediction = async (budget: number) => {
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await fetchPrediction(budget);
      setPrediction(response.data.estimatedCost);
    } catch (err) {
      setError('Failed to fetch prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, prediction, makePrediction };
}