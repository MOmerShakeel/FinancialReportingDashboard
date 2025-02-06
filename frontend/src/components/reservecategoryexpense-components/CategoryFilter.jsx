const CategoryFilter = ({ categories, selectedCategories, onCategoryChange }) => {
    const handleChange = (category) => {
        if (selectedCategories.includes(category)) {
            onCategoryChange(selectedCategories.filter(c => c !== category));
        } else {
            onCategoryChange([...selectedCategories, category]);
        }
    };

    return (
        <div className="category-filter" style={{ marginBottom: '20px' }}>
            <h3>Filter by Category:</h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {Array.from(categories).map((category) => (
                    <label key={category} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        <input
                            type="checkbox"
                            checked={selectedCategories.includes(category)}
                            onChange={() => handleChange(category)}
                        />
                        {category}
                    </label>
                ))}
            </div>
        </div>
    );
};

export default CategoryFilter;