import Video from 'react-native-video'
import React, { memo, useRef } from 'react'
import FastImage from 'react-native-fast-image'
import styled from 'styled-components'

const Container = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -999;
`

const ImageView = styled(FastImage)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

const VideoView = styled(Video)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

const IconContainer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
`

const Player = ({
  media,
  muted = true,
  play = false,
  paused = false,
  preload = false,
  onViewVideo = () => {},
}) => {
  const viewedVideo = useRef(false)
  return (
    <Container>
      {!!media ? (
        <>
          {media.thumbnail_url ? (
            <ImageView source={{ uri: media.thumbnail_url }} />
          ) : null}
          {play ? (
            <VideoView
              muted={muted}
              repeat={true}
              resizeMode={'cover'}
              controls={false}
              bufferConfig={{ bufferForPlaybackMs: 1500 }}
              paused={!play || paused}
              onError={(e) => console.log(e)}
              source={media.video_url ? { uri: media.video_url } : media.video}
              onProgress={({ currentTime }) => {
                if (currentTime > 1 && !viewedVideo.current) {
                  viewedVideo.current = true
                  onViewVideo()
                }
              }}
            />
          ) : null}
        </>
      ) : null}
    </Container>
  )
}

export default memo(Player)
