import React, { useState } from 'react';
import { QrCode, Send, ShoppingBag, Eye, Calendar, MapPin } from 'lucide-react';
import { useUserTickets, useTransferTicket, useListTicketForSale } from '../hooks/useTickets';
import { useWallet } from '../hooks/useWallet';
import LoadingSpinner from '../components/LoadingSpinner';
import { Ticket } from '../types';
import { toast } from 'react-toastify';

const MyTickets: React.FC = () => {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showResellModal, setShowResellModal] = useState(false);
  const [transferAddress, setTransferAddress] = useState('');
  const [resellPrice, setResellPrice] = useState('');

  const { wallet } = useWallet();
  const { data: tickets, isLoading } = useUserTickets(wallet.address);
  const transferTicketMutation = useTransferTicket();
  const listTicketMutation = useListTicketForSale();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleViewDetails = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  };

  const handleShowQR = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowQRModal(true);
  };

  const handleTransfer = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowTransferModal(true);
  };

  const handleResell = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowResellModal(true);
  };

  const executeTransfer = () => {
    if (!selectedTicket || !transferAddress) return;
    
    transferTicketMutation.mutate(
      {
        ticketId: selectedTicket.id,
        recipientAddress: transferAddress,
      },
      {
        onSuccess: () => {
          toast.success('Ticket transferred successfully!');
          setShowTransferModal(false);
          setTransferAddress('');
          setSelectedTicket(null);
        },
        onError: () => {
          toast.error('Failed to transfer ticket. Please try again.');
        },
      }
    );
  };

  const executeResell = () => {
    if (!selectedTicket || !resellPrice) return;
    
    listTicketMutation.mutate(
      {
        ticketId: selectedTicket.id,
        price: parseFloat(resellPrice),
        isAuction: false,
      },
      {
        onSuccess: () => {
          toast.success('Ticket listed for sale successfully!');
          setShowResellModal(false);
          setResellPrice('');
          setSelectedTicket(null);
        },
        onError: () => {
          toast.error('Failed to list ticket for sale. Please try again.');
        },
      }
    );
  };

  if (!wallet.isConnected) {
    return (
      <div className="min-h-screen bg-black px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-8">Connect Wallet Required</h1>
          <p className="text-gray-400">Please connect your wallet to view your tickets.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Tickets</h1>
          <p className="text-gray-400">Manage your NFT event tickets</p>
        </div>

        {/* Tickets Grid */}
        {isLoading ? (
          <LoadingSpinner className="py-20" />
        ) : tickets && tickets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1"
              >
                <img
                  src={ticket.event.image}
                  alt={ticket.event.name}
                  className="w-full h-48 object-cover"
                />
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {ticket.event.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {ticket.event.description}
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Calendar size={16} />
                      <span>{formatDate(ticket.event.date)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <MapPin size={16} />
                      <span>{ticket.event.location}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleShowQR(ticket)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                      >
                        <QrCode size={16} />
                        <span>QR Code</span>
                      </button>
                      <button
                        onClick={() => handleViewDetails(ticket)}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                      >
                        <Eye size={16} />
                        <span>Details</span>
                      </button>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleTransfer(ticket)}
                        className="flex-1 border border-blue-600 text-blue-500 hover:bg-blue-600 hover:text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                      >
                        <Send size={16} />
                        <span>Transfer</span>
                      </button>
                      <button
                        onClick={() => handleResell(ticket)}
                        className="flex-1 border border-green-600 text-green-500 hover:bg-green-600 hover:text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                      >
                        <ShoppingBag size={16} />
                        <span>Resell</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-gray-500 mb-4">
              <QrCode size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Tickets Found</h3>
            <p className="text-gray-400 mb-6">
              You don't own any tickets yet. Visit the marketplace to purchase tickets for exciting events.
            </p>
            <button
              onClick={() => window.location.href = '/marketplace'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Browse Marketplace
            </button>
          </div>
        )}

        {/* QR Code Modal */}
        {showQRModal && selectedTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Ticket QR Code</h2>
                <button
                  onClick={() => setShowQRModal(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="text-center">
                <div className="bg-white p-8 rounded-lg mb-4 inline-block">
                  <QrCode size={150} className="text-black" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {selectedTicket.event.name}
                </h3>
                <p className="text-gray-400 text-sm">
                  Show this QR code at the event entrance
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Transfer Modal */}
        {showTransferModal && selectedTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Transfer Ticket</h2>
                <button
                  onClick={() => setShowTransferModal(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {selectedTicket.event.name}
                </h3>
                <p className="text-gray-400 text-sm">
                  Transfer this ticket to another wallet address
                </p>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Recipient Address
                </label>
                <input
                  type="text"
                  value={transferAddress}
                  onChange={(e) => setTransferAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={executeTransfer}
                  disabled={!transferAddress || transferTicketMutation.isPending}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2 rounded-lg font-medium transition-colors"
                >
                  {transferTicketMutation.isPending ? 'Transferring...' : 'Transfer'}
                </button>
                <button
                  onClick={() => setShowTransferModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Resell Modal */}
        {showResellModal && selectedTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">List for Sale</h2>
                <button
                  onClick={() => setShowResellModal(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {selectedTicket.event.name}
                </h3>
                <p className="text-gray-400 text-sm">
                  Set your selling price for this ticket
                </p>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Price (SUI)
                </label>
                <input
                  type="number"
                  value={resellPrice}
                  onChange={(e) => setResellPrice(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={executeResell}
                  disabled={!resellPrice || parseFloat(resellPrice) <= 0 || listTicketMutation.isPending}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-2 rounded-lg font-medium transition-colors"
                >
                  {listTicketMutation.isPending ? 'Listing...' : 'List for Sale'}
                </button>
                <button
                  onClick={() => setShowResellModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {selectedTicket && !showQRModal && !showTransferModal && !showResellModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl p-6 w-full max-w-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Ticket Details</h2>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <img
                  src={selectedTicket.event.image}
                  alt={selectedTicket.event.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {selectedTicket.event.name}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    {selectedTicket.event.description}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Date:</span>
                    <div className="text-white">{formatDate(selectedTicket.event.date)}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Location:</span>
                    <div className="text-white">{selectedTicket.event.location}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Original Price:</span>
                    <div className="text-white">{selectedTicket.price} SUI</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Ticket ID:</span>
                    <div className="text-white font-mono">{selectedTicket.id}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTickets;