import { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { usePrediction } from '../hooks/usePrediction';

export function PredictionCard() {
  const [budget, setBudget] = useState('');
  const { estimateCost, loading, estimatedCost } = usePrediction();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (budget) {
      estimateCost(Number(budget));
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <Label htmlFor="budget">Enter Your Budget</Label>
        <Input
          id="budget"
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder="Enter budget in USD"
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Estimating...' : 'Estimate Cost'}
        </Button>
      </form>
      {estimatedCost && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Estimated Cost:</h3>
          <p className="text-xl">{estimatedCost} USD</p>
        </div>
      )}
    </Card>
  );
}