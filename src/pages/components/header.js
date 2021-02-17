import React, { useContext, useState } from "react"
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
import { SHORT_BIO, LONG_BIO } from "../../data/bio"

const HeaderStyled = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Avatar = styled.img`
  border-radius: 50%;
  transform: ${props => (props.toggle ? "rotate(180deg)" : null)};
`

const Bio = styled.div`
  font-size: 18px;
  margin-top: 20px;
  color: var(--text-color);
  white-space: pre-wrap;
  position: relative;
  text-align: center;
`

const MoreButton = styled.button`
  transform: rotate(5deg);
  position: absolute;
  top: -50px;
  right: 0%;
  cursor: pointer;
  background: yellow;
  color: black;
  padding: 5px;
  font-size: 16px;
  font-weight: bold;
  border: 1px solid black;

  @media (max-width: 600px) {
    right: -3%;
  }
`

const LessButton = styled(MoreButton)`
  right: initial;
  left: 20%;
  transform: rotate(-5deg);

  @media (max-width: 600px) {
    right: initial;
    left: 4%;
  }
`

const IconRow = styled.div`
  margin-top: 20px;

  a:not(:first-child) {
    margin-left: 15px;
  }
`

const Header = () => {
  const [toggle, setToggle] = useContext(ToggleContext)
  const [bioShort, setBioShort] = useState(true)

  return (
    <HeaderStyled>
      <Avatar
        src={toggle ? myface : myface_grey}
        alt="Photo of Michael"
        toggle={toggle}
      ></Avatar>
      <Bio>
        {bioShort ? (
          <>
            <MoreButton onClick={() => setBioShort(current => !current)}>
              Tell me more!
            </MoreButton>
            {SHORT_BIO}
          </>
        ) : (
          <>
            <LessButton onClick={() => setBioShort(current => !current)}>
              Too much!
            </LessButton>
            {LONG_BIO}
          </>
        )}
      </Bio>

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
            onClick={() => setToggle(toggle => !toggle)}
          />
        ) : (
          <SunIcon
            className="icon sun"
            onClick={() => setToggle(toggle => !toggle)}
          />
        )}
      </IconRow>
    </HeaderStyled>
  )
}

export default Header
