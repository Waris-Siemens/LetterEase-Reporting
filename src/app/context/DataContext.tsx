import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ProcessedData } from '../utils/excelParser';

interface DataContextType {
  data: ProcessedData | null;
  setData: (data: ProcessedData | null) => void;
  clearData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEY = 'letterease_dashboard_data';

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<ProcessedData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        if (parsed.lastUpdated) {
          parsed.lastUpdated = new Date(parsed.lastUpdated);
        }
        if (parsed.records) {
          parsed.records = parsed.records.map((record: any) => ({
            ...record,
            date: new Date(record.date),
          }));
        }
        setDataState(parsed);
      }
    } catch (error) {
      console.error('Failed to load data from storage:', error);
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save data to localStorage whenever it changes
  const setData = (newData: ProcessedData | null) => {
    setDataState(newData);
    if (newData) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      } catch (error) {
        console.error('Failed to save data to storage:', error);
      }
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Clear all data
  const clearData = () => {
    setDataState(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Don't render children until data is loaded from storage
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="size-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading LetterEase...</p>
        </div>
      </div>
    );
  }

  return (
    <DataContext.Provider value={{ data, setData, clearData }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
