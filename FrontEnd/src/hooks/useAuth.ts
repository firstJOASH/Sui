import { useState } from "react";
import { User, AuthResponse } from "../types";
import api from "../utils/api";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const registerUser = async (walletAddress: string): Promise<User> => {
    try {
      const response = await api.post("/users", { walletAddress });
      return response.data;
    } catch (error) {
      console.error("Failed to register user:", error);
      throw error;
    }
  };

  const loginUser = async (
    walletAddress: string,
    signature: string
  ): Promise<AuthResponse> => {
    try {
      const response = await api.post("/auth/login", {
        walletAddress,
        signature,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to login user:", error);
      throw error;
    }
  };

  const authenticateWallet = async (
    walletAddress: string
  ): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      // First try to register the user (in case they're new)
      try {
        await registerUser(walletAddress);
      } catch (error) {
        // User might already exist, continue with login
        console.log("User might already exist, proceeding with login");
      }

      // Generate a simple signature (in production, this should be a proper wallet signature)
      const signature = `auth_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // Login and get access token
      const authResponse = await loginUser(walletAddress, signature);

      // Store the access token
      localStorage.setItem("access_token", authResponse.access_token);
      localStorage.setItem("user", JSON.stringify(authResponse.user));

      return authResponse;
    } catch (error) {
      console.error("Authentication failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("wallet");
  };

  return {
    authenticateWallet,
    logout,
    isLoading,
  };
};
