'use client';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { BsPlusLg } from 'react-icons/bs';

type CreateProjectDialogProps = {
  onConfirm: (projectTitle: string) => void;
  isLoading: boolean;
};

export function CreateProjectDialog({
  onConfirm,
  isLoading,
}: CreateProjectDialogProps) {
  const [projectTitle, setProjectTitle] = useState<string>('');
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onConfirm(projectTitle);
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <BsPlusLg className="text-white mr-2" />
            Create Project
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label className="space-y-2">
                <span>Project Name</span>
                <Input
                  value={projectTitle}
                  onChange={(event) => {
                    setProjectTitle(event.target.value);
                  }}
                  required
                  className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                  id="name"
                  type="text"
                  placeholder="Project Name"
                  disabled={isLoading}
                />
              </Label>
            </div>

            <DialogFooter>
              <Button variant="success" type="submit" disabled={isLoading}>
                Create Project
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={() => {
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
