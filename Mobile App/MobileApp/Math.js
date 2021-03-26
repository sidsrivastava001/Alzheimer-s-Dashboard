import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button, TextInput} from 'react-native';
var num = 0;
var questions = [[1, 1, 2], [2, 3, 6], [4, 2, 2], [10, 2, 5]];
var operators = ['+', '*', '-', '/'];
var correct = 0;
var time = new Date().getTime();
export default function MathQuestions({ navigation }) {
    const [answer, setAnswer] = useState('0');
    
    const [problem, setProblem] = useState("1+1=");
    
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
        var prob;
        if(num == 4) {
            console.log("Time: ", (new Date().getTime()-time)/1000);
            console.log("Correct: " + correct);
            navigation.navigate('Reaction Time');
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

