import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Event } from "../types";
import api from "../utils/api";

export const useEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: async (): Promise<Event[]> => {
      try {
        const response = await api.get("/events");
        return response.data;
      } catch (error) {
        console.error("Failed to fetch events:", error);
        throw error;
      }
    },
  });
};

// New hook to fetch events by organizer
export const useEventsByOrganizer = (organizerId: string | undefined) => {
  return useQuery({
    queryKey: ["events", "organizer", organizerId],
    queryFn: async (): Promise<Event[]> => {
      if (!organizerId) return [];

      try {
        const response = await api.get(`/events/organizer/${organizerId}`);
        return response.data;
      } catch (error) {
        console.error("Failed to fetch organizer events:", error);
        throw error;
      }
    },
    enabled: !!organizerId, // Only run query if organizerId exists
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      eventData: Omit<Event, "id" | "_id" | "createdAt" | "updatedAt" | "__v">
    ) => {
      try {
        const response = await api.post("/events", eventData);
        return response.data;
      } catch (error) {
        console.error("Failed to create event:", error);
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      // Invalidate both general events and organizer-specific events
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({
        queryKey: ["events", "organizer", variables.organizer],
      });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      eventData,
    }: {
      id: string;
      eventData: Partial<Event>;
    }) => {
      try {
        const response = await api.put(`/events/${id}`, eventData);
        return response.data;
      } catch (error) {
        console.error("Failed to update event:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      // Invalidate both general events and organizer-specific events
      queryClient.invalidateQueries({ queryKey: ["events"] });
      if (data.organizer) {
        queryClient.invalidateQueries({
          queryKey: ["events", "organizer", data.organizer],
        });
      }
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: string) => {
      try {
        await api.delete(`/events/${eventId}`);
        return eventId;
      } catch (error) {
        console.error("Failed to delete event:", error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate all event-related queries since we don't know the organizer here
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};
