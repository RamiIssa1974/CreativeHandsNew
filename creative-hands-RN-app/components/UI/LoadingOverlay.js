import { View, StyleSheet, ActivityIndicator } from "react-native";
import { GlobalStyles } from "../../constants/styles";

function LoadingOverlay() {
    return (<View style={styles.caontainer}>
        <ActivityIndicator size="large" color="white" />
    </View>);
}
export default LoadingOverlay;

const styles = StyleSheet.create({
    caontainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: GlobalStyles.colors.primary700,
    }
});