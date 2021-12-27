import Modal from 'react-native-modal'
import styled from 'styled-components/native'
import {
  FlatList as NavFlatList,
  SectionList as NSectionList,
} from 'react-navigation'

import { THEME } from '../const'

export const Container = styled.View`
  flex: 1;
  background-color: ${THEME.primaryBackgroundColor};
`

export const Text = styled.Text`
  font-family: ${THEME.textFont};
  color: ${THEME.textColor};
`

export const NavBarTitle = styled.Text`
  font-family: ${THEME.navBarFont};
  font-weight: ${THEME.navBarFontWeight};
  font-size: ${THEME.navBarFontSize};
  color: ${THEME.navBarColor};
`

export const Link = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
})``

export const ModalContainer = styled(Modal).attrs({
  backdropOpacity: 0.5,
  backdropTransitionInTiming: 0,
  backdropTransitionOutTiming: 0,
})`
  margin: 0;
  justify-content: flex-start;
`
export const FlatList = styled(NavFlatList).attrs({
  contentContainerStyle: {
    flexGrow: 1,
    paddingBottom: THEME.containerPaddingWithTabBar,
  },
})``

export const SectionList = styled.SectionList.attrs({
  contentContainerStyle: { paddingBottom: THEME.containerPaddingWithTabBar },
})``

export const NavSectionList = styled(NSectionList).attrs({
  contentContainerStyle: { paddingBottom: THEME.containerPaddingWithTabBar },
})``

export const ProfileSectionList = styled(NSectionList).attrs({
  showsVerticalScrollIndicator: false,
})``

export const ScrollView = styled.ScrollView.attrs({
  contentContainerStyle: {
    flexGrow: 1,
    paddingBottom: THEME.containerPaddingWithTabBar,
  },
})``
