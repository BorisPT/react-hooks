// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {PokemonForm} from '../pokemon';
import {PokemonDataView} from '../pokemon';
import {PokemonInfoFallback} from "../pokemon";
import {fetchPokemon} from "../pokemon";
import { CONSTANTS } from './constants';

// interessante : defining an error boundary
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
        <React.Fragment>
          <h1>We got an error, people!</h1>
          {this.props.children}
        </React.Fragment> 
      
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
    <MyErrorBoundary key={pokemonName}>
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
    </MyErrorBoundary>
  )
}

export default App
