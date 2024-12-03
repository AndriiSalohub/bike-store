/* eslint-disable react/prop-types */
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useTypes } from "../store";
import { useEffect, useState } from "react";
import { MdOutlineShoppingBag, MdShoppingBag } from "react-icons/md";
import { NavLink } from "react-router-dom";

const BikesListItem = ({
  bike_model,
  type_id,
  bike_price,
  bike_image_url,
  bike_color,
}) => {
  const { types, fetchTypes } = useTypes();
  const [inBag, setInBag] = useState(false);

  useEffect(() => {
    fetchTypes();
  }, []);

  return (
    <Card className="p-4">
      <NavLink to={`/bikes/${bike_model.split(" ").join("") + bike_color}`}>
        <CardHeader>
          <div className="flex justify-center mb-8">
            <img
              src={bike_image_url}
              alt={bike_model}
              className="object-contain"
            />
          </div>
          <CardTitle className="text-xl mb-2">
            {bike_model} {bike_color}
          </CardTitle>
          <CardDescription className="mt-0">
            {types?.find((type) => type.type_id == type_id)?.type_name}
          </CardDescription>
        </CardHeader>
        <div className="flex justify-between items-center px-6">
          <span className="font-bold">{bike_price} ₴</span>
          <button>
            {inBag ? (
              <MdShoppingBag size={25} />
            ) : (
              <MdOutlineShoppingBag size={25} />
            )}
          </button>
        </div>
      </NavLink>
    </Card>
  );
};

export default BikesListItem;
