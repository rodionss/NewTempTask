import Tabs from '@components/common/Tabs'
import { BackIcon } from '@components/icons'
import SearchInput from '@components/SearchInput'
import { STATUS_BAR_HEIGHT } from '@utils/functions'
import React, { useMemo, useRef, useState } from 'react'
import { TextInput } from 'react-native'
import styled from 'styled-components/native'
import { HEADER_HEIGHT, THEME } from '../../../../const'
import ExploreMain from './Main'
import Search from './Search'

const Container = styled.View`
  flex: 1;
  background-color: ${THEME.secondaryBackgroundColor};
`

const Header = styled.View<{ search: boolean }>`
  width: 100%;
  border-bottom-left-radius: 35px;
  border-bottom-right-radius: 35px;
  padding-left: ${({ search }: { search: boolean }) => (search ? 44 : 0)}px;
  z-index: 9999;
  padding-top: ${STATUS_BAR_HEIGHT}px;
  padding-bottom: 0;
  justify-content: flex-end;
  min-height: ${STATUS_BAR_HEIGHT + HEADER_HEIGHT}px;
  background-color: ${THEME.primaryBackgroundColor};
`

const BackButton = styled.TouchableOpacity`
  position: absolute;
  top: ${STATUS_BAR_HEIGHT + 12}px;
  left: 12px;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
`

type Props = {
  navigation: any
}

const Explore = ({ navigation }: Props) => {
  const searchRef = useRef<TextInput>(null)
  const [searchFocused, setSearchFocused] = useState(false)
  const [searchTab, setSearchTab] = useState(0)
  const [searchText, onChangeSearchText] = useState('')

  const isSearch = useMemo(
    () => searchFocused || searchText,
    [searchFocused, searchText],
  )

  const tabContainerStyle = useMemo(
    () => ({
      borderBottomWidth: 0,
      marginTop: 4,
      marginBottom: -5,
      paddingRight: isSearch ? 44 : 0,
      width: '80%',
      justifyContent: 'space-between',
      alignItems: 'center',
      alignSelf: 'center',
    }),
    [isSearch],
  )

  return (
    <Container>
      <Header search={!!isSearch}>
        {isSearch ? (
          <BackButton
            onPress={() => {
              setSearchFocused(false)
              onChangeSearchText('')
              searchRef.current && searchRef.current.blur()
            }}
          >
            <BackIcon />
          </BackButton>
        ) : null}
        <SearchInput
          value={searchText}
          innerRef={searchRef}
          placeholder={'Find people and games'}
          onFocus={() => {
            setSearchFocused(true)
          }}
          onChangeText={onChangeSearchText}
          onPressCross={() => onChangeSearchText('')}
        />
        {isSearch ? (
          <Tabs
            value={searchTab}
            tabs={['People', 'Games']}
            onPressTab={setSearchTab}
            tabStyle={{ width: '50%', marginBottom: 4 }}
            textStyle={{ marginBottom: 8, fontSize: 18 }}
            containerStyle={tabContainerStyle}
          />
        ) : null}
      </Header>
      {isSearch ? (
        <Search
          isUserTab={!searchTab}
          navigation={navigation}
          searchText={searchText}
        />
      ) : (
        <ExploreMain navigation={navigation} />
      )}
    </Container>
  )
}

export default Explore
