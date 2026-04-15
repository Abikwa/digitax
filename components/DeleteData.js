import {Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import GetServerData from "./GetServerData";
 
 async function  DeleteData ( idDelete) {

      const server = await AsyncStorage.getItem('server');
      const username = await AsyncStorage.getItem('username');
      const password = await AsyncStorage.getItem('password');
      const api_Url = await AsyncStorage.getItem('api_Url')
      const config = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      };
      
      fetch(`https://${ api_Url }/login`, config)
        .then((response) =>  response.json()  )
        .then(async data => {

          if(data.data?.refresh_token){

            const postData = {
              method: 'DELETE',
              headers: {
                'Content-Type':'application/json',
                'Accept':'*/*',
                'x-country':'UG',
                'Authorization':'Bearer ' + data.data?.refresh_token,
                'Content-Type':'application/json'
              },
            };

            fetch(`https://${ api_Url }/evaluations/${ idDelete }`)
              .then((response) =>  response.json()  )
              .then(async (val) => { 

                await GetServerData(data.data?.refresh_token, data.data?.staff.id)

                  Alert.alert(
                    'Success',
                    "\n Successfull deleted",
                    [
                      {
                        text: 'Ok',
                        onPress: () => {  },
                      },
                    ],
                    { cancelable: false }
                  );
              })
          }
          else{
            Alert.alert(
              'Error',
              "\n Connectez vous de nouveau  sur votre server",
              [
                {
                  text: 'Ok',
                  onPress: () => {  },
                },
              ],
              { cancelable: false }
            );
          }
            
        }).catch(error =>{
            Alert.alert(
              'Error',
              "\n Connectez vous de nouveau sur votre server",
              [
                {
                  text: 'Ok',
                  onPress: () => {  },
                },
              ],
              { cancelable: false }
            );
        });

    return 1;
}

export default DeleteData