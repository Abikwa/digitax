import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { TextInput, Button, ActivityIndicator, Text } from 'react-native-paper';
import * as SQLite from 'expo-sqlite';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

const db = SQLite.openDatabaseSync('digitax.db');
const PAGE_SIZE = 3;

const COLORS = {
  primary: '#D32F2F',
  primar : '#dd5757',
  background: '#FFF5F5'
};

const Report = () => {
  let dat = new Date()
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [Date, setDate] = useState(dat);
  const [loading, setLoading] = useState(false);

  const fetchData = async (pageNumber = 1, reset = false ) => {
    if (loading) return;
    setLoading(true);

    const offset = (pageNumber - 1) * PAGE_SIZE;

    const query = `
      SELECT 
        u.id,
        u.name,
        u.numero,
        t.price
      FROM table_users u
      LEFT JOIN table_taxes t
        ON t.contribuantId = u.id
        AND u.numero LIKE ?
        AND DATE(t.createdAt) = DATE(?)
      ORDER BY u.numero ASC
      LIMIT ? OFFSET ?
    `;

    const result = await db.getAllAsync(query, [`%${search}%`, Date, PAGE_SIZE, offset]);

    if (reset) {
      setData(result);
      setPage(2);
    } else {
      setData(prev => [...prev, ...result]);
      setPage(prev => prev + 1);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData(1, true);
  }, [search]);

  const handlePrint = async () => {

    const drapeau = Asset.fromModule(require('../assets/rdc.jpg'))
    const logo = Asset.fromModule(require('../assets/icon.png'))
    
    let mount = data.reduce((sum, item) => {
        return sum + (item.price || 0);
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
              </center>
            </div>

            <div style="width: 10%; text-align: right;">
              <img src="${ logo?.uri }" alt="Logo" style="width: 98%;">
            </div>

          </div>
          <center>
            <table style="width:98%; margin-top : 10px; border-collapse: collapse;">
              <tr style="background:${COLORS.primary}; color:white">
                <th style="width : 8%; border: 1px solid #4b3737;">Num</th>
                <th style="width : 45%; border: 1px solid #4b3737;">Nom</th>
                <th style="width : 25%; border: 1px solid #4b3737;">N° Stand</th>
                <th style="width : 20%; border: 1px solid #4b3737;">Prix</th>
              </tr>
              ${data.map((item, index) => `
                <tr>
                  <td style="width : 8%; border: 1px solid #4b3737;"> ${index+1}</td>
                  <td style="width : 45%; border: 1px solid #4b3737;"> ${item.name}</td>
                  <td style="width : 25%; border: 1px solid #4b3737;"> ${item.numero || ''}</td>
                  <td style="width : 20%; border: 1px solid #4b3737;"> ${item.price || ''}${ item.price > 0 ? 'FC' : ''}</td>
                </tr>
              `).join('')}
              <tr style="color:white">
                <th style="width : 8%; border: 1px solid #4b3737;"></th>
                <th style="width : 45%; border: 1px solid #4b3737;">Total</th>
                <th style="width : 25%; border: 1px solid #4b3737;"></th>
                <th style="width : 20%; border: 1px solid #4b3737;">${ mount?.toLocaleString() }FC</th>
              </tr>
            </table>
          </center>
        </body>
      </html>
    `;

    await Print.printAsync({ html });
  };

  const loadMore = () => fetchData(page);

  const Footer = () => {
    let mount = data.reduce((sum, item) => {
        return sum + (item.price || 0);
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
          <Button mode="outlined" buttonColor={ COLORS.background } labelStyle={{ color : "black"}} onPress={() => fetchData(1, true)}>
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
        <TextInput
          label="YYY-MM-DD"
          value={search}
          onChangeText={setDate}
          mode="outlined"
          style={styles.input}
          activeOutlineColor="rgb(220, 0, 0)"
          value={Date}
          right={
            <TextInput.Icon
              icon={ "magnify"}
              color={"red"}
              size={20}
            />
          }        
        />
      </View>

      <View style={styles.headerRow}>
        <Text style={styles.headerText}>Nom</Text>
        <Text style={styles.headerText}>N° Stand</Text>
        <Text style={styles.headerText}>Prix</Text>
      </View>

      {/* LIST */}
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.cell}>{item.name}</Text>
            <Text style={styles.cell}>{item.numero}</Text>
            <Text style={styles.cell}>{item.price}{ item.price > 0 ? 'FC' : ''}</Text>
          </View>
        )}
        // onEndReached={loadMore}
        // onEndReachedThreshold={0.5}
        ListFooterComponent={Footer}
        refreshControl={ <RefreshControl refreshing={ loading } onRefresh={ () =>  loadMore() } colors={["rgb(244, 53, 53)", "orange", "black", "red", "green"]} style={{ zIndex : 10000  }} /> }
      />

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
    width : '45%'
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