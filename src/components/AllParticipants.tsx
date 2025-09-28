import React, { useState, useEffect } from 'react';
import { Users, Linkedin, UserPlus, UserCheck, ArrowLeft, Search, Filter } from 'lucide-react';

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

interface AllParticipantsProps {
  onFollow: (participantId: string) => void;
  onBack: () => void;
}

const AllParticipants: React.FC<AllParticipantsProps> = ({ onFollow, onBack }) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCompany, setFilterCompany] = useState('');

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
    },
    {
      id: '7',
      name: 'Jessica Martinez',
      title: 'UX/UI Designer',
      company: 'Adobe',
      linkedinUrl: 'https://linkedin.com/in/jessicamartinez',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      activityScore: 795,
      skills: ['Figma', 'Design Systems', 'Prototyping', 'User Research'],
      connections: 1342,
      projects: 7,
      isFollowing: false
    },
    {
      id: '8',
      name: 'Robert Taylor',
      title: 'Cybersecurity Specialist',
      company: 'CrowdStrike',
      linkedinUrl: 'https://linkedin.com/in/roberttaylor',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
      activityScore: 775,
      skills: ['Penetration Testing', 'SIEM', 'Risk Assessment', 'Compliance'],
      connections: 987,
      projects: 5,
      isFollowing: false
    },
    {
      id: '9',
      name: 'Lisa Wang',
      title: 'Mobile App Developer',
      company: 'Spotify',
      linkedinUrl: 'https://linkedin.com/in/lisawang',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      activityScore: 750,
      skills: ['React Native', 'Swift', 'Kotlin', 'Flutter'],
      connections: 1654,
      projects: 10,
      isFollowing: false
    },
    {
      id: '10',
      name: 'James Wilson',
      title: 'Machine Learning Engineer',
      company: 'OpenAI',
      linkedinUrl: 'https://linkedin.com/in/jameswilson',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
      activityScore: 730,
      skills: ['PyTorch', 'MLOps', 'Deep Learning', 'Computer Vision'],
      connections: 2103,
      projects: 13,
      isFollowing: false
    },
    {
      id: '11',
      name: 'Amanda Brown',
      title: 'Frontend Developer',
      company: 'Airbnb',
      linkedinUrl: 'https://linkedin.com/in/amandabrown',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      activityScore: 705,
      skills: ['Vue.js', 'CSS', 'TypeScript', 'Webpack'],
      connections: 876,
      projects: 6,
      isFollowing: false
    },
    {
      id: '12',
      name: 'Carlos Garcia',
      title: 'Backend Developer',
      company: 'Uber',
      linkedinUrl: 'https://linkedin.com/in/carlosgarcia',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      activityScore: 680,
      skills: ['Java', 'Spring Boot', 'Microservices', 'PostgreSQL'],
      connections: 1245,
      projects: 8,
      isFollowing: false
    },
    {
      id: '13',
      name: 'Rachel Green',
      title: 'Product Designer',
      company: 'Tesla',
      linkedinUrl: 'https://linkedin.com/in/rachelgreen',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      activityScore: 665,
      skills: ['Design Thinking', 'Prototyping', 'User Testing', 'Sketch'],
      connections: 1456,
      projects: 9,
      isFollowing: false
    },
    {
      id: '14',
      name: 'Daniel Lee',
      title: 'Software Architect',
      company: 'Apple',
      linkedinUrl: 'https://linkedin.com/in/daniellee',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      activityScore: 650,
      skills: ['System Design', 'Scalability', 'Distributed Systems', 'Swift'],
      connections: 1987,
      projects: 14,
      isFollowing: false
    },
    {
      id: '15',
      name: 'Sophie Anderson',
      title: 'Data Engineer',
      company: 'Snowflake',
      linkedinUrl: 'https://linkedin.com/in/sophieanderson',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      activityScore: 635,
      skills: ['Apache Spark', 'ETL', 'Data Warehousing', 'SQL'],
      connections: 1123,
      projects: 7,
      isFollowing: false
    },
    {
      id: '16',
      name: 'Kevin Thompson',
      title: 'Cloud Solutions Architect',
      company: 'AWS',
      linkedinUrl: 'https://linkedin.com/in/kevinthompson',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
      activityScore: 620,
      skills: ['AWS', 'Terraform', 'CloudFormation', 'Docker'],
      connections: 1789,
      projects: 11,
      isFollowing: false
    },
    {
      id: '17',
      name: 'Maya Patel',
      title: 'QA Engineer',
      company: 'Atlassian',
      linkedinUrl: 'https://linkedin.com/in/mayapatel',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      activityScore: 605,
      skills: ['Test Automation', 'Selenium', 'API Testing', 'CI/CD'],
      connections: 934,
      projects: 6,
      isFollowing: false
    },
    {
      id: '18',
      name: 'Ryan Miller',
      title: 'Site Reliability Engineer',
      company: 'Stripe',
      linkedinUrl: 'https://linkedin.com/in/ryanmiller',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
      activityScore: 590,
      skills: ['Kubernetes', 'Monitoring', 'Incident Response', 'Go'],
      connections: 1567,
      projects: 8,
      isFollowing: false
    },
    {
      id: '19',
      name: 'Natalie Davis',
      title: 'Technical Writer',
      company: 'MongoDB',
      linkedinUrl: 'https://linkedin.com/in/nataliedavis',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      activityScore: 575,
      skills: ['Documentation', 'API Docs', 'Technical Communication', 'Markdown'],
      connections: 678,
      projects: 4,
      isFollowing: false
    },
    {
      id: '20',
      name: 'Mark Johnson',
      title: 'DevSecOps Engineer',
      company: 'GitLab',
      linkedinUrl: 'https://linkedin.com/in/markjohnson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      activityScore: 560,
      skills: ['Security Scanning', 'GitLab CI', 'Container Security', 'Python'],
      connections: 1234,
      projects: 9,
      isFollowing: false
    }
  ];

  useEffect(() => {
    setParticipants(mockParticipants);
  }, []);

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

  const filteredParticipants = participants.filter(participant => {
    const matchesSearch = participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCompany = filterCompany === '' || participant.company === filterCompany;
    return matchesSearch && matchesCompany;
  });

  const companies = [...new Set(participants.map(p => p.company))].sort();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="flex items-center">
                <Users className="w-6 h-6 text-[#E63946] mr-3" />
                <h1 className="text-xl sm:text-2xl font-bold text-white">All Participants</h1>
                <span className="ml-3 px-3 py-1 bg-[#E63946] text-white text-sm rounded-full">
                  {filteredParticipants.length} of {participants.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="mb-8 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, title, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946]"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={filterCompany}
              onChange={(e) => setFilterCompany(e.target.value)}
              className="pl-10 pr-8 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946] appearance-none"
            >
              <option value="">All Companies</option>
              {companies.map(company => (
                <option key={company} value={company}>{company}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Participants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredParticipants.map((participant) => (
            <div
              key={participant.id}
              className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 hover:border-[#E63946]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#E63946]/10"
            >
              {/* Participant Number */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-8 h-8 bg-[#E63946] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {participants.findIndex(p => p.id === participant.id) + 1}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-[#E63946] font-bold text-lg">
                    {participant.activityScore}
                  </div>
                  <div className="text-gray-400 text-xs">Score</div>
                </div>
              </div>

              {/* Avatar and Info */}
              <div className="text-center mb-4">
                <img
                  src={participant.avatar}
                  alt={participant.name}
                  className="w-20 h-20 rounded-full object-cover border-3 border-[#E63946]/30 mx-auto mb-3"
                />
                <h3 className="text-white font-semibold text-lg mb-1">{participant.name}</h3>
                <p className="text-gray-400 text-sm mb-1">{participant.title}</p>
                <p className="text-[#E63946] text-sm font-medium">{participant.company}</p>
              </div>

              {/* Skills */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1 justify-center">
                  {participant.skills.slice(0, 3).map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-2 py-1 bg-gray-700/50 text-gray-300 rounded text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                  {participant.skills.length > 3 && (
                    <span className="px-2 py-1 bg-gray-700/50 text-gray-400 rounded text-xs">
                      +{participant.skills.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <a
                  href={participant.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </a>
                <button
                  onClick={() => handleFollow(participant.id)}
                  className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg transition-all text-sm font-medium ${participant.isFollowing
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-[#E63946] hover:bg-[#C5303E] text-white'
                    }`}
                >
                  {participant.isFollowing ? (
                    <>
                      <UserCheck className="w-4 h-4 mr-2" />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Follow
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredParticipants.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No participants found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Back to Dashboard */}
        <div className="mt-12 text-center">
          <button
            onClick={onBack}
            className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllParticipants;