import styled from 'styled-components/native'
import { Text } from '@components/main'
import { THEME } from '../../../../../../const'

export const UserItem = styled.View`
  padding: 0 10px 16px 10px;
  flex-direction: row;
`

export const NotificationContainer = styled.View`
  margin-left: 8px;
  flex: 1;
`

export const NotificationText = styled(Text)`
  font-size: 16px;
  line-height: 22px;
`

export const SectionText = styled(Text)`
  font-size: 15px;
  padding: 24px 0 13px 8px;
  font-weight: 600;
  color: #7d7d7d;
  font-family: ${THEME.textFont};
`

export const NotificationDate = styled(Text)`
  font-size: 16px;
  padding-left: 5px;
  color: ${THEME.formFieldTitleColor};
  line-height: 22px;
`

export const ChallengeLinkText = styled(Text)`
  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
`

export const ButtonsContainer = styled.View`
  flex-direction: row;
  margin-top: 20px;
  justify-content: space-around;
`
export const Wrapper = styled.View`
  background: #111313;
  border-radius: 35px;
  margin: 22px;
`
