import React from 'react'
import "@/app/globals.css"

type Props = {
  value: Boolean,
  onChange: (toggleTrue : Boolean) => void
}

const Toggle = (props: Props) => {

  return (
    <div className="App">
      <div className="toggleContainer" onClick={() => props.onChange(!props.value)}>
        <div className={`toggleButton ${props.value ? "toggledButton" : null}`}/>
      </div>
    </div>
  );
}

export default Toggle