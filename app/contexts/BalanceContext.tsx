"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface BalanceContextType {
  balance: number;
  refreshBalance: () => Promise<void>;
  updateBalance: (newBalance: number) => void;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

const BALANCE_STORAGE_KEY = 'user_balance';
const BALANCE_TIMESTAMP_KEY = 'user_balance_timestamp';
const BALANCE_CACHE_DURATION = 30000; // 30 seconds

// Helper to safely access sessionStorage
const getStoredBalance = (): number => {
  try {
    if (typeof window === 'undefined') return 0;
    
    const stored = sessionStorage.getItem(BALANCE_STORAGE_KEY);
    const timestamp = sessionStorage.getItem(BALANCE_TIMESTAMP_KEY);
    
    if (stored && timestamp) {
      const age = Date.now() - parseInt(timestamp);
      if (age < BALANCE_CACHE_DURATION) {
        return parseFloat(stored) || 0;
      }
    }
  } catch (error) {
    console.error("Error reading balance from storage:", error);
  }
  return 0;
};

const saveBalanceToStorage = (value: number): void => {
  try {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(BALANCE_STORAGE_KEY, value.toString());
    sessionStorage.setItem(BALANCE_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.error("Error saving balance to storage:", error);
  }
};

export function BalanceProvider({ 
  children
}: { 
  children: ReactNode;
}) {
  const [balance, setBalance] = useState<number>(0);
  const [isInitialized, setIsInitialized] = useState(false);

  const refreshBalance = async () => {
    try {
      const response = await fetch("/api/user/info");
      const data = await response.json();
      if (data.balance !== undefined) {
        setBalance(data.balance);
        saveBalanceToStorage(data.balance);
      }
    } catch (error) {
      console.error("Error refreshing balance:", error);
    }
  };

  const updateBalance = (newBalance: number) => {
    setBalance(newBalance);
    saveBalanceToStorage(newBalance);
  };

  // Initialize balance from storage on mount
  useEffect(() => {
    if (!isInitialized) {
      const storedBalance = getStoredBalance();
      setBalance(storedBalance);
      setIsInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch balance from API if no cached value or cache expired
  useEffect(() => {
    if (!isInitialized) return;
    
    const storedBalance = getStoredBalance();
    if (storedBalance === 0 && balance === 0) {
      // No cached balance, fetch from API
      refreshBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized]);

  return (
    <BalanceContext.Provider value={{ balance, refreshBalance, updateBalance }}>
      {children}
    </BalanceContext.Provider>
  );
}

export function useBalance() {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error("useBalance must be used within a BalanceProvider");
  }
  return context;
}
