// Projections.jsx (modified)
import DataTable from "../components/projections-components/DataTable";
import { LineChart } from '@mui/x-charts/LineChart';
import "./Projections.css";
import ProjectionsFile from "../assets/Data-ProjectionData.csv";
import { useState, useEffect } from 'react';
import Papa from "papaparse";
import DateFilter from "../components/projections-components/DateFilter";

function Projections() {
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([]);
    const [monthArray, setMonthArray] = useState([]);
    const [projectedReservesArray, setProjectedReservesArray] = useState([]);
    const [growthRateArray, setGrowthRateArray] = useState([]);

    const [filteredData, setFilteredData] = useState({
        months: [],
        projectedReserves: [],
        growthRate: []
    });

    const [filters, setFilters] = useState({
        type: 'both',
        start: '',
        end: ''
    });

    useEffect(() => {
        Papa.parse(ProjectionsFile, {
            download: true,
            header: true,
            complete: (results) => {
                if (!results.data || !Array.isArray(results.data)) {
                    console.error("Invalid CSV data format");
                    return;
                }
                const generatedColumns = Object.keys(results.data[0]).map(field => ({
                    field,
                    headerName: field.charAt(0).toUpperCase() + field.slice(1),
                    flex: 1
                }));

                const months = [];
                const reserves = [];
                const rates = [];

                results.data.slice(0, 12).forEach(item => {
                    months.push(item.Month);
                    reserves.push(Number(item["Projected Reserves"]));
                    rates.push(Number(item["Growth Rate"]));
                });

                setMonthArray(months);
                setProjectedReservesArray(reserves);
                setGrowthRateArray(rates);

                setFilteredData({
                    months: months,
                    projectedReserves: reserves,
                    growthRate: rates,
                });

                const rowsWithId = results.data.map((row, index) => ({
                    ...row,
                    id: index
                }));

                setColumns(generatedColumns);
                setRows(rowsWithId);
            }
        });
    }, []);

    useEffect(() => {
        const filterDataByDate = () => {
            if (!monthArray.length) return;

            let filteredIndices = monthArray.map((_, index) => index);

            if (filters.start && filters.end) {
                const startDate = new Date(filters.start);
                const endDate = new Date(filters.end);

                filteredIndices = monthArray
                    .map((month, index) => {
                        const currentDate = new Date(month);
                        return currentDate >= startDate && currentDate <= endDate ? index : -1;
                    })
                    .filter(index => index !== -1);
            }

            setFilteredData({
                months: filteredIndices.map(i => monthArray[i]),
                projectedReserves: filteredIndices.map(i => projectedReservesArray[i]),
                growthRate: filteredIndices.map(i => growthRateArray[i]),
            });
        };

        filterDataByDate();
    }, [filters.start, filters.end, monthArray, projectedReservesArray, growthRateArray]);

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    return (
        <>
            <div className="header-section">
                <h1 className="heading-pc">Projection Charts</h1>
                <DateFilter
                    months={monthArray}
                    selectedType={filters.type}
                    startMonth={filters.start}
                    endMonth={filters.end}
                    onFilterChange={handleFilterChange}
                />
            </div>
            <div className='chart-section'>
                <h2>Future Projection of Reserves (in Amount & %)</h2>
                <div style={{ width: "100%", overflowX: "auto" }}>
                    <LineChart
                        sx={{ padding: "30px 10px", width: "100%" }}
                        height={300}
                        series={[
                            ...(filters.type === 'both' || filters.type === 'reserves' ? [{
                                data: filteredData.projectedReserves,
                                label: '$',
                                yAxisId: 'rightAxisId',
                                color: '#2ec4e9'
                            }] : []),
                            ...(filters.type === 'both' || filters.type === 'growth' ? [{
                                data: filteredData.growthRate,
                                label: '%',
                                yAxisId: 'leftAxisId',
                                color: '#5e75f6'
                            }] : []),
                        ]}
                        xAxis={[{
                            scaleType: 'point',
                            data: filteredData.months,
                            valueFormatter: (value) =>
                                new Date(value).toLocaleDateString('en-US', {
                                    month: 'short',
                                    year: 'numeric'
                                })
                        }]}
                        yAxis={[
                            { id: 'leftAxisId' },
                            { id: 'rightAxisId' }
                        ]}
                        rightAxis="rightAxisId"
                    />
                </div>
            </div>
            <DataTable />
        </>
    );
}

export default Projections;