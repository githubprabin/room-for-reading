import React, { Component } from 'react';
import { Platform, StyleSheet, Text, Image, View, TextInput, StatusBar, Alert,
  TouchableOpacity, ImageBackground, ToastAndroid, TouchableHighlightBase } from 'react-native';
import SharedPreferences from 'react-native-shared-preferences';
import MessageInput from './components/MessageInput';
import TimeInput from './components/TimeInput';

const urlBase = 'http://192.168.4.1/RFREY';

export default class App extends Component {

  constructor() {
    super();
    this.state = ({
      message: ''
    });
  }

  componentDidMount() {
    StatusBar.setHidden(true);

    var that = this;
    SharedPreferences.getItem('message', function (value) {
      that.setState({ message: value });
    });
  }

  async uploadMessage(message) {

    SharedPreferences.setItem('message', message);

    await fetch(messageURL, {
      method: 'GET'
    }).then(response => {
    }).then(responseData => {
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
      <ImageBackground style={styles.container}
        source={require('./assets/background.png')}>

        <View style={styles.header}>
          <Image style={styles.appLogo}
            source={require('./assets/logo.png')} />

          <Text style={styles.textAppnameEN}>Room For Reading</Text>
          <Text style={styles.textAppnameNP}>पढ्ने कोठा</Text>
        </View>

        <MessageInput/>

        <TimeInput/>

      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6
  },
  header: {
    flex: 0.35,
    width: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: 6
  },
  body: {
    flex: 0.6,
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
  textAppnameEN: {
    fontSize: 30,
    color: '#62918c',
    fontWeight: 'bold',
  },
  textAppnameNP: {
    fontSize: 30,
    color: '#62918c',
    fontWeight: 'bold',
  },
  appLogo: {
    resizeMode: 'contain',
    flex: 1,
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
    flex: 1,
    backgroundColor: '#234',
    justifyContent: 'center',
    alignItems: 'center'
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
