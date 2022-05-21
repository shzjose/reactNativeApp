import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  TouchableOpacity,
} from 'react-native';
import style from 'react-native-datepicker/style';


const ListItem = ({ reminder, deleteReminder, openDetails }) => {
  return (
    <TouchableOpacity onPress={() => openDetails(reminder)}>
      <View style={styles.item}>
        <Text style={styles.itemText}>{reminder.id} - {reminder.title}{"\n"}<Text style={styles.date}>Date: {reminder.date.substring(0, 16)}  {reminder.time.substring(17, 22)}</Text></Text>
        <Button
          style={style.btnDelete}
          title='Borrar'
          color='#8A0808'
          onPress={() => deleteReminder(reminder)}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 10,
    height: 70,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(67,84,96,0.15)',
    backgroundColor: "#fff",
    marginTop: 10
  },
  itemText: {
    fontSize: 18,
  },
  date: {
    fontSize: 14,
    color: '#00000077'
  },
  btnDelete: {
    borderRadius: '20px',
  }
});

export default ListItem;