import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '../types';
import { DEMO_BROKERS, DEMO_TENANT } from '../data/seedData';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loginAsDemoUser: () => void;
  loginAsDemoBroker: () => void;
  login: (email: string, role?: UserRole) => boolean;
  register: (data: Partial<User> & { email: string; name: string; role: UserRole }) => void;
  updateProfile: (data: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: DEMO_TENANT, // Default signed in for smooth first-time demo, or can be null
      isAuthenticated: true,

      loginAsDemoUser: () => {
        set({
          user: DEMO_TENANT,
          isAuthenticated: true,
        });
      },

      loginAsDemoBroker: () => {
        set({
          user: DEMO_BROKERS[0], // Muhammed Nihal
          isAuthenticated: true,
        });
      },

      login: (email: string, preferredRole?: UserRole) => {
        const lowerEmail = email.toLowerCase().trim();
        if (lowerEmail === 'broker@haven.demo') {
          set({ user: DEMO_BROKERS[0], isAuthenticated: true });
          return true;
        }
        if (lowerEmail === 'user@haven.demo') {
          set({ user: DEMO_TENANT, isAuthenticated: true });
          return true;
        }

        // Check other brokers
        const broker = DEMO_BROKERS.find((b) => b.email.toLowerCase() === lowerEmail);
        if (broker) {
          set({ user: broker, isAuthenticated: true });
          return true;
        }

        // Create user session dynamically
        const role = preferredRole || 'tenant';
        const newUser: User = {
          id: `usr-${Date.now()}`,
          name: email.split('@')[0],
          email,
          phone: '+91 98000 00000',
          role,
          agencyName: role === 'broker' ? 'Kerala Real Estate Hub' : undefined,
          verificationStatus: role === 'broker' ? 'verified' : undefined,
          createdAt: new Date().toISOString(),
        };
        set({ user: newUser, isAuthenticated: true });
        return true;
      },

      register: (data) => {
        const newUser: User = {
          id: `usr-${Date.now()}`,
          phone: '+91 98000 00000',
          verificationStatus: data.role === 'broker' ? 'pending' : undefined,
          createdAt: new Date().toISOString(),
          ...data,
        };
        set({ user: newUser, isAuthenticated: true });
      },

      updateProfile: (updatedData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedData } : null,
        }));
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'haven_auth_session',
    }
  )
);
