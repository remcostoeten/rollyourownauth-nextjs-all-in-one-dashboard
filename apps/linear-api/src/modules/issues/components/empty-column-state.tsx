'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface EmptyColumnStateProps {
  onCreateClick: () => void;
  columnTitle: string;
}

export function EmptyColumnState({ onCreateClick, columnTitle }: EmptyColumnStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col items-center justify-center h-32 p-4 rounded-lg border border-dashed border-[#2D2D2D] bg-[#141414] m-2"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground group flex flex-col gap-2 p-4"
          onClick={onCreateClick}
        >
          <motion.div
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <Plus className="w-5 h-5 group-hover:text-primary" />
          </motion.div>
          <span className="text-sm">
            No issues in {columnTitle}
          </span>
          <span className="text-xs text-muted-foreground">
            Click to create one
          </span>
        </Button>
      </motion.div>
    </motion.div>
  );
} 