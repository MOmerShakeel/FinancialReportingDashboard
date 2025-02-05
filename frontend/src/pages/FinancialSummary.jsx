import DataTable from "../components/financialsummary-components/DataTable";
import SideBar from "../components/global-components/Sidebar";
import "./FinancialSummary.css"
import { DashboardLayout } from "@toolpad/core";
import { Box } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import FinancialSummaryFile from "../assets/Data-FinancialSummary.csv";
import { useState, useEffect } from 'react';
import Papa from 'papaparse';

var monthArray = [];
var totalReservesArray = [];
var allocatedReservesArray = [];
var unallocatedReservesArray = [];

function FinancialSummary() {
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([]);

    useEffect(() => {
        Papa.parse(FinancialSummaryFile, {
            download: true,
            header: true,
            complete: (results) => {
                // Generate columns dynamically
                const generatedColumns = Object.keys(results.data[0]).map(field => ({
                    field,
                    headerName: field.charAt(0).toUpperCase() + field.slice(1),
                    flex: 1
                }));

                const dataObject = results;
                for(var i = 0; i<5; i++){
                    monthArray.push(dataObject.data[i].Month);
                    totalReservesArray.push(dataObject.data[i]["Total Reserves"]);
                    allocatedReservesArray.push(dataObject.data[i]["Allocated Funds"]);  
                    unallocatedReservesArray.push(dataObject.data[i]["Unallocated Funds"]);
                }
                console.log(allocatedReservesArray);

                // Add unique id to rows
                const rowsWithId = results.data.map((row, index) => ({
                    ...row,
                    id: index
                }));
                // console.log(rowsWithId);

                setColumns(generatedColumns);
                setRows(rowsWithId);
            }
        });
    }, []);

    return (
        <>
            <h1 className="heading">Financial Summary</h1>
            <BarChart
                xAxis={[
                    {
                        scaleType: 'band',
                        data: monthArray, //months - xaxis
                        categoryGapRatio: 0.3,
                        barGapRatio: 0.1
                    }]}
                series={[{ data: totalReservesArray }, { data: allocatedReservesArray }, { data: unallocatedReservesArray }]} //y-axis 
                width={500}
                height={300}
            />
            <DataTable />
        </>
    );
}

export default FinancialSummary;