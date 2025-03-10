
import React from 'react';
import { Tag } from '@/types/task';
import { cn } from '@/lib/utils';

interface TaskTagProps {
  tag: Tag;
  className?: string;
}

const TaskTag = ({ tag, className }: TaskTagProps) => {
  return (
    <span className={cn('task-tag', tag.color, className)}>
      {tag.name}
    </span>
  );
};

export default TaskTag;
