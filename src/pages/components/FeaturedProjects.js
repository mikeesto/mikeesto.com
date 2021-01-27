import React from "react"
import styled from "styled-components"
import Link from "./link"
import temperatureBlanketImg from "../../../static/temperature-blanket.png"
import juniorDevJobsImg from "../../../static/junior-dev-jobs.png"

const FeaturedProjectsStyled = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 30px auto 0px auto;
  gap: 20px;
  padding: 15px;

  img {
    width: 250px;
    height: 152px;
  }

  h4 {
    color: var(--text-color);
    text-align: center;
  }

  @media (max-width: 750px) {
    display: none;
  }
`

const FeaturedProjects = () => (
  <FeaturedProjectsStyled>
    <div>
      <Link nocolor noline href="https://temperature-blanket.netlify.app/">
        <img src={temperatureBlanketImg} alt="temperature blanket" />
        <h4>2021 Temperature Blanket</h4>
      </Link>
    </div>
    <div>
      <Link nocolour noline href="https://juniordevjobs.netlify.app/">
        <img src={juniorDevJobsImg} alt="junior developer jobs" />
        <h4>Junior Developer Jobs</h4>
      </Link>
    </div>
  </FeaturedProjectsStyled>
)

export default FeaturedProjects
