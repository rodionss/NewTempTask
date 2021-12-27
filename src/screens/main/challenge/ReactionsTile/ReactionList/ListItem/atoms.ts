import styled from 'styled-components/native'
import { Text, Link } from '@components/main'
import { Avatar } from '@screens/main/challenge/CompletionsTile/CompletionsList/ListItem/atoms'

export const Wrapper = styled(Link)`
  position: relative;
  width: 72px;
  align-items: center;
  margin: 0 10px 10px 10px;
`

export const ReactionWrapper = styled.View`
  background-color: #333232;
  width: 32px;
  height: 32px;
  border-radius: 14px;
  position: absolute;
  right: -10px;
  top: -10px;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const StyledAvatar = styled(Avatar)`
  width: 72px;
  height: 72px;
  border-radius: 26px;
`

export const AvatarFallbackWrapper = styled.View`
  width: 72px;
  height: 72px;
  border-radius: 26px;
  background-color: #333232;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const AvatarFallback = styled(Text)`
  color: #fff;
  font-size: 16px;
`

export const Username = styled(Text)`
  font-weight: bold;
  font-size: 12px;
  color: #fff;
  margin: 4px 0;
  text-align: center;
`

export const Name = styled(Text)`
  font-size: 12px;
  color: rgba(250, 250, 250, 0.6);
`
