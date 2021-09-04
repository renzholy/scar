import { Text } from 'grommet'
import useSWR from 'swr'

export default function DataPreview(props: { id: string; type?: string }) {
  const { data } = useSWR(
    `https://arweave.net/${props.id}`,
    (url) => fetch(url).then((response) => response.blob()),
    { revalidateOnFocus: false },
  )

  if (!data) {
    return <Text>Loading...</Text>
  }
  return <object data={URL.createObjectURL(data)} type={props.type} height="400"></object>
}
