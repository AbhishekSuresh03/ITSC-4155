import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Modal, Button } from 'react-native';
import Slider from '@react-native-community/slider';
import MapView, { Polyline } from 'react-native-maps';

const SubmitTrailModal = ({
  visible,
  onClose,
  onSave,
  onDiscard,
  formData,
  handleInputChange,
  pickPrimaryImage,
  pickImages,
  routeCoordinates,
  mapRef,
  onReplaceImage,
}) => {
  const difficultyLevels = ["Very Easy", "Easy", "Moderate", "Hard", "Very Hard", "Extreme"];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <Text style={styles.modalTitle}>Trail Details</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter the trail name"
              value={formData.name}
              onChangeText={(text) => handleInputChange('name', text)}
              placeholderTextColor="#A9A9A9"
            />

            <TextInput
              style={[styles.input, styles.descriptionInput]}
              placeholder="Enter a description"
              value={formData.description}
              onChangeText={(text) => handleInputChange('description', text)}
              placeholderTextColor="#A9A9A9"
              multiline
            />

            <MapView
              ref={mapRef}
              style={styles.map}
              mapType="satellite"
              onLayout={() => {
                if (routeCoordinates && routeCoordinates.length > 0) {
                  mapRef.current.fitToCoordinates(routeCoordinates, {
                    edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                    animated: true,
                  });
                }
              }}
            >
              <Polyline
                coordinates={routeCoordinates}
                strokeWidth={3}
                strokeColor="#007AFF"
              />
            </MapView>

            <TouchableOpacity style={styles.coverPhotoContainer} onPress={pickPrimaryImage}>
              {formData.primaryImage ? (
                <Image source={{ uri: formData.primaryImage }} style={styles.coverPhoto} />
              ) : (
                <Text style={styles.coverPhotoPlaceholder}>Upload Cover Photo</Text>
              )}
            </TouchableOpacity>

            <ScrollView horizontal style={styles.extraImagesContainer}>
              {formData.images.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.extraImageWrapper}
                  onPress={() => pickImages(index)} // Replace the image at the specified index
                >
                  <Image source={{ uri: image }} style={styles.extraImage} />
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.addImageBox} onPress={() => pickImages()}>
                <Text style={styles.addImageText}>+</Text>
              </TouchableOpacity>
            </ScrollView>


            <Text style={styles.label}>Difficulty:</Text>
            <View style={styles.difficultyContainer}>
              {difficultyLevels.map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.difficultyButton,
                    formData.difficulty === level && styles.selectedDifficultyButton,
                  ]}
                  onPress={() => handleInputChange('difficulty', level)}
                >
                  <Text
                    style={[
                      styles.difficultyText,
                      formData.difficulty === level && styles.selectedDifficultyText,
                    ]}
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Rating: {formData.rating.toFixed(1)}</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={5}
              step={0.1}
              value={formData.rating}
              onValueChange={(value) => handleInputChange('rating', Math.round(value * 10) / 10)}
              minimumTrackTintColor="#1EB1FC"
              maximumTrackTintColor="#d3d3d3"
              thumbTintColor="#1EB1FC"
            />

            <TouchableOpacity style={styles.submitButton} onPress={onSave}>
              <Text style={styles.submitButtonText}>Save Trail</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.discardButton} onPress={onDiscard}>
              <Text style={styles.discardButtonText}>Discard Trail</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxHeight: '90%',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
  descriptionInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  map: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  coverPhotoContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  coverPhoto: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  coverPhotoPlaceholder: {
    fontSize: 14,
    color: '#888',
  },
  extraImagesContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  extraImageWrapper: {
    marginRight: 10,
  },
  extraImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  addImageBox: {
    width: 80,
    height: 80,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageText: {
    fontSize: 30,
    color: '#888',
  },
  difficultyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  difficultyButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    margin: 5,
  },
  selectedDifficultyButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  difficultyText: {
    fontSize: 14,
    color: '#000',
  },
  selectedDifficultyText: {
    color: '#fff',
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  discardButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  discardButtonText: {
    color: 'red',
    fontSize: 18,
  },
});

export default SubmitTrailModal;
