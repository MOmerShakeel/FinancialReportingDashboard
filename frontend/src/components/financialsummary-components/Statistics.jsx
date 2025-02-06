// src/components/financialsummary-components/Statistics.js
import React from "react";
import "../../pages/FinancialSummary.css"; // reuse the same CSS if needed

const Statistics = ({ sumTotalReserves, sumAllocatedFunds, sumUnallocatedFunds }) => {
  return (
    <div className="statistic-section">
      <div className="totalreserves-box">
        <div className="stat-heading">Total Reserves</div>
        <div className="stat-value">${sumTotalReserves.toLocaleString()}</div>
      </div>
      <div className="allocated-div">
        <div className="stat-heading">Total Allocated Funds</div>
        <div className="stat-value">${sumAllocatedFunds.toLocaleString()}</div>
      </div>
      <div className="unallocated-div">
        <div className="stat-heading">Total Unallocated Funds</div>
        <div className="stat-value">${sumUnallocatedFunds.toLocaleString()}</div>
      </div>
    </div>
  );
};

export default Statistics;
