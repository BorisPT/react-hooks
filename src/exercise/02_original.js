// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function Greeting({initialName = ''}) {

  // interessante : using local storage to save the name between refreshes.
  const storedName = window.localStorage.getItem("storedName");
  const [name, setName] = React.useState(storedName ?? initialName)

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
