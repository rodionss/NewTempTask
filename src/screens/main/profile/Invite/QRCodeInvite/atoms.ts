import styled from 'styled-components/native'
import { Text } from '@components/main'
import { assetList } from '@assets/index'
import { THEME } from '../../../../../const'

export const Container = styled.View`
  flex: 1;
  background-color: #111313;
`

export const Wrapper = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
`

export const Step = styled.View`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  border: 3px solid #323434;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
`

export const StepText = styled(Text)`
  font-family: ${THEME.textFont};
  font-weight: 700;
  font-size: 14px;
  color: #fff;
`

export const QRCodeWrapper = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 8px;
  position: relative;
`

export const QRCodeBorder = styled.Image.attrs({
  source: assetList.qrCodeBorder,
})`
  width: 220px;
  height: 220px;
  position: absolute;
`
