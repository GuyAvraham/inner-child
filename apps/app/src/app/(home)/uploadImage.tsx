import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import React from "react";

const UploadImage = () => {
    

    const pickImage = () => {
      
        const options = {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspects: [4, 3],
            quality: 1
        };
  
        ImagePicker.launchImageLibraryAsync(options)
        .then(result => {
            
        })
        .catch(e => console.log(e));
    };

    return (
    <View className="bg-sky-300 p-2 w-full h-full">
        <Text className="text-yellow-400 text-4xl font-bold self-baseline mt-5">Upload your photo</Text>
        <Text className="text-white self-baseline text-lg">Please note to take your photo with your back to a clear wall so your background will be clean.</Text>
        <View className=" mt-4 p-3 bg-sky-400 rounded-3xl ">
            <View className="items-center justify-center mt-8 h-96 border-white border-dashed border-2">                
                <TouchableOpacity onPress={pickImage} activeOpacity={0.5}>
                    <Text className="text-white text-xl">Upload</Text>
                </TouchableOpacity>            
            </View>
            <TouchableOpacity activeOpacity={0.5} className="p-4 self-center">
                <Text className="text-white text-xl">or Take picture</Text>
            </TouchableOpacity>
        </View>
        <View className="flex-1 justify-end">
            <TouchableOpacity activeOpacity={0.5} className="p-3 px-20 bg-yellow-400 self-center items-center justify-center rounded-3xl">
                <Text className="text-2xl">Next</Text>
            </TouchableOpacity>
        </View>
    </View>
  )
};

export default UploadImage;

const styles = StyleSheet.create({
    takePictureButton: {
        padding: 15,
        alignSelf: "center"
    }
});