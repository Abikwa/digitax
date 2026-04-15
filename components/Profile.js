import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import Camera from './Camera';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite'

const Profile = () => {

  const navigation = useNavigation();

  const [Last_name, setLast_name] = useState('');
  const [DB_data, setDB_data] = useState('');
  const [Family_name, setFamily_name] = useState('');
  const [First_name, setFirst_name] = useState('');
  const [email, setEmail] = useState('');
  const [Adress, setAdress] = useState('');
  const [Tel, setTel] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [password, setPassword] = useState('');
  const [Avatar, setAvatar] = useState(null);
  const [SaveLoading, setSaveLoading] = useState(false);
  const [BtnLoading, setBtnLoading] = useState(false);
  const [BtnLoading1, setBtnLoading1] = useState(false);
  const [BtnLoading2, setBtnLoading2] = useState(false);
  const [User, setUser] = useState(null);

  const getProfile = async () => {
    try {
        setSaveLoading(true)
         
      
         const DB_SQL = await SQLite.openDatabaseAsync("digitax.db", { useNewConnection: true });
                  
          if(DB_SQL){
            const Id = await AsyncStorage.getItem("Id")
            const result = await DB_SQL.getFirstAsync(
              `SELECT * FROM table_users 
              WHERE id = ?`,
              [Id]
            );
            setSaveLoading(false)
            if(result){
                setUser(result)
                setFirst_name(result.name)
                setTel(result.tel)
                setAdress(result?.adress)
            }
          }
        } catch (error) {
            setSaveLoading(false)
            alert(error);
          }
    }

    useEffect(() => {
      getProfile()
    }, [])

    const setPassword_ = async() => {
      try{
        setBtnLoading2(true)
        if(password && password == passwordConfirm){
          let token = await AsyncStorage.getItem("token")
            let server = await AsyncStorage.getItem("server")
            let userId = await AsyncStorage.getItem("userId")
            let api_Url = await AsyncStorage.getItem("api_Url")
            let params = {
              method: 'PUT',
              headers: {
                  'Accept':'*/*',
                  'x-country':'CD',
                  'Authorization':'Bearer ' + token,
                  'Content-Type':'application/json'
              },
              body : JSON.stringify({
                  password : password
              })
            };
            await fetch(`https://${ api_Url }/users/${ userId }`, params) 
                .then(response => response.json())
                .then( async(result) => {
                    setBtnLoading2(false)
                    setPassword("")
                    setPasswordConfirm("")
                    Alert.alert('Validation', result?.msg)
                }).catch((error) =>{
                    setBtnLoading2(false)
                    alert(error)
            })
        }else{
          setBtnLoading2(false)
          Alert.alert("Validation", "Les deux mot de passes sont differents")
        }

      }catch(error){
        alert(error)
        setBtnLoading2(false)
      }
    }

    const setProfile = async() => {
      try{
        setBtnLoading(true)
        if(Last_name && Family_name && Tel){
          let token = await AsyncStorage.getItem("token")
            let server = await AsyncStorage.getItem("server")
            let userId = await AsyncStorage.getItem("userId")
            let api_Url = await AsyncStorage.getItem("api_Url")
            let params = {
              method: 'PUT',
              headers: {
                  'Accept':'*/*',
                  'x-country':'CD',
                  'Authorization':'Bearer ' + token,
                  'Content-Type':'application/json'
              },
              body : JSON.stringify({
                  last_name : Last_name,
                  family_name : Family_name,
                  first_name : First_name,
                  tel : Tel,
                  email :email,
                  adress : Adress
              })
            };
            await fetch(`https://${ api_Url }/users_/${ userId }`, params) 
                .then(response => {
                  const statusCode = response.status;
                  const data = response.json();
                  return Promise.all([statusCode, data]);
                })
                .then( async([status, result]) => {
                  if(status == 200){
                    setAvatar(null)
                    getProfile()
                    Alert.alert("Validation", result?.msg)
                  }else
                  Alert.alert("ERROR", result?.msg)
                  setBtnLoading(false)
                }).catch((error) =>{
                  setBtnLoading(false)
                    alert(error)
            })
        }else{
          setBtnLoading(false)
          Alert.alert("Validation", "Nom, post nom et téléphone sont obligatoires")
        }

      }catch(error){
        alert(error)
        setBtnLoading(false)
      }
    }

    const SaveImage = async() => {
      if(Avatar){
        let token = await AsyncStorage.getItem("token")
        let userId = await AsyncStorage.getItem("userId")
        let api_Url = await AsyncStorage.getItem("api_Url")
        var photo = {
          uri: Avatar,
          type: 'image/jpeg',
          name: 'photo.jpg',
        };
        let formData = new FormData()
        if(Avatar)
          formData.append('files', photo)
        formData.append('userId', userId)
        setBtnLoading1(true)
        let params = {
          method: 'POST' ,
          headers: {
              'Accept':'*/*',
              'x-country':'CD',
              'Authorization':'Bearer ' + token,
              'Content-Type': 'multipart/form-data',
            },
            body : formData
        };
        await fetch(`https://${ api_Url }/files/`, params) 
        .then(response => {
            const statusCode = response.status;
            const data = response.json();
            return Promise.all([statusCode, data]);
          })
          .then( async([status, result]) => {
            if(status == 200){
              setAvatar(null)
              getProfile()
            }
            setBtnLoading1(false)
            Alert.alert("Validation", result?.msg)
        }).catch((error) =>{
            setBtnLoading1(false)
            alert(error)
        })
        setBtnLoading1(false)
      }else
      Alert.alert('Validation', 'Image est obligatoire')
    }

  return (
    <FlatList
     style={{ flex : 1, paddingBottom : 300}}
     ListFooterComponent={() => (<View style={{ paddingBottom : 300}} />)}
     refreshControl={<RefreshControl tintColor={"rgb(244, 53, 53)"} refreshing={ SaveLoading }  onRefresh={ () => { getProfile()} } colors={["rgb(0, 0, 90)", "orange", "black", "red", "green"]} />}
      data={[1]}
     renderItem={ () =>{
        return(
            <View style={{...styles.container, backgroundColor :'rgb(230, 230, 230)'}}>
                
                <View style={styles.logoContainer}>
                    <Image
                      // source={{uri: User?.user?.avatar}}
                      source={ require("../assets/avatar.png")}
                      style={styles.logo}
                      resizeMode="cover"
                    />
                </View>

                <View style={styles.infoContainer}>
                  <Text style={styles.infoTitle}>Collecteur</Text>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Nom</Text>
                    <Text style={styles.infoValue}>{ User?.name}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Téléphone</Text>
                    <Text style={styles.infoValue}>{ User?.tel}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Adresse</Text>
                    <Text style={styles.infoValue}>{ User?.adress }</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Affectation</Text>
                    <Text style={styles.infoValue}>{ 'Marché LUFUNGULA' }</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Reviews</Text>
                    <View style={styles.ratingContainer}>
                      {Array.from({ length: 8 }).map((_, index) => (
                        <Text key={index} style={styles.star}>
                          {index < 5 ? '★' : '☆'}
                        </Text>
                      ))}
                    </View>
                  </View>
                </View>
                
                <View style={styles.formContainer}>
                    <View style={styles.card}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Nom</Text>
                        <TextInput
                        style={styles.input}
                        value={First_name}
                        onChangeText={setFirst_name}
                        placeholder="Nom"
                        placeholderTextColor="#999"
                        />
                    </View>
                     
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Téléphone</Text>
                        <TextInput
                        style={styles.input}
                        value={Tel}
                        onChangeText={setTel}
                        placeholder="Telephon"
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                        // secureTextEntry
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Adresse</Text>
                        <TextInput
                        style={styles.input}
                        value={Adress}
                        onChangeText={setAdress}
                        placeholder="Adresse"
                        placeholderTextColor="#999"
                        // secureTextEntry
                        />
                    </View>
                    
                    {
                        BtnLoading ? <ActivityIndicator color={"red"} size={"large"} /> :
                        <TouchableOpacity onPress={  () => Alert.alert("Error", "Fonctionnalite en attente")  } style={{ marginStart : 30, marginEnd : 30}}>
                          <View style={{ backgroundColor: 'rgb(244, 53, 53)', padding: 8, borderRadius : 10, marginTop : 20 }}>
                              <Text style={{ color: 'white', fontWeight : "400", fontSize : 16,  textAlign: 'center' }}>
                                  { 'Editer'}
                                  <Ionicons name='checkbox-outline' size={15} color="white" />
                                </Text>
                          </View>
                      </TouchableOpacity>
                    }
                    </View>
                </View>

                <View style={styles.formContainer}>
                    <View style={{...styles.card}}>
                        <Camera  setAvatar={setAvatar}/>
                        {
                          BtnLoading1 ? <ActivityIndicator color={"red"} size={"large"} /> :
                          <TouchableOpacity onPress={  () => SaveImage()  } style={{ marginStart : 30, marginEnd : 30}}>
                            <View style={{ backgroundColor: 'rgb(244, 53, 53)', padding: 8, borderRadius : 10, marginTop : 20 }}>
                                <Text style={{ color: 'white', fontWeight : "400", fontSize : 16,  textAlign: 'center' }}>
                                    { 'Changer'}
                                    <Ionicons name='checkbox-outline' size={15} color="white" />
                                  </Text>
                            </View>
                        </TouchableOpacity>
                      }
                    </View>
                </View>
 
              <View style={{ marginBottom : 150}}>
                <TouchableOpacity onPress={() => 
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "About" }],
                  })
                 }><Text style={{ fontWeight : "800", color : "rgb(244, 53, 53)", textAlign: 'center'}}> Retour <Ionicons name='log-out' size={20} /></Text></TouchableOpacity>
              </View>
            </View>
        )
     }}
     />
  );
};

const styles = {
  container: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  logo: {
    width: 300,
    height: 350,
    borderRadius:80,
    borderWidth : 6,
    borderColor : "white",
    // resizeMode: 'contain',
  },

    formContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      color: '#fff',
      marginBottom: 20,
      marginTop: 20,
    },
    card: {
      width: '95%',
      backgroundColor: '#fff',
      borderRadius: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      padding: 20,
      marginBottom: 80,
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      color: '#333',
    },
    input: {
      height: 40,
      borderRadius:6,
      borderWidth: 1,
      borderColor: '#ddd',
      color: '#333',
      paddingLeft:10,
    },
    button: {
      width: '100%',
      height: 40,
      backgroundColor: '#333',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 4,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
    },
    infoContainer: {
      padding: 20,
      backgroundColor: '#F5F5F5',
      borderRadius: 10,
      margin: 20,
    },
    infoTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    infoLabel: {
      fontSize: 16,
      color: '#888',
    },
    infoValue: {
      fontSize: 16,
    },
    ratingContainer: {
      flexDirection: 'row',
    },
    star: {
      fontSize: 16,
      color: '#FFD700',
    },
  };
  
  export default Profile;