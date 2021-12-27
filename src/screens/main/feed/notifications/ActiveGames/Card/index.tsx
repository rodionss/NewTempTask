import React from 'react'
import moment from 'moment'
import Counter from '@components/Counter'
import { Wrapper, Container, StyledPlayer, CounterWrapper } from './atoms'

type Media = {
  thumbnail_url: string
  video_url: string
}

type Props = {
  showCounter: boolean
  endTime: string
  media: Media
  onPress: () => void
}

function Card({ showCounter = false, endTime, media, onPress }: Props) {
  const secondsToEnd = moment(endTime).diff(moment(), 'seconds')

  return (
    <Wrapper>
      <Container onPress={onPress}>
        <StyledPlayer media={media} play={false} />
        {showCounter && (
          <CounterWrapper>
            <Counter secondsToEnd={secondsToEnd} />
          </CounterWrapper>
        )}
      </Container>
    </Wrapper>
  )
}

export default Card
