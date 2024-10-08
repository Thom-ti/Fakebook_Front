import axios from "axios";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: "",
      login: async (input) => {
        const result = await axios.post(
          "http://localhost:8899/auth/login",
          input
        );
        set({ user: result.data.user, token: result.data.token });
      },
      logout: () => set({ user: null, token: "" }),
    }),
    {
      name: "state",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useUserStore;
