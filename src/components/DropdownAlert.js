import * as React from 'react'
import { Dimensions } from 'react-native'
import DropdownAlert from 'react-native-dropdownalert'
import styled from 'styled-components'
import { assetList } from '../assets'
import { DropdownService } from '../services'
import { STATUS_BAR_HEIGHT } from '../utils'

const TitleContainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 24px;
`
const Title = styled.Text`
  margin-top: 10px;
`

const ImageNext = styled.Image.attrs({
  resizeMode: 'contain',
  source: assetList.arrow,
})`
  width: 34px;
  height: 34px;
  margin-top: 4px;
`

export const DropDownAlert = () => (
  <DropdownAlert
    ref={DropdownService.setDropdown}
    warnColor={'#2b2a35'}
    errorColor={'#ed4337'}
    imageStyle={{ display: 'none' }}
    wrapperStyle={{
      width: Dimensions.get('window').width - 40,
      marginLeft: 20,
    }}
    defaultContainer={{
      borderRadius: 6,
      padding: 8,
      paddingTop: 12,
      marginTop: STATUS_BAR_HEIGHT + 8,
    }}
    messageStyle={{
      marginTop: 6,
      fontSize: 15,
      color: '#FFFFFF',
    }}
  />
)

export const TouchableDropDownAlert = ({ onTap }) => (
  <DropdownAlert
    ref={DropdownService.setClickableDropdown}
    onTap={onTap}
    successColor={'#506AF0'}
    warnColor={'#644DFC'}
    errorColor={'#ed4337'}
    imageStyle={{ display: 'none' }}
    wrapperStyle={{
      width: Dimensions.get('window').width - 40,
      marginLeft: 20,
    }}
    defaultContainer={{
      borderRadius: 6,
      padding: 8,
      paddingTop: 12,
      height: 80,
      marginTop: STATUS_BAR_HEIGHT + 8,
    }}
    messageStyle={{
      marginTop: 6,
      fontSize: 15,
      color: '#FFFFFF',
    }}
    renderTitle={(props, data) => (
      <TitleContainer>
        <Title style={{ ...props.titleStyle }}>{data.title}</Title>
        <ImageNext />
      </TitleContainer>
    )}
  />
)
