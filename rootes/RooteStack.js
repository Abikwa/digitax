import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();

import Login from "../components/Login";
import Note from "../components/Note";
import TeplateData from "../components/TeplateData";

//npx expo prebuild eas build -p android --profile preview
const RootStack = () => {
    return(
        <Stack.Navigator 
            initialRouteName="Login"
            screenOptions={
                {
                presentation : "transparentModal",
                headerStyle: {
                    backgroundColor: 'rgb(244, 53, 53)',
            },
            headerTintColor: 'white',
        }}
        >
        <Stack.Screen  name="template" component={ TeplateData } options={({ navigation, route }) => ({ title: 'EviveSoma' })}/>
        
        <Stack.Screen name="Login"   component={Login} options={({ navigation, route }) => ({  title: '' })} />
        <Stack.Screen name="Note"  component={Note}  />
      </Stack.Navigator>
    )
}

export default RootStack;