import { View, StyleSheet, Text, Button } from "react-native";
import { GlobalStyles } from "../../constants/styles";

function ErrorOverlay({ message, onConfirm }) {
    return (<View style={styles.caontainer}>
        <Text style={[styles.title, styles.text]}>An error occured!</Text>
        <Text style={styles.message}>{message}</Text>
        <Button onPress={onConfirm} title="OKay"></Button>
         
    </View>);
}
export default ErrorOverlay;

const styles = StyleSheet.create({
    caontainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: GlobalStyles.colors.primary700,
    },
    text: {
        color: 'white',
        textAlign: 'center',
        marginBottom: 8
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    message: {
        fontSize: 14,
        color: 'white',
    }
});