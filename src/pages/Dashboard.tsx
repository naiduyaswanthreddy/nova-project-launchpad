
import React, { useState } from 'react';
import { Task, Status } from '@/types/task';
import StatusColumn from '@/components/StatusColumn';
import TaskDialog from '@/components/TaskDialog';
import { useTaskContext } from '@/contexts/TaskContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Dashboard = () => {
  const { tasks } = useTaskContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const [initialStatus, setInitialStatus] = useState<string | undefined>(undefined);

  const todoTasks = tasks.filter((task) => task.status === 'todo');
  const inProgressTasks = tasks.filter((task) => task.status === 'in-progress');
  const completedTasks = tasks.filter((task) => task.status === 'completed');

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  const handleAddTask = (status?: Status) => {
    setSelectedTask(undefined);
    setInitialStatus(status);
    setIsDialogOpen(true);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Task Board</h1>
        <Button onClick={() => handleAddTask()} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" /> New Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 overflow-hidden">
        <div className="bg-muted/50 rounded-lg p-4 shadow-sm h-[calc(100vh-180px)] overflow-hidden flex flex-col">
          <StatusColumn
            status="todo"
            tasks={todoTasks}
            onTaskClick={handleTaskClick}
            onAddClick={() => handleAddTask('todo')}
          />
        </div>
        <div className="bg-muted/50 rounded-lg p-4 shadow-sm h-[calc(100vh-180px)] overflow-hidden flex flex-col">
          <StatusColumn
            status="in-progress"
            tasks={inProgressTasks}
            onTaskClick={handleTaskClick}
            onAddClick={() => handleAddTask('in-progress')}
          />
        </div>
        <div className="bg-muted/50 rounded-lg p-4 shadow-sm h-[calc(100vh-180px)] overflow-hidden flex flex-col">
          <StatusColumn
            status="completed"
            tasks={completedTasks}
            onTaskClick={handleTaskClick}
            onAddClick={() => handleAddTask('completed')}
          />
        </div>
      </div>

      <TaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        task={selectedTask}
        initialStatus={initialStatus}
      />
    </div>
  );
};

export default Dashboard;
