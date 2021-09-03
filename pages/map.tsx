import useSWR from 'swr'
import Arweave from 'arweave'
import { WorldMap } from 'grommet'
import { useMemo } from 'react'
import useIpApi from '../hooks/use-ip-api'

const arweave = Arweave.init({})

export default function Map() {
  const { data: peers } = useSWR(['getPeers'], () => arweave.network.getPeers(), {
    refreshInterval: 30 * 1000,
  })
  const ips = useMemo(() => peers?.map((peer) => peer.split(':')[0]), [peers])
  const { data: places } = useIpApi(ips)
  console.log(places)

  return (
    <WorldMap
      places={places?.map((place) => ({ location: [place.lat, place.lon], color: 'accent-1' }))}
    />
  )
}
