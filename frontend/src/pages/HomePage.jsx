import { NavLink } from "react-router-dom";
import "../styles/HomePage.scss";
import BikesSlider from "../components/BikesSlider";
import { useAuth } from "../store";
import Statistics from "../components/Statistics";

const HomePage = () => {
  const { user } = useAuth();

  return (
    <main className="home-page">
      {user?.user_role !== "Адмін" ? (
        <>
          <h2 className="home-page__title">Ласкаво просимо на bikes.</h2>
          <h3 className="home-page__subtitle">
            Ознайомтеся з нашим асортиментом високоякісних велосипедів,
            створених для продуктивності та комфорту. Від гірських доріг до
            міських вулиць відчуйте поїздку свого життя з нашими майстерно
            виготовленими велосипедами.
          </h3>
          <button className="home-page__shop-button mb-4">
            <NavLink to="/bikes">Купуйте зараз</NavLink>
          </button>
          <BikesSlider />
        </>
      ) : (
        <>
          <Statistics />
        </>
      )}
    </main>
  );
};

export default HomePage;
