import React from "react"
import styled from "styled-components"

const H1 = styled.h1`
  color: var(--text-color);
`

const Year = ({ value }) => {
  return (
    <div>
      <H1>{value}</H1>
    </div>
  )
}

export default Year
