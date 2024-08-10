import { StyleSheet, Text, View } from "react-native";
function LoginScreen({ expenses }) {
    return (
        <View style={styles.container}>             
                <Text>Last 7 Days</Text>                 
        </View>
    );
}
export default LoginScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});