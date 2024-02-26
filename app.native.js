// Import necessary modules from React Native
import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import SoundRecorder from 'react-native-sound-recorder';
import MFCC from 'react-native-mfcc';

// Function to generate MFCCs from audio data
const generateMFCCs = async () => {
  // Record sound for 5 seconds
  SoundRecorder.start();
  await new Promise(resolve => setTimeout(resolve, 5000));
  const filePath = await SoundRecorder.stop();

  // Generate MFCCs from the recorded audio
  const mfccs = await MFCC(filePath);
  return mfccs;
};

// Function to send MFCCs data to backend server
const sendDataToServer = async (mfccs) => {
  // Format MFCCs data into JSON
  const data = { mfccs };

  // Send data to backend server
  try {
    const response = await fetch('https://your-backend-server-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    const responseData = await response.json();
    console.log('Response from server:', responseData);
  } catch (error) {
    console.error('Error sending data to server:', error);
  }
};

// Main App component
const App = () => {
  const [mfccs, setMFCCs] = useState(null);

  // Function to handle button press
  const handleButtonPress = async () => {
    try {
      const generatedMFCCs = await generateMFCCs();
      setMFCCs(generatedMFCCs);
      sendDataToServer(generatedMFCCs);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Render the component
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ marginBottom: 20 }}>MFCCs Data:</Text>
      {mfccs ? (
        <Text>{JSON.stringify(mfccs)}</Text>
      ) : (
        <Text>No MFCCs data available</Text>
      )}
      <Button title="Generate and Send MFCCs" onPress={handleButtonPress} />
    </View>
  );
};

export default App;
