import React, { useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    Platform,
    Keyboard,
    Dimensions,
    StatusBar, // Import StatusBar for potential top padding adjustment
} from 'react-native';

// --- NEW: Import useNavigation hook ---
import { useNavigation } from '@react-navigation/native';

import * as Animatable from 'react-native-animatable';

// Static image map for LETTERS (remains the same)
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

// Static image map for WORDS (remains the same)
const wordImages = {
    HELLO: require('../assets/imgs/word_images/HELLO.png'),
    ILOVEYOU: require('../assets/imgs/word_images/ILOVEYOU.png'),
    NO: require('../assets/imgs/word_images/NO.png'),
    OK: require('../assets/imgs/word_images/OK.png'),
    YES: require('../assets/imgs/word_images/YES.png'),
};

// List of words to check (remains the same)
const predefinedWords = ['ILOVEYOU', 'HELLO', 'YES', 'NO', 'OK'];

// Create an Animatable View component (remains the same)
const AnimatableView = Animatable.createAnimatableComponent(View);

// Helper to get original spacing (remains the same)
const getOriginalWord = (wordKey) => {
    const map = {
        ILOVEYOU: 'I LOVE YOU',
        HELLO: 'HELLO',
        YES: 'YES',
        NO: 'NO',
        OK: 'OK',
    };
    return map[wordKey] || wordKey;
};


const TextToSign = () => {
    // --- NEW: Get navigation object ---
    const navigation = useNavigation();

    const [inputText, setInputText] = useState('');
    const [outputItems, setOutputItems] = useState([]);

    const handleTranslate = () => {
        // (Translation logic remains the same as previous version)
        Keyboard.dismiss();
        let processedInput = inputText.toUpperCase().trim();
        const result = [];
        let currentIndex = 0;

        while (currentIndex < processedInput.length) {
            let foundWord = false;

            for (const word of predefinedWords) {
                const substringToCheck = processedInput.substring(currentIndex).replace(/ /g, '');
                if (substringToCheck.startsWith(word)) {
                    let consumedLength = 0;
                    let originalCharsConsumed = 0;
                    while (consumedLength < word.length && (currentIndex + originalCharsConsumed) < processedInput.length) {
                        const char = processedInput[currentIndex + originalCharsConsumed];
                        if (char !== ' ') {
                            consumedLength++;
                        }
                        originalCharsConsumed++;
                    }
                    result.push(word);
                    currentIndex += originalCharsConsumed;
                    foundWord = true;
                    break;
                }
            }

            if (!foundWord) {
                const char = processedInput[currentIndex];
                if (/[A-Z]/.test(char)) {
                    result.push(char);
                } else if (char === ' ') {
                    if (result.length > 0 && result[result.length - 1] !== ' ') {
                         result.push(' ');
                    }
                }
                currentIndex++;
            }

             while (currentIndex < processedInput.length && processedInput[currentIndex] === ' ') {
                 if (result.length > 0 && result[result.length - 1] !== ' ') {
                     result.push(' ');
                 }
                currentIndex++;
            }
        }

        if (result.length > 0 && result[result.length - 1] === ' ') {
            result.pop();
        }
        setOutputItems(result);
    };

    // --- NEW: Handler for the back button ---
    const handleGoBack = () => {
        navigation.goBack();
        // Or if you need to ensure it always goes to SignBridgeMain:
        // navigation.navigate('SignBridgeMain');
    };

    return (
        <View style={styles.container}>
            {/* --- NEW: Back Button --- */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={handleGoBack}
                activeOpacity={0.7}
            >
                {/* You can replace this Text with an Icon component */}
                <Text style={styles.backButtonText}>{'< Back'}</Text>
            </TouchableOpacity>

            <Animatable.Text
                animation="fadeInDown"
                duration={800}
                style={styles.title} // Adjust title margin if needed due to back button
                >
                Text to Sign 🤟 Translator
            </Animatable.Text>

            {/* (Rest of the components: TextInput, Translate Button, ScrollView remain the same) */}
            <AnimatableView animation="fadeInUp" duration={600} delay={200}>
                <TextInput
                    style={styles.input}
                    placeholder="Type words like 'HELLO BRUH'"
                    placeholderTextColor="#A0AEC0"
                    value={inputText}
                    onChangeText={setInputText}
                    clearButtonMode="while-editing"
                    autoCorrect={false}
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
                    keyboardShouldPersistTaps="handled" // Dismiss keyboard on scroll tap
                >
                    {outputItems.map((item, index) => {
                        const animationProps = {
                            animation: 'zoomIn',
                            duration: 400,
                            delay: index * 100,
                            useNativeDriver: true,
                        };

                        if (item === ' ') {
                            return (
                                <AnimatableView
                                    key={`space-${index}`}
                                    style={styles.space}
                                    {...animationProps}
                                />
                            );
                        } else if (wordImages[item]) {
                             const wordSource = wordImages[item];
                             const displayLabel = getOriginalWord(item);
                             return (
                                 <AnimatableView
                                     key={`word-${item}-${index}`}
                                     style={[styles.signItem, styles.wordSignItem]}
                                     {...animationProps}
                                 >
                                     <Image
                                         source={wordSource}
                                         style={[styles.image, styles.wordImage]}
                                         resizeMode="contain"
                                     />
                                     <Text style={styles.letterLabel}>{displayLabel}</Text>
                                 </AnimatableView>
                             );
                        } else if (signImages[item]) {
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
                            return null;
                        }
                    })}
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // Basic safe area for Android status bar
        paddingHorizontal: 25, // Horizontal padding applied here now
        backgroundColor: '#EBF4FF',
    },
    // --- NEW: Back Button Styles ---
    backButton: {
        position: 'absolute', // Position independently
        top: (Platform.OS === 'android' ? StatusBar.currentHeight : 0) + 15, // Position below status bar
        left: 15,
        zIndex: 1, // Ensure it's above other content if needed
        padding: 10, // Make it easier to tap
    },
    backButtonText: {
        fontSize: 18,
        color: '#2C5282', // Match title color or choose another
        fontWeight: '600',
    },
    // --- Adjust Title Style ---
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        // marginTop: Platform.OS === 'ios' ? 40 : 20, // Can remove or reduce this if back button provides spacing
        marginTop: 50, // Increased top margin to make space below the absolute positioned back button
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
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    translateButton: {
        backgroundColor: '#AD03DE',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 25,
        shadowColor: '#2C5282',
        shadowOffset: { width: 0, height: 4 },
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
        alignItems: 'flex-start',
    },
    signItem: {
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 10,
        width: 85,
        minHeight: 100,
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
    },
    wordSignItem: {
       width: 110,
    },
    image: {
        width: 50,
        height: 50,
    },
    wordImage: {
       width: 70,
       height: 70,
    },
    letterLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4A5568',
        marginTop: 8,
        textAlign: 'center',
    },
    space: {
        width: 40,
        height: 100,
    },
});

export default TextToSign;