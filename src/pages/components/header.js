import React, { useContext } from "react"
import styled from "styled-components"
import Link from "./link"
import myface from "../../../static/myface.jpeg"
import GithubIcon from "../../../svg/github.svg"
import TwitterIcon from "../../../svg/twitter.svg"
import MailIcon from "../../../svg/mail.svg"
import SunIcon from "../../../svg/sun.svg"
import { ToggleContext } from "../../context/toggle"

const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Avatar = styled.img`
  border-radius: 50%;
`

const IconRow = styled.div`
  margin-top: 20px;

  a:not(:first-child) {
    margin-left: 15px;
  }
`

export default () => {
  const [toggle, updateToggle] = useContext(ToggleContext)

  return (
    <Header>
      <Avatar src={myface} alt="Photo of Michael"></Avatar>
      <IconRow>
        <Link href="https://github.com/mikeesto">
          <GithubIcon className="icon" />
        </Link>
        <Link href="https://twitter.com/mikeesto">
          <TwitterIcon className="icon" />
        </Link>
        <Link href="mailto:hi.mikeesto@gmail.com">
          <MailIcon className="icon" />
        </Link>
        <SunIcon className="icon sun" onClick={() => updateToggle(!toggle)} />
      </IconRow>
    </Header>
  )
}
