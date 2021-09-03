import useSWR from 'swr'
import chunk from 'lodash/chunk'
import uniqBy from 'lodash/uniqBy'

export default function useIpApi(ips?: string[]) {
  return useSWR<{ lat: number; lon: number }[]>(
    ips ? ['ip-api', 'batch', ...ips] : null,
    async () =>
      uniqBy(
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
      ),
    { revalidateOnFocus: false },
  )
}
