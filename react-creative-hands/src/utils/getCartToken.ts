export const getCartToken = (): string => {
    const tokenKey = 'cartToken';

    if (typeof window === 'undefined') {        
        return '';
    }

    let token = localStorage.getItem(tokenKey);

    if (!token) {
        token = crypto.randomUUID(); // or use uuid package
        localStorage.setItem(tokenKey, token);
    }

    return token;
};
