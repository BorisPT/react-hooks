// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function Greeting({initialName = ''}) {

  // interessante : if the operation that fills in the initial state is very intense, we can use a function 
  //that is only going to be called the first time the component is rendered.
  // In this case, reading from local storage can take some time, and we only need if for the first time, so 
  // it makes sense to use lazy loading of the initial state.
  const getInitialValueIfSet = () => { 
    console.log("Calling the lazy loading of the initial state");
    return window.localStorage.getItem("storedName") ?? initialName;
   };


  const [name, setName] = React.useState(getInitialValueIfSet)

  React.useEffect(() => { 

    window.localStorage.setItem("storedName", name);
  
   }, [name]);

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
