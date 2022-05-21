import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  ScrollView,
  Image,
  Pressable,
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker';

const Details = ({ navigation, route }) => {
  const reminder = route.params.reminder
  const [title, setTitle] = useState(reminder.title)
  const [notes, setNotes] = useState(reminder.notes)
  const [isPickerDShow, setIsPickerDShow] = useState(false);
  const [isPickerTShow, setIsPickerTShow] = useState(false);
  const [date, setDate] = useState(new Date(reminder.date));
  const [time, setTime] = useState(new Date(reminder.time));

  const handleSave = () => {
    const newReminder = { ...reminder }
    newReminder.title = title
    newReminder.notes = notes
    newReminder.date = date.toUTCString() 
    newReminder.time = time.toUTCString()
    route.params.saveReminder(newReminder)
    navigation.goBack()
  }
  const showPicker = () => {
    setIsPickerDShow(true);
    setIsPickerTShow(true);
  };

  const onChange = (event, value) => {
    setDate(value);
    if (Platform.OS === 'android') {
      setIsPickerDShow(false);
    }
  };
  const onChangetime = (event, value) => {
    setTime(value);
    if (Platform.OS === 'android') {
      setIsPickerTShow(false);
    }
  };


  return (
    <ScrollView style={styles.container}>
     <View style={styles.form}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.caption}>Título</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Nuevo título"
        />
        <Text style={styles.caption}>Descripción</Text>
        <TextInput
          style={styles.textArea}
          multiline
          value={notes}
          onChangeText={setNotes}
          textAlignVertical="top"
          numberOfLines={3}
          placeholder="Escribe tu nueva descripción aquí"
        />
      </View>
      {(!isPickerDShow && !isPickerTShow) && (
        <View>
          <Pressable style={styles.btnDate} onPress={showPicker} ><Text style={{color: 'white', fontSize: 18}}>Establecer Fecha</Text></Pressable>
        </View>
      )}

      {isPickerDShow && (
        <DateTimePicker
        value={date}
        mode={'date'} 
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        is24Hour={true}
        onChange={onChange}
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
      <Button
        title='Guardar'
        color={"#ffC0CB"}
        onPress={handleSave}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  header:{
    backgroundColor: '#008aff',
    width: '100%',
    marginBottom: 15
  },
  btnDate:{
    backgroundColor: '#000000',
    width: '60%',
    marginLeft:'18%',
    marginBottom: 20,
    padding: 10,
    borderRadius: 12,
    alignItems: 'center'
  },
  logoItem: {
    fontWeight:'bold', 
    fontSize: 17, 
    color: "white", 
    padding: 20, 
    marginTop:-30
  },
  logoImg: {
    width: 50,
    height: 50,
    resizeMode: 'stretch',
   },
  form: {
    padding: 12,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#435460',
    textAlign: 'center',
    marginBottom: 20,
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
  pickedDateContainer: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 10,
    marginBottom: 35
  },
  pickedDate: {
    fontSize: 18,
    color: 'black',
  },
  btnContainer: {
    padding: 30,
  },
  datePicker: {
    width: 320,
    height: 260,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});

export default Details