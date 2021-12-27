import { Header } from '@components/'
import FeaturedItem from '@components/FeaturedItem'
import { BackIcon } from '@components/icons'
import { Container } from '@components/main'
import UserSearch from '@components/UserSearch'
import { getProfileId, getToken } from '@modules/auth'
import { STATUS_BAR_HEIGHT } from '@utils/functions'
import React, { useCallback, useEffect, useState } from 'react'
import { Dimensions } from 'react-native'
import Carousel from 'react-native-snap-carousel'
import { useSelector } from 'react-redux'
import styled from 'styled-components/native'
import { handleErrors } from '../../../aspects'
import {
  follow,
  getFeaturedUsers,
  searchUser,
  unfollow,
} from '../../../modules/main/managers'
import { withAmplitude } from '../../../utils'

const { height } = Dimensions.get('window')
const HEADER_HEIGHT = STATUS_BAR_HEIGHT + 128

const ContainerCarousel = styled(Container)`
  width: 100%;
  position: absolute;
  top: ${HEADER_HEIGHT}px;
  z-index: 999;
  align-items: center;
`

const SearchDumb = ({ navigation, ...props }) => {
  const token = useSelector(getToken)
  const myId = useSelector(getProfileId)
  const [featuredVisible, setFeaturedVisible] = useState([])
  const [featured, setFeatured] = useState([])

  useEffect(() => {
    getFeaturedUsers(token).then(({ result }) => setFeatured(result.users))
  }, [])

  const renderFeaturedUser = useCallback(({ item }) => (
    <FeaturedItem
      item={item}
      play={false}
      follow={item.user_stats.follow_state !== 'none'}
      onPress={() => {
        const isFollow = item.user_stats.follow_state === 'follow'
        if (isFollow) {
          unfollow(token, item.id).catch(handleErrors)
        } else {
          follow(token, item.id).catch(handleErrors)
        }
        setFeatured(
          featured.reduce((acc, user) => {
            if (user.id === item.id)
              user.user_stats.follow_state = isFollow ? 'none' : 'follow'
            return [...acc, user]
          }, []),
        )
      }}
    />
  ))
  return (
    <Container>
      <Header
        leftButton={{
          onPress: () => navigation.goBack(),
          icon: BackIcon,
        }}
        title={'search user'}
      />
      <UserSearch
        onPressUser={(user) => {
          if (myId && myId === user.id) navigation.push('Profile')
          else navigation.push('AlienProfile', { user })
        }}
        client={(q, page = 1, text) => {
          setFeaturedVisible(!text)
          if (!q) {
            return new Promise((resolve, reject) => {
              resolve({
                users: [],
                has_more: false,
                page: 1,
              })
            })
          }
          return searchUser(token, q, page)
        }}
        {...props}
      />
      {featuredVisible ? (
        <ContainerCarousel>
          <Carousel
            data={featured}
            renderItem={renderFeaturedUser}
            layout={'default'}
            loop={false}
            contentContainerCustomStyle={{
              alignItems: 'center',
              marginTop: -64,
            }}
            vertical={true}
            itemHeight={height / 2 + height / 8}
            sliderHeight={height - HEADER_HEIGHT}
          />
        </ContainerCarousel>
      ) : null}
    </Container>
  )
}

const Search = withAmplitude('Search screen shown')(SearchDumb)

export default Search
