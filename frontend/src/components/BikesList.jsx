/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useBikes } from "../store";
import BikesListItem from "./BikesListItem";

const BikesList = ({ filters }) => {
  const { bikes, fetchBikes } = useBikes();

  useEffect(() => {
    fetchBikes(filters);
  }, [filters]);

  return (
    <ul className="w-full grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {bikes.map((bike) => (
        <BikesListItem key={bike.bike_id} {...bike} />
      ))}
    </ul>
  );
};

export default BikesList;
