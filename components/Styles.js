import { StyleSheet } from "react-native";

const Styles = StyleSheet.create({
    container: {
      flex:1,
      paddingTop: 0,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
      marginLeft:16
    },
    card: {
      flex:1,
      backgroundColor: 'rgb(70, 89, 195)',
      borderRadius: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
      marginBottom: 16,
      padding: 16,
    },
    header: {
      marginBottom: 8,
    },
    headerTitle: {
      color:'#ffffff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    headerSubtitle: {
      fontSize: 12,
      color:'#ffffff',
    },
    body: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 8,
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 8,
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: 16,
      fontWeight: 'bold',
      color:'#ffffff',
    },
    userRole: {
      fontSize: 12,
      color:'#ffffff',
    },
    classItem: {
      flex:1,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    timelineContainer: {
      width: 10,
      alignItems: 'center',
    },
    timelineDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: 'rgb(244, 53, 53)',
      marginBottom: 8,
    },
    timelineLine: {
      flex: 1,
      width: 2,
      backgroundColor: 'rgb(244, 53, 53)',
    },
    classContent: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 4,
    },
    classHours: {
      marginRight: 4,
      alignItems: 'flex-end',
    },
    startTime: {
      fontSize: 10,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    endTime: {
      fontSize: 7,
    },
    cardTitle: {
      fontSize: 16,
      color: '#00008B',
      marginBottom: 4,
    },
    cardDate: {
      fontSize: 13,
      color: '#00008B',
      fontWeight : '800',
      marginBottom: 8,
    },
    studentListContainer:{
      marginRight:10,
    },
    studentAvatar: {
      width: 30,
      height: 30,
      borderRadius: 15,
      marginLeft: -3,
      borderWidth:1,
      borderColor:'#fff'
    },
    addButton_: {
      borderRadius: 16,
      backgroundColor: 'rgb(244, 53, 53)',
      borderColor : 'white',
      borderWidth : 2,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.8,
      shadowRadius: 3.84,
      elevation: 5,
    },
    addButton: {
      position: 'relative',
      bottom: 150,
      right: 10,
      width: 60,
      height: 60,
      borderRadius: 16,
      backgroundColor: 'rgb(244, 53, 53)',
      borderColor : 'white',
      borderWidth : 6,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.8,
      shadowRadius: 3.84,
      elevation: 5,
    },
    addButtonText: {
      fontSize: 30,
      fontWeight: 'bold',
      color: '#fff',
    },
  });
  export default Styles