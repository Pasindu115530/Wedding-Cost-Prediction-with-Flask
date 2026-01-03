import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { 
  Heart, 
  TrendingUp, 
  Download, 
  RefreshCw, 
  Edit,
  Sparkles,
  MapPin,
  UtensilsCrossed,
  Flower2,
  Camera,
  Music,
  Boxes,
  Info,
  CheckCircle2,
  TrendingDown,
  Database,
  Clock,
  Users,
  Calendar
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface ResultPageProps {
  cost: number;
  onReset: () => void;
  onModify: () => void;
  predictionId?: string;
}

interface CostBreakdown {
  category: string;
  icon: React.ElementType;
  percentage: number;
  amount: number;
  color: string;
}

interface PredictionHistory {
  _id: string;
  estimated_cost: number;
  user_budget: number;
  guest_count: number;
  venue_type: string;
  wedding_season: string;
  timestamp: string;
  is_within_budget: boolean;
  division_breakdown?: {
    [key: string]: number;
  };
  predicted_cost_with_buffer?: number;
}

interface PredictionStats {
  total_predictions: number;
  statistics: {
    avg_estimated_cost: number;
    avg_guest_count: number;
    avg_budget: number;
  };
  popular_venues: Array<{ _id: string; count: number }>;
}

export function ResultPage({ cost, onReset, onModify, predictionId }: ResultPageProps) {
  const [displayCost, setDisplayCost] = useState(0);
  const [showChartType, setShowChartType] = useState<'pie' | 'bar'>('pie');
  const [recentPredictions, setRecentPredictions] = useState<PredictionHistory[]>([]);
  const [stats, setStats] = useState<PredictionStats | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [costBreakdown, setCostBreakdown] = useState<CostBreakdown[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);
  const [barData, setBarData] = useState<any[]>([]);
  const [budgetRange, setBudgetRange] = useState<{ min: number; max: number }>({ min: 0, max: 0 });
  const [highestCategory, setHighestCategory] = useState<CostBreakdown>({
    category: 'Venue',
    icon: MapPin,
    percentage: 0,
    amount: 0,
    color: '#f43f5e'
  });

  // Animated count-up effect
  useEffect(() => {
    const targetCost = recentPredictions[0]?.estimated_cost || cost;
    if (targetCost <= 0) return;

    const duration = 2000;
    const steps = 60;
    const increment = targetCost / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= targetCost) {
        setDisplayCost(targetCost);
        clearInterval(timer);
      } else {
        setDisplayCost(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [cost, recentPredictions]);

  // Initialize breakdown using useCallback to prevent re-creation
  const initializeBreakdown = useCallback(() => {
    if (cost <= 0) return;

    const breakdown: CostBreakdown[] = [
      {
        category: 'Venue & Catering',
        icon: MapPin,
        percentage: 48,
        amount: Math.round(cost * 0.48),
        color: '#f43f5e'
      },
      {
        category: 'Photography & Video',
        icon: Camera,
        percentage: 12,
        amount: Math.round(cost * 0.12),
        color: '#8b5cf6'
      },
      {
        category: 'Flowers & Decor',
        icon: Flower2,
        percentage: 10,
        amount: Math.round(cost * 0.10),
        color: '#f59e0b'
      },
      {
        category: 'Music & Entertainment',
        icon: Music,
        percentage: 8,
        amount: Math.round(cost * 0.08),
        color: '#06b6d4'
      },
      {
        category: 'Attire & Beauty',
        icon: Sparkles,
        percentage: 9,
        amount: Math.round(cost * 0.09),
        color: '#ec4899'
      },
      {
        category: 'Miscellaneous & Buffer',
        icon: Boxes,
        percentage: 13,
        amount: Math.round(cost * 0.13),
        color: '#10b981'
      }
    ];

    setCostBreakdown(breakdown);

    // Set pie chart data
    const pieChartData = breakdown.map(item => ({
      name: item.category,
      value: item.percentage,
      amount: item.amount,
      color: item.color
    }));
    setPieData(pieChartData);

    // Set bar chart data
    const barChartData = breakdown.map(item => ({
      name: item.category,
      cost: item.amount,
      color: item.color
    }));
    setBarData(barChartData);

    // Set budget range
    const minBudget = Math.round(cost * 0.85);
    const maxBudget = Math.round(cost * 1.15);
    setBudgetRange({ min: minBudget, max: maxBudget });

    // Find highest category
    const highest = breakdown.reduce((max, item) => 
      item.percentage > max.percentage ? item : max
    , breakdown[0]);
    setHighestCategory(highest);
  }, [cost]);

  // Initialize budget breakdown on mount
  useEffect(() => {
    initializeBreakdown();
  }, [initializeBreakdown]);

  // Fetch recent predictions
  const fetchRecentPredictions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/predictions/recent?limit=5');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

      if (data.status === 'Success' && data.predictions && data.predictions.length > 0) {
        setRecentPredictions(data.predictions);
        const latest = data.predictions[0];
        if (latest.division_breakdown) {
          updateBreakdownFromDatabase(latest);
        }
      }
    } catch (error) {
      console.error('Error fetching predictions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update breakdown from database
  const updateBreakdownFromDatabase = useCallback((latest: PredictionHistory) => {
    const totalCost = latest.predicted_cost_with_buffer || cost;
    const dbBreakdown = latest.division_breakdown || {};

    const breakdown: CostBreakdown[] = [
      {
        category: 'Venue & Catering',
        icon: MapPin,
        percentage: 48,
        amount: dbBreakdown['Venue_and_Catering'] || Math.round(totalCost * 0.48),
        color: '#f43f5e'
      },
      {
        category: 'Photography & Video',
        icon: Camera,
        percentage: 12,
        amount: dbBreakdown['Photography_and_Video'] || Math.round(totalCost * 0.12),
        color: '#8b5cf6'
      },
      {
        category: 'Flowers & Decor',
        icon: Flower2,
        percentage: 10,
        amount: dbBreakdown['Flowers_and_Decor'] || Math.round(totalCost * 0.10),
        color: '#f59e0b'
      },
      {
        category: 'Music & Entertainment',
        icon: Music,
        percentage: 8,
        amount: dbBreakdown['Music_and_Entertainment'] || Math.round(totalCost * 0.08),
        color: '#06b6d4'
      },
      {
        category: 'Attire & Beauty',
        icon: Sparkles,
        percentage: 9,
        amount: dbBreakdown['Attire_and_Beauty'] || Math.round(totalCost * 0.09),
        color: '#ec4899'
      },
      {
        category: 'Miscellaneous & Buffer',
        icon: Boxes,
        percentage: 13,
        amount: dbBreakdown['Miscellaneous_and_Buffer'] || Math.round(totalCost * 0.13),
        color: '#10b981'
      }
    ];

    setCostBreakdown(breakdown);

    // Update chart data
    const pieChartData = breakdown.map(item => ({
      name: item.category,
      value: item.percentage,
      amount: item.amount,
      color: item.color
    }));
    setPieData(pieChartData);

    const barChartData = breakdown.map(item => ({
      name: item.category,
      cost: item.amount,
      color: item.color
    }));
    setBarData(barChartData);

    // Update budget range
    const minBudget = Math.round(totalCost * 0.85);
    const maxBudget = Math.round(totalCost * 1.15);
    setBudgetRange({ min: minBudget, max: maxBudget });

    // Find highest category
    const highest = breakdown.reduce((max, item) => 
      item.percentage > max.percentage ? item : max
    , breakdown[0]);
    setHighestCategory(highest);
  }, [cost]);

  // Fetch statistics
  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/predictions/stats');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'Success') {
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  // Fetch predictions and stats on mount
  useEffect(() => {
    fetchRecentPredictions();
    fetchStats();
  }, [fetchRecentPredictions, fetchStats]);

  const minBudget = budgetRange.min;
  const maxBudget = budgetRange.max;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Hero Card - Estimated Budget */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-400 via-rose-400 to-pink-500 p-1 shadow-2xl"
        >
          <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-8 sm:p-12">
            {/* AI Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
              className="absolute top-6 right-6"
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-lg">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">AI Estimated</span>
              </div>
            </motion.div>

            <div className="text-center">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                className="inline-flex p-4 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 mb-6 shadow-lg"
              >
                <Heart className="w-10 h-10 text-white" />
              </motion.div>

              <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-900">Estimated Wedding Budget</h1>

              {/* Main Amount */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
                className="mb-6"
              >
                <div className="text-5xl sm:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 mb-2">
                  LKR {displayCost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                </div>
                <p className="text-gray-600 text-lg">Sri Lankan Rupees</p>
              </motion.div>

              {/* Budget Range */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-amber-50 to-rose-50 border-2 border-amber-200"
              >
                <TrendingDown className="w-5 h-5 text-amber-600" />
                <span className="text-gray-700">
                  Budget Range: <strong>LKR {minBudget.toLocaleString()}</strong> – <strong>LKR {maxBudget.toLocaleString()}</strong>
                </span>
                <TrendingUp className="w-5 h-5 text-rose-600" />
              </motion.div>

              {/* Disclaimer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="mt-8 p-4 rounded-xl bg-blue-50 border border-blue-200"
              >
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-900 text-left">
                    <strong>Disclaimer:</strong> This estimation is generated using machine learning models based on real wedding data. 
                    Actual costs may vary depending on specific vendors, location, and additional customization.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Database Statistics Card */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200 shadow-xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg">
                <Database className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Wedding Prediction Statistics</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <StatsCard
                icon={Calendar}
                label="Total Predictions"
                value={stats.total_predictions.toString()}
                color="from-blue-500 to-indigo-500"
              />
              <StatsCard
                icon={Users}
                label="Avg Guest Count"
                value={Math.round(stats.statistics?.avg_guest_count || 0).toString()}
                color="from-purple-500 to-pink-500"
              />
              <StatsCard
                icon={TrendingUp}
                label="Avg Budget"
                value={`LKR ${((stats.statistics?.avg_estimated_cost || 0) / 1000).toFixed(0)}K`}
                color="from-rose-500 to-orange-500"
              />
            </div>

            {/* Popular Venues */}
            {stats.popular_venues && stats.popular_venues.length > 0 && (
              <div className="mt-6 p-4 bg-white/70 rounded-xl">
                <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Most Popular Venue Types
                </h4>
                <div className="flex flex-wrap gap-2">
                  {stats.popular_venues.slice(0, 5).map((venue) => (
                    <span
                      key={venue._id}
                      className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full text-sm border border-blue-300"
                    >
                      {venue._id}: <strong>{venue.count}</strong>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Cost Distribution Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900">Cost Distribution</h2>
            <p className="text-gray-600">Breakdown of your wedding budget by category</p>
          </div>

          {/* Chart Toggle */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 p-1 rounded-full bg-white shadow-md border border-gray-200">
              <button
                onClick={() => setShowChartType('pie')}
                className={`px-6 py-2 rounded-full transition-all duration-300 font-medium ${
                  showChartType === 'pie'
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Pie Chart
              </button>
              <button
                onClick={() => setShowChartType('bar')}
                className={`px-6 py-2 rounded-full transition-all duration-300 font-medium ${
                  showChartType === 'bar'
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Bar Chart
              </button>
            </div>
          </div>

          {/* Charts Container */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
            {showChartType === 'pie' ? (
              <DonutChart data={pieData} totalBudget={cost} />
            ) : (
              <BarChartComponent data={barData} />
            )}
          </div>
        </motion.div>

        {/* Detailed Breakdown Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-900">Detailed Breakdown</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {costBreakdown.map((item, index) => (
              <CategoryCard key={item.category} item={item} delay={index * 0.1} />
            ))}
          </div>
        </motion.div>

        {/* Recent Predictions History */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Recent Predictions</h3>
            </div>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-md font-medium"
            >
              {showHistory ? 'Hide' : 'Show'} History
            </button>
          </div>

          {showHistory && (
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading predictions...</p>
                </div>
              ) : recentPredictions.length > 0 ? (
                <>
                  {recentPredictions.map((prediction, index) => (
                    <PredictionCard
                      key={prediction._id}
                      prediction={prediction}
                      delay={index * 0.1}
                      isCurrentPrediction={prediction._id === predictionId}
                    />
                  ))}
                  <div className="mt-6 text-center">
                    <button
                      onClick={fetchRecentPredictions}
                      className="px-6 py-3 rounded-lg border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 transition-all duration-300 flex items-center gap-2 mx-auto font-medium"
                    > Click Me
                      <RefreshCw className="w-5 h-5" />
                      Refresh History
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Database className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No predictions found in database</p>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200 shadow-xl"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-3 text-gray-900">AI Insights & Recommendations</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">
                    <strong>{highestCategory.category}</strong> accounts for <strong>{highestCategory.percentage}%</strong> of your total wedding budget 
                    (LKR {highestCategory.amount.toLocaleString()}).
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">
                    Choosing a <strong>non-peak season</strong> wedding may reduce overall costs by up to <strong>15-20%</strong>.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">
                    Consider <strong>semi-urban venues</strong> for a balance between quality and cost savings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onModify}
            className="group w-full sm:w-auto px-8 py-4 rounded-full border-2 border-rose-500 text-rose-500 hover:bg-rose-50 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 font-medium"
          >
            <Edit className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>Modify Selection</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="group w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/50 flex items-center justify-center gap-2 font-medium"
          >
            <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
            <span>Download Report</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="group w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/50 flex items-center justify-center gap-2 font-medium"
          >
            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            <span>Start New Prediction</span>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

function DonutChart({ data, totalBudget }: { data: any[]; totalBudget: number }) {
  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={140}
            paddingAngle={3}
            dataKey="value"
            animationBegin={0}
            animationDuration={1000}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <div className="text-gray-500 text-sm mb-1">Total Budget</div>
          <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">
            LKR {(totalBudget / 1000).toFixed(0)}K
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: item.color }}
            />
            <div className="text-sm">
              <div className="text-gray-700 font-medium">{item.name}</div>
              <div className="text-gray-500">{item.value}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BarChartComponent({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="name" 
          angle={-45} 
          textAnchor="end" 
          height={100}
          stroke="#6b7280"
        />
        <YAxis 
          stroke="#6b7280"
          tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
        />
        <Tooltip content={<CustomBarTooltip />} />
        <Bar 
          dataKey="cost" 
          radius={[10, 10, 0, 0]}
          animationBegin={0}
          animationDuration={1000}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-xl border-2 border-gray-100">
        <p className="font-medium text-gray-900 mb-1">{payload[0].name}</p>
        <p className="text-sm text-gray-600">
          Percentage: <strong>{payload[0].value}%</strong>
        </p>
        <p className="text-sm text-gray-600">
          Amount: <strong>LKR {payload[0].payload.amount.toLocaleString()}</strong>
        </p>
      </div>
    );
  }
  return null;
}

function CustomBarTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-xl border-2 border-gray-100">
        <p className="font-medium text-gray-900 mb-1">{payload[0].payload.name}</p>
        <p className="text-sm text-gray-600">
          Cost: <strong>LKR {payload[0].value.toLocaleString()}</strong>
        </p>
      </div>
    );
  }
  return null;
}

function CategoryCard({ item, delay }: { item: CostBreakdown; delay: number }) {
  const Icon = item.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group relative overflow-hidden bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
    >
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
        style={{ background: `linear-gradient(135deg, ${item.color} 0%, transparent 100%)` }}
      />

      <div className="relative">
        <div 
          className="inline-flex p-3 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300"
          style={{ backgroundColor: `${item.color}20` }}
        >
          <Icon className="w-6 h-6" style={{ color: item.color }} />
        </div>

        <h3 className="text-xl font-bold mb-2 text-gray-900">{item.category}</h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Percentage</span>
            <span className="text-lg font-semibold" style={{ color: item.color }}>
              {item.percentage}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Amount</span>
            <span className="text-lg font-semibold" style={{ color: item.color }}>
              LKR {(item.amount / 1000).toFixed(0)}K
            </span>
          </div>
        </div>

        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${item.percentage}%` }}
            viewport={{ once: true }}
            transition={{ delay: delay + 0.2, duration: 0.8, ease: 'easeOut' }}
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ backgroundColor: item.color }}
          />
        </div>

        <div className="absolute top-4 right-4">
          <svg className="w-12 h-12 transform -rotate-90">
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="#f0f0f0"
              strokeWidth="4"
              fill="none"
            />
            <motion.circle
              cx="24"
              cy="24"
              r="20"
              stroke={item.color}
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDasharray: '0 126' }}
              whileInView={{ strokeDasharray: `${(item.percentage / 100) * 126} 126` }}
              viewport={{ once: true }}
              transition={{ delay: delay + 0.3, duration: 0.8, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-semibold" style={{ color: item.color }}>
              {item.percentage}%
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StatsCard({ icon: Icon, label, value, color }: { 
  icon: React.ElementType; 
  label: string; 
  value: string; 
  color: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
    >
      <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${color} mb-3`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </motion.div>
  );
}

function PredictionCard({ 
  prediction, 
  delay, 
  isCurrentPrediction 
}: { 
  prediction: PredictionHistory; 
  delay: number;
  isCurrentPrediction: boolean;
}) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
        isCurrentPrediction
          ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300 shadow-lg'
          : 'bg-gray-50 border-gray-200 hover:border-emerald-300 hover:shadow-md'
      }`}
    >
      {isCurrentPrediction && (
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full shadow-md">
            Current
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <div className="text-xs text-gray-600 mb-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Estimated Cost
          </div>
          <div className="text-lg font-medium text-emerald-600">
            LKR {(prediction.estimated_cost / 1000).toFixed(0)}K
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-600 mb-1 flex items-center gap-1">
            <Users className="w-3 h-3" />
            Guest Count
          </div>
          <div className="text-lg font-medium text-gray-900">
            {prediction.guest_count}
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-600 mb-1 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            Venue Type
          </div>
          <div className="text-sm font-medium text-gray-900 capitalize">
            {prediction.venue_type}
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-600 mb-1 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Date
          </div>
          <div className="text-sm text-gray-700">
            {formatDate(prediction.timestamp)}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600 capitalize">{prediction.wedding_season}</span>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          prediction.is_within_budget
            ? 'bg-green-100 text-green-700 border border-green-300'
            : 'bg-red-100 text-red-700 border border-red-300'
        }`}>
          {prediction.is_within_budget ? 'Within Budget' : 'Over Budget'}
        </div>
      </div>
    </motion.div>
  );
}