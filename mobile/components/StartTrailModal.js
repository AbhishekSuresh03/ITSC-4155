import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadTrailPic } from '../service/fileService';
import { createTrail } from '../service/trailService';
import { AuthContext } from '../context/AuthContext';

export default function StartTrailModalScreen({ navigation }) {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [rating, setRating] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [length, setLength] = useState('');
  const [time, setTime] = useState('');
  const [pace, setPace] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const[primaryImage, setPrimaryImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const { user } = useContext(AuthContext); // Access user and logout from AuthContext

  const pickImages = async () => {
    console.log('Pick image button pressed');
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      allowsEditing: true,
      aspect: [1, 1], // Set aspect ratio to 1:1 for a square crop
      quality: 1,
    });

    console.log('Image picker result:', result);

    if (!result.canceled) {
      const uploadedImages = images.slice(); //clearing the array
      //uploading each image individually
      // const downloadURL = await uploadTrailPic(result.assets[0].uri);
      for (let image of result.assets || []) {
        // console.log("START TRAIL: " + image.uri);
        const downloadURL = await uploadTrailPic(image.uri);
        console.log('StartTrailModal' + downloadURL);
        uploadedImages.push(downloadURL); //adding the url to the array
      }
      setImages(uploadedImages); //updating the state with the array of urls
    } else {
      console.log('Image picking canceled');
    }
  };
  const pickPrimaryImage = async () => {
    console.log('Pick image button pressed');
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      allowsEditing: true,
      aspect: [1, 1], // Set aspect ratio to 1:1 for a square crop
      quality: 1,
    });
    if (!result.canceled) {
      const downloadURL = await uploadTrailPic(result.assets[0].uri);
      setPrimaryImage(downloadURL); 
    } else {
      console.log('Image picking canceled');
    }
  };

  const handleSubmit = async () => {
    const formData = {
      name,
      city,
      state,
      rating: parseFloat(rating),
      difficulty,
      length: parseFloat(length),
      time: parseFloat(time),
      pace: parseFloat(pace),
      images,
      primaryImage,
      date: new Date(),
      description,
    };

    try {
      await createTrail(formData, user.id);
      navigation.goBack();
    } catch (error) {
      console.error('Failed to create trail:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="City" value={city} onChangeText={setCity} />
      <TextInput style={styles.input} placeholder="State" value={state} onChangeText={setState} />
      <TextInput style={styles.input} placeholder="Rating" value={rating} onChangeText={setRating} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Difficulty" value={difficulty} onChangeText={setDifficulty} />
      <TextInput style={styles.input} placeholder="Length" value={length} onChangeText={setLength} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Time" value={time} onChangeText={setTime} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Pace" value={pace} onChangeText={setPace} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} multiline />
      <Button title="Upload Primary Image" onPress={pickPrimaryImage} />
      <Button title="Upload Images" onPress={pickImages} />
      <Button title="Create Trail" onPress={handleSubmit} />
      <Text style={styles.uploadedImagesTitle}>Uploaded Primary Image:</Text>
      <Image source={{ uri: primaryImage }} style={styles.uploadedImage} />
      <Text style={styles.uploadedImagesTitle}>Uploaded Images:</Text>
      {images.length > 0 && (
        <View style={styles.uploadedImagesContainer}>
          <ScrollView horizontal>
          {images.map((image, index) => {
            // console.log(`Image URL ${index}: ${image}`);
            return <Image key={index} source={{ uri: image }} style={styles.uploadedImage} />;
          })}
          </ScrollView>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 8,
    marginBottom: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    marginBottom: 10,
  },
  uploadedImagesContainer: {
    marginTop: 20,
  },
  uploadedImagesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  uploadedImage: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
});