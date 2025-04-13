import React, {useState} from 'react';
import {
    Image,
    Keyboard,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ImageBackground
} from 'react-native';

// --- NEW: Import useNavigation hook ---
import {useNavigation} from '@react-navigation/native';

import * as Animatable from 'react-native-animatable';

import {useTranslation} from 'react-i18next';
import {Ionicons} from "@expo/vector-icons";

import { Images, argonTheme } from '../constants';

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

// Static image map for WORDS
const wordImages = {
    HELLO: require('../assets/imgs/word_images/HELLO.png'),
    ILOVEYOU: require('../assets/imgs/word_images/ILOVEYOU.png'), // This is the target image
    NO: require('../assets/imgs/word_images/NO.png'),
    OK: require('../assets/imgs/word_images/OK.png'),
    YES: require('../assets/imgs/word_images/YES.png'),
};

// --- MODIFIED: Define patterns to check and their mapping ---

const patternsToCheck = [
    'I LOVE YOU', // Original full phrase
    'I LOVE',     // New variation
    'LOVE',       // New variation
    'HELLO',
    'YES',
    'NO',
    'OK',
];

// Map the recognized patterns (from patternsToCheck) to the output key used in wordImages
const patternToOutputKeyMap = {
    'I LOVE YOU': 'ILOVEYOU',
    'I LOVE': 'ILOVEYOU',
    'LOVE': 'ILOVEYOU',
    'HELLO': 'HELLO',
    'YES': 'YES',
    'NO': 'NO',
    'OK': 'OK',
};
// --- END MODIFICATION ---



const AnimatableView = Animatable.createAnimatableComponent(View);

const getOriginalWord = (outputKey) => {
    const map = {
        ILOVEYOU: 'I LOVE YOU',
        HELLO: 'HELLO',
        YES: 'YES',
        NO: 'NO',
        OK: 'OK',
    };
    return map[outputKey] || outputKey; 
};


