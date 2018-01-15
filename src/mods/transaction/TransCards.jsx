import React from 'react'
import { Card } from 'semantic-ui-react'

export default ({hash, blockNumber}) => {
  return (
    <Card fluid >
      <Card.Header content={hash} />
      <Card.Meta content={blockNumber} />
    </Card>
  )
}
