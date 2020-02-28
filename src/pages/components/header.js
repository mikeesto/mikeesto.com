import React, { useContext } from "react"
import styled from "styled-components"
import Link from "./link"
import myface_grey from "../../../static/myface_grey.jpeg"
import myface from "../../../static/myface.jpeg"
import GithubIcon from "../../../svg/github.svg"
import TwitterIcon from "../../../svg/twitter.svg"
import MailIcon from "../../../svg/mail.svg"
import SunIcon from "../../../svg/sun.svg"
import MoonIcon from "../../../svg/moon.svg"
import { ToggleContext } from "../../context/toggle"

const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Avatar = styled.img`
  border-radius: 50%;
  transform: ${props => (props.toggle ? "rotate(180deg)" : null)};
`

const Byline = styled.div`
  text-align: center;
  font-size: 16px;
  margin-top: 20px;
  color: var(--text-color);
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
      <Avatar
        src={toggle ? myface : myface_grey}
        alt="Photo of Michael"
        toggle={toggle}
      ></Avatar>
      <Byline>
        + programming in the world of human–computer interaction <br /> +
        JavaScript & IoT <br />+ standing up for pineapple’s rightful place on
        pizza
      </Byline>
      <IconRow>
        <Link href="https://github.com/mikeesto" noline>
          <GithubIcon className="icon" />
        </Link>
        <Link href="https://twitter.com/mikeesto" noline>
          <TwitterIcon className="icon" />
        </Link>
        <Link href="mailto:hi.mikeesto@gmail.com" noline>
          <MailIcon className="icon" />
        </Link>
        {toggle ? (
          <MoonIcon
            className="icon moon"
            onClick={() => updateToggle(!toggle)}
          />
        ) : (
          <SunIcon className="icon sun" onClick={() => updateToggle(!toggle)} />
        )}
      </IconRow>
    </Header>
  )
}
