import { create } from "zustand";
import axios from "axios";

export const useAuth = create((set) => ({
  isAuth: false,
  user: null,

  initializeAuth: async () => {
    try {
      const response = await axios.get("http://localhost:3000/session", {
        withCredentials: true,
      });

      if (response.data.loggedIn) {
        set(() => ({
          isAuth: true,
          user: response.data.user,
        }));
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
    } catch (error) {
      console.error("Помилка перевірки сесії:", error);
    }
  },

  signIn: (user) => {
    set(() => ({
      isAuth: true,
      user,
    }));
    localStorage.setItem("user", JSON.stringify(user));
  },

  signOut: async () => {
    try {
      await axios.post(
        "http://localhost:3000/logout",
        {},
        {
          withCredentials: true,
        },
      );
      set(() => ({
        isAuth: false,
        user: null,
      }));

      localStorage.removeItem("user");
    } catch (error) {
      console.error("Помилка під час виходу:", error);
    }
  },
}));

export const useBikes = create((set) => ({
  bikes: [],
  fetchBikes: async () => {
    try {
      const response = await axios.get("http://localhost:3000/bikes");
      set(() => ({ bikes: response.data }));
    } catch (error) {
      console.error("Помилка отримання велосипедів:", error);
    }
  },
}));
