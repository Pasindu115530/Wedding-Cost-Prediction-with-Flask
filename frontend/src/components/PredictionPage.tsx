import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Calendar, 
  Home as Building, 
  Sparkles, 
  Camera, 
  Music,
  Check,
  ArrowLeft,
  Loader2,
  Heart,
  TrendingUp,
  CheckCircle2,
  Users
} from 'lucide-react';
import { ResultPage } from './ResultPage';

interface PredictionPageProps {
  onNavigateHome: () => void;
}

type LocationType = 'urban' | 'semi-urban' | 'rural';
type Season = 'peak' | 'non-peak';
type VenueType = 'indoor' | 'outdoor';
type DecorationType = 'basic' | 'standard' | 'luxury';
type PhotographyPackage = 'basic' | 'premium';
type Entertainment = 'live-band' | 'dj' | 'traditional';

interface PredictionData {
  location?: LocationType;
  season?: Season;
  venue?: VenueType;
  decoration?: DecorationType;
  photography?: PhotographyPackage;
  entertainment?: Entertainment;
  guestCount?: number;
  budget?: number;
}

export function PredictionPage({ onNavigateHome }: PredictionPageProps) {
  const [data, setData] = useState<PredictionData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [predictedCost, setPredictedCost] = useState<number | null>(null);

 const handlePredict = async () => {
  // 1. Prepare JSON payload
  const payload = {
    location_type: data.location,
    wedding_season: data.season,
    venue_type: data.venue,
    decoration_type: data.decoration,
    photography_package: data.photography,
    entertainment: data.entertainment,
    guest_count: data.guestCount
  };

  console.log('Sending Payload:', payload);
  setIsLoading(true);

  try {
    // 2. Make the API call to your Flask backend
    // Replace the URL with your production URL when you deploy
    const response = await fetch('http://127.0.0.1:5000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    // 3. Parse the JSON response
    const result = await response.json();
    
    // 4. Update state with the backend's prediction
    // Assuming your Flask returns { "predicted_cost": 2500000 }
    setPredictedCost(result.predicted_cost);
    setShowResult(true);

  } catch (error) {
    console.error('Prediction Error:', error);
    alert("Could not connect to the prediction server. Please ensure the backend is running.");
  } finally {
    setIsLoading(false);
  }
};

  const isComplete = data.location && data.season && data.venue && data.decoration && data.photography && data.entertainment && data.guestCount && data.budget;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-2 text-gray-600 hover:text-rose-500 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </button>
            
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-rose-500" />
              <span className="text-lg">Cost Prediction</span>
            </div>

            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl mb-3">Configure Your Dream Wedding</h1>
          <p className="text-muted-foreground text-lg">
            Select your preferences to get an AI-powered cost estimate
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Location Type */}
              <Section 
                title="Location Type" 
                icon={MapPin}
                description="Where will your wedding take place?"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <ImageCard
                    title="Urban"
                    description="City venues & premium locations"
                    image="https://images.unsplash.com/photo-1759495050971-c87b84c104d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMHdlZGRpbmclMjB2ZW51ZXxlbnwxfHx8fDE3Njc0NTE5NDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    selected={data.location === 'urban'}
                    onClick={() => setData({ ...data, location: 'urban' })}
                    features={[
                      'Premium hotel ballrooms',
                      'Rooftop venues with city views',
                      'Luxury banquet halls',
                      'High-end service standards'
                    ]}
                  />
                  <ImageCard
                    title="Semi-Urban"
                    description="Suburban areas with balanced pricing"
                    image="https://images.unsplash.com/photo-1764593821339-6be7cb85e7f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdWJ1cmJhbiUyMGdhcmRlbiUyMHdlZGRpbmd8ZW58MXx8fHwxNzY3NDUxOTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    selected={data.location === 'semi-urban'}
                    onClick={() => setData({ ...data, location: 'semi-urban' })}
                    features={[
                      'Garden venues',
                      'Community centers',
                      'Boutique hotels',
                      'Moderate pricing'
                    ]}
                  />
                  <ImageCard
                    title="Rural"
                    description="Countryside & traditional settings"
                    image="https://images.unsplash.com/photo-1761245046201-c105d72341be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydXJhbCUyMGNvdW50cnlzaWRlJTIwd2VkZGluZ3xlbnwxfHx8fDE3Njc0NTE5NDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    selected={data.location === 'rural'}
                    onClick={() => setData({ ...data, location: 'rural' })}
                    features={[
                      'Scenic natural venues',
                      'Traditional temple halls',
                      'Open farmlands',
                      'Budget-friendly options'
                    ]}
                  />
                </div>
              </Section>

              {/* Wedding Season */}
              <Section 
                title="Wedding Season" 
                icon={Calendar}
                description="When is your special day?"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ImageCard
                    title="Jan – May (Peak Season)"
                    description="High demand with premium pricing"
                    image="https://images.unsplash.com/photo-1555089684-4446c3800547?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcHJpbmclMjB3ZWRkaW5nJTIwZmxvd2Vyc3xlbnwxfHx8fDE3Njc0NTE5NDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    selected={data.season === 'peak'}
                    onClick={() => setData({ ...data, season: 'peak' })}
                    features={[
                      'Perfect weather conditions',
                      'Most auspicious dates',
                      'Higher vendor availability',
                      '20-30% premium pricing'
                    ]}
                  />
                  <ImageCard
                    title="June – Dec (Non-Peak)"
                    description="Better availability & lower costs"
                    image="https://images.unsplash.com/photo-1766043373380-5837cd7da37c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW1tZXIlMjB3ZWRkaW5nJTIwY2VsZWJyYXRpb258ZW58MXx8fHwxNzY3NDUxOTQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    selected={data.season === 'non-peak'}
                    onClick={() => setData({ ...data, season: 'non-peak' })}
                    features={[
                      'More date flexibility',
                      'Better vendor discounts',
                      'Indoor venue preference',
                      'Cost-effective packages'
                    ]}
                  />
                </div>
              </Section>

              {/* Venue Type */}
              <Section 
                title="Venue Type" 
                icon={Building}
                description="Choose your celebration space"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ImageCard
                    title="Indoor"
                    description="Climate-controlled elegance"
                    image="https://images.unsplash.com/photo-1639135688894-aa8ece34d7a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvb3IlMjB3ZWRkaW5nJTIwYmFsbHJvb218ZW58MXx8fHwxNzY3NDUxOTQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    selected={data.venue === 'indoor'}
                    onClick={() => setData({ ...data, venue: 'indoor' })}
                    features={[
                      'Hotels & banquet halls',
                      'Weather-proof planning',
                      'Built-in amenities',
                      'Professional lighting & AC'
                    ]}
                  />
                  <ImageCard
                    title="Outdoor"
                    description="Natural beauty & open-air charm"
                    image="https://images.unsplash.com/photo-1762216444731-802dcf3da009?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwZ2FyZGVuJTIwd2VkZGluZ3xlbnwxfHx8fDE3Njc0MjgzNzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    selected={data.venue === 'outdoor'}
                    onClick={() => setData({ ...data, venue: 'outdoor' })}
                    features={[
                      'Gardens & beach venues',
                      'Natural photo backdrops',
                      'Tent & marquee setups',
                      'Unique atmosphere'
                    ]}
                  />
                </div>
              </Section>

              {/* Decoration Type */}
              <Section 
                title="Decoration Type" 
                icon={Sparkles}
                description="Set the perfect ambiance"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <ImageCard
                    title="Basic"
                    description="Simple & elegant touch"
                    image="https://images.unsplash.com/photo-1755811351169-0f4657e08911?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaW1wbGUlMjB3ZWRkaW5nJTIwZGVjb3JhdGlvbnxlbnwxfHx8fDE3Njc0NTE5NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    selected={data.decoration === 'basic'}
                    onClick={() => setData({ ...data, decoration: 'basic' })}
                    features={[
                      'Fresh flower arrangements',
                      'Basic stage setup',
                      'Simple table centerpieces',
                      'Minimal lighting'
                    ]}
                  />
                  <ImageCard
                    title="Standard"
                    description="Balanced style & budget"
                    image="https://images.unsplash.com/photo-1676853963956-0309922ebca1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwdGFibGUlMjBjZW50ZXJwaWVjZXxlbnwxfHx8fDE3Njc0NTE5NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    selected={data.decoration === 'standard'}
                    onClick={() => setData({ ...data, decoration: 'standard' })}
                    features={[
                      'Themed decorations',
                      'Enhanced stage design',
                      'Elegant table settings',
                      'Mood lighting'
                    ]}
                  />
                  <ImageCard
                    title="Luxury"
                    description="Premium & extravagant"
                    image="https://images.unsplash.com/photo-1724847664831-27b55fef3121?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3ZWRkaW5nJTIwZGVjb3JhdGlvbnxlbnwxfHx8fDE3Njc0NTE5NDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    selected={data.decoration === 'luxury'}
                    onClick={() => setData({ ...data, decoration: 'luxury' })}
                    features={[
                      'Designer floral arrangements',
                      'Grand stage & backdrop',
                      'Premium table decor',
                      'Advanced lighting systems'
                    ]}
                  />
                </div>
              </Section>

              {/* Photography Package */}
              <Section 
                title="Photography Package" 
                icon={Camera}
                description="Capture your precious memories"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ImageCard
                    title="Basic"
                    description="Essential coverage package"
                    image="https://images.unsplash.com/photo-1629120881990-0c5b979884bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwcGhvdG9ncmFwaGVyJTIwY2FtZXJhfGVufDF8fHx8MTc2NzM4ODAwM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    selected={data.photography === 'basic'}
                    onClick={() => setData({ ...data, photography: 'basic' })}
                    features={[
                      'Single photographer',
                      'Digital photo album',
                      'Edited images (300-400)',
                      'Online gallery access'
                    ]}
                  />
                  <ImageCard
                    title="Premium"
                    description="Comprehensive coverage"
                    image="https://images.unsplash.com/photo-1737756512868-c9bba3afba1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwdmlkZW9ncmFwaHl8ZW58MXx8fHwxNzY3MzY3MzI1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    selected={data.photography === 'premium'}
                    onClick={() => setData({ ...data, photography: 'premium' })}
                    features={[
                      'Team of 2-3 photographers',
                      'Cinematic videography',
                      'Premium album & prints',
                      'Drone footage included'
                    ]}
                  />
                </div>
              </Section>

              {/* Entertainment */}
              <Section 
                title="Entertainment" 
                icon={Music}
                description="Set the mood for celebration"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <ImageCard
                    title="Live Band"
                    description="Professional musicians"
                    image="https://images.unsplash.com/photo-1605004992659-832f10e0b374?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXZlJTIwYmFuZCUyMG11c2ljJTIwd2VkZGluZ3xlbnwxfHx8fDE3Njc0NTE5NDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    selected={data.entertainment === 'live-band'}
                    onClick={() => setData({ ...data, entertainment: 'live-band' })}
                    features={[
                      '5-8 member band',
                      'Live performance energy',
                      'Diverse music repertoire',
                      'Premium sound quality'
                    ]}
                  />
                  <ImageCard
                    title="DJ"
                    description="Modern curated experience"
                    image="https://images.unsplash.com/photo-1620704075906-27bfa0d54f3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaiUyMG11c2ljJTIwZXZlbnR8ZW58MXx8fHwxNzY3NDQ2MDYyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    selected={data.entertainment === 'dj'}
                    onClick={() => setData({ ...data, entertainment: 'dj' })}
                    features={[
                      'Professional DJ setup',
                      'Custom playlists',
                      'Lighting effects',
                      'Flexible music selection'
                    ]}
                  />
                  <ImageCard
                    title="Traditional Music"
                    description="Cultural authenticity"
                    image="https://images.unsplash.com/photo-1750224179573-6cb36565821a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMG11c2ljJTIwaW5zdHJ1bWVudHN8ZW58MXx8fHwxNzY3NDUxOTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    selected={data.entertainment === 'traditional'}
                    onClick={() => setData({ ...data, entertainment: 'traditional' })}
                    features={[
                      'Traditional instruments',
                      'Cultural music ensemble',
                      'Authentic experience',
                      'Heritage celebration'
                    ]}
                  />
                </div>
              </Section>

              {/* Guest Count */}
              <Section 
                title="Guest Count" 
                icon={Users}
                description="How many guests will attend?"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="max-w-3xl mx-auto"
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-lg group">
                    {/* Background Image */}
                    <div className="relative h-64 overflow-hidden">
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1765615192804-698d993bb61b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwZ3Vlc3RzJTIwY2VsZWJyYXRpb258ZW58MXx8fHwxNzY3NDI0NDUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                    </div>

                    {/* Input Card Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center p-8">
                      <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-xl p-8 shadow-2xl">
                        <div className="text-center mb-6">
                          <div className="inline-flex p-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 mb-4">
                            <Users className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="text-2xl mb-2">Enter Guest Count</h3>
                          <p className="text-muted-foreground">Number of expected attendees</p>
                        </div>

                        <div className="space-y-4">
                          <div className="relative">
                            <input
                              type="number"
                              min="1"
                              max="1000"
                              value={data.guestCount || ''}
                              onChange={(e) => setData({ ...data, guestCount: parseInt(e.target.value) || undefined })}
                              placeholder="e.g., 150"
                              className="w-full px-6 py-4 text-center text-2xl rounded-xl border-2 border-gray-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20 outline-none transition-all duration-300"
                            />
                          </div>

                          {/* Quick Select Options */}
                          <div className="grid grid-cols-3 gap-3">
                            <button
                              type="button"
                              onClick={() => setData({ ...data, guestCount: 100 })}
                              className={`py-2 px-4 rounded-lg border-2 transition-all duration-300 ${
                                data.guestCount === 100
                                  ? 'border-rose-500 bg-rose-50 text-rose-700'
                                  : 'border-gray-200 hover:border-rose-300 text-gray-600'
                              }`}
                            >
                              100
                            </button>
                            <button
                              type="button"
                              onClick={() => setData({ ...data, guestCount: 200 })}
                              className={`py-2 px-4 rounded-lg border-2 transition-all duration-300 ${
                                data.guestCount === 200
                                  ? 'border-rose-500 bg-rose-50 text-rose-700'
                                  : 'border-gray-200 hover:border-rose-300 text-gray-600'
                              }`}
                            >
                              200
                            </button>
                            <button
                              type="button"
                              onClick={() => setData({ ...data, guestCount: 300 })}
                              className={`py-2 px-4 rounded-lg border-2 transition-all duration-300 ${
                                data.guestCount === 300
                                  ? 'border-rose-500 bg-rose-50 text-rose-700'
                                  : 'border-gray-200 hover:border-rose-300 text-gray-600'
                              }`}
                            >
                              300
                            </button>
                          </div>

                          {/* Guest Range Info */}
                          <div className="pt-4 border-t border-gray-200">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="text-center">
                                <div className="text-gray-500">Intimate</div>
                                <div className="text-gray-700">50-100</div>
                              </div>
                              <div className="text-center">
                                <div className="text-gray-500">Medium</div>
                                <div className="text-gray-700">100-200</div>
                              </div>
                              <div className="text-center">
                                <div className="text-gray-500">Large</div>
                                <div className="text-gray-700">200-300</div>
                              </div>
                              <div className="text-center">
                                <div className="text-gray-500">Grand</div>
                                <div className="text-gray-700">300+</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Section>

              {/* Budget Input - NEW SECTION */}
              <Section 
                title="Your Budget" 
                icon={TrendingUp}
                description="What is your wedding budget?"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="max-w-3xl mx-auto"
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-lg group">
                    {/* Background Image */}
                    <div className="relative h-64 overflow-hidden">
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb25leSUyMGJ1ZGdldCUyMHdlZGRpbmd8ZW58MXx8fHwxNzM2Nzc4MDAwfDA&ixlib=rb-4.1.0&q=80&w=1080)' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                    </div>

                    {/* Input Card Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center p-8">
                      <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-xl p-8 shadow-2xl">
                        <div className="text-center mb-6">
                          <div className="inline-flex p-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 mb-4">
                            <TrendingUp className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="text-2xl mb-2">Enter Your Budget</h3>
                          <p className="text-muted-foreground">Total amount you plan to spend</p>
                        </div>

                        <div className="space-y-4">
                          <div className="relative">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl text-gray-500">₹</span>
                            <input
                              type="number"
                              min="100000"
                              max="50000000"
                              step="50000"
                              value={data.budget || ''}
                              onChange={(e) => setData({ ...data, budget: parseInt(e.target.value) || undefined })}
                              placeholder="e.g., 1500000"
                              className="w-full pl-12 pr-6 py-4 text-center text-2xl rounded-xl border-2 border-gray-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20 outline-none transition-all duration-300"
                            />
                          </div>

                          {/* Quick Select Options */}
                          <div className="grid grid-cols-3 gap-3">
                            <button
                              type="button"
                              onClick={() => setData({ ...data, budget: 500000 })}
                              className={`py-2 px-4 rounded-lg border-2 transition-all duration-300 ${
                                data.budget === 500000
                                  ? 'border-rose-500 bg-rose-50 text-rose-700'
                                  : 'border-gray-200 hover:border-rose-300 text-gray-600'
                              }`}
                            >
                              ₹5L
                            </button>
                            <button
                              type="button"
                              onClick={() => setData({ ...data, budget: 1000000 })}
                              className={`py-2 px-4 rounded-lg border-2 transition-all duration-300 ${
                                data.budget === 1000000
                                  ? 'border-rose-500 bg-rose-50 text-rose-700'
                                  : 'border-gray-200 hover:border-rose-300 text-gray-600'
                              }`}
                            >
                              ₹10L
                            </button>
                            <button
                              type="button"
                              onClick={() => setData({ ...data, budget: 2000000 })}
                              className={`py-2 px-4 rounded-lg border-2 transition-all duration-300 ${
                                data.budget === 2000000
                                  ? 'border-rose-500 bg-rose-50 text-rose-700'
                                  : 'border-gray-200 hover:border-rose-300 text-gray-600'
                              }`}
                            >
                              ₹20L
                            </button>
                          </div>

                          {/* Budget Range Info */}
                          <div className="pt-4 border-t border-gray-200">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="text-center">
                                <div className="text-gray-500">Budget</div>
                                <div className="text-gray-700">₹5-10L</div>
                              </div>
                              <div className="text-center">
                                <div className="text-gray-500">Mid-Range</div>
                                <div className="text-gray-700">₹10-20L</div>
                              </div>
                              <div className="text-center">
                                <div className="text-gray-500">Premium</div>
                                <div className="text-gray-700">₹20-30L</div>
                              </div>
                              <div className="text-center">
                                <div className="text-gray-500">Luxury</div>
                                <div className="text-gray-700">₹30L+</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Section>

              {/* Predict Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="sticky bottom-6 mt-12 flex justify-center z-40"
              >
                <button
                  onClick={handlePredict}
                  disabled={!isComplete || isLoading}
                  className={`
                    group relative px-12 py-4 rounded-full transition-all duration-300 shadow-lg
                    ${isComplete && !isLoading
                      ? 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/50 hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }
                  `}
                >
                  <span className="flex items-center gap-3">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Predicting...
                      </>
                    ) : (
                      <>
                        Predict Wedding Cost
                        <TrendingUp className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                </button>
              </motion.div>
            </motion.div>
          ) : (
            <ResultPage 
              cost={predictedCost!} 
              onReset={() => {
                setShowResult(false);
                setPredictedCost(null);
                setData({});
              }}
              onModify={() => {
                setShowResult(false);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Section({ 
  title, 
  icon: Icon, 
  description, 
  children 
}: { 
  title: string; 
  icon: React.ElementType; 
  description: string; 
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className="mb-16"
    >
      <div className="flex items-start gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 shadow-lg">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl mb-1">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </motion.section>
  );
}

function ImageCard({ 
  title, 
  description, 
  image,
  features,
  selected, 
  onClick
}: { 
  title: string; 
  description: string; 
  image: string;
  features: string[];
  selected: boolean; 
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative overflow-hidden rounded-2xl text-left transition-all duration-300 group
        ${selected 
          ? 'ring-4 ring-rose-500 ring-offset-2 shadow-2xl shadow-rose-500/30' 
          : 'shadow-md hover:shadow-xl'
        }
      `}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url(${image})` }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Selected Badge */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center shadow-lg"
            >
              <Check className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Title on Image */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white text-xl mb-1">{title}</h3>
          <p className="text-white/90 text-sm">{description}</p>
        </div>
      </div>

      {/* Features Section */}
      <div className={`
        p-5 bg-white transition-colors duration-300
        ${selected ? 'bg-rose-50' : 'group-hover:bg-gray-50'}
      `}>
        <div className="space-y-2.5">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-2"
            >
              <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${selected ? 'text-rose-500' : 'text-gray-400'}`} />
              <span className="text-sm text-gray-700">{feature}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Border Animation */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-pink-500"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: selected ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
}