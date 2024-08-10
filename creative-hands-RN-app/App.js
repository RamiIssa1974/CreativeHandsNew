import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import VideosScreen from './screens/VideosScreen';
import LoginScreen from './screens/LoginScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import CategoriesScreen from './screens/CategoriesScreen';
import ProductsScreen from './screens/ProductsScreen';

import { Ionicons } from '@expo/vector-icons';
import FavoritesContextProvider from './store/context/favorites-context';
import CategoriesContextProvider from './store/context/categories-context';
import ProductsContextProvider from './store/context/products-context';

export default function App() {

  const Stack = createNativeStackNavigator();
  const Drawer = createDrawerNavigator();

  function DrawerNavigator() {
    return <Drawer.Navigator screenOptions={{
      headerStyle: { backgroundColor: '#351401' },
      headerTintColor: 'white',
      sceneContainerStyle: { backgroundColor: '#3f3f25' },
      drawerContentStyle: { backgroundColor: '#351401' },
      drawerInactiveTintColor: 'white',
      drawerActiveTintColor: '#351401',
      drawerActiveBackgroundColor: '#e4baa1'
    }}>
      <Drawer.Screen name='Categories' component={CategoriesScreen}
        options={{
          title: 'All Categories',
          drawerIcon: ({ color, size }) => (<Ionicons name="list" color={color} size={size} />),
        }} />
        <Drawer.Screen name='ProductsScreen' component={ProductsScreen}
        options={{
          title: 'Products',
          drawerIcon: ({ color, size }) => (<Ionicons name="american-football-outline" color={color} size={size} />),
        }} />
      <Drawer.Screen name='Favorites' component={FavoritesScreen}
        options={{
          title: 'My Favorites',
          drawerIcon: ({ color, size }) => (<Ionicons name="star" color={color} size={size} />),
        }} />
    </Drawer.Navigator>;
  }
  return (<>
    <StatusBar style='light' />
    <ProductsContextProvider>
      <CategoriesContextProvider>
        <FavoritesContextProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{
              headerStyle: { backgroundColor: '#351401' },
              headerTintColor: 'white',
              contentStyle: { backgroundColor: '#3f3f25' }
            }}>
              <Stack.Screen name='Drawer'
                component={DrawerNavigator}
                options={{ headerShown: false }}
              />
              <Stack.Screen name='VideosScreen' component={VideosScreen} />
              <Stack.Screen name='LoginScreen' component={LoginScreen} options={{ title: 'About the meal' }} />
            </Stack.Navigator>
          </NavigationContainer>
        </FavoritesContextProvider>
      </CategoriesContextProvider>
    </ProductsContextProvider>
  </>);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
