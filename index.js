import React from 'react';
import {  AppRegistry, StyleSheet,
  Text,
  View,
  Button,Alert,ActivityIndicator,
  NativeModules,TouchableOpacity,Image,Linking,Platform
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Share from 'react-native-share';
import GetLocation from 'react-native-get-location';
import CodePush from 'react-native-code-push';



const Navigation = NativeModules.NavigationModule
console.log(Navigation)
console.log(NativeModules)
//Code push begin
const CODE_PUSH_OPTIONS ={
  checkFrequency: CodePush.CheckFrequency.ON_APP_START,
};


//Image Picker

const options={
  title: 'my pic app',
  takePhotoButtonTitle: 'Take photo with your camera',
  chooseFromLibraryButtonTitle: 'Choose photo from library',
}

//Share Functionality
const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android:
        'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});

class MainScreen extends React.Component {
// code push
  componentDidMount() {
      CodePush.sync({installMode:CodePush.InstallMode.IMMEDIATE},this.isStaus,null)
    }
    isStaus=(status) =>{
      console.log(status);
    }

    //onstuctor for image picker
    constructor(props){
        super(props);
        this.state={
          avatarSource: null,
          pic:null

        }
      }

      // DialPad function
       openDial=()=>{
       if(Platform.OS === "android")
      Linking.openURL("tel:12344")
      }

        // Share fuctionality
        MyShare= async()=>{
        const shareOption = {
        message: 'This is a test message',
         }
         try{
         const ShareResponse =await Share.open(shareOption);
          }
          catch(error){
          console.log('error =>', error);
          }
        }

      myfun=()=>{
        //alert('clicked');

        ImagePicker.showImagePicker(options, (response) => {
          console.log('Response = ', response);

          if (response.didCancel) {
            console.log('User cancelled image picker');
          }
          else if (response.error) {
            console.log('Image Picker Error: ', response.error);
          }

          else {
            let source = { uri: response.uri };

            // You can also display the image using data:
            // let source = { uri: 'data:image/jpeg;base64,' + response.data };

            this.setState({
              avatarSource: source,
              pic:response.data
            });
          }
        });
      }

      //geo loation
       state = {
              location: null,
              loading: false,
          }

          _requestLocation = () => {
              this.setState({ loading: true, location: null });

              GetLocation.getCurrentPosition({
                  enableHighAccuracy: true,
                  timeout: 150000,
              })
                  .then(location => {
                      this.setState({
                          location,
                          loading: false,

                      });
                      console.log(location);
                  })
                  .catch(ex => {
                      const { code, message } = ex;
                      console.warn(code, message);
                      if (code === 'CANCELLED') {
                          Alert.alert('Location cancelled by user or by another request');
                      }
                      if (code === 'UNAVAILABLE') {
                          Alert.alert('Location service is disabled or unavailable');
                      }
                      if (code === 'TIMEOUT') {
                          Alert.alert('Location request timed out');
                      }
                      if (code === 'UNAUTHORIZED') {
                          Alert.alert('Authorization denied');
                      }
                      this.setState({
                          location: null,
                          loading: false,
                      });
                  });
          }

  render() {
     const { location, loading } = this.state;
    console.log('The React Native app is running')

    return (
      <View style={styles.container}>
              <Text style={styles.welcome}>Welcome to React Native!</Text>

                <Image source={this.state.avatarSource}
                style={{width:'50%',height:100,margin:10}}/>

              <TouchableOpacity style={{backgroundColor:'green',margin:10,padding:10}}
              onPress={this.myfun}>
                <Text style={{color:'#fff'}}>Select Image</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={this.MyShare}>
                <Text>Share</Text>
              </TouchableOpacity>

               <TouchableOpacity style={{backgroundColor:'green',margin:10,padding:10}}
                            onPress={this._requestLocation}>
                              <Text style={{color:'#fff'}}>Get Location</Text>
                            </TouchableOpacity>

               <TouchableOpacity onPress={this.openDial}>
                 <Text>Dial</Text>
               </TouchableOpacity>

                </View>



    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
    },
  button: {
        marginBottom: 8,
    },
   instructions: {
           textAlign: 'center',
           color: '#333333',
           marginBottom: 5,
       },
       location: {
           color: '#333333',
           marginBottom: 5,
       },
});

AppRegistry.registerComponent(
  'MainScreen', // Name of the component for the Android side to pick up
  () => MainScreen 
);

export default CodePush (CODE_PUSH_OPTIONS)(MainScreen);