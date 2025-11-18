import { useState, useEffect, useCallback } from 'react'
import { Box, Flex, Label, Select, Button, Text } from 'theme-ui'
import Page from 'popup/components/Page'
import Checkbox from 'popup/components/CheckBox'
import DebouncedInput from 'popup/components/DebouncedInput'
import detachDebugger from 'utils/detachDebugger'
import countryLocales from 'utils/countryLocales'
import configurations from 'utils/configurations'
import getIp from 'utils/getIp'
import { ipData } from 'utils/getIpTypes'
import { getTimezoneDisplayName } from 'utils/timezoneUtils'
import { RotateCw } from 'react-feather'
import { polyfillCountryFlagEmojis } from "country-flag-emoji-polyfill";

interface IPInfoPageProps {
    tab: string
}

const IPInfoPage = ({ tab }: IPInfoPageProps) => {
    const [browserDefault, setBrowserDefault] = useState(true)
    const [ipData, setIpData] = useState<ipData>()
    const [ipInfo, setIpInfo] = useState('loading...')
    const [timezone, setTimezone] = useState('')
    const [locale, setLocale] = useState('')
    const [lat, setLatitude] = useState('')
    const [lon, setLongitude] = useState('')
    const [configuration, setConfiguration] = useState('custom')

    polyfillCountryFlagEmojis();

    const reloadIp = useCallback(() => {
        setIpInfo('loading...')
        getIp()
            .then((ipDataRes) => {
                setIpData(ipDataRes)
                setIpInfo(`${getFlagEmoji(ipDataRes.countryCode)} ${ipDataRes.query}`)
            })
            .catch(() => {
                setIpInfo('error')
            })
    }, [])

    useEffect(() => {
        reloadIp()
    }, [reloadIp])

    // 监听IP数据变化，自动刷新页面
    useEffect(() => {
        const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
            if (changes.ipData) {
                console.log('[Vytal] IP data updated, auto-refreshing display')
                const newIpData = changes.ipData.newValue
                if (newIpData) {
                    setIpData(newIpData)
                    setIpInfo(`${getFlagEmoji(newIpData.countryCode)} ${newIpData.query}`)
                }
            }
        }

        chrome.storage.onChanged.addListener(handleStorageChange)

        // 清理监听器
        return () => {
            chrome.storage.onChanged.removeListener(handleStorageChange)
        }
    }, [])

    useEffect(() => {
        chrome.storage.local.get(
            [
                'locationBrowserDefault',
                'configuration',
                'timezone',
                'locale',
                'lat',
                'lon',
            ],
            (storage) => {
                storage.configuration && setConfiguration(storage.configuration)
                storage.locationBrowserDefault !== undefined &&
                    setBrowserDefault(storage.locationBrowserDefault)
                if (storage.configuration === 'matchIp' && ipData) {
                    setTimezone(ipData.timezone)
                    setLocale(countryLocales[ipData.countryCode].locale)
                    setLatitude(`${ipData.lat}`)
                    setLongitude(`${ipData.lon}`)
                    chrome.storage.local.set({
                        timezone: ipData.timezone,
                        locale: countryLocales[ipData.countryCode].locale,
                        lat: ipData.lat,
                        lon: ipData.lon,
                    })
                } else {
                    storage.timezone && setTimezone(storage.timezone)
                    storage.locale && setLocale(storage.locale)
                    storage.lat && setLatitude(storage.lat)
                    storage.lon && setLongitude(storage.lon)
                }
            }
        )
    }, [ipData])

    const changeBrowserDefault = () => {
        detachDebugger()
        chrome.storage.local.set({
            locationBrowserDefault: !browserDefault,
        })
        setBrowserDefault(!browserDefault)
    }

    const changeConfiguration = (e: any) => {
        detachDebugger()
        setConfiguration(e.target.value)
        chrome.storage.local.set({
            configuration: e.target.value,
        })
        if (e.target.value === 'matchIp') {
            if (ipData) {
                setTimezone(ipData.timezone)
                setLocale(countryLocales[ipData.countryCode].locale)
                setLatitude(`${ipData.lat}`)
                setLongitude(`${ipData.lon}`)
                chrome.storage.local.set({
                    timezone: ipData.timezone,
                    locale: countryLocales[ipData.countryCode].locale,
                    lat: ipData.lat,
                    lon: ipData.lon,
                })
            }
        } else if (e.target.value === 'custom') {
            setTimezone('')
            setLocale('')
            setLatitude('')
            setLongitude('')
            chrome.storage.local.set({
                timezone: '',
                locale: '',
                lat: '',
                lon: '',
            })
        } else {
            setTimezone(configurations[e.target.value].timezone)
            setLocale(configurations[e.target.value].locale)
            setLatitude(configurations[e.target.value].lat)
            setLongitude(configurations[e.target.value].lon)
            chrome.storage.local.set({
                timezone: configurations[e.target.value].timezone,
                locale: configurations[e.target.value].locale,
                lat: configurations[e.target.value].lat,
                lon: configurations[e.target.value].lon,
            })
        }
    }

    const changeInputText = () => {
        if (configuration !== 'custom') {
            setConfiguration('custom')
            chrome.storage.local.set({
                configuration: 'custom',
            })
        }
    }

    const getFlagEmoji = (countryCode: string) => {
        const codePoints = countryCode
            .toUpperCase()
            .split('')
            .map((char) => 127397 + char.charCodeAt(0))
        return String.fromCodePoint(...codePoints)
    }

    // 渲染IP信息表格
    const renderIPInfoTable = () => {
        if (!ipData) return null

        const infoItems = [
            { label: 'IP Address', value: ipData.query },
            { label: 'Country', value: `${getFlagEmoji(ipData.countryCode)} ${ipData.country}` },
            { label: 'ZIP Code', value: ipData.zip || 'N/A' },
            { label: 'Coordinates', value: `${ipData.lat}, ${ipData.lon}` },
            { label: 'Timezone', value: getTimezoneDisplayName(ipData.timezone) },
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

    return (
        <Page isCurrentTab={tab === 'ipInfo'} title={'IP Information'}>
            <Flex
                sx={{
                    alignItems: 'center',
                    mb: '12px'
                }}
            >
                <Text sx={{ fontWeight: '600', mr: '8px' }}>Current IP:</Text>
                <Text sx={{ mr: '8px' }}>{ipInfo}</Text>
                <Button
                    variant="secondary"
                    onClick={reloadIp}
                    sx={{
                        p: '4px 8px',
                        fontSize: '12px',
                        height: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <RotateCw size={14} />
                </Button>
            </Flex>

            {renderIPInfoTable()}
        </Page>

    )
}

export default IPInfoPage