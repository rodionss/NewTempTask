import React from 'react'
import { Animated } from 'react-native'
import styled from 'styled-components'
import { Checkmark } from '../../../../components/icons'
import { Text } from '../../../../components/main'
import { STATE } from '../../../../const'
import { STATUS_BAR_HEIGHT } from '../../../../utils'

const LoadingStateContainer = styled.View`
  position: absolute;
  width: 100%;
  flex-direction: row;
  padding-left: 16px;
  top: ${STATUS_BAR_HEIGHT}px;
  padding-bottom: 16px;
  align-items: center;
  z-index: 9999;
  justify-content: flex-start;
`

const LoadingStateText = styled(Text)`
  margin-left: 8px;
  margin-right: 16px;
  font-weight: 600;
  color: #fff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
`

const LoadingProgressContainer = styled.View`
  height: 4px;
  width: 68%;
  border-radius: 10px;
  background-color: #353535;
`

const LoadingProgress = styled(Animated.View)`
  position: absolute;
  height: 4px;
  border-radius: 10px;
  background-color: #919191;
`

const UplaodProgress = ({ uploadState, anim }) => (
  <LoadingStateContainer>
    {uploadState === STATE.UPLOAD_VIDEO.COMPLETE ? <Checkmark /> : null}
    <LoadingStateText>
      {uploadState === STATE.UPLOAD_VIDEO.COMPLETE
        ? 'Loading finished'
        : 'Loading...'}
    </LoadingStateText>
    {uploadState === STATE.UPLOAD_VIDEO.COMPLETE ? null : (
      <LoadingProgressContainer>
        <LoadingProgress
          style={{
            width: anim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          }}
        />
      </LoadingProgressContainer>
    )}
  </LoadingStateContainer>
)

export default UplaodProgress
