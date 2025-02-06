import DataTable from "../components/financialsummary-components/DataTable";
import "./FinancialSummary.css"
import { BarChart, LineChart } from "@mui/x-charts";
import FinancialSummaryFile from "../assets/Data-FinancialSummary.csv";
import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import DateFilter from "../components/financialsummary-components/DateFilter";

var monthArray = [];
var totalReservesArray = [];
var allocatedReservesArray = [];
var unallocatedReservesArray = [];
var monthlyChangeArray = [];
var sumTotalReserves = 0;
var sumAllocatedFunds = 0;
var sumUnallocatedFunds = 0;


function FinancialSummary() {
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([]);

    const [filteredData, setFilteredData] = useState(null);


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

                //storing incoming csv table values to arrays and sum variables defined globally
                const dataObject = results;
                for (var i = 0; i < 12; i++) {
                    monthArray.push(dataObject.data[i].Month);
                    totalReservesArray.push(dataObject.data[i]["Total Reserves"]);
                    allocatedReservesArray.push(dataObject.data[i]["Allocated Funds"]);
                    unallocatedReservesArray.push(dataObject.data[i]["Unallocated Funds"]);
                    monthlyChangeArray.push(dataObject.data[i]["Monthly Change (%)"]);

                    var tempTR = parseInt(dataObject.data[i]["Total Reserves"]);
                    sumTotalReserves = sumTotalReserves + tempTR;
                    // console.log("STR " + sumTotalReserves)

                    var tempAF = parseInt(dataObject.data[i]["Allocated Funds"]);
                    sumAllocatedFunds = sumAllocatedFunds + tempAF;
                    // console.log("SAF " + sumAllocatedFunds);

                    var tempUF = parseInt(dataObject.data[i]["Unallocated Funds"]);
                    sumUnallocatedFunds = sumUnallocatedFunds + tempUF;
                    // console.log("SUF " + sumUnallocatedFunds);
                }
                // console.log(allocatedReservesArray);
                // console.log(sumTotalReserves);

                //setting inital values
                setFilteredData({
                    months: monthArray,
                    totalReserves: totalReservesArray,
                    allocatedReserves: allocatedReservesArray,
                    unallocatedReserves: unallocatedReservesArray,
                    monthlyChange: monthlyChangeArray
                });

                // Adding unique id to rows
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

    const handleFilterChange = (filterParams) => {
        let startDate, endDate;

        if (filterParams.type === 'all') {
            setFilteredData({
                months: monthArray,
                totalReserves: totalReservesArray,
                allocatedReserves: allocatedReservesArray,
                unallocatedReserves: unallocatedReservesArray,
                monthlyChange: monthlyChangeArray
            });
            return;
        }

        startDate = new Date(filterParams.start);
        endDate = new Date(filterParams.end);

        const filteredIndices = monthArray.map((month, index) => {
            const currentDate = new Date(month);
            return (currentDate >= startDate && currentDate <= endDate) ? index : -1;
        }).filter(index => index !== -1);

        setFilteredData({
            months: filteredIndices.map(i => monthArray[i]),
            totalReserves: filteredIndices.map(i => totalReservesArray[i]),
            allocatedReserves: filteredIndices.map(i => allocatedReservesArray[i]),
            unallocatedReserves: filteredIndices.map(i => unallocatedReservesArray[i]),
            monthlyChange: filteredIndices.map(i => monthlyChangeArray[i])
        });
    };

    return (
        <>
            <div className="header-section">
                <h1 className="heading-FS">Financial Summary</h1>
                <DateFilter onFilterChange={handleFilterChange} />
            </div>
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
                {/* <Statistics /> */}
            </div>
            {filteredData && (
                <>
                    <div className="linegraph-section">
                        <h2 className="heading-graphs">Reserve Allocation Monthly Change (%)</h2>
                        <LineChart
                            sx={{ padding: "30px 10px", width: "100%" }}
                            xAxis={[{
                                data: filteredData.months,
                                scaleType: "band",
                                label: "Months"
                            }]}
                            series={[
                                {
                                    data: filteredData.monthlyChange,
                                    area: false,
                                    label: "Monthly Change (%)"
                                },
                            ]}
                            // width={900}
                            height={400}
                            grid={{ vertical: true, horizontal: true }}
                        />

                    </div>
                    <div className="barchart-section">
                        <h2 className="heading-graphs">Funds Allocation across the Year</h2>
                        <BarChart
                            sx={{ padding: "30px 10px", width: "100%" }}
                            xAxis={[
                                {
                                    scaleType: 'band',
                                    data: filteredData.months, //months - xaxis
                                    categoryGapRatio: 0.3,
                                    barGapRatio: 0.1,
                                    label: "Months"
                                }]}
                            series={[
                                { data: filteredData.totalReserves, label: "Total Reserves($USD)",valueFormatter: (value) => `$${value.toLocaleString()}` },
                                { data: filteredData.allocatedReserves, label: "Allocated Funds($USD)",valueFormatter: (value) => `$${value.toLocaleString()}` },
                                { data: filteredData.unallocatedReserves, label: "Unallocated Funds($USD)",valueFormatter: (value) => `$${value.toLocaleString()}` }]} //y-axis 
                            height={400}
                        /></div>
                </>
            )}
            <DataTable />
        </>
    );
}

export default FinancialSummary;