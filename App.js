import React, { useCallback, useEffect, useState } from "react";
import { Image } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { Asset } from "expo-asset";
import { Block, GalioProvider } from "galio-framework";
import { NavigationContainer } from "@react-navigation/native";

// Before rendering any navigation stack
import { enableScreens } from "react-native-screens";
enableScreens();

import Screens from "./navigation/Screens";
import { Images, articles, argonTheme } from "./constants";

console.log("Debug statement 1");

// cache app images
const assetImages = [
  Images.Onboarding,
  Images.LogoOnboarding,
  Images.Logo,
  Images.Pro,
  Images.ArgonLogo,
  Images.iOSLogo,
  Images.androidLogo,
  Images.img1,
  Images.img2,
  Images.img3,
  Images.img4
];
// cache product images
articles.map((article) => assetImages.push(article.image));

console.log("Debug statement 2");

function cacheImages(images) {
  return images.map((image) => {
    if (typeof image === "string") {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

export default function App() {
  
  console.log("Debug statement 3");

  const [appIsReady, setAppIsReady] = useState(false);

  console.log("Debug statement 4");

  useEffect(() => {
    async function prepare() {
      console.log("Debug statement 5");
      try {
        //Load Resources
        await _loadResourcesAsync();
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync({
          ArgonExtra: require("./assets/font/argon.ttf"),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  const _loadResourcesAsync = async () => {
    return Promise.all([...cacheImages(assetImages)]);
  };

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <NavigationContainer onReady={onLayoutRootView}>
      <GalioProvider theme={argonTheme}>
        <Block flex>
          <Screens />
        </Block>
      </GalioProvider>
    </NavigationContainer>
  );
}
