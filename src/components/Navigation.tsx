import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
      <Link
        to="/"
        className={`${
          location.pathname === '/'
            ? 'border-solarized-blue text-solarized-base00 dark:text-solarized-base0'
            : 'border-transparent text-solarized-base01 dark:text-solarized-base1 hover:border-solarized-base1 dark:hover:border-solarized-base01 hover:text-solarized-base00 dark:hover:text-solarized-base0'
        } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
      >
        Home
      </Link>
      <Link
        to="/"
        className={`${
          location.pathname === '/'
            ? 'border-solarized-blue text-solarized-base00 dark:text-solarized-base0'
            : 'border-transparent text-solarized-base01 dark:text-solarized-base1 hover:border-solarized-base1 dark:hover:border-solarized-base01 hover:text-solarized-base00 dark:hover:text-solarized-base0'
        } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
      >
        Dashboard
      </Link>
      <Link
        to="/profile"
        className={`${
          location.pathname === '/profile'
            ? 'border-solarized-blue text-solarized-base00 dark:text-solarized-base0'
            : 'border-transparent text-solarized-base01 dark:text-solarized-base1 hover:border-solarized-base1 dark:hover:border-solarized-base01 hover:text-solarized-base00 dark:hover:text-solarized-base0'
        } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
      >
        Profile
      </Link>
      <Link
        to="/info"
        className={`${
          location.pathname === '/info'
            ? 'border-solarized-blue text-solarized-base00 dark:text-solarized-base0'
            : 'border-transparent text-solarized-base01 dark:text-solarized-base1 hover:border-solarized-base1 dark:hover:border-solarized-base01 hover:text-solarized-base00 dark:hover:text-solarized-base0'
        } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
      >
        Info
      </Link>
    </div>
  );
};

export default Navigation; 