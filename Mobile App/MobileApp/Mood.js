import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button, TextInput, TouchableOpacity} from 'react-native';
import { firebase } from './Firebase/config.js'



export default function Mood({route, navigation}) {
    const {date, Doctor, User } = route.params;

    function buttonPress(i) {
        console.log("Doctors/"+Doctor+"/Appointments/"+User+"/"+date+"/Metrics");
        firebase.database().ref("Doctors/"+Doctor+"/Appointments/"+User+"/"+date+"/Metrics").update({Sleep: i});
        firebase.database().ref("Doctors/"+Doctor+"/Appointments/"+User+"/"+date).update({Confirmed: "True"});
        console.log("ID: ", i);
        navigation.navigate('End');
    }
    function RenderButtons() {
        var buttons = ["1: Feeling very alert, wide awake", "2: Able to concentrate, but not at peak", "3: Relaxed and awake, but not fully alert", "4: A little tired", "5: Feeling tired and struggling to concentrate", "6: Sleepy and want to lie down", "7: Very sleepy and cannot stay awake"];
        return buttons.map((i, index) => {
            return (
              <View style={{ marginTop: 20, width: "100%" }} key={index}>
                <TouchableOpacity onPress={() => buttonPress(i)} style={moodstyles.appButtonContainer}>
                  <Text style={moodstyles.appButtonText}>{i}</Text>
                </TouchableOpacity>
              </View>
            );
          });
      
    }
    return (
        <View style={moodstyles.view}>
            <Text style={moodstyles.text}>Which of these statements describes how you are feeling?</Text>
            <RenderButtons/>
        </View>
    );
}

const moodstyles = StyleSheet.create({
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
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#009688",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    margin: 5
  },
  appButtonText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
  }
});
