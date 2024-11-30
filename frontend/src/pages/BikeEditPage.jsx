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
  };

  const validate = () => {
    const newErrors = {};

    if (!bike.bike_model)
      newErrors.bike_model = "Модель велосипеда є обов'язковою!";

    if (
      !bike.bike_price ||
      isNaN(bike.bike_price) ||
      bike.bike_price <= 1000 ||
      bike.bike_price > 1000000
    ) {
      newErrors.bike_price =
        "Ціна повинна бути числом, більше тисячі і менше мільйона!";
    }

    if (
      !bike.bike_quantity ||
      isNaN(bike.bike_quantity) ||
      bike.bike_quantity <= 0 ||
      bike.bike_quantity > 3000
    ) {
      newErrors.bike_quantity =
        "Кількість повинна бути числом, більше нуля і менше трьох тисяч!";
    }

    if (
      !bike.bike_weight ||
      isNaN(bike.bike_weight) ||
      bike.bike_weight <= 5 ||
      bike.bike_weight > 40
    ) {
      newErrors.bike_weight =
        "Вага повинна бути числом і більше п'яти кг, але не більше 40 кг!";
    }

    if (
      !bike.bike_rating ||
      isNaN(bike.bike_rating) ||
      bike.bike_rating < 0 ||
      bike.bike_rating > 5
    ) {
      newErrors.bike_rating = "Рейтинг повинен бути числом від 0 до 5!";
    }

    if (
      !bike.max_weight_capacity ||
      isNaN(bike.max_weight_capacity) ||
      bike.max_weight_capacity <= 25 ||
      bike.max_weight_capacity > 1500
    ) {
      newErrors.max_weight_capacity =
        "Максимальна вантажопідйомність повинна бути числом і більше 25 кг, але не більше 150 кг!";
    }

    if (
      !bike.bike_warranty_period ||
      isNaN(bike.bike_warranty_period) ||
      bike.bike_warranty_period <= 0 ||
      bike.bike_warranty_period > 60
    ) {
      newErrors.bike_warranty_period =
        "Гарантійний період повинен бути числом і більше нуля, але не більше 60 місяців!";
    }

    if (!bike.bike_release_date) {
      newErrors.bike_release_date = "Дата випуску є обов'язковою!";
    } else {
      const releaseDate = new Date(bike.bike_release_date);
      const minDate = new Date("2020-01-01");
      const currentDate = new Date();
      if (releaseDate < minDate || releaseDate > currentDate) {
        newErrors.bike_release_date =
          "Дата випуску повинна бути не раніше 2020 року та не пізніше поточної дати!";
      }
    }

    if (
      !bike.bike_image_url ||
      !/^(ftp|http|https):\/\/[^ "]+$/.test(bike.bike_image_url)
    ) {
      newErrors.bike_image_url = "Вкажіть правильне посилання на зображення!";
    }

    if (!bike.bike_availability)
      newErrors.bike_availability = "Оберіть наявність велосипеда!";

    if (!bike.gender)
      newErrors.gender = "Оберіть статеву приналежність велосипеда!";

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
                ) : key === "bike_image_url" ? (
                  <div className="space-y-2">
                    <Input
                      id={key}
                      name={key}
                      type="text"
                      placeholder="Вставте посилання на зображення"
                      value={value || ""}
                      onChange={handleInputChange}
                    />
                    <div className="mt-2">
                      <img
                        src={value}
                        alt="Прев'ю велосипеда"
                        className="w-full object-cover rounded-md"
                      />
                    </div>
                  </div>
                ) : key === "type_id" ? (
                  <Select
                    value={
                      types.find((type) => type.type_id === bike.type_id)
                        ?.type_name || ""
                    }
                    onValueChange={(val) => {
                      const selectedType = types.find(
                        (type) => type.type_name === val,
                      );

                      setBike((prev) => ({
                        ...prev,
                        type_id: selectedType?.type_id || "",
                      }));
                    }}
                  >
                    <SelectTrigger>
                      {types.find((type) => type.type_id === bike.type_id)
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
                ) : key === "brand_id" ? (
                  <Select
                    value={
                      brands.find((brand) => brand.brand_id === bike.brand_id)
                        ?.brand_name || ""
                    }
                    onValueChange={(val) => {
                      const selectedBrand = brands.find(
                        (brand) => brand.brand_name === val,
                      );

                      setBike((prev) => ({
                        ...prev,
                        brand_id: selectedBrand?.brand_id || "",
                      }));
                    }}
                  >
                    <SelectTrigger>
                      {brands.find((brand) => brand.brand_id === bike.brand_id)
                        ?.brand_name || "Оберіть бренд"}
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
                ) : (
                  <Input
                    id={key}
                    name={key}
                    type={
                      key.includes("price") ||
                      key.includes("quantity") ||
                      key.includes("rating") ||
                      key.includes("weight") ||
                      key.includes("warranty_period")
                        ? "number"
                        : "text"
                    }
                    value={value || ""}
                    onChange={handleInputChange}
                  />
                )}
                {errors[key] && (
                  <div className="text-red-600 text-sm">{errors[key]}</div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={(e) => handleSaveChanges(e)} disabled={isSubmitting}>
            {isSubmitting ? "Зберігається..." : "Зберегти зміни"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BikeEditPage;
