import React, { useState } from "react";
import { Modalize } from "react-native-modalize";
import { Dimensions, View, StyleSheet, Text, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const { height, width } = Dimensions.get("screen");
const modalHeight = height >= 800 ? height * 0.3 : height >= 800 ? height * 0.4 : height * 0.5;

const ModalReport = ({ modalRefReport, onCloseReport, count = 0}) => {

    const [ First, setFirst ] = useState(new Date());
    const [ Last, setLast ] = useState(new Date());
    const [ Save, setSave ] = useState(false);
    const [ ErrorFrom, setErrorFrom ] = useState("");
    const [isDateFirst, setDateFirst] = useState(false);
    const [isDateLast, setDateLast] = useState(false);

    const GetReport = async () => {
        setErrorFrom("")
        setSave(true)
        if(First){
            setSave(false)
            onCloseReport(First, Last+" 23:59")
        }else{
            setSave(false)
            setErrorFrom("Date debut svp")
        }
    }

    const handleConfirmFirst = (first) => {
        let firstDate = new Date(first)
        let day = firstDate.getDate() < 10 ? "0" + firstDate.getDate() : firstDate.getDate()
        let month = firstDate.getMonth() < 9 ? "0" + (firstDate.getMonth() + 1) : (firstDate.getMonth() + 1)
        firstDate = firstDate.getFullYear() +"-"+ month + "-" + day
        setFirst(firstDate)
        setDateFirst(false)
    }
    const handleConfirmLast = (last) => {
        let lastDate = new Date(last)
        let day = lastDate.getDate() < 10 ? "0" + lastDate.getDate() : lastDate.getDate()
        let month = lastDate.getMonth() < 9 ? "0" + (lastDate.getMonth() + 1) : (lastDate.getMonth() + 1)
        lastDate = lastDate.getFullYear() +"-"+ month + "-" + day
        setLast(lastDate)
        setDateLast(false)
    }

    return(
        <Modal
            visible={modalRefReport}
            animationType="slide" // "none" | "slide" | "fade"
            transparent={true}    // met un fond transparent
            onRequestClose={() => onCloseReport(null)} // obligatoire sur Android
        >
            <View style={style_s.modalOverlay}>
                <View style={style_s.modalContent}>
                    <View style={style_s.content}>
                        <View style={style_s.content}>
                             

                            <Text style={{  color : "red" }}>{ ErrorFrom } </Text>
                

                            <DateTimePickerModal
                                isVisible={isDateFirst}
                                mode="fist"
                                date={First ? new Date(First) : new Date()}
                                onConfirm={handleConfirmFirst}
                                onCancel={ () => setDateFirst(false)}
                            />

                            <DateTimePickerModal
                                isVisible={isDateLast}
                                mode="last"
                                date={Last ? new Date(Last) : new Date()}
                                onConfirm={ handleConfirmLast }
                                onCancel={ () => setDateLast(false)}
                            />
                            
                
                            <View style={{ flexDirection:"row", flex:1, justifyContent:"center", paddingBottom : 50 }}>
                                <TouchableOpacity  onPress={  () => setDateFirst(true)  }><Text style={{ width : width / 2.18, overflow : "hidden", height:40, fontSize : 18, borderWidth : 1, borderColor : "#ccc", paddingVertical : 5, paddingHorizontal : 10, borderRadius : 8 }} numberOfLines={1} > { First ? new Date(First)?.toLocaleDateString("en-GB") : "-/-/-" }</Text></TouchableOpacity>
                                <TouchableOpacity  onPress={  () => setDateLast(true)  }  style={{ display : count == 1 ? 'flex' : 'none'}}><Text style={{ width : width / 2.18, overflow : "hidden", height:40, fontSize : 18, borderWidth : 1, borderColor : "#ccc", paddingVertical : 5, paddingHorizontal : 10, borderRadius : 8, marginStart : 5 }} numberOfLines={1} > { Last ? new Date(Last)?.toLocaleDateString("en-GB") : "-/-/-" }</Text></TouchableOpacity>
                            </View>
                            {
                                Save ? <ActivityIndicator color={"red"} size={"large"} /> :
                                    <TouchableOpacity  onPress={  () => GetReport()  }>
                                        <View>
                                            <Text style={{ backgroundColor: 'rgb(244, 53, 53)', padding: 4, borderRadius : 25, marginTop : 20, color: 'white', fontWeight : "400", fontSize : 13,  textAlign: 'center' }}>
                                                { 'Afficher'}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                }

                            
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
        
    )
}

export default ModalReport

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