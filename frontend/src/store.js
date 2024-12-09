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
  fetchBikes: async (filters, sorting) => {
    try {
      const response = await axios.get("http://localhost:3000/bikes", {
        params: {
          filters: JSON.stringify(filters),
          sorting,
        },
      });
      set(() => ({ bikes: response.data }));
    } catch (error) {
      console.error("Помилка отримання велосипедів:", error);
    }
  },

  deleteBike: (bikeId) =>
    set((state) => ({
      bikes: state.bikes.filter((bike) => bike.bike_id !== bikeId),
    })),
  setBikes: (bikes) => set(() => ({ bikes })),
}));

export const useTypes = create((set) => ({
  types: [],
  fetchTypes: async () => {
    try {
      const response = await axios.get("http://localhost:3000/types");

      set(() => ({
        types: response.data,
      }));
    } catch (error) {
      console.error("Помилка отримання даних про типи:", error);
    }
  },
  deleteType: (typeId) => {
    set((state) => ({
      types: state.types.filter((type) => type.type_id !== typeId),
    }));
  },
  addType: (newType) => {
    set((state) => ({
      types: [...state.types, newType],
    }));
  },
}));

export const useBrands = create((set) => ({
  brands: [],
  fetchBrands: async () => {
    try {
      const response = await axios.get("http://localhost:3000/brands");

      set(() => ({
        brands: response.data,
      }));
    } catch (error) {
      console.error("Помилка отримання даних про бренди:", error);
    }
  },
  deleteBrand: (brandId) => {
    set((state) => ({
      brands: state.brands.filter((brand) => brand.brand_id !== brandId),
    }));
  },
  addBrand: (newBrand) => {
    set((state) => ({
      brands: [...state.brands, newBrand],
    }));
  },
}));

export const useGenders = create((set) => ({
  genders: [],
  fetchGenders: async () => {
    try {
      const response = await axios.get("http://localhost:3000/genders");

      set(() => ({
        genders: response.data,
      }));
    } catch (error) {
      console.error("Помилка отримання даних про статі:", error);
    }
  },
}));

export const useWheelSizes = create((set) => ({
  wheelSizes: [],
  fetchWheelSizes: async () => {
    try {
      const response = await axios.get("http://localhost:3000/wheel_sizes");

      set(() => ({
        wheelSizes: response.data,
      }));
    } catch (error) {
      console.error("Помилка отримання даних про розміри колес:", error);
    }
  },
}));

export const useColors = create((set) => ({
  colors: [],
  fetchColors: async () => {
    try {
      const response = await axios.get("http://localhost:3000/colors");

      set(() => ({
        colors: response.data,
      }));
    } catch (error) {
      console.error("Помилка отримання даних про кольори:", error);
    }
  },
}));

export const useSearch = create((set) => ({
  searchTerm: "",
  changeSearchTerm: (term) => {
    set(() => ({
      searchTerm: term,
    }));
  },
}));

export const useCart = create((set) => ({
  cartItemCount: 0,

  updateCartItemCount: (change) => {
    set((state) => ({
      cartItemCount: state.cartItemCount + change,
    }));
  },
}));

export const usePromotions = create((set) => ({
  promotions: [],
  currentPromotions: [],

  fetchAllPromotions: async () => {
    try {
      const response = await axios.get("http://localhost:3000/promotions");

      set({ promotions: response.data });
    } catch (error) {
      console.error("Error fetching promotions:", error);
    }
  },

  fetchCurrentPromotions: async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/current_promotions",
      );

      set({ currentPromotions: response.data });
    } catch (error) {
      console.error("Error fetching current promotions:", error);
    }
  },

  addPromotion: async (promotionData) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/promotions",
        promotionData,
      );

      set((state) => ({
        promotions: [...state.promotions, response.data],
      }));
      return response.data;
    } catch (error) {
      console.error("Error adding promotion:", error);
      throw error;
    }
  },

  updatePromotion: async (id, promotionData) => {
    try {
      await axios.put(`http://localhost:3000/promotions/${id}`, promotionData);
      const response = await axios.get("http://localhost:3000/promotions");

      set({ promotions: response.data });
    } catch (error) {
      console.error("Error updating promotion:", error);
      throw error;
    }
  },

  deletePromotion: async (id) => {
    try {
      await axios.delete(`http://localhost:3000/promotions/${id}`);
      set((state) => ({
        promotions: state.promotions.filter(
          (promo) => promo.promotion_id !== id,
        ),
      }));
    } catch (error) {
      console.error("Error deleting promotion:", error);
      throw error;
    }
  },
}));
