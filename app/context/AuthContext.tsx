import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from 'expo-secure-store';

interface AuthProps {
  authState?: { token: string | null; authenticated: boolean | null };
  onRegister?: (name: string, email: string, password: string) => Promise<any>;
  onLogin?: (email: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
}

const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{ token: string | null, authenticated: boolean | null }>({ token: null, authenticated: true });

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(process.env.EXPO_PUBLIC_API_URL + '/auth/login', { email, password });

      setAuthState({ token: res.data.accessToken, authenticated: true });

      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`;

      await SecureStore.setItemAsync(process.env.EXPO_PUBLIC_TOKEN_KEY, res.data.token);
    } catch (e) {
      return { error: true, msg: (e as any).response.data.msg };
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync(process.env.EXPO_PUBLIC_TOKEN_KEY);

      setAuthState({ token: null, authenticated: false });
    } catch (e) {
      return { error: true, msg: (e as any).response.data.msg };
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync(process.env.EXPO_PUBLIC_TOKEN_KEY);

        if (token) {
          setAuthState({ token, authenticated: true });

          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
          setAuthState({ token: null, authenticated: false });
        }
      } catch (e) {
        setAuthState({ token: null, authenticated: false });
      }
    }

    checkAuth();
  }, []);

  const value = {
    authState,
    onLogin: login,
    onLogout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
