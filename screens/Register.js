import React from "react";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Alert,
  useWindowDimensions
} from "react-native";
import { Block, Checkbox, Text, theme } from "galio-framework";
import { Button, Icon, Input } from "../components";
import { Images, argonTheme } from "../constants";
import { Snackbar } from 'react-native-paper';



const Register = ({ navigation }) => {
  const [formData, setFormData] = React.useState({
    username: '',
    password: '',
    agreed: false
  });

  const { width, height } = useWindowDimensions();

  const [loading, setLoading] = React.useState(false);
  const [loginLoading, setLoginLoading] = React.useState(false);
  const [registerLoading, setRegisterLoading] = React.useState(false);

    // Snackbar state
  const [visible, setVisible] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarType, setSnackbarType] = React.useState('error'); // 'error' or 'success'
  
  const showSnackbar = (message, type = 'error') => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setVisible(true);
  };
  
  const hideSnackbar = () => setVisible(false);

  const handleLogin = async () => {
    if (!formData.username || !formData.password) {
      showSnackbar("Please enter both username and password");
      return;
    }
  
    setLoginLoading(true);
    try {
      const response = await fetch("https://signbridge-api.azurewebsites.net/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          user_type: "normal"
        })
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 405 || response.status === 422 || 
            data.detail?.toLowerCase().includes("in valid credentials")) {
              showSnackbar("Log in unsuccessful", "error");
              throw new Error("Username or password is incorrect");
        }
        throw new Error(data.detail || "Login failed");
      }
      
      // If we get here, login was successful
      showSnackbar("Logged in successfully!", "success");
      navigation.replace("MainApp");
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", error.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!formData.username || !formData.password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!formData.agreed) {
      Alert.alert("Error", "You must agree to the terms and policies");
      return;
    }

    setRegisterLoading(true);
    try {
      const response = await fetch("https://signbridge-api.azurewebsites.net/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          user_type: "normal"
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Registration failed");
      
      Alert.alert("Success", "Account created successfully!");
      navigation.replace("MainApp");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({...prev, [field]: value}));
  };

  return (
    <Block flex middle>
      <StatusBar hidden />
      <ImageBackground
        source={Images.Onboarding}
        style={[styles.backgroundImage, { height, width }]}
        resizeMode="cover"
      >
        <Block safe flex middle>
          <Block style={styles.authContainer}>
            <Block flex center>
              <KeyboardAvoidingView behavior="padding" enabled>
                {/* Username Field */}
                <Block width={width * 0.8} style={{ marginBottom: 20 }}>
                  <Input
                    borderless
                    placeholder="Username"
                    value={formData.username}
                    onChangeText={(text) => handleInputChange('username', text)}
                    iconContent={
                      <Icon
                        size={16}
                        color={argonTheme.COLORS.ICON}
                        name="hat-3"
                        family="ArgonExtra"
                        style={styles.inputIcons}
                      />
                    }
                  />
                </Block>

                {/* Password Field */}
                <Block width={width * 0.8} style={{ marginBottom: 20 }}>
                  <Input
                    password
                    borderless
                    placeholder="Password"
                    value={formData.password}
                    onChangeText={(text) => handleInputChange('password', text)}
                    iconContent={
                      <Icon
                        size={16}
                        color={argonTheme.COLORS.ICON}
                        name="padlock-unlocked"
                        family="ArgonExtra"
                        style={styles.inputIcons}
                      />
                    }
                  />
                </Block>

                {/* Terms Checkbox */}
                <Block row width={width * 0.8} style={{ marginBottom: 30 }}>
                  <Checkbox
                    checkboxStyle={{ borderWidth: 3 }}
                    color={argonTheme.COLORS.PRIMARY}
                    label="I agree to the terms and policies"
                    checked={formData.agreed}
                    onChange={(checked) => handleInputChange('agreed', checked)}
                  />
                </Block>

                {/* Action Buttons */}
                <Block row space="between" style={styles.buttonContainer}>
                  <Button
                    color="primary"
                    style={styles.authButton}
                    onPress={handleRegister}
                    disabled={loginLoading || registerLoading}
                  >
                    <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                      {registerLoading ? "CREATING..." : "NEW USER"}
                    </Text>
                  </Button>
                  
                  <Button
                    color="success"
                    style={styles.authButton}
                    onPress={handleLogin}
                    disabled={loginLoading || registerLoading}
                  >
                    <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                      {loginLoading ? "LOGGING IN..." : "RETURNING USER"}
                    </Text>
                  </Button>
                </Block>
              </KeyboardAvoidingView>
            </Block>
          </Block>
        </Block>
      </ImageBackground>
      <Snackbar
        visible={visible}
        onDismiss={hideSnackbar}
        duration={3000}
        style={{
          backgroundColor: snackbarType === 'error' 
            ? argonTheme.COLORS.ERROR 
            : argonTheme.COLORS.SUCCESS
        }}
        
        action={{
          label: 'Dismiss',
          onPress: hideSnackbar,
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </Block>
  );
};

const styles = (width, height) => StyleSheet.create({
  authContainer: {
    width: width * 0.9,
    height: height * 0.7,
    backgroundColor: "#F4F5F7",
    borderRadius: 4,
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: "hidden",
    padding: 20
  },
  inputIcons: {
    marginRight: 12
  },
  buttonContainer: {
    width: width * 0.8,
    justifyContent: 'space-between'
  },
  authButton: {
    width: width * 0.38,
    marginTop: 10
  },
  backgroundImage: {
    flex: 1
  }
});

export default Register;