import { Box, Flex } from 'theme-ui'

interface IPInfoTableProps {
    ipData?: {
        query: string
        country: string
        countryCode: string
        zip?: string
        lat: number
        lon: number
        timezone: string
        isp: string
        org: string
        proxy: boolean
    }
    getFlagEmoji: (countryCode: string) => string
}

const IPInfoTable = ({ ipData, getFlagEmoji }: IPInfoTableProps) => {
    if (!ipData) return null

    const infoItems = [
        { label: 'IP Address', value: ipData.query },
        { label: 'Country', value: `${getFlagEmoji(ipData.countryCode)} ${ipData.country}` },
        { label: 'ZIP Code', value: ipData.zip || 'N/A' },
        { label: 'Coordinates', value: `${ipData.lat}, ${ipData.lon}` },
        { label: 'Timezone', value: ipData.timezone },
        { label: 'ISP', value: ipData.isp },
        { label: 'Organization', value: ipData.org },
        { label: 'Proxy', value: ipData.proxy ? 'Yes' : 'No' }
    ]

    return (
        <Box
            sx={{
                border: '1px solid',
                mt: '12px',
                mb: '8px',
                borderRadius: '4px',
                borderColor: 'grey',
            }}
        >
            {infoItems.map((item, index) => (
                <Flex
                    key={item.label}
                    sx={{
                        alignItems: 'center',
                        p: '8px 12px',
                        borderBottom: index < infoItems.length - 1 ? '1px solid' : 'none',
                        borderColor: 'grey',
                        '&:last-child': {
                            borderBottom: 'none'
                        }
                    }}
                >
                    <Box
                        sx={{
                            fontWeight: '700',
                            width: '120px',
                            pr: '12px',
                            fontSize: '14px',
                            color: 'text'
                        }}
                    >
                        {item.label}
                    </Box>
                    <Box
                        sx={{
                            flex: 1,
                            fontSize: '14px',
                            color: 'text',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                        title={item.value}
                    >
                        {item.value}
                    </Box>
                </Flex>
            ))}
        </Box>
    )
}

export default IPInfoTable