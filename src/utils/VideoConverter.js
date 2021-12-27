import RNFetchBlob from 'rn-fetch-blob'
import {NativeModules, Platform} from 'react-native'

export const VideoConverter = {
  convert: (videoProps) => {
    if (Platform.OS !== 'ios') {
      return new Promise((resolve, reject) => {
        reject('Only iOS supported at this moment')
      })
    }

    NativeConverter = NativeModules.VideoConverter;
    return NativeConverter.convert(videoProps)
  }
}

export const getShareVideoOptions = async (uri, local, name, link) => {
  if (local) {
    return {
      title: 'HAPPYŌ',
      message: `${name}\n${link}`,
      url: 'file://' + uri,
      type: 'video/mp4',
      subject: `${name}\n${link}`,
    }
  }
  const res = await RNFetchBlob.config({
    fileCache: true,
    appendExt: 'mp4',
  }).fetch('GET', uri)
  return {
    title: 'HAPPYŌ',
    message: `${name}\n${link}`,
    url: 'file://' + res.path(),
    type: 'video/mp4',
    subject: `${name}\n${link}`,
  }
}
