import { createContext, useState } from "react";

export const CategoriesContext = createContext({
    categories: [],
    setAllCategories: (categories) => { },
    addCategory: (category) => { },
    removeCategory: (id) => { }
});

function CategoriesContextProvider({ children }) {
    const [cats, setCategories] = useState([]);

    function setAllCategories(categories) {        
        setCategories(categories);
    }

    function addCategory(category) {
        setCategories((currentCategories) => [...currentCategories, category]);
    }
    function removeCategory(id) {
        setCategories((currentCategories) =>
            currentFavIds.filter((category) => category.id !== id));
    }

    const value = {
        categories: cats,
        setAllCategories: setAllCategories,
        addCategory: addCategory,
        removeCategory: removeCategory
    };

    return <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>
}

export default CategoriesContextProvider;
