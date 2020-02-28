import React, { useContext } from "react"
import styled from "styled-components"
import Link from "./link"
import { ToggleContext } from "../../context/toggle"

const Footer = styled.div`
  text-align: center;
  color: var(--text-color);
  font-size: 14px;
  margin-top: 30px;
`

const Underline = styled.span`
  border-bottom: ${props =>
    props.toggle ? "1px dotted black" : "1px dotted #eedec4"};
`

export default () => {
  const [toggle] = useContext(ToggleContext)

  return (
    <Footer>
      Made with{" "}
      <Underline toggle={toggle}>
        <Link href="https://github.com/mikeesto/mikeesto.com" nocolour>
          Gatsby
        </Link>
      </Underline>
      . Hosted on{" "}
      <Underline toggle={toggle}>
        <Link href="https://netlify.com" nocolour>
          Netlify
        </Link>
      </Underline>
      .
    </Footer>
  )
}
