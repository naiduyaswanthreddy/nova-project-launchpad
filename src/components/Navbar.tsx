
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronDown, LayoutDashboard, List, Tag, Settings, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  return (
    <nav className="border-b px-4 py-3 bg-background/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-primary mr-8">
            TaskFlow
          </Link>
          <div className="hidden md:flex space-x-1">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/" className="flex items-center">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/tasks" className="flex items-center">
                <List className="h-4 w-4 mr-2" />
                Tasks
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/tags" className="flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                Tags
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Account
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
