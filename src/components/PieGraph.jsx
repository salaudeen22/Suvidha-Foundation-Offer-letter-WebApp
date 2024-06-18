import React from 'react';
import { PieChart, Pie, Legend, Tooltip } from 'recharts';

const PieGraph = ({ data }) => {
  return (
 
        <PieChart width={400} height={400}>
          <Pie 
            data={data} 
            dataKey="value" 
            nameKey="name" 
            cx="50%" 
            cy="50%" 
            outerRadius={100} 
            fill="#8884d8" 
            label 
          />
          <Tooltip />
          <Legend align="right" verticalAlign="middle" layout="vertical" />
        </PieChart>
  
  );
};

export default PieGraph;
