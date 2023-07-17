import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import React from "react";

const UploadImage = () => {
    

    return (
    <View style={styles.root}>
        <View style={styles.uploadContainer}>
            <Text style={styles.title}>Upload your photo</Text>
            <Text style={styles.description}>Please note to take your photo with your back to a clear wall so your background will be clean.</Text>
            <View style={styles.upload}>                
                <TouchableOpacity activeOpacity={0.5}>
                    <Text style={styles.uploadText}>Upload</Text>
                </TouchableOpacity>            
            </View>
            <TouchableOpacity activeOpacity={0.5} style={styles.takePictureButton}>
                <Text style={styles.takePictureText}>or Take picture</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
            <TouchableOpacity activeOpacity={0.5} style={styles.button}>
                <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
        </View>
    </View>
  )
};

export default UploadImage;

const styles = StyleSheet.create({
    root: {
      padding: 10,
      width: "100%",
      height: "100%",
      backgroundColor: "#0a1ed6"
    },
    uploadContainer: {
        marginTop: 15,
        padding: 10,
        backgroundColor: "#0044f7",
        borderRadius: 12.5,
        shadowOpacity: 0.5,
        shadowRadius: 25
    },
    title: {
      alignSelf: "baseline",
      fontSize: 40,
      fontWeight: "bold",
      color: "#19e3b0"
    },
    description: {
      alignSelf: "center",
      fontSize: 18,
      color: "#fff"
    },
    buttonContainer: {
      flex: 1,
      justifyContent: "flex-end"
    },
    button: {
        flexDirection: "row",
        padding: 12.5,
        paddingHorizontal: 75,
        backgroundColor: "#19e3b0",
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 25,
    },
    buttonText: {
        fontSize: 25,
    },
    upload: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,
        height: 370,
        borderRadius: 25,
        borderColor: "#fff",
        borderWidth: 3,
        borderStyle: "dashed"
    },
    uploadText: {
        color: "#fff",
        fontSize: 20
    },
    takePictureButton: {
        padding: 15,
        alignSelf: "center"
    },
    takePictureText: {
        color: "#fff",
        fontSize: 20
    }
});