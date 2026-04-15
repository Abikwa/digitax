import { View, Modal, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator} from 'react-native';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import * as Print from 'expo-print';
import { useNavigation } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import { Button } from 'react-native-paper';

const Members = [
  { id: '1', name: 'John', avatar: 'https://bootdey.com/img/Content/avatar/avatar1.png' },
  { id: '2', name: 'Emily', avatar: 'https://bootdey.com/img/Content/avatar/avatar2.png' },
  { id: '3', name: 'Michael', avatar: 'https://bootdey.com/img/Content/avatar/avatar3.png' },
  { id: '4', name: 'Michael', avatar: 'https://bootdey.com/img/Content/avatar/avatar4.png' },
  { id: '5', name: 'Michael', avatar: 'https://bootdey.com/img/Content/avatar/avatar5.png' },
]

const BgList = ['#E0FFFF', '#E6E6FA', '#FAF0E6','#FAFAD2']

const ListInvoice = ({ item, DeletedP = 0 }) => {
    const navigation = useNavigation()
    
    const[IsPrinting, setIsPrinting] = useState(false)
    const [visible, setVisible] = useState(false);

    const setDeleted = () => {
        Alert.alert(
            'Confirmation',
            "\nVoulez vous supprimer ce paiement? ",
            [
                {
                    text: 'Annuler',
                    onPress: () => {
                      
                    },
                    style : 'destructive',
                },
                {
                    text: 'Oui SUPPRIMER',
                    onPress: async() => { 
                      let token = await AsyncStorage.getItem("token")
                      let api_Url = await AsyncStorage.getItem("api_Url")
                      let params = {
                        method: 'DELETE',
                        headers: {
                            'Accept':'*/*',
                            'x-country':'CD',
                            'Authorization':'Bearer ' + token,
                            'Content-Type':'application/json'
                        }
                      }
                      await fetch(`https://${ api_Url }/schoolfees/${ item?.id }`, params) 
                        .then(response => response.json())
                        .then( async(result) => {
                            Alert.alert('Validation', result?.msg)
                            if(item.operation == 'Supprimer')
                              item = {}
                            else
                              item.operation = 'Supprimer'
                        })
                    }
                }
            ]
          )
    }

    const makeCheckDivice = async() =>{
      setVisible(false);
      let Months = ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre']
      setIsPrinting(true)
      let text =  `\n\nDIGITAX\n`
      text += `_________________\n`
      text += `COMMUNE : LINGWALA\n`
      text += `Adress : MARCHE LUFUNGULA\n`
      text += `.................\n\n`
      text += `Ticket. ID : ADF34\n`
      text += `Contribuable : NEMY MPONYO\n`
      text += `N° Stand _ Plaque : AE2348\n`
      text += `_________________\n`
      text += ` \t  N°. Réf \n \n`
      
    
      text += `------------------\n`

      text += `Print ${ new Date(item?.createdAt)?.toLocaleDateString("en-GB") } ${ new Date(item?.createdAt)?.getHours() }h:${ new Date(item?.createdAt)?.getMinutes() }`
      text += `\n©By Typhon\n\n`
      setIsPrinting(false)
      await Print.printAsync({
        html: `<pre>${text}</pre>`,
      });
    }


    return(
        <View style={style_s.classItem} key={item.id+"__"}>
          <View style={style_s.timelineContainer}>
            <View style={{ backgroundColor: item.operation == 'Supprimer' ? 'red' : '#ff7f50', ...style_s.timelineDot }} />
            <View style={{ backgroundColor: item.operation == 'Supprimer' ? 'red' : '#ff7f50', ...style_s.timelineLine }} />
          </View>
          { IsPrinting ? <ActivityIndicator color={"red"} size={"large"} /> : <Text></Text> }
          <View style={style_s.classContent}>
            <View >
                <View style={style_s.classHours}>
                    <Text style={style_s.startTime}>{ new Date(item?.createdAt)?.getHours() }h</Text>
                    <Text style={style_s.startTime}>{ new Date(item?.createdAt)?.getMinutes() }'</Text>
                </View>
            </View>
    
            <View style={[style_s.card,{backgroundColor: BgList[Math.floor(Math.random() * BgList.length)]}]}>
              <TouchableOpacity  onPress={ () => setVisible(true) }>
                <View style={{ flexDirection : "row", justifyContent : "flex-start"}}>
                  <View>
                    <View style={{ backgroundColor : "white", padding : 5, borderRadius : 50, borderColor :"rgb(239, 189, 189)", borderWidth : 2}}><MaterialIcons name='receipt' color={'red'} size={25} /></View>
                  </View>
                  <View style={{ marginStart : 10 }}>
                    <Text style={style_s.cardTitle}><Text style={{ fontSize : 18, fontWeight : "600"}}>{ item?.price?.toLocaleString()} FC</Text></Text>
                    <Text style={{...style_s.cardTitle, fontSize : 9, marginBottom : 1}}><MaterialIcons name='account-tree' size={10} /> Réf : <Text style={{ fontWeight : "800"}}>{ item?.id?.slice(0, 5)?.toUpperCase() }</Text></Text>
                    <Text style={{...style_s.cardTitle, fontSize : 9, marginBottom : 1}}><MaterialIcons name='description' size={10} /> Num. : <Text style={{ fontWeight : "800"}}>{ item?.contribuantId }</Text></Text>
                    <View style={{ flexDirection : "row", justifyContent : 'space-between', width : "92%"}}>
                      <Text style={{...style_s.cardTitle, fontSize : 9, marginBottom : 1}}><MaterialIcons name='person' size={10} /> Contribuable : <Text style={{ fontWeight : "800"}}>Alex bat</Text></Text>
                      {item.status == 1 ? (
                        <MaterialIcons name="done-all" size={16} />
                      ) : (
                        <MaterialIcons name="cloud-off" size={16} />
                      )}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <Modal
              visible={visible}
              animationType="slide" // "none" | "slide" | "fade"
              transparent={true}    // met un fond transparent
              onRequestClose={() => setVisible(false)} // obligatoire sur Android
            >
          <View style={style_s.modalOverlay}>
            <View style={style_s.modalContent}>
              <View style={style_s.content}>
                
                <View style={{ alignItems: 'center'}}>

                  <Text style={style_s.DigCompany}>DIGITAX</Text>
                  <Text style={{ fontSize: 12, fontWeight : "700" }}>COMMUNE DE LINGWALA</Text>
                  <Text style={{ fontSize: 11 }}>{ "Marché Lufungula"}</Text>

                  <View style={style_s.DigLine} />

                  {/* INFO */}
                  <View style={style_s.DigActions}>
                    <View>
                      <View><Text style={{ fontSize: 12 }}>N° Stand ou Plaque </Text></View>
                      <View><Text style={{ fontSize : 12, fontWeight : "800"}}>{item?.contribuantId}</Text></View>
                    </View>
                    <View>
                      <MaterialIcons name="storefront" size={24} color="black" />
                    </View>
                  </View>

                  <View style={style_s.DigActions}>
                    <View>
                      <View><Text style={{ fontSize: 12 }}>Contribuable </Text></View>
                      <View><Text style={{ fontSize : 12, fontWeight : "800"}}>{item?.contribuantId}</Text></View>
                    </View>
                    <View>
                      <MaterialIcons name="person" size={24} color="black" />
                    </View>
                  </View>
                  
                  <View style={style_s.DigActions}>
                    <View>
                      <View><Text style={{ fontSize: 12 }}>Date </Text></View>
                      <View><Text style={{ fontSize : 12, fontWeight : "800"}}>{ new Date(item?.createdAt)?.toLocaleDateString("en-GB")} _ {new Date(item?.createdAt)?.getHours()}h:{new Date(item?.createdAt)?.getMinutes()}</Text></View>
                    </View>
                    <View>
                      <MaterialIcons name="event" size={24} color="black" />
                    </View>
                  </View>

                  <View style={style_s.DigActions}>
                    <View>
                      <View><Text style={{ fontSize: 12 }}>Réf </Text></View>
                      <View><Text style={{ fontSize : 12, fontWeight : "800"}}>{item?.id?.toUpperCase()?.slice(0, 13)}</Text></View>
                    </View>
                    <View>
                      <MaterialIcons name="fingerprint" size={24} color="black" />
                    </View>
                  </View>

                  <View style={style_s.DigLine} />

                  {/* QR CODE */}
                  <View style={{...style_s.DigActions, width : "80%"}}>
                    <View style={style_s.DigQr}>
                      <QRCode value={item?.contribuantId} size={80} />
                    </View>
                    <View>
                      <Text style={{ fontWeight : "900", padding : 0}}>Montant</Text>
                      <Text style={{ fontWeight : "900", fontSize : 50, color : 'red', padding : 0}}>{ item?.price }<Text style={{ fontSize : 12, fontWeight : "400"}}>FC</Text></Text>
                    </View>
                  </View>
                </View>

                <View style={style_s.separator} />
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 10 }}>
                    <View>
                      <Button onPress={() => makeCheckDivice()} labelStyle={{ color : "red"}}>
                          <Text>Imprimer</Text>
                        </Button>
                    </View>
                    <View>
                      <TouchableOpacity
                      onPress={() => setVisible(false) }>
                      <View style={style_s.content_}>
                          <Text>Fermer</Text>
                      </View>
                      </TouchableOpacity>
                    </View>
                </View>
                <View style={style_s.separator} />

              </View>
            </View>
          </View>
        </Modal>

        </View>
    )
}

