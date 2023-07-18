import { View, Text, TouchableOpacity, Image } from "react-native";
import { Camera, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from "react";
import * as Animatable from 'react-native-animatable';

const UploadImage = ({imageUri, setImageUri, setIsImageUploaded}: {imageUri: string, setImageUri: React.Dispatch<React.SetStateAction<string>>, setIsImageUploaded: React.Dispatch<React.SetStateAction<boolean>>}) => {
    const [isCameraOn, setIsCameraOn] = useState<boolean>(false);
    const [cameraParmission, requestCameraPermission] = Camera.useCameraPermissions();
    const [mediaLibPermission, requestMediaLibPermission] = ImagePicker.useMediaLibraryPermissions();

    const pickImage = async () => {
      
        if(!mediaLibPermission) return;
        
        if(!mediaLibPermission.granted) {
            const response = await requestMediaLibPermission();

            if(!response.granted) return;
        }

        const options = {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspects: [4, 3],
            quality: 1
        };
  
        ImagePicker.launchImageLibraryAsync(options)
        .then(result => {
            const uri = result.assets ? result.assets[0]?.uri : null;
            if(uri === undefined || uri === null) return;
            
            setImageUri(uri);
        })
        .catch(e => console.log(e));
    };

    const takePicture = async () => {
      
        if(!cameraParmission) return;
        
        if(!cameraParmission.granted) {
            const response = await requestCameraPermission();

            if(!response.granted) return;
        }

        setIsCameraOn(prev => prev = true);
    };
    
    return (
    <View className="bg-sky-300 p-2 w-full h-full">
        <Animatable.Text className="text-yellow-400 text-4xl font-bold self-baseline mt-5" animation="fadeInDown">Upload your photo</Animatable.Text>
        <Animatable.Text className="text-white self-baseline text-lg" animation="flipInY">Please note to take your photo with your back to a clear wall so your background will be clean.</Animatable.Text>
        <Animatable.View className=" mt-4 p-3 bg-sky-400 rounded-3xl" animation="fadeInUp">
            {
                imageUri === "" ? 
                (
                <View className="items-center justify-center mt-8 h-96 border-white border-dashed border-2">  
                    <TouchableOpacity onPress={pickImage} activeOpacity={0.5}>
                        <Text className="text-white text-xl">Upload</Text>
                    </TouchableOpacity>              
                </View>   
                ) : 
                (
                    // <Camera className="w-full mt-8 h-96 rounded-3xl" onFacesDetected={(faces) => { if(faces.faces.length > 0)console.log("detected")}} type={CameraType.front}>

                    // </Camera>
                    <Image className="w-full mt-8 h-96 rounded-3xl" source={{uri: imageUri}} />                
                )
            } 
            <TouchableOpacity onPress={imageUri === "" ? takePicture: () => {setImageUri(prev => prev = "")}} activeOpacity={0.5} className="p-4 self-center">
                <Text className="text-white text-xl">{imageUri === "" ? "or Take picture" : "Cancel"}</Text>
            </TouchableOpacity>
        </Animatable.View>
        <Animatable.View className="flex-1 justify-end" animation="slideInUp">
            <TouchableOpacity onPress={() => setIsImageUploaded(prev => prev = true)} activeOpacity={0.5} className="p-3 px-20 bg-yellow-400 self-center items-center justify-center rounded-3xl">
                <Text className="text-2xl">Next</Text>
            </TouchableOpacity>
        </Animatable.View>
    </View>
  )
};

export default UploadImage;