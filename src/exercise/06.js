// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {PokemonForm} from '../pokemon';
import {PokemonDataView} from '../pokemon';
import {PokemonInfoFallback} from "../pokemon";
import {fetchPokemon} from "../pokemon";
import { CONSTANTS } from './constants';
import { ErrorBoundary } from 'react-error-boundary';

// interessante : define a fallback component, so we can pass to the error boundary and this way, 
// anybody that wants to use the ErroBoundary has the flexibility to define which fallback to show in the 
// case of an error. 
// Also, we define the parameters as the error we are passed from the boundary and the reset function that 
// will trigger the reset of the boundary. Note that this function resets the boundary, but we must define the 
// "onReset" prop of the boundary (which is a function) in order to clear the state of the component before the next render.
const FallBackComponent = ({error, resetErrorBoundary}) => { 

  return (
    <React.Fragment>
      <div role="alert">
        There was an error: <pre style={{whiteSpace: 'normal'}}>{error}</pre>
      </div>          
      <button type="button" onClick={resetErrorBoundary}>Try again</button>
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

  const resetErrorBoundary = () => { 
    // interessante : clear the state so we don't have a "fresh" error and allow the application to recover.
    setPokemonName("");
   };

  return (
    
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
       
       {/* // interessante : having the key is a nice "hack" to unmount the component, but in reality it will unmount and mount 
       // not just the ErrorBoundary, but also the PokemonInfo component. This is not ideal, so we use another features of this 
       // ErrorBoundary package.
       // We define the interface of our callback to receive the function that resets the error boundary and also we define 
       // the "onReset" function to "clear" our state of errors. */}
      {/* <ErrorBoundary key={pokemonName} FallbackComponent={FallBackComponent} onReset={resetErrorBoundary}> */}
      <ErrorBoundary FallbackComponent={FallBackComponent} onReset={resetErrorBoundary}>
        <PokemonInfo pokemonName={pokemonName} />
      </ErrorBoundary>
      </div>
    </div>
    
  )
}

export default App
