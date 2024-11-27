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

const fieldLabels = {
  bike_id: "ID велосипеда",
  bike_model: "Модель велосипеда",
  brand_id: "ID бренду",
  type_id: "ID типу",
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
};

const BikeEditPage = () => {
  const { toast } = useToast();

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
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBike((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();

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
                    value={value || ""}
                    onValueChange={(val) =>
                      setBike((prev) => ({ ...prev, [key]: val }))
                    }
                  >
                    <SelectTrigger>{value || "Виберіть опцію"}</SelectTrigger>
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
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={(e) => handleSaveChanges(e)}>Зберегти зміни</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BikeEditPage;
