import { useState } from "react";
import { NavLink } from "react-router-dom";
import { MdOutlineShoppingBag } from "react-icons/md";
import SignInPopup from "./SignInPopup";
import RegisterPopup from "./RegisterPopup";
import "../styles/Header.scss";
import { useAuth } from "../store";

const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const { isAuth, signOut } = useAuth();

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
          {isAuth ? (
            <button onClick={signOut} className="header__auth-sign-in">
              Вийти
            </button>
          ) : (
            <>
              <button
                onClick={() => setShowSignIn(true)}
                className="header__auth-sign-in"
              >
                Увійти
              </button>
              <button
                onClick={() => setShowRegister(true)}
                className="header__auth-register"
              >
                Зареєструватись
              </button>
            </>
          )}
        </div>
        {isAuth && (
          <div id="icons-div">
            <NavLink to="/bag" className="header__in-bag" id="bag">
              <MdOutlineShoppingBag size={37} />
              <span className="header__in-bag-number">0</span>
            </NavLink>
          </div>
        )}
      </div>
      {showSignIn && <SignInPopup onClose={() => setShowSignIn(false)} />}
      {showRegister && (
        <RegisterPopup
          onClose={() => setShowRegister(false)}
          setShowSignIn={setShowSignIn}
        />
      )}
    </header>
  );
};

export default Header;
