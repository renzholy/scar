import { Box, Spinner, Text } from 'grommet'

export default function DataTablePlaceholder(props: { empty: boolean }) {
  return (
    <Box
      fill
      align="center"
      justify="center"
      direction="row"
      pad="large"
      background={{ color: 'background-front', opacity: 'strong' }}
    >
      {props.empty ? (
        <Text weight="bold">No data</Text>
      ) : (
        <>
          <Spinner margin={{ right: 'small' }} />
          <Text weight="bold">Loading ...</Text>
        </>
      )}
    </Box>
  )
}
