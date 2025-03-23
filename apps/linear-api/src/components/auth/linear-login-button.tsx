'use client';

import { motion } from 'framer-motion';
import { Button } from '@/shared/components/ui/button';
import { LINEAR_AUTH_URL } from '@/lib/auth/linear';

export function LinearLoginButton() {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button
        variant="outline"
        size="lg"
        className="w-full gap-2 bg-[#5E6AD2] hover:bg-[#4A54C5] text-white border-none"
        onClick={() => window.location.href = LINEAR_AUTH_URL}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2.83333 2H21.1667C21.6269 2 22 2.37309 22 2.83333V21.1667C22 21.6269 21.6269 22 21.1667 22H2.83333C2.37309 22 2 21.6269 2 21.1667V2.83333C2 2.37309 2.37309 2 2.83333 2ZM6.5 6.5H17.5V8.83333H6.5V6.5ZM17.5 10.5H6.5V12.8333H17.5V10.5ZM6.5 14.5H17.5V16.8333H6.5V14.5Z"
            fill="currentColor"
          />
        </svg>
        Continue with Linear
      </Button>
    </motion.div>
  );
} 