import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const fieldLabels = {
  brand_id: "ID бренду",
  brand_name: "Назва бренду",
};

const EditBrandPage = () => {
  const { toast } = useToast();
  const { brand_id: brandId } = useParams();
  const [brand, setBrand] = useState({
    brand_id: null,
    brand_name: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchBrandData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/brands/${brandId}`,
        );
        const data = response.data[0];

        setBrand(data);
      } catch (error) {
        console.error("Помилка отримання даних про бренд:", error);
      }
    };
    fetchBrandData();
  }, [brandId]);

  const validate = () => {
    const newErrors = {};

    if (!brand.brand_name) {
      newErrors.brand_name = "Назва бренду є обов'язковою!";
    } else if (brand.brand_name.length < 2) {
      newErrors.brand_name = "Назва бренду має бути не менше 2 символів.";
    } else if (brand.brand_name.length > 50) {
      newErrors.brand_name = "Назва бренду не може перевищувати 50 символів.";
    } else if (!/^[а-яА-ЯіІєЄґҐa-zA-Z\s\-]+$/.test(brand.brand_name)) {
      newErrors.brand_name =
        "Назва бренду може містити літери, пробіли та дефіс.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBrand((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validate()) {
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.put(`http://localhost:3000/brands/${brandId}`, brand);
      toast({
        title: "Результат:",
        description: `Дані про бренд ${brand.brand_name} успішно змінено!`,
      });
    } catch (error) {
      console.error("Помилка зміни бренду:", error);
      toast({
        title: "Результат:",
        description: `Помилка при зміненні даних про бренд ${brand.brand_name}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Редагування бренду: {brand.brand_name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(brand).map(([key, value]) => (
              <div key={key}>
                <Label htmlFor={key}>
                  {fieldLabels[key] || key.replace(/_/g, " ").toUpperCase()}
                </Label>
                <Input
                  id={key}
                  name={key}
                  value={value || ""}
                  onChange={handleInputChange}
                  disabled={key === "brand_id"}
                />
                {errors[key] && (
                  <div className="text-red-600 text-xs">{errors[key]}</div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveChanges} disabled={isSubmitting}>
            {isSubmitting ? "Зберігається..." : "Зберегти зміни"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EditBrandPage;
