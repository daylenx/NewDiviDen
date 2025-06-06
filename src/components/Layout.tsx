import React from 'react';
import Navigation from './Navigation';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser, logout } = useAuth();

  return (
    <div className="min-h-screen bg-solarized-base3 dark:bg-solarized-base03">
      <nav className="bg-solarized-base2 dark:bg-solarized-base02 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-solarized-base00 dark:text-solarized-base0">
                Dividend Tracker
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Navigation />
              <span className="text-solarized-base01 dark:text-solarized-base1">
                {currentUser?.email}
              </span>
              <button
                onClick={logout}
                className="bg-solarized-blue text-solarized-base3 px-4 py-2 rounded-md text-sm font-medium hover:bg-solarized-blue/80"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout; 