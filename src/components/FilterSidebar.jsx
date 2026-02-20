const FilterSidebar = ({ filters, setFilters }) => {
  const categories = ['Men', 'Women', 'Kids']

  const toggleFilter = (filterType, value) => {
    const currentFilters = filters[filterType]
    const newFilters = currentFilters.includes(value)
      ? currentFilters.filter(item => item !== value)
      : [...currentFilters, value]
    setFilters({ ...filters, [filterType]: newFilters })
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
      <h2 className="text-xl font-bold mb-6">FILTERS</h2>

      <div>
        <h3 className="font-semibold mb-3">CATEGORIES</h3>
        <div className="space-y-2">
          {categories.map(category => (
            <label key={category} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={() => toggleFilter('categories', category)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-600 cursor-pointer"
              />
              <span className="text-sm group-hover:text-blue-600 transition-colors">
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FilterSidebar