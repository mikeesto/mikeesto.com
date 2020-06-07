import React from "react"
import styled from "styled-components"
import Link from "./link"
import Cat from "../../../svg/cat.svg"

const Project = styled.div`
  display: flex;
  margin-bottom: 20px;
`

const Title = styled.p`
  margin: 0;
`

const Description = styled.p`
  margin: 0;
  font-size: 16px;
`

const ContentWrapper = styled.div`
  margin: 0 10px;
`

export default ({ titleValue, descriptionValue, url }) => (
  <Project>
    <div>
      <Cat className="cat" />
    </div>
    <ContentWrapper>
      <Title>
        <Link href={url}>{titleValue}</Link>
      </Title>
      <Description>{descriptionValue}</Description>
    </ContentWrapper>
  </Project>
)
