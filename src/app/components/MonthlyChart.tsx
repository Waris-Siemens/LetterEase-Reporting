import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { MonthlyData } from '../utils/excelParser';

interface MonthlyChartProps {
  data: MonthlyData[];
  countries: string[];
}

const COLORS = [
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#f97316', // orange
  '#10b981', // green
  '#eab308', // yellow
  '#ef4444', // red
  '#14b8a6', // teal
  '#f59e0b', // amber
];

export function MonthlyChart({ data, countries }: MonthlyChartProps) {
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="font-semibold text-cyan-400 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 text-sm">
              <span className="flex items-center gap-2">
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                {entry.name}
              </span>
              <span className="font-semibold">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom dot with label
  const CustomDot = (props: any) => {
    const { cx, cy, value, fill } = props;
    if (value === 0 || value === undefined) return null;
    
    return (
      <g>
        <circle cx={cx} cy={cy} r={4} fill={fill} stroke="rgb(15 23 42)" strokeWidth={2} />
        <text
          x={cx}
          y={cy - 10}
          textAnchor="middle"
          fill={fill}
          fontSize={11}
          fontWeight="600"
        >
          {value}
        </text>
      </g>
    );
  };

  return (
    <div className="w-full h-[500px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
          <XAxis
            dataKey="month"
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
          />
          <YAxis
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="line"
            formatter={(value) => <span className="text-slate-300">{value}</span>}
          />
          {countries.map((country, index) => (
            <Line
              key={country}
              type="monotone"
              dataKey={country}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2}
              dot={<CustomDot fill={COLORS[index % COLORS.length]} />}
              activeDot={{ r: 6 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
