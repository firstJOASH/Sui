"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Plus, Calendar, MapPin, Users, Edit, Trash2, Bot } from "lucide-react";
import {
  useEvents,
  useEventsByOrganizer,
  useCreateEvent,
  useDeleteEvent,
  useUpdateEvent,
} from "../hooks/useEvents";
import { useWallet } from "../hooks/useWallet";
import LoadingSpinner from "../components/LoadingSpinner";
import CloudinaryUpload from "../components/CloudinaryUpload";
import AIEventAssistant from "../components/AIEventAssistant";
import SmartFormAssistant from "../components/SmartFormAssistant";
import { toast } from "react-toastify";

interface CreateEventFormData {
  title: string;
  description: string;
  longDescription: string;
  category: string;
  tags: string[];
  startDate: string;
  endDate: string;
  location: string;
  venue: string;
  imageUrl: string;
  maxAttendees: number;
  ticketTiers: {
    name: string;
    price: number;
    description: string;
    totalSupply: number;
    benefits: string[];
    isActive: boolean;
  }[];
}

const Events: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [viewMode, setViewMode] = useState<"creator" | "attendee">("creator");
  const [formData, setFormData] = useState<CreateEventFormData>({
    title: "",
    description: "",
    longDescription: "",
    category: "technology",
    tags: [],
    startDate: "",
    endDate: "",
    location: "",
    venue: "",
    imageUrl: "",
    maxAttendees: 100,
    ticketTiers: [
      {
        name: "General Admission",
        price: 0,
        description: "Standard event access",
        totalSupply: 100,
        benefits: ["Event access"],
        isActive: true,
      },
    ],
  });

  const [showEditForm, setShowEditForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);

  const { wallet } = useWallet();
  const { data: allEvents, isLoading: isLoadingAllEvents } = useEvents();
  const { data: createdEvents, isLoading: isLoadingCreatedEvents } =
    useEventsByOrganizer(wallet.user?.id);
  const createEventMutation = useCreateEvent();
  const deleteEventMutation = useDeleteEvent();
  const updateEventMutation = useUpdateEvent();

  // Debug logging
  useEffect(() => {
    console.log("Wallet state:", {
      isConnected: wallet.isConnected,
      user: wallet.user,
      address: wallet.address,
    });
  }, [wallet]);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Create event triggered");
    console.log("Form data:", formData);
    console.log("Wallet user:", wallet.user);

    // Enhanced validation
    if (!wallet.isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!wallet.user?.id) {
      toast.error("Please authenticate your wallet connection");
      return;
    }

    // Validate required fields
    const requiredFields = [
      "title",
      "description",
      "longDescription",
      "startDate",
      "endDate",
      "location",
      "venue",
    ];
    const missingFields = requiredFields.filter(
      (field) => !formData[field as keyof CreateEventFormData]
    );

    if (missingFields.length > 0) {
      toast.error(
        `Please fill in all required fields: ${missingFields.join(", ")}`
      );
      return;
    }

    if (!formData.imageUrl) {
      toast.error("Please upload an event image");
      return;
    }

    // Validate dates
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const now = new Date();

    if (startDate <= now) {
      toast.error("Start date must be in the future");
      return;
    }

    if (endDate <= startDate) {
      toast.error("End date must be after start date");
      return;
    }

    // Validate ticket tiers
    const validTiers = formData.ticketTiers.filter(
      (tier) => tier.name.trim() && tier.totalSupply > 0
    );

    if (validTiers.length === 0) {
      toast.error("Please add at least one valid ticket tier");
      return;
    }

    try {
      console.log("Submitting event data:", {
        ...formData,
        organizer: wallet.user.id,
        ticketTiers: validTiers,
      });

      const result = await createEventMutation.mutateAsync({
        ...formData,
        organizer: wallet.user.id,
        ticketTiers: validTiers,
      });

      console.log("Event created successfully:", result);
      toast.success("Event created successfully!");

      // Reset form
      setShowCreateForm(false);
      setFormData({
        title: "",
        description: "",
        longDescription: "",
        category: "technology",
        tags: [],
        startDate: "",
        endDate: "",
        location: "",
        venue: "",
        imageUrl: "",
        maxAttendees: 100,
        ticketTiers: [
          {
            name: "General Admission",
            price: 0,
            description: "Standard event access",
            totalSupply: 100,
            benefits: ["Event access"],
            isActive: true,
          },
        ],
      });
    } catch (error) {
      console.error("Failed to create event:", error);

      // More detailed error handling
      if (error instanceof Error) {
        toast.error(`Failed to create event: ${error.message}`);
      } else if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        const apiError = error as any;
        const errorMessage =
          apiError.response?.data?.message ||
          apiError.response?.data?.error ||
          "Unknown API error";
        toast.error(`API Error: ${errorMessage}`);
      } else {
        toast.error("Failed to create event. Please try again.");
      }
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEventMutation.mutateAsync(eventId);
        toast.success("Event deleted successfully!");
      } catch (error) {
        console.error("Failed to delete event:", error);
        toast.error("Failed to delete event. Please try again.");
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const newValue = type === "number" ? Number.parseFloat(value) || 0 : value;

    console.log(`Input change - ${name}: ${newValue}`);

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    console.log("Tags updated:", tags);
    setFormData((prev) => ({ ...prev, tags }));
  };

  const handleTicketTierChange = (index: number, field: string, value: any) => {
    console.log(`Ticket tier ${index} - ${field}: ${value}`);
    setFormData((prev) => ({
      ...prev,
      ticketTiers: prev.ticketTiers.map((tier, i) =>
        i === index ? { ...tier, [field]: value } : tier
      ),
    }));
  };

  const addTicketTier = () => {
    console.log("Adding new ticket tier");
    setFormData((prev) => ({
      ...prev,
      ticketTiers: [
        ...prev.ticketTiers,
        {
          name: "",
          price: 0,
          description: "",
          totalSupply: 0,
          benefits: [""],
          isActive: true,
        },
      ],
    }));
  };

  const removeTicketTier = (index: number) => {
    if (formData.ticketTiers.length > 1) {
      console.log(`Removing ticket tier ${index}`);
      setFormData((prev) => ({
        ...prev,
        ticketTiers: prev.ticketTiers.filter((_, i) => i !== index),
      }));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleEditEvent = (event: any) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      longDescription: event.longDescription,
      category: event.category,
      tags: event.tags || [],
      startDate: event.startDate.slice(0, 16),
      endDate: event.endDate.slice(0, 16),
      location: event.location,
      venue: event.venue,
      imageUrl: event.imageUrl,
      maxAttendees: event.maxAttendees,
      ticketTiers: event.ticketTiers || [
        {
          name: "General Admission",
          price: 0,
          description: "Standard event access",
          totalSupply: 100,
          benefits: ["Event access"],
          isActive: true,
        },
      ],
    });
    setShowEditForm(true);
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingEvent) return;

    // Clean and prepare the data for API
    const cleanedData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      longDescription: formData.longDescription.trim(),
      category: formData.category,
      tags: formData.tags.filter((tag) => tag.trim() !== ""),
      startDate: formData.startDate,
      endDate: formData.endDate,
      location: formData.location.trim(),
      venue: formData.venue.trim(),
      imageUrl: formData.imageUrl,
      maxAttendees: Number(formData.maxAttendees),
      ticketTiers: formData.ticketTiers
        .filter((tier) => tier.name.trim() && tier.totalSupply > 0)
        .map((tier) => ({
          name: tier.name.trim(),
          price: Number(tier.price),
          description: tier.description.trim(),
          totalSupply: Number(tier.totalSupply),
          benefits: tier.benefits.filter((benefit) => benefit.trim() !== ""),
          isActive: Boolean(tier.isActive),
        })),
    };

    console.log("Updating event:", {
      id: editingEvent._id || editingEvent.id,
      cleanedData: cleanedData,
    });

    try {
      const result = await updateEventMutation.mutateAsync({
        id: editingEvent._id || editingEvent.id,
        eventData: cleanedData,
      });

      console.log("Event updated successfully:", result);
      toast.success("Event updated successfully!");
      setShowEditForm(false);
      setEditingEvent(null);

      // Reset form data
      setFormData({
        title: "",
        description: "",
        longDescription: "",
        category: "technology",
        tags: [],
        startDate: "",
        endDate: "",
        location: "",
        venue: "",
        imageUrl: "",
        maxAttendees: 100,
        ticketTiers: [
          {
            name: "General Admission",
            price: 0,
            description: "Standard event access",
            totalSupply: 100,
            benefits: ["Event access"],
            isActive: true,
          },
        ],
      });
    } catch (error) {
      console.error("Failed to update event:", error);

      // Enhanced error handling
      if (error instanceof Error) {
        toast.error(`Failed to update event: ${error.message}`);
      } else if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        const apiError = error as any;
        const errorMessage =
          apiError.response?.data?.message ||
          apiError.response?.data?.error ||
          "Unknown API error";
        const statusCode = apiError.response?.status;
        const errorDetails =
          apiError.response?.data?.details ||
          apiError.response?.data?.errors ||
          {};

        console.log("API Error Details:", {
          status: statusCode,
          message: errorMessage,
          details: errorDetails,
          fullResponse: apiError.response?.data,
        });

        toast.error(`API Error (${statusCode}): ${errorMessage}`);

        // Show specific field errors if available
        if (errorDetails && typeof errorDetails === "object") {
          Object.entries(errorDetails).forEach(([field, message]) => {
            toast.error(`${field}: ${message}`);
          });
        }
      } else {
        toast.error("Failed to update event. Please try again.");
      }
    }
  };

  // Use the fetched created events directly from the API
  const myCreatedEvents = createdEvents || [];
  // Filter attending events (events where user is not the organizer)
  const attendingEvents =
    allEvents?.filter((event) => event.organizer !== wallet.user?.id) || [];

  // Determine loading state based on current view
  const isLoading =
    viewMode === "creator" ? isLoadingCreatedEvents : isLoadingAllEvents;

  if (!wallet.isConnected) {
    return (
      <div className="min-h-screen bg-black px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-8">
            Connect Wallet Required
          </h1>
          <p className="text-gray-400">
            Please connect your wallet to access the Events page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Events</h1>
            <p className="text-gray-400">
              Manage your events and discover new ones
            </p>
          </div>

          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <div className="flex bg-gray-800 rounded-lg">
              <button
                onClick={() => setViewMode("creator")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === "creator"
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Created Events ({myCreatedEvents.length})
              </button>
              <button
                onClick={() => setViewMode("attendee")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === "attendee"
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Attending Events
              </button>
            </div>

            {viewMode === "creator" && (
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAIAssistant(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all transform hover:scale-105"
                >
                  <Bot size={18} />
                  <span>AI Assistant</span>
                </button>
                <button
                  onClick={() => {
                    console.log("Create event button clicked");
                    setShowCreateForm(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Plus size={18} />
                  <span>Create Event</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Create Event Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-gray-900 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto my-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">
                  Create New Event
                </h2>
                <button
                  onClick={() => {
                    console.log("Closing create form");
                    setShowCreateForm(false);
                  }}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleCreateEvent} className="space-y-4">
                <SmartFormAssistant
                  formData={formData}
                  onSuggestionApply={(field, value) => {
                    console.log(`Applying suggestion for ${field}:`, value);
                    setFormData((prev) => ({ ...prev, [field]: value }));
                  }}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Event Name *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter event name"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Short Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    placeholder="Brief description of your event"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Long Description *
                  </label>
                  <textarea
                    name="longDescription"
                    value={formData.longDescription}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    placeholder="Detailed description of your event"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="technology">Technology</option>
                      <option value="music">Music</option>
                      <option value="sports">Sports</option>
                      <option value="business">Business</option>
                      <option value="education">Education</option>
                      <option value="entertainment">Entertainment</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.tags.join(", ")}
                      onChange={handleTagsChange}
                      placeholder="blockchain, nft, tech"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Start Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                      min={new Date().toISOString().slice(0, 16)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      End Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required
                      min={
                        formData.startDate ||
                        new Date().toISOString().slice(0, 16)
                      }
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      placeholder="City, Country"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Venue *
                    </label>
                    <input
                      type="text"
                      name="venue"
                      value={formData.venue}
                      onChange={handleInputChange}
                      required
                      placeholder="Venue name or address"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Max Attendees
                  </label>
                  <input
                    type="number"
                    name="maxAttendees"
                    value={formData.maxAttendees}
                    onChange={handleInputChange}
                    min="1"
                    required
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Ticket Tiers */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-medium text-gray-300">
                      Ticket Tiers *
                    </label>
                    <button
                      type="button"
                      onClick={addTicketTier}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Add Tier
                    </button>
                  </div>

                  {formData.ticketTiers.map((tier, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 p-4 rounded-lg mb-4"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-white font-medium">
                          Tier {index + 1}
                        </h4>
                        {formData.ticketTiers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTicketTier(index)}
                            className="text-red-500 hover:text-red-400"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <input
                          type="text"
                          placeholder="Tier name *"
                          value={tier.name}
                          onChange={(e) =>
                            handleTicketTierChange(
                              index,
                              "name",
                              e.target.value
                            )
                          }
                          className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                        />
                        <input
                          type="number"
                          placeholder="Price (SUI)"
                          value={tier.price}
                          onChange={(e) =>
                            handleTicketTierChange(
                              index,
                              "price",
                              Number.parseFloat(e.target.value) || 0
                            )
                          }
                          min="0"
                          step="0.01"
                          className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <input
                          type="number"
                          placeholder="Total supply *"
                          value={tier.totalSupply}
                          onChange={(e) =>
                            handleTicketTierChange(
                              index,
                              "totalSupply",
                              Number.parseInt(e.target.value) || 0
                            )
                          }
                          min="1"
                          className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                        />
                        <input
                          type="text"
                          placeholder="Benefits (comma separated)"
                          value={tier.benefits.join(", ")}
                          onChange={(e) =>
                            handleTicketTierChange(
                              index,
                              "benefits",
                              e.target.value
                                .split(",")
                                .map((b) => b.trim())
                                .filter((b) => b)
                            )
                          }
                          className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <textarea
                        placeholder="Tier description"
                        value={tier.description}
                        onChange={(e) =>
                          handleTicketTierChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        rows={2}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Event Image *
                  </label>
                  <CloudinaryUpload
                    onImageUpload={(imageUrl) => {
                      console.log("Image uploaded:", imageUrl);
                      setFormData((prev) => ({ ...prev, imageUrl }));
                    }}
                    currentImage={formData.imageUrl}
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    disabled={createEventMutation.isPending}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 rounded-lg font-medium transition-colors"
                  >
                    {createEventMutation.isPending
                      ? "Creating..."
                      : "Create Event"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    disabled={createEventMutation.isPending}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white py-2 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Event Form Modal */}
        {showEditForm && editingEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-gray-900 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto my-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Edit Event</h2>
                <button
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingEvent(null);
                  }}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleUpdateEvent} className="space-y-4">
                {/* Use the same form fields as create event form */}
                <SmartFormAssistant
                  formData={formData}
                  onSuggestionApply={(field, value) => {
                    setFormData((prev) => ({ ...prev, [field]: value }));
                  }}
                />

                {/* All the same form fields as in create event modal */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Event Name *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter event name"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Add all other form fields here - same as create form */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Short Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      placeholder="Brief description of your event"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Long Description *
                    </label>
                    <textarea
                      name="longDescription"
                      value={formData.longDescription}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      placeholder="Detailed description of your event"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="technology">Technology</option>
                      <option value="music">Music</option>
                      <option value="sports">Sports</option>
                      <option value="business">Business</option>
                      <option value="education">Education</option>
                      <option value="entertainment">Entertainment</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.tags.join(", ")}
                      onChange={handleTagsChange}
                      placeholder="blockchain, nft, tech"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Start Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                      min={new Date().toISOString().slice(0, 16)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      End Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required
                      min={
                        formData.startDate ||
                        new Date().toISOString().slice(0, 16)
                      }
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      placeholder="City, Country"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Venue *
                    </label>
                    <input
                      type="text"
                      name="venue"
                      value={formData.venue}
                      onChange={handleInputChange}
                      required
                      placeholder="Venue name or address"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Max Attendees
                  </label>
                  <input
                    type="number"
                    name="maxAttendees"
                    value={formData.maxAttendees}
                    onChange={handleInputChange}
                    min="1"
                    required
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Ticket Tiers */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-medium text-gray-300">
                      Ticket Tiers *
                    </label>
                    <button
                      type="button"
                      onClick={addTicketTier}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Add Tier
                    </button>
                  </div>

                  {formData.ticketTiers.map((tier, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 p-4 rounded-lg mb-4"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-white font-medium">
                          Tier {index + 1}
                        </h4>
                        {formData.ticketTiers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTicketTier(index)}
                            className="text-red-500 hover:text-red-400"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <input
                          type="text"
                          placeholder="Tier name *"
                          value={tier.name}
                          onChange={(e) =>
                            handleTicketTierChange(
                              index,
                              "name",
                              e.target.value
                            )
                          }
                          className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                        />
                        <input
                          type="number"
                          placeholder="Price (SUI)"
                          value={tier.price}
                          onChange={(e) =>
                            handleTicketTierChange(
                              index,
                              "price",
                              Number.parseFloat(e.target.value) || 0
                            )
                          }
                          min="0"
                          step="0.01"
                          className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <input
                          type="number"
                          placeholder="Total supply *"
                          value={tier.totalSupply}
                          onChange={(e) =>
                            handleTicketTierChange(
                              index,
                              "totalSupply",
                              Number.parseInt(e.target.value) || 0
                            )
                          }
                          min="1"
                          className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                        />
                        <input
                          type="text"
                          placeholder="Benefits (comma separated)"
                          value={tier.benefits.join(", ")}
                          onChange={(e) =>
                            handleTicketTierChange(
                              index,
                              "benefits",
                              e.target.value
                                .split(",")
                                .map((b) => b.trim())
                                .filter((b) => b)
                            )
                          }
                          className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <textarea
                        placeholder="Tier description"
                        value={tier.description}
                        onChange={(e) =>
                          handleTicketTierChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        rows={2}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Event Image *
                  </label>
                  <CloudinaryUpload
                    onImageUpload={(imageUrl) => {
                      console.log("Image uploaded:", imageUrl);
                      setFormData((prev) => ({ ...prev, imageUrl }));
                    }}
                    currentImage={formData.imageUrl}
                  />
                </div>
                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"
                  >
                    Update Event
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditForm(false);
                      setEditingEvent(null);
                    }}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* AI Event Assistant */}
        <AIEventAssistant
          isOpen={showAIAssistant}
          onClose={() => setShowAIAssistant(false)}
          onFormUpdate={(updates) => {
            setFormData((prev) => ({ ...prev, ...updates }));
            setShowAIAssistant(false);
            setShowCreateForm(true);
          }}
          currentFormData={formData}
        />

        {/* Events Grid */}
        {isLoading ? (
          <LoadingSpinner className="py-20" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(viewMode === "creator" ? myCreatedEvents : attendingEvents).map(
              (event: any) => (
                <div
                  key={event.id || event._id}
                  className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <img
                    src={event.imageUrl || "/placeholder.svg"}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />

                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {event.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Calendar size={16} />
                        <span>{formatDate(event.startDate)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <MapPin size={16} />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Users size={16} />
                        <span>
                          {event.totalAttendees || 0} / {event.maxAttendees}{" "}
                          attendees
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-blue-500">
                        {event.ticketTiers && event.ticketTiers.length > 0
                          ? `From ${Math.min(
                              ...event.ticketTiers.map((t: any) => t.price)
                            )} SUI`
                          : "Free"}
                      </div>

                      {viewMode === "creator" && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditEvent(event)}
                            className="text-blue-500 hover:text-blue-400 p-2"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteEvent(event._id || event.id)
                            }
                            className="text-red-500 hover:text-red-400 p-2"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* Empty State */}
        {!isLoading &&
          (viewMode === "creator" ? myCreatedEvents : attendingEvents)
            .length === 0 && (
            <div className="text-center py-20">
              <div className="text-gray-500 mb-4">
                <Calendar size={64} className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {viewMode === "creator"
                  ? "No Events Created"
                  : "No Events Attended"}
              </h3>
              <p className="text-gray-400 mb-6">
                {viewMode === "creator"
                  ? "Create your first event to get started with selling tickets."
                  : "Browse the marketplace to find exciting events to attend."}
              </p>
              {viewMode === "creator" && (
                <button
                  onClick={() => setShowAIAssistant(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 flex items-center space-x-2"
                >
                  <Bot size={20} />
                  <span>Get AI Help to Create Event</span>
                </button>
              )}
            </div>
          )}
      </div>
    </div>
  );
};

export default Events;
