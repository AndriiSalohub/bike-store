/* eslint-disable react/prop-types */
import { useState } from "react";
import "../styles/AuthPopup.scss";
import axios from "axios";

const RegisterPopup = ({ onClose, setShowSignIn }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    const newErrors = {};
    if (!username) newErrors.username = "Ім'я користувача обов'язкове!";
    if (!email) {
      newErrors.email = "Електронна пошта обов'язкова!";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Невірний формат електронної пошти!";
    }
    if (!password) {
      newErrors.password = "Пароль обов'язковий!";
    } else if (password.length < 6) {
      newErrors.password = "Пароль має бути не менше 6 символів!";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegistration = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setServerError("");
      setSuccessMessage("");

      await axios.post("http://localhost:3000/reg", {
        username,
        email,
        password,
        role: "Користувач",
      });

      setSuccessMessage("Реєстрація успішна! Ви можете увійти.");
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (error) {
      if (error.response && error.response.data) {
        setServerError(error.response.data);
      } else {
        console.error("Помилка реєстрації:", error);
      }
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <button className="popup__close" onClick={onClose}>
          ×
        </button>
        <h2>Зареєструватись</h2>
        <form className="popup__form" onSubmit={handleRegistration}>
          <input
            type="text"
            placeholder="Ім'я користувача"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={errors.username ? "error" : ""}
          />
          {errors.username && (
            <div className="error-message">{errors.username}</div>
          )}

          <input
            type="email"
            placeholder="Електронна пошта"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email ? "error" : ""}
          />
          {errors.email && <div className="error-message">{errors.email}</div>}

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

          {successMessage ? (
            <div className="success-message">
              {successMessage}
              <button
                type="button"
                className="popup__sign-in-button"
                onClick={() => {
                  onClose();
                  setShowSignIn(true);
                }}
              >
                Увійти
              </button>
            </div>
          ) : (
            <button type="submit" className="popup__submit">
              Зареєструватись
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default RegisterPopup;
