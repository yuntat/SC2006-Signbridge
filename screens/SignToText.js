import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Platform,
    ScrollView, // Keep using ScrollView for content
    StyleSheet,
    Text,
    TouchableOpacity,
    View // Keep regular View for non-animated containers if needed
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ResizeMode, Video } from 'expo-av';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import { Ionicons } from '@expo/vector-icons';

// Import Reanimated components and hooks
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    Easing,
    interpolate, // Useful for more complex animations
    Extrapolate,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

// --- Create Animated Components ---
// We wrap the components we want to animate.
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedView = Animated.View;
const AnimatedText = Animated.Text;
// You can even animate the Video component if needed, but let's focus on containers/text first
// const AnimatedVideo = Animated.createAnimatedComponent(Video);

function SignToText() {
    const { t } = useTranslation();
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [translationResult, setTranslationResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const videoPlayerRef = useRef(null);
    const navigation = useNavigation();

    const API_ENDPOINT = 'https://sign-language-model-jqhmm.southeastasia.inference.ml.azure.com/score';

    // --- Animation Shared Values ---
    // These values will drive the animations. Initialize them to the 'start' state.
    const titleOpacity = useSharedValue(0);
    const titleTranslateY = useSharedValue(30); // Start 30px down

    const subtitleOpacity = useSharedValue(0);
    const subtitleTranslateY = useSharedValue(30); // Start 30px down

    const uploadAreaOpacity = useSharedValue(0);
    const uploadAreaScale = useSharedValue(0.9); // Start slightly smaller

    const backButtonOpacity = useSharedValue(0);

    // --- Trigger Animations on Screen Focus ---
    // useFocusEffect runs every time the screen comes into focus
    useFocusEffect(
        React.useCallback(() => {
            // Define animation timing and easing
            const timingConfig = {
                duration: 600,
                easing: Easing.out(Easing.exp), // Smooth easing out
            };
            const delayMs = 150; // Stagger delay

            // Reset values instantly before animating (important for refocus)
            titleOpacity.value = 0;
            titleTranslateY.value = 30;
            subtitleOpacity.value = 0;
            subtitleTranslateY.value = 30;
            uploadAreaOpacity.value = 0;
            uploadAreaScale.value = 0.9;
            backButtonOpacity.value = 0;

            // Start animations with delays for staggering effect
            backButtonOpacity.value = withDelay(delayMs * 0, withTiming(1, { duration: 400 })); // Faster fade for utility button
            titleOpacity.value = withDelay(delayMs * 1, withTiming(1, timingConfig));
            titleTranslateY.value = withDelay(delayMs * 1, withTiming(0, timingConfig));

            subtitleOpacity.value = withDelay(delayMs * 2, withTiming(1, timingConfig));
            subtitleTranslateY.value = withDelay(delayMs * 2, withTiming(0, timingConfig));

            uploadAreaOpacity.value = withDelay(delayMs * 3, withTiming(1, { duration: 700 })); // Slightly longer duration for the main block
            uploadAreaScale.value = withDelay(delayMs * 3, withTiming(1, { duration: 700, easing: Easing.out(Easing.back(1.2)) })); // Add a little overshoot with Easing.back

            // Cleanup function (optional but good practice if needed)
            return () => {
                // You could potentially reset animations here if needed when leaving screen,
                // but useFocusEffect handles the re-triggering on focus well.
            };
        }, []) // Empty dependency array ensures this setup runs once per focus mount
    );

    // --- Animated Styles ---
    // These styles react to changes in shared values
    const animatedTitleStyle = useAnimatedStyle(() => {
        return {
            opacity: titleOpacity.value,
            transform: [{ translateY: titleTranslateY.value }],
        };
    });

    const animatedSubtitleStyle = useAnimatedStyle(() => {
        return {
            opacity: subtitleOpacity.value,
            transform: [{ translateY: subtitleTranslateY.value }],
        };
    });

    const animatedUploadAreaStyle = useAnimatedStyle(() => {
        return {
            opacity: uploadAreaOpacity.value,
            transform: [{ scale: uploadAreaScale.value }],
        };
    });

     const animatedBackButtonStyle = useAnimatedStyle(() => {
        return {
            opacity: backButtonOpacity.value,
        };
    });


    // Request permissions (keeping original useEffect for this)
    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to select videos.');
                }
            }
        })();
    }, []);

    const pickVideo = async () => {
        setSelectedVideo(null);
        setTranslationResult('');
        setError(null);
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                allowsEditing: false,
                quality: 0.8,
            });
            if (!result.canceled && result.assets && result.assets.length > 0) {
                const videoAsset = result.assets[0];
                const uri = videoAsset.uri;
                let filename = videoAsset.fileName || uri.split('/').pop() || `video-${Date.now()}.mp4`;
                let mimeType = videoAsset.mimeType || (filename.includes('.mov') ? 'video/quicktime' : 'video/mp4');
                setSelectedVideo({ uri, name: filename, type: mimeType });
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
        formData.append('file', {
            uri: selectedVideo.uri,
            name: selectedVideo.name,
            type: selectedVideo.type,
        });
        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                body: formData,
            });
            const responseText = await response.text();
            if (!response.ok) {
                let errorMsg = `API Error: ${response.status}`;
                try {
                    const errorData = JSON.parse(responseText);
                    errorMsg += ` - ${errorData.message || responseText}`;
                } catch (e) { errorMsg += ` - ${responseText}`; }
                throw new Error(errorMsg);
            }
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
        navigation.goBack();
    };

    return (
        // Use ScrollView for content that might exceed screen height
        <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false} // Hide scrollbar if desired
        >
            {/* --- Use Animated Components for Animated Elements --- */}

            {/* Animate Back Button */}
            <AnimatedTouchableOpacity
                onPress={handleBack}
                style={[styles.backButton, animatedBackButtonStyle]} // Combine original and animated styles
            >
                <Ionicons name="arrow-back" size={24} color="#333" />
                <AnimatedText style={styles.backButtonText}>{t('ui.back')}</AnimatedText>
            </AnimatedTouchableOpacity>

            {/* Animate Title */}
            <AnimatedText style={[styles.title, animatedTitleStyle]}>
                {t('signToText.title')}
            </AnimatedText>

            {/* Animate Subtitle */}
            <AnimatedText style={[styles.subtitle, animatedSubtitleStyle]}>
                {t('signToText.subtitle')}
            </AnimatedText>

            {/* Animate the whole Upload Area Block */}
            <AnimatedView style={[styles.uploadArea, animatedUploadAreaStyle]}>
                {/* Children of AnimatedView don't need separate animation unless desired */}
                <TouchableOpacity onPress={pickVideo} style={styles.selectButton} disabled={isLoading}>
                    <Text style={styles.buttonText}>{selectedVideo ? t('signToText.changeVideo') : t('signToText.selectVideo')}</Text>
                </TouchableOpacity>

                {selectedVideo && (
                    <Text style={styles.fileName} numberOfLines={1} ellipsizeMode="middle">
                        Selected: {selectedVideo.name}
                    </Text>
                )}

                {selectedVideo?.uri && !isLoading && (
                    <View style={styles.videoPreviewContainer}>
                        <Video
                            ref={videoPlayerRef}
                            style={styles.videoPreview}
                            source={{ uri: selectedVideo.uri }}
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

                {selectedVideo && (
                    <TouchableOpacity
                        onPress={handleUpload}
                        style={[styles.uploadButton, (isLoading || !selectedVideo) && styles.buttonDisabled]}
                        disabled={isLoading || !selectedVideo}
                    >
                        <Text style={styles.buttonText}>{isLoading ? t('signToText.translating') : t('signToText.translateVideo')}</Text>
                    </TouchableOpacity>
                )}
            </AnimatedView>

            {/* --- Non-Animated Sections (or add fade-in on state change later) --- */}
            {isLoading && (
                 // You could wrap this in AnimatedView and fade it in when isLoading becomes true
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#3498db" />
                    <Text style={styles.loadingText}>{t('signToText.processing')}</Text>
                </View>
            )}

            {error && !isLoading && (
                 // You could wrap this in AnimatedView and fade it in when error becomes true
                <View style={[styles.resultArea, styles.error]}>
                    <Ionicons name="alert-circle-outline" size={24} color="#c62828" style={{ marginBottom: 5 }} />
                    <Text style={styles.errorText}>Error: {error}</Text>
                </View>
            )}

            {translationResult && !isLoading && !error && (
                 // You could wrap this in AnimatedView and fade it in when result becomes true
                <View style={[styles.resultArea, styles.success]}>
                    <Ionicons name="checkmark-circle-outline" size={24} color="#1b5e20" style={{ marginBottom: 5 }} />
                    <Text style={styles.resultTitle}>Translation:</Text>
                    <Text style={styles.translationText}>{translationResult}</Text>
                </View>
            )}
        </ScrollView>
    );
}

