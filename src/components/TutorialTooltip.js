import React from 'react'
import styled from 'styled-components'

const Tooltip = styled.TouchableOpacity.attrs({
  activeOpacity: 1,
})`
  position: absolute;
  padding: 12px 14px;
  min-width: 30%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: #1a1d1d;
  border-radius: 20px;
  z-index: 9999;
`

const Separator = styled.View`
  height: 60%;
  width: 1px;
  margin: 0 14px;
  background-color: rgba(255, 255, 255, 0.3);
`

const ButtonOk = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
`

const ButtonText = styled.Text`
  text-align: center;
  font-weight: bold;
  font-size: 14px;
  text-transform: uppercase;
  color: #919191;
`

const TooltipText = styled.Text`
  color: #fff;
  text-align: center;
`

const Triangle = styled.View`
  position: absolute;
  width: 10px;
  height: 10px;
  bottom: -5px;
  left: 50%;
  z-index: 99999;
  transform: rotate(45deg);
  background-color: #1a1d1d;
`

export const TutorialTooltip = ({
  onPressOk,
  onPressTooltip,
  text,
  position,
  positionArrow,
  okText = 'OK',
}) => (
  <Tooltip style={position} onPress={onPressTooltip}>
    <TooltipText>{text} </TooltipText>
    <Separator />
    <ButtonOk onPress={onPressOk}>
      <ButtonText>{okText}</ButtonText>
    </ButtonOk>
    <Triangle style={positionArrow} />
  </Tooltip>
)
