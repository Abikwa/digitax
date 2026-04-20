//import liraries
import React, {  useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Dimensions, View, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Image, ScrollView, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite'
import { Searchbar, TextInput, Text, Card, Button, Modal, Portal, Provider } from 'react-native-paper';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'react-native-qrcode-svg';
const { width, height } = Dimensions.get("screen");

const Collecter = () => {

    //variables
    const navigation = useNavigation(); 
    const BgList = ['#E0FFFF', '#E6E6FA', '#FAF0E6', '#FAFAD2']
    const [stand, setStand] = useState('');
    const [responsable, setResponsable] = useState('');
    const [montant, setMontant] = useState(500);
    const [CollectLoarding, setCollectLoarding] = useState(false);

    const [standResults, setStandResults] = useState([]);
    const [visible, setVisible] = useState(false);
    const [currentData, setCurrentData] = useState(null);
    const [isFocused, setFocused] = useState(null);

    const montants = [500, 1000, 2000];

    // 🔍 SEARCH SQLITE
    const searchStand = async(text) => {

      setStand(text);
      try{
        const DB_SQL = await SQLite.openDatabaseAsync("digitax.db", { useNewConnection: true });

        if (text.length % 2 != 0) {
          setStandResults([]);
          return;
        }
  
        const result = await DB_SQL.getAllAsync(
          `SELECT DISTINCT id, numero, name FROM table_users WHERE numero LIKE ? ORDER BY numero ASC LIMIT 5`,
          [`%${text}%`]
        );
        setStandResults(result);

      }catch(err){
        Alert.alert('ERROR',err); 
      }
      
    };

    const selectStand = (item) => {
      setStand(item.numero);
      setResponsable(item.name)
      setStandResults([]);
    }

    const saveData = async() => {
      const date = new Date().toLocaleString();
      
      if(stand && montant){
        
        setCurrentData({})
        
        try{
          const DB_SQL = await SQLite.openDatabaseAsync("digitax.db", { useNewConnection: true });
          
          const id = uuidv4()
          const date = new Date().toISOString();

          let contribuantId = null;

          const contr = await DB_SQL.getFirstAsync(
              `SELECT id, name FROM table_users 
              WHERE numero = ?`,
              [stand]
            );
          if(contr){
            contribuantId = contr.id
            if(!responsable)
            setResponsable(contr.name)
            await DB_SQL.runAsync(`UPDATE table_users SET updatedAt = ? WHERE id = ?`, 
              [new Date()?.toISOString(), contr.id]
            );
          }
          else{
            if(!responsable){
              return Alert.alert("ERROR", "Le nom est obligatoire!")
            }

            const Id_ = uuidv4()
            contribuantId = Id_
            await DB_SQL.runAsync(`INSERT OR REPLACE INTO table_users 
              (id, name, numero, password, createdAt, updatedAt)
              values (?, ?, ?, ?, ?, ? )`, 
              Id_, responsable, stand, '123', new Date()?.toISOString(), new Date()?.toISOString()
            );
          }

          setVisible(true)

          await DB_SQL.runAsync("INSERT OR REPLACE INTO table_taxes (id, contribuantId, numero, price, createdAt) values (?, ?, ?, ?, ?)", id, contribuantId, stand?.toUpperCase(), parseFloat(montant), date);
          
          setCurrentData({
            id: id,
            stand : stand?.toUpperCase(),
            responsable : responsable || contr?.name || '',
            montant,
            date
          });

          setStand("");
          setResponsable("");

        }catch(err){
          Alert.alert('Error', err);          
        }
      }else
        Alert.alert("ERROR", 'Stand ou Plaque et montant sont tous obligatoires')
    };

    //Display data Collect
    const renderItemCollecte = ({ item }) => {
    
      return(
            <View style={ styles.content }>
              
                <View style={styles.DigContainer}>

                  <View style={{ backgroundColor: '#eed', padding : 10, alignItems : 'center' }}>
                    <View><Text style={{ fontWeight : "800", fontSize : 24}}>Nouveau ticket</Text></View>
                    <Text style={{ color : "red", fontWeight : "600", fontSize : 14, textAlign : "center"  }}>{ 'COMMUNE DE LINGWALA' }</Text>
                    <View><Text style={{ fontSize : 12,  letterSpacing : 2, marginBottom : 20}}>Saisie rapide des taxes journalieres </Text></View>
                    <Image
                        style={{ width: 120, height: 120, borderRadius : 80, marginBottom : 10 }}
                        source={ require("../assets/taxe.png")}
                      />        
                  </View>

                    {/* FORM */}
                    <Card style={styles.DigCard}>
                      <Card.Content>

                        <Searchbar
                          placeholder="N° Stand ou Plaque"
                          onChangeText={searchStand}
                          value={ stand }
                          style={[
                            styles.DigSearch,
                            isFocused && { borderColor: "#c62828", borderWidth: 2 }
                          ]}
                          onFocus={() => setFocused(true)}
                          onBlur={() => setFocused(false)}
                        />

                        {standResults.length > 0 && (
                          <Card style={styles.DigDropdown}>
                            <FlatList
                              data={standResults}
                              keyExtractor={(item, i) => i.toString()}
                              renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => selectStand(item)} style={styles.DigItem}>
                                  <Text>{item.numero} _ {item.name}</Text>
                                </TouchableOpacity>
                              )}
                            />
                          </Card>
                        )}

                        <Text style={styles.DigLabel}>Montant</Text>

                        <View style={styles.DigMontantContainer}>
                          {montants.map(m => (
                            <Button
                              key={m}
                              mode={ montant === m ? "contained" : "outlined" }
                              onPress={() => setMontant(m)}
                              style={[
                                styles.DigMontantBtn,
                                montant === m && styles.DigMontantSelected
                              ]}
                              buttonColor={montant === m ? "#c62828" : "transparent"}
                              textColor={montant === m ? "#fff" : "#c62828"}
                            >
                              {m}FC
                            </Button>
                          ))}
                        </View>

                        <TextInput
                          label="Contribuable"
                          mode="outlined"
                          value={responsable}
                          onChangeText={setResponsable}
                          style={styles.DigInput}
                          activeOutlineColor="rgb(220, 73, 0)"
                        />

                        <Button
                          mode="contained"
                          icon="content-save"
                          style={styles.DigSubmitBtn}
                          onPress={saveData}
                        >
                          ENREGISTER & IMPRIMER
                        </Button>

                      </Card.Content>
                    </Card>

                    {/* 🧾 RECEIPT MODAL */}

                  </View>
                    <Portal>
                      <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={styles.DigModal}>

                        {currentData && (
                          <ScrollView contentContainerStyle={styles.DigReceipt}>

                            {/* HEADER */}
                            <Text style={styles.DigCompany}>DIGITAX</Text>
                            <Text style={{ fontSize: 12, fontWeight : "700" }}>COMMUNE DE LINGWALA</Text>
                            <Text style={{ fontSize: 11 }}>{ "Marché Lufungula"}</Text>

                            <View style={styles.DigLine} />

                            {/* INFO */}
                            <View style={styles.DigActions}>
                              <View>
                                <View><Text style={{ fontSize: 12 }}>N° Stand ou Plaque </Text></View>
                                <View><Text style={{ fontSize : 12, fontWeight : "800"}}>{currentData?.stand}</Text></View>
                              </View>
                              <View>
                                <MaterialIcons name="storefront" size={24} color="black" />
                              </View>
                            </View>

                            <View style={styles.DigActions}>
                              <View>
                                <View><Text style={{ fontSize: 12 }}>Contribuable </Text></View>
                                <View><Text style={{ fontSize : 12, fontWeight : "800"}}>{currentData?.responsable}</Text></View>
                              </View>
                              <View>
                                <MaterialIcons name="person" size={24} color="black" />
                              </View>
                            </View>
                            
                            <View style={styles.DigActions}>
                              <View>
                                <View><Text style={{ fontSize: 12 }}>Date opération</Text></View>
                                <View><Text style={{ fontSize : 12, fontWeight : "800"}}>{ new Date(currentData?.date)?.toLocaleDateString("en-GB")} _ {new Date(currentData?.date)?.getHours()}h:{new Date(currentData?.date)?.getMinutes()}</Text></View>
                              </View>
                              <View>
                                <MaterialIcons name="event" size={24} color="black" />
                              </View>
                            </View>

                            <View style={styles.DigActions}>
                              <View>
                                <View><Text style={{ fontSize: 12 }}>Référence </Text></View>
                                <View><Text style={{ fontSize : 12, fontWeight : "800"}}>{currentData?.id?.toUpperCase()?.slice(0, 13)}</Text></View>
                              </View>
                              <View>
                                <MaterialIcons name="fingerprint" size={24} color="black" />
                              </View>
                            </View>

                            <View style={styles.DigLine} />

                            {/* QR CODE */}
                            <View style={{...styles.DigActions, width : "80%"}}>
                              <View style={styles.DigQr}>
                                <QRCode value={currentData?.stand} size={80} />
                              </View>
                              <View>
                                <Text style={{ fontWeight : "900", padding : 0}}>Montant</Text>
                                <Text style={{ fontWeight : "900", fontSize : 50, color : 'red', padding : 0}}>{ currentData?.montant }<Text style={{ fontSize : 12, fontWeight : "400"}}>FC</Text></Text>
                              </View>

                            </View>

                            {/* ACTIONS */}
                            <View style={styles.DigActions}>
                              <Text></Text>

                              <Button onPress={() => setVisible(false)}>
                                Fermer
                              </Button>
                            </View>

                          </ScrollView>
                        )}

                      </Modal>
                    </Portal>
          </View>      
      )
    };
  
  //retun screen view
  return (
    <View  style={{ ...styles.container,  backgroundColor : '#eed' }}>
      <Provider>
        <FlatList
          data={ [1] }
          renderItem={renderItemCollecte}
          key={(item) => "dig" }
          keyExtractor={(item) => "dig" }
          contentContainerStyle={{paddingHorizontal:16}}
          ListFooterComponent={() => { 
            return <View>
              <View 
                style={{
                    marginTop : 30,
                    marginBottom : 300,
                    flex: 1,
                    justifyContent : "center",
                    alignContent : "center",
                    alignItems : "center"
                }}>
              </View>
            </View>
            }
          }
          style={{  flex : 1, paddingTop : 10 }}
        />
      </Provider>
    </View>
  );
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex:1,
    paddingTop: 0,
  },
  
  DigContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  DigCard: {
    borderRadius: 16,
    paddingTop : 10
  },

  DigDropdown: {
    borderRadius: 10,
    marginBottom: 10,
  },

  DigItem: {
    padding: 12,
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
  },

  DigInput: {
    marginBottom: 10,
    backgroundColor: '#fff',
  },

  DigLabel: {
    fontWeight: 'bold',
    marginBottom: 8,
  },

  DigMontantContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  DigMontantBtn: {
    flex: 1,
    marginHorizontal: 4,
  },

  DigSubmitBtn: {
    backgroundColor: '#c62828',
    padding : 8,
    marginTop : 10
  },

  /* 🔥 MODAL RECEIPT */
  DigModal: {
    margin: 20,
    borderRadius: 15,
    backgroundColor: 'white',
  },

  DigReceipt: {
    padding: 20,
    alignItems: 'center',
  },

  DigCompany: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#c62828',
  },

  DigSubtitle: {
    fontSize: 14,
  },

  DigLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },

  DigText: {
    fontSize: 15,
    marginBottom: 4,
  },

  DigQr: {
    marginTop: 10,
    marginBottom: 10,
  },

  DigActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  DigSearch: {
    backgroundColor: "#fff",
    borderRadius: 14,
    elevation: 3, // ombre Android
    shadowColor: "#000", // iOS
    shadowOpacity: 0.1,
    shadowRadius: 6,
    marginBottom: 10,
  },

  DigSearchInput: {
    fontSize: 16,
  }
});

//make this component available to the app
export default Collecter;
