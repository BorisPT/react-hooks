// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {PokemonForm} from '../pokemon';
import {PokemonDataView} from '../pokemon';
import {PokemonInfoFallback} from "../pokemon";
import {fetchPokemon} from "../pokemon";
import { CONSTANTS } from './constants';

// interessante : define a fallback component, so we can pass to the error boundary and this way, 
// anybody that wants to use the ErroBoundary has the flexibility to define which fallback to show in the 
// case of an error.
const FallBackComponent = ({error}) => { 

  return (
    <React.Fragment>
      <div role="alert">
        There was an error: <pre style={{whiteSpace: 'normal'}}>{error}</pre>
      </div>          
    </React.Fragment>       
  );

 }

// interessante : defining an error boundary.
// Try to be more granular so the error is related to the place where it originated, instead of applying it 
// too high in the component tree.
class MyErrorBoundary extends React.Component {

  constructor(props) {
    super(props);
    this.state = {error : null};    
  }

  static getDerivedStateFromError(error){
    // update the state so the next render will show the fallback ui
    return {error : error};
  }

  componentDidCatch(error, errorInfo){
    // we could log the error to an external service, for instance.
    console.log("Error boundary: ", error, errorInfo);    
  }

  render(){
    if (this.state.error !== null)
    {
      return (
        <this.props.FallBack error={this.state.error} /> 
      );
    }

    // else, render whatever is inside this error boundary
    return this.props.children;
  }
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

      {/* 
      // interessante : defining a "key" prop for the error boundary "resets" its error state so it after an error, 
      // it is still possible to get a pokemon. 
      // It must be unique, to provoke the unmount
      */}

      <MyErrorBoundary key={pokemonName} FallBack={FallBackComponent}>
        <PokemonInfo pokemonName={pokemonName} />
      </MyErrorBoundary>
      </div>
    </div>
    
  )
}

export default App
