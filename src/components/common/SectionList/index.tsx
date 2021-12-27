import React, { useCallback } from 'react'
import {
  SectionList as NativeSectionList,
  FlatList,
  ListRenderItem,
  StyleProp,
  ViewStyle,
} from 'react-native'
import {
  Section,
  RenderSectionArgumentType,
  RenderSectionHeaderArgumentType,
  OnEndReachedArgumentType,
} from './types'
import Wrapper from './atoms'

type Props<T> = {
  containerStyle: StyleProp<ViewStyle>
  numColumns: number
  stickySectionHeadersEnabled?: boolean
  sections: Section<T>[]
  renderItem?: ListRenderItem<T> | null
  renderSectionHeader?: (
    info: RenderSectionHeaderArgumentType<T>,
  ) => JSX.Element | null
  onEndReached?: ((info: OnEndReachedArgumentType) => void) | null
  keyExtractor: (item: T, index: number) => string
}

function SectionList<T>({
  containerStyle,
  numColumns,
  stickySectionHeadersEnabled = true,
  sections,
  renderItem,
  renderSectionHeader,
  onEndReached,
  keyExtractor,
  ...props
}: Props<T>) {
  const renderSection = useCallback((data: RenderSectionArgumentType<T>) => {
    return (
      <FlatList
        data={data.item.list}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        numColumns={numColumns}
      />
    )
  }, [])

  return (
    <Wrapper style={containerStyle}>
      <NativeSectionList
        {...props}
        sections={sections}
        stickySectionHeadersEnabled={stickySectionHeadersEnabled}
        keyExtractor={(item) => item.key}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderSection}
        onEndReached={onEndReached}
      />
    </Wrapper>
  )
}

export default SectionList
