import useSWR from 'swr'
import chunk from 'lodash/chunk'
import uniqBy from 'lodash/uniqBy'
import { SWRConfiguration } from 'swr/dist/types'
import { arweave } from '../utils/arweave'

export default function usePeersLocation(config?: SWRConfiguration) {
  return useSWR<{ latitude: number; longitude: number }[]>(
    'usePeersLocation',
    async () => {
      const peers = await arweave.network.getPeers()
      const ips = uniqBy(peers, (peer) => peer.split('.').slice(0, 3).join('.')).map(
        (peer) => peer.split(':')[0],
      )
      return uniqBy(
        (
          await Promise.all(
            chunk(ips, 100).map(async (ipsChunk) => {
              const response = await fetch('https://app.ipapi.co/bulk/', {
                method: 'POST',
                body: new URLSearchParams({
                  q: ipsChunk.join('\n'),
                  output: 'json',
                }),
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
              })
              const json = await response.json()
              return json.data as { latitude: number; longitude: number }[]
            }),
          )
        )
          .flat()
          .filter(({ latitude, longitude }) => latitude && longitude),
        ({ latitude, longitude }) => `${latitude}${longitude}`,
      )
    },
    config,
  )
}
