import React, { useState } from 'react';
import { 
  BarChart3, 
  Calendar, 
  Users, 
  LogOut,
  TrendingUp,
  Shield,
  Activity
} from 'lucide-react';
import EventManagement from './EventManagement';

interface AdminPanelProps {
  onLogout: () => void;
}

interface AnalyticsData {
  totalEvents: number;
  totalParticipants: number;
  activeEvents: number;
  completedEvents: number;
  growthRate: number;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const analyticsData: AnalyticsData = {
    totalEvents: 24,
    totalParticipants: 1847,
    activeEvents: 5,
    completedEvents: 19,
    growthRate: 23.5
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'events', label: 'Event Management', icon: Calendar },
  ];

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('adminLoginTime');
    onLogout();
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <div className="flex items-center space-x-2 text-gray-400">
                <Activity className="w-4 h-4" />
                <span className="text-sm">Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-[#E63946]/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-[#E63946]" />
                  </div>
                  <span className="text-green-400 text-sm font-medium">+12%</span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{analyticsData.totalEvents}</div>
                <div className="text-gray-400 text-sm">Total Events</div>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                  <span className="text-green-400 text-sm font-medium">+{analyticsData.growthRate}%</span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{analyticsData.totalParticipants.toLocaleString()}</div>
                <div className="text-gray-400 text-sm">Total Participants</div>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                  </div>
                  <span className="text-green-400 text-sm font-medium">Live</span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{analyticsData.activeEvents}</div>
                <div className="text-gray-400 text-sm">Active Events</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Activity className="w-5 h-5 text-[#E63946] mr-2" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {[
                    { action: 'New event created', time: '2 min ago', type: 'event' },
                    { action: '15 new registrations', time: '5 min ago', type: 'participant' },
                    { action: 'Timeline updated for AI Workshop', time: '12 min ago', type: 'timeline' },
                    { action: 'Map uploaded for Main Hall', time: '1 hour ago', type: 'map' },
                    { action: 'Analytics report generated', time: '2 hours ago', type: 'report' },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'event' ? 'bg-[#E63946]' :
                          activity.type === 'participant' ? 'bg-blue-400' :
                          activity.type === 'timeline' ? 'bg-green-400' :
                          activity.type === 'map' ? 'bg-purple-400' :
                          'bg-gray-400'
                        }`} />
                        <span className="text-gray-300 text-sm">{activity.action}</span>
                      </div>
                      <span className="text-gray-500 text-xs">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Calendar className="w-5 h-5 text-[#E63946] mr-2" />
                  Upcoming Events
                </h3>
                <div className="space-y-4">
                  {[
                    { name: 'AI/ML Workshop', date: 'Mar 16, 2025', participants: 25, status: 'confirmed' },
                    { name: 'Networking Session', date: 'Mar 16, 2025', participants: 78, status: 'confirmed' },
                    { name: 'Final Presentations', date: 'Mar 17, 2025', participants: 156, status: 'pending' },
                  ].map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div>
                        <div className="text-white font-medium text-sm">{event.name}</div>
                        <div className="text-gray-400 text-xs">{event.date} • {event.participants} participants</div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        event.status === 'confirmed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {event.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'events':
        return <EventManagement />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900/50 backdrop-blur-md border-r border-gray-800 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#E63946] rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">HackEvent</h2>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4">
          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === item.id
                      ? 'bg-[#E63946] text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-red-500/20 transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;