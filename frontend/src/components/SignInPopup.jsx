/* eslint-disable react/prop-types */
import { useState } from "react";
import "../styles/AuthPopup.scss";
import axios from "axios";
import { useAuth } from "../store";

const SignInPopup = ({ onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const { signIn } = useAuth();

  const validateForm = () => {
    const newErrors = {};

    if (!username) {
      newErrors.username = "Ім'я користувача або електронна пошта обов'язкові!";
    }

    if (!password) {
      newErrors.password = "Пароль обов'язковий!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setServerError("");

      const response = await axios.post(
        "http://localhost:3000/sign-in",
        {
          username,
          email: username,
          password,
        },
        { withCredentials: true },
      );

      console.log("Увійшли успішно!");

      signIn(response.data.user);

      onClose();
    } catch (error) {
      if (error.response && error.response.data) {
        setServerError(error.response.data);
      } else {
        console.error("Помилка входу:", error);
      }
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <button className="popup__close" onClick={onClose}>
          ×
        </button>
        <h2>Увійти</h2>
        <form className="popup__form" onSubmit={handleSignIn}>
          <input
            type="text"
            placeholder="Ім'я користувача або електронна пошта"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={errors.username ? "error" : ""}
          />
          {errors.username && (
            <div className="error-message">{errors.username}</div>
          )}

          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={errors.password ? "error" : ""}
          />
          {errors.password && (
            <div className="error-message">{errors.password}</div>
          )}

          {serverError && <div className="error-message">{serverError}</div>}

          <button type="submit" className="popup__submit">
            Увійти
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignInPopup;
