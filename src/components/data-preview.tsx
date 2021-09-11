import { Box, Spinner } from 'grommet'
import { useState } from 'react'

export default function DataPreview(props: { id: string; type?: string }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <Box background="light-6" height={{ min: '200px' }}>
      <object
        data={`https://arweave.net/${props.id}`}
        type={props.type}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
      {loaded ? null : (
        <Box fill={true} align="center" justify="center">
          <Spinner />
        </Box>
      )}
    </Box>
  )
}
