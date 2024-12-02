import { useState } from "react";
import { useTypes, useBrands } from "../store";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const AddBike = () => {
  const { toast } = useToast();
  const { types } = useTypes();
  const { brands } = useBrands();

  const [bikeDetails, setBikeDetails] = useState({
    bike_model: "",
    bike_price: "",
    bike_color: "", // Add bike_color to the state
    bike_quantity: "",
    bike_weight: "",
    wheel_size: "",
    frame_material: "",
    gear_count: "",
    max_weight_capacity: "",
    gender: "",
    bike_description: "",
    bike_image_url: "",
    type_id: "",
    brand_id: "",
    promotion_id: null,
    bike_availability: "",
    bike_rating: "",
    bike_warranty_period: "",
    bike_release_date: "",
  });

  const handleChange = (e) => {
    setBikeDetails({ ...bikeDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formattedDate = new Date(bikeDetails.bike_release_date)
        .toISOString()
        .split("T")[0];

      const dataToSubmit = {
        ...bikeDetails,
        bike_release_date: formattedDate,
      };

      await axios.post("http://localhost:3000/bikes", dataToSubmit);

      toast({
        title: "Успішно додано",
        description: `Велосипед ${bikeDetails.bike_model} успішно додано!`,
      });
    } catch (error) {
      toast({
        title: "Помилка додавання",
        description: "Не вдалося додати велосипед",
      });

      console.error("Не вдалося додати велосипед:", error);
    }
  };

  return (
    <section className="overflow-x-auto p-4 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Додати новий велосипед</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Input
                  name="bike_model"
                  placeholder="Модель велосипеда"
                  value={bikeDetails.bike_model}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex space-x-4">
                <div className="flex-1">
                  <Input
                    name="bike_price"
                    type="number"
                    placeholder="Ціна"
                    value={bikeDetails.bike_price}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex-1">
                  <Input
                    name="bike_quantity"
                    type="number"
                    placeholder="Кількість"
                    value={bikeDetails.bike_quantity}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="flex-1">
                  <Input
                    name="bike_weight"
                    type="number"
                    placeholder="Вага велосипеда (кг)"
                    value={bikeDetails.bike_weight}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex-1">
                  <Input
                    name="wheel_size"
                    type="number"
                    placeholder="Розмір колеса (дюйми)"
                    value={bikeDetails.wheel_size}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Input
                  name="frame_material"
                  placeholder="Матеріал рами"
                  value={bikeDetails.frame_material}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Input
                  name="bike_color"
                  placeholder="Колір велосипеда"
                  value={bikeDetails.bike_color}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex space-x-4">
                <div className="flex-1">
                  <Select
                    value={
                      types.find((type) => type.type_id === bikeDetails.type_id)
                        ?.type_name || ""
                    }
                    onValueChange={(val) => {
                      const selectedType = types.find(
                        (type) => type.type_name === val,
                      );

                      setBikeDetails((prev) => ({
                        ...prev,
                        type_id: selectedType?.type_id || "",
                      }));
                    }}
                  >
                    <SelectTrigger>
                      {types.find((type) => type.type_id == bikeDetails.type_id)
                        ?.type_name || "Оберіть тип"}
                    </SelectTrigger>
                    <SelectContent>
                      {types.map((type) => (
                        <SelectItem key={type.type_id} value={type.type_name}>
                          {type.type_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Select
                    value={
                      brands.find(
                        (brand) => brand.brand_id === bikeDetails.brand_id,
                      )?.brand_name || ""
                    }
                    onValueChange={(val) => {
                      const selectedBrand = brands.find(
                        (brand) => brand.brand_name === val,
                      );

                      setBikeDetails((prev) => ({
                        ...prev,
                        brand_id: selectedBrand?.brand_id || "",
                      }));
                    }}
                  >
                    <SelectTrigger>
                      {brands.find(
                        (brand) => brand.brand_id == bikeDetails.brand_id,
                      )?.brand_name || "Оберіть бренд"}
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem
                          key={brand.brand_id}
                          value={brand.brand_name}
                        >
                          {brand.brand_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Select
                    value={
                      bikeDetails.bike_availability === 1
                        ? "Доступний"
                        : bikeDetails.bike_availability === 0
                          ? "Недоступний"
                          : ""
                    }
                    onValueChange={(val) => {
                      setBikeDetails((prev) => ({
                        ...prev,
                        bike_availability: val === "Доступний" ? 1 : 0,
                      }));
                    }}
                  >
                    <SelectTrigger>
                      {bikeDetails.bike_availability === 1
                        ? "Доступний"
                        : bikeDetails.bike_availability === 0
                          ? "Недоступний"
                          : "Виберіть наявність"}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Доступний">Доступний</SelectItem>
                      <SelectItem value="Недоступний">Недоступний</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Textarea
                  name="bike_description"
                  placeholder="Опис велосипеда"
                  value={bikeDetails.bike_description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex space-x-4">
                <div className="flex-1">
                  <Input
                    name="max_weight_capacity"
                    type="number"
                    placeholder="Макс. вага (кг)"
                    value={bikeDetails.max_weight_capacity}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="flex-1">
                  <Select
                    value={bikeDetails.gender || ""}
                    onValueChange={(val) => {
                      setBikeDetails((prev) => ({
                        ...prev,
                        gender: val,
                      }));
                    }}
                  >
                    <SelectTrigger>
                      {bikeDetails.gender || "Оберіть статеву приналежність"}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="чоловічий">Чоловічий</SelectItem>
                      <SelectItem value="жіночий">Жіночий</SelectItem>
                      <SelectItem value="унісекс">Унісекс</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Input
                    name="gear_count"
                    type="number"
                    placeholder="Кількість передач"
                    value={bikeDetails.gear_count}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="flex-1">
                  <Input
                    name="bike_rating"
                    type="number"
                    placeholder="Рейтинг велосипеда"
                    value={bikeDetails.bike_rating}
                    onChange={handleChange}
                    min={0}
                    max={5}
                  />
                </div>

                <div className="flex-1">
                  <Input
                    name="bike_warranty_period"
                    type="number"
                    placeholder="Гарантійний період (місяці)"
                    value={bikeDetails.bike_warranty_period}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex-1">
                  <Input
                    name="bike_release_date"
                    type="date"
                    placeholder="Дата випуску"
                    value={bikeDetails.bike_release_date}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <Input
                  name="bike_image_url"
                  placeholder="Посилання на зображення"
                  value={bikeDetails.bike_image_url}
                  onChange={handleChange}
                />
              </div>

              <Button type="submit">Додати велосипед</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};

export default AddBike;
