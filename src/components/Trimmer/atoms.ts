import { BlurView } from '@react-native-community/blur'
import styled from 'styled-components'
import { THEME } from '../../const'

const MAIN_HEIGHT = 50

export const TRACK_PADDING_OFFSET = 10
export const HANDLE_WIDTH = 30

export const BlurContainer = styled(BlurView).attrs({
  blurType: 'light',
  blurAmount: 10,
})`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  border: 1px solid ${THEME.textColor};
`

export const Container = styled.View`
  height: ${MAIN_HEIGHT};
  padding: 0 10px 0 10px;
  width: 100%;
`

export const ScrubberContainer = styled.View.attrs({
  hitSlop: {
    top: 8,
    bottom: 8,
    right: 8,
    left: 8,
  },
})`
  z-index: 1;
  position: absolute;
  width: 3px;
  height: 100%;
  align-items: center;
`

export const ScrubberHead = styled.View`
  position: absolute;
  bottom: -28px;
  background-color: ${THEME.tertiaryBackground};
  width: 28px;
  height: 28px;
  border-radius: 28px;
`

export const ScrubberTail = styled.View`
  background-color: ${THEME.tertiaryBackground};
  height: 100%;
  width: 3px;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
`

const Handle = styled.View`
  position: absolute;
  width: ${HANDLE_WIDTH};
  height: ${MAIN_HEIGHT};
  background-color: ${THEME.secondaryBackgroundColor};
`

export const LeftHandle = styled(Handle)`
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
`

export const RightHandle = styled(Handle)`
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
`

export const SelectionContainer = styled.View`
  position: absolute;
  left: ${TRACK_PADDING_OFFSET};
  border-color: ${THEME.secondaryBackgroundColor};
  border-width: 3px;
  height: ${MAIN_HEIGHT};
`
