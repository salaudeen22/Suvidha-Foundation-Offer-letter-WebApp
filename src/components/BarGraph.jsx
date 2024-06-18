import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

function BarGraph({ data }) {
  return (
   
        <BarChart width={350} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="paid" stackId="a" fill="#8884d8" />
          <Bar dataKey="unpaid" stackId="a" fill="#82ca9d" />
        </BarChart>
   
  );
}

export default BarGraph;
