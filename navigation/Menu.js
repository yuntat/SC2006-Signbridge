import React, { useEffect, useRef } from 'react'; // Import useEffect and useRef
import { Block, Text, theme } from "galio-framework";
import { Image, ScrollView, StyleSheet, View, TouchableOpacity, Animated } from "react-native"; // Import Animated
import { DrawerItem as DrawerCustomItem } from "../components";
import Images from "../constants/Images";

import { useDrawerStatus } from '@react-navigation/drawer';

function CustomDrawerContent({ navigation, state }) {
  const menuItems = [
    { name: "SignBridgeMain", icon: Images.img1, routeName: "SignBridgeMain" },
    { name: "LiveTrans", icon: Images.img2, routeName: "LiveTrans" },
    { name: "Pre-Recorded Video Upload", icon: Images.img5, routeName: "SignToText" },
    { name: "Text-to-Sign", icon: Images.img3, routeName: "TextToSign" },
    { name: "LanguageSelect", icon: Images.img4, routeName: "LanguageSelect" }
  ];

  // Get the current route name from navigation state
  const nestedState = state.routes[state.index].state;
  const currentRoute = nestedState
    ? nestedState.routes[nestedState.index].name
    : state.routes[state.index].name;

  // --- Animation Setup ---
  // Create refs for animation values for each menu item
  const itemAnimations = useRef(
    menuItems.map(() => ({
      opacity: new Animated.Value(0), // Start invisible
      translateX: new Animated.Value(-30), // Start 30 pixels to the left
    }))
  ).current;

  // Optional: Hook to detect if the drawer is open. Useful if you want the
  // animation to replay every time the drawer opens.
  const isDrawerOpen = useDrawerStatus() === 'open';

  useEffect(() => {
    // --- Animation Logic ---
    // Optional: Uncomment the 'if (isDrawerOpen)' block if using useIsDrawerOpen
    if (isDrawerOpen) {

      // Create an array of animation sequences (opacity + translation) for each item
      const animations = itemAnimations.map((anim) =>
        Animated.parallel([ // Animate opacity and translation simultaneously
          Animated.timing(anim.opacity, {
            toValue: 1, // Fade in
            duration: 300, // Animation duration in milliseconds
            useNativeDriver: true, // Use native thread for performance
          }),
          Animated.timing(anim.translateX, {
            toValue: 0, // Slide to original position
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      );

      // Stagger the start of each item's animation
      Animated.stagger(
        75, // Delay in milliseconds between each item's animation start
        animations
      ).start();

    // Optional: Add reset logic if using useIsDrawerOpen
    } else {
      // Reset animations when drawer closes if needed
        itemAnimations.forEach(anim => {
        anim.opacity.setValue(0);
        anim.translateX.setValue(-30);
      });
    }

    // Add itemAnimations (and potentially isDrawerOpen) to the dependency array
    // Using itemAnimations ensures effect runs if the refs somehow changed (unlikely here)
    // Using isDrawerOpen ensures effect runs when drawer open/close state changes
  }, [itemAnimations, isDrawerOpen]);


  const handleLogout = () => {
    // You might want to add an animation here too before navigating
    navigation.navigate("Register");
  };

  return (
    <Block style={styles.container}>
      <Block style={styles.header}>
        {/* You could potentially animate the logo too */}
        <Image source={Images.SignBridgeLogoSmall} style={styles.logo} resizeMode="contain" />
      </Block>

      <Block flex>
        <ScrollView showsVerticalScrollIndicator={false}>
          {menuItems.map((item, index) => {
            const isActive = currentRoute === item.routeName;
            // Get the animation values for this specific item
            const { opacity, translateX } = itemAnimations[index];

            return (
              // Wrap the original item Block in an Animated.View
              <Animated.View
                key={item.routeName} // Use a stable key like routeName
                style={{
                  opacity: opacity, // Apply animated opacity
                  transform: [{ translateX: translateX }], // Apply animated translation
                }}
              >
                <Block // This is the original container for layout/styling
                  style={[
                    styles.menuItem,
                    isActive && styles.activeMenuItem
                  ]}
                >
                  <Image
                    source={item.icon}
                    style={[
                      styles.icon,
                      isActive && styles.activeIcon
                    ]}
                  />
                  {/* Pass props down to your custom item component */}
                  <DrawerCustomItem
                    title={item.name}
                    navigation={navigation}
                    focused={isActive}
                    // You might need to adjust DrawerCustomItem if it relies on direct parent styles
                  />
                </Block>
              </Animated.View>
            );
          })}

         
        </ScrollView>
      </Block>

      {/* Logout Button - Could also be animated */}
      <Block style={styles.logoutContainer}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Image source={Images.logoutIcon} style={styles.icon} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </Block>
    </Block>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.WHITE,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.SIZES.BASE * 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.COLORS.MUTED,
  },
  logo: {
    width: '70%',
    aspectRatio: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    // Removed backgroundColor: 'transparent' as Animated.View now handles opacity
  },
  activeMenuItem: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderLeftWidth: 3,
    borderLeftColor: theme.COLORS.PRIMARY,
    // Ensure padding is consistent or adjusted if needed due to Animated.View wrapper
    paddingHorizontal: 16, // Make sure padding is still correct
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 12,
    tintColor: theme.COLORS.MUTED,
  },
  activeIcon: {
    tintColor: theme.COLORS.BLACK,
  },
  sectionDivider: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 16,
     // You might want to animate this block too
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.COLORS.MUTED,
    marginVertical: 16,
  },
  sectionTitle: {
    color: theme.COLORS.MUTED,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  logoutContainer: {
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.COLORS.MUTED,
    // You might want to animate this block too
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    marginLeft: 12,
    fontSize: 16,
    color: theme.COLORS.MUTED,
  },
});

export default CustomDrawerContent;
