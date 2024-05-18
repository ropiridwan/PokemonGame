import React, {useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import {observer} from 'mobx-react';
import pokemonStore from '../stores/PokemonStore';
import {capitalizeFirstLetter} from '../component/StringModification';

const HomeScreen = observer(({navigation}) => {
  useEffect(() => {
    pokemonStore.fetchPokemonList();
  }, []);

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={{backgroundColor: 'white'}}
      onPress={() => navigation.navigate('Detail', {url: item.url})}>
      <View style={styles.item}>
        <Image
          source={{
            uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
              item.url.split('/')[6]
            }.png`,
          }}
          style={styles.image}
        />
        <Text style={styles.name}>{capitalizeFirstLetter(item.name)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={pokemonStore.pokemonList}
      keyExtractor={item => item.name}
      renderItem={renderItem}
      onEndReached={pokemonStore.fetchPokemonList}
      onEndReachedThreshold={0.5}
    />
  );
});

export default HomeScreen;

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  name: {
    fontSize: 18,
    lineHeight: 50,
    color: 'black',
  },
});
