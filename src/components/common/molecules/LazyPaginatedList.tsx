import React, { useCallback, useState } from 'react'
import { FlatList, ListRenderItem } from 'react-native'

type Props<T> = {
  data: T[]
  pageSize: number
  keyExtractor: (item: T, index: number) => string
  renderItem: ListRenderItem<T>
  ListHeaderComponent?: JSX.Element
  contentContainerStyle?: object
}

function LazyPaginatedList<T>({
  data,
  pageSize,
  keyExtractor,
  renderItem,
  ListHeaderComponent,
  contentContainerStyle,
}: Props<T>) {
  const [page, setPage] = useState(0)

  const loadMore = useCallback(() => {
    const hasNext = data.length > page * pageSize + 1
    if (hasNext) {
      setPage((prevPage) => prevPage + 1)
    }
  }, [page, pageSize, data])

  const listData = data.slice(0, (page + 1) * pageSize)

  return (
    <FlatList<T>
      data={listData}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onEndReached={loadMore}
      ListHeaderComponent={ListHeaderComponent}
      contentContainerStyle={contentContainerStyle}
    />
  )
}

export default LazyPaginatedList
