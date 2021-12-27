import { TutorialTooltip } from '@components/TutorialTooltip'
import CameraRoll from '@react-native-community/cameraroll'
import moment from 'moment'
import * as R from 'ramda'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { RNCamera } from 'react-native-camera'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import RNConvertPhAsset from 'react-native-convert-ph-asset'
import CountDown from 'react-native-countdown-component'
import { withNavigationFocus } from 'react-navigation'
import { connect } from 'react-redux'
import { change, initialize } from 'redux-form'
import styled from 'styled-components/native'
import { handleErrors } from '../aspects'
import { assetList } from '../assets'
import { TransparentHeader } from '../components'
import {
  CrossIcon,
  RecordButtonGradient,
  SwapCamera,
  TimerCamera,
} from '../components/icons'
import { Container, Link, Text } from '../components/main'
import { completeWelcomeChallenge } from '../modules/auth'
import { completeChallenge } from '../modules/main/duck'
import { DropdownService } from '../services'
import { useAnalytics } from '../utils'
import CameraRollPicker from './CameraRollPicker'

const CountDownContainer = styled.View`
  width: 100%;
  flex-direction: row;
  height: 72px;
  border-radius: 30px;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`

const PreviewCameraContainer = styled.View`
  position: absolute;
  bottom: 92px;
  top: 0;
  left: 0;
  right: 0;
  align-items: center;
  justify-content: center;
  z-index: 8;
  overflow: hidden;
  border-radius: 35px;
  background-color: #333;
`

const PreviewCamera = styled(RNCamera)`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: flex-end;
`

const PreviewCameraBG = styled.View`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: flex-end;
  background-color: #333;
`

const Footer = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 92px;
  flex-direction: row;
  padding: 0 24px;
  align-items: center;
  justify-content: space-between;
  z-index: 9;
`

const GalleryButton = styled(Link)`
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  border-radius: 22px;
`

const RecordButton = styled(Link)`
  width: 80px;
  height: 80px;
  justify-content: center;
  align-items: center;
  margin-bottom: 32px;
`

const TimerButtonContainer = styled.View`
  align-items: center;
  justify-content: center;
`

const TimerButton = styled(Link)`
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
`

const SwapCameraButton = styled(Link)`
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  border-radius: 22px;
`
const ButtonIcon = styled.Image`
  height: 32px;
  width: 32px;
  tint-color: ${({ color }) => color || '#fff'};
`

const TimerPicker = styled.View`
  position: absolute;
  top: -160px;
  min-height: 144px;
  width: 48px;
  border-radius: 18px;
  background-color: #333232;
  border: 2px solid #3f3e3e;
`

const TimerPickerItem = styled(Link)`
  justify-content: center;
  align-items: center;
  height: 44px;
  margin-top: 2px;
  width: 44px;
  align-self: center;
`

const TimerPickerItemText = styled(Text)`
  font-weight: 500;
  font-size: 15px;
  text-align: center;
  color: ${({ active }) => (active ? '#FF430E' : '#fafafa')};
