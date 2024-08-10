import { StyleSheet, Text, View } from "react-native";
function VideosScreen({ expenses }) {
    return (
        <View style={styles.container}>             
                <Text>Last 7 Days</Text>                 
        </View>
    );
}
export default VideosScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});