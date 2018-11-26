import React, { Component } from 'react';
import {
    Platform, StyleSheet, Text, Image, View, TextInput, StatusBar, Alert,
    TouchableOpacity, ImageBackground, ToastAndroid, TouchableHighlightBase
} from 'react-native';
// import SharedPreferences from 'react-native-shared-preferences';

import urlBase from './config';

export default class MessageInput extends Component {

    constructor() {
        super();
        this.state = ({
            message: ''
        });
    }

    componentDidMount() {
        var that = this;
        // SharedPreferences.getItem('message', function (value) {
        //     that.setState({ message: value });
        // });
    }

    async uploadMessage(message) {

        // SharedPreferences.setItem('message', message);

        let convertedMessage = this.convertMessage(message);
        ToastAndroid.show(convertedMessage, ToastAndroid.LONG);

        const messageURL = urlBase + '?M=' + convertedMessage;
        await fetch(messageURL, {
            method: 'GET'
        }).then(response => response.text())
            .then(responseData => {
                ToastAndroid.show(responseData, ToastAndroid.SHORT);
            }).catch((error) => {
                Alert.alert(
                    'Network Error',
                    'Please make sure you are connected to hotspot of the LED board',
                    [
                        { text: 'Ok' }
                    ]
                )
            });
    }

    convertMessage(message) {

        var convertedMessage = '';
        for (let i = 0; i < message.length; i++) {
            decCode = message.charCodeAt(i).toString(10);

            if (decCode >= 2304) {
                var devnagariChar = message[i];
                var charArray = encodeURI(devnagariChar).split('%').splice(1, 6);

                var decChar = [];
                for (var char of charArray) {
                    var dec = parseInt(char, 16) - 256;

                    decChar += dec + '|';
                }
                convertedMessage += decChar;
                console.log(convertedMessage)

            } else {
                convertedMessage += decCode;
                convertedMessage += '|';
            }
        }

        msg = convertedMessage.split('|');
        msg.pop();
        msg.push('0');
        for (var i = 0; i < msg.length; i++) {
            msg[i] = parseInt(msg[i]);
        }

        console.log(msg);
        return this.charMapping(msg);
    }

    charMapping(MESSAGE) {
        var i = 0;
        var j = 0;
        char_count = 0;
        var m = [];

        while (MESSAGE[i] != 0) {
            if (MESSAGE[i] == 32) {                           // if the character is space
                m[j] = 32;
                j++;
                char_count++;
            }
            else if (MESSAGE[i] >= 0) {                       // if the character is english ascii value is positive
                if (i == 0 || MESSAGE[i - 1] < 0 || (MESSAGE[i - 1] == 32 && MESSAGE[i - 2] < 0)) {
                    m[j] = 125;
                    j++;
                    char_count++;
                }
                m[j] = MESSAGE[i];
                j++;
                char_count++;
            }
            else {                                           // if character is negative ascii starts from negative
                if (i == 0 || MESSAGE[i - 1] >= 0 || (MESSAGE[i - 1] == 32 && MESSAGE[i - 2] >= 0)) {
                    m[j] = 126;
                    j++;
                    char_count++;
                }
                var temp1 = MESSAGE[i];
                var temp2 = MESSAGE[i + 1];
                var temp3 = MESSAGE[i + 2];
                if (temp1 == -32) {
                    if (temp2 == -92) {
                        m[j] = temp3 + 160;
                        j++;
                        char_count++;
                    }
                    else if (temp2 == -91) {
                        if (temp3 <= -112) {
                            m[j] = temp3 + 224;
                        }
                        else if (temp3 >= -92) {
                            m[j] = temp3 + 205;
                        }
                        j++;
                        char_count++;
                    }
                }
            }
            i++;
        }

        console.log(String.fromCharCode(m[0]));
        result = '';
        for (var k = 0; k < m.length; k++) {
            result += String.fromCharCode(m[k]);
            m[k] = String.fromCharCode(m[k]);
            console.log(456);
        }
        console.log(result);
        return result;
    }


    render() {
        return (
            <View style={styles.container}>
                <View style={styles.messageContainer}>
                    <Text style={styles.title}>Message</Text>

                    <View style={styles.hairline} />

                    <TextInput style={styles.messageInput}
                        defaultValue={this.state.message}
                        placeholder={'Enter message here'}
                        multiline={true}
                        maxLength={100}
                        autoCorrect={false}
                        onChangeText={text => this.setState({ message: text })} />
                </View>

                <TouchableOpacity style={styles.button}
                    activeOpacity={0.8}
                    onPress={() => this.uploadMessage(this.state.message)}>
                    <Text style={styles.buttonText}>Upload</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 0.5,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        backgroundColor: '#f6e4ca55',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4
    },
    end: {
        flex: 0.08,
        width: '100%',
    },
    messageContainer: {
        flex: 0.8,
        backgroundColor: '#fffe',
        width: '100%',
        borderRadius: 4,
        marginTop: 4,
        marginBottom: 4,
        alignItems: 'center',
        padding: 8
    },
    messageInput: {
        flex: 1,
        width: '100%',
        textAlign: 'center',
    },
    title: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center'
    },
    button: {
        width: '100%',
        backgroundColor: '#234',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
    },
    buttonText: {
        fontSize: 16,
        color: '#fff'
    },
    hairline: {
        height: 2,
        width: '100%',
        backgroundColor: '#ee3',
        margin: 8
    }
});
