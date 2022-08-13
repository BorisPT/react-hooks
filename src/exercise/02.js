// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'


const useLocalStorageState = (key) => { 

  const getValueIfSet = (defaultValue = "") => { 
    return window.localStorage.getItem(key) ?? defaultValue;
   };

   const setValue = (value) => { 
    window.localStorage.setItem(key, value);
  };

  return {
    setValue,
    getValueIfSet
  };
 };



function Greeting({initialName = ''}) {

  const {getValueIfSet : getOrDefault, setValue } = useLocalStorageState("storedName");

  const [name, setName] = React.useState(getOrDefault());

  React.useEffect(() => { 

    setValue(name);
  
   }, [name, setValue]);

  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
