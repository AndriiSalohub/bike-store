/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useBikes } from "../store";
import BikesListItem from "./BikesListItem";
import { AnimatePresence } from "framer-motion";

const BikesList = ({ filters }) => {
  const { bikes, fetchBikes } = useBikes();

  useEffect(() => {
    fetchBikes(filters);
  }, [filters]);

  return (
    <AnimatePresence>
      <ul className="w-full grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {bikes.map((bike) => (
          <BikesListItem key={bike.bike_id} {...bike} />
        ))}
      </ul>
    </AnimatePresence>
  );
};

export default BikesList;
