import React from 'react'

type Props = {
    item:number;
}

const Card = ({item}: Props) => {
  return (
    <h1>{item}</h1>
  )
}

export default Card