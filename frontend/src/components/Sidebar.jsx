/* eslint-disable react/prop-types */
import { useEffect, useRef, useState, useCallback } from "react";
import { IoIosArrowUp } from "react-icons/io";
import { IoMenu } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import "../styles/Sidebar.scss";
import { Slider } from "@/components/ui/slider";
import {
  useBrands,
  useColors,
  useGenders,
  useTypes,
  useWheelSizes,
} from "../store";
import { Button } from "@/components/ui/button";

const Sidebar = ({
  filters,
  onFilterChange,
  onRangeFilterChange,
  onClearFilters,
  priceRange,
  weightRange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const { types, fetchTypes } = useTypes();
  const { brands, fetchBrands } = useBrands();
  const { genders, fetchGenders } = useGenders();
  const { wheelSizes, fetchWheelSizes } = useWheelSizes();
  const { colors, fetchColors } = useColors();

  const [sectionStates, setSectionStates] = useState({
    types: true,
    brands: true,
    genders: true,
    wheelSizes: true,
    colors: true,
    rating: true,
    price: true,
    weight: true,
  });

  const refs = {
    types: useRef(null),
    brands: useRef(null),
    genders: useRef(null),
    wheelSizes: useRef(null),
    colors: useRef(null),
    rating: useRef(null),
    price: useRef(null),
    weight: useRef(null),
  };

  const [heights, setHeights] = useState({
    types: 0,
    brands: 0,
    genders: 0,
    wheelSizes: 0,
    colors: 0,
    rating: 0,
    price: 0,
    weight: 0,
  });

  useEffect(() => {
    Promise.all([
      fetchTypes(),
      fetchBrands(),
      fetchGenders(),
      fetchWheelSizes(),
      fetchColors(),
    ]).catch(console.error);
  }, []);

  useEffect(() => {
    const newHeights = Object.keys(refs).reduce((acc, key) => {
      const current = refs[key].current;
      return {
        ...acc,
        [key]: current ? current.scrollHeight : 0,
      };
    }, {});

    setHeights(newHeights);
  }, [types, brands, genders, wheelSizes, colors]);

  const toggleSection = useCallback((section) => {
    setSectionStates((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  const handleFilterChange = useCallback((section, value) => {
    onFilterChange(section, value);
  }, []);

  const handleRangeFilterChange = useCallback((section, values) => {
    onRangeFilterChange(section, values);
  }, []);

  const clearFilters = () => {
    onClearFilters();
  };

  const renderSection = (title, items, section, ref, isOpen) => {
    let processedItems;

    if (section === "genders") {
      processedItems = items.map((item) => item.gender);
    } else if (section === "wheelSizes") {
      processedItems = items.map(
        (item) => parseFloat(item.wheel_size).toFixed(1) + '"',
      );
    } else if (section === "colors") {
      processedItems = items.map((item) => item.bike_color);
    } else {
      processedItems = items;
    }

    return (
      <section className="filter-sidebar__section">
        <div className="filter-sidebar__header">
          <h4 className="filter-sidebar__section-title">{title}</h4>
          <IoIosArrowUp
            onClick={() => toggleSection(section)}
            className={`filter-sidebar__toggle-icon ${
              isOpen ? "is-open" : "is-closed"
            }`}
          />
        </div>
        <ul
          ref={ref}
          className={`filter-sidebar__filter-list ${
            isOpen ? "is-expanded" : ""
          }`}
          style={{
            height: isOpen ? `${heights[section]}px` : "0px",
          }}
        >
          {processedItems.map((item) => {
            const key = item.type_id || item.brand_id || item;
            const displayName = item.type_name || item.brand_name || item;

            return (
              <li
                key={`${section}-${key}`}
                className="filter-sidebar__filter-list-item"
              >
                <input
                  type="checkbox"
                  id={`${section}-${key}`}
                  checked={filters[section].includes(displayName)}
                  onChange={() => handleFilterChange(section, displayName)}
                />
                <label
                  htmlFor={`${section}-${key}`}
                  className="filter-sidebar__filter-list-item-label"
                >
                  {displayName}
                </label>
              </li>
            );
          })}
        </ul>
      </section>
    );
  };

  const renderRangeSection = (title, section, min, max, step, unit = "") => {
    return (
      <section className="filter-sidebar__section">
        <div className="filter-sidebar__header">
          <h4 className="filter-sidebar__section-title">{title}</h4>
          <IoIosArrowUp
            onClick={() => toggleSection(section)}
            className={`filter-sidebar__toggle-icon ${
              sectionStates[section] ? "is-open" : "is-closed"
            }`}
          />
        </div>
        <div
          className={`filter-sidebar__range-container ${
            sectionStates[section] ? "is-expanded" : ""
          }`}
          style={{
            height: sectionStates[section] ? `${heights[section]}px` : "0px",
          }}
          ref={refs[section]}
        >
          <div className="filter-sidebar__range-section-content">
            <Slider
              defaultValue={filters[section]}
              min={min}
              max={max}
              step={step}
              onValueChange={(values) =>
                handleRangeFilterChange(section, values)
              }
            />
            <div className="filter-sidebar__range-section-labels">
              <span>
                {filters[section][0]}
                {unit}
              </span>
              <span>
                {filters[section][1]}
                {unit}
              </span>
            </div>
          </div>
        </div>
      </section>
    );
  };

  return (
    <>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="filter-sidebar-toggle"
      >
        {isOpen ? <RxCross2 /> : <IoMenu />}
      </button>
      <aside className={`filter-sidebar ${isOpen ? "is-open" : ""}`}>
        <Button className="block mx-auto" onClick={clearFilters}>
          Очистити всі фільтри
        </Button>
        {renderSection("Типи", types, "types", refs.types, sectionStates.types)}
        {renderSection(
          "Бренди",
          brands,
          "brands",
          refs.brands,
          sectionStates.brands,
        )}
        {priceRange.length > 0 &&
          renderRangeSection(
            "Ціна",
            "price",
            priceRange[0],
            priceRange[1],
            10,
            " ₴",
          )}
        {renderSection(
          "Статі",
          genders,
          "genders",
          refs.genders,
          sectionStates.genders,
        )}
        {renderRangeSection("Рейтинг", "rating", 0, 5, 0.1)}
        {renderSection(
          "Колір",
          colors,
          "colors",
          refs.colors,
          sectionStates.colors,
        )}
        {renderSection(
          "Розмір колес",
          wheelSizes,
          "wheelSizes",
          refs.wheelSizes,
          sectionStates.wheelSizes,
        )}
        {weightRange.length > 0 &&
          renderRangeSection(
            "Вага",
            "weight",
            weightRange[0],
            weightRange[1],
            0.1,
            " кг",
          )}
      </aside>
    </>
  );
};

export default Sidebar;
