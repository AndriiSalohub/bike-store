import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useBrands, useTypes } from "../store";

const fieldLabels = {
  bike_id: "ID велосипеда",
  bike_model: "Модель велосипеда",
  brand_id: "Назва бренду",
  type_id: "Назва типу",
  bike_price: "Ціна велосипеда",
  wheel_size: "Розмір колеса",
  frame_material: "Матеріал рами",
  gear_count: "Кількість передач",
  bike_color: "Колір велосипеда",
  bike_availability: "Наявність велосипеда",
  bike_quantity: "Кількість велосипедів",
  bike_rating: "Рейтинг велосипеда",
  bike_description: "Опис велосипеда",
  bike_image_url: "URL зображення велосипеда",
  bike_weight: "Вага велосипеда",
  gender: "Призначення за статтю",
  max_weight_capacity: "Максимальна вантажопідйомність",
  bike_warranty_period: "Гарантійний період",
  bike_release_date: "Дата випуску велосипеда",
  promotion_id: "ID знижки",
};

const BikeEditPage = () => {
  const { toast } = useToast();
  const { types, fetchTypes } = useTypes();
  const { brands, fetchBrands } = useBrands();

  const { bike_id: bikeId } = useParams();
  const [bike, setBike] = useState({
    bike_id: null,
    bike_model: "",
    brand_id: "",
    type_id: "",
    bike_price: "",
    wheel_size: "",
    frame_material: "",
    gear_count: "",
    bike_color: "",
    bike_availability: "",
    bike_quantity: "",
    bike_rating: "",
    bike_description: "",
    bike_image_url: "",
    bike_weight: "",
    gender: "",
    max_weight_capacity: "",
    bike_warranty_period: "",
    bike_release_date: "",
    promotion_id: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchBikeData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/bikes/${bikeId}`,
        );
        const data = response.data[0];

        let formattedDate = "";
        if (data.bike_release_date) {
          const date = new Date(data.bike_release_date);
          date.setDate(date.getDate() + 1);
          formattedDate = date.toISOString().split("T")[0];
        }

        setBike({
          ...data,
          bike_release_date: formattedDate,
        });
      } catch (error) {
        console.error("Помилка отримання даних про велосипед:", error);
      }
    };

    fetchBikeData();
  }, [bikeId]);

  useEffect(() => {
    fetchTypes();
    fetchBrands();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setBike((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!bike.bike_model) {
      newErrors.bike_model = "Модель велосипеда обов'язкова.";
    } else if (bike.bike_model.length < 2 || bike.bike_model.length > 100) {
      newErrors.bike_model = "Назва моделі має бути від 2 до 100 символів.";
    }

    const price = parseFloat(bike.bike_price);
    if (!bike.bike_price) {
      newErrors.bike_price = "Ціна обов'язкова.";
    } else if (isNaN(price) || price < 100 || price > 100000) {
      newErrors.bike_price = "Ціна має бути від 100 до 100,000 грн.";
    }

    const quantity = parseInt(bike.bike_quantity);
    if (!bike.bike_quantity) {
      newErrors.bike_quantity = "Кількість обов'язкова.";
    } else if (isNaN(quantity) || quantity < 0 || quantity > 1000) {
      newErrors.bike_quantity = "Кількість має бути від 0 до 1000.";
    }

    const weight = parseFloat(bike.bike_weight);
    if (!bike.bike_weight) {
      newErrors.bike_weight = "Вага велосипеда обов'язкова.";
    } else if (isNaN(weight) || weight < 5 || weight > 50) {
      newErrors.bike_weight = "Вага має бути від 5 до 50 кг.";
    }

    const wheelSize = parseFloat(bike.wheel_size);
    if (!bike.wheel_size) {
      newErrors.wheel_size = "Розмір колеса обов'язковий.";
    } else if (isNaN(wheelSize) || wheelSize < 16 || wheelSize > 29) {
      newErrors.wheel_size = "Розмір колеса має бути від 16 до 29 дюймів.";
    }

    if (!bike.frame_material) {
      newErrors.frame_material = "Матеріал рами обов'язковий.";
    } else if (
      bike.frame_material.length < 2 ||
      bike.frame_material.length > 50
    ) {
      newErrors.frame_material =
        "Назва матеріалу має бути від 2 до 50 символів.";
    }

    if (!bike.bike_color) {
      newErrors.bike_color = "Колір велосипеда обов'язковий.";
    } else if (bike.bike_color.length < 2 || bike.bike_color.length > 30) {
      newErrors.bike_color = "Назва кольору має бути від 2 до 30 символів.";
    }

    if (!bike.type_id) {
      newErrors.type_id = "Тип велосипеда обов'язковий.";
    }

    if (!bike.brand_id) {
      newErrors.brand_id = "Бренд велосипеда обов'язковий.";
    }

    if (bike.bike_availability === "" || bike.bike_availability === null) {
      newErrors.bike_availability = "Виберіть доступність велосипеда.";
    }

    if (!bike.bike_description) {
      newErrors.bike_description = "Опис велосипеда обов'язковий.";
    } else if (
      bike.bike_description.length < 10 ||
      bike.bike_description.length > 500
    ) {
      newErrors.bike_description = "Опис має бути від 10 до 500 символів.";
    }

    const maxWeightCapacity = parseFloat(bike.max_weight_capacity);
    if (!bike.max_weight_capacity) {
      newErrors.max_weight_capacity = "Максимальна вага обов'язкова.";
    } else if (
      isNaN(maxWeightCapacity) ||
      maxWeightCapacity < 50 ||
      maxWeightCapacity > 200
    ) {
      newErrors.max_weight_capacity =
        "Максимальна вага має бути від 50 до 200 кг.";
    }

    if (!bike.gender) {
      newErrors.gender = "Статева приналежність обов'язкова.";
    }

    const gearCount = parseInt(bike.gear_count);
    if (!bike.gear_count) {
      newErrors.gear_count = "Кількість передач обов'язкова.";
    } else if (isNaN(gearCount) || gearCount < 1 || gearCount > 27) {
      newErrors.gear_count = "Кількість передач має бути від 1 до 27.";
    }

    const bikeRating = parseFloat(bike.bike_rating);
    if (bike.bike_rating) {
      if (isNaN(bikeRating) || bikeRating < 0 || bikeRating > 5) {
        newErrors.bike_rating = "Рейтинг повинен бути від 0 до 5.";
      }
    }

    const warrantyPeriod = parseInt(bike.bike_warranty_period);
    if (bike.bike_warranty_period) {
      if (isNaN(warrantyPeriod) || warrantyPeriod < 0 || warrantyPeriod > 60) {
        newErrors.bike_warranty_period =
          "Гарантійний період має бути від 0 до 60 місяців.";
      }
    }

    if (!bike.bike_release_date) {
      newErrors.bike_release_date = "Дата випуску обов'язкова.";
    } else {
      const releaseDate = new Date(bike.bike_release_date);
      const currentDate = new Date();
      const maxDate = new Date();
      maxDate.setFullYear(currentDate.getFullYear() + 1);

      if (releaseDate > maxDate || releaseDate < new Date("2000-01-01")) {
        newErrors.bike_release_date =
          "Дата випуску має бути від 01.01.2000 до наступного року.";
      }
    }

    if (bike.bike_image_url) {
      const urlPattern =
        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlPattern.test(bike.bike_image_url)) {
        newErrors.bike_image_url = "Некоректне посилання на зображення.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validate()) {
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.put(`http://localhost:3000/bikes/${bikeId}`, {
        ...bike,
        bike_release_date: bike.bike_release_date.slice(0, 10),
      });

      toast({
        title: "Результат:",
        description: `Дані про велосипед ${bike.bike_model} успішно змінено!`,
      });
    } catch (error) {
      console.error("Помилка зміни велосипеду:", error);
      toast({
        title: "Результат:",
        description: `Помилка при зміненні даних про велосипед ${bike.bike_model}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Редагування велосипеду: {bike.bike_model}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(bike).map(([key, value]) => (
              <div key={key}>
                <Label htmlFor={key}>
                  {fieldLabels[key] || key.replace(/_/g, " ").toUpperCase()}
                </Label>
                {key === "bike_availability" || key === "gender" ? (
                  <Select
                    value={
                      key === "bike_availability"
                        ? value === 1
                          ? "Доступний"
                          : value === 0
                            ? "Недоступний"
                            : ""
                        : value
                    }
                    onValueChange={(val) =>
                      setBike((prev) => ({
                        ...prev,
                        [key]:
                          key === "bike_availability"
                            ? val === "Доступний"
                              ? 1
                              : 0
                            : val,
                      }))
                    }
                  >
                    <SelectTrigger>
                      {value === 1
                        ? "Доступний"
                        : value === 0
                          ? "Недоступний"
                          : value || "Виберіть опцію"}
                    </SelectTrigger>
                    <SelectContent>
                      {key === "bike_availability" ? (
                        <>
                          <SelectItem value="Доступний">Доступний</SelectItem>
                          <SelectItem value="Недоступний">
                            Недоступний
                          </SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="чоловічий">Чоловічий</SelectItem>
                          <SelectItem value="жіночий">Жіночий</SelectItem>
                          <SelectItem value="унісекс">Унісекс</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                ) : key === "bike_id" ? (
                  <Input id={key} name={key} value={value} disabled />
                ) : key === "bike_description" ? (
                  <Textarea
                    id={key}
                    name={key}
                    value={value || ""}
                    onChange={handleInputChange}
                  />
                ) : key === "bike_release_date" ? (
                  <Input
                    id={key}
                    name={key}
                    type="date"
                    value={value || ""}
                    onChange={handleInputChange}
                  />
                ) : key === "type_id" ? (
                  <Select
                    value={value}
                    onValueChange={(val) =>
                      setBike((prev) => ({ ...prev, type_id: val }))
                    }
                  >
                    <SelectTrigger>
                      {types.find((type) => type.type_id === value)
                        ?.type_name || "Виберіть тип"}
                    </SelectTrigger>
                    <SelectContent>
                      {types.map((type) => (
                        <SelectItem
                          key={type.type_id}
                          value={type.type_id.toString()}
                        >
                          {type.type_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : key === "brand_id" ? (
                  <Select
                    value={value}
                    onValueChange={(val) =>
                      setBike((prev) => ({ ...prev, brand_id: val }))
                    }
                  >
                    <SelectTrigger>
                      {brands.find((brand) => brand.brand_id === value)
                        ?.brand_name || "Виберіть бренд"}
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem
                          key={brand.brand_id}
                          value={brand.brand_id.toString()}
                        >
                          {brand.brand_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={key}
                    name={key}
                    value={value || ""}
                    onChange={handleInputChange}
                    type={
                      [
                        "bike_price",
                        "bike_weight",
                        "wheel_size",
                        "bike_quantity",
                        "gear_count",
                        "bike_rating",
                        "max_weight_capacity",
                        "bike_warranty_period",
                      ].includes(key)
                        ? "number"
                        : "text"
                    }
                  />
                )}
                {errors[key] && (
                  <p className="text-red-500 text-xs mt-1">{errors[key]}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSaveChanges}
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Збереження..." : "Зберегти зміни"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BikeEditPage;
