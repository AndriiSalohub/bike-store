/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useAuth, useBikes } from "../store";
import BikesListItem from "./BikesListItem";
import { AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";

const BikesList = ({ filters }) => {
  const { bikes, fetchBikes } = useBikes();
  const { user } = useAuth();
  const [sorting, setSorting] = useState(null);
  const [cartId, setCartId] = useState();

  useEffect(() => {
    fetchBikes(filters, sorting);
  }, [filters, sorting]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get("http://localhost:3000/cart", {
          params: {
            email: user?.user_email,
          },
        });

        if (user) {
          setCartId(response.data[0].cart_id);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchCart();
  }, [user]);

  return (
    <section className="w-full">
      <div className="flex justify-end mb-4 mr-4">
        <Select onValueChange={(val) => setSorting(val)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Сортування" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Сортування</SelectLabel>
              <SelectItem value="price_asc">
                Ціна: від низької до високої
              </SelectItem>
              <SelectItem value="price_desc">
                Ціна: від високої до низької
              </SelectItem>
              <SelectItem value="rating">За рейтингом</SelectItem>
              <SelectItem value="default">За замовчуванням</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <AnimatePresence>
        <ul className="w-full grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {bikes.map((bike) =>
            bike.bike_availability != 0 ? (
              <BikesListItem key={bike.bike_id} {...bike} cartId={cartId} />
            ) : null,
          )}
        </ul>
      </AnimatePresence>
    </section>
  );
};

export default BikesList;
