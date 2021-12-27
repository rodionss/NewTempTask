import React, { useCallback, useState } from 'react'
import { Alert } from 'react-native'
import FastImage from 'react-native-fast-image'
import ImagePicker from 'react-native-image-crop-picker'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import styled from 'styled-components'
import { assetList } from '../../../../assets'
import { PhotoIcon } from '../../../../components/icons'
import { Link } from '../../../../components/main'
import { PROFILE, THEME } from '../../../../const'

const AvatarClickable = styled(Link)`
  margin: 0 auto;
  margin-top: 24px;
  justify-content: center;
  align-items: center;
`

const Avatar = styled(FastImage)`
  width: 176px;
  height: 176px;
  border-radius: 88px;
  margin-bottom: 12px;
  align-items: center;
  justify-content: center;
  background-color: ${THEME.tertiaryBackground};
`

const RetakeButton = styled(Link)`
  position: absolute;
  width: 56px;
  height: 56px;
  border-radius: 28px;
  padding: 4px;
  align-items: center;
  justify-content: center;
  right: 4px;
  bottom: 4px;
  background: #000;
`

const BorderContainer = styled.View`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  align-items: center;
  justify-content: center;
  border: 0.5px solid #919191;
`

const createChooseAlert = (onChooseImage) =>
  Alert.alert(
    'How you want upload photo?',
    '\nYou can pick photo from gallery\nor take photo with camera',
    [
      {
        text: 'Gallery',
        onPress: () => {
          launchImageLibrary(
            { mediaType: 'photo', saveToPhotos: true, quality: 1 },
            (res) => {
              if (res.didCancel) return
              ImagePicker.openCropper({
                path: res.uri,
                width: PROFILE.imageSize,
                height: PROFILE.imageSize,
                forceJpg: true,
                cropperCircleOverlay: true,
              }).then((image) => {
                onChooseImage(image.path)
              })
            },
          )
        },
      },
      {
        text: 'Camera',
        onPress: () => {
          launchCamera(
            { mediaType: 'photo', saveToPhotos: true, quality: 1 },
            (res) => {
              if (res.didCancel) return
              ImagePicker.openCropper({
                path: res.uri,
                width: PROFILE.imageSize,
                height: PROFILE.imageSize,
                forceJpg: true,
                cropperCircleOverlay: true,
              }).then((image) => {
                onChooseImage(image.path)
              })
            },
          )
        },
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ],
    { cancelable: true },
  )

const UploadAvatar = ({ onPress, uri = null }) => {
  const [avatarUri, setAvatarUri] = useState(uri)
  const onPressChangePhoto = useCallback(() => {
    createChooseAlert((uri) => {
      setAvatarUri(uri)
      onPress(uri)
    })
  })
  return (
    <AvatarClickable onPress={onPressChangePhoto} disabled={avatarUri}>
      <Avatar source={avatarUri ? { uri: avatarUri } : assetList.willSmith}>
        {avatarUri ? null : <PhotoIcon />}
      </Avatar>
      {avatarUri ? (
        <RetakeButton onPress={onPressChangePhoto}>
          <BorderContainer>
            <PhotoIcon width={24} height={20} />
          </BorderContainer>
        </RetakeButton>
      ) : null}
    </AvatarClickable>
  )
}

export default UploadAvatar
