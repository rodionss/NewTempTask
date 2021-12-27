import { Video } from 'expo-av'
import * as R from 'ramda'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { withNavigationFocus } from 'react-navigation'
import styled from 'styled-components/native'
import { TransparentHeader } from '../components'
import {
  BackIcon,
  PlayIcon,
  SoundIcon,
  SoundMutedIcon,
} from '../components/icons'
import { ComplexButton } from '../components/buttons'
import { Container, Link } from '../components/main'
import Trimmer from '../components/Trimmer'

const VideoContainer = styled.View`
  position: absolute;
  top: 0;
  bottom: 92px;
  left: 0;
  right: 0;
  justify-content: flex-end;
  z-index: 8;
  overflow: hidden;
  border-radius: 35px;
  background-color: #333;
  padding-bottom: 40px;
`

const ButtonContainer = styled.View`
  position: absolute;
  height: 60px;
  left: 0;
  right: 0;
  padding: 0 20px 0 20px;
  bottom: 20px;
`

const VideoView = styled(Video)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
`

const VideoLink = styled(Link)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  align-items: center;
  justify-content: center;
`

const ActionsContainer = styled.View``

const MuteContainer = styled.View`
  padding: 0 0 10px 12px;
`

const VideoEditorDumb = ({ navigation }) => {
  const playerRef = useRef(null)
  const MAX_DURATION = 10000 //ms
  const [trimmerPosition, setTrimmerPosition] = useState({
    left: 0,
    right: 0,
  })
  const [scrubberPosition, setScrubberPosition] = useState(0)

  const [playbackStatus, setPlaybackStatus] = useState({})
  const [isSeeking, setIsSeeking] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  const uri = navigation.state.params.uri
  const onDoneEditing = navigation.state.params.onDoneEditing
  const buttonStyle = navigation.state.params.buttonStyle

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.setProgressUpdateIntervalAsync(100)
    }
  }, [playerRef])

  const playVideo = useCallback(() => {
    if (playbackStatus.isPlaying) {
      playerRef.current.pauseAsync()
    } else {
      const finishedVideo =
        playbackStatus.durationMillis - playbackStatus.positionMillis < 300
      if (finishedVideo) {
        playerRef.current.playFromPositionAsync(trimmerPosition.left)
      } else {
        playerRef.current.playAsync()
      }
    }
  })

  const onPlaybackUpdate = useCallback((status) => {
    setPlaybackStatus(status)

    if (!trimmerPosition.right && status.durationMillis) {
      setTrimmerPosition({
        left: 0,
        right: Math.min(status.durationMillis, MAX_DURATION),
      })
    }

    if (!status.isPlaying) {
      return
    }

    setScrubberPosition(status.positionMillis)

    if (status.positionMillis > trimmerPosition.right) {
      playerRef.current.playFromPositionAsync(trimmerPosition.left)
    } else if (status.positionMillis < trimmerPosition.left) {
      // playerRef.current.setPositionAsync(trimmerPosition.left, {
      //   toleranceMillisBefore: 0,
      //   toleranceMillisAfter: 0
      // })
    }
  })

  const onMuteVideo = useCallback(() => {
    setIsMuted(!isMuted)
  })

  const onHandleChange = useCallback((payload) => {
    if (isSeeking) {
      return
    }

    if (playbackStatus.isPlaying) {
      setIsSeeking(true)
      playerRef.current.stopAsync().then(() => setIsSeeking(false))
    }

    if ('leftPosition' in payload && 'rightPosition' in payload) {
      setTrimmerPosition({
        left: payload.leftPosition,
        right: payload.rightPosition,
      })
    } else if ('leftPosition' in payload) {
      setIsSeeking(true)
      playerRef.current
        .setPositionAsync(payload.leftPosition, {
          toleranceMillisBefore: 0,
          toleranceMillisAfter: 0,
        })
        .then(() => setIsSeeking(false))
        .catch(() => null)
    } else if ('rightPosition' in payload) {
      playerRef.current
        .setPositionAsync(payload.rightPosition, {
          toleranceMillisBefore: 0,
          toleranceMillisAfter: 0,
        })
        .then(() => setIsSeeking(false))
        .catch(() => null)
    }
  })

  const onScrubbing = useCallback((position, isComplete) => {
    if (isSeeking) {
      return
    }

    if (playbackStatus.isPlaying) {
      setIsSeeking(true)
      playerRef.current.stopAsync().then(() => setIsSeeking(false))
    }

    if (isComplete) {
      setScrubberPosition(position)
    } else {
      setIsSeeking(true)
      playerRef.current
        .setPositionAsync(position, {
          toleranceMillisBefore: 0,
          toleranceMillisAfter: 0,
        })
        .then(() => setIsSeeking(false))
        .catch(() => null)
    }
  })

  return (
    <Container>
      <TransparentHeader
        title={'Edit video'}
        leftButton={{
          onPress: () => navigation.goBack(),
          icon: BackIcon,
        }}
      />

      <VideoContainer>
        <VideoLink onPress={playVideo}>
          <VideoView
            ref={playerRef}
            source={{ uri }}
            isMuted={isMuted}
            resizeMode={'cover'}
            onPlaybackStatusUpdate={onPlaybackUpdate}
          />
          {playbackStatus.isPlaying ? null : <PlayIcon />}
        </VideoLink>

        <ActionsContainer>
          <MuteContainer>
            <Link onPress={onMuteVideo}>
              {isMuted ? <SoundMutedIcon /> : <SoundIcon />}
            </Link>
          </MuteContainer>
          {playbackStatus && playbackStatus.durationMillis ? (
            <Trimmer
              totalDuration={playbackStatus.durationMillis}
              maxTrimDuration={MAX_DURATION}
              trimmerLeftHandlePosition={trimmerPosition.left}
              trimmerRightHandlePosition={trimmerPosition.right}
              scrubberPosition={scrubberPosition}
              onHandleChange={onHandleChange}
              onScrubbing={onScrubbing}
            />
          ) : null}
        </ActionsContainer>
      </VideoContainer>
      <ButtonContainer>
        <ComplexButton
          text={buttonStyle.text}
          primary={buttonStyle.primary}
          onPress={() => {
            onDoneEditing({
              url: uri,
              trimFrom: trimmerPosition.left,
              trimTo: trimmerPosition.right,
              mute: isMuted,
              scale: {
                width: 450,
                height: 800,
                fps: 30,
              },
            })
          }}
        />
      </ButtonContainer>
    </Container>
  )
}

export const VideoEditor = R.compose(withNavigationFocus)(VideoEditorDumb)
