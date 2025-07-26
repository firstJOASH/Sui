import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Ticket, MarketplaceListing } from "../types";
import api from "../utils/api";

export const useUserTickets = (userAddress: string) => {
  return useQuery({
    queryKey: ["userTickets", userAddress],
    queryFn: async (): Promise<Ticket[]> => {
      try {
        const response = await api.get(`/tickets/user/${userAddress}`);
        return response.data;
      } catch (error) {
        console.error("Failed to fetch user tickets:", error);
        throw error;
      }
    },
    enabled: !!userAddress,
  });
};

export const useMarketplaceListings = () => {
  return useQuery({
    queryKey: ["marketplaceListings"],
    queryFn: async (): Promise<MarketplaceListing[]> => {
      try {
        const response = await api.get("/marketplace/listings");
        return response.data;
      } catch (error) {
        console.error("Failed to fetch marketplace listings:", error);
        throw error;
      }
    },
  });
};

export const useBuyTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listingId: string) => {
      try {
        const response = await api.post(`/marketplace/buy/${listingId}`);
        return response.data;
      } catch (error) {
        console.error("Failed to buy ticket:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplaceListings"] });
      queryClient.invalidateQueries({ queryKey: ["userTickets"] });
    },
  });
};

export const useListTicketForSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ticketId,
      price,
      isAuction,
      auctionEndDate,
    }: {
      ticketId: string;
      price: number;
      isAuction: boolean;
      auctionEndDate?: string;
    }) => {
      try {
        const response = await api.post("/marketplace/list", {
          ticketId,
          price,
          isAuction,
          auctionEndDate,
        });
        return response.data;
      } catch (error) {
        console.error("Failed to list ticket for sale:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplaceListings"] });
      queryClient.invalidateQueries({ queryKey: ["userTickets"] });
    },
  });
};

export const useTransferTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ticketId,
      recipientAddress,
    }: {
      ticketId: string;
      recipientAddress: string;
    }) => {
      try {
        const response = await api.post(`/tickets/${ticketId}/transfer`, {
          recipientAddress,
        });
        return response.data;
      } catch (error) {
        console.error("Failed to transfer ticket:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userTickets"] });
    },
  });
};
