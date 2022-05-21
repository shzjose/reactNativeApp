import React, { useState } from 'react'
import {
  Button,
  View,
  StyleSheet,
  Image,
  Text,
  FlatList,
  Pressable,
  Modal,
  TextInput
} from 'react-native';
import ListItem from '../components/ListItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

const Home = ({ navigation}) => {
  const reminder = [title, notes ]
  const [reminders, setReminders] = React.useState([])
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState()
  const [notes, setNotes] = useState()
  const [isPickerDShow, setIsPickerDShow] = useState(false);
  const [isPickerTShow, setIsPickerTShow] = useState(false);
  const [date, setDate] = useState(new Date(Date.now()));
  const [time, setTime] = useState(new Date(Date.now()));
  
  React.useEffect(() => {
    getData()
      .then((value) => {
        console.log("VALUE", value)
        if (!!value) { setReminders(value) }
      })
      .catch((e) => console.log("ERROR", e))
  }, [])

  const showPicker = () => {
    setIsPickerDShow(true);
    setIsPickerTShow(true);
  };

  const onChangeDate = (event, valueD) => {
    setDate(valueD);
    if (Platform.OS === 'android') {
      setIsPickerDShow(false);
    }
  };
  const onChangetime = (event, valueT) => {
    setTime(valueT);
    if (Platform.OS === 'android') {
      setIsPickerTShow(false);
    }
  };

  const addReminder = () => {
    const newId = !!reminders.length ? (reminders[reminders.length - 1].id + 1) : 1
    const newItem = {
      id: newId,
      title: title,
      notes: notes,
      time: time.toUTCString(),
      date: date.toUTCString() 
    }
    const newReminders = [...reminders, newItem]
    setReminders(newReminders)
    storeData(newReminders)
  }

  const deleteReminder = (reminder) => {
    const newReminders = reminders.filter(item => item.id !== reminder.id)
    setReminders(newReminders)
    storeData(newReminders)
  }

  const saveReminder = (reminder) => {
    const newReminders = reminders.map(r => {
      if (r.id === reminder.id) { return reminder }
      else return r
    })
    setReminders(newReminders)
    storeData(newReminders)
  }
 
  const openReminder = (reminder) => {
    navigation.navigate('Details', {
      reminder: reminder,
      saveReminder: saveReminder,
    })
  }

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('Reminders-Data', jsonValue)
    } catch (e) {
      // saving error
    }
  }

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('Reminders-Data')
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  }


  return (
    <View style={styles.container}>
      <View style={styles.header} >
          <Text style={styles.logoItem}>
            <Image style={styles.logoImg} source={require('../../src/assets/reloj.png')} />     Recordatorios
          </Text>
          <View style={{flexDirection: 'row',}}>
          <Pressable
            style={[styles.button, styles.btnProfile]}
            onPress={() =>
              navigation.navigate('Profile')
            }
          > 
            <Text style={styles.textStyle}>Detalles de Usuario</Text>
          </Pressable>
          <Pressable 
            style={[styles.button, styles.btnAdd]}
            onPress={() => {setModalVisible(true);}}
          > 
            <Text style={styles.textStyle}>Agregar   ✚</Text>
          </Pressable>
          </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.form}>
              <Text style={styles.caption}>Título</Text>
              <TextInput
                style={styles.input}
                onChangeText={setTitle}
                placeholder="Escribe aquí tu título"
              />
              <Text style={styles.caption}>Descripción</Text>
              <TextInput
                style={styles.textArea}
                multiline
                onChangeText={setNotes}
                textAlignVertical="top"
                numberOfLines={3}
                placeholder="Descripción de la alarma"
              />
               {(!isPickerDShow && !isPickerTShow) && (
        <View>
          <Pressable style={styles.btnDate} onPress={showPicker} ><Text style={{color: 'white', fontSize: 18}}>Establecer Fecha</Text></Pressable>
        </View>
      )}
      <View style={styles.pickedDateContainer}>
        <Text style={styles.pickedDate}>Date: {date.toDateString().substring(0, 15)}  - {time.toTimeString().substring(0, 5)} </Text>
      </View>
      {isPickerDShow && (
        <DateTimePicker
        value={date}
        mode={'date'}
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        onChange={onChangeDate}
        style={styles.datePicker}
      />
      )}
      {isPickerTShow && (
       <DateTimePicker
          value={time}
          mode={'time'}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          is24Hour={true}
          onChange={onChangetime}
          style={styles.datePicker}
        />
      )}
            </View>
            <View style={{flexDirection: "row"}}>
            <Pressable
              style={[styles.buttonM, styles.buttonAddM]}
              onPress={async() => {await addReminder(); await setModalVisible(!modalVisible);}}
            > 
              <Text style={styles.textStyle}>Guardar</Text>
            </Pressable>
            <Pressable
              style={[styles.buttonM, styles.buttonCloseM]}
              onPress={() => {setModalVisible(!modalVisible);}}
            > 
              <Text style={styles.textStyle}>Cancelar</Text>
            </Pressable>
            </View>
            
          </View>
        </View>
      </Modal>
      
      <View style={styles.listContainer}>
        <FlatList
          data={reminders}
          renderItem={({ item }) => <ListItem
            reminder={item}
            deleteReminder={deleteReminder}
            openDetails={openReminder}
          />}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ddd'
  },
  header:{
    backgroundColor: '#ffC0CB',
    width: '100%',
    marginBottom: 15
  },
  logoItem: {
    fontWeight:'bold', 
    fontSize: 17, 
    color: "#000000", 
    padding: 20, 
    marginTop:-30
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#00000000',
    textAlign: 'center'
  },
  logoImg: {
    width: 50,
    height: 50,
    resizeMode: 'stretch',
   },
  button: {
    borderRadius: 20,
    padding: 10,
    width: "40%",
    backgroundColor: "#00000000",
    marginLeft: "4%",
    marginBottom: 0,
    marginTop: 0
  },
  pickedDateContainer: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 35
  },
  btnDate:{
    backgroundColor: '#ffC0CB',
    width: '100%',
    marginLeft:'5%',
    padding: 5,
    borderRadius: 12,
    alignItems: 'center'
  },
  textStyle: {
    color: "#000000",
    fontWeight: "bold",
    textAlign: "center"
  },
  listContainer: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  buttonM: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: "45%"
  },
  buttonAddM: {
    backgroundColor: "#ffC0CB",
  },
  buttonCloseM: {
    backgroundColor: "#f30000",
    marginLeft: "5%"
  },
  textStyleM: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  caption: {
    color: 'rgba(0, 0, 0, 0.6)',
    fontSize: 15,
    marginLeft: 12,
    marginBottom: 4,
    marginTop: 10
  },
  input: {
    height: 40,
    margin: 12,
    marginTop: 0,
    borderWidth: 1,
    borderColor: '#ffC0CB',
    borderRadius: 4,
    padding: 10,
  },
  textArea: {
    margin: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#ffC0CB',
    borderRadius: 4,
    padding: 10,
  },
  datePicker: {
    width: 320,
    height: 260,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
})

export default Home