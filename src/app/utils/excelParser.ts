import * as XLSX from 'xlsx';

export interface LetterRecord {
  requestedDate: Date;
  country: string;
  region: string;
  letterId: string;
  month: number;
  year: number;
  monthName: string;
}

export interface ProcessedData {
  records: LetterRecord[];
  years: number[];
  regions: string[];
  countries: string[];
  lastUpdated: Date;
}

export interface MonthlyData {
  month: string;
  monthNumber: number;
  [country: string]: string | number;
}

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export function parseExcelFile(file: File): Promise<ProcessedData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Parse and validate data
        const records: LetterRecord[] = [];
        const years = new Set<number>();
        const regions = new Set<string>();
        const countries = new Set<string>();

        jsonData.forEach((row: any) => {
          // Handle different possible column names
          const dateValue = row['Requested Date'] || row['RequestedDate'] || row['Date'];
          const countryValue = row['Country Name'] || row['Country'] || row['CountryName'];
          const regionValue = row['Region'];
          const letterIdValue = row['Letter ID'] || row['LetterId'] || row['ID'];

          if (!dateValue || !countryValue || !regionValue) {
            return; // Skip invalid rows
          }

          // Parse date
          let date: Date;
          if (typeof dateValue === 'number') {
            // Excel serial date
            date = XLSX.SSF.parse_date_code(dateValue);
            date = new Date(date.y, date.m - 1, date.d);
          } else if (typeof dateValue === 'string') {
            date = new Date(dateValue);
          } else {
            date = dateValue;
          }

          if (isNaN(date.getTime())) {
            return; // Skip invalid dates
          }

          const month = date.getMonth();
          const year = date.getFullYear();

          records.push({
            requestedDate: date,
            country: countryValue.trim(),
            region: regionValue.trim(),
            letterId: letterIdValue?.toString() || `${Date.now()}-${Math.random()}`,
            month,
            year,
            monthName: MONTH_NAMES[month]
          });

          years.add(year);
          regions.add(regionValue.trim());
          countries.add(countryValue.trim());
        });

        resolve({
          records,
          years: Array.from(years).sort((a, b) => b - a), // Descending order
          regions: Array.from(regions).sort(),
          countries: Array.from(countries).sort(),
          lastUpdated: new Date()
        });
      } catch (error) {
        reject(new Error('Failed to parse Excel file. Please check the format.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file.'));
    };

    reader.readAsBinaryString(file);
  });
}

export function getMonthlyDataForYear(
  records: LetterRecord[],
  year: number,
  selectedRegions: string[],
  selectedCountries: string[]
): MonthlyData[] {
  // Filter records
  let filteredRecords = records.filter(r => r.year === year);

  if (selectedRegions.length > 0) {
    filteredRecords = filteredRecords.filter(r => selectedRegions.includes(r.region));
  }

  if (selectedCountries.length > 0) {
    filteredRecords = filteredRecords.filter(r => selectedCountries.includes(r.country));
  }

  // Group by month and country
  const monthlyMap = new Map<number, Map<string, number>>();

  filteredRecords.forEach(record => {
    if (!monthlyMap.has(record.month)) {
      monthlyMap.set(record.month, new Map());
    }
    const countryMap = monthlyMap.get(record.month)!;
    countryMap.set(record.country, (countryMap.get(record.country) || 0) + 1);
  });

  // Convert to array format for recharts
  const monthlyData: MonthlyData[] = [];

  for (let month = 0; month < 12; month++) {
    const monthData: MonthlyData = {
      month: MONTH_NAMES[month],
      monthNumber: month
    };

    const countryMap = monthlyMap.get(month);
    if (countryMap) {
      countryMap.forEach((count, country) => {
        monthData[country] = count;
      });
    }

    monthlyData.push(monthData);
  }

  return monthlyData;
}

export function getTotalLettersForYear(
  records: LetterRecord[],
  year: number,
  selectedRegions: string[],
  selectedCountries: string[]
): number {
  let filteredRecords = records.filter(r => r.year === year);

  if (selectedRegions.length > 0) {
    filteredRecords = filteredRecords.filter(r => selectedRegions.includes(r.region));
  }

  if (selectedCountries.length > 0) {
    filteredRecords = filteredRecords.filter(r => selectedCountries.includes(r.country));
  }

  return filteredRecords.length;
}

export function getCountriesForRegions(
  records: LetterRecord[],
  regions: string[]
): string[] {
  if (regions.length === 0) {
    return Array.from(new Set(records.map(r => r.country))).sort();
  }

  const countries = new Set<string>();
  records.forEach(record => {
    if (regions.includes(record.region)) {
      countries.add(record.country);
    }
  });

  return Array.from(countries).sort();
}

export function getCountryBreakdown(
  records: LetterRecord[],
  year: number,
  selectedRegions: string[],
  selectedCountries: string[]
): { country: string; count: number }[] {
  let filteredRecords = records.filter(r => r.year === year);

  if (selectedRegions.length > 0) {
    filteredRecords = filteredRecords.filter(r => selectedRegions.includes(r.region));
  }

  if (selectedCountries.length > 0) {
    filteredRecords = filteredRecords.filter(r => selectedCountries.includes(r.country));
  }

  const countryMap = new Map<string, number>();
  filteredRecords.forEach(record => {
    countryMap.set(record.country, (countryMap.get(record.country) || 0) + 1);
  });

  return Array.from(countryMap.entries())
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count);
}
