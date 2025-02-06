import React, { useState, useEffect } from 'react';
import { PieChart } from '@mui/x-charts';
import Papa from 'papaparse';
import ExpensesFile from '../../assets/Data-ReserveCategoriesExpense.csv';
import "./CategoryExpensesPieChart.css"

const CategoryExpensesPieChart = ({ dateFilter }) => {
    const [originalData, setOriginalData] = useState([]);
    const [pieChartData, setPieChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const processData = (data) => {
        const categoryUtilization = {};

        data.forEach((row) => {
            const category = row.Category?.trim();
            const utilization = parseFloat(row['% of total Utilization']);

            if (!category || isNaN(utilization)) {
                return;
            }

            if (!categoryUtilization[category]) {
                categoryUtilization[category] = 0;
            }
            categoryUtilization[category] += utilization;
        });

        const totalSum = Object.values(categoryUtilization).reduce((a, b) => a + b, 0);

        const pieData = Object.keys(categoryUtilization).map(category => ({
            id: category,
            label: `${category} (${(categoryUtilization[category] / totalSum * 100).toFixed(2)}%)`,
            value: (categoryUtilization[category] / totalSum * 100).toFixed(2)
        }));

        setPieChartData(pieData);
    };

    // Load initial data
    useEffect(() => {
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
    }, []);

    // Handle filter changes
    useEffect(() => {
        if (!dateFilter || !originalData.length) return;

        let filteredData = originalData;

        if (dateFilter.type === 'all') {
            processData(originalData);
            return;
        }

        if (dateFilter.type === 'individual') {
            filteredData = originalData.filter(row =>
                row.Month.startsWith(dateFilter.start)
            );
        } else if (dateFilter.type === 'range' || dateFilter.type === 'quarterly') {
            filteredData = originalData.filter(row => {
                const rowDate = new Date(row.Month);
                const startDate = new Date(dateFilter.start);
                const endDate = new Date(dateFilter.end);
                return rowDate >= startDate && rowDate <= endDate;
            });
        }

        processData(filteredData);
    }, [dateFilter, originalData]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='chart-section-pc'>
            <h2 className='heading-graphs'>Category Utilization(%)</h2>
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
                        cy: 140,
                    }
                ]}
                width={450}
                height={300}
            />
        </div>
    );
};

export default CategoryExpensesPieChart;