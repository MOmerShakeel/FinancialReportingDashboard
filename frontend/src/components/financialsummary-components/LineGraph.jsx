// src/components/financialsummary-components/LineGraph.js
import React from "react";
import { LineChart } from "@mui/x-charts/LineChart";

const LineGraph = ({ filteredData }) => {
  return (
    <div className="linegraph-section">
      <h2 className="heading-graphs">Reserve Allocation Monthly Change (%)</h2>
      <LineChart
        sx={{ padding: "30px 10px", width: "100%" }}
        xAxis={[
          {
            data: filteredData.months,
            scaleType: "band",
            label: "Months",
          },
        ]}
        series={[
          {
            data: filteredData.monthlyChange,
            area: false,
            label: "Monthly Change (%)",
          },
        ]}
        height={400}
        grid={{ vertical: true, horizontal: true }}
      />
    </div>
  );
};

export default LineGraph;
