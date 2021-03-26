import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button, TextInput} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MathQuestions from './Math.js';
import Reaction from './ReactionTime.js';

function HomeScreen({ navigation }) {
  const [username, setUsername] = useState('');
  function usernameHandler(text) {
    setUsername(text);
  }
  function buttonHandler() {
    console.log(username);
    navigation.navigate('Math');
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
        <Stack.Screen name="Math" component = {MathQuestions} />
        <Stack.Screen name="Reaction Time" component = {Reaction} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  
});
