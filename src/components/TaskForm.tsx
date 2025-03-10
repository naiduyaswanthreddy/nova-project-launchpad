
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Task, Priority, Status, Tag } from '@/types/task';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { useTaskContext } from '@/contexts/TaskContext';

interface TaskFormData {
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  hasDueDate: boolean;
  tagIds: string[];
}

interface TaskFormProps {
  task?: Task;
  onSubmit: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const TaskForm = ({ task, onSubmit, onCancel }: TaskFormProps) => {
  const { tags } = useTaskContext();
  const [selectedDueDate, setSelectedDueDate] = useState<Date | undefined>(
    task?.dueDate
  );
  const [hasDueDate, setHasDueDate] = useState<boolean>(!!task?.dueDate);

  const { register, handleSubmit, setValue, formState: { errors }, watch } = useForm<TaskFormData>({
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      status: task?.status || 'todo',
      priority: task?.priority || 'medium',
      hasDueDate: !!task?.dueDate,
      tagIds: task?.tags.map(tag => tag.id) || [],
    }
  });

  const watchHasDueDate = watch('hasDueDate');

  useEffect(() => {
    register('status');
    register('priority');
    register('tagIds', { required: false });
  }, [register]);

  const onFormSubmit = (data: TaskFormData) => {
    const selectedTags = tags.filter(tag => data.tagIds.includes(tag.id));
    
    onSubmit({
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      dueDate: data.hasDueDate ? selectedDueDate : undefined,
      tags: selectedTags,
    });
  };

  const handleTagToggle = (tagId: string) => {
    const currentTags = watch('tagIds') || [];
    const updatedTags = currentTags.includes(tagId)
      ? currentTags.filter(id => id !== tagId)
      : [...currentTags, tagId];
    
    setValue('tagIds', updatedTags);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Task title"
          {...register('title', { required: true })}
          className={errors.title ? 'border-red-500' : ''}
        />
        {errors.title && (
          <p className="text-red-500 text-sm">Title is required</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Task description"
          {...register('description')}
          className="min-h-[100px]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            defaultValue={task?.status || 'todo'}
            onValueChange={(value) => setValue('status', value as Status)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select
            defaultValue={task?.priority || 'medium'}
            onValueChange={(value) => setValue('priority', value as Priority)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="hasDueDate" 
            checked={hasDueDate}
            onCheckedChange={(checked) => {
              setHasDueDate(!!checked);
              setValue('hasDueDate', !!checked);
            }}
          />
          <label
            htmlFor="hasDueDate"
            className="text-sm font-medium leading-none cursor-pointer"
          >
            Set due date
          </label>
        </div>
        
        {hasDueDate && (
          <div className="mt-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDueDate ? (
                    format(selectedDueDate, 'PPP')
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDueDate}
                  onSelect={setSelectedDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2 mt-1">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                watch('tagIds')?.includes(tag.id)
                  ? tag.color
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => handleTagToggle(tag.id)}
            >
              {tag.name}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
