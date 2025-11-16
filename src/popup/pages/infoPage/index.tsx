import { Link, Text } from 'theme-ui'
import Page from 'popup/components/Page'
import InfoItem from './InfoItem'

interface InfoPageProps {
  tab: string
}

const InfoPage = ({ tab }: InfoPageProps) => {
  return (
    <Page isCurrentTab={tab === 'info'} title={'Info'}>
      <InfoItem title={'Hide Debugging Notification Bar'}>
        While spoofing data a notification bar becomes visible. Hiding the bar
        can be done by using the{' '}
        <Text sx={{ fontStyle: 'italic', mr: '2px' }}>
          --silent-debugger-extension-api
        </Text>{' '}
        flag.{' '}
        <Link
          variant="hover"
          href={`https://www.chromium.org/developers/how-tos/run-chromium-with-flags`}
          target="_blank"
        >
          Instructions on how to run chrome with flags
        </Link>
        .
      </InfoItem>
      <InfoItem title={'Change IP Address'}>
        Vytal does not change your IP address. To change your IP address you
        will need a VPN or proxy.
      </InfoItem>
      <InfoItem title={'Test Extension'}>
        You can test and compare Vytal and other spoofing extensions on{' '}
        <Link variant="hover" href={`https://vytal.io/#/scan`} target="_blank">
          vytal.io
        </Link>
        .
      </InfoItem>
      <InfoItem title={'Fork Notice'}>
        This project is a fork maintained by ConsimBase. For source and updates, visit{' '}
        <Link
          variant="hover"
          href={`https://github.com/ConsimBase/vytal-rev`} target="_blank">
          ConsimBase/vytal-rev
        </Link>
        .
      </InfoItem>
    </Page>
  )
}

export default InfoPage
