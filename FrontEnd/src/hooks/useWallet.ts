import { useState, useEffect } from "react";
import { WalletConnection, User } from "../types";
import { useAuth } from "./useAuth";

export const useWallet = () => {
  const [wallet, setWallet] = useState<WalletConnection>({
    address: "",
    isConnected: false,
    walletType: "",
    user: undefined,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { authenticateWallet, logout: authLogout } = useAuth();

  const connectWallet = async (walletType: string) => {
    setIsLoading(true);
    try {
      // Mock wallet connection - in production, replace with actual Sui wallet integration
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockAddress = "0x" + Math.random().toString(16).substr(2, 40);

      // Authenticate with backend
      const authResponse = await authenticateWallet(mockAddress);

      setWallet({
        address: mockAddress,
        isConnected: true,
        walletType,
        user: authResponse.user,
      });

      localStorage.setItem(
        "wallet",
        JSON.stringify({
          address: mockAddress,
          isConnected: true,
          walletType,
          user: authResponse.user,
        })
      );
    } catch (error) {
      console.error("Wallet connection failed:", error);
      throw error;
    }
    setIsLoading(false);
  };

  const disconnectWallet = () => {
    authLogout();
    setWallet({
      address: "",
      isConnected: false,
      walletType: "",
      user: undefined,
    });
  };

  useEffect(() => {
    const savedWallet = localStorage.getItem("wallet");
    const savedUser = localStorage.getItem("user");
    const accessToken = localStorage.getItem("access_token");

    if (savedWallet && savedUser && accessToken) {
      try {
        const parsedWallet = JSON.parse(savedWallet);
        const parsedUser = JSON.parse(savedUser);
        setWallet({
          ...parsedWallet,
          user: parsedUser,
        });
      } catch (error) {
        console.error("Failed to parse saved wallet:", error);
        // Clear corrupted data
        localStorage.removeItem("wallet");
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
      }
    }
  }, []);

  return {
    wallet,
    connectWallet,
    disconnectWallet,
    isLoading,
  };
};
