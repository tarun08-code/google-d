// Mock data service for AI matchmaking demo
export interface MockParticipant {
  id: string;
  name: string;
  interests: string[];
  skills: string[];
  linkedinUsername: string;
  lookingFor: string;
  avatar?: string;
}

export const mockEventParticipants: MockParticipant[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    interests: ['Machine Learning', 'AI Ethics', 'Data Science', 'Python'],
    skills: ['TensorFlow', 'PyTorch', 'React', 'Node.js'],
    linkedinUsername: 'sarahchen-ai',
    lookingFor: 'AI collaboration and research opportunities',
  },
  {
    id: '2', 
    name: 'Alex Rodriguez',
    interests: ['Blockchain', 'Web3', 'DeFi', 'Smart Contracts'],
    skills: ['Solidity', 'Ethereum', 'React', 'TypeScript'],
    linkedinUsername: 'alexrod-blockchain',
    lookingFor: 'Blockchain startup partnerships',
  },
  {
    id: '3',
    name: 'Emma Thompson',
    interests: ['UX Design', 'Product Management', 'User Research', 'Design Systems'],
    skills: ['Figma', 'Adobe Creative Suite', 'User Testing', 'Prototyping'],
    linkedinUsername: 'emmathompson-ux',
    lookingFor: 'Product design mentorship and collaboration',
  },
  {
    id: '4',
    name: 'Marcus Johnson',
    interests: ['DevOps', 'Cloud Architecture', 'Kubernetes', 'Security'],
    skills: ['AWS', 'Docker', 'Terraform', 'CI/CD'],
    linkedinUsername: 'marcus-devops',
    lookingFor: 'Cloud infrastructure partnerships',
  },
  {
    id: '5',
    name: 'Priya Patel',
    interests: ['Frontend Development', 'React', 'Performance Optimization', 'Accessibility'],
    skills: ['React', 'Vue.js', 'TypeScript', 'WebGL'],
    linkedinUsername: 'priyapatel-frontend',
    lookingFor: 'Frontend architecture mentorship',
  },
  {
    id: '6',
    name: 'David Kim',
    interests: ['Startup Funding', 'Business Development', 'Marketing', 'Growth Hacking'],
    skills: ['Sales', 'Marketing Strategy', 'Analytics', 'Pitch Decks'],
    linkedinUsername: 'davidkim-growth',
    lookingFor: 'Startup co-founder and investment opportunities',
  },
  {
    id: '7',
    name: 'Lisa Wang',
    interests: ['Data Analytics', 'Business Intelligence', 'SQL', 'Tableau'],
    skills: ['Python', 'R', 'SQL', 'Power BI', 'Tableau'],
    linkedinUsername: 'lisawang-data',
    lookingFor: 'Data science project collaborations',
  },
  {
    id: '8',
    name: 'Roberto Silva',
    interests: ['Mobile Development', 'React Native', 'iOS', 'Android'],
    skills: ['Swift', 'Kotlin', 'React Native', 'Flutter'],
    linkedinUsername: 'roberto-mobile',
    lookingFor: 'Mobile app development partnerships',
  }
];

// Mock current user profile
export const mockCurrentUser: MockParticipant = {
  id: 'current',
  name: 'John Doe',
  interests: ['Web Development', 'React', 'TypeScript', 'AI Integration'],
  skills: ['React', 'Node.js', 'TypeScript', 'Python'],
  linkedinUsername: 'johndoe',
  lookingFor: 'Full-stack development opportunities and AI integration projects',
};

class MockDataService {
  getEventParticipants(): MockParticipant[] {
    return mockEventParticipants;
  }

  getCurrentUser(): MockParticipant {
    return mockCurrentUser;
  }

  // Simulate fetching user's connections or interests
  getUserInterests(userId: string): string[] {
    const user = [...mockEventParticipants, mockCurrentUser].find(p => p.id === userId);
    return user?.interests || [];
  }
}

export const mockDataService = new MockDataService();