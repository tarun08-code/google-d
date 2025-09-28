import React, { useState, useEffect } from 'react';
import { Trophy, Star, Linkedin, UserPlus, UserCheck, Medal, Crown, Award, Search } from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  title: string;
  company: string;
  linkedinUrl: string;
  avatar: string;
  activityScore: number;
  skills: string[];
  connections: number;
  projects: number;
  isFollowing: boolean;
}

interface LeaderboardProps {
  onFollow: (participantId: string) => void;
  onViewAll: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ onFollow, onViewAll }) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const mockParticipants: Participant[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      title: 'Senior Full Stack Developer',
      company: 'Google',
      linkedinUrl: 'https://linkedin.com/in/sarahchen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      activityScore: 950,
      skills: ['React', 'Node.js', 'AI/ML', 'Cloud Architecture'],
      connections: 2847,
      projects: 12,
      isFollowing: false
    },
    {
      id: '2',
      name: 'Alex Rodriguez',
      title: 'AI Research Engineer',
      company: 'Microsoft',
      linkedinUrl: 'https://linkedin.com/in/alexrodriguez',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      activityScore: 920,
      skills: ['Python', 'TensorFlow', 'Computer Vision', 'NLP'],
      connections: 1923,
      projects: 8,
      isFollowing: false
    },
    {
      id: '3',
      name: 'Priya Sharma',
      title: 'Product Manager',
      company: 'Meta',
      linkedinUrl: 'https://linkedin.com/in/priyasharma',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      activityScore: 885,
      skills: ['Product Strategy', 'Data Analytics', 'UX Design', 'Leadership'],
      connections: 3241,
      projects: 15,
      isFollowing: false
    },
    {
      id: '4',
      name: 'David Kim',
      title: 'Blockchain Developer',
      company: 'Coinbase',
      linkedinUrl: 'https://linkedin.com/in/davidkim',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      activityScore: 870,
      skills: ['Solidity', 'Web3', 'DeFi', 'Smart Contracts'],
      connections: 1567,
      projects: 6,
      isFollowing: false
    },
    {
      id: '5',
      name: 'Emily Johnson',
      title: 'DevOps Engineer',
      company: 'Amazon',
      linkedinUrl: 'https://linkedin.com/in/emilyjohnson',
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150',
      activityScore: 840,
      skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
      connections: 2156,
      projects: 9,
      isFollowing: false
    },
    {
      id: '6',
      name: 'Michael Zhang',
      title: 'Data Scientist',
      company: 'Netflix',
      linkedinUrl: 'https://linkedin.com/in/michaelzhang',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      activityScore: 810,
      skills: ['Python', 'R', 'Machine Learning', 'Statistics'],
      connections: 1834,
      projects: 11,
      isFollowing: false
    }
  ];

  useEffect(() => {
    setParticipants(mockParticipants);
  }, []);

  const getFilteredAndSortedParticipants = () => {
    const filtered = participants.filter(participant => {
      const matchesSearch = participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           participant.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           participant.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           participant.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesSearch;
    });
    return filtered.sort((a, b) => b.activityScore - a.activityScore);
  };

  const handleFollow = (participantId: string) => {
    setParticipants(prev =>
      prev.map(p =>
        p.id === participantId
          ? { ...p, isFollowing: !p.isFollowing }
          : p
      )
    );
    onFollow(participantId);
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 1:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 2:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-400">#{index + 1}</span>;
    }
  };

  const getRankBadgeColor = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 1:
        return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 2:
        return 'bg-gradient-to-r from-amber-400 to-amber-600';
      default:
        return 'bg-gradient-to-r from-gray-600 to-gray-700';
    }
  };

  const filteredParticipants = getFilteredAndSortedParticipants();

  return (
    <div className="bg-gray-900/30 backdrop-blur-md border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center mb-4 sm:mb-0">
          <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-[#E63946] mr-2 sm:mr-3" />
          <h3 className="text-lg sm:text-2xl font-bold text-white">Event Leaderboard</h3>
        </div>
        
        <div className="text-sm text-gray-400">
          Showing {filteredParticipants.length} of {participants.length}
        </div>
      </div>

      {/* Search Section */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search participants by name, title, company, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946] transition-colors"
          />
        </div>
      </div>

      <div className="text-center mb-6">
        <p className="text-gray-400 text-sm">
          🦈 <strong className="text-[#E63946]">Top Active Participants</strong> - Based on LinkedIn profiles and event engagement
        </p>
      </div>

      <div className="space-y-4">
        {filteredParticipants.length === 0 ? (
          <div className="text-center py-8">
            <Search className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-400 mb-2">No participants found</h3>
            <p className="text-gray-500">Try adjusting your search terms</p>
          </div>
        ) : (
          filteredParticipants.map((participant, index) => (
            <div
              key={participant.id}
              className={`relative bg-black/40 backdrop-blur-sm border border-gray-700 rounded-xl p-4 transition-all duration-300 hover:border-[#E63946]/50 hover:shadow-lg hover:shadow-[#E63946]/10 ${
                index < 3 ? 'ring-1 ring-yellow-500/20' : ''
              }`}
            >
              {/* Rank Badge */}
              <div className={`absolute -top-2 -left-2 w-8 h-8 ${getRankBadgeColor(index)} rounded-full flex items-center justify-center shadow-lg`}>
                {getRankIcon(index)}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 ml-6 sm:ml-4">
                {/* Avatar and Basic Info */}
                <div className="flex items-center space-x-3 flex-shrink-0">
                  <div className="relative">
                    <img
                      src={participant.avatar}
                      alt={participant.name}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-[#E63946]/30"
                    />
                    {index < 3 && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#E63946] rounded-full flex items-center justify-center">
                        <Star className="w-2 h-2 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-white font-semibold text-sm sm:text-base truncate">
                      {participant.name}
                    </h4>
                    <p className="text-gray-400 text-xs sm:text-sm truncate">
                      {participant.title}
                    </p>
                    <p className="text-[#E63946] text-xs font-medium">
                      {participant.company}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex-1 flex justify-center">
                  <div className="bg-gray-800/50 rounded-lg p-3 min-w-[100px] text-center">
                    <div className="text-[#E63946] font-bold text-lg sm:text-xl">
                      {participant.activityScore}
                    </div>
                    <div className="text-gray-400 text-xs">
                      Activity Score
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-shrink-0">
                  <a
                    href={participant.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                  >
                    <Linkedin className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">LinkedIn</span>
                  </a>
                  <button
                    onClick={() => handleFollow(participant.id)}
                    className={`flex items-center justify-center px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                      participant.isFollowing
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-[#E63946] hover:bg-[#C5303E] text-white hover:scale-105'
                    }`}
                  >
                    {participant.isFollowing ? (
                      <>
                        <UserCheck className="w-4 h-4 mr-1" />
                        <span className="hidden sm:inline">Following</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-1" />
                        <span className="hidden sm:inline">Follow</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Skills */}
              <div className="mt-3 ml-6 sm:ml-4">
                <div className="flex flex-wrap gap-1">
                  {participant.skills.slice(0, 4).map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-2 py-1 bg-gray-700/50 text-gray-300 rounded text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                  {participant.skills.length > 4 && (
                    <span className="px-2 py-1 bg-gray-700/50 text-gray-400 rounded text-xs">
                      +{participant.skills.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Statistics Summary */}
      <div className="mt-6 grid grid-cols-2 gap-4 pt-6 border-t border-gray-700">
        <div className="text-center">
          <div className="text-[#E63946] font-bold text-lg sm:text-xl">
            {filteredParticipants.length}
          </div>
          <div className="text-gray-400 text-xs sm:text-sm">{searchTerm ? 'Found' : 'Participants'}</div>
        </div>
        <div className="text-center">
          <div className="text-[#E63946] font-bold text-lg sm:text-xl">
            {participants.filter(p => p.isFollowing).length}
          </div>
          <div className="text-gray-400 text-xs sm:text-sm">Following</div>
        </div>
      </div>

      {/* View All Participants Button */}
      <div className="mt-6 text-center">
        <button
          onClick={onViewAll}
          className="bg-[#E63946] hover:bg-[#C5303E] text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-[#E63946]/25"
        >
          View All Participants
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;