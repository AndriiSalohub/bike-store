/* eslint-disable react/prop-types */
import { NavLink, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import "../styles/Navigation.scss";

const Navigation = ({ role }) => {
  const location = useLocation();

  const getTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Статистика";
      case "/bikes_edit":
        return "Управління даними";
      case "/reports":
        return "Звіти";
      default:
        return "Адмін Меню";
    }
  };

  if (role === "Адмін") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="admin-menu-trigger">{getTitle()}</button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <NavLink to="/">Статистика</NavLink>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <NavLink to="/edit">Управління даними</NavLink>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <NavLink to="/reports">Звіти</NavLink>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <>
      <NavLink to="/">Домашня сторінка</NavLink>
      <NavLink to="/bikes">Товари</NavLink>
    </>
  );
};

export default Navigation;
