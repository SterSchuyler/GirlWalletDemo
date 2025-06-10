import { User } from './users';

export interface Chat {
  id: string;
  name: string;
  members: User[];
  lastMessage?: string;
}

export const mockChats: Chat[] = [
  {
    id: '1',
    name: 'Bachelorette Party',
    members: [
      { id: '1', name: 'Sarah Johnson', phoneNumber: '+1 (555) 123-4567' },
      { id: '2', name: 'Emily Chen', phoneNumber: '+1 (555) 234-5678' },
      { id: '3', name: 'Maria Garcia', phoneNumber: '+1 (555) 345-6789' },
    ],
    lastMessage: 'I found this amazing Airbnb with a private pool and hot tub! ',
  },
  {
    id: '2',
    name: 'Girl brunch 🥂',
    members: [
      { id: '4', name: 'Lisa Wong', phoneNumber: '+1 (555) 456-7890' },
      { id: '5', name: 'Rachel Kim', phoneNumber: '+1 (555) 567-8901' },
      { id: '6', name: 'Sophie Patel', phoneNumber: '+1 (555) 678-9012' },
    ],
    lastMessage: "Their bottomless mimosas are only $25! Who's in?",
  },
  {
    id: '3',
    name: 'Fries only',
    members: [
      { id: '7', name: 'Olivia Martinez', phoneNumber: '+1 (555) 789-0123' },
      { id: '8', name: 'Emma Thompson', phoneNumber: '+1 (555) 890-1234' },
      { id: '1', name: 'Sarah Johnson', phoneNumber: '+1 (555) 123-4567' },
    ],
    lastMessage: 'The hill I will die on: potato wedges are NOT fries',
  },
  {
    id: '4',
    name: 'Roommates',
    members: [
      { id: '2', name: 'Emily Chen', phoneNumber: '+1 (555) 234-5678' },
      { id: '3', name: 'Maria Garcia', phoneNumber: '+1 (555) 345-6789' },
      { id: '4', name: 'Lisa Wong', phoneNumber: '+1 (555) 456-7890' },
    ],
    lastMessage: 'Water + gas + electric + internet for May = $54.75 per person',
  },
  {
    id: '5',
    name: '🤠 COWGIRLS TRIP',
    members: [
      { id: '5', name: 'Rachel Kim', phoneNumber: '+1 (555) 567-8901' },
      { id: '6', name: 'Sophie Patel', phoneNumber: '+1 (555) 678-9012' },
      { id: '7', name: 'Olivia Martinez', phoneNumber: '+1 (555) 789-0123' },
    ],
    lastMessage: "I've never shot a gun before but I'm so excited!",
  },
]; 