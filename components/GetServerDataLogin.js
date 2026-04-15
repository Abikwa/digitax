import AsyncStorage from '@react-native-async-storage/async-storage'
 
async function  GetServerDataLogin ( token, staffId ){

const server = await AsyncStorage.getItem('server');
const api_Url = await AsyncStorage.getItem('api_Url')
const headers = {
    'Content-Type':'application/json',
    'Accept':'*/*',
    'x-country':'UG',
    'Authorization':'Bearer ' + token,
    'Content-Type':'application/json'
    };
const params = {
    method: 'GET',
    headers: headers
}

try{
    //schedule tables_cours 
    const responseLesson = await fetch(`https://${ api_Url }/sectionclasselessons/staffmob/${staffId}`, params)
    const itemLesson = await responseLesson.json()
    
      itemLesson.length > 0 && (
        itemLesson.forEach((item, index) => {
          
          let classe = item.sectionclass?.class.short_entitled_class,
            title = item.sectionclass?.title,
            section = item.sectionclass?.section.short_entitled_section;
            classe = classe != null ? title != null ? classe + " " + title : classe : "";
            section = section != 0 && section != null ? "/" + section : "";

            classe = classe+section
 
        })
      )
    //schedule  table_horaire
    const responseSchedule = await fetch(`https://${ api_Url }/schedules/staffmob/${staffId}`, params)
    const itemSchedule = await responseSchedule.json()
    itemSchedule.length > 0 && (itemSchedule.forEach(item => {
      
      let classe = item.sectionclasselesson?.sectionclass.class.short_entitled_class,
        title = item.sectionclasselesson?.sectionclass.title,
        section = item.sectionclasselesson?.sectionclass.section.short_entitled_section;
        classe = classe != null ? title != null ? classe + " " + title : classe : "";
        section = section != 0 && section != null ? "/" + section : "";
        classe = classe+section
    }))
      
    //table_user
    const response = await fetch(`https://${ api_Url }/studentsmob`, params)
    const items = await response.json()
    items.length > 0 && ( items.filter(data => itemLesson.some(val => val.sectionclasseId == data.students?.sectionclass.id ) ).forEach(item => {
      let classe = item.students?.sectionclass.class.short_entitled_class,
        title = item.students?.sectionclass.title,
        section = item.students?.sectionclass.section.short_entitled_section
      
      classe = classe != null ? title != null ? classe + " " + title : classe : "";
      section = section != 0 && section != null ? "/" + section : "";

      classe = classe+section
    }))


  }catch(e) {
    setUsererror( "Pas d'access au serveur "+ server)
  }
}
export default GetServerDataLogin