import styled, { css } from 'styled-components/native'
import { Link, Text } from '@components/main'
import FastImage from 'react-native-fast-image'
import { Dimensions } from 'react-native'

const { width } = Dimensions.get('window')

type SelectedProps = {
  currentCompletion: boolean
}

export const Wrapper = styled.View`
  width: ${(width - 60) / 3}px;
  margin: 0 5px 16px 5px;
  align-items: center;
`

export const Container = styled(Link)<SelectedProps>`
  width: ${(width - 60) / 3}px;
  height: ${(((width - 60) / 3) * 41) / 21}px;
  padding: 0;
  border-radius: 10px;
  background-color: #999;
  overflow: hidden;
  margin-bottom: 8px;

  ${({ currentCompletion }: SelectedProps) =>
    currentCompletion &&
    css`
      width: ${(width - 60) / 3 - 4}px;
      border-color: #fff;
      border-style: solid;
      border-width: 2px;
    `}
`

export const HeaderItem = styled.View`
  flex-direction: row;
  padding: 8px;
  justify-content: space-between;
  align-items: center;
`

export const Avatar = styled(FastImage)`
  width: 24px;
  height: 24px;
  border-radius: 9px;
`

export const PositionNumber = styled(Text)`
  color: #fff;
  font-weight: 600;
  font-size: 12px;
  text-shadow: 1px 1px 1px rgba(62, 62, 62, 0.5);
`

export const AvatarWrapper = styled.View`
  position: relative;
  display: flex;
  align-items: center;
`

export const StarWrapper = styled.View`
  background-color: #333232;
  border-radius: 8px;
  position: absolute;
  top: 14px;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const AvatarFallbackWrapper = styled.View`
  width: 24px;
  height: 24px;
  border-radius: 9px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(51, 50, 50);
`

export const AvatarFallback = styled.Text`
  font-size: 12px;
  color: #fff;
`
