import React, { useState , useEffect, useRef} from 'react';
import { Text , Image , StyleSheet, Alert , View, ActivityIndicator, FlatList, Pressable, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite'
import { TextInput } from "react-native-paper";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const { width } = Dimensions.get("screen");

const Login = ({ navigation }) => {
  
  const inputRef = useRef(null);
    const [ usererror, setUsererror ] = useState(false);
    const [ Tel, setTel ] = useState(null);
    const [ Name, setName ] = useState(null);
    const [ Adress, setAdress ] = useState(null);
    const [ SaveLoading, setSaveLoading ] = useState(false);
    
    useEffect(() => {
      inputRef.current?.focus();
      }, []);

      const Save = async () => {
        setUsererror("");
        setSaveLoading(true)

          if(Name && Tel && Adress){

            const DB_SQL = await SQLite.openDatabaseAsync("digitax.db", { useNewConnection: true });
            const first = await DB_SQL.getFirstAsync("SELECT name FROM sqlite_master WHERE type='table' AND name='table_users'")
            
            if(!first){
              
              await DB_SQL.execAsync(`
                PRAGMA journal_mode = WAL;

                DROP TABLE IF EXISTS table_users;
                DROP TABLE IF EXISTS table_taxes;
                DROP TABLE IF EXISTS table_branches;

                CREATE TABLE IF NOT EXISTS table_branches (
                        id INTEGER PRIMARY KEY UNIQUE NOT NULL,
                        name VARCHAR(80) NULL,
                        type VARCHAR(20) NULL
                      );

                CREATE TABLE IF NOT EXISTS table_users (
                        id CHAR(36) PRIMARY KEY  UNIQUE NOT NULL,
                        actif INTEGER DEFAULT 1,
                        name VARCHAR(150) NULL,
                        adress VARCHAR(80) NULL,
                        avatar VARCHAR(250) NULL,
                        brancheId INTEGER NULL,
                        profileId INTEGER NULL,
                        password VARCHAR(20) NULL,
                        tel VARCHAR(20) NULL,
                        numero VARCHAR(20) NULL,
                        createdAt DATETIME NULL
                      );

                CREATE TABLE IF NOT EXISTS table_taxes (
                      id CHAR(36) PRIMARY KEY  UNIQUE NOT NULL,
                      contribuantId VARCHAR(80) NULL,
                      createdAt DATETIME NULL,
                      price DOUBLE  NULL,
                      status INTEGER NULL DEFAULT 0 );
                `);

            }
            
            const firstRow = await DB_SQL.getFirstAsync("SELECT count(*) as count FROM table_users")
            
            if(firstRow.count){
              Alert.alert('Synchroniser', 'Actualiser certaines données sur votre appareil svp!', [
                
                {text: 'Oui actualiser', onPress: async() => {
                  
                  const id = uuidv4()
                  await DB_SQL.runAsync(`INSERT OR REPLACE INTO table_users 
                    (id, name, password, tel, adress, createdAt)
                    values (?, ?, ?, ?, ?, ?)`, 
                    id, Name, '123', Tel, Adress, new Date()?.toISOString()
                  );

                  await AsyncStorage.setItem('Id', id)
                  await AsyncStorage.setItem('Name', Name)
                  await AsyncStorage.setItem('Tel', Tel+"")
                  await AsyncStorage.setItem('Profile', "Collecteur")
                  // await AsyncStorage.setItem('Avatar', '')
                  await AsyncStorage.setItem('Branche', "")

                  setSaveLoading(false)
                   
                  navigation.replace("template", { Profile : "Collecteur", Name : Name, Tel : Tel, Avatar : null, Branche : "Marché Lufungula" })
                }},
              ]);
            }

            
        }else {
          setSaveLoading(false)
          Alert.alert('Validation', "Téléphone et  mot de passe obligatoire!")
        }

    }
    
    return(
       <FlatList
        style={{ flex : 1, backgroundColor : 'white'}}
        data={[1]}
        
        renderItem={
          () =>{
            return(
              <View>
                <View  style={ styles.content }>
                  <View style={ styles.content }>
                      <View style={{ display : "flex", justifyContent : "center", alignItems : "center" }}>
                          <Image
                              style={{ width: 80, height: 90, borderRadius : 80 }}
                              source={require("./../assets/icon.png")}
                          />
                          <Text style={{ color : "red", fontWeight : "600", fontSize : 24, textAlign : "center"  }}>{ "DIGI TAX" }</Text>
                          <Text style={{ color : "red", fontWeight : "400", fontSize : 11, textAlign : "center"  }}>{ "Service National de Taxe" }</Text>
                          <Text style={{ color : "black", fontWeight : "400", fontSize : 11, textAlign : "center"  }}>{ "Commune de Lingwala" }</Text>
                          <Text style={{ color : "black", fontWeight : "400", fontSize : 10, textAlign : "center" }}>{ "Creer votre compte rapidement" }</Text>
                      </View>
                      <Text style={{  color : "red" }}>{ usererror }</Text>

                      <TextInput
                            label="Nom"
                            mode="outlined"
                            style={{ overflow : "hidden", height : 40, backgroundColor : 'white', width : width * 0.65 }} 
                            onChangeText={ async (val) => { setName(val); setSaveLoading(false) }}
                            left={<TextInput.Icon icon="account-circle" size={15} />}
                            activeOutlineColor="rgb(220, 73, 0)"
                            outlineColor="#ccc"
                      />

                      <TextInput
                            label="Téléphone"
                            mode="outlined"
                            keyboardType="numeric"
                            style={{ overflow : "hidden", height : 40, backgroundColor : 'white', width : width * 0.65 }} 
                            onChangeText={ async (val) => { setTel(val); setSaveLoading(false) }}
                            left={<TextInput.Icon icon="phone" size={15} />}
                            activeOutlineColor="rgb(220, 73, 0)"
                            outlineColor="#ccc"
                      />

                      <TextInput
                            label="Adresse"
                            mode="outlined"
                            style={{ backgroundColor : 'white', overflow : "hidden", height : 40, width : width * 0.65 }}
                            onChangeText={ async (val) => { setAdress(val); setSaveLoading(false) }}
                            left={<TextInput.Icon icon="flag"  size={15}/>}
                            activeOutlineColor="rgb(220, 73, 0)"
                            outlineColor="#ccc"
                      />

                      {
                        SaveLoading ? <ActivityIndicator color={"red"} size={"large"} /> :
                        <Pressable onPress={  () => Save()  } style={{ marginStart : 30, marginEnd : 30}}>
                          <View style={{ backgroundColor: 'rgb(244, 53, 53)', padding: 8, borderRadius : 10, marginTop : 20 }}>
                              <Text style={{ color: 'white', fontWeight : "400", fontSize : 16,  textAlign: 'center' }}>
                                  { "S'enregister"}
                                  <Ionicons name='checkmark-circle' size={15} color="white" />
                                </Text>
                          </View>
                      </Pressable>
                    }

                  </View>
                </View>
              </View>
            )
          }
        }
      />
    )
}

const styles = StyleSheet.create({
    content: {
      flex: 1,
      paddingHorizontal: 4,
      paddingVertical: 7,
      backgroundColor: "rgb(255, 255, 255)",
      paddingTop : 20
    },
    flexData:{
        flexDirection: "row",
        marginVertical : 5
    },
    touch : {
        borderColor : "#ccc",
        marginHorizontal: 5,
        marginVertical:4,
        borderRadius : 8,
        borderWidth : 1,
        paddingHorizontal :5,
        paddingBottom : 3
    }
  });

  export default Login