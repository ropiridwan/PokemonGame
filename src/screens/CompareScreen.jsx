import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Image,
  ScrollView,
} from 'react-native';
import pokemonStore from '../stores/PokemonStore';
import {observer} from 'mobx-react';
import {capitalizeFirstLetter} from '../component/StringModification';

const CompareScreen = observer(() => {
  const [pokemon1, setPokemon1] = useState(null);
  const [pokemon2, setPokemon2] = useState(null);
  const [currentSelection, setCurrentSelection] = useState(null);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  useEffect(() => {
    pokemonStore.fetchPokemonList();
  }, []);

  const selectPokemon = async (pokemon, setPokemon) => {
    const data = await pokemonStore.fetchPokemonDetails(pokemon.url);
    setPokemon(data);
    setBottomSheetVisible(false);
  };

  const renderPokemonItem = ({item}) => (
    <TouchableOpacity onPress={() => selectPokemon(item, currentSelection)}>
      <Text style={styles.pokemonName}>{capitalizeFirstLetter(item.name)}</Text>
    </TouchableOpacity>
  );

  function sumBaseStats(pokemon) {
    let totalBaseStat = 0;

    for (let i = 0; i < pokemon.stats.length; i++) {
      totalBaseStat += pokemon.stats[i].base_stat;
    }

    return totalBaseStat;
  }

  function determineWinner(pokemon1, pokemon2) {
    const totalBaseStatPokemon1 = sumBaseStats(pokemon1);
    const totalBaseStatPokemon2 = sumBaseStats(pokemon2);

    if (totalBaseStatPokemon1 > totalBaseStatPokemon2) {
      return `${capitalizeFirstLetter(
        pokemon1.name,
      )} lebih unggul dengan total base stat ${totalBaseStatPokemon1}`;
    } else if (totalBaseStatPokemon2 > totalBaseStatPokemon1) {
      return `${capitalizeFirstLetter(
        pokemon2.name,
      )} lebih unggul dengan total base stat ${totalBaseStatPokemon2}`;
    } else {
      return 'Kedua Pokemon memiliki total base stat yang sama';
    }
  }

  const renderChart = () => {
    if (pokemon1 && pokemon2) {
      const statComparisonResult = determineWinner(pokemon1, pokemon2);
      return (
        <>
          <View style={styles.chart}>
            <View
              style={[
                styles.containerPokemon,
                {
                  marginRight: 10,
                  alignSelf: 'flex-start',
                },
              ]}>
              <Text style={[styles.titleLabel, {alignSelf: 'flex-start'}]}>
                {capitalizeFirstLetter(pokemon1.name)}
              </Text>
              {pokemon1?.stats.map((value, index) => (
                <View key={index} style={[styles.barContainer]}>
                  <View
                    style={[
                      styles.bar,
                      {alignSelf: 'flex-start', justifyContent: 'flex-start'},
                    ]}>
                    <View
                      style={{
                        width:
                          value.base_stat > 100
                            ? '100%'
                            : `${value.base_stat}%`,
                        backgroundColor:
                          value.base_stat > 0 && value.base_stat <= 50
                            ? 'grey'
                            : value.base_stat > 50 && value.base_stat <= 80
                            ? 'orange'
                            : 'green',
                        flexDirection: 'row',
                      }}>
                      <Text style={styles.barLabel}>
                        {capitalizeFirstLetter(value.stat.name)}
                      </Text>
                      <Text style={styles.barLabel}>{value.base_stat}%</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.containerPokemon}>
              <Text style={styles.titleLabel}>
                {capitalizeFirstLetter(pokemon2.name)}
              </Text>
              {pokemon2?.stats.map((value, index) => (
                <View key={index} style={[styles.barContainer]}>
                  <View style={styles.bar}>
                    <View
                      style={{
                        width:
                          value.base_stat > 100
                            ? '100%'
                            : `${value.base_stat}%`,
                        backgroundColor:
                          value.base_stat > 0 && value.base_stat <= 50
                            ? 'grey'
                            : value.base_stat > 50 && value.base_stat <= 80
                            ? 'orange'
                            : 'green',
                        flexDirection: 'row',
                      }}>
                      <Text style={styles.barLabel}>{value.base_stat}%</Text>
                      <Text style={styles.barLabel}>
                        {capitalizeFirstLetter(value.stat.name)}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
          <Text
            style={[
              styles.titleLabel,
              {alignSelf: 'center', textAlign: 'center'},
            ]}>
            {capitalizeFirstLetter(statComparisonResult)}
          </Text>
        </>
      );
    }
    return null;
  };

  const renderSelectedPokemon = (pokemon, setPokemon) => (
    <TouchableOpacity
      style={styles.selectedPokemon}
      onPress={() => {
        setCurrentSelection(() => setPokemon);
        setBottomSheetVisible(true);
      }}>
      {pokemon ? (
        <>
          <Image
            source={{uri: pokemon.sprites.front_default}}
            style={styles.pokemonImage}
          />
          <Text style={styles.pokemonName}>
            {capitalizeFirstLetter(pokemon.name)}
          </Text>
        </>
      ) : (
        <Text style={styles.button}>Select Pokémon</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <Text style={styles.header}>Compare Pokémon</Text>
        <View style={styles.selectionContainer}>
          {renderSelectedPokemon(pokemon1, setPokemon1)}
          {renderSelectedPokemon(pokemon2, setPokemon2)}
        </View>
        {renderChart()}
        <Modal
          visible={bottomSheetVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setBottomSheetVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.dialogTitle}>Choose Pokémon</Text>
              <FlatList
                data={pokemonStore.pokemonList}
                keyExtractor={item => item.name}
                renderItem={renderPokemonItem}
                onEndReached={pokemonStore.fetchPokemonList}
                onEndReachedThreshold={0.5}
              />
              <TouchableOpacity onPress={() => setBottomSheetVisible(false)}>
                <Text style={styles.closeButton}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
});

export default CompareScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black'
  },
  selectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  selectedPokemon: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  button: {
    fontSize: 18,
    color: 'blue',
  },
  pokemonName: {
    fontSize: 18,
    marginVertical: 5,
    color: 'black'
  },
  pokemonImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  containerPokemon: {
    flex: 1,
    alignSelf: 'flex-end',
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: '#f9f9f9',
    borderColor: '#ddd',
  },
  chart: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    width: '100%',
    maxHeight: '70%',
  },
  dialogTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black'
  },
  closeButton: {
    textAlign: 'center',
    fontSize: 16,
    color: 'blue',
    marginTop: 10,
  },
  barContainer: {
    flex: 1,
  },
  bar: {
    borderWidth: 0.2,
    flexDirection: 'row',
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
    borderRadius: 2,
    width: '100%',
  },
  barLabel: {
    color: 'white',
    padding: 2,
    fontSize: 12,
  },
  titleLabel: {
    color: 'black',
    padding: 2,
    fontSize: 18,
    alignSelf: 'flex-end',
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
});
