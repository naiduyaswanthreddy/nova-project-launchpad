
import { Task, Tag } from '../types/task';

export const mockTags: Tag[] = [
  { id: '1', name: 'Work', color: 'bg-blue-100 text-blue-800' },
  { id: '2', name: 'Personal', color: 'bg-purple-100 text-purple-800' },
  { id: '3', name: 'Urgent', color: 'bg-red-100 text-red-800' },
  { id: '4', name: 'Learning', color: 'bg-green-100 text-green-800' },
  { id: '5', name: 'Meeting', color: 'bg-yellow-100 text-yellow-800' },
];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Complete project proposal',
    description: 'Draft and finalize the project proposal for the client meeting',
    status: 'todo',
    priority: 'high',
    dueDate: new Date(2023, 11, 25),
    tags: [mockTags[0], mockTags[2]],
    createdAt: new Date(2023, 11, 20)
  },
  {
    id: '2',
    title: 'Schedule doctor appointment',
    description: 'Call the clinic and schedule a checkup appointment',
    status: 'todo',
    priority: 'medium',
    dueDate: new Date(2023, 11, 28),
    tags: [mockTags[1]],
    createdAt: new Date(2023, 11, 19)
  },
  {
    id: '3',
    title: 'Learn React hooks',
    description: 'Go through the documentation and practice using React hooks',
    status: 'in-progress',
    priority: 'low',
    tags: [mockTags[3]],
    createdAt: new Date(2023, 11, 15)
  },
  {
    id: '4',
    title: 'Team standup meeting',
    description: 'Prepare notes for the daily team standup',
    status: 'completed',
    priority: 'medium',
    dueDate: new Date(2023, 11, 22),
    tags: [mockTags[0], mockTags[4]],
    createdAt: new Date(2023, 11, 21)
  },
  {
    id: '5',
    title: 'Workout session',
    description: 'Complete 45-minute workout routine',
    status: 'todo',
    priority: 'low',
    tags: [mockTags[1]],
    createdAt: new Date(2023, 11, 18)
  },
  {
    id: '6',
    title: 'Review code pull request',
    description: 'Review and provide feedback on team member\'s code',
    status: 'in-progress',
    priority: 'high',
    dueDate: new Date(2023, 11, 23),
    tags: [mockTags[0], mockTags[2]],
    createdAt: new Date(2023, 11, 21)
  },
];
