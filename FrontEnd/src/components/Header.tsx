"use client";

import type React from "react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Wallet, ChevronDown } from "lucide-react";
import { useWallet } from "../hooks/useWallet";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWalletDropdownOpen, setIsWalletDropdownOpen] = useState(false);
  const { wallet, connectWallet, disconnectWallet, isLoading } = useWallet();
  const location = useLocation();

  const navLinks = [
    { path: "/events", label: "Events", requiresWallet: true },
    { path: "/marketplace", label: "Marketplace", requiresWallet: false },
    { path: "/my-tickets", label: "My Tickets", requiresWallet: true },
  ];

  const walletOptions = [
    { name: "Sui Wallet", value: "sui" },
    { name: "Ethos", value: "ethos" },
    { name: "Suiet", value: "suiet" },
  ];

  const handleLinkClick = (requiresWallet: boolean, path: string) => {
    if (requiresWallet && !wallet.isConnected) {
      setIsWalletDropdownOpen(true);
      return false;
    }
    setIsMenuOpen(false);
    return true;
  };

  const truncateAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="bg-black border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-17 h-10 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src="/images/suipass-logo.png"
                alt="SuiPass Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-white font-bold text-xl bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              SuiPass
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <div key={link.path} className="relative">
                {link.requiresWallet && !wallet.isConnected ? (
                  <button
                    onClick={() => setIsWalletDropdownOpen(true)}
                    className={`text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors ${
                      location.pathname === link.path ? "text-blue-500" : ""
                    }`}
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    to={link.path}
                    className={`text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors ${
                      location.pathname === link.path ? "text-blue-500" : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Wallet Connection */}
          <div className="hidden md:block relative">
            {wallet.isConnected ? (
              <div className="relative">
                <button
                  onClick={() => setIsWalletDropdownOpen(!isWalletDropdownOpen)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200"
                >
                  <Wallet size={18} />
                  <span>{truncateAddress(wallet.address)}</span>
                  <ChevronDown size={16} />
                </button>

                {isWalletDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-lg py-1 z-10">
                    <div className="px-4 py-2 text-sm text-gray-400 border-b border-gray-700">
                      Connected to {wallet.walletType}
                    </div>
                    <button
                      onClick={() => {
                        disconnectWallet();
                        setIsWalletDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800"
                    >
                      Disconnect
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsWalletDropdownOpen(!isWalletDropdownOpen)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200"
                  disabled={isLoading}
                >
                  <Wallet size={18} />
                  <span>{isLoading ? "Connecting..." : "Connect Wallet"}</span>
                  <ChevronDown size={16} />
                </button>

                {isWalletDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-lg py-1 z-10">
                    {walletOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          connectWallet(option.value);
                          setIsWalletDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800"
                      >
                        {option.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800">
          <div className="px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <div key={link.path}>
                {link.requiresWallet && !wallet.isConnected ? (
                  <button
                    onClick={() => {
                      setIsWalletDropdownOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="block text-gray-300 hover:text-white py-2 text-base font-medium"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-gray-300 hover:text-white py-2 text-base font-medium"
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}

            <div className="pt-4 border-t border-gray-800">
              {wallet.isConnected ? (
                <div className="space-y-2">
                  <div className="text-sm text-gray-400">
                    {wallet.user?.username || "Connected"}:{" "}
                    {truncateAddress(wallet.address)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {wallet.user?.isEventOrganizer
                      ? "Event Organizer"
                      : "Attendee"}
                  </div>
                  <button
                    onClick={() => {
                      disconnectWallet();
                      setIsMenuOpen(false);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg w-full"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {walletOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        connectWallet(option.value);
                        setIsMenuOpen(false);
                      }}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg w-full"
                    >
                      Connect {option.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Backdrop for dropdowns */}
      {isWalletDropdownOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsWalletDropdownOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;
