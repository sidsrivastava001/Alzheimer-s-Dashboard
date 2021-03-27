import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button, TextInput} from 'react-native';
import { firebase } from './Firebase/config.js'



export default function Mood({route}) {
    const {date, Doctor, User } = route.params;

    function buttonPress(i) {
        console.log("Doctors/"+Doctor+"/Appointments/"+User+"/"+date+"/Metrics");
        firebase.database().ref("Doctors/"+Doctor+"/Appointments/"+User+"/"+date+"/Metrics").update({Mood: i});
        firebase.database().ref("Doctors/"+Doctor+"/Appointments/"+User+"/"+date).update({Confirmed: "True"});
        console.log("ID: ", i);
    }
    function RenderButtons() {
        var buttons = [1, 2, 3, 4, 5, 6, 7];
        return buttons.map((i, index) => {
            return (
              <View style={{ marginTop: 20, width: "100%" }} key={index}>
                <Button
                  title={i.toString()}
                  onPress={() => buttonPress(i)}
                />
              </View>
            );
          });
      
    }
    return (
        <View style={{padding: 30}}>
            <Text>How is your mood?</Text>
            <RenderButtons/>
        </View>
    );
}