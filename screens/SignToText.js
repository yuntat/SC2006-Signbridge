import React, {useEffect, useRef, useState} from 'react';
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
    View
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {ResizeMode, Video} from 'expo-av';
import {useNavigation} from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons'; // Using Expo's vector icons

const {width} = Dimensions.get('window');

function SignToText() {
    const { t } = useTranslation();
    const [selectedVideo, setSelectedVideo] = useState(null); // Stores { uri, name, type }
    const [translationResult, setTranslationResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const videoPlayerRef = useRef(null);
    const navigation = useNavigation();

    const API_ENDPOINT = 'https://sign-language-model-jqhmm.southeastasia.inference.ml.azure.com/score';

    // Request permissions on component mount (or when needed)
    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to select videos.');
                }
            }
        })();
    }, []);

    const pickVideo = async () => {
        // Reset state before picking a new video
        setSelectedVideo(null);
        setTranslationResult('');
        setError(null);

        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                allowsEditing: false, // Editing might change format/encoding
                quality: 0.8, // Adjust quality if needed for faster uploads
            });

            // console.log('ImagePicker Result:', JSON.stringify(result, null, 2)); // Debug log

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const videoAsset = result.assets[0];

                // Extract necessary info
                const uri = videoAsset.uri;
                // Attempt to get a useful filename
                let filename = videoAsset.fileName || uri.split('/').pop() || `video-${Date.now()}.mp4`;
                // Attempt to determine MIME type (fallback needed)
                let mimeType = videoAsset.mimeType || (filename.includes('.mov') ? 'video/quicktime' : 'video/mp4');

                setSelectedVideo({
                    uri: uri,
                    name: filename,
                    type: mimeType,
                });

            } else if (!result.canceled) {
                setError("Could not select video asset.");
            }
        } catch (err) {
            console.error("ImagePicker Error:", err);
            setError("An error occurred while picking the video.");
            Alert.alert("Error", "Could not open video library.");
        }
    };

    const handleUpload = async () => {
        if (!selectedVideo || !selectedVideo.uri) {
            setError('Please select a video file first.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setTranslationResult('');

        const formData = new FormData();

        // Append the video file for the API
        // The key 'file' might need to be changed based on API requirements.
        formData.append('file', {
            uri: selectedVideo.uri,
            name: selectedVideo.name,
            type: selectedVideo.type,
        });

        // console.log("Uploading FormData:", selectedVideo); // Debug log

        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                body: formData,
                headers: {
                    // 'Content-Type': 'multipart/form-data' // Let fetch set this automatically for FormData
                },
            });

            // console.log("API Response Status:", response.status); // Debug log
            const responseText = await response.text(); // Read raw response text for debugging
            // console.log("API Response Text:", responseText);

            if (!response.ok) {
                let errorMsg = `API Error: ${response.status}`;
                try {
                    const errorData = JSON.parse(responseText); // Try parsing the text as JSON
                    errorMsg += ` - ${errorData.message || responseText}`;
                } catch (e) {
                    errorMsg += ` - ${responseText}`; // If not JSON, include raw text
                }
                throw new Error(errorMsg);
            }

            // If response is OK, parse the JSON
            const result = JSON.parse(responseText);

            if (result && result.translated_text !== undefined) {
                setTranslationResult(result.translated_text);
            } else {
                throw new Error("Invalid response format received from API.");
            }

        } catch (err) {
            console.error("Upload failed:", err);
            setError(err.message || 'An unexpected error occurred during upload.');
            setTranslationResult('');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        navigation.goBack(); // Go back to the previous screen in the stack
    };

    return (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#333"/>
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
                        Selected: {selectedVideo.name}
                    </Text>
                )}

                {/* Video Preview */}
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
                                setError("Error loading video preview.")
                            }}
                        />
                    </View>
                )}

                {/* Upload/Translate Button */}
                {selectedVideo && (
                    <TouchableOpacity
                        onPress={handleUpload}
                        style={[styles.uploadButton, (isLoading || !selectedVideo) && styles.buttonDisabled]}
                        disabled={isLoading || !selectedVideo}
                    >
                        <Text style={styles.buttonText}>{isLoading ? t('signToText.translating') : t('signToText.translateVideo')}</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Loading Indicator */}
            {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#3498db"/>
                    <Text style={styles.loadingText}>{t('signToText.processing')}</Text>
                </View>
            )}

            {/* Error Display */}
            {error && !isLoading && (
                <View style={[styles.resultArea, styles.error]}>
                    <Ionicons name="alert-circle-outline" size={24} color="#c62828" style={{marginBottom: 5}}/>
                    <Text style={styles.errorText}>Error: {error}</Text>
                </View>
            )}

            {/* Result Display */}
            {translationResult && !isLoading && !error && (
                <View style={[styles.resultArea, styles.success]}>
                    <Ionicons name="checkmark-circle-outline" size={24} color="#1b5e20" style={{marginBottom: 5}}/>
                    <Text style={styles.resultTitle}>Translation:</Text>
                    <Text style={styles.translationText}>{translationResult}</Text>
                </View>
            )}
        </ScrollView>
    );
}

// --- Styles ---
const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#f0f4f7',
    },
    container: {
        flexGrow: 1, // Allows content to scroll if it overflows
        alignItems: 'center',
        padding: 20,
        paddingTop: 60, // Extra padding for custom back button area
    },
    backButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 30, // Adjust for status bar height
        left: 15,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 20,
        zIndex: 10, // Ensure it's above other content
        // Simple shadow for visibility
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    backButtonText: {
        fontSize: 16,
        marginLeft: 5,
        color: '#333',
        fontWeight: '500',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#7f8c8d',
        marginBottom: 30,
        textAlign: 'center',
    },
    uploadArea: {
        width: '100%',
        alignItems: 'center',
        gap: 15,
        marginBottom: 25,
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 10,
    },
    selectButton: {
        backgroundColor: '#3498db',
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 8,
        width: '80%',
        alignItems: 'center',
    },
    uploadButton: {
        backgroundColor: '#2ecc71',
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 8,
        width: '80%',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonDisabled: {
        backgroundColor: '#bdc3c7',
        opacity: 0.7,
    },
    fileName: {
        fontStyle: 'italic',
        color: '#555',
        fontSize: 14,
        marginTop: 5,
        paddingHorizontal: 10,
        textAlign: 'center',
    },
    videoPreviewContainer: {
        width: width * 0.8, // 80% of screen width
        aspectRatio: 16 / 9, // Standard video aspect ratio
        marginTop: 15,
        backgroundColor: '#e0e0e0', // Placeholder background
        borderRadius: 8,
        overflow: 'hidden', // Clip the video to the border radius
    },
    videoPreview: {
        flex: 1, // Take up full space of container
    },
    loadingContainer: {
        marginTop: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 15,
        fontSize: 16,
        color: '#3498db',
        fontWeight: '500',
    },
    resultArea: {
        marginTop: 30,
        padding: 20,
        borderRadius: 10,
        width: '95%',
        alignItems: 'center',
        borderWidth: 1,
    },
    error: {
        backgroundColor: '#ffebee',
        borderColor: '#e57373',
    },
    success: {
        backgroundColor: '#e8f5e9',
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
