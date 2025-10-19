export async function withMiddleware<T>(fn: () => Promise<T>, label = ""): Promise<T> {
    const start = performance.now();
    try {
        const result = await fn();
        const duration = (performance.now() - start).toFixed(2);
        if (process.env.NODE_ENV === "development") {
            console.log(`✅ ${label} took ${duration}ms`);
        }
        return result;
    } catch (error) {
        console.error(`❌ ${label} failed`, error);
        throw error;
    }
}
