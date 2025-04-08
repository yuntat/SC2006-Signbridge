import React, {useState} from 'react';
import {
    Image,
    Keyboard,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import * as Animatable from 'react-native-animatable';

// Static image map for LETTERS
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

// --- NEW: Static image map for WORDS ---
// NOTE: Keys should be uppercase and match the expected processed input.
// Use a consistent format for multi-word phrases (e.g., no spaces).
const wordImages = {
    HELLO: require('../assets/imgs/word_images/HELLO.png'), // Assuming path like this
    ILOVEYOU: require('../assets/imgs/word_images/ILOVEYOU.png'),
    NO: require('../assets/imgs/word_images/NO.png'),
    OK: require('../assets/imgs/word_images/OK.png'),
    YES: require('../assets/imgs/word_images/YES.png'),
};

// --- NEW: List of words to check, ordered by length (longest first) ---
// This is important to match "I LOVE YOU" before "NO" or "I".
// The keys here should match the keys in wordImages.
const predefinedWords = ['ILOVEYOU', 'HELLO', 'YES', 'NO', 'OK'];

// Create an Animatable View component
const AnimatableView = Animatable.createAnimatableComponent(View);

// --- NEW: Helper to get original spacing for display label ---
const getOriginalWord = (wordKey) => {
    const map = {
        ILOVEYOU: 'I LOVE YOU',
        HELLO: 'HELLO',
        YES: 'YES',
        NO: 'NO',
        OK: 'OK',
    };
    return map[wordKey] || wordKey; // Fallback to the key itself
};


const TextToSign = () => {
    const [inputText, setInputText] = useState('');
    // --- State now holds letters OR words OR spaces ---
    const [outputItems, setOutputItems] = useState([]);

    const handleTranslate = () => {
        Keyboard.dismiss();
        let processedInput = inputText.toUpperCase().trim(); // Uppercase and remove leading/trailing spaces
        const result = [];
        let currentIndex = 0;

        while (currentIndex < processedInput.length) {
            let foundWord = false;

            // --- Check for predefined words (longest first) ---
            for (const word of predefinedWords) {
                // Check if the word exists at the current position
                // Need to handle potential spaces in the original input matching multi-word phrases
                // Let's simplify: assume input like "I LOVE YOU" will be processed as "ILOVEYOU" after filtering
                // A more robust solution might involve regex or more complex parsing if spaces *within* phrases matter.

                // Create a simplified version of the substring for matching word keys
                const substringToCheck = processedInput.substring(currentIndex).replace(/ /g, ''); // Remove spaces for matching keys like "ILOVEYOU"

                if (substringToCheck.startsWith(word)) {
                    // Find the actual end position in the *original* processedInput string
                    // This is tricky because of spaces. Let's approximate by consuming characters
                    // equal to the matched word's key length, skipping spaces.
                    let consumedLength = 0;
                    let originalCharsConsumed = 0;
                    while (consumedLength < word.length && (currentIndex + originalCharsConsumed) < processedInput.length) {
                        const char = processedInput[currentIndex + originalCharsConsumed];
                        if (char !== ' ') {
                            consumedLength++;
                        }
                        originalCharsConsumed++;
                    }

                    result.push(word); // Add the matched word KEY
                    currentIndex += originalCharsConsumed;
                    foundWord = true;
                    break; // Found the longest possible match at this position
                }
            }

            // --- If no word matched, process the current character ---
            if (!foundWord) {
                const char = processedInput[currentIndex];
                if (/[A-Z]/.test(char)) {
                    result.push(char); // Add letter
                } else if (char === ' ') {
                    // Add space only if it's not redundant (e.g., not after another space or at the start)
                    if (result.length > 0 && result[result.length - 1] !== ' ') {
                        result.push(' '); // Add space marker
                    }
                }
                // Ignore other characters silently
                currentIndex++;
            }
import { StyleSheet, TextInput, View, ImageBackground, useWindowDimensions } from 'react-native';
import { Block, Button, Text } from 'galio-framework';
import { Images, argonTheme } from '../constants';
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

            // Skip any immediate subsequent spaces after matching a word or letter
            while (currentIndex < processedInput.length && processedInput[currentIndex] === ' ') {
                // Only add a single space marker if the last item wasn't already a space
                if (result.length > 0 && result[result.length - 1] !== ' ') {
                    result.push(' ');
                }
                currentIndex++;
            }
        }

        // Remove trailing space if it exists
        if (result.length > 0 && result[result.length - 1] === ' ') {
            result.pop();
        }

        setOutputItems(result);
    };

    return (
        <View style={styles.container}>
              <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.navigate('SignBridgeMain')}
            >
              <MaterialIcons name="arrow-back" size={24} color={argonTheme.COLORS.PRIMARY} />
              <Text style={styles.backText}>{t('backToHome')}</Text>
            </TouchableOpacity>
            <Animatable.Text
                animation="fadeInDown"
                duration={800}
                style={styles.title}>
                Text to Sign 🤟 Translator
            </Animatable.Text>


            <AnimatableView animation="fadeInUp" duration={600} delay={200}>
                <TextInput
                    style={styles.input}
                    placeholder="Type words like 'HELLO BRUH'"
                    placeholderTextColor="#A0AEC0"
                    value={inputText}
                    onChangeText={setInputText}
                    // autoCapitalize="characters" // Keep as none/sentences if users prefer typing naturally
                    clearButtonMode="while-editing"
                    autoCorrect={false} // Often useful for this type of input
                />
            </AnimatableView>

            <AnimatableView animation="fadeInUp" duration={600} delay={400}>
                <TouchableOpacity
                    style={styles.translateButton}
                    onPress={handleTranslate}
                    activeOpacity={0.7}
                >
                    <Text style={styles.translateButtonText}>Translate</Text>
                </TouchableOpacity>
            </AnimatableView>

            {outputItems.length > 0 && (
                <ScrollView
                    contentContainerStyle={styles.imageContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {outputItems.map((item, index) => {
                        const animationProps = {
                            animation: 'zoomIn',
                            duration: 400,
                            delay: index * 100,
                            useNativeDriver: true,
                        };

                        if (item === ' ') {
                            // Render a visual space
                            return (
                                <AnimatableView
                                    key={`space-${index}`}
                                    style={styles.space}
                                    {...animationProps}
                                />
                            );
                        } else if (wordImages[item]) {
                            // --- Render WORD ---
                            const wordSource = wordImages[item];
                            const displayLabel = getOriginalWord(item); // Get "I LOVE YOU" from "ILOVEYOU"
                            return (
                                <AnimatableView
                                    key={`word-${item}-${index}`}
                                    style={[styles.signItem, styles.wordSignItem]} // Optional: specific style for words
                                    {...animationProps}
                                >
                                    <Image
                                        source={wordSource}
                                        style={[styles.image, styles.wordImage]} // Optional: specific style for word images
                                        resizeMode="contain"
                                    />
                                    <Text style={styles.letterLabel}>{displayLabel}</Text>
                                </AnimatableView>
                            );
                        } else if (signImages[item]) {
                            // --- Render LETTER ---
                            const letterSource = signImages[item];
                            return (
                                <AnimatableView
                                    key={`letter-${item}-${index}`}
                                    style={styles.signItem}
                                    {...animationProps}
                                >
                                    <Image
                                        source={letterSource}
                                        style={styles.image}
                                        resizeMode="contain"
                                    />
                                    <Text style={styles.letterLabel}>{item}</Text>
                                </AnimatableView>
                            );
                        } else {
                            // Fallback for unexpected items (shouldn't happen with current logic)
                            return null;
                        }
                    })}
                </ScrollView>
            )}
        </View>
    );
};

// --- Styles (Consider adjusting sizes for words) ---
const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1
    },
    container: {
        flex: 1,
        padding: 25,
        backgroundColor: '#EBF4FF',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: Platform.OS === 'ios' ? 40 : 20, // Adjust top margin for safe area
        marginBottom: 30,
        textAlign: 'center',
        color: '#2C5282',
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        paddingVertical: 15,
        paddingHorizontal: 18,
        fontSize: 18,
        marginBottom: 15,
        color: '#2D3748',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    translateButton: {
        backgroundColor: '#AD03DE', // Kept your purple color
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 25,
        shadowColor: '#2C5282',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    translateButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    imageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        paddingBottom: 20,
        gap: 15,
        alignItems: 'flex-start', // Align items to the top if heights vary
    },
    signItem: { // Base style for both letters and words
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 10,
        width: 85, // Slightly wider to potentially accommodate word labels
        minHeight: 100, // Use minHeight instead of height if word labels wrap
        justifyContent: 'space-between', // Pushes label down
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
    },
    wordSignItem: { // Specific overrides for word items if needed
        width: 110, // Words might need more width
        // minHeight: 120, // And more height?
    },
    image: { // Base image style
        width: 50,
        height: 50,
        // marginBottom: 8, // Removed, using justifycontent space-between now
    },
    wordImage: { // Specific overrides for word images if needed
        width: 70, // Make word images larger?
        height: 70,
    },
    letterLabel: {
        fontSize: 14, // Adjusted size slightly
        fontWeight: 'bold',
        color: '#4A5568',
        marginTop: 8, // Add margin top since marginBottom removed from image
        textAlign: 'center', // Center label text if it wraps
    },
    space: {
        width: 40, // Visual width of a space
        height: 100, // Match minHeight of sign items
        // No background or visual elements needed unless desired
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        paddingVertical: 5
    },
    backText: {
        marginLeft: 5,
        color: argonTheme.COLORS.PRIMARY,
        fontSize: 16
    }
});

export default TextToSign;