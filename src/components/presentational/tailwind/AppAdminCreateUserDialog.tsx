import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import Plus from 'lucide-react/dist/esm/icons/plus';
import { useState } from 'react';
import { ZodError, z } from 'zod';
import { toast } from 'react-hot-toast';

type Props = {
  onSubmit: (email: string) => void;
  isLoading: boolean;
};

const emailSchema = z.string().email({ message: 'Invalid email address' });

export const AppAdminCreateUserDialog = ({ onSubmit, isLoading }: Props) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState<string>('');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <Plus /> Create User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
          <DialogDescription>
            Create a new user by entering their email address.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <Label className="space-y-2">
            <span>Email</span>
            <Input
              disabled={isLoading}
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </Label>
        </div>
        <DialogFooter>
          <Button
            disabled={isLoading}
            type="button"
            onClick={() => {
              try {
                const parsedEmail = emailSchema.parse(email);
                onSubmit(parsedEmail);
                setOpen(false);
              } catch (error) {
                if (error instanceof ZodError) {
                  toast.error(error.errors[0].message);
                  return;
                } else {
                  toast.error(error.message);
                }
              }
            }}
          >
            {isLoading ? 'Loading...' : 'Create User'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
