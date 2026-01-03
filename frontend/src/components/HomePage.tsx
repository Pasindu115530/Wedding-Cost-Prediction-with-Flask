import { motion } from 'motion/react';
import { Heart, TrendingUp, Users, Sparkles, Calculator, Target, Instagram, Facebook, Twitter } from 'lucide-react';
import { useEffect, useState } from 'react';

interface HomePageProps {
  onNavigate: () => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="relative">
      {/* Hero Section */}
      <HeroSection onNavigate={onNavigate} />
      
      {/* Stats Section */}
      <StatsSection />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

function HeroSection({ onNavigate }: { onNavigate: () => void }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1633346785060-5222e2ffe3b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3ZWRkaW5nJTIwY2VsZWJyYXRpb258ZW58MXx8fHwxNzY3NDUxMjM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-8">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="text-white/90 text-sm">AI-Powered Wedding Planning</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="text-4xl sm:text-5xl lg:text-6xl text-white mb-6 tracking-tight"
        >
          Smart Wedding Cost Prediction <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-pink-300">
            with AI
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto"
        >
          Plan your dream wedding with data-driven confidence
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
        >
          <button
            onClick={onNavigate}
            className="group relative px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-full transition-all duration-300 shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/50 hover:scale-105"
          >
            <span className="flex items-center gap-2">
              Start Prediction
              <Heart className="w-5 h-5 group-hover:animate-pulse" />
            </span>
          </button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2"
          >
            <div className="w-1 h-2 bg-white/50 rounded-full"></div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-rose-50/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatCard
            value={1250}
            suffix="+"
            label="Weddings Analyzed"
            delay={0}
          />
          <StatCard
            value={95}
            suffix="%"
            label="Prediction Accuracy"
            delay={0.2}
          />
          <StatCard
            value={890}
            suffix="+"
            label="Happy Couples"
            delay={0.4}
          />
        </div>
      </div>
    </section>
  );
}

function StatCard({ value, suffix, label, delay }: { value: number; suffix: string; label: string; delay: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      <div className="text-4xl sm:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500 mb-2">
        {count}{suffix}
      </div>
      <div className="text-muted-foreground">{label}</div>
    </motion.div>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: Calculator,
      title: 'AI-Powered Prediction',
      description: 'Advanced machine learning algorithms analyze multiple factors to provide accurate cost estimates for your wedding.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Target,
      title: 'Budget Optimization',
      description: 'Get smart recommendations to optimize your wedding budget without compromising on your dream celebration.',
      gradient: 'from-rose-500 to-pink-500',
    },
    {
      icon: TrendingUp,
      title: 'Sri Lankan Wedding Insights',
      description: 'Specialized data and insights tailored for Sri Lankan wedding traditions, customs, and market trends.',
      gradient: 'from-amber-500 to-orange-500',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl mb-4">Why Choose Our Platform</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Powered by cutting-edge AI technology and comprehensive wedding data
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} delay={index * 0.2} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  gradient, 
  delay 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string; 
  gradient: string; 
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -5 }}
      className="group p-8 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="mb-3">{title}</h3>
      <p className="text-muted-foreground">
        {description}
      </p>
    </motion.div>
  );
}

function Footer() {
  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
  ];

  return (
    <footer className="py-12 bg-gradient-to-b from-rose-50/30 to-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500" />
            <span className="text-lg">Wedding Cost Predictor</span>
          </div>
          
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-gray-100 hover:bg-gradient-to-r hover:from-rose-500 hover:to-pink-500 text-gray-600 hover:text-white transition-all duration-300"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>

          <div className="text-sm text-muted-foreground text-center">
            <p>© 2026 Wedding Cost Predictor. Built with AI & Love.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
