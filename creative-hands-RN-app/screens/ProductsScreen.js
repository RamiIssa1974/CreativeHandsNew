import { useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet } from "react-native";

import CategoryGridTile from '../components/CategoryGridTile';
import { fetchProducts } from "../services/products-service";
import { ProductsContext } from '../store/context/products-context';
import ErrorOverlay from '../components/UI/ErrorOverlay';
import LoadingOverlay from '../components/UI/LoadingOverlay';


function ProductsScreen({ navigation }) {
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState(true);

    const productsCtx = useContext(ProductsContext);

    useEffect(() => {
        async function getProducts() {
            setIsFetching(true);
            try {
                if (!productsCtx.products
                    || productsCtx.products.length === 0) { 

                    const products = await fetchProducts();
                    productsCtx.setAllProducts(products);
                }
                setError(null);
            } catch (error) {
                setError('Could not fetch products!');
            }
            setIsFetching(false);
        }

        getProducts();
    }, []);
    function renderProductItem(itemData) {
        function pressHandler() {
            navigation.navigate('MealsOverview', {
                categoryId: itemData.item.id
            });
        }
        return (
            <CategoryGridTile
                title={itemData.item.title}
                color={itemData.item.color}
                imageUrl={itemData.item.imageUrl}
                onPress={pressHandler} />
        );
    }

    function errorHandler() {
        setError(null);
    }
    if (error && !isFetching) {
        return <ErrorOverlay message={error} onConfirm={errorHandler} />
    }
    if (isFetching) {
        return <LoadingOverlay />
    }

    return (
        <FlatList data={productsCtx.products}
            keyExtractor={(item) => item.id}
            renderItem={renderProductItem}
            numColumns={1} />
    );
}
export default ProductsScreen;
const styles = StyleSheet.create({
    aaa: {
        flex: 1,
    },
});