const TextToSign = () => {
    const navigation = useNavigation();
    const {t} = useTranslation();

    const [inputText, setInputText] = useState('');
    const [outputItems, setOutputItems] = useState([]);

    const handleTranslate = () => {
        Keyboard.dismiss();
        let processedInput = inputText.toUpperCase().trim(); // Keep original spaces for accurate consumption
        const result = [];
        let currentIndex = 0;

        while (currentIndex < processedInput.length) {
            let foundWord = false;

            // --- MODIFIED: Iterate through patterns to check ---
            for (const pattern of patternsToCheck) {
                // Prepare the pattern and the input substring for comparison (remove spaces)
                const patternNoSpaces = pattern.replace(/ /g, '');
                // Create a representation of the input *from the current index* with spaces removed
                // This is just for the 'startsWith' check, not for consumption calculation
                let inputSubstringNoSpaces = '';
                let tempIndex = currentIndex;
                let charsToFormPattern = 0; // How many non-space chars needed for the pattern
                while (tempIndex < processedInput.length && charsToFormPattern < patternNoSpaces.length) {
                    const char = processedInput[tempIndex];
                    if (char !== ' ') {
                        inputSubstringNoSpaces += char;
                        charsToFormPattern++;
                    }
                    tempIndex++;
                }

                // Check if the space-removed input substring starts with the space-removed pattern
                if (inputSubstringNoSpaces === patternNoSpaces) {
                    // Match found! Now calculate how many *original* characters were consumed
                    let originalCharsConsumed = 0;
                    let nonSpaceCharsMatched = 0;
                    let tempConsumeIndex = currentIndex;

                    while (tempConsumeIndex < processedInput.length && nonSpaceCharsMatched < patternNoSpaces.length) {
                        const char = processedInput[tempConsumeIndex];
                        if (char !== ' ') {
                            nonSpaceCharsMatched++;
                        }
                        originalCharsConsumed++;
                        tempConsumeIndex++;
                    }

                    // Get the correct output key from the map
                    const outputKey = patternToOutputKeyMap[pattern];
                    result.push(outputKey); // Push the mapped output key (e.g., 'ILOVEYOU')
                    currentIndex += originalCharsConsumed; // Advance index by consumed characters
                    foundWord = true;
                    break; // Stop checking other patterns once a match is found
                }
            }
            // --- END MODIFICATION ---


            if (!foundWord) {
                // If no pattern was matched, process character by character
                const char = processedInput[currentIndex];
                if (/[A-Z]/.test(char)) {
                    // Check if the character is part of any *potential* word pattern starting here
                    // to avoid breaking words like "BELOVED" into "B E ILOVEYOU D"
                    let potentialWordMatch = false;
                    for (const pattern of patternsToCheck) {
                        const patternNoSpaces = pattern.replace(/ /g, '');
                        // Check if the remaining input *could* start a pattern (ignoring spaces)
                        let remainingInputCheck = '';
                        let tempCheckIndex = currentIndex;
                        while (tempCheckIndex < processedInput.length && remainingInputCheck.length < patternNoSpaces.length) {
                            if (processedInput[tempCheckIndex] !== ' ') {
                                remainingInputCheck += processedInput[tempCheckIndex];
                            }
                            tempCheckIndex++;
                        }
                        if (patternNoSpaces.startsWith(remainingInputCheck) && remainingInputCheck.length > 0) {
                        }
                    }
                    // Simplified: just push the letter if no word was found starting at this index
                    result.push(char);

                } else if (char === ' ') {
                    // Add space only if the previous item wasn't already a space
                    if (result.length > 0 && result[result.length - 1] !== ' ') {
                        result.push(' ');
                    }
                }
                currentIndex++; // Move to the next character
            }

            // Consume any subsequent spaces after finding a word or processing a character
            while (currentIndex < processedInput.length && processedInput[currentIndex] === ' ') {
                // Add a single space delimiter if needed
                if (result.length > 0 && result[result.length - 1] !== ' ' && !foundWord) { // Add space only if previous wasn't space or a word boundary
                    result.push(' ');
                } else if (foundWord && result.length > 0 && result[result.length - 1] !== ' ') {
                    // If we just added a word, ensure there's a space after it if followed by spaces
                    result.push(' ');
                }
                currentIndex++;
            }
        } // End while loop

        // Clean up trailing space if any
        if (result.length > 0 && result[result.length - 1] === ' ') {
            result.pop();
        }
        setOutputItems(result);
    };


    const handleGoBack = () => {
        navigation.goBack();
    };

    return (
        <ImageBackground
            source={Images.Onboarding}
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <View style={styles.container}>
                {/* Back Button */}
                <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="white"/>
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>

                <Animatable.Text
                    animation="fadeInDown"
                    duration={800}
                    style={styles.title}
                >
                    {t('ui.textToSignTranslator')}
                </Animatable.Text>

                {/* Input */}
                <AnimatableView animation="fadeInUp" duration={600} delay={200}>
                    <TextInput
                        style={styles.input}
                        placeholder={t('ui.inputHint')}
                        placeholderTextColor="#A0AEC0"
                        value={inputText}
                        onChangeText={setInputText}
                        clearButtonMode="always"
                        autoCorrect={false}
                        autoCapitalize="characters"
                    />
                </AnimatableView>

                {/* Translate Button */}
                <AnimatableView animation="fadeInUp" duration={600} delay={400}>
                    <TouchableOpacity
                        style={styles.translateButton}
                        onPress={handleTranslate}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.translateButtonText}>{t('ui.translate')}</Text>
                    </TouchableOpacity>
                </AnimatableView>

                {/* Output Area */}
                {outputItems.length > 0 && (
                    <ScrollView
                        contentContainerStyle={styles.imageContainer}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
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
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        paddingHorizontal: 25,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    backButton: {
        position: 'absolute',
        top: (Platform.OS === 'android' ? StatusBar.currentHeight : 0) + 15,
        left: 15,
        zIndex: 1,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButtonText: {
        fontSize: 16,
        marginLeft: 5,
        color: 'white',
        fontWeight: '500',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 50,
        marginBottom: 30,
        textAlign: 'center',
        color: 'white',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 3,
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
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
        backgroundColor: argonTheme.COLORS.DEFAULT,
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
        alignItems: 'flex-start',
    },
    signItem: {
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 10,
        padding: 10,
        width: 85,
        minHeight: 100,
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.2,
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
