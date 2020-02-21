import { createGlobalStyle } from "styled-components"

// TODO: create some :root colours and then modify based on whether toggle is true/false

const GlobalStyle = createGlobalStyle`
html {
  background-color: ${props => (props.toggle ? "white" : "#141414")};
  font-size: 18px;
  font-family: "Faustina", serif;
}

.icon {
  stroke: #ffff;
  height: 100%;
  vertical-align: middle;
  cursor: pointer;
}

.icon:hover {
  stroke: #1565c0;
}

.sun {
  margin-left: 15px;
}

.sun:hover {
  stroke: #ffff00;
}

.cat {
  height: 25px;
  width: 25px;
}
`

export default GlobalStyle
