import { NavLink } from "react-router-dom";
import { MdOutlineShoppingBag } from "react-icons/md";
import "../styles/Header.scss";

const Header = () => {
  return (
    <header className="header">
      <div className="header__left">
        <h1 className="header__title">bikes.</h1>
        <nav className="header__navigation">
          <NavLink to="/">Домашня сторінка</NavLink>
          <NavLink to="/bikes">Товари</NavLink>
        </nav>
      </div>
      <div className="header__right">
        <div className="header__search">
          <input
            type="text"
            placeholder="Пошук"
            className="header__search-input"
          />
        </div>
        <div className="header__auth">
          <button className="header__auth-sign-in">Увійти</button>

          <button className="header__auth-register">Зареєструватись</button>
        </div>
        <div id="icons-div">
          <NavLink to="/bag" className="header__in-bag" id="bag">
            <MdOutlineShoppingBag size={37} />
            <span className="header__in-bag-number">0</span>
          </NavLink>
        </div>
      </div>
    </header>
  );
};

export default Header;
