import React from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera';
import { useInventory } from "../context/InventoryContext";
import { useNavigation } from "@react-navigation/native";

export default function ScannerScreen() {
  const [scanned, setScanned] = React.useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const { scanCode } = useInventory();
  const navigation = useNavigation();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const onBarcodeScanned = async (data: BarcodeScanningResult) => {
    if (scanned || !scanCode) {
      return;
    }
    setScanned(true);

    const res = await scanCode(data.data);
    if (res) {
      navigation.navigate('Item' as never);
    }

    setTimeout(() => {
      setScanned(false);
    }, 5000);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        barcodeScannerSettings={{
          barcodeTypes: ["code128"],
        }}
        onBarcodeScanned={onBarcodeScanned}
      >
        <View style={styles.barcodeOverlay}>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  barcodeOverlay: {
    width: '80%',
    height: '20%',
    borderWidth: 2,
    borderColor: 'white',
    position: 'absolute',
    top: '40%',
    left: '10%',
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
