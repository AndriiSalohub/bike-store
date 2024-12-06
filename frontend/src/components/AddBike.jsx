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
    bike_color: "",
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

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setBikeDetails({ ...bikeDetails, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};

    if (!bikeDetails.bike_model)
      newErrors.bike_model = "Модель велосипеда є обов'язковою!";

    if (
      !bikeDetails.bike_price ||
      isNaN(bikeDetails.bike_price) ||
      bikeDetails.bike_price <= 1000 ||
      bikeDetails.bike_price > 1000000
    ) {
      newErrors.bike_price =
        "Ціна повинна бути числом, більше тисячі і менше мільйона!";
    }

    if (
      !bikeDetails.bike_quantity ||
      isNaN(bikeDetails.bike_quantity) ||
      bikeDetails.bike_quantity <= 0 ||
      bikeDetails.bike_quantity > 3000
    ) {
      newErrors.bike_quantity =
        "Кількість повинна бути числом, більше нуля і менше трьох тисяч!";
    }

    if (
      !bikeDetails.bike_weight ||
      isNaN(bikeDetails.bike_weight) ||
      bikeDetails.bike_weight <= 5 ||
      bikeDetails.bike_weight > 40
    ) {
      newErrors.bike_weight =
        "Вага повинна бути числом і більше п'яти кг, але не більше 40 кг!";
    }

    if (
      !bikeDetails.bike_rating ||
      isNaN(bikeDetails.bike_rating) ||
      bikeDetails.bike_rating < 0 ||
      bikeDetails.bike_rating > 5
    ) {
      newErrors.bike_rating = "Рейтинг повинен бути числом від 0 до 5!";
    }

    console.log(bikeDetails.bike_availability);
    if (
      bikeDetails.bike_availability != 1 ||
      bikeDetails.bike_availability == 0
    )
      newErrors.bike_availability = "Оберіть наявність велосипеда!";

    if (
      !bikeDetails.max_weight_capacity ||
      isNaN(bikeDetails.max_weight_capacity) ||
      bikeDetails.max_weight_capacity <= 10 ||
      bikeDetails.max_weight_capacity > 250
    ) {
      newErrors.max_weight_capacity =
        "Максимальна вантажопідйомність повинна бути числом і більше 10 кг, але не більше 250 кг!";
    }

    if (
      !bikeDetails.bike_warranty_period ||
      isNaN(bikeDetails.bike_warranty_period) ||
      bikeDetails.bike_warranty_period <= 0 ||
      bikeDetails.bike_warranty_period > 60
    ) {
      newErrors.bike_warranty_period =
        "Гарантійний період повинен бути числом і більше нуля, але не більше 60 місяців!";
    }

    if (!bikeDetails.bike_release_date) {
      newErrors.bike_release_date = "Дата випуску є обов'язковою!";
    } else {
      const releaseDate = new Date(bikeDetails.bike_release_date);
      const minDate = new Date("2020-01-01");
      const currentDate = new Date();
      if (releaseDate < minDate || releaseDate > currentDate) {
        newErrors.bike_release_date =
          "Дата випуску повинна бути не раніше 2020 року та не пізніше поточної дати!";
      }
    }

    if (
      !bikeDetails.bike_image_url ||
      !/^(ftp|http|https):\/\/[^ "]+$/.test(bikeDetails.bike_image_url)
    ) {
      newErrors.bike_image_url = "Вкажіть правильне посилання на зображення!";
    }

    if (!bikeDetails.gender)
      newErrors.gender = "Оберіть статеву приналежність велосипеда!";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

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
      setBikeDetails({
        bike_model: "",
        bike_price: "",
        bike_color: "",
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
                {errors.bike_model && (
                  <div className="text-red-600 text-sm">
                    {errors.bike_model}
                  </div>
                )}
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
                  {errors.bike_price && (
                    <div className="text-red-600 text-sm">
                      {errors.bike_price}
                    </div>
                  )}
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
                  {errors.bike_quantity && (
                    <div className="text-red-600 text-sm">
                      {errors.bike_quantity}
                    </div>
                  )}
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
                  {errors.bike_weight && (
                    <div className="text-red-600 text-sm">
                      {errors.bike_weight}
                    </div>
                  )}
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
                  {errors.bike_availability && (
                    <div className="text-red-600 text-sm">
                      {errors.bike_availability}
                    </div>
                  )}
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
                  {errors.max_weight_capacity && (
                    <div className="text-red-600 text-sm">
                      {errors.max_weight_capacity}
                    </div>
                  )}
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
                  {errors.gender && (
                    <div className="text-red-600 text-sm">{errors.gender}</div>
                  )}
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
                  {errors.bike_rating && (
                    <div className="text-red-600 text-sm">
                      {errors.bike_rating}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <Input
                    name="bike_warranty_period"
                    type="number"
                    placeholder="Гарантійний період (місяці)"
                    value={bikeDetails.bike_warranty_period}
                    onChange={handleChange}
                  />
                  {errors.bike_warranty_period && (
                    <div className="text-red-600 text-sm">
                      {errors.bike_warranty_period}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <Input
                    name="bike_release_date"
                    type="date"
                    placeholder="Дата випуску"
                    value={bikeDetails.bike_release_date}
                    onChange={handleChange}
                  />
                  {errors.bike_release_date && (
                    <div className="text-red-600 text-sm">
                      {errors.bike_release_date}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <Input
                  name="bike_image_url"
                  placeholder="Посилання на зображення"
                  value={bikeDetails.bike_image_url}
                  onChange={handleChange}
                />
                {errors.bike_image_url && (
                  <div className="text-red-600 text-sm">
                    {errors.bike_image_url}
                  </div>
                )}
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
