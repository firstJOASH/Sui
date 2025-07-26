import React, { useState } from 'react';
import { Calendar, MapPin, Search, Filter, ShoppingCart } from 'lucide-react';
import { useMarketplaceListings, useBuyTicket, useListTicketForSale } from '../hooks/useTickets';
import { useWallet } from '../hooks/useWallet';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

const Marketplace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [selectedListing, setSelectedListing] = useState<string | null>(null);

  const { data: listings, isLoading } = useMarketplaceListings();
  const { wallet } = useWallet();
  const buyTicketMutation = useBuyTicket();

  const handleBuyTicket = async (listingId: string) => {
    if (!wallet.isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setSelectedListing(listingId);
      await buyTicketMutation.mutateAsync(listingId);
      toast.success('Ticket purchased successfully!');
      setSelectedListing(null);
    } catch (error) {
      toast.error('Failed to purchase ticket');
      setSelectedListing(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredListings = listings?.filter(listing => {
    const matchesSearch = listing.ticket.event.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    let matchesPrice = true;
    if (priceFilter !== 'all') {
      if (priceFilter === 'low' && listing.price > 1) matchesPrice = false;
      if (priceFilter === 'medium' && (listing.price <= 1 || listing.price > 5)) matchesPrice = false;
      if (priceFilter === 'high' && listing.price <= 5) matchesPrice = false;
    }

    return matchesSearch && matchesPrice;
  }) || [];

  return (
    <div className="min-h-screen bg-black px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Marketplace</h1>
          <p className="text-gray-400">Buy and sell event tickets on the blockchain</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-800 rounded-lg mb-8 max-w-md">
          <button
            onClick={() => setActiveTab('buy')}
            className={`flex-1 px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'buy'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Buy Tickets
          </button>
          <button
            onClick={() => setActiveTab('sell')}
            className={`flex-1 px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'sell'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Sell Tickets
          </button>
        </div>

        {activeTab === 'buy' ? (
          <>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value as any)}
                  className="bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-8 py-2 text-white focus:outline-none focus:border-blue-500 appearance-none"
                >
                  <option value="all">All Prices</option>
                  <option value="low">Under 1 SUI</option>
                  <option value="medium">1-5 SUI</option>
                  <option value="high">Over 5 SUI</option>
                </select>
              </div>
            </div>

            {/* Listings Grid */}
            {isLoading ? (
              <LoadingSpinner className="py-20" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <img
                      src={listing.ticket.event.image}
                      alt={listing.ticket.event.name}
                      className="w-full h-48 object-cover"
                    />
                    
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {listing.ticket.event.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {listing.ticket.event.description}
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <Calendar size={16} />
                          <span>{formatDate(listing.ticket.event.date)}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <MapPin size={16} />
                          <span>{listing.ticket.event.location}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="text-sm text-gray-400">Seller</div>
                          <div className="text-sm text-white font-mono">
                            {listing.seller.slice(0, 6)}...{listing.seller.slice(-4)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-400">Price</div>
                          <div className="text-lg font-bold text-blue-500">
                            {listing.price} SUI
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleBuyTicket(listing.id)}
                        disabled={
                          buyTicketMutation.isPending || 
                          selectedListing === listing.id ||
                          !wallet.isConnected
                        }
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                      >
                        <ShoppingCart size={18} />
                        <span>
                          {selectedListing === listing.id
                            ? 'Processing...'
                            : !wallet.isConnected
                            ? 'Connect Wallet'
                            : 'Buy Now'
                          }
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredListings.length === 0 && (
              <div className="text-center py-20">
                <div className="text-gray-500 mb-4">
                  <ShoppingCart size={64} className="mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Tickets Found</h3>
                <p className="text-gray-400">
                  No tickets match your current search criteria. Try adjusting your filters.
                </p>
              </div>
            )}
          </>
        ) : (
          /* Sell Tickets Tab */
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Sell Your Tickets</h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                List your owned tickets for sale on the marketplace. Set your price and let others discover your tickets.
              </p>
              
              {!wallet.isConnected ? (
                <p className="text-yellow-500">Please connect your wallet to list tickets for sale.</p>
              ) : (
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <p className="text-gray-400 mb-4">
                    Go to "My Tickets" to list your owned tickets for sale.
                  </p>
                  <button
                    onClick={() => window.location.href = '/my-tickets'}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    View My Tickets
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;