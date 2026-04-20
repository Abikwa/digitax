import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
  Dimensions,
  RefreshControl,
  Alert
} from "react-native";
import { TextInput } from "react-native-paper";
import * as SQLite from 'expo-sqlite'
import { Text, Avatar } from "react-native-paper";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const screenHeight = Dimensions.get("window").height;

/* ================= APP ================= */

const FicheMember = () => {
  const [selected, setSelected] = useState(null);
  const [visible, setVisible] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [Add, setAdd] = useState(false);
  const [Numero, setNumero] = useState("");
  const [search, setSearch] = useState("");
  const [Users, setUsers] = useState([]);
  const [Taxes, setTaxes] = useState([]);


  const openModal = async(item) => {
    setSelected(item);
    
    const DB_SQL = await SQLite.openDatabaseAsync("digitax.db", { useNewConnection: true });
    
    const result = await DB_SQL.getAllAsync(
      `SELECT id, price, numero, createdAt FROM table_taxes WHERE contribuantId = ? LIMIT 20`,
      [item.id]
    );
    setTaxes(result)
    setVisible(true);
  };

  const getUsers = async() => {
    setLoading(true)
    setAdd(false)
    const DB_SQL = await SQLite.openDatabaseAsync("digitax.db", { useNewConnection: true });

    const id = await AsyncStorage.getItem("Id")
    const result = await DB_SQL.getAllAsync(
      `SELECT id, name, numero, updatedAt FROM table_users WHERE id != ?  AND numero IS NOT NULL LIMIT 50`,
      [id]
    );
    setUsers(result)
    setLoading(false)
  };

  const getUsers_ = async(val) => {
    
    setSearch(val)
    if(val?.length % 2 == 0){
      // setLoading(true)
      const DB_SQL = await SQLite.openDatabaseAsync("digitax.db", { useNewConnection: true });
      const id = await AsyncStorage.getItem("Id")
      const result = await DB_SQL.getAllAsync(
        `SELECT id, name, numero, updatedAt FROM table_users WHERE id != ? AND numero LIKE ? AND name IS NOT NULL LIMIT 50 ORDER BY name ASC`,
        [id, `%${val}%`]
      );
      setUsers(result)
      setLoading(false)
    }
  }

    const saveData = async() => {
      const date = new Date().toLocaleString();

      if(Numero?.length > 1){

        try{
          const DB_SQL = await SQLite.openDatabaseAsync("digitax.db", { useNewConnection: true });
          
          const id = uuidv4()
          const date = new Date().toISOString();
          const contr = await DB_SQL.getFirstAsync(
              `SELECT id, name FROM table_users 
              WHERE numero = ?`,
              [Numero]
            );

          let newUser = {}

          if(contr){
            setNumero("");
            await DB_SQL.runAsync(`UPDATE table_users SET updatedAt = ? WHERE id = ?`, 
              [new Date()?.toISOString(), contr.id]
            );
            newUser = {
              id: contr.id,
              name: contr.name,
              numero: Numero?.toUpperCase(),
              updatedAt : new Date()?.toISOString()
            };
          }
          else{
            const Id_ = uuidv4()
            await DB_SQL.runAsync(`INSERT OR REPLACE INTO table_users 
              (id, name, numero, createdAt, updatedAt)
              values (?, ?, ?, ?, ? )`, 
              Id_, Numero, Numero?.toUpperCase(), new Date()?.toISOString(), new Date()?.toISOString()
            );
            newUser = {
              id: Id_,
              name: Numero,
              numero: Numero?.toUpperCase(),
              updatedAt : new Date()?.toISOString()
            };
          }

          setUsers((prev) => [newUser, ...prev]);
          
          setAdd(false)
          setNumero("");
        }catch(err){
          console.log(err);
          Alert.alert('Error', err);          
        }
      }else
        Alert.alert("ERROR", 'Stand ou Plaque, Minimum 2 caractères requis')
    };

  const filtered = Users.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    getUsers()
  }, [])
  
  /* ================= TAX ITEM (NEW DESIGN) ================= */

  const renderTax = ({ item }) => (
    <View style={styles.taxCard}>

      {/* LEFT: REF */}
      <View style={styles.taxLeft}>
        <Text style={styles.taxRef}>{item.id?.slice(0, 8)?.toUpperCase()}</Text>
        <Text style={styles.taxMeta}>
          Stand _ Plaque  •• <Text style={{ fontWeight : '900'}}>{item.numero}</Text>
        </Text>
      </View>

      {/* RIGHT: AMOUNT */}
      <View style={styles.taxRight}>
        <Text style={styles.amount}>{item.price} <Text style={styles.fc}>FC</Text></Text>
        <Text style={styles.fc}>{ new Date(item.createdAt)?.toLocaleDateString("en-GB")} _ { new Date(item.createdAt)?.getHours()}h:{ new Date(item.createdAt)?.getMinutes()}</Text>
      </View>

    </View>
  );

  /* ================= LIST ITEM ================= */
  const renderItem = ({ item }) => {
    // const total = item.taxes.reduce((s, t) => s + t.montant, 0);

    return (
      <TouchableOpacity
        style={styles.card}
        onLongPress={() => openModal(item)}
      >

        <Avatar.Text
          size={46}
          label={item.name.charAt(0)}
          style={styles.avatar}
        />

        <View style={{ flex: 1, marginStart : 2 }}>
          <Text style={styles.name}>{item.name} <Text style={{ color : 'rgb(222, 82, 82)', fontSize : 11, fontWeight : '700'}}>{ item.numero }</Text> </Text>
          <Text style={styles.sub}>
            Dernière opération • { new Date()?.toLocaleDateString("en-GB")}
          </Text>
        </View>

        <MaterialIcons name="chevron-right" size={22} color="#bbb" />

      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>

      {/* ================= SEARCH (COMPACT) ================= */}
      <View style={{ flexDirection: "row", alignItems: "center", display : Add ? 'none' : 'flex' }}>
        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={18} color="#888" />
          <TextInput
            placeholder="Rechercher..."
            placeholderTextColor="#999"
            // value={search}
            onChangeText={(v) => getUsers_(v)}
            style={styles.searchInput}
          />
        </View>
        <View style={{ flexDirection: "row", alignItems : "center", paddingStart : 10}}>
          <TouchableOpacity onPress={() => setAdd(!Add) }><Text><Ionicons name="add-circle" size={30} color={'red'} /></Text></TouchableOpacity>
        </View>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", display : Add ? 'flex' : 'none', marginBottom : 10 }}>
        <View style={{ width : '70%' }}>
          <TextInput
            label="N° Stand Plaque"
            mode="outlined"
            style={{ overflow : "hidden", height : 40, backgroundColor : 'white'}} 
            onChangeText={ setNumero }
            left={<TextInput.Icon icon="storefront" color={"red"} size={15} />}
            activeOutlineColor="rgb(220, 73, 0)"
            outlineColor="#ccc"
        />
        </View>
        <View style={{ flexDirection: "row", alignItems : "center", paddingStart : 10 }}>
          <TouchableOpacity onPress={() => saveData() } style={{ backgroundColor : "rgb(220, 73, 0)", borderRadius : 16, color : 'white', padding: 5 }}><Text style={{ color : 'white', paddingEnd : 10}}><Ionicons name="add-circle-outline" size={20} color={'white'} /><Text style={{ color : 'white'}}>Ajouter</Text></Text></TouchableOpacity>
        </View>
      </View>

      {/* LIST */}
      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        ListFooterComponent={() => { 
          return <View>
            <View 
              style={{
                  marginBottom : 150,
                  flex: 1,
                  justifyContent : "center",
                  alignContent : "center",
                  alignItems : "center"
              }}>
            </View>
          </View>
          }
        }
        refreshControl={<RefreshControl tintColor={"rgb(244, 53, 53)"} refreshing={ Loading }  onRefresh={ () => { getUsers()} } colors={["rgb(224, 18, 18)", "orange", "black", "red", "green"]} />}
      />

      {/* MODAL */}
      <Modal visible={visible} transparent animationType="slide">

        <Pressable
          style={styles.overlay}
          onPress={() => setVisible(false)}
        />

        <View style={styles.modal}>

          {/* HEADER */}
          <View style={styles.modalHeader}>
            <Avatar.Text
              size={42}
              label={selected?.name?.charAt(0)}
              style={styles.avatar}
            />

            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.modalTitle}>{selected?.name}</Text>
              <Text style={styles.modalSub}>
                Dernière opération • <Text style={{ fontWeight : "600"}}>{ new Date(selected?.updatedAt)?.toLocaleDateString("en-GB") }</Text>
              </Text>
            </View>

            <MaterialIcons
              name="close"
              size={24}
              color="#333"
              onPress={() => setVisible(false)}
            />
          </View>

          {/* TAX LIST */}
          <FlatList
            data={Taxes}
            keyExtractor={(i) => i.id}
            renderItem={renderTax}
            ListFooterComponent={() => { 
              return <View>
                <View 
                  style={{
                      marginBottom : 300,
                      flex: 1,
                      paddingBottom : 250,
                      justifyContent : "center",
                      alignContent : "center",
                      alignItems : "center"
                  }}>
                </View>
              </View>
              }
            }
          />

        </View>
      </Modal>

    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F3F5F9",
    padding: 12
  },

  /* 🔎 SEARCH (COMPACT FIX) */
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 8,   // ⬅️ réduit volontairement
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
    width : "80%"
  },

  searchInput: {
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
    color: "#222",
    height : 30,
    backgroundColor : 'white',
    paddingVertical: 0   // ⬅️ réduit hauteur input
  },

  /* LIST CARD */
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginStart : 5,
    marginEnd : 5,
    padding: 12,
    borderRadius: 14,
    marginBottom: 8,
    elevation: 1
  },

  avatar: {
    backgroundColor: "#fae3e3",
    borderWidth : 1,
    borderColor : "#eb5d5d"
  },

  name: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A"
  },

  sub: {
    fontSize: 12,
    color: "#777",
    marginTop: 2
  },

  /* MODAL */
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)"
  },

  modal: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: screenHeight * 0.80,
    backgroundColor: "#eed",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 12
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10
  },

  modalTitle: {
    fontSize: 15,
    fontWeight: "700"
  },

  modalSub: {
    fontSize: 12,
    color: "#777"
  },

  /* 🧾 TAX CARD (NEW CLEAN ROW) */
  taxCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F6F7FB",
    padding: 10,
    borderRadius: 12,
    marginBottom: 6
  },

  taxLeft: {
    flex: 1
  },

  taxRef: {
    fontSize: 13,
    fontWeight: "700",
    color: "#222"
  },

  taxMeta: {
    fontSize: 11,
    color: "#777",
    marginTop: 2
  },

  taxRight: {
    alignItems: "flex-end"
  },

  amount: {
    fontSize: 14,
    fontWeight: "800",
    color: "#f14901"
  },

  fc: {
    fontSize: 11,
    color: "#777"
  }
});

export default FicheMember