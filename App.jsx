import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Feather';
import {observer} from 'mobx-react';
import CompareScreen from './src/screens/CompareScreen';
import DetailScreen from './src/screens/DetailScreen';
import HomeScreen from './src/screens/HomeScreen';
import {StyleSheet} from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = observer(() => (
  <Stack.Navigator>
    <Stack.Screen
      name="HomePage"
      component={HomeScreen}
      options={{title: 'PokeApp - Ropi Ridwan'}}
    />
    <Stack.Screen
      name="Detail"
      component={DetailScreen}
      options={{title: 'Detail Pokemon'}}
    />
  </Stack.Navigator>
));

const App = observer(() => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            tabBarLabelStyle: {fontSize: 14, color: 'black'},
            headerShown: false,
            tabBarStyle: styles.tabBarStyle,
            tabBarIcon: ({size, color}) => (
              <Icon size={26} name="home" style={{color: 'black'}} />
            )
          }}
        />
        <Tab.Screen
          name="Compare"
          component={CompareScreen}
          options={{
            tabBarLabelStyle: {fontSize: 14, color: 'black'},
            headerShown: false,
            tabBarStyle: styles.tabBarStyle,
            tabBarIcon: ({size, color}) => (
              <Icon size={26} name="pie-chart" style={{color: 'black'}} />
            )
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
});

export default App;

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: 'white',
    height: 70,
  },
});