const style_s = StyleSheet.create({
  row: {
      flexDirection: 'row',
      alignItems: 'center',
      borderColor: '#dcdcdc',
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      borderRadius : 10,
      marginBottom : 2,
      padding: 10,
      justifyContent: 'space-between',
    },
    pic: {
      borderRadius: 25,
      width: 40,
      height: 40,
    },
    nameContainer: {
      // flexDirection: 'row',
      // justifyContent: 'flex-start',
      // width: 270,
    },
    nameTxt: {
      marginLeft: 5,
      fontWeight: '600',
      color: '#222',
      fontSize: 13,
    },
    mblTxt: {
      fontWeight: '200',
      color: '#777',
      fontSize: 13,
    },
    end: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    time: {
      fontWeight: '400',
      color: '#666',
      fontSize: 12,
    },
    cardContainer: {
      marginTop : 10,
      height: 200,
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 20,
      paddingBottom : 50,
      justifyContent: 'space-between',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 10,
      borderWidth: 1,
      borderColor: '#ddd',
      borderBottomWidth: 6,
      borderBottomColor: '#ccc',
    },
    cardNumber: {
      fontSize: 18,
      letterSpacing: 4,
      marginBottom: 10,
    },
    cardInfoContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    cardInfoItem: {
      flex: 1,
    },
    cardInfoLabel: {
      fontSize: 12,
      color: 'gray',
    },
    cardInfoValue: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    carouselContainer: {
      marginVertical: 40,
      alignItems: 'center',
    },
    logo: {
      width: 50,
      height: 50,
      borderRadius : 16
    },
    container: {
      flex: 1,
      padding: 10,
      paddingTop:10,
      marginTop : 20
    },
    listContainer:{
      paddingHorizontal:10
    },
    card: {
      flex:1,
      backgroundColor: 'rgb(120, 180, 300)',
      borderRadius: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
      marginBottom: 16,
      padding: 8,
    },
    header: {
      marginBottom: 8,
    },
    headerTitle: {
      color:'#ffffff',
      fontSize: 12,
      fontWeight: 'bold',
    },
    headerSubtitle: {
      fontSize: 10,
      color:'#000',
    },
    body: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 8,
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 8,
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: 13,
      fontWeight: 'bold',
      color:'#ffffff',
    },
    userRole: {
      fontSize: 10,
      color:'#ffffff',
    },
    classItem: {
      flex:1,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      marginStart : 16,
      marginEnd : 16,
    },
    timelineContainer: {
      width: 30,
      alignItems: 'center',
    },
    timelineDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginBottom: 8,
    },
    timelineLine: {
      flex: 1,
      width: 2,
    },
    classContent: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 8,
    },
    classHours: {
      marginRight: 8,
      alignItems: 'flex-end',
    },
    startTime: {
      fontSize: 9,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    endTime: {
      fontSize: 9,
    },
    cardTitle: {
      fontSize: 11,
      marginBottom: 4,
    },
    cardDate: {
      fontSize: 10,
      color: '#cd1622',
      marginBottom: 8,
    },
    studentListContainer:{
      marginRight:10,
    },
    studentAvatar: {
      width: 30,
      height: 30,
      borderRadius: 15,
      marginLeft: -3,
      borderWidth:1,
      borderColor:'#fff'
    },
    container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // fond semi-transparent
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
    separator: {
      height: 1,
      backgroundColor: '#CCCCCC',
    },
    container: {
      paddingLeft: 1,
      paddingRight: 10,
      justifyContent : "center",
      paddingVertical: 10,
      flexDirection: 'row',
      alignItems: 'flex-start',
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
  
  })
export default ListInvoice