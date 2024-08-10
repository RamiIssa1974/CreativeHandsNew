import { Pressable, View, Text, StyleSheet, Dimensions, Platform, Image } from "react-native";

function CategoryGridTile({ title, color,imageUrl,onPress }) {
    return (
        <View style={styles.gridItem}>
            <Pressable android_ripple={{ color: '#ccc' }}
                style={({ pressed }) => [
                    styles.button,
                    pressed ? styles.buttonPressed : null
                ]}
                onPress={onPress}>
                <View style={[styles.innerContainer, { backgroundColor: color }]}>
                    <Image style={styles.image} source={{ uri: imageUrl }} ></Image>
                    <Text style={styles.title}>{title}</Text>
                </View>
            </Pressable>
        </View>
    );
}
const windowWidth = Dimensions.get('window').width;
export default CategoryGridTile;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    gridItem: {
        flex: 1,
        margin: 10,
        height: 140,
        borderRadius: 10,
        elevation: 4,
        backgroundColor: 'white',
        shadowColor: 'black',
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
    },
    button: {
        flex: 1
    },
    buttonPressed: {
        opacity: 0.5,
    },
    innerContainer: {
        flex: 1,
        padding: 16,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: '90%',
        height: 60
    },
    title: {
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 18,
        margin: 8
    },
    
});