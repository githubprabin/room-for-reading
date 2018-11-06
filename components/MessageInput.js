import React, { Component } from 'react';
import {
    Platform, StyleSheet, Text, Image, View, TextInput, StatusBar, Alert,
    TouchableOpacity, ImageBackground, ToastAndroid, TouchableHighlightBase
} from 'react-native';
import SharedPreferences from 'react-native-shared-preferences';

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
        SharedPreferences.getItem('message', function (value) {
            that.setState({ message: value });
        });
    }

    async uploadMessage(message) {

        SharedPreferences.setItem('message', message);

        const messageURL = urlBase + '?M=' + message;

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
                        maxLength={500}
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
