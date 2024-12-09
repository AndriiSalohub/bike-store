import { useEffect, useState } from "react";
import { usePromotions } from "../store";
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
import { useToast } from "@/hooks/use-toast";

const PromotionsEdit = () => {
  const {
    promotions,
    fetchAllPromotions,
    addPromotion,
    updatePromotion,
    deletePromotion,
  } = usePromotions();

  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [currentPromotion, setCurrentPromotion] = useState(null);
  const [promotionForm, setPromotionForm] = useState({
    promotion_name: "",
    promotion_start_date: "",
    promotion_end_date: "",
    discount_percentage: "",
  });
  const [error, setError] = useState("");
  const { toast } = useToast();

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetchAllPromotions();
  }, [fetchAllPromotions]);

  const validatePromotion = (promotion) => {
    const {
      promotion_name,
      promotion_start_date,
      promotion_end_date,
      discount_percentage,
    } = promotion;

    if (!promotion_name?.trim()) {
      setError("Назва знижки не може бути порожньою");
      return false;
    }

    if (promotion_name.trim().length < 2 || promotion_name.trim().length > 50) {
      setError("Назва знижки повинна містити від 2 до 50 символів");
      return false;
    }

    const nameRegex = /^[а-яА-ЯіІєЄґҐa-zA-Z\s\-]+$/;
    if (!nameRegex.test(promotion_name.trim())) {
      setError("Назва може містити лише літери, пробіли та дефіс");
      return false;
    }

    if (!promotion_start_date) {
      setError("Вкажіть дату початку знижки");
      return false;
    }

    if (
      promotion_end_date &&
      new Date(promotion_end_date) < new Date(promotion_start_date)
    ) {
      setError("Кінцева дата не може бути раніше за початкову");
      return false;
    }

    if (
      discount_percentage === "" ||
      isNaN(discount_percentage) ||
      Number(discount_percentage) < 0 ||
      Number(discount_percentage) > 100
    ) {
      setError("Введіть коректний відсоток знижки (0-100)");
      return false;
    }

    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setPromotionForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleAddPromotion = async () => {
    const promotionFormWithDecimal = {
      ...promotionForm,
      discount_percentage: Number(promotionForm.discount_percentage) / 100,
    };

    if (!validatePromotion(promotionFormWithDecimal)) return;

    try {
      await addPromotion(promotionFormWithDecimal);
      toast({
        title: "Успішне додавання",
        description: `Знижку ${promotionForm.promotion_name} додану`,
      });

      setAddDialogOpen(false);
      setPromotionForm({
        promotion_name: "",
        promotion_start_date: "",
        promotion_end_date: "",
        discount_percentage: "",
      });

      setError("");
      fetchAllPromotions();
    } catch (error) {
      toast({
        title: "Помилка додавання",
        description: `Відбулась помилка при додаванні знижки ${promotionForm.promotion_name}`,
      });

      console.error(error);
    }
  };

  const handleEditPromotion = async () => {
    const promotionFormWithDecimal = {
      ...promotionForm,
      discount_percentage: Number(promotionForm.discount_percentage) / 100,
    };

    if (!validatePromotion(promotionFormWithDecimal)) return;

    try {
      await updatePromotion(
        currentPromotion.promotion_id,
        promotionFormWithDecimal,
      );

      toast({
        title: "Успішне оновлення",
        description: `Інформацію про знижку ${promotionForm.promotion_name} оновлено`,
      });

      setEditDialogOpen(false);
      setCurrentPromotion(null);
      setError("");
    } catch (error) {
      toast({
        title: "Помилка оновлення",
        description: `Виникла помилка при оновленны інформації про знижку ${promotionForm.promotion_name}`,
      });
      console.error(error);
    }
  };

  const handleDeletePromotion = async (promotionId) => {
    try {
      await deletePromotion(promotionId);
      toast.success("Знижку видалено");
    } catch (error) {
      toast.error("Помилка видалення знижки");
      console.error(error);
    }
  };

  const openEditDialog = (promotion) => {
    setCurrentPromotion(promotion);
    setPromotionForm({
      promotion_name: promotion.promotion_name,
      promotion_start_date: promotion.promotion_start_date?.split("T")[0] || "",
      promotion_end_date: promotion.promotion_end_date?.split("T")[0] || "",
      discount_percentage: promotion.discount_percentage * 100,
    });

    setEditDialogOpen(true);
  };

  return (
    <section className="overflow-x-auto p-4">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Редагування знижок</h2>
          <Button onClick={() => setAddDialogOpen(true)}>Додати знижку</Button>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {promotions.map((promotion) => (
              <Card
                key={promotion.promotion_id}
                className="shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <CardHeader className="bg-black text-white rounded-t-lg">
                  <h3 className="text-xl font-semibold">
                    {promotion.promotion_name}
                  </h3>
                </CardHeader>
                <CardContent className="p-4">
                  <p>
                    Початок: {promotion.promotion_start_date?.split("T")[0]}
                  </p>
                  <p>
                    Кінець:{" "}
                    {promotion.promotion_end_date?.split("T")[0] ||
                      "Не вказано"}
                  </p>
                  <p>Знижка: {promotion.discount_percentage * 100}%</p>
                </CardContent>
                <CardFooter className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => openEditDialog(promotion)}
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
                        <DialogTitle>Видалити знижку?</DialogTitle>
                        <div className="flex gap-4 mt-4">
                          <DialogClose>
                            <Button
                              variant="destructive"
                              onClick={() =>
                                handleDeletePromotion(promotion.promotion_id)
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

      <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Додати нову знижку</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              name="promotion_name"
              onChange={handleInputChange}
              placeholder="Назва знижки"
            />
            <Input
              name="promotion_start_date"
              type="date"
              onChange={handleInputChange}
              placeholder="Дата початку"
            />
            <Input
              name="promotion_end_date"
              type="date"
              onChange={handleInputChange}
              placeholder="Дата завершення"
            />
            <Input
              name="discount_percentage"
              type="number"
              onChange={handleInputChange}
              placeholder="Відсоток знижки"
              min="0"
              max="100"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex justify-between">
              <DialogClose>
                <Button onClick={handleAddPromotion}>Додати</Button>
              </DialogClose>
              <DialogClose>
                <Button variant="secondary">Скасувати</Button>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Promotion Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редагувати знижку</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              name="promotion_name"
              value={promotionForm.promotion_name}
              onChange={handleInputChange}
              placeholder="Назва знижки"
            />
            <Input
              name="promotion_start_date"
              type="date"
              min={today}
              value={promotionForm.promotion_start_date}
              onChange={handleInputChange}
              placeholder="Дата початку"
            />
            <Input
              name="promotion_end_date"
              type="date"
              value={promotionForm.promotion_end_date}
              onChange={handleInputChange}
              placeholder="Дата завершення"
            />
            <Input
              name="discount_percentage"
              type="number"
              value={promotionForm.discount_percentage}
              onChange={handleInputChange}
              placeholder="Відсоток знижки"
              min="0"
              max="100"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex justify-between">
              <Button onClick={handleEditPromotion}>Зберегти</Button>
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

export default PromotionsEdit;
