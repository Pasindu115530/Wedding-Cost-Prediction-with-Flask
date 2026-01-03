import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
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
  ArrowRight,
  CheckCircle2,
  TrendingDown
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

interface ResultPageProps {
  cost: number;
  onReset: () => void;
  onModify: () => void;
}

interface CostBreakdown {
  category: string;
  icon: React.ElementType;
  percentage: number;
  amount: number;
  color: string;
}

export function ResultPage({ cost, onReset, onModify }: ResultPageProps) {
  const [displayCost, setDisplayCost] = useState(0);
  const [showChartType, setShowChartType] = useState<'pie' | 'bar'>('pie');

  // Animated count-up effect
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = cost / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= cost) {
        setDisplayCost(cost);
        clearInterval(timer);
      } else {
        setDisplayCost(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [cost]);

  // Calculate cost breakdown
  const costBreakdown: CostBreakdown[] = [
    {
      category: 'Venue',
      icon: MapPin,
      percentage: 25,
      amount: cost * 0.25,
      color: '#f43f5e'
    },
    {
      category: 'Catering',
      icon: UtensilsCrossed,
      percentage: 35,
      amount: cost * 0.35,
      color: '#ec4899'
    },
    {
      category: 'Decoration',
      icon: Flower2,
      percentage: 15,
      amount: cost * 0.15,
      color: '#f59e0b'
    },
    {
      category: 'Photography',
      icon: Camera,
      percentage: 12,
      amount: cost * 0.12,
      color: '#8b5cf6'
    },
    {
      category: 'Entertainment',
      icon: Music,
      percentage: 8,
      amount: cost * 0.08,
      color: '#06b6d4'
    },
    {
      category: 'Miscellaneous',
      icon: Boxes,
      percentage: 5,
      amount: cost * 0.05,
      color: '#10b981'
    }
  ];

  const minBudget = Math.round(cost * 0.85);
  const maxBudget = Math.round(cost * 1.15);

  const pieData = costBreakdown.map(item => ({
    name: item.category,
    value: item.percentage,
    amount: item.amount,
    color: item.color
  }));

  const barData = costBreakdown.map(item => ({
    name: item.category,
    cost: item.amount,
    color: item.color
  }));

  const highestCategory = costBreakdown.reduce((prev, current) => 
    prev.percentage > current.percentage ? prev : current
  );

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
                <span className="text-sm">AI Estimated</span>
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

              <h1 className="text-3xl sm:text-4xl mb-8">Estimated Wedding Budget</h1>

              {/* Main Amount */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
                className="mb-6"
              >
                <div className="text-5xl sm:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 mb-2">
                  LKR {displayCost.toLocaleString()}
                </div>
                <p className="text-muted-foreground text-lg">Sri Lankan Rupees</p>
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

        {/* Cost Distribution Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl mb-2">Cost Distribution</h2>
            <p className="text-muted-foreground">Breakdown of your wedding budget by category</p>
          </div>

          {/* Chart Toggle */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 p-1 rounded-full bg-white shadow-md border border-gray-200">
              <button
                onClick={() => setShowChartType('pie')}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  showChartType === 'pie'
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Pie Chart
              </button>
              <button
                onClick={() => setShowChartType('bar')}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
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

        {/* Percentage Breakdown Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl mb-6 text-center">Detailed Breakdown</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {costBreakdown.map((item, index) => (
              <CategoryCard key={item.category} item={item} delay={index * 0.1} />
            ))}
          </div>
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
              <h3 className="text-xl mb-3">AI Insights & Recommendations</h3>
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
            className="group w-full sm:w-auto px-8 py-4 rounded-full border-2 border-rose-500 text-rose-500 hover:bg-rose-50 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <Edit className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>Modify Selection</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="group w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/50 flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
            <span>Download Report</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="group w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/50 flex items-center justify-center gap-2"
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

      {/* Center Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <div className="text-gray-500 text-sm mb-1">Total Budget</div>
          <div className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">
            LKR {(totalBudget / 1000).toFixed(0)}K
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: item.color }}
            />
            <div className="text-sm">
              <div className="text-gray-700">{item.name}</div>
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
      {/* Background Gradient on Hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
        style={{ background: `linear-gradient(135deg, ${item.color} 0%, transparent 100%)` }}
      />

      <div className="relative">
        {/* Icon */}
        <div 
          className="inline-flex p-3 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300"
          style={{ backgroundColor: `${item.color}20` }}
        >
          <Icon className="w-6 h-6" style={{ color: item.color }} />
        </div>

        {/* Category Name */}
        <h3 className="text-xl mb-2">{item.category}</h3>

        {/* Percentage & Amount */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Percentage</span>
            <span className="text-lg" style={{ color: item.color }}>
              {item.percentage}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Amount</span>
            <span className="text-lg" style={{ color: item.color }}>
              LKR {(item.amount / 1000).toFixed(0)}K
            </span>
          </div>
        </div>

        {/* Progress Bar */}
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

        {/* Ring Progress Indicator */}
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
            <span className="text-xs" style={{ color: item.color }}>
              {item.percentage}%
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
