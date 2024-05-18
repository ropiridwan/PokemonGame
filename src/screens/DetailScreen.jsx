import React, {useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet, ScrollView} from 'react-native';
import {observer} from 'mobx-react';
import pokemonStore from '../stores/PokemonStore';
import {capitalizeFirstLetter} from '../component/StringModification';

const DetailScreen = observer(({route}) => {
  const {url} = route.params;
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      await pokemonStore.fetchPokemonDetails(url);
      setPokemon(pokemonStore?.pokemonDetails[url]);
    };
    fetchPokemon();
  }, [pokemonStore?.pokemonDetails]);

  if (!pokemon) {
    return <Text style={styles.text}>Loading...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{borderWidth: 0.5, alignItems: 'center'}}>
        <Image
          source={{uri: pokemon.sprites.front_default}}
          resizeMode="contain"
          style={styles.image}
        />
        <Text style={styles.name}>{capitalizeFirstLetter(pokemon.name)}</Text>
      </View>
      <View style={styles.borderRow}>
        <Text style={[styles.text, {width: '20%'}]}>About:</Text>
        <View>
          <Text style={styles.text}>Height {pokemon.height}</Text>
          <Text style={styles.text}>Weight {pokemon.weight}</Text>
        </View>
      </View>
      <View style={styles.borderRow}>
        <Text style={[styles.text, {width: '20%'}]}>About:</Text>
        <View>
          <Text style={styles.text}>
            {pokemon.types
              .map(type => capitalizeFirstLetter(type.type.name))
              .join(', ')}
          </Text>
        </View>
      </View>
      <View style={styles.borderRow}>
        <Text style={[styles.text, {width: '20%'}]}>Abilities:</Text>
        <View>
          {pokemon.abilities.map(ability => (
            <Text style={styles.text} key={ability.ability.name}>
              {capitalizeFirstLetter(ability.ability.name)}
            </Text>
          ))}
        </View>
      </View>
      <View style={{borderWidth: 0.5, flexDirection: 'row', flex: 1}}>
        <Text style={[styles.text, {width: '20%'}]}>Stats: </Text>
        <View style={{flex: 1}}>
          {pokemonStore?.pokemonStats.map((value, index) => (
            <View key={index} style={[styles.barContainer]}>
              <View
                style={[
                  styles.bar,
                  {
                    width: value.value > 100 ? '100%' : `${value.value}%`,
                    backgroundColor:
                      value.value > 0 && value.value <= 50
                        ? 'grey'
                        : value.value > 50 && value.value <= 80
                        ? 'orange'
                        : 'green',
                  },
                ]}>
                <Text style={styles.barLabel}>
                  {capitalizeFirstLetter(value.name)}
                </Text>
                <Text style={styles.barLabel}>{value.value}%</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
});

export default DetailScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  image: {
    width: 100,
    height: 100,
  },
  borderRow: {borderWidth: 0.5, flexDirection: 'row'},
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    color: 'black',
  },
  text: {
    fontSize: 16,
    color: 'black',
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  barContainer: {
    flex: 1,
  },
  bar: {
    borderWidth: 0.5,
    alignItems: 'center',
    flexDirection: 'row',
  },
  barLabel: {
    color: 'white',
    padding: 2,
    fontSize: 14,
  },
});
