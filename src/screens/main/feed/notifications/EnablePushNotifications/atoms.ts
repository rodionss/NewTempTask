import styled from 'styled-components/native'
import { Link, Text } from '@components/main'
import { Appearance } from '@screens/main/feed/notifications/EnablePushNotifications'

type AppearanceProps = {
  appearance?: Appearance
}

export const Wrapper = styled.View<AppearanceProps>`
  background: ${({ appearance }: AppearanceProps) =>
    appearance === Appearance.Dark ? '#111313' : 'rgba(51, 50, 50, 1)'};
  border-radius: 24px;
  padding: 20px 10px;
  margin: 0 20px 10px 20px;
  position: relative;
`

export const Content = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
`

export const Message = styled.View``

export const Highlighted = styled(Text)`
  font-size: 14px;
  font-weight: 700;
  color: #fff;
`

export const Description = styled(Text)`
  margin-right: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #7d7d7d;
`

export const RoundButton = styled(Link)`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: #5b5a5a;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: -5px;
`

export const CloseIcon = styled.Image`
  top: 2px;
  width: 12px;
  height: 12px;
`
