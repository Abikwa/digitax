import AsyncStorage from '@react-native-async-storage/async-storage'

async function  GetServerData ( token, staffId ){

    const server = await AsyncStorage.getItem('server');
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
        // save evaluations
        // const responseEvaluation = await fetch(`https://${ api_url }/evaluations/staffmob/${staffId}`, params)
        // const itemData = await responseEvaluation.json()
        let arrayList = [];
    }catch(err){
        console.log(err)
    }
}

export default GetServerData