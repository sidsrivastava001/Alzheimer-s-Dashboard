import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button, TextInput} from 'react-native';
import { firebase } from './Firebase/config.js'

var num = 0;
var questions = [[1, 1, 2], [2, 3, 6], [4, 2, 2], [10, 2, 5]];
var operators = ['+', '*', '-', '/'];
var correct = 0;
export default function MathQuestions({route, navigation }) {
    const [answer, setAnswer] = useState('0');
    const [initialTime, setTime] = useState(new Date().getTime());
    const [problem, setProblem] = useState("1+1=");
    const {date, Doctor, User} = route.params;
    function updateAnswer(ans) {
        setAnswer(ans);
    }
    function updateCorrect() {
        console.log("Ans: ", answer);
        if(answer == questions[num][2]) {
            correct++;
        }
        num+=1;
        console.log("Num: ", num);
        console.log("Date", date);
        var prob;
        if(num == 4) {
            var finTime = new Date().getTime();
            console.log("Final time: ", finTime);
            console.log("Time: ", (finTime-initialTime)/1000);
            console.log("Correct: " + correct);
            console.log("FINAL DATE: ", date);
            console.log("Doctors/"+Doctor+"/Appointments/"+User+"/"+date+"/Metrics");
            firebase.database().ref("Doctors/"+Doctor+"/Appointments/"+User+"/"+date+"/Metrics").update({Math_Score: correct, Math_Time: (finTime-initialTime)/1000});
            navigation.navigate('Reaction Time', {date: date, Doctor: Doctor, User: User});
        }
        else {
            prob = questions[num][0] + operators[num] + questions[num][1] + "=";
        }
        console.log("Problem: ", prob);
        setAnswer('');
        setProblem(prob);
    }
    return (
        <View>
            <View style={{padding: 30}}>
                <Text>{problem}</Text>
            </View>
            <View style={{padding: 30}}>
                <TextInput placeholder="Enter answer to Math Problem" onChangeText={updateAnswer} value={answer}/>
                <Button title="Submit Answer" onPress={updateCorrect}/>
            </View>
        </View>
      );
}

