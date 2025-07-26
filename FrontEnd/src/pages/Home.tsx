import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, Users, CheckCircle } from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Fraud Prevention',
      description: 'Blockchain-based verification eliminates counterfeit tickets and ensures authenticity.',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Zero Gas Fees',
      description: 'Buyers enjoy zero gas fees, making ticket purchases seamless and affordable.',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Dynamic Ticketing',
      description: 'Smart contracts enable dynamic pricing and automated ticket distribution.',
    },
  ];

  const benefits = [
    'Immutable ticket ownership records',
    'Instant transfers and resales',
    'Transparent pricing mechanisms',
    'Enhanced security through blockchain',
    'Global accessibility and reach',
    'Creator royalties on resales',
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
              <span className="block">REVOLUTIONIZING TICKETING</span>
              <span className="block text-blue-500 mt-2">WITH BLOCKCHAIN TECHNOLOGY</span>
            </h1>
            
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-16 max-w-5xl mx-auto leading-relaxed">
              Discover a groundbreaking NFT event ticket marketplace that combines security, 
              innovation, and user-centric design. Enjoy features like dynamic ticketing, 
              fraud prevention, and zero gas fees for buyers.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/events"
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-lg font-semibold text-lg flex items-center space-x-3 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
              >
                <span>Start Selling</span>
                <ArrowRight size={24} />
              </Link>
              <Link
                to="/marketplace"
                className="border-2 border-blue-600 text-blue-500 hover:bg-blue-600 hover:text-white px-10 py-5 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
              >
                Explore Marketplace
              </Link>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -right-40 w-96 h-96 bg-blue-600 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-blue-600 rounded-full opacity-10 blur-3xl"></div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-600 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Innovation Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              INNOVATIVE PLATFORM ARCHITECTURE
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Our platform leverages Sui's unique architecture to create a seamless ticketing experience. 
              Enjoy features designed to enhance security, accessibility, and user engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-black border border-gray-800 rounded-xl p-8 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="text-blue-500 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Revolutionary Marketplace Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                REVOLUTIONARY MARKETPLACE MECHANICS UNLEASHED
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Experience the future of event ticketing with our advanced NFT marketplace. 
                Built on cutting-edge blockchain technology, our platform offers unparalleled 
                security, transparency, and user experience.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border border-gray-800">
                <img
                  src="https://images.pexels.com/photos/7516366/pexels-photo-7516366.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="NFT Marketplace"
                  className="rounded-lg w-full h-64 object-cover mb-6"
                />
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">Active Listings</span>
                    <span className="text-blue-500 font-bold">1,247</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">Total Volume</span>
                    <span className="text-blue-500 font-bold">8,432 SUI</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">Events Live</span>
                    <span className="text-blue-500 font-bold">156</span>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-600 rounded-full opacity-20 blur-xl"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-600 rounded-full opacity-20 blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Future Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-8">
            DISCOVER THE FUTURE OF
            <span className="block text-blue-500 mt-2">EVENT TICKETING</span>
          </h2>
          <p className="text-lg text-gray-300 mb-12 max-w-3xl mx-auto">
            Join thousands of event creators and attendees who are already experiencing 
            the next generation of ticketing technology. Start your journey today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/events"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-105"
            >
              <span>Create Your Event</span>
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/marketplace"
              className="border border-blue-600 text-blue-500 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200"
            >
              Browse Events
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;