// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {PokemonForm} from '../pokemon';
import {PokemonDataView} from '../pokemon';
import {PokemonInfoFallback} from "../pokemon";
import {fetchPokemon} from "../pokemon";
import { CONSTANTS } from './constants';

// interessante : error boundary package!
import { ErrorBoundary } from 'react-error-boundary';


const FallBackComponent = ({error}) => { 

  return (
    <React.Fragment>
      <div role="alert">
        There was an error: <pre style={{whiteSpace: 'normal'}}>{error}</pre>
      </div>          
      <p>No reset button, it resets automatically</p>
    </React.Fragment>       
  );

 }

// idle: no request made yet
// pending: request started
// resolved: request successful
// rejected: request failed

function createState(status, pokeInfo)
{
  return {
    status : status,
    pokemonInfo : pokeInfo
  };
}

function PokemonInfo({pokemonName}) {

  const [pokeState, setPokeState] = React.useState(createState(CONSTANTS.IDLE, null));
  
  let errorMessage = React.useRef(null);

  React.useEffect(() => { 

    const getPokemonInfo = async (pokeName) => { 

      setPokeState(createState(CONSTANTS.IDLE, null));
      
      if (!pokeName)
      {        
        return;
      }      

      try{
        
        setPokeState(previousState => createState(CONSTANTS.PENDING, previousState.pokemonInfo));
        const data = await fetchPokemon(pokeName);
        setPokeState(createState(CONSTANTS.RESOLVED, data));
      }
      catch(error)
      {
        setPokeState(previousState => createState(CONSTANTS.REJECTED, previousState.pokemonInfo));        
        console.log("Error:", error);
        console.log("Error.message:", error.message);        
        errorMessage.current = error.message;
      }
     }

     getPokemonInfo(pokemonName);

   }, [pokemonName]);

   if (pokeState.status === CONSTANTS.REJECTED)
   {
    throw errorMessage.current;
   }

  return (
    <React.Fragment>
      {pokeState.status === CONSTANTS.IDLE && <p>Please submit a pokemon</p>}
      {pokeState.status === CONSTANTS.PENDING && <PokemonInfoFallback name={pokemonName} />}
      {pokeState.status === CONSTANTS.RESOLVED && <PokemonDataView pokemon={pokeState.pokemonInfo} />}      
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

      {/* // interessante : there is a way to "automatically" reset the state of the error boundary.
      // You pass an array of values to resetKeys and if the ErrorBoundary is in an error state and any of those values change, it will reset the error boundary. */}
      <ErrorBoundary FallbackComponent={FallBackComponent} resetKeys={[pokemonName]}>
        <PokemonInfo pokemonName={pokemonName} />
      </ErrorBoundary>
      </div>
    </div>
    
  )
}

export default App
