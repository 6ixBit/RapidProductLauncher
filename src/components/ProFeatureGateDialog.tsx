'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ReactNode, useState } from 'react';
import { T, Typography } from './ui/Typography';
import { AspectRatio } from './ui/aspect-ratio';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';

export function ProFeatureGateDialog({
  organizationId,
  label,
  icon,
}: {
  organizationId: string;
  label: string;
  icon: ReactNode;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild className="w-full mb-0">
        <Button
          variant="ghost"
          className="justify-between items-center px-0 pr-2 -mb-2 hover:bg-accent/5 group relative overflow-hidden transition-all duration-300"
        >
          {/* Shimmer effect overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100">
            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          <div className="flex gap-2 items-center relative z-10">
            <div className="p-2 transition-transform duration-300 group-hover:scale-110">
              {icon}
            </div>
            <div className="flex flex-col items-start">
              <T.P className="text-sm font-medium group-hover:text-primary transition-colors">
                {label}
              </T.P>
              <T.P className="text-xs text-muted-foreground hidden group-hover:block transition-all">
                Unlock this feature →
              </T.P>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <T.P className="text-xs rounded-md px-2 py-1 uppercase font-medium bg-gradient-to-r from-primary/80 to-primary text-primary-foreground shadow-sm group-hover:shadow-primary/25 transition-all duration-300 group-hover:scale-105">
              Pro
            </T.P>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              ✨
            </motion.div>
          </div>
        </Button>
      </DialogTrigger>
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
          Unlock advanced features, unlimited team members, collaborative
          workspace and more.
        </Typography.P>
        <Link
          href={`/organization/${organizationId}/settings/billing`}
          className="w-full"
          onClick={() => setIsDialogOpen(false)}
        >
          <Button className="w-full">Upgrade to Pro</Button>
        </Link>
      </DialogContent>
    </Dialog>
  );
}
