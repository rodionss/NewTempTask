import styled from 'styled-components/native'
import { AvatarSize } from '@components/common/atoms/Avatar'
import { assetList } from '@assets/index'
import FastImage from 'react-native-fast-image'

type SizeProps = {
  size: number
}

export const Wrapper = styled.View<SizeProps>`
  background-color: #000;
  width: ${({ size }: SizeProps) => size}px;
  height: ${({ size }: SizeProps) => size}px;
  border-radius: ${({ size }: SizeProps) =>
    size === AvatarSize.XL ? 35 : (size * 3) / 8}px;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const AvatarImage = styled.Image<SizeProps>`
  width: ${({ size }: SizeProps) => size}px;
  height: ${({ size }: SizeProps) => size}px;
  border-radius: ${({ size }: SizeProps) =>
    size === AvatarSize.XL ? 35 : (size * 3) / 8}px;
`

export const AvatarFallbackImage = styled(FastImage).attrs({
  source: assetList.avatarFallbackIcon,
})<SizeProps>`
  width: ${({ size }: SizeProps) => size}px;
  height: ${({ size }: SizeProps) => size}px;
`
