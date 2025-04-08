import React, { useState } from 'react';
import {
    Button, // We'll replace this with TouchableOpacity for better styling
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity, // Import TouchableOpacity
    Platform, // For platform-specific styles like shadows
    Keyboard, // To dismiss keyboard
} from 'react-native';

import * as Animatable from 'react-native-animatable'; // Import Animatable

// Static image map (remains the same)
const signImages = {
    A: require('../assets/imgs/sign_images/A.png'),
    B: require('../assets/imgs/sign_images/B.png'),
    C: require('../assets/imgs/sign_images/C.png'),
    D: require('../assets/imgs/sign_images/D.png'),
    E: require('../assets/imgs/sign_images/E.png'),
    F: require('../assets/imgs/sign_images/F.png'),
    G: require('../assets/imgs/sign_images/G.png'),
    H: require('../assets/imgs/sign_images/H.png'),
    I: require('../assets/imgs/sign_images/I.png'),
    J: require('../assets/imgs/sign_images/J.png'),
    K: require('../assets/imgs/sign_images/K.png'),
    L: require('../assets/imgs/sign_images/L.png'),
    M: require('../assets/imgs/sign_images/M.png'),
    N: require('../assets/imgs/sign_images/N.png'),
    O: require('../assets/imgs/sign_images/O.png'),
    P: require('../assets/imgs/sign_images/P.png'),
    Q: require('../assets/imgs/sign_images/Q.png'),
    R: require('../assets/imgs/sign_images/R.png'),
    S: require('../assets/imgs/sign_images/S.png'),
    T: require('../assets/imgs/sign_images/T.png'),
    U: require('../assets/imgs/sign_images/U.png'),
    V: require('../assets/imgs/sign_images/V.png'),
    W: require('../assets/imgs/sign_images/W.png'),
    X: require('../assets/imgs/sign_images/X.png'),
    Y: require('../assets/imgs/sign_images/Y.png'),
    Z: require('../assets/imgs/sign_images/Z.png'),
};

// Create an Animatable View component for easier use
const AnimatableView = Animatable.createAnimatableComponent(View);

const TextToSign = () => {
    const [inputText, setInputText] = useState('');
    const [letters, setLetters] = useState([]);

    const handleTranslate = () => {
        Keyboard.dismiss(); // Dismiss keyboard on translate
        const filtered = inputText
            .toUpperCase()
            .split('')
            .filter(char => /[A-Z ]/.test(char)); // allow A-Z and spaces
        setLetters(filtered); // Set the letters to trigger re-render and animations
    };

    return (
        <View style={styles.container}>
            <Animatable.Text
                animation="fadeInDown"
                duration={800}
                style={styles.title}>
                Text to Sign 🤟 Translator
            </Animatable.Text>

            <AnimatableView animation="fadeInUp" duration={600} delay={200}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a word like 'HELLO'"
                    placeholderTextColor="#A0AEC0" // Softer placeholder text
                    value={inputText}
                    onChangeText={setInputText}
                    autoCapitalize="characters" // Suggest uppercase
                    clearButtonMode="while-editing" // iOS clear button
                />
            </AnimatableView>

            <AnimatableView animation="fadeInUp" duration={600} delay={400}>
                <TouchableOpacity
                    style={styles.translateButton}
                    onPress={handleTranslate}
                    activeOpacity={0.7} // Visual feedback on press
                >
                    <Text style={styles.translateButtonText}>Translate</Text>
                </TouchableOpacity>
            </AnimatableView>

            {/* Only show ScrollView if there are letters to display */}
            {letters.length > 0 && (
                <ScrollView
                    contentContainerStyle={styles.imageContainer}
                    showsVerticalScrollIndicator={false} // Hide scrollbar if not needed
                >
                    {letters.map((letter, index) => {
                        // Animation properties for each item
                        const animationProps = {
                            animation: 'zoomIn', // Entrance animation
                            duration: 400,
                            delay: index * 100, // Staggered appearance
                            useNativeDriver: true, // Better performance
                        };

                        if (letter === ' ') {
                            // Render a space visually
                            return (
                                <AnimatableView
                                    key={`space-${index}`}
                                    style={styles.space}
                                    {...animationProps} // Apply animation
                                />
                            );
                        }

                        // Check if image exists, provide fallback? (Optional)
                        const imageSource = signImages[letter];
                        if (!imageSource) return null; // Skip if no image found

                        return (
                            <AnimatableView
                                key={`${letter}-${index}`}
                                style={styles.signItem}
                                {...animationProps} // Apply animation
                            >
                                <Image
                                    source={imageSource}
                                    style={styles.image}
                                    resizeMode="contain"
                                />
                                <Text style={styles.letterLabel}>{letter}</Text>
                            </AnimatableView>
                        );
                    })}
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 25,
        backgroundColor: '#EBF4FF', // Lighter, softer blue background
    },
    title: {
        fontSize: 28, // Slightly larger title
        fontWeight: 'bold',
        marginTop: 20, // Add some space at the top
        marginBottom: 30,
        textAlign: 'center',
        color: '#2C5282', // Darker blue for contrast
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0', // Lighter border
        borderRadius: 12, // More rounded corners
        paddingVertical: 15,
        paddingHorizontal: 18,
        fontSize: 18,
        marginBottom: 15,
        color: '#2D3748',
        // Shadow for depth (iOS)
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        // Shadow for depth (Android)
        elevation: 3,
    },
    translateButton: {
        backgroundColor: '#AD03DE', // A vibrant blue
        paddingVertical: 16,
        borderRadius: 12, // Consistent rounding
        alignItems: 'center',
        marginBottom: 25,
        // Shadow for depth (iOS)
        shadowColor: '#2C5282',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        // Shadow for depth (Android)
        elevation: 5,
    },
    translateButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600', // Medium weight
    },
    imageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        paddingBottom: 20, // Add padding at the bottom of scroll
        gap: 15, // Increased gap for better spacing
    },
    signItem: {
        alignItems: 'center',
        backgroundColor: '#FFFFFF', // White background for cards
        borderRadius: 10,
        padding: 10,
        width: 80, // Fixed width for consistency
        height: 100, // Fixed height
        justifyContent: 'center',
        // Shadow (iOS)
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        // Shadow (Android)
        elevation: 2,
    },
    image: {
        width: 50, // Slightly smaller image to fit padding
        height: 50,
        marginBottom: 8, // Space between image and label
    },
    letterLabel: {
        fontSize: 16,
        fontWeight: 'bold', // Bolder label
        color: '#4A5568', // Slightly darker grey
    },
    space: {
        width: 40, // A slightly wider space visually
        height: 100, // Match height of sign items
        marginHorizontal: -5, // Adjust spacing if needed with gap
    },
});

export default TextToSign;