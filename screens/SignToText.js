import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ImageBackground
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ResizeMode, Video } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Using Expo's vector icons
import { Images, argonTheme } from '../constants';

const { width } = Dimensions.get('window');


function SignToText() {
    const { t } = useTranslation();
    const [selectedVideo, setSelectedVideo] = useState(null); // Stores { uri, name, type }
    const [translationResult, setTranslationResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const videoPlayerRef = useRef(null);
    const navigation = useNavigation();

    const API_ENDPOINT = 'https://signtotext.eastasia.cloudapp.azure.com/predict/';

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert(t('permissions.deniedTitle'), t('permissions.mediaLibraryDenied'));
                }
            }
        })();
    }, [t]); // Add t to dependency array

    const pickVideo = async () => {
        setSelectedVideo(null);
        setTranslationResult('');
        setError(null);

        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                allowsEditing: false,
                quality: 0.8, // Consider if quality reduction impacts model accuracy
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const videoAsset = result.assets[0];
                const uri = videoAsset.uri;
                let filename = videoAsset.fileName || uri.split('/').pop() || `video-${Date.now()}.mp4`;
                // Ensure a reasonable MIME type is determined
                let mimeType = videoAsset.mimeType || (filename.toLowerCase().includes('.mov') ? 'video/quicktime' : 'video/mp4');
                // Fallback if still unsure
                if (!mimeType || mimeType === 'application/octet-stream') {
                     mimeType = filename.toLowerCase().includes('.mov') ? 'video/quicktime' : 'video/mp4';
                     console.warn(`Guessed MIME type based on filename: ${mimeType}`);
                }


                setSelectedVideo({
                    uri: uri,
                    name: filename,
                    type: mimeType,
                });

            } else if (result.canceled) {
                 console.log('Video selection cancelled by user.');
            }
             else {
                setError(t('errors.couldNotSelectVideo'));
            }
        } catch (err) {
            console.error("ImagePicker Error:", err);
            setError(t('errors.videoLibraryError'));
            Alert.alert(t('common.error'), t('errors.videoLibraryError'));
        }
    };

    const handleUpload = async () => {
        if (!selectedVideo || !selectedVideo.uri || !selectedVideo.type) {
            setError(t('errors.selectVideoFirst'));
            return;
        }

        setIsLoading(true);
        setError(null);
        setTranslationResult('');

        try {
            // --- MODIFICATION START: Read file content as Blob ---
            // 1. Fetch the local video file URI
            const fileResponse = await fetch(selectedVideo.uri);
            if (!fileResponse.ok) {
                 throw new Error(`Failed to fetch local video file: ${fileResponse.status} ${fileResponse.statusText}`);
            }
            // 2. Get the content as a Blob
            const videoBlob = await fileResponse.blob();
             // console.log(`Fetched video as Blob. Size: ${videoBlob.size}, Type: ${videoBlob.type}`); // Debug log

            // Check if blob size is reasonable (optional)
            if (videoBlob.size === 0) {
                 throw new Error("Selected video file appears to be empty.");
            }



            // --- API Call Modification ---
            // Send the Blob directly as the body
            // Set the correct Content-Type from the selected video
            // Ensure the Authorization header is correctly formatted
            const formdata = new FormData()
            formdata.append('file',videoBlob);
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    // Use the MIME type detected during video selection
                    // 'Content-Type': selectedVideo.type,
                    // Correctly formatted Authorization header
                    // 'Content-Length' header is usually set automatically by fetch when using a Blob body
                    // If you encounter issues, you might try setting it explicitly:
                    // 'Content-Length': videoBlob.size.toString(),
                    'Access-Control-Allow-Origin' : '*'
                },
                // The body is now the raw video data (Blob)
                body: formdata,
            });
             // --- End API Call Modification ---


            // console.log("API Response Status:", response.status);
            const responseText = await response.text();
            // console.log("API Response Text:", responseText);

            if (!response.ok) {
                let errorMsg = `API Error: ${response.status}`;
                try {
                    // Try to parse error from backend if JSON
                    const errorData = JSON.parse(responseText);
                    errorMsg += ` - ${errorData.error || errorData.message || responseText}`;
                } catch (e) {
                    // Otherwise, use the raw text
                    errorMsg += ` - ${responseText}`;
                }
                throw new Error(errorMsg);
            }

            // Parse the successful JSON response
            const result = JSON.parse(responseText);

            if (result && result.translated_text !== undefined) {
                setTranslationResult(result.translated_text);
            } else {
                // Handle cases where backend returns 200 OK but not the expected data
                 console.warn("API response OK, but 'translated_text' field missing:", result);
                 throw new Error(t('errors.invalidApiResponseFormat'));
            }

        } catch (err) {
            console.error("Upload/Processing failed:", err);
            let displayError = err.message || t('errors.unexpectedUploadError');
             if (err.message && err.message.includes('Failed to fetch local video file')) {
                 displayError = t('errors.readFileError');
             } else if (err.message && err.message.includes('Network request failed')) {
                 displayError = t('errors.networkRequestFailed', { endpoint: API_ENDPOINT });
             }
            setError(displayError);
            setTranslationResult('');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        navigation.goBack();
    };



    return (
        <ImageBackground
            source={Images.Onboarding}
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
                {/* Back Button */}
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="white"/>
                    <Text style={styles.backButtonText}>{t('ui.back')}</Text>
                </TouchableOpacity>

                <Text style={styles.title}>{t('signToText.title')}</Text>
                <Text style={styles.subtitle}>{t('signToText.subtitle')}</Text>

                <View style={styles.uploadArea}>
                    <TouchableOpacity onPress={pickVideo} style={styles.selectButton} disabled={isLoading}>
                       <Text style={styles.buttonText}>{selectedVideo ? t('signToText.changeVideo') : t('signToText.selectVideo')}</Text>
                    </TouchableOpacity>

                    {selectedVideo && (
                        <Text style={styles.fileName} numberOfLines={1} ellipsizeMode="middle">
                            Selected: {selectedVideo.name} ({selectedVideo.type})
                        </Text>
                    )}

                    {selectedVideo?.uri && !isLoading && (
                        <View style={styles.videoPreviewContainer}>
                            <Video
                                ref={videoPlayerRef}
                                style={styles.videoPreview}
                                source={{uri: selectedVideo.uri}}
                                useNativeControls
                                resizeMode={ResizeMode.CONTAIN}
                                isLooping={false}
                                onError={(error) => {
                                    console.log("Video Player Error:", error);
                                    setError(t('errors.videoPreviewError'))
                                }}
                            />
                        </View>
                    )}

                    {selectedVideo && (
                        <TouchableOpacity
                            onPress={handleUpload}
                            style={[styles.uploadButton, (isLoading || !selectedVideo) && styles.buttonDisabled]}
                            disabled={isLoading || !selectedVideo}
                        >
                            <Text style={styles.buttonText}>
                                {isLoading ? t('signToText.translating') : t('signToText.translateVideo')}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                {isLoading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={argonTheme.COLORS.PRIMARY}/>
                        <Text style={styles.loadingText}>{t('signToText.processing')}</Text>
                    </View>
                )}

                {error && !isLoading && (
                    <View style={[styles.resultArea, styles.error]}>
                        <Ionicons name="alert-circle-outline" size={24} color="#c62828" style={{marginBottom: 5}}/>
                        <Text style={styles.errorText}>{t('common.error')}: {error}</Text>
                    </View>
                )}

                {translationResult && !isLoading && !error && (
                    <View style={[styles.resultArea, styles.success]}>
                        <Ionicons name="checkmark-circle-outline" size={24} color="#1b5e20" style={{marginBottom: 5}}/>
                        <Text style={styles.resultTitle}>{t('signToText.translationResultTitle')}:</Text>
                        <Text style={styles.translationText}>{translationResult}</Text>
                    </View>
                )}
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    scrollView: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    container: {
        flexGrow: 1,
        alignItems: 'center',
        padding: 20,
        paddingTop: 60,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    backButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 30,
        left: 15,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 20,
        zIndex: 10,
    },
    backButtonText: {
        fontSize: 16,
        marginLeft: 5,
        color: 'white',
        fontWeight: '500',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 8,
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 3,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 30,
        textAlign: 'center',
    },
    uploadArea: {
        width: '100%',
        alignItems: 'center',
        gap: 15,
        marginBottom: 25,
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 10,
    },
    selectButton: {
        backgroundColor: argonTheme.COLORS.DEFAULT,
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 8,
        width: '80%',
        alignItems: 'center',
    },
    uploadButton: {
        backgroundColor: argonTheme.COLORS.SUCCESS,
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 8,
        width: '80%',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonDisabled: {
        backgroundColor: '#bdc3c7',
        opacity: 0.7,
    },
    fileName: {
        fontStyle: 'italic',
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
        marginTop: 5,
        paddingHorizontal: 10,
        textAlign: 'center',
    },
    videoPreviewContainer: {
        width: width * 0.8,
        aspectRatio: 16 / 9,
        marginTop: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 8,
        overflow: 'hidden',
    },
    videoPreview: {
        flex: 1,
    },
    loadingContainer: {
        marginTop: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 15,
        fontSize: 16,
        color: 'white',
        fontWeight: '500',
    },
    resultArea: {
        marginTop: 30,
        padding: 20,
        borderRadius: 10,
        width: '95%',
        alignItems: 'center',
        borderWidth: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    error: {
        borderColor: '#e57373',
    },
    success: {
        borderColor: '#a5d6a7',
    },
    errorText: {
        color: '#c62828',
        fontSize: 15,
        textAlign: 'center',
    },
    resultTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1b5e20',
        marginBottom: 10,
    },
    translationText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#333',
        lineHeight: 26,
        textAlign: 'center',
    },
});


export default SignToText;