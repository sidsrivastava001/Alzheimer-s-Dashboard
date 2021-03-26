import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button, TextInput} from 'react-native';
import Svg, { Circle, Rect } from 'react-native-svg';

function RenderStimuli() {
    return (
    <Svg height="50%" width="50%">
        <Circle cx="50" cy="50" r="45" fill="green" />
    </Svg>
    )
}

export default function Reaction() {
    const [randFinished, setFinished] = useState(false);
    const [rand, setRand] = useState((Math.random()*5000)+2000);
    const [startTime, setStartTime] = useState(0);
    
    function handleButton() {
        console.log("Time: ", (new Date().getTime()-startTime)/1000);
    }
    useEffect(() => {
        const timer = setTimeout(() => {
            console.log("Timer finished!");
            setFinished(true);
            setStartTime(new Date().getTime());
        }, rand);
        return () => clearTimeout(timer);
    });
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