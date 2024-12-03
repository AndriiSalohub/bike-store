/* eslint-disable react/prop-types */
import { useState } from "react";
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
import { NavLink } from "react-router-dom";

const EditList = ({
  name,
  title,
  items,
  onDelete,
  editPathKey,
  identifierKey,
  nameKey,
  addTitle,
  onAdd,
}) => {
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [error, setError] = useState("");

  const validateItemName = (name) => {
    setError("");

    if (!name.trim()) {
      setError(`Назва ${name} не може бути порожньою`);
      return false;
    }

    if (name.trim().length < 2) {
      setError(`Назва ${name} повинна містити щонайменше 2 символи`);
      return false;
    }

    if (name.trim().length > 50) {
      setError(`Назва ${name} не може перевищувати 50 символів`);
      return false;
    }

    const validNameRegex = /^[а-яА-ЯіІєЄґҐa-zA-Z\s\-]+$/;
    if (!validNameRegex.test(name.trim())) {
      setError(`Назва ${name} може містити лише літери, пробіли та дефіс`);
      return false;
    }

    const isDuplicate = items.some(
      (item) =>
        item[nameKey].toLowerCase().trim() === name.toLowerCase().trim(),
    );

    if (isDuplicate) {
      setError(`${name} вже існує`);
      return false;
    }

    return true;
  };

  const handleAdd = async () => {
    if (newItemName.trim() === "") return;

    if (!validateItemName(newItemName)) {
      return;
    }

    try {
      await onAdd(newItemName);

      setAddDialogOpen(false);
      setNewItemName("");
      setError("");
    } catch (error) {
      console.error("Помилка додавання:", error);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setNewItemName(value);

    if (error) {
      setError("");
    }
  };

  return (
    <section className="overflow-x-auto p-4">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">{title}</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <Card
                key={item[identifierKey]}
                className="shadow-lg hover:shadow-xl transition-all duration-300 bg-white rounded-lg"
              >
                <CardHeader className="bg-black text-white rounded-t-lg">
                  <h3 className="text-xl font-semibold">{item[nameKey]}</h3>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-sm text-gray-600">
                    Ідентифікатор: {item[identifierKey]}
                  </p>
                </CardContent>
                <CardFooter className="grid grid-cols-2 bg-gray-100 p-4 rounded-b-lg gap-4">
                  <NavLink to={`/${editPathKey}/${item[identifierKey]}`}>
                    <Button
                      variant="outline"
                      className="w-full h-full text-white bg-black transition-all ease-in-out duration-300 hover:bg-gray-800 hover:scale-105 hover:text-white"
                    >
                      Редагувати
                    </Button>
                  </NavLink>
                  <Dialog>
                    <DialogTrigger className="w-full p-1 rounded-sm bg-red-400 text-sky-50 transition-all ease-in-out duration-300 hover:bg-red-500 hover:scale-105 hover:text-sky-50">
                      Видалити
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="mb-4">
                          Ви впевнені, що хочете видалити {item[nameKey]}?
                        </DialogTitle>
                        <div className="flex gap-4">
                          <DialogClose>
                            <Button
                              variant="destructive"
                              onClick={() =>
                                onDelete(item[nameKey], item[identifierKey])
                              }
                            >
                              Так
                            </Button>
                          </DialogClose>
                          <DialogClose>
                            <Button type="button">Ні</Button>
                          </DialogClose>
                        </div>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
          </div>
          <Button
            onClick={() => setAddDialogOpen(true)}
            className="sm:w-1/2 md:w-1/4 block mx-auto mt-4"
          >
            {addTitle}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-2">Додати новий {name}</DialogTitle>
            <Input
              value={newItemName}
              onChange={handleInputChange}
              placeholder={`Назва нового ${name}у`}
              error={!!error}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            <div className="flex gap-2">
              <Button onClick={handleAdd} className="mt-4">
                Додати
              </Button>
              <DialogClose className="mt-4">
                <Button onClick={() => setAddDialogOpen(false)}>Закрити</Button>
              </DialogClose>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default EditList;
