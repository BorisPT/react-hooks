// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function Greeting({initialName = ''}) {

const useLocalStorageState = (key, initialValue = "") => { 

  const setToLocalStorage = React.useCallback((valueToInsert) => { 

    const toInsert = {
      type : typeof valueToInsert,
      value : typeof valueToInsert === "object" ? JSON.stringify(valueToInsert) : valueToInsert
    };      

    window.localStorage.setItem(key, JSON.stringify(toInsert));
}, [key]);

  const getFromLocalStorageOrDefault = (defaultValue) => { 

    let rawValue = window.localStorage.getItem(key);

    if (!rawValue)
    {
      setToLocalStorage(defaultValue);
      return defaultValue;
    }

    rawValue = JSON.parse(rawValue);

    return rawValue.type === "object" ? JSON.parse(rawValue.value) : rawValue.value;
   };

  const [value, setValue] = React.useState(getFromLocalStorageOrDefault(initialValue));

  React.useEffect(() => { 

    setToLocalStorage(value);
      
   }, [setToLocalStorage, value]);

   return [value,setValue]

 };  

 const [name, setName] = useLocalStorageState("storedName", initialName);
 const [myObject, setMyObject] = useLocalStorageState("myObject", {});

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
      {myObject ? <strong>MyObject {JSON.stringify(myObject)}</strong> : 'Please insert an object'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
