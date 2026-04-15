import React, {  useEffect, useState }  from "react";
import { Image, View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import * as ImagePicker from "expo-image-picker"; 
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("screen");

const Camera = ({ setAvatar }) => {
    const [file, setFile] = useState(null);
    const [widthAspect, setwidthAspect] = useState('3'); 
    const [heightAspect, setheightAspect] = useState('4'); 

    useEffect(() => {
        setFile(null)
    }, [])

    const handlePickFile = async () => {
        try{
            if (heightAspect == "0" || widthAspect == "0") {
                const res =
                    await ImagePicker.launchImageLibraryAsync({
                        mediaTypes:
                            ImagePicker.MediaTypeOptions.Images,
                        quality: 1,
                        allowsEditing: true,
                        allowsMultipleSelection: false,
                    });
                if (res.canceled) return;

                setAvatar(res.assets[0].uri)
                setFile(res.assets[0].uri);
            
            } else {
                const res =
                    await ImagePicker.launchImageLibraryAsync({
                        mediaTypes:
                            ImagePicker.MediaTypeOptions.Images,
                        quality: 1,
                        aspect: [
                            parseInt(widthAspect),
                            parseInt(heightAspect),
                        ],
                        allowsEditing: true,
                        allowsMultipleSelection: false,
                    });
                if (res.canceled) return;
                
                setAvatar(res.assets[0].uri)
                setFile(res.assets[0].uri);
            }
        }catch(error){
            alert(error)
        }
    };
      
    return(
        <View  style={{ ...styles.container, borderColor : "red"  }}>
                         
            <View style={styles.imageContainer}>
                        
                <TouchableOpacity onPress={ handlePickFile }> 
                {
                    file ?
                    <Image source={{ uri: file }}
                        style={{ width :  (width * 0.85), height: (width * 0.85), borderRadius: 8}} /> 
                    :
                    <View style={{ alignContent : "center", marginStart : 40}}> 
                        <Ionicons
                            name={  "camera" }
                            size={ (width * 0.3) }
                            color={'#ccc'}
                            style={{ margin: 0 }}
                        />
                    </View>
                }
                </TouchableOpacity>
               
                
            </View>
            

        </View> 
    )
}

const styles = StyleSheet.create({
  container: { 
      flex: 1, 
      justifyContent: "center", 
      alignItems: "center", 
      padding: 16, 
  }, 
  header: { 
      fontSize: 20, 
      marginBottom: 16, 
  }, 
  button: { 
      backgroundColor: "#007AFF", 
      padding: 10, 
      borderRadius: 8, 
      marginBottom: 16, 
      shadowOffset: { width: 0, height: 2 }, 
      shadowOpacity: 0.4, 
      shadowRadius: 4, 
      elevation: 5, 
  }, 
  buttonText: { 
      color: "#FFFFFF", 
      fontSize: 16, 
      fontWeight: "bold", 
  }, 
  imageContainer: { 
      borderRadius: 8, 
      marginBottom: 16, 
      shadowColor: "#000000", 
    //   shadowOffset: { width: 0, height: 2 }, 
      shadowOpacity: 0.4, 
      shadowRadius: 4, 
    //   elevation: 5, 
  }, 
  image: { 
      width: 300, 
      height: 300, 
      borderRadius: 8, 
      marginBottom : 5
  },
  errorText: { 
      color: "red", 
      marginTop: 16, 
  }, 
  });


  export default Camera