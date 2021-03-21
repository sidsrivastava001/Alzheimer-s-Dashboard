import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button, TextInput} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function HomeScreen() {
  const [username, setUsername] = useState('');
  function usernameHandler(text) {
    setUsername(text);
  }
  function buttonHandler() {
    console.log(username);
  }
  return (
    <View style={{padding: 30}}>
      <TextInput placeholder="Enter email address" onChangeText={usernameHandler} value={username}/>
      <Button title="Start Tests" onPress={buttonHandler}/>
    </View>
  );
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  
});
