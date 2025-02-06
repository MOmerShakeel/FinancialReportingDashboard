import { useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select, Box } from '@mui/material';

const DateFilter = ({ onFilterChange }) => {
  const [filterType, setFilterType] = useState('all');
  const [monthRange, setMonthRange] = useState({
    start: '',
    end: ''
  });
  const [selectedQuarter, setSelectedQuarter] = useState('');

  const months = [
    { value: '1/1/2023', label: 'January' },
    { value: '2/1/2023', label: 'February' },
    { value: '3/1/2023', label: 'March' },
    { value: '4/1/2023', label: 'April' },
    { value: '5/1/2023', label: 'May' },
    { value: '6/1/2023', label: 'June' },
    { value: '7/1/2023', label: 'July' },
    { value: '8/1/2023', label: 'August' },
    { value: '9/1/2023', label: 'September' },
    { value: '10/1/2023', label: 'October' },
    { value: '11/1/2023', label: 'November' },
    { value: '12/1/2023', label: 'December' }
  ];

  const quarters = [
    { value: 'Q1', label: 'Q1 (Jan-Mar)', start: '1/1/2023', end: '3/1/2023' },
    { value: 'Q2', label: 'Q2 (Apr-Jun)', start: '4/1/2023', end: '6/1/2023' },
    { value: 'Q3', label: 'Q3 (Jul-Sep)', start: '7/1/2023', end: '9/1/2023' },
    { value: 'Q4', label: 'Q4 (Oct-Dec)', start: '10/1/2023', end: '12/1/2023' }
  ];

  const handleFilterTypeChange = (event) => {
    const newFilterType = event.target.value;
    setFilterType(newFilterType);

    // Reset month range when switching filter types
    setMonthRange({ start: '', end: '' });

    if (newFilterType === 'all') {
      onFilterChange({ type: 'all' });
    }
  };

  const handleMonthChange = (event, isStartMonth = true) => {
    const newMonthRange = {
      ...monthRange,
      [isStartMonth ? 'start' : 'end']: event.target.value
    };
    setMonthRange(newMonthRange);

    if (filterType === 'month' || (newMonthRange.start && newMonthRange.end)) {
      onFilterChange({
        type: filterType,
        start: newMonthRange.start,
        end: newMonthRange.end || newMonthRange.start
      });
    }
  };

  const handleQuarterChange = (event) => {
    const quarterValue = event.target.value;
    setSelectedQuarter(quarterValue);

    const quarter = quarters.find(q => q.value === quarterValue);
    if (quarter) {
      onFilterChange({
        type: 'range',
        start: quarter.start,
        end: quarter.end
      });
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Filter Type</InputLabel>
        <Select
          value={filterType}
          label="Filter Type"
          onChange={handleFilterTypeChange}
        >
          <MenuItem value="all">All Time</MenuItem>
          <MenuItem value="month">Single Month</MenuItem>
          <MenuItem value="range">Month Range</MenuItem>
          <MenuItem value="quarter">Quarterly</MenuItem>
        </Select>
      </FormControl>

      {filterType === 'month' && (
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Month</InputLabel>
          <Select
            value={monthRange.start}
            label="Month"
            onChange={(e) => handleMonthChange(e, true)}
          >
            {months.map((month) => (
              <MenuItem key={month.value} value={month.value}>
                {month.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {filterType === 'range' && (
        <>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Start Month</InputLabel>
            <Select
              value={monthRange.start}
              label="Start Month"
              onChange={(e) => handleMonthChange(e, true)}
            >
              {months.map((month) => (
                <MenuItem key={month.value} value={month.value}>
                  {month.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>End Month</InputLabel>
            <Select
              value={monthRange.end}
              label="End Month"
              onChange={(e) => handleMonthChange(e, false)}
            >
              {months.map((month) => (
                <MenuItem
                  key={month.value}
                  value={month.value}
                  disabled={new Date(month.value) < new Date(monthRange.start)}
                >
                  {month.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}

      {filterType === 'quarter' && (
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Quarter</InputLabel>
          <Select
            value={selectedQuarter}
            label="Quarter"
            onChange={handleQuarterChange}
          >
            {quarters.map((quarter) => (
              <MenuItem key={quarter.value} value={quarter.value}>
                {quarter.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Box>
  );
};

export default DateFilter;