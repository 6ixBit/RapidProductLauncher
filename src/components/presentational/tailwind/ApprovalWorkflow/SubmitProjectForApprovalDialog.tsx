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
import { Check } from 'lucide-react';
import { useState } from 'react';

type Props = {
  onSubmit: () => void;
};

export const SubmitProjectForApprovalDialog = ({ onSubmit }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="success" size="xs">
          <Check /> Submit for Approval
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Submit Project for Approval</DialogTitle>
          <DialogDescription>
            Are you sure you want to submit this project for approval?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="success"
            onClick={() => {
              onSubmit();
              setOpen(false);
            }}
          >
            Yes, submit
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
