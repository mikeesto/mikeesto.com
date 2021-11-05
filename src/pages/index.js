import React, { useContext } from "react"
import Helmet from "react-helmet"
import useIsMounted from "../helpers/isMounted"
import Wrapper from "./components/wrapper"
import Header from "./components/header"
import Year from "./components/year"
import Box from "./components/box.js"
import Project from "./components/project"
import Footer from "./components/footer"
import FeaturedProjects from "./components/FeaturedProjects"
import GlobalStyles from "../styles/global"
import { ToggleContext } from "../context/toggle"
import favicon from "../../static/favicon.ico"

const Index = () => {
  const [toggle] = useContext(ToggleContext)
  const isMounted = useIsMounted()
  return (
    <>
      <Helmet>
        <html lang="en" />
        <title>Michael Esteban</title>
        <link rel="icon" href={favicon} />
        <meta charset="UTF-8" />
        <meta
          name="description"
          content="Michael Esteban's small slice of the internet"
        />
      </Helmet>
      {/* Pass mounted prop to only add transition styling once the page has loaded */}
      <GlobalStyles mounted={isMounted.current} toggle={toggle} />
      <Wrapper>
        <Header />
        <FeaturedProjects />
        <Year value="2021" />
        <Box>
          <Project
            titleValue="Emoji Maker"
            descriptionValue="Create custom emoji"
            url="https://emojimakers.netlify.app/"
          />
          <Project
            titleValue="Uploading files to the Raspberry Pi Pico without Thonny"
            descriptionValue="Using a VSCode and CLI workflow"
            url="https://mikeesto.medium.com/uploading-to-the-raspberry-pi-pico-without-thonny-53de1a10da30"
          />
          <Project
            titleValue="Temperature Blanket"
            descriptionValue="Inspired by knitted/crocheted temperature blankets that have a coloured row for every day of the year"
            url="https://temperature-blanket.netlify.app/"
          />
          <Project
            titleValue="Next.js & MDX w/ code highlighting"
            descriptionValue="How to configure Next.js to render MDX files with code highlighting"
            url="https://dev.to/mikeesto/next-js-mdx-w-code-highlighting-16fi"
          />
          <Project
            titleValue="Guess the width"
            descriptionValue="Can you drag the div to the right width?"
            url="https://guessthewidth.netlify.app/"
          />
        </Box>
        <Year value="2020" />
        <Box>
          <Project
            titleValue="Safe Santa Pictures"
            descriptionValue="A COVID safe photo opportunity"
            url="https://safe-santa-pictures.netlify.app/"
          />
          <Project
            titleValue="Top Level Await in Node"
            descriptionValue="A commonly requested feature unlocked in Node v14.8.0"
            url="https://dev.to/mikeesto/top-level-await-in-node-2jad"
          />
          <Project
            titleValue="The Talking Box"
            descriptionValue="Revealing strengths of adults with severe cognitive disabilities"
            url="https://dl.acm.org/doi/abs/10.1145/3373625.3417025"
          />
          <Project
            titleValue="Create React App Turns Four"
            descriptionValue="A quick overview of what has changed in CRA v4"
            url="https://dev.to/mikeesto/create-react-app-turns-four-3ace"
          />
          <Project
            titleValue="useWakeLock"
            descriptionValue="A custom React hook for the Screen Wake Lock API"
            url="https://www.npmjs.com/package/use-wake-lock"
          />
          <Project
            titleValue="Incrementally building the web"
            descriptionValue="A discussion on using Gatsby, Netlify Build Hooks and GitHub Actions to build static, dynamic data driven websites"
            url="https://dev.to/mikeesto/incrementally-building-the-web-lc1"
          />
          <Project
            titleValue="The Playful Tingtibi Community Birdhouse"
            descriptionValue="Investigating connecting people in remote communities through nature to foster stewardship and conservation of endangered species"
            url="https://dl.acm.org/doi/pdf/10.1145/3313831.3376713"
          />
          <Project
            titleValue="Sparkledown"
            descriptionValue="Convert *emphasis* to ✨emphasis✨ in markdown documents"
            url="https://www.npmjs.com/package/sparkledown"
          />
          <Project
            titleValue="Coding on Country"
            descriptionValue="Preliminary explorations with a format to engage young indigenous students from remote communities in design and making"
            url="https://dl.acm.org/doi/pdf/10.1145/3334480.3382992"
          />
          <Project
            titleValue="Headless Wordpress with Next.js"
            descriptionValue="A rewrite of Netlify's Headless WordPress JAMstack Template from Nuxt.js to Next.js"
            url="https://github.com/mikeesto/headless-wp-next"
          />
          <Project
            titleValue="Crocodile Language Friend: Tangibles to Foster Children's Language Use"
            descriptionValue="Encouraging language use in individual and social activities beyond the affordances of screen-based systems"
            url="https://dl.acm.org/doi/pdf/10.1145/3334480.3383031"
          />
          <Project
            titleValue="Junior Developer Jobs"
            descriptionValue="A collation of recent tweets advertising junior developer positions"
            url="https://juniordevjobs.netlify.app/"
          />
        </Box>

        <Year value="2019" />
        <Box>
          <Project
            titleValue="CSS mechanical keyboard"
            descriptionValue="I postponed buying a mechanical keyboard by making a CSS one"
            url="https://codepen.io/Mickel07/full/YdONYK"
          />
          <Project
            titleValue="Christmas e-cards"
            descriptionValue="A 2000s inspired Christmas e-card generator"
            url="https://christmas-ecards.glitch.me/"
          />
          <Project
            titleValue="Firebase authentication"
            descriptionValue="An example app using Firebase authentication with React & Express"
            url="https://github.com/mikeesto/firebase-auth-example"
          />
          <Project
            titleValue="Smile on five"
            descriptionValue="A smol facial expression recognition game"
            url="https://smile-on-five.glitch.me/"
          />
          <Project
            titleValue="Gatsby e-commerce"
            descriptionValue="A Gatsby e-commerce site that uses Stripe integration & Netlify Functions"
            url="https://github.com/mikeesto/ecommerce-gatsby"
          />
          <Project
            titleValue="Australia votes"
            descriptionValue="A collection of 67,284 public tweets published on the night of the 2019 Australian election"
            url="https://github.com/mikeesto/ausvotes19"
          />
          <Project
            titleValue="Python-node-websocket"
            descriptionValue="A starter template for using Python with Node.js and Websocket"
            url="https://github.com/mikeesto/python-node-websocket"
          />
          <Project
            titleValue="micro:bit demos"
            descriptionValue="A collection of demos for the micro:bit"
            url="https://github.com/mikeesto/microbit-demos"
          />
          <Project
            titleValue="Split flap"
            descriptionValue="A fun project modelled on a split flap display"
            url="https://split-flap.glitch.me/"
          />
        </Box>

        <Year value="2018" />
        <Box>
          <Project
            titleValue="Guess the sketch"
            descriptionValue="Can you guess what Magenta's sketch-rnn model is drawing?"
            url="https://guess-the-sketch.glitch.me/"
          />
          <Project
            titleValue="Prototype based programming "
            descriptionValue="A discussion on prototype based programming (with a focus on JavaScript)"
            url="https://github.com/mikeesto/prototype-programming/blob/master/README.md"
          />
          <Project
            titleValue="Twitch.tv chat"
            descriptionValue="An exploration into displaying twitch.tv chat unconventionally"
            url="https://mikeesto.github.io/twitch-chat-art/"
          />
          <Project
            titleValue="Git branches"
            descriptionValue="An introductory guide on using branches"
            url="https://github.com/mikeesto/git-branches/blob/master/README.md"
          />
        </Box>
        <Footer />
      </Wrapper>
    </>
  )
}

export default Index
