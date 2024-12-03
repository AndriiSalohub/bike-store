import BikesList from "../components/BikesList";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

const BikesPage = () => {
  const [filters, setFilters] = useState({
    types: [],
    brands: [],
    genders: [],
    wheelSizes: [],
    colors: [],
    rating: [0, 5],
    price: [0, 1000000],
    weight: [0, 30],
  });

  const handleFilterChange = (section, value) => {
    setFilters((prev) => {
      const currentFilters = prev[section];
      const newFilters = currentFilters.includes(value)
        ? currentFilters.filter((f) => f !== value)
        : [...currentFilters, value];
      return { ...prev, [section]: newFilters };
    });
  };

  const handleRangeFilterChange = (section, values) => {
    setFilters((prev) => ({
      ...prev,
      [section]: values,
    }));
  };

  return (
    <>
      <section className="flex items-start">
        <Sidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          onRangeFilterChange={handleRangeFilterChange}
        />
        <BikesList filters={filters} />
      </section>
    </>
  );
};

export default BikesPage;
