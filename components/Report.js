import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { TextInput, Button, ActivityIndicator, Text } from 'react-native-paper';
import * as SQLite from 'expo-sqlite';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import ModalReport from './ModalReport';
import { Ionicons } from '@expo/vector-icons';
import SelectDropdown from 'react-native-select-dropdown';

const { width } = Dimensions.get("screen");

const db = SQLite.openDatabaseSync('digitax.db');
const PAGE_SIZE = 3;

const COLORS = {
  primary: '#D32F2F',
  primar : '#dd5757',
  background: '#FFF5F5'
};
const dat_ = new Date()

const Report = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [Condition_, setCondition_] = useState(false);
  const [Date_, setDate_] = useState(false);
  const [DateN_, setDateN_] = useState(new Date());
  const [loading, setLoading] = useState(false);


  const onCloseReport = async (first = null) => {
    if(first){
      setDateN_(first)
      fetchData(1, first, true)
    }
    setDate_(false)
  }

  const fetchData = async (pageNumber = 1, date = new Date(), reset = false) => {
    setLoading(true);
  try{
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      
      const offset = (pageNumber - 1) * PAGE_SIZE;

      let query = search ?  `
        SELECT 
          u.id,
          u.name,
          u.numero,
          t.price
        FROM table_users u
        LEFT JOIN table_taxes t
          ON t.contribuantId = u.id
          AND t.createdAt BETWEEN ? AND ?
          WHERE u.numero IS NOT NULL
          AND u.numero LIKE ? ` 
      : `SELECT 
          u.id,
          u.name,
          u.numero,
          t.price
        FROM table_users u
        LEFT JOIN table_taxes t
          ON t.contribuantId = u.id
          AND t.createdAt BETWEEN ? AND ?
        WHERE u.numero IS NOT NULL `;

      if(Condition_)
        query += ` AND t.price ${ Condition_ } `

      query += search ? ` ORDER BY u.numero ASC LIMIT ? ` : ` ORDER BY u.numero ASC LIMIT ? OFFSET ? ` 
      
      const result = search ?
       await db.getAllAsync(query, [start.toISOString(), end.toISOString(), `%${search}%`, PAGE_SIZE])
      : await db.getAllAsync(query, [ start.toISOString(), end.toISOString(), PAGE_SIZE, offset])
      
      if (reset) {
        setData(result);
        setPage(2);
      } else {
        setData(prev => [...prev, ...result]);
        setPage(prev => prev + 1);
      }

      setLoading(false);
    }catch(error){
      Alert.alert("ERROR",error);
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchData(1, new Date(), true);
  }, [search]);

  const handlePrint = async () => {

    const drapeau = Asset.fromModule(require('../assets/rdc.jpg'))
    const logo = Asset.fromModule(require('../assets/icon.png'))
    
    let mount = data.reduce((sum, item) => {
        return sum + (item?.price || 0);
      }, 0);

    const html = `
      <html>
        <body>
          <div style="
            display: flex;
            align-items: center;
            border: 1px solid #ddd;
            padding: 10px;
          ">
            <div style="width: 10%; text-align: left;">
              <img src="${ drapeau?.uri }" alt="Drapeau" style="width: 95%;">
            </div>

            <div style="width: 80%;">
              <center>
                <div style="font-size : 24; font-weight : 800;">Republique Democratique du Congo</div>
                <div style="font-size : 20; font-weight : 800; color:${COLORS.primary}">DigiTax</div>
                <div style="font-size : 18; font-weight : 800;">Service National de Taxe</div>
                <div style="font-size : 18; font-weight : 800;  color:${COLORS.primary}">Commune de Lingwala</div>
                <div style="font-size : 18; font-weight : 800;  color:${COLORS.primar}">Tickets du ${ new Date(DateN_)?.toLocaleDateString("en-GB") }</div>
              </center>
            </div>

            <div style="width: 10%; text-align: right;">
              <img src="${ logo?.uri }" alt="Logo" style="width: 98%;">
            </div>

          </div>
          <center>
            <table style="width:98%; margin-top : 10px; border-collapse: collapse;">
              <tr style="background:${COLORS.primary}; color:white;">
                <th style="width : 8%; border: 1px solid #ddd2d2;">Num</th>
                <th style="width : 45%; border: 1px solid #ddd2d2;">Nom</th>
                <th style="width : 25%; border: 1px solid #ddd2d2;">N° Stand</th>
                <th style="width : 20%; border: 1px solid #ddd2d2;">Montant</th>
              </tr>
              ${data.map((item, index) => `
                <tr>
                  <td style="width : 8%; border: 1px solid #ddd2d2;"> ${index+1}</td>
                  <td style="width : 45%; border: 1px solid #ddd2d2;"> ${item?.name}</td>
                  <td style="width : 25%; border: 1px solid #ddd2d2;"> ${item?.numero || ''}</td>
                  <td style="width : 20%; border: 1px solid #ddd2d2;"> ${item?.price || ''}${ item?.price > 0 ? 'FC' : ''}</td>
                </tr>
              `).join('')}
              <tr>
                <td style="width : 8%; border: 1px solid #ddd2d2; font-weight : '700';"></td>
                <td style="width : 45%; border: 1px solid #ddd2d2; font-weight : '700';">Total</td>
                <td style="width : 25%; border: 1px solid #ddd2d2; font-weight : '700';"></td>
                <td style="width : 20%; border: 1px solid #ddd2d2; font-weight : '700';">${ mount?.toLocaleString() }FC</td>
              </tr>
            </table>
          </center>
        </body>
      </html>
    `;

    await Print.printAsync({ html });
  };

  const loadMore = () => fetchData(page, DateN_);

  const Footer = () => {
    let mount = data.reduce((sum, item) => {
        return sum + (item?.price || 0);
      }, 0);

    return(
      <View style={styles.footer}>

  <     View style={{ ...styles.headerRow, backgroundColor : 'white'}}>
          <Text style={{ ...styles.headerText, color : 'dark'}}></Text>
          <Text style={{ ...styles.headerText, color : 'dark'}}>Total</Text>
          <Text style={{ ...styles.headerText, color : 'dark'}}>{ mount?.toString()}FC</Text>
        </View>

        {loading && <ActivityIndicator style={{ marginVertical: 10 }} />}

        <View style={styles.actionRow}>
          <Button mode="outlined" buttonColor={ COLORS.background } labelStyle={{ color : "black"}} onPress={() => fetchData(1, DateN_, true)}>
            Précédent
          </Button>

          <Button mode="contained" buttonColor={ COLORS.primary } onPress={handlePrint}>
            Imprimer
          </Button>

          <Button mode="outlined" buttonColor={ COLORS.background } labelStyle={{ color : "black"}} onPress={loadMore}>
            Suivant
          </Button>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
        <TextInput
          label="N° Stand"
          value={search}
          onChangeText={setSearch}
          mode="outlined"
          style={styles.input}
          activeOutlineColor="rgb(220, 0, 0)"
          right={
            <TextInput.Icon
              icon={ "magnify"}
              color={"red"}
              size={20}
            />
          }        
        />
        <View>
          <SelectDropdown
              data={ [{ id : 1, label : 'Montant' }, { id : ' IS NOT NULL ', label : ' > 0'}, { id : ' IS NULL ', label : ' = 0'}] }
              onSelect={ async(selectedItem, index) => {
                if(selectedItem.id == 1)
                  setCondition_(false)
                else
                  setCondition_(selectedItem.id)
                fetchData(0, DateN_, true)
              }}

              defaultButtonText={" Montant " }
              buttonTextStyle={{ color : "rgba(0, 0, 11, 1), 1)", fontSize : 11 }}
              buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem.label
              }}
              rowTextForSelection={(item, index) => {
                  return item?.label
              }}
              buttonStyle={{ display : 'flex', width: (width * 20)/100, height : 30, backgroundColor : "white", borderWidth : 1, borderRadius:10, borderColor : 'red'}}
          />
        </View>
        <TouchableOpacity style={{   display : 'flex', marginTop : 5  }} onPress={ () => { setDate_(!Date_) }}>
          <Text style={{ color : "white", fontWeight : "700", backgroundColor : 'rgb(224, 55, 55)', padding : 8, borderRadius : 10}}>{ new Date(DateN_)?.toLocaleDateString("en-GB")}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.headerRow}>
        <Text style={styles.headerText}>Nom</Text>
        <Text style={styles.headerText}>N° Stand</Text>
        <Text style={styles.headerText}>Montant</Text>
      </View>

      {/* LIST */}
      <FlatList
        data={data?.length > 1 ? data : []}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.cell}>{item?.name}</Text>
            <Text style={styles.cell}>{item?.numero}</Text>
            <Text style={styles.cell}>{item?.price}{ item?.price > 0 ? 'FC' : ''}</Text>
          </View>
        )}
        // onEndReached={loadMore}
        // onEndReachedThreshold={0.5}
        ListFooterComponent={Footer}
        refreshControl={ <RefreshControl refreshing={ loading } onRefresh={ () =>  loadMore() } colors={["rgb(244, 53, 53)", "orange", "black", "red", "green"]} style={{ zIndex : 10000  }} /> }
      />

      <ModalReport modalRefReport={Date_} onCloseReport={onCloseReport} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: COLORS.background
  },
  input: {
    marginBottom: 10,
    height : 35,
    width : '48%'
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    padding: 10
  },
  headerText: {
    flex: 1,
    color: 'white',
    fontWeight: 'bold'
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: '#ddd'
  },
  cell: {
    flex: 1
  },
  footer: {
    marginTop: 10,
    marginBottom : 150,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});


export default Report