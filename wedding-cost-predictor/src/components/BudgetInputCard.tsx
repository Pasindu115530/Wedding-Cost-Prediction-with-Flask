import { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { usePrediction } from '../hooks/usePrediction';

export function BudgetInputCard() {
  const [budget, setBudget] = useState('');
  const { predictCost, loading } = usePrediction();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setBudget(value);
    }
  };

  const handleSubmit = () => {
    if (budget) {
      predictCost(Number(budget));
    }
  };

  return (
    <Card className="p-6">
      <Label htmlFor="budget">Enter Your Wedding Budget</Label>
      <Input
        id="budget"
        type="text"
        value={budget}
        onChange={handleInputChange}
        placeholder="Enter budget in USD"
      />
      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Calculating...' : 'Get Prediction'}
      </Button>
    </Card>
  );
}