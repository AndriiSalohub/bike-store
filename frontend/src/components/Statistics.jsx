import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChartPieIcon,
  PackageIcon,
  StarIcon,
  ShoppingBagIcon,
  BikeIcon,
} from "lucide-react";
import { DatePickerWithRange } from "./ui/dateRangePicker";

const Statistics = () => {
  const [dateRange, setDateRange] = useState({ from: null, to: null });

  const [typesStats, setTypesStats] = useState([]);
  const [brandsStats, setBrandsStats] = useState([]);
  const [ordersStats, setOrdersStats] = useState([]);
  const [bikesStats, setBikesStats] = useState([]);

  const fetchStats = async (startDate, endDate) => {
    try {
      const [typesResponse, brandsResponse, ordersResponse, bikesResponse] =
        await Promise.all([
          axios.get("http://localhost:3000/statistics/types", {
            params: { startDate, endDate },
          }),
          axios.get("http://localhost:3000/statistics/brands", {
            params: { startDate, endDate },
          }),
          axios.get("http://localhost:3000/statistics/orders", {
            params: { startDate, endDate },
          }),
          axios.get("http://localhost:3000/statistics/bikes"),
        ]);

      setTypesStats(typesResponse.data);
      setBrandsStats(brandsResponse.data);
      setOrdersStats(ordersResponse.data);
      setBikesStats(bikesResponse.data);
    } catch (err) {
      console.error("Error fetching statistics:", err);
    }
  };

  useEffect(() => {
    if (dateRange.from && dateRange.to) {
      fetchStats(dateRange.from.toISOString(), dateRange.to.toISOString());
    } else {
      fetchStats(null, null);
    }
  }, []);

  const handleFetchStats = () => {
    if (dateRange.from && dateRange.to) {
      fetchStats(dateRange.from.toISOString(), dateRange.to.toISOString());
    } else {
      alert("Please select a valid date range");
      fetchStats(null, null);
    }
  };

  const handleFetchAllTimeStats = () => {
    fetchStats(null, null);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-center space-x-4">
        <DatePickerWithRange onChange={setDateRange} />
        <Button onClick={handleFetchStats}>
          Отримати статистику за обраний період
        </Button>
        <Button onClick={handleFetchAllTimeStats}>
          Отримати статистику за весь час
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ChartPieIcon className="mr-2" /> Статистика за типами велосипедів
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {typesStats.map((stat, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold text-center">
                    {stat.type_name}
                  </h3>
                  <Badge variant="secondary">
                    Кількість проданих велосипедів: {stat.sold_count}
                  </Badge>
                  <Badge variant="secondary">
                    Загальна сума продаж:{" "}
                    {Number(stat.total_revenue).toFixed(2)}
                  </Badge>
                  <Badge variant="secondary">
                    Середня ціна проданих велосипедів:{" "}
                    {Number(stat.avg_price).toFixed(2)}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PackageIcon className="mr-2" /> Статистика за брендами велосипедів
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Бренд</TableHead>
                <TableHead className="text-center">Кількість</TableHead>
                <TableHead className="text-center">Продано</TableHead>
                <TableHead className="text-right">Рейтинг</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brandsStats.map((stat, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {stat.brand_name}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{stat.total_bikes}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{stat.sold_count}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end">
                      <StarIcon className="w-4 h-4 mr-1 text-yellow-500" />
                      {stat.avg_rating
                        ? parseFloat(stat.avg_rating).toFixed(2)
                        : "---"}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingBagIcon className="mr-2" /> Статистика замовлень
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Спосіб оплати</TableHead>
                <TableHead className="text-center">
                  Середня кількість товарів
                </TableHead>
                <TableHead className="text-right">
                  Середня сума замовлення
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ordersStats.map((stat, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {stat.payment_method}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">
                      {Number(stat.avg_items_per_order).toFixed(2)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline">
                      {Number(stat.avg_price_per_order).toFixed(2)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BikeIcon className="mr-2" /> Популярні велосипеди
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bikesStats.map((bike, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <img
                    src={bike.bike_image_url}
                    alt={bike.bike_model}
                    className="w-full object-cover rounded-md"
                  />
                  <h3 className="text-lg font-semibold text-center mt-4">
                    {bike.bike_model}
                  </h3>
                  <div className="text-center mt-2 flex gap-2">
                    <Badge variant="secondary">
                      Продано: {bike.total_sold}
                    </Badge>
                    <Badge variant="secondary">
                      Ціна: {Number(bike.price).toFixed(2)}
                    </Badge>
                    <Badge variant="secondary">
                      Рейтинг:{" "}
                      {bike.bike_rating
                        ? Number(bike.bike_rating).toFixed(2)
                        : "---"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Statistics;
