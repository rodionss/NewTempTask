import assetList from '@assets/assetList'
import { RefObject } from 'hoist-non-react-statics/node_modules/@types/react'
import React from 'react'
// @ts-ignore
import ActionButton from 'react-native-circular-action-menu'
import FastImage from 'react-native-fast-image'
import styled from 'styled-components/native'
import { REACTION_ALIAS } from '../const'
import { LikeIcon } from './icons'
import { Text } from './main'

const ReactionContainer = styled.View`
  position: absolute;
  right: 14px;
  z-index: 99999;
  bottom: -134px;
`

type Props = {
  refButton: RefObject<any>
  onPress: (reaction: string) => void
}

const Reactions = ({ onPress, refButton, ...props }: Props) => (
  <ReactionContainer>
    <ActionButton
      size={0}
      ref={refButton}
      position='right'
      radius={150}
      {...props}
    >
      <ActionButton.Item onPress={() => onPress(REACTION_ALIAS.CUTE)}>
        <ReactionIcon size={36} reaction={REACTION_ALIAS.CUTE} />
      </ActionButton.Item>
      <ActionButton.Item onPress={() => onPress(REACTION_ALIAS.LOL)}>
        <ReactionIcon size={36} reaction={REACTION_ALIAS.LOL} />
      </ActionButton.Item>
      <ActionButton.Item onPress={() => onPress(REACTION_ALIAS.WOW)}>
        <ReactionIcon size={36} reaction={REACTION_ALIAS.WOW} />
      </ActionButton.Item>
      <ActionButton.Item onPress={() => onPress(REACTION_ALIAS.SUPER)}>
        <ReactionIcon size={36} reaction={REACTION_ALIAS.SUPER} />
      </ActionButton.Item>
      <ActionButton.Item onPress={() => onPress(REACTION_ALIAS.TOGETHER)}>
        <ReactionIcon size={36} reaction={REACTION_ALIAS.TOGETHER} />
      </ActionButton.Item>
      <ActionButton.Item onPress={() => onPress(REACTION_ALIAS.LIKE)}>
        <IconText size={28}>👍</IconText>
      </ActionButton.Item>
    </ActionButton>
  </ReactionContainer>
)

type ReactionIconProps = {
  reaction: string
  size: number
}

type IconTextProps = {
  size: number
}

const IconText = styled(Text)<IconTextProps>`
  font-size: ${({ size }: IconTextProps) => size}px;
`

const IconImage = styled(FastImage)<{ size: number }>`
  height: ${({ size }: { size: number }) => size}px;
  width: ${({ size }: { size: number }) => size}px;
`

export function ReactionIcon({ reaction, size }: ReactionIconProps) {
  switch (reaction) {
    case REACTION_ALIAS.CUTE:
      return (
        <IconImage source={assetList.smile[REACTION_ALIAS.CUTE]} size={size} />
      )
    case REACTION_ALIAS.LOL:
      return (
        <IconImage source={assetList.smile[REACTION_ALIAS.LOL]} size={size} />
      )
    case REACTION_ALIAS.WOW:
      return (
        <IconImage source={assetList.smile[REACTION_ALIAS.WOW]} size={size} />
      )
    case REACTION_ALIAS.SUPER:
      return (
        <IconImage source={assetList.smile[REACTION_ALIAS.SUPER]} size={size} />
      )
    case REACTION_ALIAS.TOGETHER:
      return (
        <IconImage
          source={assetList.smile[REACTION_ALIAS.TOGETHER]}
          size={size}
        />
      )
    case REACTION_ALIAS.LIKE:
      return <IconText size={size}>👍</IconText>
    default:
      return <LikeIcon />
  }
}

export default Reactions
