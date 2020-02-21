import React, { useState, createContext } from "react"

const ToggleContext = createContext()

const ToggleProvider = ({ children }) => {
  const [toggle, updateToggle] = useState(false)

  return (
    <ToggleContext.Provider value={[toggle, updateToggle]}>
      {children}
    </ToggleContext.Provider>
  )
}

export { ToggleContext, ToggleProvider }
