import { WorldMap } from 'grommet'
import { useMemo } from 'react'
import usePeersLocation from '../hooks/use-peers-location'

export default function Map() {
  const { data: locations } = usePeersLocation()
  const places = useMemo(
    () => locations?.map((place) => ({ location: [place.lat, place.lon], color: 'accent-1' })),
    [locations],
  )

  return <WorldMap places={places} />
}
