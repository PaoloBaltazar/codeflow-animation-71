import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Task } from "@/types/task";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

interface TaskFormProps {
  onTaskCreated: (task: Task) => void;
}

export const TaskForm = ({ onTaskCreated }: TaskFormProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("medium");
  const [assignedTo, setAssignedTo] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create tasks",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    const newTask = {
      title,
      deadline,
      priority,
      status: "pending" as const,
      created_by: user.email || "Unknown",
      assigned_to: assignedTo,
      user_id: user.id,
    };

    const { data, error } = await supabase
      .from('tasks')
      .insert([newTask])
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
      return;
    }

    // Cast the data to Task type since we know the structure matches
    const taskWithCorrectTypes = {
      ...data,
      priority: data.priority as Task["priority"],
      status: data.status as Task["status"]
    } satisfies Task;

    onTaskCreated(taskWithCorrectTypes);
    toast({
      title: "Success",
      description: "Task created successfully",
    });
    
    setTitle("");
    setDeadline("");
    setPriority("medium");
    setAssignedTo("");
    setOpen(false);
  };

  // Mock users list - in a real app this would come from your users database
  const users = ["John Doe", "Jane Smith", "Bob Johnson"];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Create Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Create a new task and assign it to a team member.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Task Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              className="w-full"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="deadline" className="text-sm font-medium">
              Deadline
            </label>
            <Input
              id="deadline"
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="priority" className="text-sm font-medium">
              Priority
            </label>
            <Select
              value={priority}
              onValueChange={(value: Task["priority"]) => setPriority(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="assignedTo" className="text-sm font-medium">
              Assign To
            </label>
            <Select
              value={assignedTo}
              onValueChange={setAssignedTo}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select assignee" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user} value={user}>
                    {user}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Task</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};