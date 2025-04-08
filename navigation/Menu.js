import { Block, Text, theme } from "galio-framework";
import { Image, ScrollView, StyleSheet, View, TouchableOpacity } from "react-native";
import { DrawerItem as DrawerCustomItem } from "../components";
import Images from "../constants/Images";
import React from "react";

function CustomDrawerContent({ navigation, state }) {
  const menuItems = [
    { name: "SignBridgeMain", icon: Images.img1, routeName: "SignBridgeMain" },
    { name: "LiveTrans", icon: Images.img2, routeName: "LiveTrans" },
    { name: "TextToSign", icon: Images.img3, routeName: "TextToSign" },
    { name: "LanguageSelect", icon: Images.img4, routeName: "LanguageSelect" }
  ];

  // Get the current route name from navigation state
  const currentRoute = state.routes[state.index].name;

  const handleLogout = () => {
    navigation.navigate("Register");
  };

  return (
    <Block style={styles.container}>
      <Block style={styles.header}>
        <Image source={Images.SignBridgeLogoSmall} style={styles.logo} resizeMode="contain" />
      </Block>

      <Block flex>
        <ScrollView showsVerticalScrollIndicator={false}>
          {menuItems.map((item, index) => {
            const isActive = currentRoute === item.routeName;
            return (
              <Block
                key={index}
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
                <DrawerCustomItem
                  title={item.name}
                  navigation={navigation}
                  focused={isActive}
                />
              </Block>
            );
          })}

          <Block style={styles.sectionDivider}>
            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>DOCUMENTATION</Text>
          </Block>

          <Block style={styles.menuItem}>
            <Image source={Images.docIcon} style={styles.icon} />
            <DrawerCustomItem title="Getting Started" navigation={navigation} />
          </Block>
        </ScrollView>
      </Block>

      {/* Logout Button */}
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
    backgroundColor: 'transparent',
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
  activeIcon: {
    tintColor: theme.COLORS.BLACK,
  },
  sectionDivider: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 16,
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
