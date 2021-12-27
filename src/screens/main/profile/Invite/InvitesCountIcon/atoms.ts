import styled, { css } from 'styled-components/native'
import { assetList } from '@assets/index'
import { Text } from '@components/main'

type SizeProps = {
  large?: boolean
}

export const Wrapper = styled.View`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const InviteIcon = styled.Image.attrs({
  source: assetList.invitesIcon,
})<SizeProps>`
  width: ${({ large }: SizeProps) => (large ? 68 : 30)}px;
  height: ${({ large }: SizeProps) => (large ? 68 : 30)}px;
`

export const InvitesCount = styled.View<SizeProps>`
  position: absolute;
  top: -10px;
  background-color: #ff430e;
  width: ${({ large }: SizeProps) => (large ? 32 : 20)}px;
  height: ${({ large }: SizeProps) => (large ? 32 : 20)}px;
  border-radius: ${({ large }: SizeProps) => (large ? 16 : 10)}px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const InvitesCountText = styled(Text)<SizeProps>`
  color: #fff;

  ${({ large }: SizeProps) =>
    large &&
    css`
      font-size: 22px;
    `}
`
