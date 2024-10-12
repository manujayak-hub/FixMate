import { create } from 'zustand';

// Define the shape of your user state
interface UserState {
  user: {
    uid: string; // Add UID
    name: string;
    email: string;
  } | null;
  setUser: (user: { uid: string; name: string; email: string } | null) => void;
  clearUser: () => void;
}

// Create the store with Zustand
const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));

export default useUserStore;
