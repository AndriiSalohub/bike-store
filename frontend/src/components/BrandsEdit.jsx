import { useBrands } from "../store";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import EditList from "./EditList";

const BrandsEdit = () => {
  const { toast } = useToast();
  const { brands, fetchBrands, deleteBrand } = useBrands();

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleDelete = async (brandName, brandId) => {
    try {
      await axios.delete(`http://localhost:3000/brands/${brandId}`);
      deleteBrand(brandId);
      toast({
        title: "Видалення",
        description: `Було успішно видалено бренд ${brandName}`,
      });
    } catch (error) {
      toast({
        title: "Помилка видалення",
        description: `Не вдалось видалити бренд ${brandName}`,
      });
      console.error("Не вдалося видалити бренд:", error);
    }
  };

  return (
    <EditList
      title="Редагування Брендів"
      items={brands}
      onDelete={handleDelete}
      editPathKey="edit/brands"
      identifierKey="brand_id"
      nameKey="brand_name"
    />
  );
};

export default BrandsEdit;
