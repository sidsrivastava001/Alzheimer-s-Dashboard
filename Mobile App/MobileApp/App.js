import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button, TextInput} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MathQuestions from './Math.js';
import Reaction from './ReactionTime.js';
import Mood from './Mood.js';
import { firebase } from './Firebase/config.js'

function HomeScreen({ navigation }) {
  const [username, setUsername] = useState('');
  function usernameHandler(text) {
    setUsername(text);
  }
  function buttonHandler() {
    console.log(username);
    var changedName = username.split('.').join('_()');
    firebase.database().ref('Patients/' + changedName + "/Info").on('value', (snapshot) => {
      const doctor = snapshot.val().Doc_Email;
      console.log("Doctor: ", doctor);
      firebase.database().ref('Doctors/'+doctor+'/Appointments/'+changedName).on('value', (snapshot) => {
        snapshot.forEach(function(child) {
          console.log("KEY: ", child.key);
          if(child.val().Confirmed == "False") {
            var thing = child.key;
            console.log("Date: ", child.key);
            console.log("Changed Name: ", changedName);
            console.log("Thing: ", thing);
            navigation.navigate('Math', {date: thing, Doctor: doctor, User: changedName});
          }
        });
      });
      
    });
    
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
        <Stack.Screen name="Mood" component = {Mood} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  
});
