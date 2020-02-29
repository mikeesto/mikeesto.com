import { createGlobalStyle } from "styled-components"

const GlobalStyle = createGlobalStyle`
:root {
  --bg-color: ${props => (props.toggle ? "#ffffff" : "#141414")};
  --text-color: ${props => (props.toggle ? "#c62828" : "#eedec4")};
  --icon-color: ${props => (props.toggle ? "#141414" : "#ffffff")};
  --box-color: ${props => (props.toggle ? "#ffffff" : "#eedec4")};
  --box-border: ${props => (props.toggle ? "2px dashed #141414" : null)};
}

html {
  background-color: var(--bg-color);
  font-size: 20px;
  font-family: "Faustina", serif;
  ${props => (props.mounted ? "transition: all 0.3s ease" : null)};
}

.icon {
  stroke: var(--icon-color);
  height: 100%;
  vertical-align: middle;
  cursor: pointer;
}

.icon:hover {
  stroke: #1565c0;
}

.sun, .moon {
  margin-left: 15px;
}

.sun:hover {
  stroke: #ffff00;
}

.moon:hover {
  stroke: #c9c9c9;
}

.cat {
  height: 25px;
  width: 25px;
  transform: ${props => (props.toggle ? "rotate(180deg)" : null)};
}
`

export default GlobalStyle
