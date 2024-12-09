import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bike, Gauge, Weight, StarIcon, CalendarDays, Box } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth, useCart, useTypes } from "../store";
import { Loader2 } from "lucide-react";
import { MdOutlineShoppingBag, MdShoppingBag } from "react-icons/md";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BikeDetailsPage = () => {
  const { bike_id } = useParams();
  const [bike, setBike] = useState(null);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inCart, setInCart] = useState(false);

  const [cartId, setCartId] = useState();
  const { updateCartItemCount } = useCart();
  const { types, fetchTypes } = useTypes();
  const { user } = useAuth();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get("http://localhost:3000/cart", {
          params: {
            email: user?.user_email,
          },
        });

        if (user) {
          setCartId(response.data[0].cart_id);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchCart();
  }, [user]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await fetchTypes();

        const response = await axios.get(
          `http://localhost:3000/bikes/${bike_id}`,
        );
        const fetchedBike = response.data[0];
        setBike(fetchedBike);

        // Fetch features for this specific bike
        const featuresResponse = await axios.get(
          `http://localhost:3000/bike-features/${bike_id}`,
        );
        setFeatures(featuresResponse.data);

        if (cartId) {
          const cartStatusResponse = await axios.get(
            "http://localhost:3000/cart/status",
            {
              params: {
                bikeId: fetchedBike.bike_id,
                cartId: cartId,
              },
            },
          );

          setInCart(cartStatusResponse.data.isInCart);
        }

        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [bike_id, cartId]);

  const handleCartToggle = async (e) => {
    if (e) e.preventDefault();

    // Check if cart ID exists
    if (!cartId) {
      alert("Будь ласка, увійдіть або створіть кошик");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/bike_cart", {
        bikeId: bike.bike_id,
        cartId: cartId,
        quantity: 1,
      });

      setInCart(response.data.isInCart);
      updateCartItemCount(response.data.isInCart ? 1 : -1);
    } catch (err) {
      console.error("Помилка додавання до кошику:", err);
      alert("Не вдалося оновити кошик. Спробуйте знову.");
    }
  };

  const formatCurrency = (price) => {
    return new Intl.NumberFormat("uk-UA", {
      style: "currency",
      currency: "UAH",
    }).format(parseFloat(price));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-8">
        <AlertTitle>Помилка</AlertTitle>
        <AlertDescription>
          Не вдалося завантажити деталі велосипеда. Спробуйте пізніше.
        </AlertDescription>
      </Alert>
    );
  }

  if (!bike) {
    return (
      <Alert className="m-8">
        <AlertTitle>Не знайдено</AlertTitle>
        <AlertDescription>Вказаний велосипед не знайдено.</AlertDescription>
      </Alert>
    );
  }

  const discountedPrice = bike.promotion_name
    ? bike.bike_price - bike.bike_price * parseFloat(bike.discount_percentage)
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="bike-details" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="bike-details">Деталі велосипеда</TabsTrigger>
          <TabsTrigger value="features">
            Додаткові характеристики ({features.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bike-details">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center"
            >
              <img
                src={bike.bike_image_url}
                alt={`${bike.bike_model} ${bike.bike_color}`}
                className="max-h-[500px] object-contain rounded-lg"
              />
            </motion.div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-3xl font-bold">
                    {bike.bike_model} {bike.bike_color}
                  </CardTitle>
                  <CardDescription>
                    {
                      types?.find((type) => type.type_id == bike.type_id)
                        ?.type_name
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bike.promotion_name && (
                      <Badge className="mb-4 p-2 bg-red-500 text-white">
                        {bike.promotion_name} - {bike.discount_percentage * 100}
                        % OFF
                      </Badge>
                    )}
                    <div className="flex justify-between items-center">
                      {discountedPrice ? (
                        <>
                          <span className="text-2xl font-bold line-through text-gray-500 mr-2">
                            {formatCurrency(bike.bike_price)}
                          </span>
                          <span className="text-2xl font-bold text-primary">
                            {formatCurrency(discountedPrice)}
                          </span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-primary">
                          {formatCurrency(bike.bike_price)}
                        </span>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleCartToggle}
                        className="cursor-pointer"
                        disabled={!bike.bike_availability}
                      >
                        {inCart ? (
                          <MdShoppingBag size={30} className="text-primary" />
                        ) : (
                          <MdOutlineShoppingBag
                            size={30}
                            className="text-muted-foreground"
                          />
                        )}
                      </motion.button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Bike className="text-primary" />
                        <span>Рама: {bike.frame_material}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Gauge className="text-primary" />
                        <span>Передачі: {bike.gear_count}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Weight className="text-primary" />
                        <span>Вага: {bike.bike_weight} кг</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StarIcon
                          className="text-yellow-500"
                          fill="currentColor"
                        />
                        <span>Рейтинг: {bike.bike_rating} / 5</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Badge variant="secondary">
                        <CalendarDays className="mr-2 h-4 w-4" />
                        Випущено:{" "}
                        {new Date(bike.bike_release_date).getFullYear()}
                      </Badge>
                      <Badge
                        variant={
                          bike.bike_availability ? "default" : "destructive"
                        }
                      >
                        {bike.bike_availability
                          ? "В наявності"
                          : "Немає в наявності"}
                      </Badge>
                    </div>

                    <p className="text-muted-foreground">
                      {bike.bike_description}
                    </p>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Додаткові деталі
                      </h3>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>Розмір колеса: {bike.wheel_size} дюймів</li>
                        <li>
                          Максимальне навантаження: {bike.max_weight_capacity}{" "}
                          кг
                        </li>
                        <li>Стать: {bike.gender}</li>
                        <li>
                          Гарантійний період: {bike.bike_warranty_period}{" "}
                          місяців
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="features">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.length > 0 ? (
              features.map((feature) => (
                <Card
                  key={feature.feature_id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Box className="text-primary" />
                      {feature.feature_name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <img
                        src={feature.feature_image_url}
                        alt={feature.feature_name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <p className="text-muted-foreground mb-4">
                        {feature.feature_description}
                      </p>
                      <div className="flex justify-between items-center">
                        <Badge variant="secondary">
                          Ціна: {formatCurrency(feature.feature_price)}
                        </Badge>
                        <Badge
                          variant={
                            feature.feature_availability
                              ? "default"
                              : "destructive"
                          }
                        >
                          {feature.feature_availability
                            ? "В наявності"
                            : "Немає в наявності"}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>Кількість: {feature.feature_quantity}</p>
                        <p>
                          Гарантія: {feature.feature_warranty_period} місяців
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">
                  Для цього велосипеда немає додаткових характеристик.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BikeDetailsPage;
