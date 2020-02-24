import React, { useContext } from "react"
import Helmet from "react-helmet"
import Wrapper from "./components/wrapper"
import Header from "./components/header"
import Year from "./components/year"
import Box from "./components/box.js"
import Project from "./components/project"
import Footer from "./components/footer"
import GlobalStyles from "../styles/global"
import { ToggleContext } from "../context/toggle"
import favicon from "../../static/favicon.ico"

const Index = () => {
  const [toggle] = useContext(ToggleContext)
  return (
    <>
      <Helmet>
        <title>Michael Esteban</title>
        <link rel="icon" href={favicon} />
      </Helmet>
      <GlobalStyles toggle={toggle} />
      <Wrapper>
        <Header />
        <Year value="2020" />
        <Box>
          <Project
            titleValue="This website"
            descriptionValue="I made this website to experiment with using Gatsby.js and Netlify"
            url="https://www.google.com.au"
          />
          <Project
            titleValue="This website"
            descriptionValue="I made this website to experiment with using Gatsby.js and Netlify"
          />
          <Project
            titleValue="This website"
            descriptionValue="I made this website to experiment with using Gatsby.js and Netlify"
          />
          <Project
            titleValue="This website"
            descriptionValue="I made this website to experiment with using Gatsby.js and Netlify"
          />
        </Box>
        <Year value="2019" />
        <Footer />
      </Wrapper>
    </>
  )
}

export default Index
