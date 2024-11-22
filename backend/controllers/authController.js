const bcrypt = require("bcrypt");
const {
  getAllUsernames,
  getAllEmails,
  getUser,
  addUser,
} = require("../models/authModel");

const registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password || !role) {
    return res.status(400).send("Відсутні обов'язкові поля.");
  }

  try {
    getAllUsernames(username, (err, data) => {
      if (err) return res.status(500).send("Помилка на сервері.");

      if (data.length > 0) {
        return res.status(400).send("Користувач з таким ім'ям вже існує.");
      }

      getAllEmails(email, async (err, data) => {
        if (err) return res.status(500).send("помилка на сервері.");

        if (data.length > 0) {
          return res.status(400).send("Електронна пошта вже використовується.");
        }

        const hashedpassword = await bcrypt.hash(password, 10);

        addUser([email, hashedpassword, role, username], (err) => {
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

  getUser(query, username, email, async (err, data) => {
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
