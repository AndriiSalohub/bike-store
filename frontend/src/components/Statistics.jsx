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
import { ChartPieIcon, PackageIcon, StarIcon } from "lucide-react";

const Statistics = () => {
  const [typesStats, setTypesStats] = useState([]);
  const [brandsStats, setBrandsStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [typesResponse, brandsResponse] = await Promise.all([
          axios.get("http://localhost:3000/statistics/types"),
          axios.get("http://localhost:3000/statistics/brands"),
        ]);
        setTypesStats(typesResponse.data);
        setBrandsStats(brandsResponse.data);
      } catch (err) {
        console.error("Error fetching statistics:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="container mx-auto p-4 space-y-6">
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
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{stat.type_name}</h3>
                    <Badge variant="secondary">
                      Кількість проданих велосипедів: {stat.total_bike_count}
                    </Badge>
                  </div>
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
                    <Badge variant="outline">{stat.total_bike_count}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{stat.sold_bike_count}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end">
                      <StarIcon className="w-4 h-4 mr-1 text-yellow-500" />
                      {parseFloat(stat.average_rating).toFixed(2)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Statistics;
