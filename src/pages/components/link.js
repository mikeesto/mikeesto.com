import React, { useContext } from "react"
import styled from "styled-components"
import { ToggleContext } from "../../context/toggle"

const Link = styled.a`
  color: ${props => (props.nocolour ? "#eedec4" : "#1565c0")};
  color: ${props => (props.toggle ? "#1565c0" : null)};
  text-decoration: none;

  &:hover {
    border-bottom: ${props => (props.noline ? null : "1px dotted black")};
    cursor: pointer;
  }
`

export default ({ href, children, nocolour, noline }) => {
  const [toggle] = useContext(ToggleContext)

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      nocolour={nocolour}
      noline={noline}
      toggle={toggle}
    >
      {children}
    </Link>
  )
}