`

const CameraTypes = RNCamera.Constants.Type

const Camera = ({
  title,
  isFocused,
  onPressBack,
  onReceiveVideo,
  showGallery = true,
  hideTutorial = () => {},
}) => {
  const logEvent = useAnalytics()
  const camera = useRef(null)
  const [timer, setTimer] = useState(0)
  const [timerShown, setTimerShown] = useState(false)
  const [timerPicker, setTimerPicker] = useState(false)

  const [pausedCamera, setPausedCamera] = useState(true)
  const [typeCamera, setTypeCamera] = useState(CameraTypes.back)

  const [isLoadingComplete, setLoadingComplete] = useState(false)
  const [durationVideo, setDuration] = useState(0)

  const [cameraRollPickerActive, setCameraRollPickerActive] = useState(false)

  const isRecording = useMemo(
    () => !pausedCamera && durationVideo,
    [pausedCamera, durationVideo],
  )

  setTimeout(() => {
    setLoadingComplete(true)
  }, 500)

  const onPressRecordIn = () => {
    isRecording ? stopRecord() : startRecord()
  }

  const startRecord = () => {
    hideTutorial && hideTutorial()
    if (timer) {
      setTimerShown(true)
    } else {
      setPausedCamera(false)
      setDuration(moment())
      recordVideo()
    }
  }

  const recordVideo = useCallback(() => {
    camera.current
      .recordAsync({
        quality: RNCamera.Constants.VideoQuality['720p'],
        orientation: 'portrait',
        minDuration: 1,
        maxDuration: 10,
        mirrorVideo: typeCamera !== CameraTypes.back,
      })
      .then((res) => {
        const isValidDuration =
          moment().diff(durationVideo, 'milliseconds') > 1500

        if (isValidDuration || !durationVideo) {
          const rollConfig = { type: 'video', album: 'Happyō' }
          CameraRoll.save(res.uri, rollConfig).catch(handleErrors)
          onReceiveVideo(res.uri)
        } else {
          DropdownService.alert(
            'warn',
            'Warning',
            'Minimum video duration is 1 second',
          )
        }
      })
      .finally(() => {
        setPausedCamera(true)
        setDuration(0)
      })
  })

  const stopRecord = useCallback(() => {
    camera.current.stopRecording()
  })

  const onPressRecordOut = useCallback(() => {
    moment().diff(durationVideo, 'milliseconds') > 2000 ? stopRecord() : null
  })

  const onVideoSelect = useCallback((uri) => {
    setCameraRollPickerActive(false)
    RNConvertPhAsset.convertVideoFromUrl({
      url: uri,
      convertTo: 'mov',
      quality: 'original',
    }).then(({ path }) => {
      onReceiveVideo(path)
    })
  }, [])

  const toggleCameraRollPickerActive = useCallback((value) => {
    setCameraRollPickerActive(value)
  }, [])

  const onPressSwapCamera = useCallback(() => {
    setTypeCamera(
      CameraTypes[typeCamera === CameraTypes.back ? 'front' : 'back'],
    )
  })

  return !cameraRollPickerActive ? (
    <Container>
      <TransparentHeader
        title={title}
        rightButton={{
          onPress: onPressBack,
          icon: () => <CrossIcon height={32} width={32} />,
        }}
      />

      <PreviewCameraContainer>
        {timer && timerShown ? (
          <CountDown
            size={150}
            until={timer}
            timeToShow={['S']}
            showSeparator={true}
            running={timerShown}
            onFinish={() => {
              setTimerShown(false)
              setPausedCamera(false)
              setDuration(moment())
              recordVideo()
            }}
            style={{ position: 'absolute', top: 100, zIndex: 999 }}
            digitTxtStyle={{
              color: '#fff',
              fontSize: 150,
              fontWeight: 'bold',
            }}
            digitStyle={{ backgroundColor: 'transparent' }}
            timeLabels={{}}
          />
        ) : null}

        {isLoadingComplete && isFocused ? (
          <PreviewCamera
            ref={camera}
            type={typeCamera}
            onStatusChange={({ cameraStatus }) => {
              logEvent('Camera permission', {
                enable: cameraStatus === 'READY',
              })
            }}
          >
            {({ status }) => {
              return status == 'READY' ? (
                <RecordButton
                  onPressIn={onPressRecordIn}
                  onPressOut={onPressRecordOut}
                >
                  <RecordButtonGradient />
                  <AnimatedCircularProgress
                    style={{ position: 'absolute' }}
                    size={72}
                    width={5}
                    rotation={0}
                    tintColor='#FF0000'
                    tintColorSecondary='#FF9725'
                    fill={isRecording ? 100 : 0}
                    duration={isRecording ? 10000 : 500}
                  />
                </RecordButton>
              ) : null
            }}
          </PreviewCamera>
        ) : (
          <PreviewCameraBG></PreviewCameraBG>
        )}
      </PreviewCameraContainer>
      <Footer>
        {isRecording ? (
          <>
            <CountDownContainer>
              <CountDown
                size={16}
                until={10}
                timeToShow={['M', 'S']}
                showSeparator={true}
                digitTxtStyle={{
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 'bold',
                }}
                digitStyle={{ backgroundColor: 'transparent', width: 22 }}
                timeLabels={{}}
                separatorStyle={{ color: '#fff', marginBottom: 4 }}
              />
            </CountDownContainer>
          </>
        ) : (
          <>
            <TimerButtonContainer>
              {timerPicker ? (
                <TimerPicker>
                  <TimerPickerItem
                    onPress={() => {
                      setTimer(10)
                      setTimerPicker(false)
                    }}
                  >
                    <TimerPickerItemText active={timer === 10}>
                      10s
                    </TimerPickerItemText>
                  </TimerPickerItem>
                  <TimerPickerItem
                    onPress={() => {
                      setTimer(3)
                      setTimerPicker(false)
                    }}
                  >
                    <TimerPickerItemText active={timer === 3}>
                      3s
                    </TimerPickerItemText>
                  </TimerPickerItem>
                  <TimerPickerItem
                    onPress={() => {
                      setTimer(0)
                      setTimerPicker(false)
                    }}
                  >
                    <TimerPickerItemText active={timer === 0}>
                      Off
                    </TimerPickerItemText>
                  </TimerPickerItem>
                </TimerPicker>
              ) : null}
              <TimerButton onPress={() => setTimerPicker(!timerPicker)}>
                <TimerCamera sec={timer} color={timer ? '#FF430E' : '#FFF'} />
              </TimerButton>
            </TimerButtonContainer>
            <SwapCameraButton onPress={onPressSwapCamera}>
              <SwapCamera />
            </SwapCameraButton>
            <GalleryButton
              onPress={
                showGallery ? () => toggleCameraRollPickerActive(true) : null
              }
            >
              {showGallery ? <ButtonIcon source={assetList.gallery} /> : null}
            </GalleryButton>
          </>
        )}
      </Footer>
    </Container>
  ) : (
    <CameraRollPicker
      onImageSelect={onVideoSelect}
      onPressBack={() => toggleCameraRollPickerActive(false)}
    />
  )
}

export const CameraChallenge = R.compose(
  withNavigationFocus,
  connect(undefined, { completeChallenge }),
)(({ completeChallenge, navigation, ...props }) => {
  const id = navigation.state.params.challengeId
  const fromCompletion = navigation.state.params.fromCompletion
  const screen = navigation.state.params.screen

  return (
    <Camera
      {...props}
      title={'FILM 10 SEC VIDEO'}
      onPressBack={() => {
        navigation.goBack()
      }}
      onReceiveVideo={(uri) => {
        navigation.push('CameraVideoEditor', {
          uri,
          onDoneEditing: (videoProps) => {
            completeChallenge({ id, videoProps, fromCompletion, screen })
          },
          buttonStyle: {
            primary: true,
            text: "Publish"
          }
        })
      }}
    />
  )
})

export const CameraCreateChallenge = R.compose(
  withNavigationFocus,
  connect(undefined, { change, initialize }),
)(({ change, navigation, initialize, ...props }) => {
  return (
    <Camera
      {...props}
      title={'CREATE GAME'}
      onPressBack={() => navigation.navigate('Feed')}
      onReceiveVideo={(uri) => {
        navigation.push('CameraVideoEditor', {
          uri,
          onDoneEditing: (videoProps) => {
            initialize('challenge', { videoProps })
            navigation.push('CreateChallenge')
          },
          buttonStyle: {
            primary: false,
            text: "Next"
          }
        })
      }}
    />
  )
})

export const CameraWelcomeChallenge = R.compose(
  withNavigationFocus,
  connect(undefined, { completeWelcomeChallenge }),
)(({ navigation, completeWelcomeChallenge, ...props }) => {
  const [hint, setHint] = useState(false)
  useEffect(() => {
    setHint(true)
  }, [])
  return (
    <>
      <Camera
        {...props}
        title={'WELCOME GAME'}
        showGallery={false}
        hideTutorial={() => setHint(false)}
        onPressBack={() => navigation.navigate('WelcomeChallenge')}
        onReceiveVideo={(uri) => {
          navigation.push('CameraVideoEditor', {
            uri,
            onDoneEditing: (videoProps) => {
              completeWelcomeChallenge({
                videoProps,
                name: 'ME',
                avatar: '',
              })
              navigation.navigate('WelcomeChallenge')
            },
            buttonStyle: {
              primary: true,
              text: "Publish"
            }
          })
        }}
      />
      {hint ? (
        <TutorialTooltip
          text={'Click the button to film'}
          positionArrow={{ left: '54%%' }}
          position={{ bottom: 220, alignSelf: 'center' }}
          onPressTooltip={() => {
            setHint(false)
          }}
          onPressOk={() => {
            setHint(false)
          }}
        />
      ) : null}
    </>
  )
})

export default CameraChallenge
