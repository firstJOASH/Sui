"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Sparkles,
  X,
  Lightbulb,
  Calendar,
  MapPin,
  DollarSign,
  ImageIcon,
  Users,
  MessageSquare,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

interface AIEventAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onFormUpdate: (updates: any) => void;
  currentFormData: any;
}

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestions?: any;
}

interface AISuggestion {
  type:
    | "pricing"
    | "description"
    | "venue"
    | "datetime"
    | "marketing"
    | "seating";
  title: string;
  content: any;
  action?: () => void;
}

const AIEventAssistant: React.FC<AIEventAssistantProps> = ({
  isOpen,
  onClose,
  onFormUpdate,
  currentFormData,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Hi! I'm your AI Event Assistant. I can help you create amazing events with smart suggestions. What kind of event are you planning?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const aiFeatures = [
    {
      id: "auto-complete",
      icon: <Sparkles size={16} />,
      title: "Auto-Complete Form",
      description: "Fill form fields intelligently",
    },
    {
      id: "pricing",
      icon: <DollarSign size={16} />,
      title: "Pricing Suggestions",
      description: "Get optimal ticket pricing",
    },
    {
      id: "description",
      icon: <MessageSquare size={16} />,
      title: "Generate Description",
      description: "Create compelling event descriptions",
    },
    {
      id: "venue",
      icon: <MapPin size={16} />,
      title: "Venue Recommendations",
      description: "Find perfect venues",
    },
    {
      id: "datetime",
      icon: <Calendar size={16} />,
      title: "Optimal Timing",
      description: "Best dates and times",
    },
    {
      id: "seating",
      icon: <Users size={16} />,
      title: "Seating Chart",
      description: "Dynamic seating layouts",
    },
    {
      id: "marketing",
      icon: <Lightbulb size={16} />,
      title: "Marketing Copy",
      description: "Promotional content",
    },
    {
      id: "image",
      icon: <ImageIcon size={16} />,
      title: "Image Enhancement",
      description: "Generate and enhance images",
    },
  ];

  const generateAIResponse = async (userMessage: string, feature?: string) => {
    setIsLoading(true);

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    let response = "";
    let suggestions: AISuggestion[] = [];

    switch (feature) {
      case "auto-complete":
        response =
          "I'll help you auto-complete your event form. Based on your event type, here are my suggestions:";
        suggestions = generateAutoCompleteSuggestions();
        break;

      case "pricing":
        response =
          "Here are intelligent pricing suggestions based on your event details:";
        suggestions = generatePricingSuggestions();
        break;

      case "description":
        response = "I've generated compelling descriptions for your event:";
        suggestions = generateDescriptionSuggestions();
        break;

      case "venue":
        response = "Here are venue recommendations for your event:";
        suggestions = generateVenueSuggestions();
        break;

      case "datetime":
        response =
          "Based on your event type and target audience, here are optimal timing suggestions:";
        suggestions = generateDateTimeSuggestions();
        break;

      case "seating":
        response =
          "I've created dynamic seating chart suggestions for your event:";
        suggestions = generateSeatingChartSuggestions();
        break;

      case "marketing":
        response = "Here's compelling marketing copy for your event:";
        suggestions = generateMarketingCopySuggestions();
        break;

      case "image":
        response = "I can help enhance or generate images for your event:";
        suggestions = generateImageSuggestions();
        break;

      default:
        // General conversation
        if (
          userMessage.toLowerCase().includes("tech") ||
          userMessage.toLowerCase().includes("technology")
        ) {
          response =
            "Great! A technology event. I can help you create an engaging tech conference or meetup. Would you like me to suggest pricing, generate descriptions, or recommend venues?";
        } else if (
          userMessage.toLowerCase().includes("music") ||
          userMessage.toLowerCase().includes("concert")
        ) {
          response =
            "Awesome! A music event. I can help you plan the perfect concert or music festival. Let me know if you need help with venue acoustics, pricing tiers, or promotional content.";
        } else if (
          userMessage.toLowerCase().includes("business") ||
          userMessage.toLowerCase().includes("conference")
        ) {
          response =
            "Perfect! A business event. I can assist with professional networking events, conferences, or workshops. Would you like suggestions for pricing, venue layouts, or marketing strategies?";
        } else {
          response =
            "I understand you're planning an event. I can help with various aspects like pricing, descriptions, venue selection, optimal timing, and much more. What specific area would you like assistance with?";
        }
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      type: "assistant",
      content: response,
      timestamp: new Date(),
      suggestions: suggestions.length > 0 ? suggestions : undefined,
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(false);
  };

  const generateAutoCompleteSuggestions = (): AISuggestion[] => [
    {
      type: "description",
      title: "Complete Basic Info",
      content: {
        title: "Blockchain Innovation Summit 2025",
        description:
          "Join industry leaders for cutting-edge blockchain discussions",
        longDescription:
          "An immersive experience featuring keynote speakers, interactive workshops, and networking opportunities with blockchain pioneers.",
        category: "technology",
        tags: ["blockchain", "innovation", "networking", "technology"],
      },
      action: () =>
        onFormUpdate({
          title: "Blockchain Innovation Summit 2025",
          description:
            "Join industry leaders for cutting-edge blockchain discussions",
          longDescription:
            "An immersive experience featuring keynote speakers, interactive workshops, and networking opportunities with blockchain pioneers.",
          category: "technology",
          tags: ["blockchain", "innovation", "networking", "technology"],
        }),
    },
  ];

  const generatePricingSuggestions = (): AISuggestion[] => [
    {
      type: "pricing",
      title: "Tiered Pricing Strategy",
      content: {
        tiers: [
          {
            name: "Early Bird",
            price: 25,
            description: "Limited time offer",
            totalSupply: 100,
          },
          {
            name: "General Admission",
            price: 50,
            description: "Standard access",
            totalSupply: 200,
          },
          {
            name: "VIP Experience",
            price: 150,
            description: "Premium access + networking",
            totalSupply: 50,
          },
        ],
      },
      action: () =>
        onFormUpdate({
          ticketTiers: [
            {
              name: "Early Bird",
              price: 25,
              description: "Limited time offer with full event access",
              totalSupply: 100,
              benefits: ["Event access", "Welcome kit", "Early entry"],
              isActive: true,
            },
            {
              name: "General Admission",
              price: 50,
              description: "Standard event access",
              totalSupply: 200,
              benefits: ["Event access", "Lunch included", "Certificate"],
              isActive: true,
            },
            {
              name: "VIP Experience",
              price: 150,
              description: "Premium access with exclusive networking",
              totalSupply: 50,
              benefits: [
                "Priority seating",
                "VIP networking",
                "Speaker meet & greet",
                "Premium swag",
              ],
              isActive: true,
            },
          ],
        }),
    },
  ];

  const generateDescriptionSuggestions = (): AISuggestion[] => [
    {
      type: "description",
      title: "Compelling Event Description",
      content: {
        short:
          "Transform your understanding of blockchain technology at this immersive summit featuring industry pioneers and breakthrough innovations.",
        long: `🚀 **Blockchain Innovation Summit 2025**

Join us for an extraordinary journey into the future of decentralized technology. This premier event brings together visionary leaders, innovative startups, and blockchain enthusiasts for two days of groundbreaking insights.

**What to Expect:**
• Keynote presentations from industry titans
• Hands-on workshops with cutting-edge tools
• Exclusive networking with 500+ professionals
• Live demonstrations of breakthrough applications
• Panel discussions on regulatory landscapes

**Who Should Attend:**
Developers, entrepreneurs, investors, and anyone passionate about the blockchain revolution.

Don't miss this opportunity to be part of the conversation shaping tomorrow's digital economy!`,
      },
      action: () =>
        onFormUpdate({
          description:
            "Transform your understanding of blockchain technology at this immersive summit featuring industry pioneers and breakthrough innovations.",
          longDescription: `🚀 **Blockchain Innovation Summit 2025**

Join us for an extraordinary journey into the future of decentralized technology. This premier event brings together visionary leaders, innovative startups, and blockchain enthusiasts for two days of groundbreaking insights.

**What to Expect:**
• Keynote presentations from industry titans
• Hands-on workshops with cutting-edge tools
• Exclusive networking with 500+ professionals
• Live demonstrations of breakthrough applications
• Panel discussions on regulatory landscapes

**Who Should Attend:**
Developers, entrepreneurs, investors, and anyone passionate about the blockchain revolution.

Don't miss this opportunity to be part of the conversation shaping tomorrow's digital economy!`,
        }),
    },
  ];

  const generateVenueSuggestions = (): AISuggestion[] => [
    {
      type: "venue",
      title: "Perfect Venue Matches",
      content: {
        venues: [
          {
            name: "Tech Innovation Center",
            location: "San Francisco, CA",
            capacity: 500,
            features: ["High-speed WiFi", "AV Equipment", "Parking"],
            rating: 4.8,
          },
          {
            name: "Digital Conference Hall",
            location: "Austin, TX",
            capacity: 350,
            features: [
              "Live streaming setup",
              "Catering kitchen",
              "Breakout rooms",
            ],
            rating: 4.6,
          },
        ],
      },
      action: () =>
        onFormUpdate({
          venue: "Tech Innovation Center",
          location: "San Francisco, CA",
          maxAttendees: 500,
        }),
    },
  ];

  const generateDateTimeSuggestions = (): AISuggestion[] => [
    {
      type: "datetime",
      title: "Optimal Event Timing",
      content: {
        recommendations: [
          {
            date: "March 15-16, 2025",
            time: "9:00 AM - 6:00 PM",
            reason: "Peak conference season, high attendance expected",
            score: 95,
          },
          {
            date: "April 22-23, 2025",
            time: "10:00 AM - 5:00 PM",
            reason: "Good weather, no major competing events",
            score: 88,
          },
        ],
      },
      action: () => {
        const startDate = new Date("2025-03-15T09:00:00");
        const endDate = new Date("2025-03-16T18:00:00");
        onFormUpdate({
          startDate: startDate.toISOString().slice(0, 16),
          endDate: endDate.toISOString().slice(0, 16),
        });
      },
    },
  ];

  const generateSeatingChartSuggestions = (): AISuggestion[] => [
    {
      type: "seating",
      title: "Dynamic Seating Layouts",
      content: {
        layouts: [
          {
            name: "Theater Style",
            capacity: 500,
            description:
              "Traditional rows facing stage, optimal for presentations",
          },
          {
            name: "Networking Rounds",
            capacity: 350,
            description: "Round tables for 8-10 people, great for interaction",
          },
          {
            name: "Hybrid Layout",
            capacity: 400,
            description: "Mix of theater and networking areas",
          },
        ],
      },
    },
  ];

  const generateMarketingCopySuggestions = (): AISuggestion[] => [
    {
      type: "marketing",
      title: "Compelling Marketing Content",
      content: {
        headline: "🚀 The Future of Blockchain Starts Here",
        tagline: "Where Innovation Meets Opportunity",
        socialMedia: {
          twitter:
            "Ready to revolutionize your blockchain knowledge? Join 500+ innovators at #BlockchainSummit2025 🔗✨",
          linkedin:
            "Advance your career in blockchain technology. Network with industry leaders and discover breakthrough innovations.",
          instagram:
            "Two days. Endless possibilities. The blockchain revolution awaits. 🌟",
        },
        emailSubject: "Your Blockchain Future Starts March 15th ⚡",
        ctaButtons: [
          "Secure Your Spot",
          "Join the Revolution",
          "Transform Your Future",
        ],
      },
    },
  ];

  const generateImageSuggestions = (): AISuggestion[] => [
    {
      type: "marketing",
      title: "Image Enhancement Options",
      content: {
        suggestions: [
          "Generate futuristic blockchain-themed event banner",
          "Create professional speaker spotlight images",
          "Design social media promotional graphics",
          "Generate venue layout visualizations",
          "Create branded presentation templates",
        ],
      },
    },
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    await generateAIResponse(inputMessage, activeFeature);
    setActiveFeature(null);
  };

  const handleFeatureClick = async (featureId: string) => {
    setActiveFeature(featureId);
    const feature = aiFeatures.find((f) => f.id === featureId);

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: `Help me with ${feature?.title}`,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    await generateAIResponse(`Help me with ${feature?.title}`, featureId);
  };

  const applySuggestion = (suggestion: AISuggestion) => {
    if (suggestion.action) {
      suggestion.action();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <Bot className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                AI Event Assistant
              </h2>
              <p className="text-sm text-gray-400">
                Your intelligent event creation companion
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* AI Features Grid */}
        <div className="p-4 border-b border-gray-800">
          <div className="grid grid-cols-4 gap-2">
            {aiFeatures.map((feature) => (
              <button
                key={feature.id}
                onClick={() => handleFeatureClick(feature.id)}
                className={`p-3 rounded-lg border transition-all text-left ${
                  activeFeature === feature.id
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-gray-700 hover:border-gray-600 bg-gray-800"
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-blue-400">{feature.icon}</span>
                  <span className="text-white text-sm font-medium">
                    {feature.title}
                  </span>
                </div>
                <p className="text-xs text-gray-400">{feature.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.type === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-100"
                }`}
              >
                <ReactMarkdown>{message.content}</ReactMarkdown>

                {message.suggestions && (
                  <div className="mt-4 space-y-2">
                    {message.suggestions.map(
                      (suggestion: AISuggestion, index: number) => (
                        <div key={index} className="bg-gray-700 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-white">
                              {suggestion.title}
                            </h4>
                            {suggestion.action && (
                              <button
                                onClick={() => applySuggestion(suggestion)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                              >
                                Apply
                              </button>
                            )}
                          </div>
                          <div className="text-sm text-gray-300">
                            {typeof suggestion.content === "string" ? (
                              suggestion.content
                            ) : (
                              <pre className="whitespace-pre-wrap">
                                {JSON.stringify(suggestion.content, null, 2)}
                              </pre>
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 rounded-lg p-4 max-w-[80%]">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  <span className="text-gray-300">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-6 border-t border-gray-800">
          <div className="flex space-x-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask me anything about your event..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Send size={18} />
              <span>Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIEventAssistant;
