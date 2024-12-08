import { useState, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Trash2, Eye, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DeletedPage = () => {
  const [deletedBikes, setDeletedBikes] = useState([]);
  const [selectedBike, setSelectedBike] = useState(null);

  const [deletedTypes, setDeletedTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);

  const [deletedBrands, setDeletedBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const { toast } = useToast();

  const fetchDeletedBikes = async () => {
    try {
      const response = await axios.get("http://localhost:3000/deleted_bikes");
      setDeletedBikes(response.data);
    } catch (error) {
      console.error("Не вдалося отримати список видалених велосипедів:", error);
      toast({
        title: "Помилка",
        description: "Не вдалося завантажити список видалених велосипедів",
        variant: "destructive",
      });
    }
  };

  const fetchDeletedTypes = async () => {
    try {
      const response = await axios.get("http://localhost:3000/deleted_types");
      setDeletedTypes(response.data);
    } catch (error) {
      console.error("Помилка завантаження видалених типів:", error);
      toast({
        title: "Помилка",
        description: "Не вдалося завантажити видалені типи",
        variant: "destructive",
      });
    }
  };

  const fetchDeletedBrands = async () => {
    try {
      const response = await axios.get("http://localhost:3000/deleted_brands");

      setDeletedBrands(response.data);
    } catch (error) {
      console.error("Помилка завантаження видалених брендів:", error);
      toast({
        title: "Помилка",
        description: "Не вдалося завантажити видалені бренди",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchDeletedBikes();
    fetchDeletedTypes();
    fetchDeletedBrands();
  }, []);

  const handleRestoreBike = async (bikeId) => {
    try {
      await axios.put(`http://localhost:3000/bikes/restore/${bikeId}`);
      toast({
        title: "Успіх",
        description: "Велосипед успішно відновлено",
        variant: "default",
      });

      fetchDeletedBikes();
    } catch (error) {
      console.error("Помилка при відновленні велосипеда:", error);
      toast({
        title: "Помилка",
        description: "Не вдалося відновити велосипед",
        variant: "destructive",
      });
    }
  };

  const handleRestoreType = async (typeId) => {
    try {
      await axios.put(`http://localhost:3000/types/restore/${typeId}`);
      toast({
        title: "Успіх",
        description: "Тип успішно відновлено",
        variant: "default",
      });

      fetchDeletedTypes();
      fetchDeletedBikes();
    } catch (error) {
      console.error("Помилка при відновленні типа:", error);
      toast({
        title: "Помилка",
        description: "Не вдалося відновити тип",
        variant: "destructive",
      });
    }
  };

  const handleRestoreBrand = async (brandId) => {
    try {
      await axios.put(`http://localhost:3000/brands/restore/${brandId}`);
      toast({
        title: "Успіх",
        description: "Тип успішно відновлено",
        variant: "default",
      });

      fetchDeletedBrands();
      fetchDeletedBikes();
    } catch (error) {
      console.error("Помилка при відновленні бренду:", error);
      toast({
        title: "Помилка",
        description: "Не вдалося відновити бренд",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("uk-UA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <section className="p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trash2 className="mr-2" /> Видалені велосипеди
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">ID</TableHead>
                  <TableHead className="text-center">Модель</TableHead>
                  <TableHead className="text-center">Бренд</TableHead>
                  <TableHead className="text-center">Тип</TableHead>
                  <TableHead className="text-center">Ціна</TableHead>
                  <TableHead className="text-center">Видалено</TableHead>
                  <TableHead className="text-center">Дії</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deletedBikes.map((bike) => (
                  <TableRow key={bike.bike_id}>
                    <TableCell className="text-center">
                      {bike.bike_id}
                    </TableCell>
                    <TableCell className="text-center">
                      {bike.bike_model}
                    </TableCell>
                    <TableCell className="text-center">
                      {bike.brand_name}
                    </TableCell>
                    <TableCell className="text-center">
                      {bike.type_name}
                    </TableCell>
                    <TableCell className="text-center">
                      {bike.bike_price} грн
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="destructive">
                        {formatDate(bike.bike_deleted_at)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedBike(bike)}
                            >
                              <Eye className="mr-2 h-4 w-4" /> Деталі
                            </Button>
                          </DialogTrigger>
                          {selectedBike && (
                            <DialogContent className="sm:max-w-[625px]">
                              <DialogHeader>
                                <DialogTitle>
                                  Деталі видаленого велосипеда
                                </DialogTitle>
                              </DialogHeader>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <img
                                    src={selectedBike.bike_image_url}
                                    alt={selectedBike.bike_model}
                                    className="w-full h-auto object-cover rounded-lg"
                                  />
                                </div>
                                <div>
                                  <div className="space-y-2">
                                    <p>
                                      <strong>ID:</strong>{" "}
                                      {selectedBike.bike_id}
                                    </p>
                                    <p>
                                      <strong>Модель:</strong>{" "}
                                      {selectedBike.bike_model}
                                    </p>
                                    <p>
                                      <strong>Бренд:</strong>{" "}
                                      {selectedBike.brand_id}
                                    </p>
                                    <p>
                                      <strong>Тип:</strong>{" "}
                                      {selectedBike.type_id}
                                    </p>
                                    <p>
                                      <strong>Ціна:</strong>{" "}
                                      {selectedBike.bike_price} грн
                                    </p>
                                    <p>
                                      <strong>Розмір коліс:</strong>{" "}
                                      {selectedBike.wheel_size} "
                                    </p>
                                    <p>
                                      <strong>Матеріал рами:</strong>{" "}
                                      {selectedBike.frame_material}
                                    </p>
                                    <p>
                                      <strong>Колір:</strong>{" "}
                                      {selectedBike.bike_color}
                                    </p>
                                    <p>
                                      <strong>Стать:</strong>{" "}
                                      {selectedBike.gender}
                                    </p>
                                    <p>
                                      <strong>Дата видалення:</strong>{" "}
                                      {formatDate(selectedBike.bike_deleted_at)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          )}
                        </Dialog>
                        <Dialog>
                          <DialogTrigger className="">
                            <Button variant="outline" size="sm">
                              <RotateCcw className="mr-2 h-4 w-4" /> Відновити
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle className="mb-4">
                                Ви впевнені, що хочете відновити велосипед{" "}
                                {bike.bike_model}?
                              </DialogTitle>
                              <div className="flex gap-4">
                                <Button
                                  variant="destructive"
                                  onClick={() =>
                                    handleRestoreBike(bike.bike_id)
                                  }
                                >
                                  Так
                                </Button>
                                <DialogClose>
                                  <Button type="button">Ні</Button>
                                </DialogClose>
                              </div>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      <section className="p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trash2 className="mr-2" /> Видалені типи
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">ID</TableHead>
                  <TableHead className="text-center">Назва типу</TableHead>
                  <TableHead className="text-center">Видалено</TableHead>
                  <TableHead className="text-center">Дії</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deletedTypes.map((type) => (
                  <TableRow key={type.type_id}>
                    <TableCell className="text-center">
                      {type.type_id}
                    </TableCell>
                    <TableCell className="text-center">
                      {type.type_name}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="destructive">
                        {formatDate(type.type_deleted_at)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center space-x-2">
                        <Dialog>
                          <DialogTrigger className="">
                            <Button variant="outline" size="sm">
                              <RotateCcw className="mr-2 h-4 w-4" /> Відновити
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle className="mb-4">
                                Ви впевнені, що хочете відновити тип{" "}
                                {type.type_name}?
                              </DialogTitle>
                              <div className="flex gap-4">
                                <Button
                                  variant="destructive"
                                  onClick={() =>
                                    handleRestoreType(type.type_id)
                                  }
                                >
                                  Так
                                </Button>
                                <DialogClose>
                                  <Button type="button">Ні</Button>
                                </DialogClose>
                              </div>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      <section className="p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trash2 className="mr-2" /> Видалені бренди
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">ID</TableHead>
                  <TableHead className="text-center">Назва бренду</TableHead>
                  <TableHead className="text-center">Видалено</TableHead>
                  <TableHead className="text-center">Дії</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deletedBrands.map((brand) => (
                  <TableRow key={brand.brand_id}>
                    <TableCell className="text-center">
                      {brand.brand_id}
                    </TableCell>
                    <TableCell className="text-center">
                      {brand.brand_name}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="destructive">
                        {formatDate(brand.brand_deleted_at)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center space-x-2">
                        <Dialog>
                          <DialogTrigger className="">
                            <Button variant="outline" size="sm">
                              <RotateCcw className="mr-2 h-4 w-4" /> Відновити
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle className="mb-4">
                                Ви впевнені, що хочете відновити бренд{" "}
                                {brand.brand_name}?
                              </DialogTitle>
                              <div className="flex gap-4">
                                <Button
                                  variant="destructive"
                                  onClick={() =>
                                    handleRestoreBrand(brand.brand_id)
                                  }
                                >
                                  Так
                                </Button>
                                <DialogClose>
                                  <Button type="button">Ні</Button>
                                </DialogClose>
                              </div>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default DeletedPage;
