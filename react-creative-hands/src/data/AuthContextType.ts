import { User } from "./User";
export interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoggedIn: boolean;
    loading: boolean;
    login: (username: string, password: string) => Promise<User>;
    logout: () => void;
}