//import liraries
import React, {  useState } from 'react';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import {  View, Text  } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HoraireData from './HoraireData';
import PreuveData from './PreuveData';
import FicheData from './FicheData';

const FirstRoute = () => (
  <HoraireData />
);

const SecondRoute = () => (
  <PreuveData />
);

const ThredRoute = () => (
  <FicheData />
);

const TeplateData = ({ navigation }) => {

  //variables
  const [index, setIndex] = useState(0);

  const [routes] = useState([
    { index : 0, key: 'horaire', title: 'Horaire', icone:"calendar" },
    { index : 1, key: 'preuve', title: 'Preuve', icone: "folder" },
    { index : 2, key: 'fiche', title: 'Fiche', icone:"book" },
  ]);


  const renderScene = ({ route }) => {
    
    switch (index) {
      case 0:
        return <FirstRoute />
      case 1:
        return <SecondRoute />
      case 2:
        return <ThredRoute />
      default:
        return null;
    }
  };

  //retun screen view
  return (
    <>
    <TabView
      style={{ backgroundColor: '#000' }}
      pagerStyle ={{ backgroundColor: 'rgb(220, 220, 220)', borderColor : "red" }}
      navigationState={{ index, routes }}
      onIndexChange={ setIndex}
      renderScene={ SceneMap({
          horaire: FirstRoute,
          preuve: SecondRoute,
          fiche: ThredRoute
        }) }

      renderTabBar={props => 
        <TabBar
          {...props}
          onTabPress = {(route ) => { setIndex(route.route.index); renderScene  }}
          indicatorStyle={{ backgroundColor: 'white'}}
          style={{ backgroundColor: 'rgb(244, 53, 53)' }}
          renderLabel={({ route, focused, color }) => (
            <View>
              <Text style={{ color, fontWeight:"400" }} >
                    <Ionicons name={ route.index != index ? route.icone : "flower"} size={17} color={"white"} />
                    {route.title}
              </Text>
              
            </View>

          )}
         />
      }
    />
  </>
  );
};

//make this component available to the app
export default TeplateData;
