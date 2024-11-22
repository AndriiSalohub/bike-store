import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useBikes } from "../store";
import { NavLink } from "react-router-dom";

const BikesSlider = () => {
  const { fetchBikes, bikes } = useBikes();

  useEffect(() => {
    const fetchData = async () => {
      await fetchBikes();
    };
    fetchData();
  }, [fetchBikes]);

  return (
    <Carousel className="max-w-72 sm:max-w-96 md:max-w-2xl">
      <CarouselContent>
        {bikes
          .sort((a, b) => b.bike_rating - a.bike_rating)
          .slice(0, 7)
          .map((bike) => (
            <CarouselItem
              key={bike.bike_id}
              className=" md:basis-1/2 lg:basis-1/3"
            >
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6 flex-col">
                    <img
                      src={bike.bike_image_url}
                      alt={bike.bike_model}
                      className="mix-blend-multiply"
                    />
                    <NavLink to={bike.bike_model + "_" + bike.bike_color}>
                      <h3 className="text-sm mt-4 font-bold">
                        {bike.bike_model}
                      </h3>
                    </NavLink>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default BikesSlider;
