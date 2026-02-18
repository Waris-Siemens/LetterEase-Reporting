import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ProcessedData } from '../utils/excelParser';

interface DataContextType {
  data: ProcessedData | null;
  setData: (data: ProcessedData | null, password?: string) => Promise<void>;
  clearData: (password: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const API_URL = '/api/data';
const STORAGE_KEY = 'letterease_dashboard_data';

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<ProcessedData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useLocalStorage, setUseLocalStorage] = useState(true);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Try to load from API first
      try {
        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const result = await response.json();
          
          if (result.data) {
            // Convert date strings back to Date objects
            if (result.data.lastUpdated) {
              result.data.lastUpdated = new Date(result.data.lastUpdated);
            }
            if (result.data.records) {
              result.data.records = result.data.records.map((record: any) => ({
                ...record,
                date: new Date(record.date),
              }));
            }
            setDataState(result.data);
            setUseLocalStorage(false);
            setIsLoading(false);
            return;
          }
        }
      } catch (apiError) {
        console.log('API not available, using localStorage fallback');
      }

      // Fallback to localStorage
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
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load data');
      setDataState(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Save data
  const setData = async (newData: ProcessedData | null, password?: string) => {
    if (!newData) {
      setDataState(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Try to save to API if available
      if (!useLocalStorage && password) {
        try {
          const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: newData, password }),
          });

          if (response.ok) {
            setDataState(newData);
            setIsLoading(false);
            return;
          }
        } catch (apiError) {
          console.log('API save failed, falling back to localStorage');
        }
      }

      // Fallback to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      setDataState(newData);
    } catch (err) {
      console.error('Failed to save data:', err);
      setError(err instanceof Error ? err.message : 'Failed to save data');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Clear all data
  const clearData = async (password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Try to clear from API if available
      if (!useLocalStorage) {
        try {
          const response = await fetch(API_URL, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password }),
          });

          if (response.ok) {
            setDataState(null);
            localStorage.removeItem(STORAGE_KEY);
            setIsLoading(false);
            return;
          }
        } catch (apiError) {
          console.log('API delete failed, falling back to localStorage');
        }
      }

      // Fallback to localStorage
      localStorage.removeItem(STORAGE_KEY);
      setDataState(null);
    } catch (err) {
      console.error('Failed to delete data:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete data');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state
  if (isLoading && data === null) {
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
    <DataContext.Provider value={{ data, setData, clearData, isLoading, error }}>
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
