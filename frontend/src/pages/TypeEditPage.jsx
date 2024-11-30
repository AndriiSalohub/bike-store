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
  type_id: "ID типу",
  type_name: "Назва типу",
};

const EditTypePage = () => {
  const { toast } = useToast();

  const { type_id: typeId } = useParams();
  const [type, setType] = useState({
    type_id: null,
    type_name: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTypeData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/types/${typeId}`,
        );
        const data = response.data[0];

        setType(data);
      } catch (error) {
        console.error("Помилка отримання даних про тип:", error);
      }
    };
    fetchTypeData();
  }, [typeId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setType((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!type.type_name) newErrors.type_name = "Назва типу є обов'язковою!";
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
      await axios.put(`http://localhost:3000/types/${typeId}`, type);
      toast({
        title: "Результат:",
        description: `Дані про тип ${type.type_name} успішно змінено!`,
      });
    } catch (error) {
      console.error("Помилка зміни типу:", error);
      toast({
        title: "Результат:",
        description: `Помилка при зміненні даних про тип ${type.type_name}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Редагування типу: {type.type_name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(type).map(([key, value]) => (
              <div key={key}>
                <Label htmlFor={key}>
                  {fieldLabels[key] || key.replace(/_/g, " ").toUpperCase()}
                </Label>
                <Input
                  id={key}
                  name={key}
                  value={value || ""}
                  onChange={handleInputChange}
                  disabled={key === "type_id"}
                />
                {errors[key] && (
                  <div className="text-red-600 text-sm">{errors[key]}</div>
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

export default EditTypePage;
