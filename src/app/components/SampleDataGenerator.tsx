import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '../components/ui/button';
import * as XLSX from 'xlsx';

export function SampleDataGenerator() {
  const generateSampleExcel = () => {
    // Sample data
    const sampleData = [
      // MEA Region
      { 'Requested Date': '2024-01-15', 'Country Name': 'UAE', 'Region': 'MEA', 'Letter ID': 'L001' },
      { 'Requested Date': '2024-01-20', 'Country Name': 'UAE', 'Region': 'MEA', 'Letter ID': 'L002' },
      { 'Requested Date': '2024-02-10', 'Country Name': 'UAE', 'Region': 'MEA', 'Letter ID': 'L003' },
      { 'Requested Date': '2024-02-25', 'Country Name': 'Saudi Arabia', 'Region': 'MEA', 'Letter ID': 'L004' },
      { 'Requested Date': '2024-03-05', 'Country Name': 'Egypt', 'Region': 'MEA', 'Letter ID': 'L005' },
      { 'Requested Date': '2024-03-12', 'Country Name': 'UAE', 'Region': 'MEA', 'Letter ID': 'L006' },
      { 'Requested Date': '2024-04-08', 'Country Name': 'Qatar', 'Region': 'MEA', 'Letter ID': 'L007' },
      { 'Requested Date': '2024-04-18', 'Country Name': 'Kuwait', 'Region': 'MEA', 'Letter ID': 'L008' },
      { 'Requested Date': '2024-05-02', 'Country Name': 'UAE', 'Region': 'MEA', 'Letter ID': 'L009' },
      { 'Requested Date': '2024-05-15', 'Country Name': 'Saudi Arabia', 'Region': 'MEA', 'Letter ID': 'L010' },
      
      // APAC Region
      { 'Requested Date': '2024-01-10', 'Country Name': 'Singapore', 'Region': 'APAC', 'Letter ID': 'L011' },
      { 'Requested Date': '2024-01-25', 'Country Name': 'India', 'Region': 'APAC', 'Letter ID': 'L012' },
      { 'Requested Date': '2024-02-14', 'Country Name': 'Australia', 'Region': 'APAC', 'Letter ID': 'L013' },
      { 'Requested Date': '2024-02-28', 'Country Name': 'Singapore', 'Region': 'APAC', 'Letter ID': 'L014' },
      { 'Requested Date': '2024-03-10', 'Country Name': 'India', 'Region': 'APAC', 'Letter ID': 'L015' },
      { 'Requested Date': '2024-03-22', 'Country Name': 'Japan', 'Region': 'APAC', 'Letter ID': 'L016' },
      { 'Requested Date': '2024-04-05', 'Country Name': 'Singapore', 'Region': 'APAC', 'Letter ID': 'L017' },
      { 'Requested Date': '2024-04-20', 'Country Name': 'Australia', 'Region': 'APAC', 'Letter ID': 'L018' },
      
      // EMEA Region
      { 'Requested Date': '2024-01-12', 'Country Name': 'UK', 'Region': 'EMEA', 'Letter ID': 'L019' },
      { 'Requested Date': '2024-01-28', 'Country Name': 'Germany', 'Region': 'EMEA', 'Letter ID': 'L020' },
      { 'Requested Date': '2024-02-08', 'Country Name': 'France', 'Region': 'EMEA', 'Letter ID': 'L021' },
      { 'Requested Date': '2024-02-22', 'Country Name': 'UK', 'Region': 'EMEA', 'Letter ID': 'L022' },
      { 'Requested Date': '2024-03-15', 'Country Name': 'Germany', 'Region': 'EMEA', 'Letter ID': 'L023' },
      { 'Requested Date': '2024-03-28', 'Country Name': 'Spain', 'Region': 'EMEA', 'Letter ID': 'L024' },
      
      // Americas Region
      { 'Requested Date': '2024-01-18', 'Country Name': 'USA', 'Region': 'Americas', 'Letter ID': 'L025' },
      { 'Requested Date': '2024-01-30', 'Country Name': 'Canada', 'Region': 'Americas', 'Letter ID': 'L026' },
      { 'Requested Date': '2024-02-12', 'Country Name': 'USA', 'Region': 'Americas', 'Letter ID': 'L027' },
      { 'Requested Date': '2024-02-26', 'Country Name': 'Brazil', 'Region': 'Americas', 'Letter ID': 'L028' },
      { 'Requested Date': '2024-03-08', 'Country Name': 'USA', 'Region': 'Americas', 'Letter ID': 'L029' },
      { 'Requested Date': '2024-03-20', 'Country Name': 'Mexico', 'Region': 'Americas', 'Letter ID': 'L030' },
      
      // 2025 Data
      { 'Requested Date': '2025-01-10', 'Country Name': 'UAE', 'Region': 'MEA', 'Letter ID': 'L031' },
      { 'Requested Date': '2025-01-20', 'Country Name': 'Singapore', 'Region': 'APAC', 'Letter ID': 'L032' },
      { 'Requested Date': '2025-01-25', 'Country Name': 'UK', 'Region': 'EMEA', 'Letter ID': 'L033' },
      { 'Requested Date': '2025-02-05', 'Country Name': 'USA', 'Region': 'Americas', 'Letter ID': 'L034' },
      { 'Requested Date': '2025-02-15', 'Country Name': 'India', 'Region': 'APAC', 'Letter ID': 'L035' },
      { 'Requested Date': '2025-03-10', 'Country Name': 'Germany', 'Region': 'EMEA', 'Letter ID': 'L036' },
    ];

    // Create workbook
    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Letters Data');

    // Generate Excel file
    XLSX.writeFile(wb, 'AutoReport_Sample_Data.xlsx');
  };

  return (
    <Button
      onClick={generateSampleExcel}
      variant="outline"
      size="sm"
      className="border-slate-700 hover:border-cyan-500 hover:bg-cyan-500/10"
    >
      <Download className="size-4 mr-2" />
      Download Sample Excel
    </Button>
  );
}
