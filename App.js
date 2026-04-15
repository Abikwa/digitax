import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { FicheData, HoraireData, Collecter } from './components/index.js';
import * as Animatable from 'react-native-animatable'
import { StyleSheet, Text, TouchableOpacity, Image, View } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Profile from './components/Profile.js';
import About from './components/About.js';

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator();

const TabArr = [
  { route : "Horaire", label : "Recettes", icon : 'home-outline', iconActivate : 'home-sharp', component : HoraireData},
  { route : "Preuve", label : "Collecter", icon : 'add-circle-outline', iconActivate : 'hourglass', component : Collecter},
  { route : "Fiche", label : "Rapport", icon:'file-tray-full-outline', iconActivate : 'analytics', component : FicheData},
]

const animate1 = { 0 : { scale : .5, translateY : 7 }, .92 : {translateY : -34}, 1 : { scale : 1.2, translateY : -24}}
const animate2 = { 0 : { scale : 1.2, translateY : -24 }, 1 : { scale : 1, translateY : 7}}
const circle1 = { 0 : { scale : 0 }, 0.3 : {scale : .9}, 0.5 : { scale : .2}, 0.8 : { scale : .7}, 1 : { scale : 1}}
const circle2 = { 0 : { scale : 1 }, 1 : {scale : 0}}

const TabButton = (props) =>{
  const { item, onPress, accessibilityState } = props
  const focused = accessibilityState.selected

  const viewRef = React.useRef(null)
  const circleRef = React.useRef(null)
  const textRef = React.useRef(null)

  React.useEffect(() => {
    if(focused){
      viewRef.current?.animate(animate1)
      circleRef.current?.animate(circle1)
      textRef.current?.transitionTo({ scale : 1})
    }else{
      viewRef.current?.animate(animate2)
      circleRef.current?.animate(circle2)
      textRef.current?.transitionTo({ scale : 0})
    }
  }, [focused])

  return(
    <TouchableOpacity
      onPress={onPress}
      style={ styles.container}
      activeOpacity={1}
    >
      <Animatable.View
        ref={viewRef}
        duration={1000}
        style={ styles.container}
      >
        <View style={{ ...styles.container, padding : 10, borderColor : focused ? "white" : "red"}} >
          <Animatable.View 
            ref={circleRef}
            style={ styles.circle} />
          <Ionicons name={ focused ? item.iconActivate : item.icon} size={30} color={"white"} />
        </View>
        <Animatable.Text ref={textRef} style={ styles.text}>{ item.label }</Animatable.Text>
      </Animatable.View>
    </TouchableOpacity>
  )
}


const PortailMenu = () => {
  return (
    <Tab.Navigator initialRouteName='Preuve' screenOptions={{
      headerShow : false,
      headerShadowVisible : false,
      tabBarStyle : {
        position : "absolute",
        height : 70,
        bottom : 5,
        right : 5,
        left : 5,
        borderRadius : 16,
        backgroundColor : 'rgb(244, 53, 53)',
        borderTopWidth : 1
      }
    }}>
      {
        TabArr.map((item, index) => (
          <Tab.Screen key={index} name={ item.route} component={ item.component}
            options={{
              tabBarShowLabel : false,
              headerShown : false,
              tabBarButton : (props) => <TabButton {...props} item={ item} />
            }} />
        ))
      }

      <Tab.Screen key={"profile"} name={"Profile"} component={ Profile}
        options={{
          tabBarShowLabel : false,
          headerShown : false,
          tabBarButton : () => null
        }}
      />
      
    </Tab.Navigator>
  );
};

export default function App() {
  return (
      <NavigationContainer>
          <Stack.Navigator 
            initialRouteName="About"
            screenOptions={
                {
                presentation : "transparentModal",
                headerStyle: {
                    backgroundColor: 'rgb(244, 53, 53)',
                },
            headerTintColor: 'white'
          }}
        >

        <Stack.Screen  name="template" component={ PortailMenu } options={({ navigation, route }) => ({  
           title :
                <View style={styles.containerTitle}>
                  <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={{ paddingEnd : 5}}>
                    {
                      route.params?.Avatar ?
                      <Image
                        style={{ width: 50, height: 50, borderRadius : 50, overflow : "hidden", borderWidth : 2, borderColor : "red" }}
                        source={{ uri : route.params?.Avatar}}
                      />
                      :
                      <Image
                        source={ require("./assets/avatar.png")}
                        style={{ width: 50, height: 50, borderRadius : 50, overflow : "hidden", borderWidth : 2, borderColor : "red" }}
                      />
                    }
                  </TouchableOpacity>
                  <View>
                    <View>
                      <Text style={styles.textTitle}>
                        { route.params?.Branche}
                      </Text>
                    </View>
                    <Text style={{ color : 'white', fontSize : 10, paddingEnd : 5 }}>{ route?.params?.Profile } { route?.params?.Name?.toLowerCase()?.slice(0, 9)}</Text>
                  </View>
            
                </View>,
          
           headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={{ paddingEnd : 5}}>
                  <Text style={{ color : 'white', fontSize : 10, paddingEnd : 5, fontWeight : "600" }}> <MaterialIcons name='cloud-off' /> {"Hors ligne"}</Text>
               </TouchableOpacity>
           ),
         })}/>
        <Stack.Screen name="About"   component={About} options={({ navigation, route }) => ({  title: '', headerShown : false })} />
        
      </Stack.Navigator>
      
      <StatusBar backgroundColor={"rgb(244, 53, 53)"} style='light' />
       
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container : {
    flex : 1,
    alignItems : "center",
  },
  btn : {
    width : 50,
    height : 50,
    borderWidth : 4,
    borderRadius : 25,
    backgroundColor : 'transparent',
    justifyContent : "center",
    alignItems : "center"
  },
  text : {
    fontSize : 10,
    textAlign : "center",
    color : "white",
    marginTo : 6
  },
  circle:{
    ...StyleSheet.absoluteFillObject,
    alignItems : "center",
    justifyContent : "center",
    backgroundColor : "rgb(244, 53, 53)",
    borderWidth : 4,
    borderColor : "white",
    borderRadius : 25
  },
  containerTitle: {
    flexDirection: 'row', // 🔥 alignement horizontal
    alignItems: 'center',
    // padding: 10,
  },
  imageTitle: {
    width: 80,
    height: 80,
    // marginRight: 10,
  },
  textTitle: {
    // flex: 1, // prend l’espace restant
    fontSize: 14,
    paddingTop : 10,
    color : "white",
    fontWeight : "700"
  },
})