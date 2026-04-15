//import liraries
import React, {  useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl  } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native';
 
const ReportMember = () => {

  //variables

  const [tableDisplay, SettableDisplay] = useState([])
  const [tableCours, SettableCours] = useState([])
  const [HoraireLoarding, setHoraireLoarding] = useState(false);

  const onRefreshHoraire = async () => {
    await getCoursData()
  }

  //Get data Schedule && cours
  const getCoursData = async () => {
    try {
      let token = await AsyncStorage.getItem("token")
      let server = await AsyncStorage.getItem("server")
      let staffId = await AsyncStorage.getItem("staffId")
      const api_Url = await AsyncStorage.getItem('api_Url')
      let params = {
        method: 'GET',
        headers: {
          'Accept':'*/*',
          'x-country':'CD',
          'Authorization':'Bearer ' + token,
          'Content-Type':'application/json'
        },
      };

      setHoraireLoarding(true)

      await fetch(`https://${ api_Url }/sectionclasselessons/staff/${ staffId }`, params) 
        .then(response => response.json())
        .then( async(result) => {
          SettableCours(result)
          setHoraireLoarding(false)
        }).catch((error) =>{
          setHoraireLoarding(false)
          alert(error)
        })
      } catch (error) {
        setHoraireLoarding(false)
        alert(error);
      }
  };

  const addDisplay = (val) => {
    if(tableDisplay.filter(va => va == val)?.length == 0)
      tableDisplay.push(val)
  }
    //construct get Data
    useEffect(() => {
      // getCoursData()
   }, [])

  //fiche data
    //display Horaire
    const renderFiche_= ({ item }) => {
      
      return(
        <View  style={{ marginTop : 30, margin : 5, marginBottom : 50 }}>
          <View style={styles.headerContainer}>
            <View style={styles.coverPhoto} />
            <View style={styles.profileContainer}>
              <View style={ styles.profilePhoto }>
                <Text style={styles.nameText}>{ item.class?.short_entitled_class }{ item?.title } </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statContainer}>
              <TouchableOpacity><Text style={styles.statCount}>{ item.section?.entitled_section }</Text></TouchableOpacity>
            </View>
          </View>

          {
            item.sectionclasselessons.map((val) =>{
              return(
                <FicheData_ item={val} key={val.id} />
              )
            })
          }
        </View>
      )
    }
    
  //retun screen view
  return (
    <View style={styles.containerHoraire}>
        <Text>,,,,,,</Text>
        <FlatList
          data={ tableCours?.sort((a, b) => a.class?.short_entitled_class < b.class?.short_entitled_class ? -1 : 1 ) }
          renderItem={renderFiche_}
          key={(item) => item.id +"cours_"}
          ListFooterComponent={() => { return<View style={{ paddingBottom : 200}} />}}
          style={{ paddingBottom : 300 }}
          refreshControl={ <RefreshControl  refreshing={HoraireLoarding}  onRefresh={ () =>  onRefreshHoraire() } colors={["rgb(0, 0, 90)", "orange", "black", "red", "green"]}  /> }
      />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  containerHoraire: {
    flex: 1,
    paddingLeft: 5,
    backgroundColor: 'rgb(240, 240, 240)',
  },
  head: {  height: 40,  backgroundColor: '#f1f8ff'  },
  wrapper: { flexDirection: 'row' },
  title: { flex: 1, backgroundColor: '#f6f8fa' },
  row: {  height: 28},
  text: { textAlign: 'center', fontSize : 12 },

  headerContainer: {
    alignItems: 'center',
  },
  coverPhoto: {
    width: '100%',
    height: 100,
    backgroundColor : 'rgb(0, 100, 180)'
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: -50,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 100,
    padding  : 25,
    backgroundColor : 'rgb(230, 230, 230)'
  },
  nameText: {
    fontSize: 13,
    textAlign : 'center',
    fontWeight: 'bold',
    marginTop: 10,
  },
  bioContainer: {
    padding: 15,
  },
  bioText: {
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  statContainer: {
    alignItems: 'center',
    flex: 1,
  },
  statCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color : 'rgb(0, 0, 120)'
  },
  statLabel: {
    fontSize: 10,
    color: '#999',
  },
  button: {
    backgroundColor: '#0066cc',
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 20,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },

})

export default ReportMember