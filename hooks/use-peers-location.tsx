import useSWR from 'swr'
import chunk from 'lodash/chunk'
import uniqBy from 'lodash/uniqBy'
import Arweave from 'arweave'

const arweave = Arweave.init({})

export default function usePeersLocation() {
  return useSWR<{ lat: number; lon: number }[]>(
    'usePeersLocation',
    async () => {
      const peers = await arweave.network.getPeers()
      const ips = uniqBy(peers, (peer) => peer.split('.').slice(0, 3).join('.')).map(
        (peer) => peer.split(':')[0],
      )
      return uniqBy(
        (
          await Promise.all(
            chunk(ips, 100).map((ipsChunk) =>
              fetch('http://ip-api.com/batch?fields=lat,lon', {
                method: 'POST',
                body: JSON.stringify(ipsChunk),
                headers: { 'Content-Type': 'application/jon' },
              }).then((response) => response.json()),
            ),
          )
        )
          .flat()
          .filter(({ lat, lon }) => lat && lon),
        ({ lat, lon }) => `${lat}${lon}`,
      )
    },
    { refreshInterval: 30 * 1000, revalidateOnFocus: false },
  )
}
