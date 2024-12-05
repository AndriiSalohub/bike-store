/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import { useAuth, useCart } from "../store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const OrderModal = ({ cartItems, onClose, open, updateCartAfterOrder }) => {
  const [paymentMethod, setPaymentMethod] = useState("Карта");
  const [selectedItems, setSelectedItems] = useState(
    cartItems.map((item) => ({
      bike_id: item.bike_id,
      quantity: item.quantity,
      selected: true,
    })),
  );
  const { user } = useAuth();
  const { updateCartItemCount } = useCart();
  const deliveryPrice = 100;

  const handleQuantityChange = (bikeId, quantity) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.bike_id === bikeId
          ? {
              ...item,
              quantity: Math.min(
                Math.max(1, quantity),
                cartItems.find((ci) => ci.bike_id === bikeId).quantity,
              ),
            }
          : item,
      ),
    );
  };

  const handleItemSelect = (bikeId) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.bike_id === bikeId
          ? {
              ...item,
              selected: !item.selected,
              quantity: item.selected ? item.quantity : 1,
            }
          : item,
      ),
    );
  };

  const submitOrder = async () => {
    const validItems = selectedItems
      .filter((item) => item.selected)
      .map(({ bike_id, quantity }) => ({ bike_id, quantity }));

    if (validItems.length === 0) {
      alert("Виберіть принаймні один товар");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/create-order", {
        email: user?.user_email,
        paymentMethod,
        deliveryPrice,
        selectedCartItems: validItems,
      });

      // Download receipt
      if (response.data.receiptFilename) {
        const downloadReceipt = await axios({
          url: `http://localhost:3000/download-receipt/${response.data.receiptFilename}`,
          method: "GET",
          responseType: "blob",
        });

        const url = window.URL.createObjectURL(
          new Blob([downloadReceipt.data]),
        );
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", response.data.receiptFilename);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }

      // Existing order logic
      updateCartAfterOrder(validItems);
      updateCartItemCount(-validItems.length);
      onClose();
    } catch (error) {
      console.error("Order creation failed:", error);
      alert("Не вдалось створити замовлення");
    }
  };

  const totalPrice =
    selectedItems
      .filter((item) => item.selected)
      .reduce((total, selectedItem) => {
        const item = cartItems.find((i) => i.bike_id === selectedItem.bike_id);
        return total + (item ? item.bike_price * selectedItem.quantity : 0);
      }, 0) + deliveryPrice;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Оформлення замовлення</DialogTitle>
          <DialogDescription>Виберіть товари та кількість</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4 max-h-[500px] overflow-y-auto">
          {cartItems.map((item) => {
            const selectedItem = selectedItems.find(
              (selected) => selected.bike_id === item.bike_id,
            );

            return (
              <div
                key={item.bike_id}
                className="flex items-center space-x-4 border-b pb-4"
              >
                <Checkbox
                  checked={selectedItem?.selected || false}
                  onCheckedChange={() => handleItemSelect(item.bike_id)}
                  className="mr-2"
                />
                <img
                  src={item.bike_image_url}
                  alt={item.bike_model}
                  className="h-24 object-cover rounded-md"
                />
                <div className="flex-grow">
                  <h3 className="font-semibold">{item.bike_model}</h3>
                  <p className="text-gray-500">{item.brand_name}</p>
                  <p className="font-bold">{item.bike_price} ₴</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handleQuantityChange(
                        item.bike_id,
                        (selectedItem?.quantity || 1) - 1,
                      )
                    }
                    disabled={
                      !selectedItem?.selected || selectedItem?.quantity <= 1
                    }
                  >
                    -
                  </Button>
                  <span className="w-8 text-center">
                    {selectedItem?.quantity || 1}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handleQuantityChange(
                        item.bike_id,
                        (selectedItem?.quantity || 1) + 1,
                      )
                    }
                    disabled={
                      !selectedItem?.selected ||
                      (selectedItem?.quantity || 1) >=
                        (cartItems.find((ci) => ci.bike_id === item.bike_id)
                          ?.quantity || 1)
                    }
                  >
                    +
                  </Button>
                </div>
              </div>
            );
          })}

          <div>
            <Label>Спосіб оплати</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Виберіть метод оплати" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Карта">Карта</SelectItem>
                <SelectItem value="Готівка">Готівка</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Вартість доставки:</span>
              <span>{deliveryPrice} ₴</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Всього:</span>
              <span>{totalPrice.toFixed(2)} ₴</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" className="w-full" onClick={onClose}>
            Скасувати
          </Button>
          <Button className="w-full" onClick={submitOrder}>
            Замовити
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderModal;
