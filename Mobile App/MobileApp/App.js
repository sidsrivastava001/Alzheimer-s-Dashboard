import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button, TextInput} from 'react-native';



export default function App() {
  const [username, setUsername] = useState('');
  return (
    <View style={{padding: 30}}>
      <TextInput placeholder="Enter email address"/>
      <Button title="Start Tests" onPress={() => console.log("Pressed!")}/>
    </View>
  );
}

const styles = StyleSheet.create({
  
});
