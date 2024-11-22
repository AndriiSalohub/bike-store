const bcrypt = require("bcrypt");
const { queryDatabase } = require("../db/db");

const registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password || !role) {
    return res.status(400).send("Відсутні обов'язкові поля.");
  }

  try {
    const getUsernames = "SELECT * FROM bike_store.user WHERE user_name = ?";
    queryDatabase(getUsernames, [username], (err, data) => {
      if (err) return res.status(500).send("Помилка на сервері.");

      if (data.length > 0) {
        return res.status(400).send("Користувач з таким ім'ям вже існує.");
      }

      const getEmails = "SELECT * FROM bike_store.user WHERE user_email = ?";
      queryDatabase(getEmails, [email], async (err, data) => {
        if (err) return res.status(500).send("Помилка на сервері.");

        if (data.length > 0) {
          return res.status(400).send("Електронна пошта вже використовується.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const query =
          "INSERT INTO bike_store.user (user_email, user_password, user_role, user_name) VALUES(?, ?, ?, ?)";

        queryDatabase(query, [email, hashedPassword, role, username], (err) => {
          if (err) return res.status(500).send("Помилка на сервері.");
          res.send("Користувач успішно зареєстрований!");
        });
      });
    });
  } catch (error) {
    return res.status(500).send("Помилка обробки реєстрації.");
  }
};

const loginUser = (req, res) => {
  const { username, email, password } = req.body;

  if (!username && !email) {
    return res
      .status(400)
      .send("Ім'я користувача або електронна пошта обов'язкові.");
  }

  const query =
    "SELECT * FROM bike_store.user WHERE (user_name = ? OR user_email = ?)";

  queryDatabase(query, [username, email], async (err, data) => {
    if (err) return res.status(500).send("Помилка на сервері.");

    if (data.length === 0) {
      return res.status(400).send("Користувача не знайдено.");
    }

    const match = await bcrypt.compare(password, data[0].user_password);
    if (match) {
      req.session.user = data[0];
      return res.send({ message: "Вхід успішний!", user: data[0] });
    } else {
      return res.status(400).send("Неправильний пароль.");
    }
  });
};

const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send("Помилка при виході.");
    res.clearCookie("userId");
    res.send("Вихід успішний.");
  });
};

module.exports = { registerUser, loginUser, logoutUser };
