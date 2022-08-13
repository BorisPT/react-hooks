// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

const useLocalStorageState = () => { 

   const setValue = (key, value) => { 

      const toInsert = {
        type : typeof value,
        value : typeof value === "object" ? JSON.stringify(value) : value
      };      

      window.localStorage.setItem(key, JSON.stringify(toInsert));
  };

  const getOrDefault = (key, defaultValue = "") => { 

    let rawValue = window.localStorage.getItem(key);

    if (!rawValue)
    {
      setValue(key, defaultValue);
      return defaultValue;
    }

    rawValue = JSON.parse(rawValue);

    return rawValue.type === "object" ? JSON.parse(rawValue.value) : rawValue.value;
   };

  return {
    setValue,
    getOrDefault
  };
 };

function Greeting({initialName = ''}) {

  const {getOrDefault, setValue } = useLocalStorageState();

  const [name, setName] = React.useState(getOrDefault("storedName", initialName));

  const [myObject, setMyObject] = React.useState(getOrDefault("myObject", {}));

  React.useEffect(() => { 

    setValue("storedName", name);
    setValue("myObject", myObject);
  
   }, [name, myObject, setValue]);

  function handleChange(event) {
    setName(event.target.value);
    setMyObject({
      id : Math.random().toString(),
      numero : Date.now(),
      mybool : true
    });
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
      <br/>
      {myObject ? <strong>MyObject {JSON.stringify(myObject)}</strong> : 'Please type your name'}

    </div>
  )
}

function App() {
  return <Greeting initialName='Alexandre'/>
}

export default App
