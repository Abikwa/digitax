import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
  TextInput,
  Dimensions,
  RefreshControl
} from "react-native";
import * as SQLite from 'expo-sqlite'
import { Text, Avatar } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const screenHeight = Dimensions.get("window").height;

/* ================= APP ================= */
const ReportMember = () => {
  const [selected, setSelected] = useState(null);
  const [visible, setVisible] = useState(false);
  const [Loading, setLoading] = useState(false);
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
    const DB_SQL = await SQLite.openDatabaseAsync("digitax.db", { useNewConnection: true });

    const id = await AsyncStorage.getItem("Id")
    const result = await DB_SQL.getAllAsync(
      `SELECT id, name, updatedAt FROM table_users WHERE id != ? LIMIT 50`,
      [id]
    );
    setUsers(result)
    setLoading(false)
  };

  const filtered = Users.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // const total = selected?.taxes?.reduce((s, t) => s + t.montant, 0);

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
          Stand _ Plaque  • <Text style={{ fontWeight : '900'}}>{item.numero}</Text>
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
          <Text style={styles.name}>{item.name}</Text>
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
      <View style={styles.searchBox}>
        <MaterialIcons name="search" size={18} color="#888" />
        <TextInput
          placeholder="Rechercher..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* LIST */}
      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
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
    elevation: 2
  },

  searchInput: {
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
    color: "#222",
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

export default ReportMember