/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useBikes } from "../store";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BikeInputField = ({ id, label, value }) => (
  <div className="grid grid-cols-4 items-center gap-4">
    <Label htmlFor={id} className="text-left">
      {label}
    </Label>
    <Input id={id} value={value} className="col-span-3" />
  </div>
);

const BikesEdit = () => {
  const { fetchBikes, bikes } = useBikes();

  useEffect(() => {
    const fetchData = async () => {
      await fetchBikes();
    };

    fetchData();
  }, [fetchBikes]);

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
                <p>Тип: {bike.type_id}</p>
                <p>Ідентифікатор бренду: {bike.brand_id}</p>
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
                  <Button variant="outline" className="w-full">
                    Переглянути зображення
                  </Button>
                </a>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Редагувати</Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[80vh] overflow-y-auto p-4 sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Редагувати велосипед</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      {/* Reusable Input Fields */}
                      <BikeInputField
                        id="bike_model"
                        label="Модель"
                        value={bike.bike_model}
                      />
                      <BikeInputField
                        id="bike_image_url"
                        label="Посилання на зображення"
                        value={bike.bike_image_url}
                      />
                      <BikeInputField
                        id="bike_price"
                        label="Ціна"
                        value={bike.bike_price}
                      />
                      <BikeInputField
                        id="bike_color"
                        label="Колір"
                        value={bike.bike_color}
                      />
                      <BikeInputField
                        id="bike_quantity"
                        label="Кількість"
                        value={bike.bike_quantity}
                      />
                      <BikeInputField
                        id="bike_rating"
                        label="Рейтинг"
                        value={bike.bike_rating}
                      />
                      <BikeInputField
                        id="type_id"
                        label="Ідентифікатор типу"
                        value={bike.type_id}
                      />
                      <BikeInputField
                        id="brand_id"
                        label="Ідентифікатор бренду"
                        value={bike.brand_id}
                      />
                      <BikeInputField
                        id="wheel_size"
                        label="Розмір колеса"
                        value={bike.wheel_size}
                      />
                      <BikeInputField
                        id="frame_material"
                        label="Матеріал рами"
                        value={bike.frame_material}
                      />
                      <BikeInputField
                        id="gear_count"
                        label="Кількість передач"
                        value={bike.gear_count}
                      />
                      <BikeInputField
                        id="bike_weight"
                        label="Вага"
                        value={bike.bike_weight}
                      />
                      <BikeInputField
                        id="max_weight_capacity"
                        label="Максимальна допустима вага"
                        value={bike.max_weight_capacity}
                      />
                      <BikeInputField
                        id="gender"
                        label="Стать"
                        value={bike.gender}
                      />
                      <BikeInputField
                        id="bike_warranty_period"
                        label="Гарантія"
                        value={bike.bike_warranty_period}
                      />
                      <BikeInputField
                        id="bike_release_date"
                        label="Дата випуску"
                        value={bike.bike_release_date}
                      />
                      <BikeInputField
                        id="bike_description"
                        label="Опис"
                        value={bike.bike_description}
                      />
                    </div>
                    <DialogFooter>
                      <Button type="submit">Зберегти зміни</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="outline"
                  className="w-full bg-red-400 text-sky-50 transition-all ease-in-out duration-300 hover:bg-red-500 hover:scale-105 hover:text-sky-50"
                >
                  Видалити
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BikesEdit;
