/* eslint-disable react/prop-types */
import { NavLink } from "react-router-dom";

const SearchResults = ({ results }) => {
  // If no results, show a message
  if (results.length === 0) {
    return (
      <div className="search-results search-results--empty">
        <p className="search-results__no-results">
          На жаль, за вашим запитом не знайдено жодного велосипеда.
        </p>
      </div>
    );
  }

  return (
    <div className="search-results">
      {results.map(
        ({
          bike_id,
          bike_model,
          bike_color,
          bike_image_url,
          type_name,
          brand_name,
        }) => (
          <NavLink
            key={bike_id}
            to={`/bikes/${bike_model.split(" ").join("") + bike_color}`}
            className="search-result"
          >
            <div className="search-result__info">
              <img src={bike_image_url} alt={bike_model} />
              <div>
                <h3 className="search-result__model">{bike_model}</h3>
                <p className="search-result__color">Колір: {bike_color}</p>
                <p className="search-result__brand">Бренд: {brand_name}</p>
                <p className="search-result__type">Тип: {type_name}</p>
              </div>
            </div>
          </NavLink>
        ),
      )}
    </div>
  );
};

export default SearchResults;
