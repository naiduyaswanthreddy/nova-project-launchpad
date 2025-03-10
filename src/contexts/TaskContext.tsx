
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Task, Tag, Status, Priority } from '../types/task';
import { mockTasks, mockTags } from '../data/mockData';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

// Define the state type
interface TaskState {
  tasks: Task[];
  tags: Tag[];
}

// Define action types
type TaskAction =
  | { type: 'ADD_TASK'; payload: Omit<Task, 'id' | 'createdAt'> }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'UPDATE_TASK_STATUS'; payload: { id: string; status: Status } }
  | { type: 'ADD_TAG'; payload: Omit<Tag, 'id'> }
  | { type: 'DELETE_TAG'; payload: string };

// Create initial state
const initialState: TaskState = {
  tasks: mockTasks,
  tags: mockTags,
};

// Create the reducer
const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'ADD_TASK':
      const newTask: Task = {
        ...action.payload,
        id: uuidv4(),
        createdAt: new Date(),
      };
      toast.success('Task added successfully');
      return {
        ...state,
        tasks: [...state.tasks, newTask],
      };
    case 'DELETE_TASK':
      toast.success('Task deleted successfully');
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    case 'UPDATE_TASK':
      toast.success('Task updated successfully');
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case 'UPDATE_TASK_STATUS':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id
            ? { ...task, status: action.payload.status }
            : task
        ),
      };
    case 'ADD_TAG':
      const newTag: Tag = {
        ...action.payload,
        id: uuidv4(),
      };
      toast.success('Tag added successfully');
      return {
        ...state,
        tags: [...state.tags, newTag],
      };
    case 'DELETE_TAG':
      // Remove tag from all tasks first
      const updatedTasks = state.tasks.map((task) => ({
        ...task,
        tags: task.tags.filter((tag) => tag.id !== action.payload),
      }));
      toast.success('Tag deleted successfully');
      return {
        ...state,
        tags: state.tags.filter((tag) => tag.id !== action.payload),
        tasks: updatedTasks,
      };
    default:
      return state;
  }
};

// Create the context
interface TaskContextType extends TaskState {
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  deleteTask: (id: string) => void;
  updateTask: (task: Task) => void;
  updateTaskStatus: (id: string, status: Status) => void;
  addTag: (tag: Omit<Tag, 'id'>) => void;
  deleteTag: (id: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Create a provider component
export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    dispatch({ type: 'ADD_TASK', payload: task });
  };

  const deleteTask = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const updateTask = (task: Task) => {
    dispatch({ type: 'UPDATE_TASK', payload: task });
  };

  const updateTaskStatus = (id: string, status: Status) => {
    dispatch({ type: 'UPDATE_TASK_STATUS', payload: { id, status } });
  };

  const addTag = (tag: Omit<Tag, 'id'>) => {
    dispatch({ type: 'ADD_TAG', payload: tag });
  };

  const deleteTag = (id: string) => {
    dispatch({ type: 'DELETE_TAG', payload: id });
  };

  return (
    <TaskContext.Provider
      value={{
        tasks: state.tasks,
        tags: state.tags,
        addTask,
        deleteTask,
        updateTask,
        updateTaskStatus,
        addTag,
        deleteTag,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

// Create a hook to use the context
export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
