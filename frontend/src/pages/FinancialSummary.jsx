// src/pages/FinancialSummary.js
import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import DataTable from "../components/financialsummary-components/DataTable";
import DateFilter from "../components/financialsummary-components/DateFilter";
import Statistics from "../components/financialsummary-components/Statistics";
import LineGraph from "../components/financialsummary-components/LineGraph";
import BarGraph from "../components/financialsummary-components/BarGraph";
import FinancialSummaryFile from "../assets/Data-FinancialSummary.csv";
import "./FinancialSummary.css";
import BarChart from "@mui/x-charts/BarChart";
import LineChart from "@mui/x-charts/LineChart";


function FinancialSummary() {
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([]);
    const [filteredData, setFilteredData] = useState(null);
    const [sums, setSums] = useState({
        sumTotalReserves: 0,
        sumAllocatedFunds: 0,
        sumUnallocatedFunds: 0,
    });

    const [allData, setAllData] = useState({
        months: [],
        totalReserves: [],
        allocatedReserves: [],
        unallocatedReserves: [],
        monthlyChange: [],
    });


    // These arrays will temporarily store the CSV data
    let monthArray = [];
    let totalReservesArray = [];
    let allocatedReservesArray = [];
    let unallocatedReservesArray = [];
    let monthlyChangeArray = [];

    useEffect(() => {
        Papa.parse(FinancialSummaryFile, {
            download: true,
            header: true,
            complete: (results) => {
                const first12Rows = results.data.slice(0, 12);
                const monthArray = [];
                const totalReservesArray = [];
                const allocatedReservesArray = [];
                const unallocatedReservesArray = [];
                const monthlyChangeArray = [];

                let sumTotalReserves = 0;
                let sumAllocatedFunds = 0;
                let sumUnallocatedFunds = 0;

                // Dynamically generate the table columns
                const generatedColumns = Object.keys(first12Rows[0]).map((field) => ({
                    field,
                    headerName: field.charAt(0).toUpperCase() + field.slice(1),
                    flex: 1,
                }));

                // Loop through each row in the CSV data
                first12Rows.forEach((dataRow) => {
                    monthArray.push(dataRow.Month); // ← Make sure this format matches DateFilter values!
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

                setAllData(completeData);
                setFilteredData(completeData);

                // Store the sum values in state
                setSums({
                    sumTotalReserves,
                    sumAllocatedFunds,
                    sumUnallocatedFunds,
                });

                // Set the initial filtered data using the complete arrays
                setFilteredData({
                    months: monthArray,
                    totalReserves: totalReservesArray,
                    allocatedReserves: allocatedReservesArray,
                    unallocatedReserves: unallocatedReservesArray,
                    monthlyChange: monthlyChangeArray,
                });

                // Add a unique id to each row for the DataTable
                const rowsWithId = first12Rows.map((row, index) => ({
                    ...row,
                    id: index,
                  }));

                setColumns(generatedColumns);
                setRows(rowsWithId);
            },
        });
    }, []);

    const handleFilterChange = (filterParams) => {
        // If 'all' is selected, reset to the full data set
        if (filterParams.type === "all") {
          setFilteredData(allData);
          return;
        }
        
        // Parse the start and end dates coming from the DateFilter.
        const startDate = new Date(filterParams.start);
        const endDate = new Date(filterParams.end);
        
        // Debug: log the filter parameters and parsed dates
        console.log("Filtering from", startDate, "to", endDate);
        
        // Filter using the months from allData
        const filteredIndices = allData.months
          .map((month, index) => {
            const currentDate = new Date(month);
            return currentDate >= startDate && currentDate <= endDate ? index : -1;
          })
          .filter((index) => index !== -1); 
        
        // Build the filtered dataset
        setFilteredData({
          months: filteredIndices.map((i) => allData.months[i]),
          totalReserves: filteredIndices.map((i) => allData.totalReserves[i]),
          allocatedReserves: filteredIndices.map((i) => allData.allocatedReserves[i]),
          unallocatedReserves: filteredIndices.map((i) => allData.unallocatedReserves[i]),
          monthlyChange: filteredIndices.map((i) => allData.monthlyChange[i]),
        });
      };
    //   console.log("Statistics:", Statistics);
    // console.log("LineGraph:", LineGraph);
    // console.log("BarGraph:", BarGraph);
    // console.log("DataTable:", DataTable);
    // console.log("DateFilter:", DateFilter);

    return (
        <div>
            <div className="header-section">
                <h1 className="heading-FS">Financial Summary</h1>
                <DateFilter onFilterChange={handleFilterChange} />
            </div>
            {filteredData && (
                <>
                    <Statistics
                        sumTotalReserves={sums.sumTotalReserves}
                        sumAllocatedFunds={sums.sumAllocatedFunds}
                        sumUnallocatedFunds={sums.sumUnallocatedFunds}
                    />
                    <LineGraph filteredData={filteredData} />
                    <BarGraph filteredData={filteredData} />
                </>
            )}
            <DataTable rows={rows} columns={columns} />
        </div>
    );
}

export default FinancialSummary;
