import React, { useMemo } from 'react'
import { Image } from 'react-native'
import CountDown from '@components/common/molecules/CountDown'
import { Link } from '@components/main'
import { secondsToMinutes } from '@utils/time'
import { Header, ImageWrapper, StyledImage, Footer, Duration } from './atoms'
import { assetList } from '../../../assets'

type Props = {
  size: number
  uri: string
  onPress: () => void
  duration: string
  availabilityTime: number
}

function ListItem({ size, uri, onPress, duration, availabilityTime }: Props) {
  const isLastFifteenMinutes = useMemo(() => {
    const availabilityMinutes = secondsToMinutes(availabilityTime)
    return availabilityMinutes <= 15
  }, [availabilityTime])

  return (
    <ImageWrapper>
      <Header lastHour={isLastFifteenMinutes}>
        <Image
          style={{ width: 13, height: 13 }}
          source={assetList.timerFilled}
        />
        <CountDown
          short
          size={10}
          timeLabels={{}}
          until={availabilityTime}
          showSeparator
          timeToShow={['H', 'M', 'S']}
          digitTxtStyle={{
            color: '#fff',
            fontSize: 12,
            fontWeight: 'bold',
          }}
          separatorStyle={{ color: '#fff', width: 5 }}
          digitStyle={{
            backgroundColor: 'transparent',
            width: 16,
          }}
        />
      </Header>
      <Link onPress={onPress}>
        <StyledImage style={{ height: size, width: size }} source={{ uri }} />
      </Link>
      <Footer>
        <Duration>{duration}</Duration>
      </Footer>
    </ImageWrapper>
  )
}

export default ListItem
