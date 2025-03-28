function generateFallbackUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export const getCartToken = (): string => {
    const tokenKey = 'cartToken';

    if (typeof window === 'undefined') {        
        return '';
    }

    let token = localStorage.getItem(tokenKey);

    if (!token) {
        token = typeof crypto.randomUUID === 'function'
            ? crypto.randomUUID()
            : generateFallbackUUID();

        localStorage.setItem(tokenKey, token);
    }

    return token;
};
