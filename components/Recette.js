import {  ActivityIndicator, Alert, Dimensions, FlatList, Image, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import { TextInput } from "react-native-paper";
import Styles from "./Styles";

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import ListInvoice from "./ListInvoice";
import { Ionicons } from "@expo/vector-icons";
import ModalReport from "./ModalReport";
import * as SQLite from 'expo-sqlite'

const { width } = Dimensions.get("screen");
const imagWidth = (((width)) / 1.1);
let list = ['#f1f8ff', 'rgb(220, 220, 220)', 'rgb(0, 238, 0)', 'rgb(238, 238, 0)', "white", "rgb(5, 100, 20)"]
    
const Recette = () => {

  const navigation = useNavigation();
  let DateToDay = new Date()
  let today = DateToDay.getDate() < 10 ? "0" + DateToDay.getDate() : DateToDay.getDate()
  let dayMonth = DateToDay.getMonth() < 9 ? "0" + (DateToDay.getMonth() + 1) : (DateToDay.getMonth() + 1)
  const weekday = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];
  const Months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octombre", "Novembre", "Décembre"]
   
  const [ SaveLoading, setSaveLoading ] = useState(false);
  const [ SaveLoadingR, setSaveLoadingR ] = useState(false);
  const [ Recettes, setRecettes ] = useState([]);
  const [ClickItem, setClickItem] = useState(false);
  const [ AddedP, setAddedP ] = useState(null);
  const [ DeletedP, setDeletedP ] = useState(null);
  const [SearchData, setSearchData] = useState("");
  const [Date_, setDate_] = useState(false);

  const onCloseReport = async (first = null) => {
    if(first)
      getRecettes(first)
    setDate_(false)
  }

  const getSearchInvoice = async() => {
    try{
      setSaveLoadingR(true)
      let firstDate =   new Date() 
      firstDate.setDate(firstDate.getDate() + 1)

      let token = await AsyncStorage.getItem('token')
      let api_Url = await AsyncStorage.getItem("api_Url")
      let params = {
        method: 'GET',
        headers: {
          'Accept':'*/*',
          'x-country':'CD',
          'Authorization':'Bearer ' + token,
          'Content-Type':'application/json'
        },
      };


      await fetch(`https://${ api_Url }/schoolfee/$student.user.last_name$/${ encodeURI(SearchData) }`, params) 
      .then(response => {
        const statusCode = response.status;
        const data = response.json();
        return Promise.all([statusCode, data]);
      })
      .then( async([status, result]) => {
        
        Alert.alert('Resultat', result?.length + ' données trouvées pour ' + SearchData)
        if(status == 200){
          let dataArray = Recettes
          let index = dataArray.findIndex(purchase => purchase.id == firstDate?.toLocaleDateString("en-GB"))
            if( index  >= 0 )
              dataArray[index].data = result
            else{
              dataArray = [{
                id : firstDate?.toLocaleDateString("en-GB"),
                date : null,
                data : result
              }, ...Recettes]
            }
            // setSearchData('')
            setRecettes(dataArray)
        }
        else if(status == 400 || result == null || result.data?.length == 0)
          Alert.alert('404', 'Aucun resultat')
        else
          alert(result)
        setSaveLoading(false)
        setSaveLoadingR(false)
      }).catch((error) =>{
        setSaveLoading(false)
        setSaveLoadingR(false)
        alert(error)
      })
    }catch(error){
      alert(error)
    }
  }
    const getRecettes =  async(first = null) => {
        try {
          setSaveLoading(true)
          
          const firstDate = first ? new Date(first) : new Date(DateToDay.getFullYear()+"-"+dayMonth+"-"+today)
          
          const start = new Date(firstDate);
          start.setHours(0,0,0,0);

          const end = new Date(firstDate);
          end.setHours(23,59,59,999);

          const DB_SQL = await SQLite.openDatabaseAsync("digitax.db", { useNewConnection: true });
          
          if(DB_SQL){
            const result = await DB_SQL.getAllAsync(
              `SELECT 
                table_taxes.id,
                table_taxes.price,
                table_taxes.createdAt,
                table_taxes.status,
                table_taxes.numero,
                table_taxes.contribuantId,
                table_users.name
              FROM table_taxes
              INNER JOIN table_users 
              ON table_taxes.contribuantId = table_users.id
              WHERE table_taxes.createdAt BETWEEN ? AND ? 
              ORDER BY table_taxes.createdAt DESC`,
              [start.toISOString(), end.toISOString()]
            );
            
            let dataArray = Recettes
            let index = dataArray.findIndex(purchase => purchase.id == firstDate?.toLocaleDateString("en-GB"))
              if( index  >= 0 )
                dataArray[index].data = result
              else{
                dataArray.push({
                  id : firstDate?.toLocaleDateString("en-GB"),
                  date : firstDate,
                  data : result
                })
              }
              setRecettes(dataArray)
              setSaveLoading(false)
              setSaveLoadingR(false)
          }
        } catch (error) {
          setSaveLoading(false)
          setSaveLoadingR(false)
          alert(error);
          
        }
      };
      
      useEffect(() => {
        setClickItem(DateToDay.getFullYear()+"-"+dayMonth+"-"+today)
        getRecettes()
      }, [])

      const renderItem = ({ item }) => {

        let date = new Date(item.date), verfyDate = new Date(item.date), jour = "", day = "", month = ""
        verfyDate = verfyDate.getDate()+""+verfyDate.getMonth()+""+verfyDate.getFullYear()
        let mount = 0;
         
        date = date.setDate(date.getDate() - 1);
        date = new Date(date)
        jour = weekday[date.getDay()];
        day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
        month = date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)
      
        mount = 0
        item.data?.map((val_) =>(
          mount += parseFloat(val_.price || 0)
        ))
        let valprice =
          (mount > 0) ?
            (
              <View>
                <Text style={{ fontSize : 14, fontWeight : '700', color : 'rgb(0, 0, 60)'}}>
                  { mount?.toFixed(2)?.toLocaleString() }FC
                </Text>
              </View>
            ) : <View></View>
        

        return(
            <View style={{ marginEnd : 5}}>
              { verfyDate == DateToDay.getDate()+""+DateToDay.getMonth()+""+DateToDay.getFullYear() ?  <View><TouchableOpacity onPress={ () => getRecettes()}><Text style={{ fontWeight : "700", margin : 30, fontSize : 12, color : 'rgb(235, 15, 15)'  }}>Aujourd'hui </Text></TouchableOpacity></View> : <Text></Text>}
              <View  style={{ ...Styles.container, padding : 2 }}>
                 {
                  item?.data?.sort((a, b) => a.createdAt > b.createdAt ? -1 : 1)?.map((val) =>(
                    <ListInvoice item={val} key={val.id+"ee"} DeletedP={ DeletedP } />
                  ))
                 }
              </View>
              <View>
                
                <View style={{ alignSelf: "center"}}>
                  { valprice }
                </View>
                  
              </View>
              {
                SaveLoading && ClickItem == verfyDate ?
                  <View style={{flex:1}}>
                    <View style={{ alignSelf: "center"}}>
                      <ActivityIndicator size={"large"} color={"red"} />
                      </View>
                    </View>
                  :
                  <TouchableOpacity onPress={ () => getDepotData(date.getFullYear()+"-"+month+"-"+day, verfyDate)}><Text style={{ fontWeight : "700", color : "rgb(180, 0, 48)", margin : 30, fontSize : 12 }}> { item.date ?  jour + " le " + day + " "+ Months[date.getMonth()] + " " + date.getFullYear() : '' }</Text></TouchableOpacity>
              }
            </View>
        )
      }

      const getDepotData = (date, val) => {
        setClickItem(val)
        if(!SaveLoadingR)
        getRecettes(date)
      }

      const getLoading = () => {
        setSaveLoading(true)
        getDepotData()
      }

       return(
        <View  style={{ ...Styles.container,  backgroundColor : "rgb(240, 240, 204)" }}>
      
          <View style={{ backgroundColor: '#eed', zIndex : 2, position : "absolute", overflow : "hidden",  left: 5, right: 5, top : 2, borderRadius : 13 }}>
            
          <View style={{ display : "flex", flexDirection : "row", justifyContent : "flex-start", padding : 5}}>
            
            <TextInput  
              label='N° STAND OU PLAQUE' 
              mode="outlined"
              left={<TextInput.Icon icon="file" color={"red"} size={15} />}
              activeOutlineColor="rgb(244, 53, 53)"
              outlineColor="#ccc"
              style={{  width : (width * 70)/100, backgroundColor : "rgb(254, 254, 254)", height : 40, fontSize : 13, borderColor : "#ccc", borderRadius : 13  }} 
              defaultValue={ SearchData }
              onChangeText={ async (val) => { 
                setSearchData(val);
              }} />
               
              <TouchableOpacity style={{ ...Styles.addButton_,  }} onPress={ () => { getSearchInvoice() }}>
                <Text style={{ ...Styles.addButtonText, fontSize : 12, padding : 10 }}>Rechercher</Text>
              </TouchableOpacity>
            
          </View>
          
              
          </View>
          <Text style={{ fontSize : 8, color : 'blue'}}>{ SaveLoading ? 'Loading ...' : ''}</Text>
            
            <FlatList
              data={ Recettes  }
              renderItem={renderItem}
              keyExtractor={(item) => item.id+Math.random()+"1"}
              style={{ paddingTop : 50, paddingBottom : 100, marginBottom : 45}}
              ListFooterComponent={() => { return( <Text>.</Text>)}}
              ListFooterComponentStyle={{ paddingBottom : 250 }}
              refreshControl={ <RefreshControl refreshing={ SaveLoading || SaveLoadingR } onRefresh={ () =>  getLoading() } colors={["rgb(244, 53, 53)", "orange", "black", "red", "green"]} style={{ zIndex : 10000  }} /> }
            />
          
          <View style={{ display : 'flex', flexDirection : "row", justifyContent : "flex-end"}}>
            
            <TouchableOpacity style={{ ...Styles.addButton, display : 'flex'  }} onPress={ () => { setDate_(!Date_) }}>
              <Ionicons
                name={"calendar-outline"}
                size={40}
                color={ 'white'}
              />
            </TouchableOpacity>
          </View>

          <ModalReport modalRefReport={Date_} onCloseReport={onCloseReport} />
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
    }
  })

export default Recette