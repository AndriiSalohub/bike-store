import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { MdOutlineShoppingBag, MdSearch, MdHistory } from "react-icons/md";
import SignInPopup from "./SignInPopup";
import RegisterPopup from "./RegisterPopup";
import Navigation from "./Navigation";
import "../styles/Header.scss";
import { useAuth, useCart, useSearch } from "../store";
import axios from "axios";
import SearchResults from "./SearchResults";

const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [search, setSearch] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  const { isAuth, signOut, user } = useAuth();
  const { searchTerm, changeSearchTerm } = useSearch();

  const [searchResults, setSearchResults] = useState([]);

  const [cartId, setCartId] = useState();
  const { cartItemCount, updateCartItemCount } = useCart();

  useEffect(() => {
    const fetchSearchedBikes = async () => {
      try {
        if (searchTerm) {
          const response = await axios.get(
            "http://localhost:3000/searched_bikes",
            {
              params: { search: searchTerm },
            },
          );

          setSearchResults(response.data);
          setShowSearchResults(true);
        }
      } catch (error) {
        console.error("Error fetching searched bikes:", error);
      }
    };

    fetchSearchedBikes();
  }, [searchTerm]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get("http://localhost:3000/cart", {
          params: {
            email: user?.user_email,
          },
        });

        if (user) {
          const cartId = response.data[0].cart_id;
          setCartId(cartId);

          const countResponse = await axios.get(
            "http://localhost:3000/cart_count",
            {
              params: {
                cartId: cartId,
              },
            },
          );

          updateCartItemCount(
            countResponse.data[0]["COUNT(bike_cart_id)"] || 0,
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchCart();
  }, [user]);

  const handleSearchChange = (search) => {
    setShowSearchResults(false);

    setTimeout(() => {
      changeSearchTerm(search);
      setShowSearchResults(true);
    }, 50);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchChange(search);
    }
  };

  return (
    <header className="header">
      <div className="header__left">
        <h1 className="header__title">
          <NavLink to="/">bikes.</NavLink>
        </h1>
        <nav className="header__navigation">
          <Navigation role={user?.user_role} />
        </nav>
      </div>
      <div className="header__right">
        <div className="header__search">
          <input
            value={search}
            type="text"
            placeholder="Пошук"
            className="header__search-input"
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            onClick={() => handleSearchChange(search)}
            className="header__search-button"
          >
            <MdSearch size={24} />
          </button>
          {showSearchResults && (
            <div className="header__search-results">
              <button
                className="header__search-results-close"
                onClick={() => setShowSearchResults(false)}
              >
                x
              </button>
              <SearchResults results={searchResults} role={user?.user_role} />
            </div>
          )}
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
        {isAuth && user?.user_role === "Користувач" && (
          <div id="icons-div">
            <NavLink to="/order-history" className="header__order-history">
              <MdHistory size={37} />
            </NavLink>
            <NavLink to="/cart" className="header__in-bag" id="bag">
              <MdOutlineShoppingBag size={37} />
              {/* <span className="header__in-bag-number">{cartItemCount}</span> */}
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
