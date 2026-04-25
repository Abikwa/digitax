import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, Image, View, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as Animatable from 'react-native-animatable';
import * as Font from 'expo-font'; // Import pour le chargement des polices
import * as SplashScreen from 'expo-splash-screen'; // Import pour l'écran de démarrage
import { SafeAreaView } from 'react-native-safe-area-context';

// Import de vos composants
import { FicheMember, HoraireData, Collecter, Report } from './components/index.js';
import Profile from './components/Profile.js';
import About from './components/About.js';

// Empêche l'écran splash de se cacher automatiquement
SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const { width, height } = Dimensions.get("screen");

const TabArr = [
  { route: "Horaire", label: "Recettes", icon: 'home-outline', iconActivate: 'home-sharp', component: HoraireData },
  { route: "Preuve", label: "Ticket", icon: 'add-circle-outline', iconActivate: 'hourglass', component: Collecter },
  { route: "Fiche", label: "Contribuable", icon: 'people', iconActivate: 'cash', component: FicheMember },
  { route: "Rapport", label: "Rapport", icon: 'file-tray-full-outline', iconActivate: 'analytics', component: Report },
];

const animate1 = { 0: { scale: .5, translateY: 7 }, .92: { translateY: -34 }, 1: { scale: 1.2, translateY: -24 } };
const animate2 = { 0: { scale: 1.2, translateY: -24 }, 1: { scale: 1, translateY: 7 } };
const circle1 = { 0: { scale: 0 }, 0.3: { scale: .9 }, 0.5: { scale: .2 }, 0.8: { scale: .7 }, 1: { scale: 1 } };
const circle2 = { 0: { scale: 1 }, 1: { scale: 0 } };

const TabButton = (props) => {
  const { item, onPress, accessibilityState } = props;
  const focused = accessibilityState.selected;

  const viewRef = React.useRef(null);
  const circleRef = React.useRef(null);
  const textRef = React.useRef(null);

  React.useLayoutEffect(() => {
    const triggerAnimation = () => {
      if (focused) {
        viewRef.current?.animate(animate1);
        circleRef.current?.animate(circle1);
        textRef.current?.transitionTo({ scale: 1 }, 250);
      } else {
        viewRef.current?.animate(animate2);
        circleRef.current?.animate(circle2);
        textRef.current?.transitionTo({ scale: 0 }, 250);
      }
    };
    const timer = setTimeout(triggerAnimation, 10);
    return () => clearTimeout(timer);
  }, [focused]);

  return (
    <TouchableOpacity onPress={onPress} style={styles.container} activeOpacity={1}>
      <Animatable.View ref={viewRef} duration={800} style={styles.container}>
        <View style={styles.iconContainer}>
          <Animatable.View ref={circleRef} style={styles.circle} useNativeDriver={true} />
          <Ionicons name={focused ? item.iconActivate : item.icon} size={28} color="white" />
        </View>
        <Animatable.Text ref={textRef} style={styles.text}>{item.label}</Animatable.Text>
      </Animatable.View>
    </TouchableOpacity>
  );
};

const PortailMenu = () => {
  return (
    <Tab.Navigator initialRouteName='Preuve' screenOptions={{ headerShown: false, tabBarStyle: styles.tabBar }}>
      {TabArr.map((item, index) => (
        <Tab.Screen key={index} name={item.route} component={item.component}
          options={{ tabBarShowLabel: false, tabBarButton: (props) => <TabButton {...props} item={item} /> }} 
        />
      ))}
      <Tab.Screen name="Profile" component={Profile} options={{ tabBarButton: () => null }} />
    </Tab.Navigator>
  );
};

export default function App() {
  const [appIsReady, setAppIsReady] = React.useState(false);

  // Chargement global des ressources (Icônes + Polices)
  React.useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          ...Ionicons.font,
          ...MaterialIcons.font,
        });
        // Petit délai artificiel pour stabiliser le rendu
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, []);

  if (!appIsReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="rgb(244, 53, 53)" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="About"
          screenOptions={{ presentation: "transparentModal", headerStyle: { backgroundColor: 'rgb(244, 53, 53)' }, headerTintColor: 'white' }}
        >
          <Stack.Screen 
            name="template" 
            component={PortailMenu} 
            options={({ navigation, route }) => ({  
              title: (
                <View style={styles.containerTitle}>
                  <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                    <Image
                      style={styles.avatar}
                      source={route.params?.Avatar ? { uri: route.params.Avatar } : require("./assets/avatar.png")}
                    />
                  </TouchableOpacity>
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.textTitle}>{route.params?.Branche || "Chargement..."}</Text>
                    <Text style={styles.subTitle}>{route.params?.Profile} {route.params?.Name?.toLowerCase()?.slice(0, 12)}</Text>
                  </View>
                </View>
              ),
              headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={{ marginRight: 15 }}>
                  <Text style={styles.offlineText}><MaterialIcons name='cloud-off' size={14} /> Hors ligne</Text>
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen name="About" component={About} options={{ headerShown: false }} />
        </Stack.Navigator>
        <StatusBar backgroundColor="rgb(244, 53, 53)" style='light' />
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: 'center' },
  tabBar: {
    position: "absolute",
    height: height <= 640 ? height * 0.12 : 70,
    bottom: 2, right: 2, left: 2,
    borderTopEndRadius: 16,
    borderTopStartRadius: 16,
    backgroundColor: 'rgb(244, 53, 53)',
    borderTopWidth: 0,
    elevation: 5,
  },
  iconContainer: { width: 50, height: 50, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  circle: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgb(244, 53, 53)", borderWidth: 3, borderColor: "white", borderRadius: 25, zIndex: -1 },
  text: { fontSize: 10, textAlign: "center", color: "white", marginTop: 2 },
  containerTitle: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 1.5, borderColor: "white" },
  textTitle: { fontSize: 14, color: "white", fontWeight: "700" },
  subTitle: { color: 'white', fontSize: 10, opacity: 0.9 },
  offlineText: { color: 'white', fontSize: 11, fontWeight: "600" }
});
