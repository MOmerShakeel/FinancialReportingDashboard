import "./DateFilter.css"

const DateFilter = ({ 
  months, 
  selectedType, 
  startMonth, 
  endMonth, 
  onFilterChange 
}) => {
  const handleTypeChange = (e) => {
    onFilterChange({ type: e.target.value });
  };

  const handleStartChange = (e) => {
    onFilterChange({ start: e.target.value });
  };

  const handleEndChange = (e) => {
    onFilterChange({ end: e.target.value });
  };

  return (
    <div className="filter-container">
      <div className="filter-group">
        <label>Display Data: </label>
        <select 
          value={selectedType} 
          onChange={handleTypeChange}
          className="filter-select"
        >
          <option value="both">Both</option>
          <option value="reserves">Projected Reserves</option>
          <option value="growth">Growth Rate</option>
        </select>
      </div>
      
      <div className="filter-group">
        <label>Date Range: </label>
        <select 
          value={startMonth} 
          onChange={handleStartChange}
          className="filter-select"
        >
          <option value="">Start Month</option>
          {months.map((month) => (
            <option key={month} value={month}>
              {new Date(month).toLocaleDateString('en-US', { 
                month: 'short', 
                year: 'numeric' 
              })}
            </option>
          ))}
        </select>
        <span className="filter-to">to</span>
        <select 
          value={endMonth} 
          onChange={handleEndChange}
          className="filter-select"
        >
          <option value="">End Month</option>
          {months.map((month) => (
            <option key={month} value={month}>
              {new Date(month).toLocaleDateString('en-US', { 
                month: 'short', 
                year: 'numeric' 
              })}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DateFilter;