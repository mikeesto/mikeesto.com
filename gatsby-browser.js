import React from "react"
import { ToggleProvider } from "./src/context/toggle"

export const wrapRootElement = ({ element }) => (
  <ToggleProvider>{element}</ToggleProvider>
)
