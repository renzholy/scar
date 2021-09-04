import { Box, Text } from 'grommet'
import useSWR from 'swr'

export default function DataPreview(props: { id: string; type?: string }) {
  const { data } = useSWR(
    `https://arweave.net/${props.id}`,
    (url) => fetch(url).then((response) => response.blob()),
    { revalidateOnFocus: false },
  )

  return (
    <Box background="light-6" height="400px">
      {data ? (
        <object data={URL.createObjectURL(data)} type={props.type} height="400"></object>
      ) : (
        <Text>Loading...</Text>
      )}
    </Box>
  )
}
