import React, { useState, useEffect } from 'react';
import { Lightbulb, Wand2, TrendingUp, MapPin, Calendar, DollarSign } from 'lucide-react';

interface SmartFormAssistantProps {
  formData: any;
  onSuggestionApply: (field: string, value: any) => void;
}

interface SmartSuggestion {
  field: string;
  type: 'auto-complete' | 'enhancement' | 'optimization';
  title: string;
  description: string;
  value: any;
  confidence: number;
  icon: React.ReactNode;
}

const SmartFormAssistant: React.FC<SmartFormAssistantProps> = ({
  formData,
  onSuggestionApply
}) => {
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    analyzeForms();
  }, [formData]);

  const analyzeForms = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newSuggestions: SmartSuggestion[] = [];

    // Auto-complete suggestions
    if (!formData.title || formData.title.length < 5) {
      newSuggestions.push({
        field: 'title',
        type: 'auto-complete',
        title: 'Smart Title Suggestion',
        description: 'Generate an engaging event title based on your category',
        value: generateSmartTitle(formData.category),
        confidence: 92,
        icon: <Wand2 size={16} className="text-purple-400" />
      });
    }

    // Pricing optimization
    if (formData.ticketTiers && formData.ticketTiers.length === 1) {
      newSuggestions.push({
        field: 'ticketTiers',
        type: 'optimization',
        title: 'Optimize Pricing Strategy',
        description: 'Add tiered pricing to increase revenue by 35%',
        value: generateOptimalPricing(formData.category),
        confidence: 88,
        icon: <TrendingUp size={16} className="text-green-400" />
      });
    }

    // Description enhancement
    if (!formData.longDescription || formData.longDescription.length < 100) {
      newSuggestions.push({
        field: 'longDescription',
        type: 'enhancement',
        title: 'Enhance Description',
        description: 'Create compelling content that converts 40% better',
        value: generateEnhancedDescription(formData),
        confidence: 95,
        icon: <Lightbulb size={16} className="text-yellow-400" />
      });
    }

    // Venue suggestions
    if (!formData.venue) {
      newSuggestions.push({
        field: 'venue',
        type: 'auto-complete',
        title: 'Venue Recommendations',
        description: 'Perfect venues for your event type and size',
        value: generateVenueSuggestions(formData.category, formData.maxAttendees),
        confidence: 85,
        icon: <MapPin size={16} className="text-blue-400" />
      });
    }

    // Date optimization
    if (!formData.startDate) {
      newSuggestions.push({
        field: 'startDate',
        type: 'optimization',
        title: 'Optimal Date Selection',
        description: 'Best dates for maximum attendance',
        value: generateOptimalDates(formData.category),
        confidence: 78,
        icon: <Calendar size={16} className="text-indigo-400" />
      });
    }

    setSuggestions(newSuggestions);
    setIsAnalyzing(false);
  };

  const generateSmartTitle = (category: string) => {
    const titles = {
      technology: 'Tech Innovation Summit 2025',
      music: 'Harmony Music Festival',
      business: 'Future Leaders Conference',
      sports: 'Championship Sports Gala',
      education: 'Knowledge Exchange Symposium',
      entertainment: 'Ultimate Entertainment Experience'
    };
    return titles[category as keyof typeof titles] || 'Amazing Event Experience';
  };

  const generateOptimalPricing = (category: string) => {
    const basePrices = {
      technology: { early: 45, general: 75, vip: 200 },
      music: { early: 35, general: 60, vip: 150 },
      business: { early: 55, general: 95, vip: 250 },
      sports: { early: 25, general: 45, vip: 120 },
      education: { early: 20, general: 35, vip: 80 },
      entertainment: { early: 30, general: 50, vip: 130 }
    };

    const prices = basePrices[category as keyof typeof basePrices] || basePrices.technology;

    return [
      {
        name: 'Early Bird',
        price: prices.early,
        description: 'Limited time special pricing',
        totalSupply: 100,
        benefits: ['Event access', 'Welcome kit', 'Priority entry'],
        isActive: true
      },
      {
        name: 'General Admission',
        price: prices.general,
        description: 'Standard event access',
        totalSupply: 250,
        benefits: ['Event access', 'Refreshments', 'Digital materials'],
        isActive: true
      },
      {
        name: 'VIP Experience',
        price: prices.vip,
        description: 'Premium access with exclusive perks',
        totalSupply: 50,
        benefits: ['Priority seating', 'VIP lounge', 'Meet & greet', 'Premium swag'],
        isActive: true
      }
    ];
  };

  const generateEnhancedDescription = (formData: any) => {
    const templates = {
      technology: `🚀 **${formData.title || 'Technology Event'}**

Join us for an extraordinary journey into the future of technology. This premier event brings together visionary leaders, innovative startups, and tech enthusiasts for an unforgettable experience.

**What Awaits You:**
• Keynote presentations from industry pioneers
• Hands-on workshops with cutting-edge technologies
• Exclusive networking with 500+ professionals
• Live demonstrations of breakthrough innovations
• Panel discussions on emerging trends

**Perfect For:**
Developers, entrepreneurs, investors, and anyone passionate about technological advancement.

Don't miss this opportunity to be part of the conversation shaping tomorrow's digital landscape!`,

      music: `🎵 **${formData.title || 'Music Event'}**

Experience an unforgettable musical journey featuring incredible artists and electrifying performances. This event promises to be a celebration of music, community, and pure entertainment.

**Event Highlights:**
• World-class performers and emerging artists
• State-of-the-art sound and lighting systems
• Food trucks and artisan vendors
• VIP experiences and meet & greets
• Instagram-worthy photo opportunities

**For Music Lovers:**
Whether you're a casual listener or a devoted fan, this event offers something special for everyone.

Get ready to dance, sing, and create memories that will last a lifetime!`,

      business: `💼 **${formData.title || 'Business Event'}**

Elevate your professional journey at this premier business gathering. Connect with industry leaders, discover new opportunities, and gain insights that will transform your career.

**Program Features:**
• Inspiring keynote speakers
• Interactive workshops and masterclasses
• Strategic networking sessions
• Industry trend presentations
• Career development opportunities

**Ideal For:**
Executives, entrepreneurs, professionals, and ambitious individuals ready to take their careers to the next level.

Invest in your future and join us for this transformative business experience!`
    };

    return templates[formData.category as keyof typeof templates] || templates.technology;
  };

  const generateVenueSuggestions = (category: string, maxAttendees: number) => {
    const venues = {
      technology: [
        'Innovation Hub Convention Center',
        'Tech Valley Conference Hall',
        'Digital Innovation Campus'
      ],
      music: [
        'Harmony Amphitheater',
        'Melody Concert Hall',
        'Rhythm Outdoor Venue'
      ],
      business: [
        'Executive Conference Center',
        'Business District Convention Hall',
        'Professional Development Institute'
      ]
    };

    const categoryVenues = venues[category as keyof typeof venues] || venues.technology;
    return categoryVenues[0]; // Return first suggestion
  };

  const generateOptimalDates = (category: string) => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days from now
    
    // Suggest weekends for entertainment, weekdays for business
    if (category === 'music' || category === 'entertainment') {
      // Find next Saturday
      const daysUntilSaturday = (6 - futureDate.getDay()) % 7;
      futureDate.setDate(futureDate.getDate() + daysUntilSaturday);
    } else {
      // Find next Tuesday (good for business events)
      const daysUntilTuesday = (2 - futureDate.getDay() + 7) % 7;
      futureDate.setDate(futureDate.getDate() + daysUntilTuesday);
    }

    return futureDate.toISOString().slice(0, 16);
  };

  if (suggestions.length === 0 && !isAnalyzing) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-lg p-4 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
          <Wand2 size={16} className="text-white" />
        </div>
        <h3 className="text-lg font-semibold text-white">Smart Suggestions</h3>
        {isAnalyzing && (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
        )}
      </div>

      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-purple-500/50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  {suggestion.icon}
                  <h4 className="font-medium text-white">{suggestion.title}</h4>
                  <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">
                    {suggestion.confidence}% match
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-3">{suggestion.description}</p>
                
                {suggestion.type === 'auto-complete' && typeof suggestion.value === 'string' && (
                  <div className="bg-gray-900 rounded p-2 text-sm text-gray-300 font-mono">
                    {suggestion.value}
                  </div>
                )}
                
                {suggestion.field === 'ticketTiers' && Array.isArray(suggestion.value) && (
                  <div className="space-y-2">
                    {suggestion.value.map((tier: any, tierIndex: number) => (
                      <div key={tierIndex} className="bg-gray-900 rounded p-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-medium">{tier.name}</span>
                          <span className="text-green-400">{tier.price} SUI</span>
                        </div>
                        <p className="text-gray-400 text-xs">{tier.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <button
                onClick={() => onSuggestionApply(suggestion.field, suggestion.value)}
                className="ml-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105"
              >
                Apply
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmartFormAssistant;