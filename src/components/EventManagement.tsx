import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, MapPin, Users, Edit2, Trash2, X } from 'lucide-react';
import EventDashboard from './EventDashboard';
import { corsApiClient } from '../services/CorsApiClient';

interface EventCreateResponse {
  message: string;
}

interface ApiEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  maxParticipants: number;
  categoryName: string;
  registeredCount: number;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  maxParticipants: number;
  currentParticipants: number;
  category: 'workshop' | 'networking' | 'presentation' | 'competition' | string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  maxParticipants: number;
  category: 'workshop' | 'networking' | 'presentation' | 'competition' | 'other';
  customCategory: string;
}

const EventManagement: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'AI/ML Workshop',
      description: 'Learn the fundamentals of machine learning and AI development',
      date: '2025-03-16',
      time: '14:00',
      location: 'Workshop Room A',
      maxParticipants: 30,
      currentParticipants: 25,
      category: 'workshop',
      status: 'upcoming'
    },
    {
      id: '2',
      title: 'Networking Session',
      description: 'Connect with industry professionals and fellow participants',
      date: '2025-03-16',
      time: '19:00',
      location: 'Main Hall',
      maxParticipants: 100,
      currentParticipants: 78,
      category: 'networking',
      status: 'upcoming'
    },
    {
      id: '3',
      title: 'Final Presentations',
      description: 'Project demos and judging for all teams',
      date: '2025-03-17',
      time: '14:00',
      location: 'Auditorium',
      maxParticipants: 200,
      currentParticipants: 156,
      category: 'presentation',
      status: 'upcoming'
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [apiError, setApiError] = useState<string>('');
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [hasLoadedFromAPI, setHasLoadedFromAPI] = useState(false);
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    maxParticipants: 10,
    category: 'workshop',
    customCategory: ''
  });

  // Fetch events from API
  const fetchEventsFromAPI = async () => {
    setIsLoadingEvents(true);
    setApiError('');
    
    try {
      // Get authentication token
      const token = localStorage.getItem('adminToken') || localStorage.getItem('authToken');
      
      if (!token) {
        setApiError('Authentication required. Please log in to view events.');
        setIsLoadingEvents(false);
        return;
      }

      // Always try proxy route first to avoid CORS issues
      let response = await corsApiClient.get<ApiEvent[]>('/api/events/with-registration-count', { token });
      
      // If proxy fails, try direct API as fallback
      if (!response.success && response.error?.includes('Proxy connection failed')) {
        console.log('Proxy failed, trying direct API call:', response.error);
        try {
          response = await corsApiClient.get<ApiEvent[]>('/events/with-registration-count', { token });
        } catch (directError) {
          console.log('Direct API also failed:', directError);
          // Keep the proxy error response
        }
      }

      if (response.success && response.data) {
        // Transform API events to local Event format
        const transformedEvents: Event[] = response.data.map((apiEvent: ApiEvent) => ({
          id: apiEvent.id.toString(),
          title: apiEvent.title,
          description: apiEvent.description,
          date: apiEvent.date,
          time: apiEvent.time.substring(0, 5), // Convert "09:00:00" to "09:00"
          location: apiEvent.location,
          maxParticipants: apiEvent.maxParticipants,
          currentParticipants: apiEvent.registeredCount,
          category: apiEvent.categoryName,
          status: 'upcoming' as const // Default status, could be enhanced with API data
        }));
        
        setEvents(transformedEvents);
        setHasLoadedFromAPI(true);
        console.log('Successfully loaded', transformedEvents.length, 'events from API');
      } else {
        setApiError(response.error || 'Failed to fetch events');
      }
    } catch (error: any) {
      console.error('Events fetch error:', error);
      if (error.message?.includes('CORS') || error.message?.includes('ERR_FAILED')) {
        setApiError('Connection failed. Please check if the server allows requests from this domain.');
      } else if (error.response?.status === 401) {
        setApiError('Authentication failed. Please log in again.');
      } else {
        setApiError(error.message || 'Failed to fetch events. Please try again.');
      }
    } finally {
      setIsLoadingEvents(false);
    }
  };

  // Load events when component mounts
  useEffect(() => {
    fetchEventsFromAPI();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'maxParticipants' ? parseInt(value) || 10 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    
    const finalCategory = formData.category === 'other' ? formData.customCategory : formData.category;
    const { customCategory, ...eventDataWithoutCustom } = formData;
    const eventData = {
      ...eventDataWithoutCustom,
      category: finalCategory
    };

    if (editingEvent) {
      // Update existing event (local only for now)
      setEvents(prev => prev.map(event => 
        event.id === editingEvent.id 
          ? { ...event, ...eventData, currentParticipants: event.currentParticipants }
          : event
      ));
      setEditingEvent(null);
    } else {
      // Create new event via API
      setIsCreatingEvent(true);
      
      try {
        // Prepare API payload matching the expected format
        const apiPayload = {
          title: eventData.title,
          description: eventData.description,
          date: eventData.date, // Format: "2025-12-15"
          time: eventData.time + ':00', // Convert "09:00" to "09:00:00"
          location: eventData.location,
          maxParticipants: eventData.maxParticipants,
          categoryName: finalCategory
        };

        // Always try proxy route first to avoid CORS issues
        let response = await corsApiClient.post<EventCreateResponse>('/api/events', apiPayload);
        
        // If proxy fails, try direct API as fallback
        if (!response.success && response.error?.includes('Proxy connection failed')) {
          console.log('Proxy failed, trying direct API call:', response.error);
          try {
            response = await corsApiClient.post<EventCreateResponse>('/events', apiPayload);
          } catch (directError) {
            console.log('Direct API also failed:', directError);
            // Keep the proxy error response
          }
        }

        if (response.success && response.data) {
          console.log('Event created successfully:', response.data.message);
          
          // Add to local state with generated ID
          const newEvent: Event = {
            id: Date.now().toString(),
            ...eventData,
            category: finalCategory,
            currentParticipants: 0,
            status: 'upcoming'
          };
          setEvents(prev => [...prev, newEvent]);
          
          // Reset form
          setFormData({
            title: '',
            description: '',
            date: '',
            time: '',
            location: '',
            maxParticipants: 10,
            category: 'workshop',
            customCategory: ''
          });
          setShowCreateForm(false);
        } else {
          setApiError(response.error || 'Failed to create event');
        }
      } catch (error: any) {
        console.error('Event creation error:', error);
        if (error.message?.includes('CORS') || error.message?.includes('ERR_FAILED')) {
          setApiError('Connection failed. Please check if the server allows requests from this domain.');
        } else {
          setApiError(error.message || 'Failed to create event. Please try again.');
        }
      } finally {
        setIsCreatingEvent(false);
      }
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    const isCustomCategory = !['workshop', 'networking', 'presentation', 'competition'].includes(event.category);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      maxParticipants: event.maxParticipants,
      category: isCustomCategory ? 'other' : event.category as 'workshop' | 'networking' | 'presentation' | 'competition',
      customCategory: isCustomCategory ? event.category : ''
    });
    setShowCreateForm(true);
  };

  const handleDelete = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'workshop':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'networking':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'presentation':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'competition':
        return 'bg-[#E63946]/20 text-[#E63946] border-[#E63946]/30';
      default:
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30'; // For custom categories
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'ongoing':
        return 'bg-green-500/20 text-green-400';
      case 'completed':
        return 'bg-gray-500/20 text-gray-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleBackToEventList = () => {
    setSelectedEvent(null);
  };

  // If an event is selected, show the EventDashboard
  if (selectedEvent) {
    return (
      <EventDashboard 
        event={selectedEvent} 
        onBack={handleBackToEventList}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Event Management</h2>
          <p className="text-gray-400">
            Create and manage hackathon events
            {hasLoadedFromAPI && (
              <span className="ml-2 text-green-400">• Synced with server</span>
            )}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchEventsFromAPI}
            disabled={isLoadingEvents}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingEvents ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
            ) : (
              <Calendar size={16} className="mr-2" />
            )}
            {isLoadingEvents ? 'Loading...' : 'Refresh Events'}
          </button>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-[#E63946] hover:bg-[#C5303E] text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Create New Event
          </button>
        </div>
      </div>

      {/* API Error Display */}
      {apiError && !showCreateForm && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-red-400">{apiError}</p>
            <button
              onClick={() => setApiError('')}
              className="text-red-400 hover:text-red-300 p-1"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Loading State */}
        {isLoadingEvents && !hasLoadedFromAPI && (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-[#E63946]/30 border-t-[#E63946] rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading events from server...</p>
            </div>
          </div>
        )}
        
        {/* Empty State */}
        {!isLoadingEvents && events.length === 0 && hasLoadedFromAPI && (
          <div className="col-span-full text-center py-12">
            <Calendar size={48} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No events found</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="text-[#E63946] hover:text-[#C5303E] font-medium"
            >
              Create your first event
            </button>
          </div>
        )}
        
        {/* Event Cards */}
        {!isLoadingEvents && events.map((event) => (
          <div 
            key={event.id} 
            className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-6 hover:border-gray-700 hover:border-[#E63946]/50 transition-all cursor-pointer group"
            onClick={() => handleEventClick(event)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#E63946] transition-colors">{event.title}</h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{event.description}</p>
                <div className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                  Click to open event dashboard
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(event);
                  }}
                  className="text-gray-400 hover:text-white p-1 rounded transition-colors"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(event.id);
                  }}
                  className="text-gray-400 hover:text-red-400 p-1 rounded transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-gray-300 text-sm">
                <Calendar size={14} className="mr-2" />
                <span>{new Date(event.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <Clock size={14} className="mr-2" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <MapPin size={14} className="mr-2" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <Users size={14} className="mr-2" />
                <span>{event.currentParticipants}/{event.maxParticipants}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(event.category)}`}>
                {event.category}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                {event.status}
              </span>
            </div>
          </div>
        ))}

        {/* Create Event Card - Only show if there are existing events */}
        {!isLoadingEvents && events.length > 0 && (
        <div 
          onClick={() => setShowCreateForm(true)}
          className="bg-gray-900/30 backdrop-blur-md border border-gray-800 border-dashed rounded-xl p-6 hover:border-[#E63946]/50 hover:bg-gray-900/50 transition-all cursor-pointer flex items-center justify-center min-h-[280px]"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-[#E63946]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus size={32} className="text-[#E63946]" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Create New Event</h3>
            <p className="text-gray-400 text-sm">Add a new event to the hackathon schedule</p>
          </div>
        </div>
        )}
      </div>

      {/* Create/Edit Event Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="relative w-full max-w-md mx-auto bg-gray-900 rounded-2xl border border-gray-700">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <h2 className="text-xl font-bold text-white">
                  {editingEvent ? 'Edit Event' : 'Create New Event'}
                </h2>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingEvent(null);
                    setFormData({
                      title: '',
                      description: '',
                      date: '',
                      time: '',
                      location: '',
                      maxParticipants: 10,
                      category: 'workshop',
                      customCategory: ''
                    });
                  }}
                  className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Event Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#E63946]/50"
                    placeholder="Enter event title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#E63946]/50"
                    placeholder="Enter event description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#E63946]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Time</label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#E63946]/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#E63946]/50"
                    placeholder="Enter event location"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Max Participants</label>
                    <input
                      type="number"
                      name="maxParticipants"
                      value={formData.maxParticipants}
                      onChange={handleInputChange}
                      required
                      min="1"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#E63946]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                    {formData.category === 'other' ? (
                      <div className="relative">
                        <input
                          type="text"
                          name="customCategory"
                          value={formData.customCategory}
                          onChange={handleInputChange}
                          required
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#E63946]/50"
                          placeholder="Enter custom category name"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, category: 'workshop', customCategory: '' }))}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white text-xs"
                        >
                          Back to dropdown
                        </button>
                      </div>
                    ) : (
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#E63946]/50"
                      >
                        <option value="workshop">Workshop</option>
                        <option value="networking">Networking</option>
                        <option value="presentation">Presentation</option>
                        <option value="competition">Competition</option>
                        <option value="other">Other (Custom)</option>
                      </select>
                    )}
                  </div>
                </div>

                {/* Error Display */}
                {apiError && (
                  <div className="col-span-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-sm">{apiError}</p>
                  </div>
                )}

                <div className="flex space-x-3 pt-4 col-span-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingEvent(null);
                      setApiError('');
                      setFormData({
                        title: '',
                        description: '',
                        date: '',
                        time: '',
                        location: '',
                        maxParticipants: 10,
                        category: 'workshop',
                        customCategory: ''
                      });
                    }}
                    disabled={isCreatingEvent}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingEvent}
                    className="flex-1 bg-[#E63946] hover:bg-[#C5303E] text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreatingEvent ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Creating...
                      </div>
                    ) : (
                      editingEvent ? 'Update Event' : 'Create Event'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManagement;