// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {PokemonForm} from '../pokemon';
import {PokemonDataView} from '../pokemon';
import {PokemonInfoFallback} from "../pokemon";
import {fetchPokemon} from "../pokemon";
import { CONSTANTS } from './constants';

const ErrorComponent = ({errorMessage}) => { 

  return (
    <div role="alert">
      There was an error: <pre style={{whiteSpace: 'normal'}}>{errorMessage}</pre>
    </div>
  );
 };

// idle: no request made yet
// pending: request started
// resolved: request successful
// rejected: request failed

function PokemonInfo({pokemonName}) {

  const [pokemonInfo, setPokemonInfo] = React.useState(null);
  const [status, setStatus] = React.useState(CONSTANTS.IDLE);
  
  let errorMessage = React.useRef(null);

  React.useEffect(() => { 

    const getPokemonInfo = async (pokeName) => { 

      setPokemonInfo(null);
      setStatus(CONSTANTS.IDLE);      

      if (!pokeName)
      {        
        return;
      }      

      try{

        setStatus(CONSTANTS.PENDING);
        const data = await fetchPokemon(pokeName);
        setPokemonInfo(data);
        setStatus(CONSTANTS.RESOLVED);
      }
      catch(error)
      {
        setStatus(CONSTANTS.REJECTED);
        console.log("Error:", error);
        console.log("Error.message:", error.message);        
        errorMessage.current = error.message;
      }
     }

     getPokemonInfo(pokemonName);

   }, [pokemonName]);

  return (
    <React.Fragment>
      {status === CONSTANTS.IDLE && <p>Please submit a pokemon</p>}
      {status === CONSTANTS.PENDING && <PokemonInfoFallback name={pokemonName} />}
      {status === CONSTANTS.RESOLVED && <PokemonDataView pokemon={pokemonInfo} />}
      {status === CONSTANTS.REJECTED && <ErrorComponent errorMessage={errorMessage.current} />}
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
