import { BackIcon } from '@components/icons'
import CameraRoll, {
  AssetType,
  PhotoIdentifier,
} from '@react-native-community/cameraroll'
import ListHeader from '@screens/CameraRollPicker/ListHeader'
import ListItem from '@screens/CameraRollPicker/ListItem'
import { useAnalytics } from '@utils/functions'
import {
  getAvailabilityTime,
  getPreviousTimestamp,
  SECOND_MILLISECONDS,
} from '@utils/time'
import formatDuration from 'format-duration'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Dimensions, FlatList } from 'react-native'
import Header from '../../components/common/Header'
import { Container, Wrapper } from './atoms'

const DAYS_COUNT = 3

const ITEMS_PER_ROW = 3
const ITEMS_SPACING = 3
const END_REACHED_THRESHOLD = 0.1

const ASSET_TYPE = 'Videos' as AssetType
const ITEMS_PER_PAGE = 20

type Props = {
  onPressBack: () => void
  onImageSelect: (uri: string) => void
}

function CameraRollPicker({ onPressBack, onImageSelect }: Props) {
  const logEvent = useAnalytics()
  const [content, setContent] = useState<PhotoIdentifier[]>([])
  const [endCursor, setEndCursor] = useState<string | undefined>('')
  const [hasNextPage, setHasNextPage] = useState(false)

  const fromTimeTimestamp =
    getPreviousTimestamp(DAYS_COUNT) * SECOND_MILLISECONDS

  const cameraRollParams = useMemo(
    () => ({
      first: ITEMS_PER_PAGE,
      fromTime: fromTimeTimestamp,
      assetType: ASSET_TYPE,
      ...(endCursor && { after: endCursor }),
    }),
    [endCursor],
  )

  const load = useCallback(() => {
    CameraRoll.getPhotos(cameraRollParams)
      .then(({ page_info, edges }) => {
        const { has_next_page, end_cursor } = page_info
        logEvent('Cameraroll permission', { enable: true })
        setHasNextPage(has_next_page)
        if (has_next_page) {
          setEndCursor(end_cursor)
        }
        setContent((prevState) => [...prevState, ...edges])
      })
      .catch(() => {
        logEvent('Cameraroll permission', { enable: false })
      })
  }, [endCursor])

  useEffect(() => {
    load()
  }, [])

  const itemSize = useMemo(() => {
    const windowWidth = Dimensions.get('window').width
    const spacingsWidth = ITEMS_SPACING * (ITEMS_PER_ROW - 1)
    const itemsWidth = windowWidth - spacingsWidth
    return itemsWidth / ITEMS_PER_ROW
  }, [])

  return (
    <Container>
      <Header
        title='GALLERY'
        leftButton={{
          onPress: onPressBack,
          icon: BackIcon,
        }}
      />
      <Wrapper>
        <FlatList
          data={content}
          numColumns={ITEMS_PER_ROW}
          ListHeaderComponent={ListHeader}
          onEndReached={hasNextPage ? load : undefined}
          onEndReachedThreshold={END_REACHED_THRESHOLD}
          keyExtractor={(item) => item.node.image.uri}
          renderItem={({ item: { node } }) => (
            <ListItem
              size={itemSize}
              availabilityTime={getAvailabilityTime(node.timestamp, DAYS_COUNT)}
              duration={formatDuration(
                Math.ceil(node.image.playableDuration ?? 0) *
                  SECOND_MILLISECONDS,
              )}
              uri={node.image.uri}
              onPress={() => onImageSelect(node.image.uri)}
            />
          )}
        />
      </Wrapper>
    </Container>
  )
}

export default CameraRollPicker
