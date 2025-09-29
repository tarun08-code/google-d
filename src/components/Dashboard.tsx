import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Mail, Linkedin, LogOut, QrCode, Users, X, Phone, AlertTriangle, LayoutDashboard, CalendarDays, BookOpen, HelpCircle, Menu } from 'lucide-react';
import Leaderboard from './Leaderboard';
import AllParticipants from './AllParticipants';
import EventManagement from './EventManagement';

interface UserData {
  name: string;
  email: string;
  linkedinUrl: string;
  registrationDate: string;
  following?: string[];
}

interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  type: 'registration' | 'ceremony' | 'hacking' | 'networking' | 'presentation';
}

interface ParticipantLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  isOnline: boolean;
  lastSeen: string;
  section: string;
}

const Dashboard: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [followingList, setFollowingList] = useState<string[]>([]);
  const [currentView, setCurrentView] = useState<'dashboard' | 'allParticipants'>('dashboard');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [participantLocations, setParticipantLocations] = useState<ParticipantLocation[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [activeMenuItem, setActiveMenuItem] = useState<'dashboard' | 'event' | 'bookings' | 'support'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const timelineEvents: TimelineEvent[] = [
    {
      id: '1',
      time: '09:00 AM',
      title: 'Registration & Check-in',
      description: 'Welcome breakfast and team formation',
      status: 'completed',
      type: 'registration'
    },
    {
      id: '2',
      time: '10:30 AM',
      title: 'Opening Ceremony',
      description: 'Keynote speakers and challenge presentation',
      status: 'completed',
      type: 'ceremony'
    },
    {
      id: '3',
      time: '12:00 PM',
      title: 'Hacking Begins',
      description: 'Teams start working on their projects',
      status: 'current',
      type: 'hacking'
    },
    {
      id: '4',
      time: '07:00 PM',
      title: 'Dinner & Networking',
      description: 'Networking session with corporate sponsors and mentors',
      status: 'upcoming',
      type: 'networking'
    },
    {
      id: '5',
      time: '02:00 PM',
      title: 'Final Presentations',
      description: 'Project demos and judging',
      status: 'upcoming',
      type: 'presentation'
    }
  ];

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const user = JSON.parse(storedUserData);
      setUserData(user);
      setFollowingList(user.following || []);
    }

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied:', error);
          // Fallback to mock location (San Francisco area)
          setUserLocation({ lat: 37.7749, lng: -122.4194 });
        }
      );
    } else {
      // Fallback location
      setUserLocation({ lat: 37.7749, lng: -122.4194 });
    }

    // Mock participant locations (in a real app, this would come from an API)
    const mockLocations: ParticipantLocation[] = [
      {
        id: '1',
        name: 'Alex Chen',
        latitude: 37.7849,
        longitude: -122.4094,
        isOnline: true,
        lastSeen: '2 min ago',
        section: 'Main Hall'
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        latitude: 37.7649,
        longitude: -122.4294,
        isOnline: true,
        lastSeen: '5 min ago',
        section: 'Workshop A'
      },
      {
        id: '3',
        name: 'Mike Rodriguez',
        latitude: 37.7749,
        longitude: -122.4094,
        isOnline: false,
        lastSeen: '15 min ago',
        section: 'Networking Zone'
      },
      {
        id: '4',
        name: 'Emily Davis',
        latitude: 37.7849,
        longitude: -122.4294,
        isOnline: true,
        lastSeen: '1 min ago',
        section: 'Tech Demo'
      },
      {
        id: '5',
        name: 'David Kim',
        latitude: 37.7649,
        longitude: -122.4094,
        isOnline: true,
        lastSeen: '3 min ago',
        section: 'Sponsor Booth'
      }
    ];

    setParticipantLocations(mockLocations);
  }, []);

  const handleFollow = (participantId: string) => {
    const updatedFollowing = followingList.includes(participantId)
      ? followingList.filter(id => id !== participantId)
      : [...followingList, participantId];

    setFollowingList(updatedFollowing);

    if (userData) {
      const updatedUserData = { ...userData, following: updatedFollowing };
      setUserData(updatedUserData);
      localStorage.setItem('userData', JSON.stringify(updatedUserData));
    }
  };

  const handleViewAllParticipants = () => {
    setCurrentView('allParticipants');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('isLoggedIn');
    window.location.href = '/';
  };

  const renderDashboardContent = () => {
    switch (activeMenuItem) {
      case 'dashboard':
        return renderMainDashboard();
      case 'event':
        return renderEventContent();
      case 'bookings':
        return renderBookingsContent();
      case 'support':
        return renderSupportContent();
      default:
        return renderMainDashboard();
    }
  };

  const renderEventContent = () => (
    <EventManagement />
  );

  const renderBookingsContent = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">My Bookings</h2>
      <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-6">
        <div className="space-y-4">
          <div className="bg-gray-800/50 rounded-lg p-4 border-l-4 border-[#E63946]">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-white font-medium">TechHack 2025 Registration</h4>
                <p className="text-gray-400 text-sm">March 15-17, 2025</p>
                <p className="text-gray-400 text-sm">Registration ID: #TH2025-001847</p>
              </div>
              <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">Confirmed</span>
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 border-l-4 border-blue-500">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-white font-medium">Workshop: AI/ML Fundamentals</h4>
                <p className="text-gray-400 text-sm">March 16, 2025 - 2:00 PM</p>
                <p className="text-gray-400 text-sm">Room: Workshop A</p>
              </div>
              <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm">Pending</span>
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 border-l-4 border-purple-500">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-white font-medium">Mentorship Session</h4>
                <p className="text-gray-400 text-sm">March 16, 2025 - 4:00 PM</p>
                <p className="text-gray-400 text-sm">Mentor: Sarah Johnson - Tech Lead @ Google</p>
              </div>
              <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">Scheduled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSupportContent = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Help & Support</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Phone className="w-5 h-5 text-[#E63946] mr-2" />
            Emergency Contacts
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-white font-medium">Event Helpdesk</h4>
              <p className="text-gray-400">+1 (555) 123-4567</p>
              <p className="text-gray-400 text-sm">Available 24/7 during event</p>
            </div>
            <div>
              <h4 className="text-white font-medium">Technical Support</h4>
              <p className="text-gray-400">+1 (555) 987-6543</p>
              <p className="text-gray-400 text-sm">Wi-Fi, equipment, technical issues</p>
            </div>
            <div>
              <h4 className="text-white font-medium">Medical Emergency</h4>
              <p className="text-gray-400">+1 (911) or On-site Medical Team</p>
              <p className="text-gray-400 text-sm">Located at Ground Floor Reception</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <HelpCircle className="w-5 h-5 text-[#E63946] mr-2" />
            FAQ & Resources
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-white font-medium">Wi-Fi Access</h4>
              <p className="text-gray-400 text-sm">Network: TechHack2025</p>
              <p className="text-gray-400 text-sm">Password: TechHack2025</p>
            </div>
            <div>
              <h4 className="text-white font-medium">Food & Refreshments</h4>
              <p className="text-gray-400 text-sm">Food court open 24/7 on 2nd floor</p>
              <p className="text-gray-400 text-sm">Coffee stations on all floors</p>
            </div>
            <div>
              <h4 className="text-white font-medium">Parking</h4>
              <p className="text-gray-400 text-sm">Free parking in Building A garage</p>
              <p className="text-gray-400 text-sm">Entrance on Mission Street</p>
            </div>
            <div>
              <h4 className="text-white font-medium">Presentation Guidelines</h4>
              <p className="text-gray-400 text-sm">5 minutes presentation + 2 minutes Q&A</p>
              <p className="text-gray-400 text-sm">Slides due by 1:00 PM on Day 3</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMainDashboard = () => (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
        {/* Event Ticket */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-[#E63946]/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 sm:mb-6">
                <div className="mb-4 sm:mb-0">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">TechHack 2025</h2>
                  <div className="flex items-center text-gray-300 mb-2 text-sm sm:text-base">
                    <Calendar size={14} className="mr-2 sm:hidden" />
                    <Calendar size={16} className="mr-2 hidden sm:block" />
                    <span>March 15-17, 2025</span>
                  </div>
                  <div className="flex items-center text-gray-300 mb-2 text-sm sm:text-base">
                    <Clock size={14} className="mr-2 sm:hidden" />
                    <Clock size={16} className="mr-2 hidden sm:block" />
                    <span>48 Hours</span>
                  </div>
                  <div className="flex items-center text-gray-300 text-sm sm:text-base">
                    <MapPin size={14} className="mr-2 sm:hidden" />
                    <MapPin size={16} className="mr-2 hidden sm:block" />
                    <span className="truncate">Tech Innovation Center, San Francisco</span>
                  </div>
                </div>

                {/* QR Code */}
                <div className="bg-white p-2 sm:p-4 rounded-lg">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-black rounded grid grid-cols-4 gap-1 p-1 sm:p-2">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-sm ${Math.random() > 0.5 ? 'bg-white' : 'bg-black'
                          }`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Registration ID</div>
                  <div className="text-lg font-mono text-white">#TH2025-001847</div>
                </div>
              </div>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-400">Scan this QR code for event check-in</p>
              </div>
            </div>
          </div>
        </div>

        {/* Venue Navigation */}
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <div className="flex items-center mb-4">
              <MapPin className="w-5 h-5 text-[#E63946] mr-2" />
              <h3 className="text-lg font-semibold text-white">Venue Navigation</h3>
            </div>

            {/* Interactive Map */}
            <div className="bg-black rounded-lg p-3 sm:p-4 mb-4 relative h-32 sm:h-40">
              <div className="absolute inset-2 bg-gray-800 rounded"></div>
              <div className="absolute top-6 left-6 w-3 h-3 bg-[#E63946] rounded-full animate-pulse"></div>
              <div className="absolute top-12 right-8 w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="absolute bottom-8 left-12 w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="absolute bottom-6 right-6 text-xs text-gray-400">
                Tech Innovation Center
              </div>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
              <div>
                <div className="font-medium text-white">Main Hall</div>
                <div className="text-gray-400">Ground Floor</div>
              </div>
              <div>
                <div className="font-medium text-white">Food Court</div>
                <div className="text-gray-400">2nd Floor</div>
              </div>
              <div>
                <div className="font-medium text-white">Rest Areas</div>
                <div className="text-gray-400">All Floors</div>
              </div>
              <div>
                <div className="font-medium text-white">Washrooms</div>
                <div className="text-gray-400">All Floors</div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-[#E63946]/10 border border-[#E63946]/20 rounded-lg">
              <div className="flex items-center text-[#E63946] text-sm">
                <Clock size={14} className="mr-2" />
                <span>Venue opens at 8:00 AM</span>
              </div>
            </div>
          </div>

          {/* Participant Location Map */}
          <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center">
              <MapPin className="w-5 h-5 text-[#E63946] mr-2" />
              Live Participant Map
            </h3>

            {/* Mini Map Container */}
            <div className="relative bg-gray-800 rounded-lg h-32 sm:h-40 overflow-hidden border border-gray-700">
              {/* Map Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20">
                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="grid grid-cols-8 grid-rows-6 h-full">
                    {Array.from({ length: 48 }, (_, i) => (
                      <div key={i} className="border border-gray-600"></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* User Location (Red Dot) */}
              {userLocation && (
                <div
                  className="absolute w-3 h-3 bg-[#E63946] rounded-full border-2 border-white shadow-lg animate-pulse"
                  style={{
                    left: '45%',
                    top: '60%',
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <span className="text-xs bg-[#E63946] text-white px-1 rounded whitespace-nowrap">You</span>
                  </div>
                </div>
              )}

              {/* Participant Locations (Green Dots) */}
              {participantLocations.map((participant, index) => {
                // Calculate position based on mock coordinates
                const left = 20 + (index * 15) % 60;
                const top = 20 + (index * 10) % 50;

                return (
                  <div key={participant.id}>
                    <div
                      className={`absolute w-2.5 h-2.5 rounded-full border border-white shadow-md cursor-pointer hover:scale-125 transition-transform group ${participant.isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
                        }`}
                      style={{
                        left: `${left}%`,
                        top: `${top}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      {/* Tooltip */}
                      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <div className="font-semibold">{participant.name}</div>
                        <div className="text-gray-300">{participant.section}</div>
                        <div className="text-green-400">{participant.lastSeen}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-3 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#E63946] rounded-full mr-2"></div>
                  <span className="text-gray-400">You</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-gray-400">Online ({participantLocations.filter(p => p.isOnline).length})</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
                  <span className="text-gray-400">Offline ({participantLocations.filter(p => !p.isOnline).length})</span>
                </div>
              </div>
              <span className="text-gray-500">Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* Event Schedule Timeline */}
      <div className="mt-6 sm:mt-8">
        <div className="bg-gray-900/30 backdrop-blur-md border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8">
          <div className="flex items-center mb-4 sm:mb-6">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-[#E63946] mr-2 sm:mr-3" />
            <h3 className="text-lg sm:text-2xl font-bold text-white">Event Schedule</h3>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-0.5 bg-gray-700"></div>

            <div className="space-y-6 sm:space-y-8">
              {timelineEvents.map((event) => (
                <div key={event.id} className="relative flex items-start">
                  {/* Timeline dot */}
                  <div className={`relative z-10 w-8 h-8 sm:w-12 sm:h-12 ${getStatusColor(event.status)} rounded-full flex items-center justify-center mr-3 sm:mr-6 flex-shrink-0`}>
                    {getStatusIcon(event.type)}
                  </div>

                  {/* Event content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                      <h4 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-0">{event.title}</h4>
                      <span className="text-xs sm:text-sm font-medium text-[#E63946] bg-[#E63946]/10 px-2 sm:px-3 py-1 rounded-full self-start sm:self-auto">
                        {event.time}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{event.description}</p>

                    <div className="mt-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${event.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : event.status === 'current'
                          ? 'bg-[#E63946]/20 text-[#E63946]'
                          : 'bg-gray-100 text-gray-800'
                        }`}>
                        {event.status === 'completed' ? 'Completed' :
                          event.status === 'current' ? 'In Progress' : 'Upcoming'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Announcements */}
      <div className="mt-6 sm:mt-8">
        <div className="bg-gray-900/30 backdrop-blur-md border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <div className="w-2 h-2 bg-[#E63946] rounded-full mr-3"></div>
            Announcements
          </h3>
          <div className="space-y-3">
            <div className="p-4 bg-black/40 rounded-lg border-l-4 border-[#E63946]">
              <p className="text-gray-300 text-sm">
                <strong className="text-white">Wi-Fi Update:</strong> Network credentials have been updated.
                New password: TechHack2025
              </p>
            </div>
            <div className="p-4 bg-black/40 rounded-lg border-l-4 border-blue-500">
              <p className="text-gray-300 text-sm">
                <strong className="text-white">Lunch Break:</strong> Extended lunch break from 1:00 PM - 2:00 PM.
                Food court on 2nd floor.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="mt-6 sm:mt-8">
        <Leaderboard onFollow={handleFollow} onViewAll={handleViewAllParticipants} />
      </div>
    </>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'current':
        return 'bg-[#E63946]';
      case 'upcoming':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusIcon = (type: string) => {
    const iconSize = 12; // Smaller for mobile
    const smIconSize = 16; // Larger for desktop

    switch (type) {
      case 'registration':
        return (
          <>
            <User size={iconSize} className="text-white sm:hidden" />
            <User size={smIconSize} className="text-white hidden sm:block" />
          </>
        );
      case 'ceremony':
        return (
          <>
            <Calendar size={iconSize} className="text-white sm:hidden" />
            <Calendar size={smIconSize} className="text-white hidden sm:block" />
          </>
        );
      case 'hacking':
        return (
          <>
            <Clock size={iconSize} className="text-white sm:hidden" />
            <Clock size={smIconSize} className="text-white hidden sm:block" />
          </>
        );
      case 'networking':
        return (
          <>
            <Linkedin size={iconSize} className="text-white sm:hidden" />
            <Linkedin size={smIconSize} className="text-white hidden sm:block" />
          </>
        );
      case 'presentation':
        return (
          <>
            <QrCode size={iconSize} className="text-white sm:hidden" />
            <QrCode size={smIconSize} className="text-white hidden sm:block" />
          </>
        );
      default:
        return (
          <>
            <Clock size={iconSize} className="text-white sm:hidden" />
            <Clock size={smIconSize} className="text-white hidden sm:block" />
          </>
        );
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <p className="text-gray-400">Please wait while we load your dashboard</p>
        </div>
      </div>
    );
  }

  // Show AllParticipants page if currentView is 'allParticipants'  
  if (currentView === 'allParticipants') {
    return (
      <AllParticipants
        onFollow={handleFollow}
        onBack={handleBackToDashboard}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900/95 backdrop-blur-md border-r border-gray-800 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800">
          <h1 className="text-xl font-bold text-[#E63946]">HackEvent</h1>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveMenuItem('dashboard')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeMenuItem === 'dashboard' 
                    ? 'bg-[#E63946]/20 text-[#E63946] border-r-2 border-[#E63946]' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <LayoutDashboard size={20} />
                <span className="font-medium">Dashboard</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveMenuItem('event')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeMenuItem === 'event' 
                    ? 'bg-[#E63946]/20 text-[#E63946] border-r-2 border-[#E63946]' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <CalendarDays size={20} />
                <span className="font-medium">Event</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveMenuItem('bookings')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeMenuItem === 'bookings' 
                    ? 'bg-[#E63946]/20 text-[#E63946] border-r-2 border-[#E63946]' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <BookOpen size={20} />
                <span className="font-medium">My Bookings</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveMenuItem('support')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeMenuItem === 'support' 
                    ? 'bg-[#E63946]/20 text-[#E63946] border-r-2 border-[#E63946]' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <HelpCircle size={20} />
                <span className="font-medium">Help & Support</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="border-b border-gray-800 bg-black/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-14 sm:h-16">
              <div className="flex items-center">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors mr-3"
                >
                  <Menu size={20} />
                </button>
                <h1 className="text-lg sm:text-2xl font-bold text-[#E63946] lg:hidden">HackEvent</h1>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="flex items-center space-x-1 sm:space-x-2 hover:bg-gray-800/50 rounded-lg p-1 transition-colors"
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#E63946] rounded-full flex items-center justify-center">
                    <User size={12} className="text-white sm:hidden" />
                    <User size={16} className="text-white hidden sm:block" />
                  </div>
                  <span className="text-xs sm:text-sm text-gray-300 hidden xs:inline">{userData.name}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-white transition-colors p-1 sm:p-2"
                >
                  <LogOut size={18} className="sm:hidden" />
                  <LogOut size={20} className="hidden sm:block" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
          {renderDashboardContent()}
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="relative w-full max-w-md mx-auto bg-gray-900 rounded-2xl border border-gray-700">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <User className="w-6 h-6 text-[#E63946] mr-3" />
                  Your Profile
                </h2>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Profile Content */}
              <div className="p-6">
                {/* Profile Avatar */}
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-[#E63946] rounded-full flex items-center justify-center mx-auto mb-3">
                    <User size={32} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{userData.name}</h3>
                  <p className="text-gray-400 text-sm">Event Participant</p>
                </div>

                {/* Profile Details */}
                <div className="space-y-4">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Mail className="w-4 h-4 text-[#E63946] mr-3" />
                      <span className="text-gray-400 text-sm">Email</span>
                    </div>
                    <p className="text-white text-sm">{userData.email}</p>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Linkedin className="w-4 h-4 text-[#E63946] mr-3" />
                      <span className="text-gray-400 text-sm">Professional Profile</span>
                    </div>
                    <a
                      href={userData.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition-colors text-sm underline"
                    >
                      View LinkedIn Profile
                    </a>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Users className="w-4 h-4 text-[#E63946] mr-3" />
                      <span className="text-gray-400 text-sm">Networking</span>
                    </div>
                    <p className="text-white text-sm">
                      Following: <span className="text-[#E63946] font-semibold">{followingList.length}</span> participants
                    </p>
                  </div>
                </div>

                {/* Emergency Section */}
                <div className="mt-6 p-4 bg-[#E63946]/10 border border-[#E63946]/20 rounded-lg">
                  <h4 className="text-[#E63946] font-semibold mb-3 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Need Help?
                  </h4>
                  <button className="w-full bg-[#E63946] hover:bg-[#C5303E] text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center">
                    <Phone className="w-4 h-4 mr-2" />
                    Emergency Contact
                  </button>
                  <p className="text-[#E63946] text-xs text-center mt-2">
                    24/7 Support: +1 (555) 123-4567
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex space-x-3">
                  <button
                    onClick={() => setShowProfileModal(false)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;