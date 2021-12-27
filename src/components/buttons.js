import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import styled, { css } from 'styled-components/native'
import { THEME } from '../const'
import { Link, Text } from './main'

const PrimaryButtonContainer = styled(Link)`
  height: ${({ size, height }) =>
    height ? height : size === 'small' ? 36 : 56}px;
  border-radius: ${({ size }) => (size === 'small' ? 16 : 24)}px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  ${({ full }) =>
    full &&
    css`
      width: 100%;
    `}
  background-color: ${({ loading, light }) =>
    light
      ? '#333232'
      : loading
      ? THEME.secondaryBackgroundColor
      : THEME.primaryButtonColor};
`

const FeedButtonContainer = styled(PrimaryButtonContainer)`
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.4);
  border-radius: 20px;
  width: ${({ width }) => width || '60%'};
  height: 44px;
  justify-content: center;
  align-items: center;
`

const PrimaryButtonText = styled(Text)`
  font-weight: 800;
  font-size: 15px;
  letter-spacing: 1.3px;
  color: #fff;
  padding: 0 14px 0 14px;
  text-transform: uppercase;
`

const PrimaryButtonLoader = styled.ActivityIndicator.attrs({
  color: '#fff',
})`
  position: absolute;
`

export const PrimaryButton = ({
  onPress,
  text,
  loading,
  disabled,
  size,
  full,
  height,
  containerStyle,
  light = false,
}) => (
  <PrimaryButtonContainer
    size={size}
    style={containerStyle}
    onPress={onPress}
    full={full}
    loading={loading}
    disabled={disabled}
    height={height}
    light={light}
  >
    {loading ? <PrimaryButtonLoader /> : null}
    <PrimaryButtonText style={{ opacity: loading ? 0 : 1 }}>
      {text}
    </PrimaryButtonText>
  </PrimaryButtonContainer>
)

export const FeedPrimaryButton = ({
  onPress,
  width,
  text,
  loading,
  ...props
}) => (
  <FeedButtonContainer {...props} width={width} onPress={onPress}>
    <LinearGradient
      colors={['#FD7020', '#FF0101']}
      start={[0, 0]}
      end={[0, 1]}
      style={{
        boxShadow: '0px 2px 18px rgba(255, 106, 22, 0.7)',
        width: '100%',
        height: '100%',
        borderRadius: 16,
        position: 'absolute',
      }}
    />
    {loading ? <PrimaryButtonLoader /> : null}
    <PrimaryButtonText style={{ opacity: loading ? 0 : 1, fontWeight: 'bold' }}>
      {text}
    </PrimaryButtonText>
  </FeedButtonContainer>
)

const RoundIconContainer = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  height: ${({ size }) => size || 24};
  width: ${({ size }) => size || 24};
  border-radius: ${({ size }) => size / 2 || 12};
  background-color: #1a1a1c;
  border: 0.5px solid #ffffff;
`

export const RoundIconButton = ({ size, icon, onPress, style }) => (
  <RoundIconContainer size={size} style={style} onPress={onPress}>
    {icon}
  </RoundIconContainer>
)

const ButtonIconContainer = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  height: ${({ size }) => size || 44};
  width: ${({ size }) => size || 44};
  border-radius: ${({ size }) => size / 4 || 18};
  background-color: #111111aa;
`

const AdditionalText = styled(Text)`
  font-weight: bold;
  font-size: 12px;
  text-align: center;
  color: #ffffff;
  margin-top: 2px;
  text-shadow: 1px 1px 1px rgba(62, 62, 62, 0.5);
`

export const IconButton = ({
  size,
  icon,
  onPress,
  text,
  style,
  children,
  onLongPress,
}) => (
  <>
    <ButtonIconContainer
      size={size}
      style={style}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      {children ? children : icon}
    </ButtonIconContainer>
    {text ? <AdditionalText>{text}</AdditionalText> : null}
  </>
)

const SecondaryButtonContainer = styled(Link)`
  border: 1px solid #fff;
  background-color: ${THEME.primaryBackgroundColor};

  height: ${({ size }) => (size == 'small' ? 36 : 56)}px;
  border-radius: ${({ size }) => (size == 'small' ? 16 : 24)}px;
  ${({ full }) =>
    full &&
    css`
      width: 100%;
    `}

  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const SecondaryButtonText = styled(Text)`
  font-weight: 600;
  font-size: 15px;
  color: #fff;
  padding: 0 14px 0 14px;
  text-transform: uppercase;
`

export const SecondaryButton = ({ onPress, text, loading, size }) => (
  <SecondaryButtonContainer onPress={onPress} size={size}>
    {loading ? <PrimaryButtonLoader /> : null}
    <SecondaryButtonText style={{ opacity: loading ? 0 : 1 }}>
      {text}
    </SecondaryButtonText>
  </SecondaryButtonContainer>
)

export const ComplexButton = ({ onPress, text, loading, primary, size }) =>
  primary ? (
    <PrimaryButton
      onPress={onPress}
      text={text}
      loading={loading}
      size={size}
    />
  ) : (
    <SecondaryButton
      onPress={onPress}
      text={text}
      loading={loading}
      size={size}
    />
  )

const OnboardingButtonContainer = styled(Link)`
  width: 100%;
  height: 56px;
  align-items: center;
  border-radius: 24px;
  justify-content: center;
  border: ${({ light }) => (light ? 0 : 0)}px solid #ffffff;
  background-color: ${({ light, disabled }) =>
    disabled ? '#1F1F1F' : light ? '#00000000' : '#333232'};
`

const OnboardingButttonText = styled(Text)`
  font-size: 15px;
  letter-spacing: 1.3px;
  font-weight: bold;
  text-transform: uppercase;
  color: ${({ light, disabled }) =>
    disabled ? '#707070' : light ? THEME.primaryBackgroundColor : '#FFF'};
`

const OnboardingLoader = styled.ActivityIndicator.attrs({
  color: '#fff',
})`
  margin: auto;
`

export const OnboardingButton = ({
  loading,
  text,
  onPress,
  light,
  disabled,
  full,
  containerStyle,
}) =>
  light ? (
    <PrimaryButton
      text={text}
      full={full}
      loading={loading}
      onPress={onPress}
      disabled={disabled}
      containerStyle={containerStyle}
    />
  ) : (
    <OnboardingButtonContainer
      style={containerStyle}
      disabled={disabled}
      light={light}
      onPress={onPress}
    >
      {loading ? (
        <OnboardingLoader />
      ) : (
        <OnboardingButttonText disabled={disabled} light={light}>
          {text}
        </OnboardingButttonText>
      )}
    </OnboardingButtonContainer>
  )
