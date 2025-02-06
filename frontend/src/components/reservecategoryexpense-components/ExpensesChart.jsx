import React, { useState, useEffect } from 'react';
import { BarChart, PieChart } from '@mui/x-charts';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import Papa from 'papaparse';
import ExpensesFile from '../../assets/Data-ReserveCategoriesExpense.csv';
import DateFilter from './DateFilter';
import "./ExpensesChart.css"

const chartSetting = {
    yAxis: [
        {
            label: 'Total Amount ($)',
        },
    ],
    height: 400,
    sx: {
        [`.${axisClasses.left} .${axisClasses.label}`]: {
            transform: 'translate(-30px, 0)',
        },
        padding: '30px 10px',
        width: '100%',
        boxSizing: 'border-box',
    },
};

function ExpensesChart() {
    const [originalData, setOriginalData] = useState([]);
    const [chartData, setChartData] = useState({
        months: [],
        dataset: [],
        categories: new Set()
    });
    const [pieChartData, setPieChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const processData = (data) => {
        const monthlyData = {};
        const categories = new Set();
        const categoryUtilization = {};

        data.forEach((row, index) => {
            const month = row.Month?.trim();
            const category = row.Category?.trim();
            const utilization = parseFloat(row['% of total Utilization']);

            if (!month || !category || isNaN(utilization)) {
                console.warn(`Skipping invalid row at index ${index}:`, row);
                return;
            }

            categories.add(category);

            if (!monthlyData[month]) {
                monthlyData[month] = { month };
            }

            monthlyData[month][category] = (monthlyData[month][category] || 0) + utilization;

            if (!categoryUtilization[category]) {
                categoryUtilization[category] = 0;
            }
            categoryUtilization[category] += utilization;
        });

        const dataset = Object.values(monthlyData).sort((a, b) =>
            new Date(a.month) - new Date(b.month)
        );

        setChartData({
            months: Object.keys(monthlyData),
            dataset: dataset,
            categories: categories
        });

        // Calculate total sum for percentages
        const totalSum = Object.values(categoryUtilization).reduce((a, b) => a + b, 0);

        // Convert to percentages that sum to 100%
        const pieData = Object.keys(categoryUtilization).map(category => ({
            id: category,
            label: `${category} (${(categoryUtilization[category] / totalSum * 100).toFixed(2)}%)`,
            value: (categoryUtilization[category] / totalSum * 100).toFixed(2)
        }));

        setPieChartData(pieData);
    };

    useEffect(() => {
        const parseCSV = () => {
            setIsLoading(true);
            setError(null);

            Papa.parse(ExpensesFile, {
                download: true,
                header: true,
                complete: (results) => {
                    if (!results.data || results.data.length === 0) {
                        setError('No data found in the CSV file');
                        setIsLoading(false);
                        return;
                    }

                    const requiredColumns = ['Month', 'Category', '% of total Utilization'];
                    const missingColumns = requiredColumns.filter(col =>
                        !Object.keys(results.data[0] || {}).includes(col)
                    );

                    if (missingColumns.length > 0) {
                        setError(`Missing columns: ${missingColumns.join(', ')}`);
                        setIsLoading(false);
                        return;
                    }

                    setOriginalData(results.data);
                    processData(results.data);
                    setIsLoading(false);
                },
                error: (error) => {
                    console.error('CSV Parsing Error:', error);
                    setError('Error parsing CSV file');
                    setIsLoading(false);
                }
            });
        };

        parseCSV();
    }, []);

    const handleFilterChange = (filterParams) => {
        if (filterParams.type === 'all') {
            processData(originalData);
            return;
        }

        let filteredData = originalData;

        if (filterParams.type === 'individual') {
            filteredData = originalData.filter(row =>
                row.Month.startsWith(filterParams.start)
            );
        } else if (filterParams.type === 'range') {
            filteredData = originalData.filter(row => {
                const rowDate = new Date(row.Month);
                const startDate = new Date(filterParams.start);
                const endDate = new Date(filterParams.end);
                return rowDate >= startDate && rowDate <= endDate;
            });
        } else if (filterParams.type === 'quarterly') {
            filteredData = originalData.filter(row => {
                const rowDate = new Date(row.Month);
                const startDate = new Date(filterParams.start);
                const endDate = new Date(filterParams.end);
                return rowDate >= startDate && rowDate <= endDate;
            });
        }

        processData(filteredData);
    };

    const seriesConfig = chartData.categories
        ? Array.from(chartData.categories).map(category => ({
            dataKey: category,
            label: category,
            valueFormatter: (value) => `$${value?.toLocaleString() || 0}`
        }))
        : [];

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            <div className="header-section">
                <h1 className='heading-rce'>Reserve Categories Expenses</h1>
                <DateFilter onFilterChange={handleFilterChange} />
            </div>
            {chartData.dataset.length > 0 ? (
                <>
                    <div className='chart-section-pc'>
                        <h2>Category Utilization(%) Over the Year</h2>
                        <PieChart
                            series={[
                                {
                                    data: pieChartData,
                                    innerRadius: 30,
                                    outerRadius: 100,
                                    paddingAngle: 5,
                                    cornerRadius: 5,
                                    startAngle: -90,
                                    endAngle: 270,
                                    cx: 110,
                                    cy: 150,
                                }
                            ]}
                            width={500}
                            height={300}
                        />
                    </div>
                    <div className='chart-section'>
                        <h2>Individual Categories Expenses over the period</h2>
                        <BarChart
                            dataset={chartData.dataset}
                            xAxis={[{
                                scaleType: 'band',
                                dataKey: 'month',
                                tickLabelStyle: {
                                    fontSize: 12
                                }
                            }]}
                            series={seriesConfig}
                            {...chartSetting}
                        />
                    </div>

                </>
            ) : (
                <div>No data to display</div>
            )}
        </>
    );
}

export default ExpensesChart;