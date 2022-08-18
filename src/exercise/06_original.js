// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {PokemonForm} from '../pokemon';
import {PokemonDataView} from '../pokemon';
import {PokemonInfoFallback} from "../pokemon";
import {fetchPokemon} from "../pokemon";

const ErrorComponent = ({errorMessage}) => { 

  return (
    <div role="alert">
      There was an error: <pre style={{whiteSpace: 'normal'}}>{errorMessage}</pre>
    </div>
  );
 };

function PokemonInfo({pokemonName}) {

  const [pokemonInfo, setPokemonInfo] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => { 

    const getPokemonInfo = async (pokeName) => { 

      setPokemonInfo(null);
      setError(null);

      if (!pokeName)
      {        
        return;
      }      

      try{
        const data = await fetchPokemon(pokeName);
        setPokemonInfo(data);
      }
      catch(error)
      {
        console.log("Error:", error);
        console.log("Error.message:", error.message);

        setError(error.message);
      }
     }

     getPokemonInfo(pokemonName);

   }, [pokemonName]);


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
      content = !error ? <PokemonInfoFallback name={pokemonName} /> : <ErrorComponent errorMessage={error} />;
    }
  }
  
  return (
    <React.Fragment>
        {content}
    </React.Fragment>
    );
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName.trim())
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
