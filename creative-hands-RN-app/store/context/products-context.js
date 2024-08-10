import { createContext, useState } from "react";

export const ProductsContext = createContext({
    products: [],
    setAllProducts: (products) => { },
});

function ProductsContextProvider({ children }) {
    const [prods, setProducts] = useState([]);

    function setAllProducts(products) {
        setProducts(products);
    }




    const value = {
        products: prods,
        setAllProducts: setAllProducts,
    };

    return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}

export default ProductsContextProvider;
