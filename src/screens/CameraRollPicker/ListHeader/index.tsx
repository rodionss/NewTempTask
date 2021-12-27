import React from 'react'
import { Line, Wrapper, Icon, LineText } from './atoms'
import { assetList } from '../../../assets'

function ListHeader() {
  return (
    <Wrapper>
      <Line>
        <Icon source={assetList.timerWrapped} />
        <LineText>Videos available for upload – last 72 h</LineText>
      </Line>
    </Wrapper>
  )
}

export default ListHeader
