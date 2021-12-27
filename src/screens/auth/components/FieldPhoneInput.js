import React, { useState, useRef, useMemo, useCallback } from 'react'
import CountryPicker, { Flag } from 'react-native-country-picker-modal'
import styled from 'styled-components'
import { THEME } from '../../../const'
import { Header } from '../../../components'
import { BackIcon, CrossIcon, SearchIcon } from '../../../components/icons'
import { STATUS_BAR_HEIGHT, getLongestFromArray } from '../../../utils'
import TextInputMask from 'react-native-text-input-mask'
import countries from 'countries-phone-masks'
import { Text } from '../../../components/main'

const Container = styled.View`
  align-self: center;
  width: 100%;
  border-radius: 20px;
  background-color: #161818;
  font-size: 18px;
  padding: 0 16px;
  height: 54px;
  flex-direction: row;
  align-items: center;
  border: 2px solid ${THEME.formFieldBorderColor};
  color: ${THEME.formFieldValueColor};
`

const Label = styled(Text)`
  font-size: 14px;
  margin-left: 16px;
  margin-bottom: 12px;
  color: #ffffffaa;
`

const CountryContainer = styled.TouchableOpacity`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`

const Input = styled(TextInputMask)`
  align-self: center;
  width: 80%;
  border-radius: 20px;
  font-size: 18px;
  height: 56px;
  padding-left: 12px;
  font-size: 18px;
  color: #f4f4f4;
  font-weight: bold;
`

const CountryCodeText = styled(Text)`
  font-size: 18px;
  color: #f4f4f4;
  font-weight: bold;
`

const Separator = styled.View`
  width: 2px;
  height: 100%;
  margin-left: 12px;
  background-color: ${THEME.formFieldBorderColor};
`

const HeaderCountryFilterStatusBar = styled.View`
  width: 120%;
  height: ${STATUS_BAR_HEIGHT + 20}px;
  position: absolute;
  top: ${-(STATUS_BAR_HEIGHT + 20)}px;
  left: 0;
  right: 0;
  z-index: 99;
  background-color: #000;
`
const HeaderCountryFilter = styled.View`
  width: 100%;
  padding: 0 20px;
  padding-bottom: 20px;
  border-bottom-right-radius: 30px;
  border-bottom-left-radius: 30px;
  background-color: #000;
`
const SearchContainer = styled.View`
  flex-direction: row;
  width: 100%;
  height: 44px;
  padding: 0 16px;
  border-radius: 20px;
  align-self: center;
  align-items: center;
  background-color: #333232;
`

const SearchInput = styled.TextInput`
  margin-left: 16px;
  font-weight: 500;
  font-size: 16px;
  width: 80%;
  color: #fff;
`

const BackButton = styled.TouchableOpacity`
  position: absolute;
  top: 0;
  z-index: 999;
  left: 20px;
  width: 20px;
  height: 20px;
`

const CrossButton = styled.TouchableOpacity`
  position: absolute;
  right: 16px;
`

const ItemContainer = styled.TouchableOpacity`
  width: 100%;
  height: 44px;
  align-items: center;
  padding: 0 20px;
  flex-direction: row;
`

const CountryName = styled(Text)`
  font-size: 15px;
  line-height: 18px;
  color: #ffffff;
`

const CountryCode = styled(Text)`
  font-weight: 800;
  font-size: 15px;
  margin-left: auto;
  text-align: right;
  color: #ffffff;
`

const FieldPhoneInput = ({
  name,
  ref,
  selectCountry,
  selectedCountry,
  input: { onChange, value, ...input },
  ...props
}) => {
  const [visibleCountryPicker, setVisiblePicker] = useState(false)
  const inputRef = useRef(null)
  const [filter, setFilter] = useState('')
  const formatedPlaceholder = useMemo(
    () =>
      selectedCountry.mask
        .replace(/\d|\#/g, '0')
        .replace(/-/g, ' ')
        .replace(/\)/g, ' ')
        .replace(/\(/g, ''),
    [selectedCountry],
  )

  const formatedMask = useMemo(
    () =>
      formatedPlaceholder
        .split(' ')
        .map((x) => `[${x}]`)
        .join(' '),
    [formatedPlaceholder],
  )

  const onChangeFilter = useCallback((text, props) => {
    setFilter(text)
    // there's a bug with handling + char in react-native-country-picker-modal
    // https://github.com/xcarpentier/react-native-country-picker-modal/pull/427
    props.onChangeText(text.replace('+', ''))
  })

  return (
    <>
      <Label>Phone number</Label>
      <Container style={props.containerStyle}>
        <CountryContainer onPress={() => setVisiblePicker(true)}>
          <CountryPicker
            theme={{
              backgroundColor: THEME.secondaryBackgroundColor,
              primaryColorVariant: THEME.secondaryBackgroundColor,
              fontSize: 16,
              onBackgroundTextColor: '#fff',
              filterPlaceholderTextColor: '#aaa',
            }}
            withFlag
            withFilter
            flatListProps={{
              renderItem: ({ item }) => {
                return (
                  <ItemContainer
                    onPress={() => {
                      const mask = countries.find(
                        (c) => c.name === item.name,
                      ).mask
                      selectCountry({
                        ...item,
                        mask:
                          typeof mask === 'string'
                            ? mask
                            : getLongestFromArray(mask),
                      })
                      setVisiblePicker(false)
                      inputRef.current && inputRef.current.focus()
                    }}
                  >
                    <Flag countryCode={item.cca2} flagSize={26} />
                    <CountryName>{item.name}</CountryName>
                    <CountryCode>+{item.callingCode[0]}</CountryCode>
                  </ItemContainer>
                )
              },
            }}
            onClose={() => setVisiblePicker(false)}
            withCloseButton={false}
            renderCountryFilter={(props) => {
              return (
                <HeaderCountryFilter>
                  <BackButton onPress={() => setVisiblePicker(false)}>
                    <BackIcon />
                  </BackButton>
                  <HeaderCountryFilterStatusBar />
                  <Header
                    title={'SELECT REGION'}
                    containerStyle={{ height: 40, margin: 0, padding: 0 }}
                  />
                  <SearchContainer>
                    <SearchIcon color={'#FAFAFA'} opacity={0.6} />
                    <SearchInput
                      {...props}
                      autoFocus={true}
                      value={filter}
                      onChangeText={(text) => onChangeFilter(text, props)}
                      placeholderTextColor={'#919191'}
                      placeholder={'Find your region'}
                    />
                    {props.value ? (
                      <CrossButton onPress={() => onChangeFilter('', props)}>
                        <CrossIcon />
                      </CrossButton>
                    ) : null}
                  </SearchContainer>
                </HeaderCountryFilter>
              )
            }}
            renderFlagButton={() => (
              <Flag countryCode={selectedCountry.cca2} flagSize={26} />
            )}
            visible={visibleCountryPicker}
          />
          <CountryCodeText>
            {selectedCountry.cca2} +{selectedCountry.callingCode}
          </CountryCodeText>
        </CountryContainer>
        <Separator />
        <Input
          {...props}
          {...input}
          ref={inputRef}
          value={value}
          onChangeText={(_, extracted) => onChange(extracted)}
          placeholder={formatedPlaceholder}
          mask={formatedMask}
        />
      </Container>
    </>
  )
}
export default FieldPhoneInput
