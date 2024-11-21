'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';
import { Typography } from './ui/Typography';
import { AspectRatio } from './ui/aspect-ratio';
import { Button } from './ui/button';
import { Dialog, DialogContent } from './ui/dialog';

export function ProFeatureGateDialog({
  organizationId,
  label,
  icon,
  isOpen,
  onClose,
}: {
  organizationId: string;
  label: string;
  icon: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex flex-col gap-2 items-center hide-dialog-close">
        <AspectRatio
          ratio={16 / 9}
          className="rounded-lg overflow-hidden relative h-full "
        >
          <motion.div
            initial={{ scale: 5, filter: 'blur(5px)' }}
            animate={{ scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
            className="absolute inset-0 w-full h-full z-20 flex place-content-center"
          >
            <Image
              src="/assets/feature-pro-text.png"
              alt="Feature Pro"
              fill
              className="z-10"
            />
          </motion.div>
          <motion.div
            initial={{ scale: 2, filter: 'blur(2px)' }}
            animate={{ scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
            className="absolute inset-0 w-full h-full flex place-content-center"
          >
            <Image
              src="/assets/feature-pro.jpeg"
              alt="Feature Pro"
              fill
              className="z-10"
            />
          </motion.div>
        </AspectRatio>
        <div className="mt-4 flex gap-2.5 items-center justify-start">
          <Typography.H3 className="mt-0">Upgrade to</Typography.H3>
          <span className="px-2 text-sm text-primary-foreground rounded-md py-1 bg-primary flex place-content-center">
            PRO
          </span>
        </div>
        <Typography.P className="text-muted-foreground text-center mb-4">
          Unlock more SHopify stores, product imports, and advanced features by upgrading.
        </Typography.P>
        <Link
          href={`/organization/${organizationId}/settings/billing`}
          className="w-full"
          onClick={onClose}
        >
          <Button className="w-full">Upgrade Now</Button>
        </Link>
      </DialogContent>
    </Dialog>
  );
}
