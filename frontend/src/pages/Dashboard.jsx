import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import "./Dashboard.css"
// Import your components
import Statistics from '../components/financialsummary-components/Statistics';
import LineGraph from '../components/financialsummary-components/LineGraph';
import BarGraph from '../components/financialsummary-components/BarGraph';
import DataTable from '../components/financialsummary-components/DataTable';
import DateFilter from '../components/financialsummary-components/DateFilter';

// Import your CSV file
import FinancialSummaryFile from '../assets/Data-FinancialSummary.csv';
import CategoryExpensesPieChart from '../components/global-components/CategoryExpensesPieChart';
import ProjectionsLineChart from '../components/global-components/ProjectionsLineChart';

const Dashboard = () => {
  // State to hold the complete dataset (only the first 12 rows)
  const [allData, setAllData] = useState({
    months: [],
    totalReserves: [],
    allocatedReserves: [],
    unallocatedReserves: [],
    monthlyChange: [],
  });
  // State to hold filtered data
  const [filteredData, setFilteredData] = useState(null);
  // State for table data
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  // State for summary sums (make sure this is declared!)
  const [sums, setSums] = useState({
    sumTotalReserves: 0,
    sumAllocatedFunds: 0,
    sumUnallocatedFunds: 0,
  });
  const [currentFilter, setCurrentFilter] = useState({ type: 'all' });

  useEffect(() => {
    Papa.parse(FinancialSummaryFile, {
      download: true,
      header: true,
      complete: (results) => {
        // Process only the first 12 rows
        const first12Rows = results.data.slice(0, 12);
        const monthArray = [];
        const totalReservesArray = [];
        const allocatedReservesArray = [];
        const unallocatedReservesArray = [];
        const monthlyChangeArray = [];

        let sumTotalReserves = 0;
        let sumAllocatedFunds = 0;
        let sumUnallocatedFunds = 0;

        first12Rows.forEach((dataRow) => {
          // Ensure that the CSV "Month" field format is consistent with your filter values
          monthArray.push(dataRow.Month);
          totalReservesArray.push(dataRow["Total Reserves"]);
          allocatedReservesArray.push(dataRow["Allocated Funds"]);
          unallocatedReservesArray.push(dataRow["Unallocated Funds"]);
          monthlyChangeArray.push(dataRow["Monthly Change (%)"]);

          sumTotalReserves += parseInt(dataRow["Total Reserves"], 10);
          sumAllocatedFunds += parseInt(dataRow["Allocated Funds"], 10);
          sumUnallocatedFunds += parseInt(dataRow["Unallocated Funds"], 10);
        });

        const completeData = {
          months: monthArray,
          totalReserves: totalReservesArray,
          allocatedReserves: allocatedReservesArray,
          unallocatedReserves: unallocatedReservesArray,
          monthlyChange: monthlyChangeArray,
        };

        // Store the complete data and set the initial filtered data to the full dataset
        setAllData(completeData);
        setFilteredData(completeData);

        // Save sums for the Statistics component
        setSums({
          sumTotalReserves,
          sumAllocatedFunds,
          sumUnallocatedFunds,
        });

        // Generate table columns and rows for the DataTable component
        const generatedColumns = Object.keys(first12Rows[0]).map((field) => ({
          field,
          headerName: field.charAt(0).toUpperCase() + field.slice(1),
          flex: 1,
        }));
        const rowsWithId = first12Rows.map((row, index) => ({
          ...row,
          id: index,
        }));
        setColumns(generatedColumns);
        setRows(rowsWithId);
      }
    });
  }, []);

  // Filter handler using the complete (first 12 rows) data set
  const handleFilterChange = (filterParams) => {
    setCurrentFilter(filterParams); // Store the current filter

    if (filterParams.type === "all") {
      setFilteredData(allData);
      return;
    }

    const startDate = new Date(filterParams.start);
    const endDate = new Date(filterParams.end);

    const filteredIndices = allData.months
      .map((month, index) => {
        const currentDate = new Date(month);
        return currentDate >= startDate && currentDate <= endDate ? index : -1;
      })
      .filter((index) => index !== -1);

    setFilteredData({
      months: filteredIndices.map((i) => allData.months[i]),
      totalReserves: filteredIndices.map((i) => allData.totalReserves[i]),
      allocatedReserves: filteredIndices.map((i) => allData.allocatedReserves[i]),
      unallocatedReserves: filteredIndices.map((i) => allData.unallocatedReserves[i]),
      monthlyChange: filteredIndices.map((i) => allData.monthlyChange[i]),
    });
  };

  return (
    <div>
      <div className="header-section">
        <h1 className='heading-db'>Welcome!</h1>
        <DateFilter onFilterChange={handleFilterChange} />
      </div>
      {filteredData && (
        <>
          <Statistics
            sumTotalReserves={sums.sumTotalReserves}
            sumAllocatedFunds={sums.sumAllocatedFunds}
            sumUnallocatedFunds={sums.sumUnallocatedFunds}
          />
          <div className="charts-grid">
            <BarGraph filteredData={filteredData} />
            <CategoryExpensesPieChart dateFilter={currentFilter} />
            <LineGraph filteredData={filteredData} />
            <ProjectionsLineChart dateFilter={currentFilter} />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
