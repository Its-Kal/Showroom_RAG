import React from 'react';
import { Spin } from 'antd';
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

// Data interface (must match backend schema)
interface SalesDataPoint {
  tanggal: string;
  total_penjualan: number;
}

// Props interface for the component
interface SalesChartProps {
  data: SalesDataPoint[];
  isLoading?: boolean;
}

export const SalesChart: React.FC<SalesChartProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return <Spin size="large" style={{ display: 'block', margin: 'auto' }} />;
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="tanggal" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="total_penjualan" 
          stroke="#8884d8" 
          activeDot={{ r: 8 }} 
          name="Total Penjualan"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
