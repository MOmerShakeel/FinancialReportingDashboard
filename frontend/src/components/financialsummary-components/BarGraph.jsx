// src/components/financialsummary-components/BarGraph.js
import React from "react";
import { BarChart } from "@mui/x-charts/BarChart";

const BarGraph = ({ filteredData }) => {
  return (
    <div className="barchart-section">
      <h2 className="heading-graphs">Funds Allocation across the Year</h2>
      <BarChart
        sx={{ padding: "30px 10px", width: "100%" }}
        xAxis={[
          {
            scaleType: "band",
            data: filteredData.months,
            categoryGapRatio: 0.3,
            barGapRatio: 0.1,
            label: "Months",
          },
        ]}
        series={[
          {
            data: filteredData.totalReserves,
            label: "Total Reserves($USD)",
            valueFormatter: (value) => `$${value.toLocaleString()}`,
          },
          {
            data: filteredData.allocatedReserves,
            label: "Allocated Funds($USD)",
            valueFormatter: (value) => `$${value.toLocaleString()}`,
          },
          {
            data: filteredData.unallocatedReserves,
            label: "Unallocated Funds($USD)",
            valueFormatter: (value) => `$${value.toLocaleString()}`,
          },
        ]}
        height={400}
      />
    </div>
  );
};

export default BarGraph;
