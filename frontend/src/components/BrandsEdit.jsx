import { useBikes, useBrands } from "../store";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import EditList from "./EditList";

const BrandsEdit = () => {
  const { toast } = useToast();
  const { brands, fetchBrands, deleteBrand, addBrand } = useBrands(); // Assuming addBrand exists
  const { bikes, setBikes } = useBikes();

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleDelete = async (brandName, brandId) => {
    try {
      await axios.delete(`http://localhost:3000/brands/${brandId}`);
      deleteBrand(brandId);
      setBikes(bikes.filter((bike) => bike.brand_id !== brandId));

      toast({
        title: "Видалення",
        description: `Було успішно видалено бренд ${brandName}`,
      });
    } catch (error) {
      toast({
        title: "Помилка видалення",
        description: `Не вдалося видалити бренд ${brandName}`,
      });
      console.error("Не вдалося видалити бренд:", error);
    }
  };

  const handleAdd = async (newBrandName) => {
    try {
      const response = await axios.post("http://localhost:3000/brands", {
        brand_name: newBrandName,
      });

      addBrand(response.data);

      toast({
        title: "Додавання",
        description: `Бренд ${newBrandName} успішно додано`,
      });
    } catch (error) {
      toast({
        title: "Помилка додавання",
        description: `Не вдалося додати бренд ${newBrandName}`,
      });
      console.error("Не вдалося додати бренд:", error);
    }
  };

  return (
    <EditList
      name="бренд"
      title="Редагування Брендів"
      items={brands}
      onDelete={handleDelete}
      editPathKey="edit/brands"
      identifierKey="brand_id"
      nameKey="brand_name"
      addTitle="Додати Бренд"
      onAdd={handleAdd}
    />
  );
};

export default BrandsEdit;
