import React from 'react'
import Share from 'react-native-share'
import { BlurView } from '@react-native-community/blur'
import { TouchElemet } from './atoms'

enum BlurType {
  FirstBlack = 'FirstBlack',
  SecondBlack = 'SecondBlack',
  FirstDarkGrey = 'FirstDarkGrey',
  SecondDarkGrey = 'SecondDarkGrey',
  ThirdDarkGrey = 'ThirdDarkGrey',
  FirstLightGrey = 'FirstLightGrey',
  SecondLightGrey = 'SecondLightGrey',
  ThirdLightGrey = 'ThirdLightGrey',
  BorderLightGrey = 'ThirdLightGrey',
}
type BlurTypeStyles = {
  blur: number
  color: string
}
type TypeAllStyles = {
  [key: string]: BlurTypeStyles
}
type Props = {
  typeBlur: string
}
const BlurStyles = ({ typeBlur }: Props) => {
  const allStyles: TypeAllStyles = {
    FirstBlack: {
      blur: 20,
      color: 'rgba(5, 5, 5, 0.8)',
    },
    SecondBlack: {
      blur: 80,
      color: 'rgba(5, 5, 5, 0.8)',
    },
    FirstDarkGrey: {
      blur: 80,
      color: 'rgba(5, 5, 5, 0.5)',
    },
    SecondDarkGrey: {
      blur: 80,
      color: 'rgba(29, 29, 29, 0.8)',
    },
    ThirdDarkGrey: {
      blur: 120,
      color: 'rgba(0, 0, 0, 0.4)',
    },
    FirstLightGrey: {
      blur: 80,
      color: 'rgba(51, 50, 50, 0.5)',
    },
    SecondLightGrey: {
      blur: 80,
      color: 'rgba(51, 50, 50, 0.25)',
    },
    ThirdLightGrey: {
      blur: 120,
      color: 'rgba(51, 50, 50, 0.15)',
    },
    BorderLightGrey: {
      blur: 19,
      color: 'rgba(51, 50, 50, 0.5)',
    },
  }
  return (
    <BlurView
      blurType='light'
      blurAmount={allStyles[typeBlur].blur}
      reducedTransparencyFallbackColor={allStyles[typeBlur].color}
      style={
        typeBlur === BlurType.BorderLightGrey
          ? {
              position: 'absolute',
              width: '100%',
              height: '100%',
              zIndex: 9997,
              borderWidth: '2px',
              borderColor: '#FFFFFF',
              borderStyle: 'solid',
            }
          : {
              position: 'absolute',
              width: '100%',
              height: '100%',
              zIndex: 9997,
            }
      }
    />
  )
}

export default BlurStyles
