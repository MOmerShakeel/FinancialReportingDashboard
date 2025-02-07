import React from "react";

const CategoryFilter = ({ categories, selectedCategory, onFilterChange }) => {
    return (
        <select value={selectedCategory} onChange={(e) => onFilterChange(e.target.value)}>
            <option value="all">All Categories</option>
            {categories.map((category) => (
                <option key={category} value={category}>
                    {category}
                </option>
            ))}
        </select>
    );
};

export default CategoryFilter;
