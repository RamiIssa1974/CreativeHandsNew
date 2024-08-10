import { useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet } from "react-native";
import { CATEGORIES } from "../data/dummy-data";
import CategoryGridTile from '../components/CategoryGridTile';
import { fetchCategories } from "../services/categories-service";
import { CategoriesContext } from '../store/context/categories-context';
import ErrorOverlay from '../components/UI/ErrorOverlay';
import LoadingOverlay from '../components/UI/LoadingOverlay';

function CategoriesScreen({ navigation }) {
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState(true);

    const categoriesCtx = useContext(CategoriesContext);

    useEffect(() => {
        async function getCategories() {
            setIsFetching(true);
            try {
                if (!categoriesCtx.categories
                    || categoriesCtx.categories.length === 0) { 

                    const categories = await fetchCategories();
                    categoriesCtx.setAllCategories(categories);
                }
                setError(null);
            } catch (error) {
                setError('Could not fetch categories!');
            }
            setIsFetching(false);
        }

        getCategories();
    }, []);
    function renderCategoryItem(itemData) {
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
        <FlatList data={categoriesCtx.categories}
            keyExtractor={(item) => item.id}
            renderItem={renderCategoryItem}
            numColumns={3} />
    );
}
export default CategoriesScreen;
const styles = StyleSheet.create({
    aaa: {
        flex: 1,

    },
});