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
import { motion } from "framer-motion";

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
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{
          opacity: 0,
          scale: 0.9,
          transition: {
            duration: 0.3,
          },
        }}
        layout
      >
        <NavLink to={`/bikes/${bike_model.split(" ").join("") + bike_color}`}>
          <CardHeader>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{
                opacity: 0,
                scale: 0.9,
                transition: { duration: 0.3 },
              }}
            >
              <img
                src={bike_image_url}
                alt={bike_model}
                className="object-contain"
              />
            </motion.div>
            <CardTitle className="text-xl mb-2">
              {bike_model} {bike_color}
            </CardTitle>
            <CardDescription className="mt-0">
              {types?.find((type) => type.type_id == type_id)?.type_name}
            </CardDescription>
          </CardHeader>
          <div className="flex justify-between items-center px-6">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-bold"
            >
              {bike_price} ₴
            </motion.span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {inBag ? (
                <MdShoppingBag size={25} />
              ) : (
                <MdOutlineShoppingBag size={25} />
              )}
            </motion.button>
          </div>
        </NavLink>
      </motion.div>
    </Card>
  );
};

export default BikesListItem;
