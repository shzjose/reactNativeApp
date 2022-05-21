import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  View,
  Button,
  ToastAndroid
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Profile = ({ navigation, route }) => {
  const [name, setName] = useState()
  const [phone, setPhone] = useState()
  const [email, setEmail] = useState()

  React.useEffect(() => { 
    getDataUser()
    .then((valueU) => {
      console.log("VALUES", valueU)
      if (!!valueU) { setName(valueU.name);setPhone(valueU.phone);setEmail(valueU.email); } 
      else{setName("José Manuel");setPhone("452-120-1009");setEmail("jose.sanchez@sciodev.com")}
    })
    .catch((e) => console.log("ERROR", e))
  }, [])

  const handleSave = async () => {
    const UpdateUser = {name: "", phone: "", email: ""}
    UpdateUser.name = name
    UpdateUser.phone = phone 
    UpdateUser.email = email
      try {
        const jsonValue = JSON.stringify(UpdateUser)
        await AsyncStorage.setItem('User-Data', jsonValue)
      } catch (e) {
        // saving error
      }
      ToastAndroid.show('Save successful', ToastAndroid.SHORT);
  }
  const getDataUser = async () => {
    try {
      const jsonValueUser = await AsyncStorage.getItem('User-Data')
      return jsonValueUser != null ? JSON.parse(jsonValueUser) : null;
    } catch (e) {
      // error reading value
    }
  }

  return (
    <ScrollView>
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.caption}>Nombre</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        onChangeText={setName}
        value={name}
      />
      <Text style={styles.caption}>Número Teléfono</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="numeric"
        placeholder="Número Telefónico"
      />
      <Text style={styles.caption}>Correo Electrónico</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        onChangeText={setEmail}
        value={email}
      />
       <Button
        title='Guardar'
        color={"#ffC0CB"}
        onPress={handleSave}
        />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  logoImg: {
    width: 50,
    height: 50,
    resizeMode: 'stretch',
   },
  caption: {
    color: 'rgba(0, 0, 0, 0.6)',
    fontSize: 15,
    marginLeft: 12,
    marginBottom: 4,
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
  btnSave: {
    width: 20,
    backgroundColor: '#ffC0CB',
  },
});

export default Profile;