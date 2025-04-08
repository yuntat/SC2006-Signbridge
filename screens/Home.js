import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Block, theme } from 'galio-framework';
import { useWindowDimensions } from 'react-native';

import { Card } from '../components';
import articles from '../constants/articles';

const Home = () => {
  const { width } = useWindowDimensions();

  const renderArticles = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.articles(width)}>
        <Block flex>
          <Card item={articles[0]} horizontal />
          <Block flex row>
            <Card item={articles[1]} style={{ marginRight: theme.SIZES.BASE }} />
            <Card item={articles[2]} />
          </Block>
          <Card item={articles[3]} horizontal />
          <Card item={articles[4]} full />
        </Block>
      </ScrollView>
    );
  };

  return (
    <Block flex center style={styles.home(width)}>
      {renderArticles()}
    </Block>
  );
};

const styles = {
  home: (width) => ({
    width: width > 768 ? width * 0.8 : width, // Adjusting width for desktop screens
  }),
  articles: (width) => ({
    width: width > 768 ? width * 0.75 : width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE,
  }),
};

export default Home;
