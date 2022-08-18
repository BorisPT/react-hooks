// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {PokemonForm} from '../pokemon';
import {PokemonDataView} from '../pokemon';
import {PokemonInfoFallback} from "../pokemon";
import {fetchPokemon} from "../pokemon";

function PokemonInfo({pokemonName}) {

  const [pokemonInfo, setPokemonInfo] = React.useState(null);

  React.useEffect(() => { 

    const getPokemonInfo = async (pokeName) => { 

      setPokemonInfo(null);

      if (!pokeName)
      {        
        return;
      }      

      const data = await fetchPokemon(pokeName);
      console.log("Data:", data);
      console.dir(data);
      setPokemonInfo(data);
    
     }

     getPokemonInfo(pokemonName);

   }, [pokemonName]);


  // 🐨 Have state for the pokemon (null)
  // 🐨 use React.useEffect where the callback should be called whenever the
  // pokemon name changes.
  // 💰 DON'T FORGET THE DEPENDENCIES ARRAY!
  // 💰 if the pokemonName is falsy (an empty string) then don't bother making the request (exit early).

  // 🐨 before calling `fetchPokemon`, clear the current pokemon state by setting it to null.
  // (This is to enable the loading state when switching between different pokemon.)
  // 💰 Use the `fetchPokemon` function to fetch a pokemon by its name:
  //   fetchPokemon('Pikachu').then(
  //     pokemonData => {/* update all the state here */},
  //   )
  // 🐨 return the following things based on the `pokemon` state and `pokemonName` prop:
  //   1. no pokemonName: 'Submit a pokemon'
  //   2. pokemonName but no pokemon: <PokemonInfoFallback name={pokemonName} />
  //   3. pokemon: <PokemonDataView pokemon={pokemon} />

  let content = <p>Please submit a pokemon</p>;

  if (pokemonName)
  {
    if (pokemonInfo !== null)
    {
      console.log("Setting content for pokemon data view");
      content = <PokemonDataView pokemon={pokemonInfo} />;
    }
    else
    {
      content = <PokemonInfoFallback name={pokemonName} />;
    }
  }
  
  return (
    content
    );
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
