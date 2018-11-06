import React, { Component } from 'react';
import { StyleSheet, Text, View, ToastAndroid, TouchableOpacity, Alert } from 'react-native';
import urlBase from './config';

export default class TimeInput extends Component {

    urlBase = this.props.urlBase;
    constructor(props) {
        super(props);
        this.state = ({
            date: '',
            time: ''
        });

        setInterval(() => {
            current = new Date();
            date = current.toLocaleDateString('en-US');
            time = current.toLocaleTimeString('en-US');
            this.setState({
                date: date,
                time: time
            })
        }, 1000);
    }

    async uploadDateTime() {

        current = new Date();
        dateTime = current.toLocaleDateString('en-US') + '-' + current.toLocaleTimeString('en-US');
        // ToastAndroid.show(dateTime, ToastAndroid.LONG);

        const dateTimeURL = urlBase + '?T=' + dateTime
        await fetch(dateTimeURL, {
            method: "GET",
        }
        ).then(response => response.text())
            .then(responseData => { ToastAndroid.show(responseData, ToastAndroid.show) })
            .catch((error) => {
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
                    <Text style={styles.title}>Date and Time</Text>

                    <View style={styles.hairline} />

                    <Text style={styles.title}>{this.state.date}</Text>
                    <Text style={styles.title}>{this.state.time}</Text>


                </View>
                <TouchableOpacity style={styles.button}
                    activeOpacity={0.8}
                    onPress={() => this.uploadDateTime()}>
                    <Text style={styles.buttonText}>Upload</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 0.35,
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
})