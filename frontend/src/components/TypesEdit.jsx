import { useTypes, useBikes } from "../store";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import EditList from "./EditList";

const TypesEdit = () => {
  const { toast } = useToast();
  const { types, fetchTypes, deleteType, addType } = useTypes();
  const { bikes, setBikes } = useBikes();

  useEffect(() => {
    fetchTypes();
  }, []);

  const handleDelete = async (typeName, typeId) => {
    try {
      await axios.delete(`http://localhost:3000/types/${typeId}`);
      deleteType(typeId);
      setBikes(bikes.filter((bike) => bike.type_id !== typeId));

      toast({
        title: "Видалення",
        description: `Було успішно видалено тип ${typeName}`,
      });
    } catch (error) {
      toast({
        title: "Помилка видалення",
        description: `Не вдалось видалити тип ${typeName}`,
      });
      console.error("Не вдалося видалити тип:", error);
    }
  };

  const handleAdd = async (newTypeName) => {
    try {
      const response = await axios.post("http://localhost:3000/types", {
        type_name: newTypeName,
      });

      addType(response.data);

      toast({
        title: "Додавання",
        description: `Тип ${newTypeName} успішно додано`,
      });
    } catch (error) {
      toast({
        title: "Помилка додавання",
        description: `Не вдалося додати тип ${newTypeName}`,
      });
      console.error("Не вдалося додати тип:", error);
    }
  };

  return (
    <EditList
      name="тип"
      title="Редагування Типів"
      items={types}
      onDelete={handleDelete}
      editPathKey="edit/types"
      identifierKey="type_id"
      nameKey="type_name"
      addTitle="Додати Тип"
      onAdd={handleAdd}
    />
  );
};

export default TypesEdit;
