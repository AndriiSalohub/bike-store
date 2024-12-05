import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "../store";
import axios from "axios";
import { format } from "date-fns";

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { user } = useAuth();

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/order-history",
          {
            params: {
              email: user?.user_email,
              sortBy,
              sortOrder,
              paymentFilter,
              statusFilter,
            },
          },
        );
        setOrders(response.data.history || []);
      } catch (error) {
        console.error("Failed to fetch order history:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.user_email) {
      fetchOrderHistory();
    }
  }, [user, sortBy, sortOrder, paymentFilter, statusFilter]);

  const handleCancelOrder = async (orderId) => {
    try {
      await axios.put(`http://localhost:3000/cancel-order/${orderId}`);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === orderId
            ? { ...order, order_status: "Відмінено" }
            : order,
        ),
      );
    } catch (error) {
      console.error("Failed to cancel order:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        Завантаження...
      </div>
    );
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle>Історія замовлень</CardTitle>
        <CardDescription>
          Перегляд та управління вашими замовленнями
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 mb-4">
          {/* Sorting controls */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Сортувати за
            </label>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Оберіть сортування" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Датою</SelectItem>
                <SelectItem value="price">Ціною</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-medium mb-1">Напрямок</label>
            <Select
              value={sortOrder}
              onValueChange={(value) => setSortOrder(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Напрямок сортування" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">За спаданням</SelectItem>
                <SelectItem value="asc">За зростанням</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Метод оплати
            </label>
            <Select
              value={paymentFilter}
              onValueChange={(value) => setPaymentFilter(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Оберіть метод оплати" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Усі</SelectItem>
                <SelectItem value="Карта">Карта</SelectItem>
                <SelectItem value="Готівка">Готівка</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Статус замовлення
            </label>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Оберіть статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Усі</SelectItem>
                <SelectItem value="Очікується">Очікується</SelectItem>
                <SelectItem value="Відмінено">Відмінено</SelectItem>
                <SelectItem value="Завершено">Завершено</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Дата замовлення</TableHead>
              <TableHead>Метод оплати</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Ціна доставки</TableHead>
              <TableHead>Загальна ціна</TableHead>
              <TableHead>Дії</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.order_id}>
                <TableCell>
                  {format(new Date(order.order_date), "dd.MM.yyyy HH:mm")}
                </TableCell>
                <TableCell>{order.payment_method}</TableCell>
                <TableCell>{order.order_status}</TableCell>
                <TableCell>{order.delivery_price} грн</TableCell>
                <TableCell>{order.total_price} грн</TableCell>
                <TableCell>
                  {order.order_status === "Очікується" && (
                    <Button
                      size="sm"
                      onClick={() => handleCancelOrder(order.order_id)}
                    >
                      Скасувати замовлення
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {orders.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            Немає замовлень для відображення
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderHistoryPage;
