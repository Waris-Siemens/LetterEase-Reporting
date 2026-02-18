import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, RefreshCw, Calendar, Filter as FilterIcon, Database, AlertCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { MonthlyChart } from '../components/MonthlyChart';
import {
  getMonthlyDataForYear,
  getTotalLettersForYear,
  getCountriesForRegions,
  getCountryBreakdown
} from '../utils/excelParser';
import { Checkbox } from '../components/ui/checkbox';
import { ScrollArea } from '../components/ui/scroll-area';

export function DashboardPage() {
  const { year } = useParams<{ year: string }>();
  const navigate = useNavigate();
  const { data } = useData();

  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [availableCountries, setAvailableCountries] = useState<string[]>([]);

  useEffect(() => {
    if (!data) {
      // Don't redirect - let the component render the "no data" state
      return;
    }

    // Validate that the year exists in the data
    if (year && !data.years.includes(parseInt(year))) {
      // Don't redirect - let the component handle it
      return;
    }

    // Update available countries based on selected regions
    if (selectedRegions.length > 0) {
      const countries = getCountriesForRegions(data.records, selectedRegions);
      setAvailableCountries(countries);
      // Clear selected countries that are no longer available
      setSelectedCountries(prev => prev.filter(c => countries.includes(c)));
    } else {
      setAvailableCountries(data.countries);
    }
  }, [data, selectedRegions, navigate]);

  // No data available - show empty state
  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center p-6">
        <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm max-w-2xl w-full">
          <CardContent className="p-12 text-center">
            <div className="size-20 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-6">
              <Database className="size-10 text-cyan-400" />
            </div>
            <h1 className="text-3xl font-bold mb-3">No Dashboard Data Available</h1>
            <p className="text-slate-400 mb-6 text-lg">
              This dashboard is waiting for data to be uploaded by the administrator.
            </p>
            
            <div className="bg-slate-800/50 rounded-lg p-6 mb-6 text-left border border-slate-700">
              <div className="flex items-start gap-3">
                <AlertCircle className="size-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-slate-300 space-y-2">
                  <p><strong className="text-white">For Admins:</strong> Please log in and upload an Excel file to populate this dashboard.</p>
                  <p><strong className="text-white">For Viewers:</strong> Contact your administrator to upload data. Once uploaded, dashboards will be accessible at this URL.</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="border-slate-700 hover:border-cyan-500 hover:bg-cyan-500/10"
              >
                <RefreshCw className="size-4 mr-2" />
                Refresh Page
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!year) {
    return null;
  }

  const yearNumber = parseInt(year);
  
  // Requested year doesn't exist in data
  if (!data.years.includes(yearNumber)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
        {/* Header */}
        <div className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm">
          <div className="max-w-[1600px] mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/dashboard/${data.years[0]}`)}
                  className="hover:bg-slate-800"
                >
                  <ArrowLeft className="size-4 mr-2" />
                  Back
                </Button>
                <div className="h-8 w-px bg-slate-700" />
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                    <Calendar className="size-4" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold">LetterEase – Reporting Dashboard</h1>
                  </div>
                </div>
              </div>

              {/* Year Navigation */}
              <div className="flex items-center gap-2">
                {data.years.map(y => (
                  <Button
                    key={y}
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/dashboard/${y}`)}
                    className="border-slate-700 hover:border-cyan-500 hover:bg-cyan-500/10"
                  >
                    {y}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* No Data for Year */}
        <div className="max-w-[1600px] mx-auto px-6 py-20">
          <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm max-w-2xl mx-auto">
            <CardContent className="p-12 text-center">
              <div className="size-16 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="size-8 text-amber-400" />
              </div>
              <h2 className="text-2xl font-bold mb-3">No Data for {year}</h2>
              <p className="text-slate-400 mb-6">
                There is no data available for the year {year}.
              </p>
              <p className="text-slate-400 mb-8">
                Available years: {data.years.join(', ')}
              </p>
              <Button
                onClick={() => navigate(`/dashboard/${data.years[0]}`)}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
              >
                View {data.years[0]} Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const monthlyData = getMonthlyDataForYear(
    data.records,
    yearNumber,
    selectedRegions,
    selectedCountries
  );

  const totalLetters = getTotalLettersForYear(
    data.records,
    yearNumber,
    selectedRegions,
    selectedCountries
  );

  const countryBreakdown = getCountryBreakdown(
    data.records,
    yearNumber,
    selectedRegions,
    selectedCountries
  );

  // Get countries to display in chart
  const displayCountries = selectedCountries.length > 0 
    ? selectedCountries 
    : availableCountries;

  const handleResetFilters = () => {
    setSelectedRegions([]);
    setSelectedCountries([]);
  };

  const handleRegionToggle = (region: string) => {
    setSelectedRegions(prev => {
      if (prev.includes(region)) {
        return prev.filter(r => r !== region);
      } else {
        return [...prev, region];
      }
    });
  };

  const handleCountryToggle = (country: string) => {
    setSelectedCountries(prev => {
      if (prev.includes(country)) {
        return prev.filter(c => c !== country);
      } else {
        return [...prev, country];
      }
    });
  };

  const handleSelectAllCountries = () => {
    if (selectedCountries.length === availableCountries.length) {
      setSelectedCountries([]);
    } else {
      setSelectedCountries([...availableCountries]);
    }
  };

  const handleSelectAllRegions = () => {
    if (selectedRegions.length === data.regions.length) {
      setSelectedRegions([]);
    } else {
      setSelectedRegions([...data.regions]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="hover:bg-slate-800"
              >
                <ArrowLeft className="size-4 mr-2" />
                Back
              </Button>
              <div className="h-8 w-px bg-slate-700" />
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                  <Calendar className="size-4" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">LetterEase – Reporting Dashboard – {year}</h1>
                  <p className="text-xs text-slate-400">
                    Last Updated: {data.lastUpdated.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Year Navigation */}
            <div className="flex items-center gap-2">
              {data.years.map(y => (
                <Button
                  key={y}
                  variant={y === yearNumber ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => navigate(`/dashboard/${y}`)}
                  className={
                    y === yearNumber
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600'
                      : 'border-slate-700 hover:border-cyan-500 hover:bg-cyan-500/10'
                  }
                >
                  {y}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Chart and KPI */}
          <div className="lg:col-span-3 space-y-6">
            {/* KPI Card */}
            <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Total Letters</p>
                    <p className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      {totalLetters.toLocaleString()}
                    </p>
                  </div>
                  <div className="size-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                    <FilterIcon className="size-8 text-cyan-400" />
                  </div>
                </div>
                {(selectedRegions.length > 0 || selectedCountries.length > 0) && (
                  <div className="mt-4 pt-4 border-t border-slate-800">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <FilterIcon className="size-3" />
                      <span>
                        {selectedRegions.length > 0 && `${selectedRegions.length} region(s)`}
                        {selectedRegions.length > 0 && selectedCountries.length > 0 && ', '}
                        {selectedCountries.length > 0 && `${selectedCountries.length} country(ies)`}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Chart Card */}
            <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-white">Monthly Letters Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {displayCountries.length === 0 ? (
                  <div className="h-[500px] flex items-center justify-center text-slate-400">
                    <div className="text-center">
                      <FilterIcon className="size-12 mx-auto mb-3 opacity-50" />
                      <p className="text-white">No data to display</p>
                      <p className="text-sm">Select a region or country to view data</p>
                    </div>
                  </div>
                ) : (
                  <MonthlyChart data={monthlyData} countries={displayCountries} />
                )}
              </CardContent>
            </Card>

            {/* Breakdown Panel */}
            {countryBreakdown.length > 0 && (
              <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Country Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {countryBreakdown.map(({ country, count }) => (
                      <div
                        key={country}
                        className="p-4 rounded-lg bg-slate-800/50 border border-slate-700"
                      >
                        <p className="text-sm text-slate-400 mb-1">{country}</p>
                        <p className="text-2xl font-bold text-cyan-400">
                          {count.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Filters */}
          <div className="lg:col-span-1 space-y-6">
            {/* Filters Card */}
            <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Filters</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResetFilters}
                    className="hover:bg-slate-800"
                  >
                    <RefreshCw className="size-3 mr-1" />
                    Reset
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Region Filter */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-sm font-semibold text-slate-300">
                      Region
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSelectAllRegions}
                      className="hover:bg-slate-800 h-auto py-1 px-2 text-xs"
                    >
                      {selectedRegions.length === data.regions.length ? 'Deselect All' : 'Select All'}
                    </Button>
                  </div>
                  <ScrollArea className="h-[200px] rounded-lg border border-slate-800 bg-slate-950/50 p-3">
                    <div className="space-y-2">
                      {data.regions.map(region => (
                        <div key={region} className="flex items-center space-x-2">
                          <Checkbox
                            id={`region-${region}`}
                            checked={selectedRegions.includes(region)}
                            onCheckedChange={() => handleRegionToggle(region)}
                            className="border-slate-600 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                          />
                          <label
                            htmlFor={`region-${region}`}
                            className="text-sm text-slate-300 cursor-pointer flex-1"
                          >
                            {region}
                          </label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {/* Country Filter */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-sm font-semibold text-slate-300">
                      Country
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSelectAllCountries}
                      className="hover:bg-slate-800 h-auto py-1 px-2 text-xs"
                    >
                      {selectedCountries.length === availableCountries.length ? 'Deselect All' : 'Select All'}
                    </Button>
                  </div>
                  <ScrollArea className="h-[300px] rounded-lg border border-slate-800 bg-slate-950/50 p-3">
                    <div className="space-y-2">
                      {availableCountries.map(country => (
                        <div key={country} className="flex items-center space-x-2">
                          <Checkbox
                            id={`country-${country}`}
                            checked={selectedCountries.includes(country)}
                            onCheckedChange={() => handleCountryToggle(country)}
                            className="border-slate-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                          />
                          <label
                            htmlFor={`country-${country}`}
                            className="text-sm text-slate-300 cursor-pointer flex-1"
                          >
                            {country}
                          </label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
