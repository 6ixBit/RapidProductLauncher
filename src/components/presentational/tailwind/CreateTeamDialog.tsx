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
import { IoAddOutline } from 'react-icons/io5';

type CreateTeamDialogProps = {
  onConfirm: (teamTitle: string) => void;
  isLoading: boolean;
};

export function CreateTeamDialog({
  onConfirm,
  isLoading,
}: CreateTeamDialogProps) {
  const [teamTitle, setTeamTitle] = useState<string>('');
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onConfirm(teamTitle);
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="default" type="button" size="default">
            <div className="flex space-x-2 items-center">
              <span>
                <IoAddOutline className="text-lg" />
              </span>
              <span>Create Team</span>
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Team</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label className="space-y-2">
                <span>Team Name</span>
                <Input
                  value={teamTitle}
                  onChange={(event) => {
                    setTeamTitle(event.target.value);
                  }}
                  required
                  className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                  id="name"
                  type="text"
                  placeholder="Team Name"
                  disabled={isLoading}
                />
              </Label>
            </div>

            <DialogFooter>
              <Button type="submit" variant="success" disabled={isLoading}>
                Create Team
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
