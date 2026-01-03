import { useState } from 'react';
import { HomePage } from './components/HomePage';
import { PredictionPage } from './components/PredictionPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'prediction'>('home');

  return (
    <div className="min-h-screen bg-background">
      {currentPage === 'home' ? (
        <HomePage onNavigate={() => setCurrentPage('prediction')} />
      ) : (
        <PredictionPage onNavigateHome={() => setCurrentPage('home')} />
      )}
    </div>
  );
}
