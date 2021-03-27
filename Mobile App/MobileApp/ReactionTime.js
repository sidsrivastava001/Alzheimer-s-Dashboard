import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button, TextInput} from 'react-native';
import Svg, { Circle, Rect } from 'react-native-svg';
import { firebase } from './Firebase/config.js'


function RenderStimuli() {
    return (
    <Svg height="50%" width="50%">
        <Circle cx="50" cy="50" r="45" fill="green" />
    </Svg>
    )
}

export default function Reaction({route, navigation}) {

    const [randFinished, setFinished] = useState(false);
    const [startTime, setStartTime] = useState(0);
    const {date, Doctor, User } = route.params;
    function handleButton() {
        var time = (new Date().getTime()-startTime)/1000;
        console.log("Time: ", time);
        console.log("Doctors/"+Doctor+"/Appointments/"+User+"/"+date+"/Metrics");
        firebase.database().ref("Doctors/"+Doctor+"/Appointments/"+User+"/"+date+"/Metrics").update({Reaction_Time: time});
        navigation.navigate('Mood',  {date: date, Doctor: Doctor, User: User});
    }
    useEffect(() => {
        var rand = (Math.random()*5000)+2000;
        console.log("Random: ", rand);
        const timer = setTimeout(() => {
            console.log("Timer finished!");
            setFinished(true);
            setStartTime(new Date().getTime());
        }, Math.round(rand));
        return () => clearTimeout(timer);
    }, []);
    return (
        <View>
            <View style={{padding: 30}}>
                {randFinished && <RenderStimuli/>}
            </View>
            <View style={{padding: 30}}>
                <Button title="Click Button!" onPress={handleButton}/>
            </View>
        </View>
      );
}