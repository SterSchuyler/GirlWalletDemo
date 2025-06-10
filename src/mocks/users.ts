export interface User {
  id: string;
  name: string;
  phoneNumber: string;
  avatar?: string;
}

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    phoneNumber: '+1 (555) 123-4567',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    name: 'Emily Chen',
    phoneNumber: '+1 (555) 234-5678',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: '3',
    name: 'Maria Garcia',
    phoneNumber: '+1 (555) 345-6789',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: '4',
    name: 'Lisa Wong',
    phoneNumber: '+1 (555) 456-7890',
    avatar: 'https://i.pravatar.cc/150?img=4',
  },
  {
    id: '5',
    name: 'Rachel Kim',
    phoneNumber: '+1 (555) 567-8901',
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: '6',
    name: 'Sophie Patel',
    phoneNumber: '+1 (555) 678-9012',
    avatar: 'https://i.pravatar.cc/150?img=6',
  },
  {
    id: '7',
    name: 'Olivia Martinez',
    phoneNumber: '+1 (555) 789-0123',
    avatar: 'https://i.pravatar.cc/150?img=7',
  },
  {
    id: '8',
    name: 'Emma Thompson',
    phoneNumber: '+1 (555) 890-1234',
    avatar: 'https://i.pravatar.cc/150?img=8',
  },
]; 