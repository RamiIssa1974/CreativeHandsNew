import { View, StyleSheet, FlatList } from "react-native";
import CategoryItem from './CategoryItem';

function CategoriesList({items}) {
    function renderMealItem(itemData) {
        const item = itemData.item;
        const mealItemProps = {
            id: item.id,
            title: itemData.item.title,
            imageUrl: item.imageUrl,
            duration: item.duration,
            complexity: item.complexity,
            affordability: item.affordability,
        };
        return (
            <MealItem {...mealItemProps} />
        );
    }
    return (
        <View style={styles.container}>
            <FlatList data={items}
                keyExtractor={(meal) => meal.id}
                renderItem={renderMealItem}
            />
        </View>
    );
}
export default CategoriesList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    }
});