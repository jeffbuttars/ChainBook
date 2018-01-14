import React from 'react'
import { Card } from 'semantic-ui-react'

export default ({hash}) => {
  return (
    <Card fluid >
      <Card.Header content={hash} />
      <Card.Meta content={block} />
    </Card>
  )
}
