export interface BudgetInput {
  budget: number;
}

export interface PredictionResponse {
  estimatedCost: number;
  breakdown: Record<string, number>;
}

export interface PredictionError {
  message: string;
}