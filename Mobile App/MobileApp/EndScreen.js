import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button, TextInput} from 'react-native';

export default function EndScreen() {
    return (
        <View style={endstyles.view}>

        <Text style = {endstyles.text}>Thank you for completing the Alzheimer's Tests!</Text>
        <Text style = {endstyles.text2}>Your doctor should have gotten your results.</Text>
        <Text style = {endstyles.text2}>They will give you further information about your progression.</Text>
        </View>
    );
}
const endstyles = StyleSheet.create({
    view: {
      justifyContent: 'center',
      padding: 30,
      backgroundColor: "#4103fc",
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
    }
});