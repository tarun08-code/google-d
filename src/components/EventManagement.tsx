import React, { useState } from 'react';
import { Plus, Calendar, Clock, MapPin, Users, Edit2, Trash2, X } from 'lucide-react';

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'maxParticipants' ? parseInt(value) || 10 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalCategory = formData.category === 'other' ? formData.customCategory : formData.category;
    const { customCategory, ...eventDataWithoutCustom } = formData;
    const eventData = {
      ...eventDataWithoutCustom,
      category: finalCategory
    };

    if (editingEvent) {
      // Update existing event
      setEvents(prev => prev.map(event => 
        event.id === editingEvent.id 
          ? { ...event, ...eventData, currentParticipants: event.currentParticipants }
          : event
      ));
      setEditingEvent(null);
    } else {
      // Create new event
      const newEvent: Event = {
        id: Date.now().toString(),
        ...eventData,
        currentParticipants: 0,
        status: 'upcoming'
      };
      setEvents(prev => [...prev, newEvent]);
    }
    
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Event Management</h2>
        <p className="text-gray-400">Create and manage hackathon events</p>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">{event.title}</h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{event.description}</p>
              </div>
              <div className="flex items-center space-x-2 ml-2">
                <button
                  onClick={() => handleEdit(event)}
                  className="text-gray-400 hover:text-white p-1 rounded transition-colors"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
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

        {/* Create Event Card */}
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

                <div className="flex space-x-3 pt-4 col-span-2">
                  <button
                    type="button"
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
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#E63946] hover:bg-[#C5303E] text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    {editingEvent ? 'Update Event' : 'Create Event'}
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