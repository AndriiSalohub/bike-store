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

  // Determine the menu title based on the current route
  const getTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Домашня сторінка";
      case "/bikes_edit":
        return "Управління даними";
      case "/reports":
        return "Звіти";
      case "/statistics":
        return "Статистика";
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
            <NavLink to="/">Домашня сторінка</NavLink>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <NavLink to="/bikes_edit">Управління даними</NavLink>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <NavLink to="/reports">Звіти</NavLink>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <NavLink to="/statistics">Статистика</NavLink>
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
