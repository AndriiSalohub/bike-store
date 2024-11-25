import { NavLink } from "react-router-dom";
import "../styles/HomePage.scss";
import BikesSlider from "../components/BikesSlider";
import { useAuth } from "../store";

const HomePage = () => {
  const { user } = useAuth();

  return user?.user_role !== "Адмін" ? (
    <main className="home-page">
      <h2 className="home-page__title">Ласкаво просимо на bikes.</h2>
      <h3 className="home-page__subtitle">
        Ознайомтеся з нашим асортиментом високоякісних велосипедів, створених
        для продуктивності та комфорту. Від гірських доріг до міських вулиць
        відчуйте поїздку свого життя з нашими майстерно виготовленими
        велосипедами.
      </h3>
      <button className="home-page__shop-button">
        <NavLink to="/bikes">Купуйте зараз</NavLink>
      </button>
      <BikesSlider />
    </main>
  ) : null;
};

export default HomePage;
