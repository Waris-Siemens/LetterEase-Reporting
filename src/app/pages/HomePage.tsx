import React, { useRef } from 'react';
import { useNavigate } from 'react-router';
import { Upload, FileSpreadsheet, TrendingUp, Calendar, LogOut, Trash2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { parseExcelFile } from '../utils/excelParser';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { toast } from 'sonner';
import { SampleDataGenerator } from '../components/SampleDataGenerator';

export function HomePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data, setData, clearData } = useData();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast.error('Please upload a valid Excel file (.xlsx or .xls)');
      return;
    }

    setIsProcessing(true);
    try {
      const processedData = await parseExcelFile(file);
      
      if (processedData.records.length === 0) {
        toast.error('No valid data found in the Excel file');
        setIsProcessing(false);
        return;
      }

      setData(processedData);
      toast.success(`Successfully processed ${processedData.records.length} records from ${processedData.years.length} years`);
      
      // Navigate to the most recent year
      if (processedData.years.length > 0) {
        navigate(`/dashboard/${processedData.years[0]}`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to process Excel file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      clearData();
      toast.success('All data has been cleared');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                <TrendingUp className="size-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">LetterEase</h1>
                <p className="text-sm text-slate-400">Excel to Interactive Dashboard Generator</p>
              </div>
            </div>
            <Button
              onClick={logout}
              variant="outline"
              size="sm"
              className="border-slate-700 hover:border-red-500 hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut className="size-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {!data ? (
          // Upload Section
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Stop Building Dashboards
              </h2>
              <p className="text-xl text-slate-400">
                Just upload Excel and get instant reporting
              </p>
            </div>

            {/* Upload Card */}
            <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
              <CardContent className="p-12">
                <div
                  className="border-2 border-dashed border-slate-700 rounded-lg p-12 text-center hover:border-cyan-500 transition-colors cursor-pointer"
                  onClick={handleUploadClick}
                >
                  <div className="size-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-4">
                    <Upload className="size-8 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Upload Excel File</h3>
                  <p className="text-slate-400 mb-4">
                    Click to browse or drag and drop your .xlsx file
                  </p>
                  <Button 
                    disabled={isProcessing}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                  >
                    {isProcessing ? (
                      <>
                        <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <FileSpreadsheet className="size-4 mr-2" />
                        Select File
                      </>
                    )}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {/* Requirements */}
                <div className="mt-8 p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                  <h4 className="font-semibold mb-2 text-cyan-400">Required Columns:</h4>
                  <ul className="text-sm text-slate-400 space-y-1">
                    <li>• Requested Date (or Date)</li>
                    <li>• Country Name (or Country)</li>
                    <li>• Region</li>
                    <li>• Letter ID (or ID) - optional</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <Card className="border-slate-800 bg-slate-900/30 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="size-12 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="size-6 text-cyan-400" />
                  </div>
                  <h4 className="font-semibold mb-1">Interactive Charts</h4>
                  <p className="text-sm text-slate-400">Monthly line charts with country breakdown</p>
                </CardContent>
              </Card>

              <Card className="border-slate-800 bg-slate-900/30 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="size-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-3">
                    <Calendar className="size-6 text-blue-400" />
                  </div>
                  <h4 className="font-semibold mb-1">Year Navigation</h4>
                  <p className="text-sm text-slate-400">Separate dashboards for each year</p>
                </CardContent>
              </Card>

              <Card className="border-slate-800 bg-slate-900/30 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="size-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-3">
                    <FileSpreadsheet className="size-6 text-purple-400" />
                  </div>
                  <h4 className="font-semibold mb-1">Smart Filters</h4>
                  <p className="text-sm text-slate-400">Region and country multi-select</p>
                </CardContent>
              </Card>
            </div>

            {/* Sample Data Generator */}
            <div className="mt-6 flex justify-center">
              <SampleDataGenerator />
            </div>
          </div>
        ) : (
          // Years List
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Available Years</h2>
              <p className="text-slate-400">
                {data.records.length.toLocaleString()} total records • Last updated: {data.lastUpdated.toLocaleDateString()}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {data.years.map((year) => {
                const yearRecords = data.records.filter(r => r.year === year);
                return (
                  <Card
                    key={year}
                    className="border-slate-800 bg-slate-900/50 backdrop-blur-sm hover:border-cyan-500 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/dashboard/${year}`)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="size-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                          <Calendar className="size-6" />
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-cyan-400">{year}</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Total Letters</span>
                          <span className="font-semibold">{yearRecords.length.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Countries</span>
                          <span className="font-semibold">{new Set(yearRecords.map(r => r.country)).size}</span>
                        </div>
                      </div>
                      <Button 
                        className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                      >
                        View Dashboard
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Upload New File */}
            <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-1">Upload New File</h3>
                    <p className="text-sm text-slate-400">Replace current data with a new Excel file</p>
                  </div>
                  <Button
                    onClick={handleUploadClick}
                    variant="outline"
                    className="border-slate-700 hover:border-cyan-500 hover:bg-cyan-500/10"
                  >
                    <Upload className="size-4 mr-2" />
                    Upload
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Clear Data */}
            <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-1">Clear Data</h3>
                    <p className="text-sm text-slate-400">Remove all current data</p>
                  </div>
                  <Button
                    onClick={handleClearData}
                    variant="outline"
                    className="border-slate-700 hover:border-red-500 hover:bg-red-500/10"
                  >
                    <Trash2 className="size-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}