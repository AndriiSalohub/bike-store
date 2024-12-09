import { useState, useEffect } from "react";
import { Trash2, Plus, Minus, X } from "lucide-react";
import axios from "axios";
import { useAuth, useCart } from "../store";
import OrderModal from "../components/OrderModal";
import { Badge } from "@/components/ui/badge";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartQuantity, setCartQuantity] = useState(0);
  const { user } = useAuth();
  const { cartItemCount, updateCartItemCount } = useCart();

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const cartResponse = await axios.get("http://localhost:3000/cart", {
          params: { email: user?.user_email },
        });

        const cartId = cartResponse.data[0]?.cart_id;

        if (cartId) {
          const itemsResponse = await axios.get(
            "http://localhost:3000/cart-items",
            {
              params: { cartId },
            },
          );

          const detailsResponse = await axios.get(
            "http://localhost:3000/cart/details",
            {
              params: { cartId },
            },
          );

          setCartItems(itemsResponse.data);
          setTotalPrice(parseFloat(detailsResponse.data.total));
          setCartQuantity(+detailsResponse.data.quantity);
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    if (user) {
      fetchCartItems();
    }
  }, [user]);

  const updateQuantity = async (bikeId, newQuantity, bikeCartId) => {
    try {
      await axios.post("http://localhost:3000/update-cart-item", {
        bikeId,
        quantity: newQuantity,
        email: user?.user_email,
        bikeCartId: bikeCartId,
      });

      const updatedItems = cartItems.map((item) =>
        item.bike_id === bikeId ? { ...item, quantity: newQuantity } : item,
      );

      const cartResponse = await axios.get("http://localhost:3000/cart", {
        params: { email: user?.user_email },
      });

      const cartId = cartResponse.data[0]?.cart_id;

      const detailsResponse = await axios.get(
        "http://localhost:3000/cart/details",
        {
          params: { cartId },
        },
      );

      setCartItems(updatedItems);
      setTotalPrice(parseFloat(detailsResponse.data.total));
      setCartQuantity(+detailsResponse.data.quantity);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const removeItem = async (bikeId) => {
    try {
      await axios.delete(`http://localhost:3000/cart-item/${bikeId}`, {
        params: {
          bikeId,
          email: user?.user_email,
        },
      });

      const updatedItems = cartItems.filter((item) => item.bike_id !== bikeId);

      const cartResponse = await axios.get("http://localhost:3000/cart", {
        params: { email: user?.user_email },
      });

      const cartId = cartResponse.data[0]?.cart_id;

      const detailsResponse = await axios.get(
        "http://localhost:3000/cart/details",
        {
          params: { cartId },
        },
      );

      setCartItems(updatedItems);

      setTotalPrice(parseFloat(detailsResponse.data.total));
      setCartQuantity(+detailsResponse.data.quantity);
      updateCartItemCount(-1);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const clearCart = async () => {
    try {
      await axios.post("http://localhost:3000/clear-cart", {
        email: user?.user_email,
      });

      setCartItems([]);
      setTotalPrice(0);
      setCartQuantity(0);

      updateCartItemCount(-cartItemCount);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const updateCartAfterOrder = (orderedItems) => {
    const updatedItems = cartItems.filter((cartItem) => {
      const orderedItem = orderedItems.find(
        (item) => item.bike_id === cartItem.bike_id,
      );

      if (orderedItem && orderedItem.quantity === cartItem.quantity) {
        return false;
      }

      if (orderedItem) {
        cartItem.quantity -= orderedItem.quantity;
      }

      return true;
    });

    const newTotalPrice = updatedItems.reduce(
      (total, item) => total + item.bike_price * item.quantity,
      0,
    );

    const newCartQuantity = updatedItems.reduce(
      (total, item) => total + item.quantity,
      0,
    );

    setCartItems(updatedItems);
    setTotalPrice(newTotalPrice);
    setCartQuantity(newCartQuantity);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Кошик</h1>
      {cartItems.length > 0 && (
        <button
          onClick={clearCart}
          className="flex items-center text-red-500 hover:text-red-700 transition-colors mb-4"
        >
          <X size={20} className="mr-2" />
          Очистити корзину
        </button>
      )}

      {cartItems.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          Ваш кошик порожній
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const discountedPrice = item.promotion_name
                ? item.bike_price -
                  item.bike_price * parseFloat(item.discount_percentage)
                : null;

              return (
                <div
                  key={item.bike_id}
                  className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4 hover:shadow-lg transition-shadow"
                >
                  <img
                    src={item.bike_image_url}
                    alt={item.bike_model}
                    className="w-48  object-cover rounded-md"
                  />

                  <div className="flex-grow">
                    <h3 className="font-semibold text-lg">{item.bike_model}</h3>
                    <p className="text-gray-500">{item.brand_name}</p>
                    {item.promotion_name && (
                      <Badge className="mb-2 p-2 bg-red-500 text-white">
                        {item.promotion_name} - {item.discount_percentage * 100}
                        % OFF
                      </Badge>
                    )}
                    <p className="font-bold text-black">
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

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.bike_id,
                          Math.max(1, item.quantity - 1),
                          item.bike_cart_id,
                        )
                      }
                      className="p-1 bg-gray-100 rounded-full hover:bg-gray-200"
                    >
                      <Minus size={20} />
                    </button>
                    <span className="px-3 py-1 bg-gray-100 rounded">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.bike_id,
                          item.quantity + 1,
                          item.bike_cart_id,
                        )
                      }
                      className={`p-1 bg-gray-100 rounded-full hover:bg-gray-200 ${
                        item.quantity >= item.bike_quantity
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      disabled={item.quantity >= item.bike_quantity}
                    >
                      <Plus size={20} />
                    </button>

                    <button
                      onClick={() => removeItem(item.bike_id)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 h-fit">
            <h2 className="text-xl font-semibold mb-4">Загальна вартість</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Кількість товарів</span>
                <span>{cartQuantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Проміжний підсумок</span>
                <span>{parseFloat(totalPrice).toFixed(2)} ₴</span>
              </div>
              <div className="border-t my-2"></div>
              <div className="flex justify-between font-bold text-lg">
                <span>Всього</span>
                <span>{parseFloat(totalPrice).toFixed(2)} ₴</span>
              </div>
            </div>
            <button
              className="w-full bg-black text-white py-3 transition-all duration-300 ease-in-out rounded-lg hover:scale-105 hover:shadow-lg active:scale-95 active:shadow-sm"
              disabled={cartItems.length === 0}
              onClick={() => setIsOrderModalOpen(true)}
            >
              Оформити замовлення
            </button>
          </div>
        </div>
      )}

      {isOrderModalOpen && (
        <OrderModal
          cartItems={cartItems}
          onClose={() => setIsOrderModalOpen(false)}
          open={isOrderModalOpen}
          updateCartAfterOrder={updateCartAfterOrder}
        />
      )}
    </div>
  );
};

export default CartPage;
