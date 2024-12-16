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
import { Badge } from "@/components/ui/badge";

const OrderModal = ({ cartItems, onClose, open, updateCartAfterOrder }) => {
  const [paymentMethod, setPaymentMethod] = useState("Карта");
  const [selectedItems, setSelectedItems] = useState(
    cartItems.map((item) => ({
      bike_id: item.bike_id,
      quantity: item.quantity,
      selected: true,
      bike_cart_id: item.bike_cart_id,
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
      .map(({ bike_id, quantity, bike_cart_id }) => ({
        bike_id,
        quantity,
        bike_cart_id,
      }));

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

      if (response.data.receiptFilename) {
        const downloadReceipt = await axios({
          url: `http://localhost:3000/download-receipt/${response.data.receiptFilename}`,
          method: "GET",
          responseType: "blob",
        });

        const fileHandle = await window.showSaveFilePicker({
          suggestedName: response.data.receiptFilename,
          types: [
            {
              description: "Receipt Files",
              accept: { "application/pdf": [".pdf"] },
            },
          ],
        });

        const writableStream = await fileHandle.createWritable();
        await writableStream.write(downloadReceipt.data);
        await writableStream.close();

        alert("Чек успішно завантажено!");
      }

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
        const discountedPrice = item.promotion_name
          ? item.bike_price -
            item.bike_price * parseFloat(item.discount_percentage)
          : item.bike_price;
        return total + discountedPrice * selectedItem.quantity;
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

            const discountedPrice = item.promotion_name
              ? item.bike_price -
                item.bike_price * parseFloat(item.discount_percentage)
              : null;

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
                  className="w-36 object-cover rounded-md"
                />
                <div className="flex-grow">
                  <h3 className="font-semibold">{item.bike_model}</h3>
                  <p className="text-gray-500">{item.brand_name}</p>
                  {item.promotion_name && (
                    <Badge className="mb-2 p-2 bg-red-500 text-white">
                      {item.promotion_name} - {item.discount_percentage * 100}%
                      OFF
                    </Badge>
                  )}
                  <p className="font-bold">
                    {discountedPrice ? (
                      <>
                        <span className="line-through text-gray-500 mr-2">
                          {item.bike_price} ₴
                        </span>
                        <span>{discountedPrice.toFixed(2)} ₴</span>
                      </>
                    ) : (
                      <span>{item.bike_price} ₴</span>
                    )}
                  </p>
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
