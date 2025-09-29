import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Plus, 
  Upload, 
  Image, 
  FileText, 
  Save, 
  Eye, 
  Edit2, 
  Trash2,
  CheckCircle,
  Circle
} from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  maxParticipants: number;
  currentParticipants: number;
  category: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

interface TimelineItem {
  id: string;
  time: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  type: 'registration' | 'ceremony' | 'hacking' | 'networking' | 'presentation' | 'break' | 'other';
}

interface EventMap {
  id: string;
  name: string;
  file: File | null;
  url: string;
  description: string;
  uploadedAt: string;
}

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  createdAt: string;
  isPublished: boolean;
}

interface EventDashboardProps {
  event: Event;
  onBack: () => void;
}

const EventDashboard: React.FC<EventDashboardProps> = ({ event, onBack }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'maps' | 'announcements'>('overview');
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([
    {
      id: '1',
      time: '09:00 AM',
      title: 'Registration & Check-in',
      description: 'Welcome participants and distribute materials',
      status: 'upcoming',
      type: 'registration'
    },
    {
      id: '2',
      time: '10:00 AM',
      title: 'Opening Ceremony',
      description: 'Keynote speakers and event overview',
      status: 'upcoming',
      type: 'ceremony'
    }
  ]);
  
  const [eventMaps, setEventMaps] = useState<EventMap[]>(() => {
    const savedMaps = localStorage.getItem('eventMaps');
    return savedMaps ? JSON.parse(savedMaps) : [];
  });
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: '1',
      title: 'Welcome to AI/ML Workshop',
      message: 'Please arrive 15 minutes early for registration and setup.',
      type: 'info',
      createdAt: new Date().toLocaleString(),
      isPublished: true
    },
    {
      id: '2',
      title: 'WiFi Information',
      message: 'Network: EventWiFi | Password: workshop2025',
      type: 'success',
      createdAt: new Date().toLocaleString(),
      isPublished: true
    }
  ]);
  const [showTimelineForm, setShowTimelineForm] = useState(false);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [editingTimeline, setEditingTimeline] = useState<TimelineItem | null>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [timelineFormData, setTimelineFormData] = useState({
    time: '',
    title: '',
    description: '',
    type: 'other' as TimelineItem['type']
  });

  const [announcementFormData, setAnnouncementFormData] = useState({
    title: '',
    message: '',
    type: 'info' as Announcement['type']
  });

  const handleTimelineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTimeline) {
      setTimelineItems(prev => prev.map(item => 
        item.id === editingTimeline.id 
          ? { ...item, ...timelineFormData, status: 'upcoming' as const }
          : item
      ));
      setEditingTimeline(null);
    } else {
      const newItem: TimelineItem = {
        id: Date.now().toString(),
        ...timelineFormData,
        status: 'upcoming'
      };
      setTimelineItems(prev => [...prev, newItem].sort((a, b) => a.time.localeCompare(b.time)));
    }
    
    setTimelineFormData({ time: '', title: '', description: '', type: 'other' });
    setShowTimelineForm(false);
  };

  const handleEditTimeline = (item: TimelineItem) => {
    setEditingTimeline(item);
    setTimelineFormData({
      time: item.time,
      title: item.title,
      description: item.description,
      type: item.type
    });
    setShowTimelineForm(true);
  };

  const handleDeleteTimeline = (id: string) => {
    setTimelineItems(prev => prev.filter(item => item.id !== id));
  };

  const handleMapUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const newMap: EventMap = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          file: file,
          url: URL.createObjectURL(file),
          description: '',
          uploadedAt: new Date().toLocaleString()
        };
        setEventMaps(prev => {
          const updated = [...prev, newMap];
          localStorage.setItem('eventMaps', JSON.stringify(updated));
          return updated;
        });
      });
    }
  };

  const handleDeleteMap = (id: string) => {
    setEventMaps(prev => {
      const updated = prev.filter(map => map.id !== id);
      localStorage.setItem('eventMaps', JSON.stringify(updated));
      return updated;
    });
  };

  const getTypeIcon = (type: TimelineItem['type']) => {
    switch (type) {
      case 'registration': return <Users size={16} />;
      case 'ceremony': return <Calendar size={16} />;
      case 'hacking': return <FileText size={16} />;
      case 'networking': return <Users size={16} />;
      case 'presentation': return <Eye size={16} />;
      case 'break': return <Clock size={16} />;
      default: return <Circle size={16} />;
    }
  };

  const getTypeColor = (type: TimelineItem['type']) => {
    switch (type) {
      case 'registration': return 'text-blue-400';
      case 'ceremony': return 'text-purple-400';
      case 'hacking': return 'text-[#E63946]';
      case 'networking': return 'text-green-400';
      case 'presentation': return 'text-orange-400';
      case 'break': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">{event.title}</h1>
            <p className="text-gray-400">{event.description}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Event Dashboard</div>
          <div className="text-[#E63946] font-semibold">{event.status}</div>
        </div>
      </div>

      {/* Event Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-4">
          <div className="flex items-center mb-2">
            <Calendar className="w-5 h-5 text-[#E63946] mr-2" />
            <span className="text-gray-400 text-sm">Date</span>
          </div>
          <div className="text-white font-semibold">{new Date(event.date).toLocaleDateString()}</div>
        </div>
        <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-4">
          <div className="flex items-center mb-2">
            <Clock className="w-5 h-5 text-[#E63946] mr-2" />
            <span className="text-gray-400 text-sm">Time</span>
          </div>
          <div className="text-white font-semibold">{event.time}</div>
        </div>
        <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-4">
          <div className="flex items-center mb-2">
            <MapPin className="w-5 h-5 text-[#E63946] mr-2" />
            <span className="text-gray-400 text-sm">Location</span>
          </div>
          <div className="text-white font-semibold">{event.location}</div>
        </div>
        <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-4">
          <div className="flex items-center mb-2">
            <Users className="w-5 h-5 text-[#E63946] mr-2" />
            <span className="text-gray-400 text-sm">Participants</span>
          </div>
          <div className="text-white font-semibold">{event.currentParticipants}/{event.maxParticipants}</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-900/50 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview', icon: Eye },
          { id: 'timeline', label: 'Timeline', icon: Clock },
          { id: 'maps', label: 'Maps & Resources', icon: MapPin },
          { id: 'announcements', label: 'Announcements', icon: FileText }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#E63946] text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">Event Overview</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-medium text-white mb-3">Event Statistics</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Timeline Items</span>
                    <span className="text-white font-semibold">{timelineItems.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Maps Uploaded</span>
                    <span className="text-white font-semibold">{eventMaps.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Completion Status</span>
                    <span className="text-green-400 font-semibold">
                      {Math.round((timelineItems.filter(item => item.status === 'completed').length / timelineItems.length) * 100) || 0}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-medium text-white mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setActiveTab('timeline')}
                    className="w-full bg-[#E63946] hover:bg-[#C5303E] text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <Plus size={16} className="mr-2" />
                    Add Timeline Item
                  </button>
                  <button
                    onClick={() => setActiveTab('maps')}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <Upload size={16} className="mr-2" />
                    Upload Maps
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Event Timeline</h3>
              <button
                onClick={() => setShowTimelineForm(true)}
                className="bg-[#E63946] hover:bg-[#C5303E] text-white px-4 py-2 rounded-lg transition-colors flex items-center"
              >
                <Plus size={16} className="mr-2" />
                Add Item
              </button>
            </div>

            <div className="space-y-4">
              {timelineItems.map((item, index) => (
                <div key={item.id} className="flex items-start space-x-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                      item.status === 'completed' ? 'bg-green-500 border-green-500' :
                      item.status === 'current' ? 'bg-[#E63946] border-[#E63946]' :
                      'bg-gray-700 border-gray-600'
                    }`}>
                      {item.status === 'completed' ? (
                        <CheckCircle size={16} className="text-white" />
                      ) : (
                        <div className={`${getTypeColor(item.type)}`}>
                          {getTypeIcon(item.type)}
                        </div>
                      )}
                    </div>
                    {index < timelineItems.length - 1 && (
                      <div className="w-0.5 h-16 bg-gray-700 mt-2"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-[#E63946] font-semibold">{item.time}</span>
                        <span className="text-white font-medium">{item.title}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditTimeline(item)}
                          className="text-gray-400 hover:text-white p-1 rounded transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteTimeline(item.id)}
                          className="text-gray-400 hover:text-red-400 p-1 rounded transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                    <div className="mt-2 flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        item.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        item.status === 'current' ? 'bg-[#E63946]/20 text-[#E63946]' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {item.status}
                      </span>
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-600/20 text-gray-300">
                        {item.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'maps' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Maps & Floor Plans</h3>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-[#E63946] hover:bg-[#C5303E] text-white px-4 py-2 rounded-lg transition-colors flex items-center"
              >
                <Upload size={16} className="mr-2" />
                Upload Maps
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleMapUpload}
                accept="image/*,.pdf"
                multiple
                className="hidden"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {eventMaps.map((map) => (
                <div key={map.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Image size={16} className="text-[#E63946] mr-2" />
                      <span className="text-white font-medium truncate">{map.name}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteMap(map.id)}
                      className="text-gray-400 hover:text-red-400 p-1 rounded transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  
                  {map.file?.type.startsWith('image/') && (
                    <div className="mb-3">
                      <img 
                        src={map.url} 
                        alt={map.name}
                        className="w-full h-32 object-cover rounded border border-gray-600"
                      />
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-400 mb-2">
                    Uploaded: {map.uploadedAt}
                  </div>
                  
                  <button
                    onClick={() => window.open(map.url, '_blank')}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm transition-colors"
                  >
                    View Full Size
                  </button>
                </div>
              ))}
              
              {eventMaps.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <MapPin size={48} className="text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">No maps uploaded yet</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[#E63946] hover:text-[#C5303E] font-medium"
                  >
                    Upload your first map
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'announcements' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Quick Announcements</h3>
              <button
                onClick={() => setShowAnnouncementForm(true)}
                className="bg-[#E63946] hover:bg-[#C5303E] text-white px-4 py-2 rounded-lg transition-colors flex items-center"
              >
                <Plus size={16} className="mr-2" />
                New Announcement
              </button>
            </div>

            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        announcement.type === 'urgent' ? 'bg-red-500' :
                        announcement.type === 'warning' ? 'bg-yellow-500' :
                        announcement.type === 'success' ? 'bg-green-500' :
                        'bg-blue-500'
                      }`} />
                      <h4 className="text-white font-semibold">{announcement.title}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        announcement.type === 'urgent' ? 'bg-red-500/20 text-red-400' :
                        announcement.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                        announcement.type === 'success' ? 'bg-green-500/20 text-green-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {announcement.type}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingAnnouncement(announcement);
                          setAnnouncementFormData({
                            title: announcement.title,
                            message: announcement.message,
                            type: announcement.type
                          });
                          setShowAnnouncementForm(true);
                        }}
                        className="text-gray-400 hover:text-white p-1 rounded transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => setAnnouncements(prev => prev.filter(a => a.id !== announcement.id))}
                        className="text-gray-400 hover:text-red-400 p-1 rounded transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-2">{announcement.message}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Created: {announcement.createdAt}</span>
                    <span className={`px-2 py-1 rounded-full ${
                      announcement.isPublished ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {announcement.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
              ))}
              
              {announcements.length === 0 && (
                <div className="text-center py-12">
                  <FileText size={48} className="text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">No announcements yet</p>
                  <button
                    onClick={() => setShowAnnouncementForm(true)}
                    className="text-[#E63946] hover:text-[#C5303E] font-medium"
                  >
                    Create your first announcement
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Timeline Form Modal */}
      {showTimelineForm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="relative w-full max-w-md mx-auto bg-gray-900 rounded-2xl border border-gray-700">
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <h2 className="text-xl font-bold text-white">
                  {editingTimeline ? 'Edit Timeline Item' : 'Add Timeline Item'}
                </h2>
                <button
                  onClick={() => {
                    setShowTimelineForm(false);
                    setEditingTimeline(null);
                    setTimelineFormData({ time: '', title: '', description: '', type: 'other' });
                  }}
                  className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
              </div>

              <form onSubmit={handleTimelineSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Time</label>
                    <input
                      type="time"
                      value={timelineFormData.time}
                      onChange={(e) => setTimelineFormData(prev => ({ ...prev, time: e.target.value }))}
                      required
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#E63946]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                    <select
                      value={timelineFormData.type}
                      onChange={(e) => setTimelineFormData(prev => ({ ...prev, type: e.target.value as TimelineItem['type'] }))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#E63946]/50"
                    >
                      <option value="registration">Registration</option>
                      <option value="ceremony">Ceremony</option>
                      <option value="hacking">Hacking</option>
                      <option value="networking">Networking</option>
                      <option value="presentation">Presentation</option>
                      <option value="break">Break</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    value={timelineFormData.title}
                    onChange={(e) => setTimelineFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#E63946]/50"
                    placeholder="Enter timeline item title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={timelineFormData.description}
                    onChange={(e) => setTimelineFormData(prev => ({ ...prev, description: e.target.value }))}
                    required
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#E63946]/50"
                    placeholder="Enter description"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowTimelineForm(false);
                      setEditingTimeline(null);
                      setTimelineFormData({ time: '', title: '', description: '', type: 'other' });
                    }}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#E63946] hover:bg-[#C5303E] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <Save size={16} className="mr-2" />
                    {editingTimeline ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Announcement Form Modal */}
      {showAnnouncementForm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="relative w-full max-w-md mx-auto bg-gray-900 rounded-2xl border border-gray-700">
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <h2 className="text-xl font-bold text-white">
                  {editingAnnouncement ? 'Edit Announcement' : 'New Announcement'}
                </h2>
                <button
                  onClick={() => {
                    setShowAnnouncementForm(false);
                    setEditingAnnouncement(null);
                    setAnnouncementFormData({ title: '', message: '', type: 'info' });
                  }}
                  className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (editingAnnouncement) {
                    setAnnouncements(prev => prev.map(a => 
                      a.id === editingAnnouncement.id 
                        ? { ...a, ...announcementFormData }
                        : a
                    ));
                  } else {
                    const newAnnouncement: Announcement = {
                      id: Date.now().toString(),
                      ...announcementFormData,
                      createdAt: new Date().toLocaleString(),
                      isPublished: true
                    };
                    setAnnouncements(prev => [...prev, newAnnouncement]);
                  }
                  setShowAnnouncementForm(false);
                  setEditingAnnouncement(null);
                  setAnnouncementFormData({ title: '', message: '', type: 'info' });
                }}
                className="p-6 space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    value={announcementFormData.title}
                    onChange={(e) => setAnnouncementFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#E63946]/50"
                    placeholder="Enter announcement title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                  <select
                    value={announcementFormData.type}
                    onChange={(e) => setAnnouncementFormData(prev => ({ ...prev, type: e.target.value as Announcement['type'] }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#E63946]/50"
                  >
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                  <textarea
                    value={announcementFormData.message}
                    onChange={(e) => setAnnouncementFormData(prev => ({ ...prev, message: e.target.value }))}
                    required
                    rows={4}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#E63946]/50"
                    placeholder="Enter announcement message"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAnnouncementForm(false);
                      setEditingAnnouncement(null);
                      setAnnouncementFormData({ title: '', message: '', type: 'info' });
                    }}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#E63946] hover:bg-[#C5303E] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <Save size={16} className="mr-2" />
                    {editingAnnouncement ? 'Update' : 'Publish'}
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

export default EventDashboard;