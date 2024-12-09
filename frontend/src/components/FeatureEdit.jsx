import { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const FeaturesEdit = () => {
  const [features, setFeatures] = useState([]);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(null);
  const [featureForm, setFeatureForm] = useState({
    feature_name: "",
    feature_price: "",
    feature_description: "",
    feature_availability: true,
    feature_quantity: "",
    feature_warranty_period: "",
    feature_image_url: "",
  });
  const [error, setError] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/features");
      setFeatures(data);
    } catch (error) {
      console.error("Error fetching features:", error);
      toast({
        title: "Помилка",
        description: "Не вдалося завантажити характеристики",
      });
    }
  };

  const validateFeature = (feature) => {
    const {
      feature_name,
      feature_price,
      feature_description,
      feature_quantity,
      feature_warranty_period,
    } = feature;

    if (!feature_name?.trim()) {
      setError("Назва характеристики не може бути порожньою");
      return false;
    }

    if (feature_name.length < 2 || feature_name.length > 100) {
      setError("Назва характеристики повинна містити від 2 до 100 символів");
      return false;
    }

    if (feature_price < 0) {
      setError("Ціна не може бути від'ємною");
      return false;
    }

    if (feature_quantity < 0) {
      setError("Кількість не може бути від'ємною");
      return false;
    }

    if (feature_warranty_period < 0) {
      setError("Гарантійний період не може бути від'ємним");
      return false;
    }

    return true;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFeatureForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
  };

  const handleAddFeature = async () => {
    if (!validateFeature(featureForm)) return;

    try {
      await axios.post("http://localhost:3000/features", featureForm);
      toast({
        title: "Успішне додавання",
        description: `Характеристику "${featureForm.feature_name}" додано`,
      });

      setAddDialogOpen(false);
      resetForm();
      fetchFeatures();
    } catch (error) {
      toast({
        title: "Помилка додавання",
        description: "Не вдалося додати характеристику",
      });
      console.error(error);
    }
  };

  const handleEditFeature = async () => {
    if (!validateFeature(featureForm)) return;

    try {
      await axios.put(
        `http://localhost:3000/features/${currentFeature.feature_id}`,
        featureForm,
      );
      toast({
        title: "Успішне оновлення",
        description: `Характеристику "${featureForm.feature_name}" оновлено`,
      });

      setEditDialogOpen(false);
      resetForm();
      fetchFeatures();
    } catch (error) {
      toast({
        title: "Помилка оновлення",
        description: "Не вдалося оновити характеристику",
      });
      console.error(error);
    }
  };

  const handleDeleteFeature = async (featureId) => {
    try {
      await axios.delete(`http://localhost:3000/features/${featureId}`);
      toast({
        title: "Успіх",
        description: "Характеристику видалено",
      });
      fetchFeatures();
    } catch (error) {
      toast({
        title: "Помилка",
        description: "Помилка видалення характеристики",
      });
      console.error(error);
    }
  };

  const openEditDialog = (feature) => {
    setCurrentFeature(feature);
    setFeatureForm({
      feature_name: feature.feature_name,
      feature_price: feature.feature_price,
      feature_description: feature.feature_description,
      feature_availability: feature.feature_availability,
      feature_quantity: feature.feature_quantity,
      feature_warranty_period: feature.feature_warranty_period,
      feature_image_url: feature.feature_image_url || "",
    });

    setEditDialogOpen(true);
  };

  const resetForm = () => {
    setFeatureForm({
      feature_name: "",
      feature_price: "",
      feature_description: "",
      feature_availability: true,
      feature_quantity: "",
      feature_warranty_period: "",
      feature_image_url: "",
    });
    setError("");
  };

  return (
    <section className="p-4">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Редагування особливостей</h2>
          <Button onClick={() => setAddDialogOpen(true)}>
            Додати особливість
          </Button>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {features.map((feature) => (
              <Card
                key={feature.feature_id}
                className="shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <CardHeader className="bg-black text-white rounded-t-lg">
                  <h3 className="text-xl font-semibold">
                    {feature.feature_name}
                  </h3>
                </CardHeader>
                <CardContent className="p-4">
                  <img
                    src={feature.feature_image_url}
                    alt={feature.feature_id}
                    className="w-48 object-cover rounded-md"
                  />
                  <p>Ціна: {feature.feature_price} грн</p>
                  <p>Опис: {feature.feature_description}</p>
                  <p>Кількість: {feature.feature_quantity}</p>
                  <p>
                    Доступність: {feature.feature_availability ? "Так" : "Ні"}
                  </p>
                </CardContent>
                <CardFooter className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => openEditDialog(feature)}
                    className="bg-black text-white hover:bg-gray-800"
                  >
                    Редагувати
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive">Видалити</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Видалити характеристику?</DialogTitle>
                        <div className="flex gap-4 mt-4">
                          <DialogClose>
                            <Button
                              variant="destructive"
                              onClick={() =>
                                handleDeleteFeature(feature.feature_id)
                              }
                            >
                              Так
                            </Button>
                          </DialogClose>
                          <DialogClose>
                            <Button>Ні</Button>
                          </DialogClose>
                        </div>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Feature Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Додати нову характеристику</DialogTitle>
          </DialogHeader>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="space-y-4">
            <Input
              name="feature_name"
              onChange={handleInputChange}
              placeholder="Назва характеристики"
              value={featureForm.feature_name}
            />
            <Input
              name="feature_price"
              type="number"
              onChange={handleInputChange}
              placeholder="Ціна"
              value={featureForm.feature_price}
              min="0"
            />
            <Input
              name="feature_description"
              onChange={handleInputChange}
              placeholder="Опис характеристики"
              value={featureForm.feature_description}
            />
            <Input
              name="feature_quantity"
              type="number"
              onChange={handleInputChange}
              placeholder="Кількість"
              value={featureForm.feature_quantity}
              min="0"
            />
            <Input
              name="feature_warranty_period"
              type="number"
              onChange={handleInputChange}
              placeholder="Гарантійний період (місяців)"
              value={featureForm.feature_warranty_period}
              min="0"
            />
            <Input
              name="feature_image_url"
              onChange={handleInputChange}
              placeholder="URL зображення (необов'язково)"
              value={featureForm.feature_image_url}
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                name="feature_availability"
                checked={featureForm.feature_availability}
                onCheckedChange={(checked) =>
                  setFeatureForm((prev) => ({
                    ...prev,
                    feature_availability: checked,
                  }))
                }
                id="feature-availability"
              />
              <label htmlFor="feature-availability">Доступність</label>
            </div>
            <div className="flex justify-between">
              <Button onClick={handleAddFeature}>Додати</Button>
              <DialogClose>
                <Button variant="secondary">Скасувати</Button>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Feature Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редагувати характеристику</DialogTitle>
          </DialogHeader>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="space-y-4">
            <Input
              name="feature_name"
              onChange={handleInputChange}
              placeholder="Назва характеристики"
              value={featureForm.feature_name}
            />
            <Input
              name="feature_price"
              type="number"
              onChange={handleInputChange}
              placeholder="Ціна"
              value={featureForm.feature_price}
              min="0"
            />
            <Input
              name="feature_description"
              onChange={handleInputChange}
              placeholder="Опис характеристики"
              value={featureForm.feature_description}
            />
            <Input
              name="feature_quantity"
              type="number"
              onChange={handleInputChange}
              placeholder="Кількість"
              value={featureForm.feature_quantity}
              min="0"
            />
            <Input
              name="feature_warranty_period"
              type="number"
              onChange={handleInputChange}
              placeholder="Гарантійний період (місяців)"
              value={featureForm.feature_warranty_period}
              min="0"
            />
            <Input
              name="feature_image_url"
              onChange={handleInputChange}
              placeholder="URL зображення (необов'язково)"
              value={featureForm.feature_image_url}
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                name="feature_availability"
                checked={featureForm.feature_availability}
                onCheckedChange={(checked) =>
                  setFeatureForm((prev) => ({
                    ...prev,
                    feature_availability: checked,
                  }))
                }
                id="feature-availability-edit"
              />
              <label htmlFor="feature-availability-edit">Доступність</label>
            </div>
            <div className="flex justify-between">
              <Button onClick={handleEditFeature}>Зберегти</Button>
              <DialogClose>
                <Button variant="secondary">Скасувати</Button>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default FeaturesEdit;
