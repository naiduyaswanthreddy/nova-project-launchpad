
import React, { useState } from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tag as TagIcon, Plus, Trash2 } from 'lucide-react';
import { Tag } from '@/types/task';
import { toast } from 'sonner';

const colorOptions = [
  { name: 'Blue', value: 'bg-blue-100 text-blue-800' },
  { name: 'Green', value: 'bg-green-100 text-green-800' },
  { name: 'Red', value: 'bg-red-100 text-red-800' },
  { name: 'Purple', value: 'bg-purple-100 text-purple-800' },
  { name: 'Yellow', value: 'bg-yellow-100 text-yellow-800' },
  { name: 'Indigo', value: 'bg-indigo-100 text-indigo-800' },
  { name: 'Pink', value: 'bg-pink-100 text-pink-800' },
  { name: 'Gray', value: 'bg-gray-100 text-gray-800' },
];

const Tags = () => {
  const { tags, addTag, deleteTag } = useTaskContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].value);

  const handleAddTag = () => {
    if (!newTagName.trim()) {
      toast.error('Tag name cannot be empty');
      return;
    }

    addTag({
      name: newTagName.trim(),
      color: selectedColor,
    });

    setNewTagName('');
    setSelectedColor(colorOptions[0].value);
    setIsDialogOpen(false);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tags</h1>
        <Button onClick={() => setIsDialogOpen(true)} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" /> New Tag
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tags.map((tag) => (
          <TagCard key={tag.id} tag={tag} onDelete={deleteTag} />
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Tag</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="tagName">Tag Name</Label>
              <Input
                id="tagName"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Enter tag name"
              />
            </div>
            <div className="space-y-2">
              <Label>Tag Color</Label>
              <div className="grid grid-cols-4 gap-2">
                {colorOptions.map((color) => (
                  <div
                    key={color.value}
                    className={`h-8 rounded cursor-pointer border-2 ${
                      selectedColor === color.value
                        ? 'border-primary'
                        : 'border-transparent'
                    }`}
                    onClick={() => setSelectedColor(color.value)}
                  >
                    <div
                      className={`h-full w-full rounded ${color.value.split(' ')[0]}`}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTag}>Create Tag</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const TagCard = ({ tag, onDelete }: { tag: Tag; onDelete: (id: string) => void }) => {
  return (
    <Card className="animate-slide-up">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center">
          <TagIcon className="h-4 w-4 mr-2" />
          {tag.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div className={`w-full h-6 rounded ${tag.color.split(' ')[0]}`}></div>
      </CardContent>
      <CardFooter>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive ml-auto"
          onClick={() => onDelete(tag.id)}
        >
          <Trash2 className="h-4 w-4 mr-1" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Tags;
