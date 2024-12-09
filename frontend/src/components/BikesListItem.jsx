/* eslint-disable react/prop-types */
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useCart, useTypes } from "../store";
import { useEffect, useState } from "react";
import { MdOutlineShoppingBag, MdShoppingBag } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { Badge } from "@/components/ui/badge";

const BikesListItem = ({
  bike_id,
  bike_model,
  type_id,
  bike_price,
  bike_image_url,
  bike_color,
  cartId,
  promotion_name,
  discount_percentage,
}) => {
  const { types, fetchTypes } = useTypes();
  const [inBag, setInBag] = useState(false);
  const { updateCartItemCount } = useCart();

  useEffect(() => {
    fetchTypes();

    const checkCartStatus = async () => {
      try {
        const response = await axios.get("http://localhost:3000/cart/status", {
          params: {
            bikeId: bike_id,
            cartId: cartId,
          },
        });

        setInBag(response.data.isInCart);
      } catch (error) {
        console.error("Помилка перевірки статусу кошика:", error);
      }
    };

    if (cartId) {
      checkCartStatus();
    }
  }, [bike_id, cartId]);

  const handleAddToBike = async () => {
    try {
      const response = await axios.post("http://localhost:3000/bike_cart", {
        bikeId: bike_id,
        cartId: cartId,
        quantity: 1,
      });

      setInBag(response.data.isInCart);
      updateCartItemCount(response.data.isInCart ? 1 : -1);
    } catch (error) {
      console.error("Error adding/removing from cart:", error);
    }
  };

  const discountedPrice = promotion_name
    ? bike_price - bike_price * parseFloat(discount_percentage)
    : null;

  return (
    <Card className="p-4 relative">
      {promotion_name && (
        <Badge className="absolute top-2 left-2 p-2">{promotion_name}</Badge>
      )}
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
        <NavLink to={`/bikes/${bike_id}`}>
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
        </NavLink>
        <div className="flex justify-between items-center px-6">
          {promotion_name ? (
            <>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-bold line-through text-gray-500 mr-2"
              >
                {bike_price} ₴
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-bold"
              >
                {discountedPrice.toFixed(2)} ₴
              </motion.span>
            </>
          ) : (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-bold"
            >
              {bike_price} ₴
            </motion.span>
          )}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.preventDefault();
              handleAddToBike();
            }}
          >
            {inBag ? (
              <MdShoppingBag size={25} />
            ) : (
              <MdOutlineShoppingBag size={25} />
            )}
          </motion.button>
        </div>
      </motion.div>
    </Card>
  );
};

export default BikesListItem;
