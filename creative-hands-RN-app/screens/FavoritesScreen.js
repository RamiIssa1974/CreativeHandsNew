
import { StyleSheet, Text, View } from "react-native";
function FavoritesScreen({ expenses }) {
    return (
        <View style={styles.container}>             
                <Text>Last 7 Days</Text>                 
        </View>
    );
}
export default FavoritesScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});