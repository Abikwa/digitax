import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, Animated, ActivityIndicator, Modal, Pressable, RefreshControl } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import Login from "./Login";

const { width, height } = Dimensions.get("screen");

const Text_ = [
  'DigiTax facilite la relation entre les contribuables et les collecteurs par un système de taxe simple, rapide et transparent.',
  'Enregistrez les taxes facilement, sans stress ni perte de temps, directement depuis un système clair et fiable.',
  'DigiTax modernise les anciennes méthodes par une solution numérique adaptée aux réalités du terrain!',
  'Contribuables et collecteurs participent ensemble à la croissance et au développement des communautés locales',
  'Chaque opération se fait en quelques secondes, sans papier ni complication.'
],  Image_ = [
  require("./../assets/1.jpg"), 
  require("./../assets/2.png"),
  require("./../assets/5.png"),
  require("./../assets/4.jpg")
]

const About = ({ navigation }) => {

    const [ modalVisible, setModalVisible ] = useState(false)
    const [ Loading, setLoarding ] = useState(false)
    const [ Students, setStudents ] = useState([])
    const [ Name, setName ] = useState('')
    const [ Tel, setTel ] = useState('')
    const [ Profile, setProfile ] = useState('')
    const [ Avatar, setAvatar ] = useState('')
    const [ Branche, setBranche ] = useState('')

  const sliderRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const autoplayInterval = useRef(null);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const getProfile_ = async () => {
      const timer = setTimeout(getProfile, 3000);
      return () => clearTimeout(timer);
    }

    const Local_ = async() => {
      let Name = await AsyncStorage.getItem('Name')
      setName(Name)
      let Tel = await AsyncStorage.getItem('Tel')
      setTel(Tel)
      let Profile = await AsyncStorage.getItem('Profile')
      setProfile(Profile || "Collecteur")
      let Avatar = await AsyncStorage.getItem('Avatar')
      setAvatar(Avatar)
      let Branche = await AsyncStorage.getItem('Branche')
      setBranche(Branche || "Marché Lufungula")
    }

    const getProfile = async () => {
        try {
            setLoarding(true)
            const token = await AsyncStorage.getItem("token")
            const api_Url = await AsyncStorage.getItem('api_Url')
            const params = {
                method: 'GET',
                headers: {
                    'Accept':'*/*',
                    'x-country':'CD',
                    'Authorization':'Bearer ' + token,
                    'Content-Type':'application/json'
                }
            };
            setStudents(Text_)
            setLoarding(false)

          } catch (error) {
              setLoarding(false)
              alert(error);
          }
      }

    // Fonction pour animer le zoom
    const startZoomAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 2, // Zoom avant
            duration: 8000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.2, // Retour à la taille normale
            duration: 8000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

  // Fonction pour démarrer l'autoplay
  const startAutoplay = () => {
    stopAutoplay(); // Assurer que l'ancien intervalle est supprimé
    autoplayInterval.current = setInterval(() => {
      if (sliderRef.current && autoplay) {
        let nextIndex = (activeIndex + 1) % 5;
        sliderRef.current.goToSlide(nextIndex, true);
        setActiveIndex(nextIndex);
      }
    }, 8000);
  };

  // Fonction pour stopper l'autoplay
  const stopAutoplay = () => {
    if (autoplayInterval.current) {
      clearInterval(autoplayInterval.current);
      autoplayInterval.current = null;
    }
  };

  // Gestion du changement de slide
  useEffect(() => {
    Local_()
    startZoomAnimation();
    if(Students?.length == 0)
      getProfile_()
    if (autoplay) {
      startAutoplay();
    } else {
      stopAutoplay();
    }
    return () => stopAutoplay(); // Nettoyage à la fin
  }, [autoplay, activeIndex]);

  // Fonction pour stopper l'autoplay quand on clique sur un slide
  const handlePress = () => {
    setAutoplay(false);
  };

  const renderPagination = (activeIndex) => {
    return (
      <View style={{ position: 'absolute', bottom: 20, left: 20 }}>
        <View style={{ flexDirection: 'row', alignItems : "baseline", width : width, justifyContent: 'space-between' }}>
          <View>
            <View style={styles.paginationContainer}>
              {Students?.slice(0, 5)?.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    activeIndex === index ? styles.activeDot : {},
                  ]}
                />
              ))}
            </View>
          </View>
          <View style={{ paddingEnd : 20}}>
            {
              Name ? 
                <TouchableOpacity style={styles.button_} onPress={() => { navigation.replace(
                  "template", { Profile : Profile, Name : Name, Tel : Tel, Avatar : Avatar, Branche : Branche }
                  ); setAutoplay(false) }}>
                  <Text style={styles.buttonText}>{Name?.slice(0, 4)}, Commencez</Text>
                </TouchableOpacity>
              :  
                <TouchableOpacity style={styles.button_} onPress={() => { setModalVisible(true); setAutoplay(false) }}>
                  <Text style={styles.buttonText}>S'enregister</Text>
                </TouchableOpacity>
            }
          </View>
        </View>
      </View>
    );
  };

  return (
        Loading ? 
        <View  style={ {  paddingTop :  200, ...styles.content} }>
            <View style={{ ...styles.content, marginStart : 20, marginEnd : 20  }}>
                <View style={{ display : "flex", justifyContent : "center", alignItems : "center" }}>
                      <Image
                          style={{ width: 120, height: 120, borderRadius : 80 }}
                          source={ require("./../assets/icon.png")}
                      />
                   <Text style={{ color : "red", fontWeight : "600", fontSize : 20, textAlign : "center"  }}>{"DIGI TAX"}</Text>
                </View>
                <ActivityIndicator  size={"large"} color={"red" } /> 
              
              <View style={{ marginTop : 50}}>
                  <Text style={{ fontWeight : '800', fontSize : 15, textAlign : 'center', color : 'rgb(0, 0, 0)'}}>
                    { 'Service National de Taxe'}
                  </Text>

                  <View>
                    <Text style={{ fontWeight : '700', fontSize : 12, textAlign : 'center', letterSpacing : 3, color : 'rgb(220, 73, 0)'}}>
                      { 'Commune de Lingwala'}
                    </Text>
                  </View>
              </View>
            </View>
          </View>
                  :
          <View style={{ flex : 1}}>
          <AppIntroSlider
            data={Students?.slice(0, 5)}
            ref={sliderRef}
            onSlideChange={(index) => setActiveIndex(index) }
            renderPagination={renderPagination}
            refreshControl={ <RefreshControl refreshing={Loading}  onRefresh={ () =>  getProfile() } colors={["rgb(0, 0, 90)", "orange", "black", "red", "green"]} />}
            renderItem={({ item }) => {
              let inde_ = Math.floor(Math.random() * Text_.length)
              let text_ = Text_[inde_]
              return(
                <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
                  <TouchableOpacity onPress={handlePress}>
                      <Animated.Image
                          key={ item?.user?.avatar}
                          source={ (item?.user?.avatar && !item?.user?.avatar?.includes("avatar.png")) ? { uri : item?.user?.avatar } : Image_[Math.floor(Math.random() * Image_.length)] }
                          style={[{ height : height /1.8, width : width, transform: [{ scale: scaleAnim }] }]}
                        />
                      <View style={{ padding : 20, paddingTop : 30, paddingBottom : 0, zIndex : 10000 }}>
                        <Text style={{ ...styles.title}}> {item.user?.last_name} {item.user?.family_name}</Text>
                        <Text style={{ ...styles.text }}>{ text_ }</Text>
                      </View>

                    <View style={styles.curve1} />
                    <View style={styles.curve2} />
                    <View style={styles.curve3} />

                    </TouchableOpacity>
                  </View>
                )}
              }
            showSkipButton={ false}
            showNextButton={ false }
            showDoneButton={ false }
          />

          <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                    
                      <Login navigation={navigation} />
                    <Pressable
                        style={[styles.button]}
                        onPress={() =>{ setModalVisible(false); setAutoplay(true) }}>
                        <Text style={styles.textStyle}>Fermer</Text>
                    </Pressable>
                    </View>
                </View>
            </Modal>
        </View>

  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 4,
    paddingVertical: 7,
    backgroundColor: "rgb(255, 255, 255)",
  },
  flexData : {
      flexDirection: "row",
      marginVertical : 5
  },
  touch : {
      borderColor : "#ccc",
      marginHorizontal: 5,
      marginVertical:4,
      borderRadius : 8,
      borderWidth : 1,
      paddingHorizontal :5,
      paddingBottom : 3
  },

  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#fff',
    overflow : 'hidden'
  },
  
  paginationContainer: {
     // Alignement à gauche
    flexDirection: 'row',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#bbb',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#000',
  },
  image: {
    // objectFit : 'cover'
    borderRadius: 10
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "rgb(242, 242, 249)",
    paddingLeft : 5,
    letterSpacing : 2,
    paddingTop : 40
  },
  text: {
    fontSize: 14,
    color: "rgb(30, 24, 9)",
    fontWeight : "700",
    letterSpacing : 2,
    paddingTop : 20
  },

  curve1: {
    position: 'absolute',
    width: width * 1.8,
    height: height * 0.28,
    backgroundColor: 'rgb(244, 53, 53)',
    borderRadius: 800,
    bottom: -height * 0.15,
    left: -width * 0.5,
    transform: [{ rotate: '45deg' }],
  },

  // Deuxième courbe plus petite
  curve2: {
    position: 'absolute',
    width: width * 2.2,
    height: height * 0.14,
    backgroundColor: 'rgb(244, 53, 53)',
    borderRadius: 300,
    bottom: -height * 0.1,
    left: width * 0.5,
    transform: [{ rotate: '15deg' }],
  },

  // Troisième courbe pour un effet plus doux
  curve3: {
    position: 'absolute',
    width: width * 1.5,
    height: height * 0.43,
    borderWidth : 8,
    borderColor : 'white',
    backgroundColor: 'rgb(244, 53, 53)',
    borderRadius: 300,
    bottom: -height * 0.3,
    left: -width * 0.3,
    transform: [{ rotate: '30deg' }],
  },
  button_: {
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginEnd : 20,
  },
  buttonText: {
    color: "rgb(244, 53, 53)",
    fontWeight: "bold",
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom : 50
  },
  modalView: {
    height : (height * 60)/100,
    width : (width * 80)/100,
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 7,
    padding: 7,
    marginTop : 10,
    elevation: 2,
    paddingEnd : 10,
    paddingStart : 10
  },
  textStyle: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  }
  
});

export default About;
