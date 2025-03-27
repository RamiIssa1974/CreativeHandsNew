import { getCartToken } from './getCartToken';
import { useAuth } from '@/context/AuthContext';

export const useUserIdentifier = (): string => {
    const { user, isLoggedIn } = useAuth();

    if (isLoggedIn && user) {
        return user.id;
    } else {
        const cartToken = getCartToken();
        return cartToken;
    }
};

