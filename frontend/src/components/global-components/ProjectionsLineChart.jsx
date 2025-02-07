import React, { useState, useEffect } from 'react';
import { LineChart } from '@mui/x-charts';
import Papa from 'papaparse';
import ProjectionsFile from '../../assets/Data-ProjectionData.csv';
import "./ProjectionsLineChart.css"

const ProjectionsLineChart = ({ dateFilter }) => {
    const [data, setData] = useState({
        months: [],
        projectedReserves: [],
        growthRate: []
    });
    const [originalData, setOriginalData] = useState({
        months: [],
        projectedReserves: [],
        growthRate: []
    });
    const [isLoading, setIsLoading] = useState(true);

    // Helper function to get every 12th entry
    const getEvery12thEntry = (dataArray) => {
        return dataArray.filter((_, index) => index === 0 || (index + 1) % 12 === 0);
    };

    useEffect(() => {
        Papa.parse(ProjectionsFile, {
            download: true,
            header: true,
            complete: (results) => {
                if (!results.data || !Array.isArray(results.data)) {
                    console.error("Invalid CSV data format");
                    return;
                }

                const months = [];
                const reserves = [];
                const rates = [];

                results.data.slice(0, 100).forEach(item => {
                    months.push(item.Month);
                    reserves.push(Number(item["Projected Reserves"]));
                    rates.push(Number(item["Growth Rate"]));
                });

                // Get every 12th entry from each array
                const filteredMonths = getEvery12thEntry(months);
                const filteredReserves = getEvery12thEntry(reserves);
                const filteredRates = getEvery12thEntry(rates);

                const processedData = {
                    months: filteredMonths,
                    projectedReserves: filteredReserves,
                    growthRate: filteredRates
                };

                setOriginalData(processedData);
                setData(processedData);
                setIsLoading(false);
            }
        });
    }, []);

    useEffect(() => {
        if (!dateFilter || !originalData.months.length) return;

        if (dateFilter.type === 'all') {
            setData(originalData);
            return;
        }

        const startDate = new Date(dateFilter.start);
        const endDate = new Date(dateFilter.end);

        const filteredIndices = originalData.months
            .map((month, index) => {
                const currentDate = new Date(month);
                return currentDate >= startDate && currentDate <= endDate ? index : -1;
            })
            .filter(index => index !== -1);

        setData({
            months: filteredIndices.map(i => originalData.months[i]),
            projectedReserves: filteredIndices.map(i => originalData.projectedReserves[i]),
            growthRate: filteredIndices.map(i => originalData.growthRate[i])
        });
    }, [dateFilter, originalData]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='chart-section-pc'>
            <h2 className='heading-graphs'>Future Projection of Reserves (Yearly)</h2>
            <div style={{ width: "100%", overflowX: "auto" }}>
                <LineChart
                    sx={{ padding: "20px 10px 10px 10px", width: "100%" }}
                    height={300}
                    series={[
                        {
                            data: data.projectedReserves,
                            label: '$',
                            yAxisId: 'rightAxisId',
                            color: '#2ec4e9'
                        },
                        {
                            data: data.growthRate,
                            label: '%',
                            yAxisId: 'leftAxisId',
                            color: '#5e75f6'
                        }
                    ]}
                    xAxis={[{
                        scaleType: 'point',
                        data: data.months,
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
    );
};

export default ProjectionsLineChart;