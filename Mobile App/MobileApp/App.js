import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button, TextInput, TouchableOpacity} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MathQuestions from './Math.js';
import Reaction from './ReactionTime.js';
import Mood from './Mood.js';
import EndScreen from './EndScreen.js';
import { firebase } from './Firebase/config.js'
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

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
        if(snapshot.exists()) {
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
        }
        else {
          alert("No appointments Found! Ask your doctor to create an appointment.");
        }
        
      });
      
    });
    
  }
  return (
    <View style={styles.view}>
      <Text style = {styles.text}>Welcome to the Alzheimer's Tests Application!</Text>
      <Text style = {styles.text2}>Here's how to use this app: </Text>
      <Text style = {styles.text2}>1. Enter your email to get started.</Text>
      <Text style = {styles.text2}>2. Do all the math problems presented on the next screen.</Text>
      <Text style = {styles.text2}>3. Perform the reaction time test. A green circle will appear on the screen, and you have to click the button as fast as possible.</Text>
      <Text style = {styles.text2}>4. Answer the sleep questionnaire.</Text>
      <TextInput placeholderTextColor = "gray" placeholder="Enter email address" onChangeText={usernameHandler} value={username} backgroundColor="#fff" padding={5} margin={10} borderRadius={4}/>
      <TouchableOpacity onPress={buttonHandler} style={styles.appButtonContainer}>
        <Text style={styles.appButtonText}>Start Tests!</Text>
      </TouchableOpacity>
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
        <Stack.Screen name="Sleep" component = {Mood} />
        <Stack.Screen name="End" component = {EndScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  view: {
    justifyContent: 'center',
    padding: 30,
    backgroundColor: "#0390fc",
    width: "100%",
    height: "100%"
  },
  text: {
    fontSize: 25,
    color: "white",
    margin: 5
  },
  text2: {
    fontSize: 12,
    color: "white",
    margin: 5
  },
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#009688",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    margin: 5
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
  }
});
