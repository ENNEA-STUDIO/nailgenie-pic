
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
  showBackButton?: boolean;
  title?: string;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  showBackButton = false, 
  title, 
  className = '' 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className={`page-container ${className}`}>
      {/* Header */}
      <header className="relative z-10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          {showBackButton && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => navigate(-1)}
              className="mr-3 p-2 rounded-full bg-secondary pressed-effect"
              aria-label="Back"
            >
              <ArrowLeft size={20} className="text-foreground" />
            </motion.button>
          )}
          {title && (
            <motion.h1 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-xl font-medium text-foreground"
            >
              {title}
            </motion.h1>
          )}
        </div>
        {isHomePage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-sm font-medium text-muted-foreground"
          >
            GeNails
          </motion.div>
        )}
      </header>

      {/* Main content */}
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 overflow-auto"
      >
        {children}
      </motion.main>
    </div>
  );
};

export default Layout;
