import React, { useEffect, useRef } from 'react';
import { Block, Text, theme } from "galio-framework";
import { Image, ScrollView, StyleSheet, View, TouchableOpacity, Animated, Linking, useWindowDimensions } from "react-native";
import { DrawerItem as DrawerCustomItem } from "../components";
import Images from "../constants/Images";
import { useDrawerStatus } from '@react-navigation/drawer';

function CustomDrawerContent({ navigation, state }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768; // Tablet breakpoint
  const drawerWidth = isMobile ? width * 0.7 : 320; // 70% of screen on mobile, fixed 320px on desktop

  const menuItems = [
    { name: "SignBridgeMain", icon: Images.img5, routeName: "SignBridgeMain" },
    { name: "LiveTrans", icon: Images.img1, routeName: "LiveTrans" },
    { name: "SignToText", icon: Images.img2, routeName: "SignToText" },
    { name: "TextToSign", icon: Images.img3, routeName: "TextToSign" },
    { name: "LanguageSelect", icon: Images.img4, routeName: "LanguageSelect" }
  ];

  const nestedState = state.routes[state.index].state;
  const currentRoute = nestedState
    ? nestedState.routes[nestedState.index].name
    : state.routes[state.index].name;

  const itemAnimations = useRef(
    menuItems.map(() => ({
      opacity: new Animated.Value(0),
      translateX: new Animated.Value(-30),
    }))
  ).current;

  const isDrawerOpen = useDrawerStatus() === 'open';

  useEffect(() => {
    if (isDrawerOpen) {
      const animations = itemAnimations.map((anim) =>
        Animated.parallel([
          Animated.timing(anim.opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(anim.translateX, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      );

      Animated.stagger(75, animations).start();
    } else {
      itemAnimations.forEach(anim => {
        anim.opacity.setValue(0);
        anim.translateX.setValue(-30);
      });
    }
  }, [itemAnimations, isDrawerOpen]);

  const handleLogout = () => {
    navigation.navigate("Register");
  };

  return (
    <Block style={[styles.container, { width: drawerWidth }]}>
      <Block style={styles.header}>
        <Image 
          source={Images.SignBridgeLogoSmall} 
          style={[
            styles.logo,
            { width: isMobile ? '60%' : '70%' }
          ]} 
          resizeMode="contain" 
        />
      </Block>

      <Block flex>
        <ScrollView showsVerticalScrollIndicator={false}>
          {menuItems.map((item, index) => {
            const isActive = currentRoute === item.routeName;
            const { opacity, translateX } = itemAnimations[index];

            return (
              <Animated.View
                key={item.routeName} 
                style={{
                  opacity: opacity, 
                  transform: [{ translateX: translateX }], 
                }}
              >
                <Block
                  style={[
                    styles.menuItem,
                    isActive && styles.activeMenuItem,
                    isMobile && styles.mobileMenuItem
                  ]}
                >
                  <Image
                    source={item.icon}
                    style={[
                      styles.icon,
                      isActive && styles.activeIcon,
                      isMobile && styles.mobileIcon
                    ]}
                  />
                  <DrawerCustomItem
                    title={item.name}
                    navigation={navigation}
                    focused={isActive}
                    style={isMobile && { fontSize: 14 }}
                  />
                </Block>
              </Animated.View>
            );
          })}

          <Block style={[styles.sectionDivider, isMobile && styles.mobileSectionDivider]}>
            <View style={styles.divider} />
            <Text style={[styles.sectionTitle, isMobile && styles.mobileSectionTitle]}>Need help?</Text>
          </Block>

          <Block style={[styles.menuItem, isMobile && styles.mobileMenuItem]}>
            <Image source={Images.img5} style={[styles.icon, isMobile && styles.mobileIcon]} />
            <TouchableOpacity 
              onPress={() => Linking.openURL('https://blogs.ntu.edu.sg/sgslsignbank/language-parameters/')}
              style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
            >
              <Text style={[styles.linkText, isMobile && styles.mobileLinkText]}>SGSL_Bank</Text>
            </TouchableOpacity>
          </Block>
        </ScrollView>
      </Block>

      <Block style={[styles.logoutContainer, isMobile && styles.mobileLogoutContainer]}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Image source={Images.logoutIcon} style={[styles.icon, isMobile && styles.mobileIcon]} />
          <Text style={[styles.logoutText, isMobile && styles.mobileLogoutText]}>Log Out</Text>
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
    aspectRatio: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  mobileMenuItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  activeMenuItem: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderLeftWidth: 3,
    borderLeftColor: theme.COLORS.PRIMARY,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 12,
    tintColor: theme.COLORS.MUTED,
  },
  mobileIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  activeIcon: {
    tintColor: theme.COLORS.BLACK,
  },
  sectionDivider: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  mobileSectionDivider: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 12,
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
  mobileSectionTitle: {
    fontSize: 11,
  },
  linkText: {
    marginLeft: 10,
  },
  mobileLinkText: {
    marginLeft: 8,
    fontSize: 14,
  },
  logoutContainer: {
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.COLORS.MUTED,
  },
  mobileLogoutContainer: {
    padding: 12,
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
  mobileLogoutText: {
    marginLeft: 8,
    fontSize: 14,
  },
});

export default CustomDrawerContent;