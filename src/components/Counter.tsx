import React from 'react'
import CountDown from '@components/common/molecules/CountDown'
import { CountDownContainer, RoundIndicator } from './GamesListItem/atoms'

type CounterProps = {
  secondsToEnd?: number
}

export default ({ secondsToEnd }: CounterProps) => {
  return (
    <CountDownContainer>
      <RoundIndicator />
      <CountDown
        size={10}
        timeLabels={{}}
        until={secondsToEnd}
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
    </CountDownContainer>
  )
}
