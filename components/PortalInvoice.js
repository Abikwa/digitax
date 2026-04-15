import React, { useState } from "react";
import { Modalize } from "react-native-modalize";
import { Dimensions, View, StyleSheet, Text, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const { height, width } = Dimensions.get("screen");
const modalHeight = height >= 800 ? height * 0.3 : height >= 800 ? height * 0.4 : height * 0.5;

const PortalInvoice = ({ item, setVisible, visible}) => {

    return(
        <Portal>
            <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={styles.DigModal}>

            {item && (
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
                    <View><Text style={{ fontSize : 12, fontWeight : "800"}}>{item?.stand}</Text></View>
                    </View>
                    <View>
                    <MaterialIcons name="storefront" size={24} color="black" />
                    </View>
                </View>

                <View style={styles.DigActions}>
                    <View>
                    <View><Text style={{ fontSize: 12 }}>Contribuable </Text></View>
                    <View><Text style={{ fontSize : 12, fontWeight : "800"}}>{item?.responsable}</Text></View>
                    </View>
                    <View>
                    <MaterialIcons name="person" size={24} color="black" />
                    </View>
                </View>
                
                <View style={styles.DigActions}>
                    <View>
                    <View><Text style={{ fontSize: 12 }}>Date </Text></View>
                    <View><Text style={{ fontSize : 12, fontWeight : "800"}}>{ new Date(item?.date)?.toLocaleDateString("en-GB")} _ {new Date(item?.date)?.getHours()}h:{new Date(item?.date)?.getMinutes()}</Text></View>
                    </View>
                    <View>
                    <MaterialIcons name="event" size={24} color="black" />
                    </View>
                </View>

                <View style={styles.DigActions}>
                    <View>
                    <View><Text style={{ fontSize: 12 }}>Réf </Text></View>
                    <View><Text style={{ fontSize : 12, fontWeight : "800"}}>{item?.id?.toUpperCase()?.slice(0, 13)}</Text></View>
                    </View>
                    <View>
                    <MaterialIcons name="fingerprint" size={24} color="black" />
                    </View>
                </View>

                <View style={styles.DigLine} />

                {/* QR CODE */}
                <View style={{...styles.DigActions, width : "80%"}}>
                    <View style={styles.DigQr}>
                    <QRCode value={item?.stand} size={80} />
                    </View>
                    <View>
                    <Text style={{ fontWeight : "900", padding : 0}}>Montant</Text>
                    <Text style={{ fontWeight : "900", fontSize : 50, color : 'red', padding : 0}}>{ item?.montant }<Text style={{ fontSize : 12, fontWeight : "400"}}>FC</Text></Text>
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
        
    )
}

export default PortalInvoice

const style_s = StyleSheet.create({
    content: {
      flex: 1,
      paddingHorizontal: 20,
      paddingVertical: 15,
      backgroundColor: "#eee",
    },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // fond semi-transparent
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    height : 200,
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
  });