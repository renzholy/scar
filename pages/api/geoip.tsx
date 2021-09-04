import { NextApiRequest, NextApiResponse } from 'next'
import geolite2 from 'geolite2'
import maxmind from 'maxmind'
import get from 'lodash/get'

const lookup = await maxmind.open(geolite2.paths.city)

export default async function GeoIP(req: NextApiRequest, res: NextApiResponse) {
  const { ips } = req.body as { ips: string[] }
  res.json(
    await Promise.all(
      ips.map((ip) => {
        const result = lookup.get(ip)
        return {
          lat: get(result, 'location.latitude'),
          lon: get(result, 'location.longitude'),
        }
      }),
    ),
  )
}
