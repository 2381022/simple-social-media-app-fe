import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

const RootLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="container mx-auto px-4 py-6"
      >
        <Outlet />
      </motion.main>
    </div>
  );
};

export default RootLayout;