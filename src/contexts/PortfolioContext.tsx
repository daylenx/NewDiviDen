import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc, deleteField, updateDoc } from 'firebase/firestore';

export interface PortfolioItem {
  symbol: string;
  lastPrice: number;
  change: number;
  changePercent: number;
  quantity: number;
  paidPrice: number;
  daysGain: number;
  totalGain: number;
  totalGainPercent: number;
  value: number;
}

interface PortfolioContextType {
  portfolio: PortfolioItem[];
  loading: boolean;
  uploadPortfolio: (items: PortfolioItem[]) => Promise<void>;
  removePortfolio: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error('usePortfolio must be used within a PortfolioProvider');
  return context;
};

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!currentUser) {
        setPortfolio([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists() && Array.isArray(userDoc.data().portfolio)) {
        setPortfolio(userDoc.data().portfolio);
      } else {
        setPortfolio([]);
      }
      setLoading(false);
    };
    fetchPortfolio();
  }, [currentUser]);

  const uploadPortfolio = async (items: PortfolioItem[]) => {
    if (!currentUser) return;
    await setDoc(doc(db, 'users', currentUser.uid), { portfolio: items }, { merge: true });
    setPortfolio(items);
  };

  const removePortfolio = async () => {
    if (!currentUser) return;
    await updateDoc(doc(db, 'users', currentUser.uid), { portfolio: deleteField() });
    setPortfolio([]);
  };

  return (
    <PortfolioContext.Provider value={{ portfolio, loading, uploadPortfolio, removePortfolio }}>
      {children}
    </PortfolioContext.Provider>
  );
}; 