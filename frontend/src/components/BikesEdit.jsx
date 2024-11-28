import { useEffect } from "react";
import { useBikes, useTypes, useBrands } from "../store";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const BikesEdit = () => {
  const { toast } = useToast();

  const { fetchBikes, bikes, deleteBike } = useBikes();
  const { types, fetchTypes } = useTypes();
  const { brands, fetchBrands } = useBrands();

  useEffect(() => {
    const fetchData = async () => {
      await fetchBikes();
    };

    fetchData();
  }, [fetchBikes]);

  useEffect(() => {
    fetchTypes();
    fetchBrands();
  }, []);

  const handleDelete = async (model, bikeId) => {
    try {
      await axios.delete(`http://localhost:3000/bikes/${bikeId}`);
      deleteBike(bikeId);

      toast({
        title: "Видалення",
        description: `Було успішно видалено велосипед ${model}`,
      });
    } catch (error) {
      toast({
        title: "Помилка видалення",
        description: `Невдалось видалити велосипед ${model}`,
      });
      console.error("Не вдалося видалити велосипед:", error);
    }
  };

  return (
    <div className="overflow-x-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {bikes.map((bike) => (
          <Card key={bike.bike_id} className="w-full">
            <CardHeader>
              <img
                src={bike.bike_image_url}
                alt={bike.bike_model}
                className="w-full object-cover rounded-md"
              />
            </CardHeader>
            <CardContent>
              <h2 className="text-xl font-semibold">{bike.bike_model}</h2>
              <div className="text-sm text-black mt-2">
                <p>Ціна: {bike.bike_price} ₴</p>
                <p>Колір: {bike.bike_color}</p>
                <p>Кількість: {bike.bike_quantity}</p>
                <p>Рейтинг: {bike.bike_rating}</p>
                <p>
                  Тип:{" "}
                  {
                    types?.find((type) => type.type_id === bike.type_id)
                      ?.type_name
                  }
                </p>
                <p>
                  Бренд:{" "}
                  {
                    brands?.find((brand) => brand.brand_id === bike.brand_id)
                      ?.brand_name
                  }
                </p>
                <p>Розмір колеса: {bike.wheel_size} дюймів</p>
                <p>Матеріал рами: {bike.frame_material}</p>
                <p>Кількість передач: {bike.gear_count}</p>
                <p>Вага: {bike.bike_weight} кг</p>
                <p>Макс. вага: {bike.max_weight_capacity} кг</p>
                <p>Стать: {bike.gender}</p>
                <p>Гарантія: {bike.bike_warranty_period} міс.</p>
                <p>
                  Дата випуску:{" "}
                  {new Date(bike.bike_release_date).toLocaleDateString()}
                </p>
                <p>Знижка: {bike.promotion_id || "відсутня"}</p>
                <p className="mt-2">{bike.bike_description}</p>
              </div>
            </CardContent>
            <CardFooter className="justify-center">
              <div className="flex flex-col gap-3">
                <a
                  href={bike.bike_image_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-block"
                >
                  <Button
                    variant="outline"
                    className="w-full transition-all ease-in-out hover:scale-105"
                  >
                    Переглянути зображення
                  </Button>
                </a>
                <NavLink to={`/edit/bikes/${bike.bike_id}`}>
                  <Button
                    variant="outline"
                    className="w-full text-white bg-black transition-all ease-in-out duration-300 hover:bg-gray-800 hover:scale-105 hover:text-white"
                  >
                    Редагувати
                  </Button>
                </NavLink>
                <Dialog>
                  <DialogTrigger className="w-full p-1 rounded-sm bg-red-400 text-sky-50 transition-all ease-in-out duration-300 hover:bg-red-500 hover:scale-105 hover:text-sky-50">
                    Видалити
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="mb-4">
                        Ви впевнені, що хочете видалити велосипед{" "}
                        {bike.bike_model}?
                      </DialogTitle>
                      <div className="flex gap-4">
                        <Button
                          variant="destructive"
                          onClick={() =>
                            handleDelete(bike.bike_model, bike.bike_id)
                          }
                        >
                          Так
                        </Button>
                        <DialogClose>
                          <Button type="button">Ні</Button>
                        </DialogClose>
                      </div>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BikesEdit;
