import { View, Text, StyleSheet, Pressable, Image, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";

function CategoryItem({ id, title, imageUrl, duration, complexity, affordability }) {
    const navigation = useNavigation();

    function selectMealItemHandler() {
        navigation.navigate('MealDetail', {
            mealId: id
        });
    }

    return (
        <View style={styles.mealItem}>
            <Pressable android_ripple={{ color: '#ccc' }}
                style={({ pressed }) => [
                    styles.button,
                    pressed ? styles.buttonPressed : null
                ]}
                onPress={selectMealItemHandler}>
                <View style={styles.innerContainer}>
                    <View>
                        <Image style={styles.image} source={{ uri: imageUrl }} ></Image>
                        <Text style={styles.title}>{title}</Text>
                    </View>                   
                </View>
            </Pressable>
        </View>
    );
}

export default CategoryItem;
const styles = StyleSheet.create({
    mealItem: {
        margin: 16,
        borderRadius: 8,
        backgroundColor: 'white',
        elevation: 5,
        backgroundColor: 'white',
        shadowColor: 'black',
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 16,
        overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
    },
    innerContainer: {
        borderRadius: 8,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 200
    },
    title: {
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 18,
        margin: 8
    },
    details: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        justifyContent: 'center'
    },
    detailItem: {
        marginHorizontal: 4,
        fontSize: 12,
    },
    buttonPressed: {
        opacity: 0.5,
    },
}
);
