'use client';

import { motion } from 'framer-motion';
import { LinearLoginButton } from '@/components/auth/linear-login-button';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090B]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md space-y-8 p-8"
      >
        <div className="text-center space-y-2">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-3xl font-bold text-white"
          >
            Welcome Back
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-muted-foreground"
          >
            Sign in to your Linear account to continue
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <LinearLoginButton />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="text-xs text-center text-muted-foreground mt-8"
        >
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </motion.p>
      </motion.div>
    </div>
  );
} 