// --- Styles (Keep existing styles, they apply to the base components) ---
const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#f0f4f7',
    },
    container: {
        flexGrow: 1,
        alignItems: 'center',
        padding: 20,
        paddingTop: 80, // Increased top padding to ensure title/subtitle animation space
        paddingBottom: 50, // Add padding at the bottom too
    },
    backButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 30,
        left: 15,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Make slightly transparent for cool effect
        borderRadius: 20,
        zIndex: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
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
        fontSize: 28, // Slightly larger
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 10, // Adjusted spacing
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 17, // Slightly larger
        color: '#7f8c8d',
        marginBottom: 35, // Adjusted spacing
        textAlign: 'center',
        paddingHorizontal: 10, // Prevent long text hitting edges during animation
    },
    uploadArea: {
        width: '100%',
        alignItems: 'center',
        gap: 15, // Use gap for spacing if supported, otherwise use margins
        marginBottom: 25,
        padding: 20,
        backgroundColor: '#ffffff', // Solid white background
        borderRadius: 12, // Slightly more rounded
         // Add shadow for depth
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 3.84,
        elevation: 5,
    },
    selectButton: {
        backgroundColor: '#3498db',
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 8,
        width: '90%', // Wider button
        alignItems: 'center',
        shadowColor: "#000", // Button shadow
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    uploadButton: {
        backgroundColor: '#2ecc71',
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 8,
        width: '90%', // Wider button
        alignItems: 'center',
        marginTop: 10,
         shadowColor: "#000", // Button shadow
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
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
        width: width * 0.85, // Slightly larger preview
        aspectRatio: 16 / 9,
        marginTop: 15,
        backgroundColor: '#e0e0e0',
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
        // Add shadow to result/error areas too
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2.22,
        elevation: 3,
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