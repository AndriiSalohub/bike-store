import { useEffect, useState } from "react";
import BikesList from "../components/BikesList";
import Sidebar from "../components/Sidebar";
import axios from "axios";

const BikesPage = () => {
  const [priceRange, setPriceRange] = useState([]);
  const [weightRange, setWeightRange] = useState([]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await axios.get("http://localhost:3000/price_limits");
        const prices = response.data.map((item) => +item.bike_price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        setPriceRange([minPrice, maxPrice]);

        setFilters((prev) => ({
          ...prev,
          price: [minPrice, maxPrice],
        }));
      } catch (error) {
        console.error("Помилка отримання даних ціни:", error);
      }
    };

    const fetchWeights = async () => {
      try {
        const response = await axios.get("http://localhost:3000/weight_limits");
        const weights = response.data.map((item) => item.bike_weight);

        const minWeight = Math.min(...weights);
        const maxWeight = Math.max(...weights);

        setWeightRange([minWeight, maxWeight]);

        setFilters((prev) => ({
          ...prev,
          weight: [minWeight, maxWeight],
        }));
      } catch (error) {
        console.log(
          "Помилка отримання даних про мінімальну і максимальну вагу",
          error,
        );
      }
    };

    fetchPrices();
    fetchWeights();
  }, []);

  const [filters, setFilters] = useState({
    types: [],
    brands: [],
    genders: [],
    wheelSizes: [],
    colors: [],
    rating: [0, 5],
    price: [],
    weight: [],
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

  const onClearFilters = () => {
    setFilters({
      types: [],
      brands: [],
      genders: [],
      wheelSizes: [],
      colors: [],
      rating: [0, 5],
      price: [],
      weight: [],
    });
  };

  return (
    <>
      <main className="flex items-start">
        <Sidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          onRangeFilterChange={handleRangeFilterChange}
          onClearFilters={onClearFilters}
          priceRange={priceRange}
          weightRange={weightRange}
        />
        <BikesList filters={filters} />
      </main>
    </>
  );
};

export default BikesPage;
