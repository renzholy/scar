import { Anchor, AnchorExtendedProps } from 'grommet/components/Anchor'
import { Link, LinkProps } from 'react-router-dom'

export default function AnchorLink(props: LinkProps & AnchorExtendedProps) {
  return <Anchor as={Link} {...props} />
}
