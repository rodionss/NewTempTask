import styled from 'styled-components/native'
import { Text, Link } from '@components/main'

export const Wrapper = styled.View`
  flex: 1;
  width: 100%;
  padding: 20px;
  justify-content: center;
  align-items: center;
  background: rgba(29, 29, 29, 0.8);
`

export const DigestWrapper = styled.View`
  width: 100%;
  border-radius: 35px;
  background-color: #111313;
  display: flex;
  justify-content: center;
  padding: 25px 15px;
  margin-bottom: 10px;
`

export const Title = styled(Text)`
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  color: #fafafa;
`

export const NotificationListWrapper = styled.View`
  margin-bottom: 25px;
  max-height: 400px;
`

export const RoundButton = styled(Link)`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: #333232;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const CloseIcon = styled.Image`
  top: 2px;
  width: 15px;
  height: 15px;
`
