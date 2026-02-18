# AutoReport - Excel to Interactive Dashboard Generator

## 🚀 Quick Start

1. **Download Sample Data**: Click the "Download Sample Excel" button on the home page to get a template Excel file
2. **Upload Your File**: Upload an Excel file (.xlsx or .xls) with the required columns
3. **View Dashboards**: Navigate through different years and use filters to analyze your data

## 📊 Required Excel Columns

Your Excel file must contain these columns (case-insensitive):

- **Requested Date** (or "Date"): The date when the letter was requested
- **Country Name** (or "Country"): The country where the letter originated
- **Region**: The region the country belongs to (e.g., MEA, APAC, EMEA, Americas)
- **Letter ID** (or "ID"): Optional - Unique identifier for each letter

### Example Excel Format:

| Requested Date | Country Name | Region | Letter ID |
|----------------|--------------|--------|-----------|
| 2024-01-15     | UAE          | MEA    | L001      |
| 2024-01-20     | Singapore    | APAC   | L002      |
| 2024-02-10     | UK           | EMEA   | L003      |

## ✨ Features

### 📈 Interactive Line Charts
- Monthly breakdown of letters per country
- Smooth curved lines with data point labels
- Hover tooltips showing detailed information
- Multi-country comparison

### 🔍 Smart Filters
- **Region Filter**: Multi-select regions to narrow down data
- **Country Filter**: Dynamically updates based on selected regions
- Select/Deselect All buttons for quick filtering
- Real-time chart updates

### 📅 Year Navigation
- Automatic detection of years in your data
- Separate dashboard for each year
- Quick navigation between years

### 📊 KPI Cards
- Total letters count for selected filters
- Country breakdown panel showing individual counts
- Last updated timestamp

### 🎨 Modern UI
- Dark theme with neon cyan/blue accents
- Responsive design for desktop and mobile
- Smooth animations and transitions

## 🛠️ Technology Stack

- **Frontend**: React + TypeScript
- **Charts**: Recharts
- **Styling**: Tailwind CSS v4
- **Excel Parsing**: XLSX (SheetJS)
- **Routing**: React Router v7
- **UI Components**: Radix UI primitives

## 📖 How to Use

### Uploading Data
1. Go to the home page
2. Click "Select File" or drag and drop your Excel file
3. The app will automatically process and validate your data
4. You'll be redirected to the most recent year's dashboard

### Using Filters

#### Region Filter
- Select one or more regions to filter data
- When regions are selected, the country dropdown updates automatically
- Use "Select All" to quickly select all regions

#### Country Filter
- Select specific countries to display on the chart
- When no countries are selected, all countries are shown
- Selecting countries shows individual lines for each country

### Viewing Different Years
- Use the year buttons in the header to switch between years
- Each year has its own independent dashboard
- Filters are maintained when switching years

## 🎯 Use Cases

- **HR Letter Management**: Track employment letters across regions
- **Operations Reporting**: Monitor regional operations
- **Business Analytics**: Analyze trends by country and region
- **Compliance Reporting**: Generate reports for audit purposes

## 🔒 Data Privacy

- All data is processed in your browser
- No data is uploaded to any server
- Files are processed in memory only
- Data is cleared when you close the browser tab

## 💡 Tips

1. **Large Datasets**: The app can handle up to 50,000 rows efficiently
2. **Date Formats**: Supports Excel date formats and standard date strings
3. **Missing Data**: Rows with missing required fields are automatically skipped
4. **Multiple Years**: Upload files with data spanning multiple years for year-over-year analysis

## 🐛 Troubleshooting

### "No valid data found"
- Check that your Excel file has the required columns
- Ensure dates are in a valid format
- Make sure there is at least one complete row of data

### "Failed to parse Excel file"
- Ensure the file is a valid Excel file (.xlsx or .xls)
- Check that the file is not corrupted
- Try downloading and using the sample data template

### Chart not displaying
- Make sure you have selected at least one region or country
- Check that the selected year has data
- Try resetting filters and selecting again

## 🚀 Future Enhancements (Roadmap)

- PDF Export functionality
- Excel export of filtered data
- Email scheduled reports
- PowerPoint presentation export
- Year-over-year comparison charts
- Trend forecasting
- Dark/Light mode toggle
- Custom date range filtering
