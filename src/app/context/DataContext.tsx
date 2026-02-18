import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ProcessedData } from '../utils/excelParser';

interface DataContextType {
  data: ProcessedData | null;
  setData: (data: ProcessedData | null, password: string) => Promise<void>;
  clearData: (password: string) => Promise<void>;
  reloadData: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const API_URL = '/api/data';
const IS_PRODUCTION = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<ProcessedData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from API on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Check if running on localhost
    if (!IS_PRODUCTION) {
      console.warn('⚠️ Running on localhost - Cloud storage API is not available locally!');
      setIsLoading(false);
      setError('Cloud storage only works on deployed Vercel URL. Please deploy to Vercel and set up Vercel KV.');
      setDataState(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔄 Fetching data from API:', API_URL);
      console.log('🌐 Current location:', window.location.href);
      
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

      // Check if response is HTML (API not found)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        console.error('❌ API returned HTML instead of JSON');
        console.error('This usually means:');
        console.error('1. The API route is not deployed correctly');
        console.error('2. Vercel routing is not configured properly');
        console.error('3. The build process did not include the API folder');
        console.log('🔍 Try visiting /api/health to test if API routes work');
        throw new Error('API endpoint not found. Make sure you have deployed to Vercel and set up Vercel KV storage. Try visiting /api/health to test API routes.');
      }

      if (!response.ok) {
        const result = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(result.error || 'Failed to fetch data from server');
      }

      const result = await response.json();
      console.log('✅ Data loaded successfully');
      
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
      } else {
        console.log('ℹ️ No data found in storage');
        setDataState(null);
      }
    } catch (err) {
      console.error('❌ Failed to load data from API:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data from server');
      setDataState(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Save data to API
  const setData = async (newData: ProcessedData | null, password: string) => {
    if (!newData) {
      setDataState(null);
      return;
    }

    if (!password) {
      throw new Error('Password is required to save data');
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: newData, password }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to save data to server');
      }

      setDataState(newData);
      
      // Reload data to ensure sync across all devices
      await loadData();
    } catch (err) {
      console.error('Failed to save data to API:', err);
      setError(err instanceof Error ? err.message : 'Failed to save data to server');
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

      const response = await fetch(API_URL, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to delete data from server');
      }

      setDataState(null);
    } catch (err) {
      console.error('Failed to delete data from API:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete data from server');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Reload data
  const reloadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      await loadData();
    } catch (err) {
      console.error('Failed to reload data from API:', err);
      setError(err instanceof Error ? err.message : 'Failed to reload data from server');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state
  if (isLoading && data === null && !error) {
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
    <DataContext.Provider value={{ data, setData, clearData, reloadData, isLoading, error }}>
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
