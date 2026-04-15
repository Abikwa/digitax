import {Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import GetServerData from "./GetServerData";

 
 async function  SendData ( route, post) {

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
              method: 'POST',
              headers: {
                'Content-Type':'application/json',
                'Accept':'*/*',
                'x-country':'UG',
                'Authorization':'Bearer ' + data.data?.refresh_token,
                'Content-Type':'application/json'
              },
              body: JSON.stringify(post)
            };

            fetch(`https://${ api_Url }/${route}`, postData)
              .then((response) =>  response.json()  )
              .then(async (val) => { 

                if(val.data){
                  if(route == "evaluations"){
                     
                  }else{
                     
                  }
                  await GetServerData(data.data?.refresh_token, data.data?.staff.id)  
                }
                else if(val.msg){
                  Alert.alert(
                    'Validation server',
                    val.msg,
                    [
                      {
                        text: 'Ok',
                        onPress: () => {  },
                      },
                    ],
                    { cancelable: false }
                  );
                }
                
              }).catch((err) => {
                console.log(err)
              })
          }
          else{
            Alert.alert(
              'Error',
              data.msg+"\n Connectez vous de nouveau",
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
            console.log(error)
        });

    return 1;
}

export default SendData