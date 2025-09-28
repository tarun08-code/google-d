import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Mail, Linkedin, LogOut, QrCode } from 'lucide-react';

interface UserData {
  name: string;
  email: string;
  linkedinUrl: string;
  registrationDate: string;
}

interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  type: 'registration' | 'ceremony' | 'hacking' | 'networking' | 'presentation';
}

const Dashboard: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);

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
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('isLoggedIn');
    window.location.href = '/';
  };

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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center">
              <h1 className="text-lg sm:text-2xl font-bold text-[#E63946]">HackEvent</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#E63946] rounded-full flex items-center justify-center">
                  <User size={12} className="text-white sm:hidden" />
                  <User size={16} className="text-white hidden sm:block" />
                </div>
                <span className="text-xs sm:text-sm text-gray-300 hidden xs:inline">{userData.name}</span>
              </div>
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

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
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

            {/* User Profile */}
            <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Your Profile</h3>

              <div className="space-y-3">
                <div className="flex items-center">
                  <User className="w-4 h-4 text-[#E63946] mr-3" />
                  <span className="text-gray-300">{userData.name}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-[#E63946] mr-3" />
                  <span className="text-gray-300">{userData.email}</span>
                </div>
                <div className="flex items-center">
                  <Linkedin className="w-4 h-4 text-[#E63946] mr-3" />
                  <a
                    href={userData.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-[#E63946] transition-colors text-sm truncate"
                  >
                    LinkedIn Profile
                  </a>
                </div>
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
      </div>
    </div>
  );
};

export default Dashboard;