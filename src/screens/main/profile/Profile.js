import Clipboard from '@react-native-community/clipboard'
import * as R from 'ramda'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Dimensions, RefreshControl, View } from 'react-native'
import Lightbox from 'react-native-lightbox'
import {
  FlatList,
  SectionList as ProfileContainer,
  withNavigationFocus,
} from 'react-navigation'
import { connect } from 'react-redux'
import styled from 'styled-components/native'
import { handleErrors } from '../../../aspects'
import { ContextMenuModal, Header, Tabs } from '../../../components'
import { ComplexButton, SecondaryButton } from '../../../components/buttons'
import EmptyState from '../../../components/EmptyState'
import {
  BackIcon,
  BurgerIcon,
  InviteContactIcon,
  PointsIcon,
} from '../../../components/icons'
import { Container, Link, NavBarTitle, Text } from '../../../components/main'
import Player from '../../../components/Player'
import { TutorialTooltip } from '../../../components/TutorialTooltip'
import { THEME, TUTORIAL } from '../../../const'
import Avatar, { AvatarSize } from '../../../components/common/atoms/Avatar'
import {
  getProfile,
  getProfileFollowersCount,
  getProfileFollowingConut,
  getProfileId,
  getProfilePhoto,
  getToken,
  updateInteractions,
} from '../../../modules/auth'
import {
  manageFollowUser,
  refreshProfile,
  selectUser,
} from '../../../modules/main/duck'
import * as Manager from '../../../modules/main/managers'
import { getTutorial, saveTutorial } from '../../../modules/main/repository'
import { DropdownService } from '../../../services'
import CompleteProfile from '@screens/main/profile/components/CompleteProfile'
import { keyExtractor, STATUS_BAR_HEIGHT, useAnalytics } from '../../../utils'

const { width } = Dimensions.get('window')

const ProfileInfo = styled.View`
  width: 100%;
  padding: 0;
  padding-top: 10px;
  align-items: center;
  flex-direction: row;
  justify-content: space-around;
`

const ProfileInfoContainerWrapper = styled.View`
  background-color: ${THEME.secondaryBackgroundColor};
`

const ProfileInfoContainer = styled.View`
  border-bottom-left-radius: 35px;
  border-bottom-right-radius: 35px;
  background-color: ${THEME.primaryBackgroundColor};
  padding-bottom: 40px;
`

const ButtonContainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: center;
  padding: 0 20px 15px 20px;
  margin-top: -20px;
`

const ProfileButton = styled(SecondaryButton)`
  width: 90%;
`

const AdditionalButton = styled(Link)`
  height: 44px;
  justify-content: center;
  align-items: center;
`

const AdditionalText = styled(Text)`
  font-size: 14px;
  margin-top: 8px;
`

const AdditionalValue = styled(Text)`
  font-size: 24px;
  font-weight: 700;
  margin-top: 1px;
`

const ChallengeContainer = styled(Link)`
  padding: 0;
  margin-top: 6px;
  border-radius: 20px;
  overflow: hidden;
`

const InspirationsRow = styled.View`
  margin-top: 5px;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  padding: 0 15px 10px 15px;
`

const InspirationsTitle = styled(Text)`
  font-size: 16px;
  font-weight: 500;
  margin-top: 28px;
  margin-bottom: 10px;
  margin-left: 20px;
  margin-right: 20px;
`

const InspirationItem = styled.View`
  align-items: center;
  background-color: ${THEME.primaryBackgroundColor};
  border-radius: 20px;
  flex: 1;
  margin: 0 5px 0 5px;
`

const InspirationItemTitle = styled(Text)`
  font-size: 14px;
  margin-top: 15px;
`

const InspirationItemValue = styled(Text)`
  font-size: 24px;
  line-height: 36px;
  font-weight: 600;
  margin-top: 1px;
  margin-bottom: 10px;
`

const InfoContainer = styled.View`
  margin-top: 30px;
  margin-left: 20px;
  margin-right: 20px;
`

const InfoName = styled(Text)`
  font-size: 16px;
  font-weight: 600;
`

const InfoBio = styled(Text)`
  margin-top: 3px;
  font-size: 14px;
  font-weight: 400;
`

const ChallengeList = styled(FlatList).attrs({
  contentContainerStyle: { paddingBottom: 64 },
})`
  margin-top: 0;
  margin-bottom: 80px;
  background-color: ${THEME.secondaryBackgroundColor};
`

const Followers = styled(Text)`
  font-weight: 400;
  font-size: 14px;
`

const InviterContainer = styled.View`
  flex-direction: row;
  margin-top: 4px;
`
const InviterText = styled(Text)`
  font-size: 14px;
  color: ${({ color }) => color || THEME.textColor};
`
const InviterUsername = styled(Link)``

const ChallengeTitle = styled(Text)`
  font-weight: 800;
  font-size: 18px;
  text-align: center;
  margin-top: auto;
  margin-bottom: 30px;
  color: #fff;
  text-transform: uppercase;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
`

const CompletedCountCountainer = styled.View`
  position: absolute;
  right: 8px;
  bottom: 8px;
  height: 24px;
  width: 47px;
  align-items: center;
  justify-content: center;
  border: 1px solid #fff;
  background-color: #0000002a;
  border-radius: 16px;
`

const CompletionsCountText = styled(Text)`
  font-size: 14px;
  font-weight: bold;
  color: #fff;
`

const AvatarWrapper = styled.View`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const SHOW_COMPLETE_REMINDER_PROFILE_VISITS_COUNT = 21

const ProfileDumb = ({
  myId,
  token,
  isAlien,
  myProfile,
  photoUrl,
  navigation,
  followingCount,
  followersCount,
  isFocused,
  refreshProfile,
}) => {
  useAnalytics('Profile screen seen', {}, true)
  const scrollView = useRef(null)
  const tabsSection = useRef(null)

  const [myActiveChallenges, setMyActiveChallenges] = useState([])
  const [completedActiveChallenges, setCompletedActiveChallenges] = useState([])
  const [taggedChallenges, setTaggedChallenges] = useState([])

  const [challenges, setChallenges] = useState([])
  const [challengeHistory, setChallengeHistory] = useState([])
  const [taggedHistory, setTaggedHistory] = useState([])

  const [paginationCompleted, setPaginationCompleted] = useState({})
  const [paginationCreated, setPaginationCreated] = useState({})
  const [paginationTagged, setPaginationTagged] = useState({})

  const [tabIndex, setTabIndex] = useState(0)
  const [activeChallengesTab, setActiveChallengesTab] = useState(0)
  const [userLoading, setUserLoading] = useState(false)
  const [overlayState, setOverlayState] = useState(false)
  const [tabsSticked, setTabsSticked] = useState(false)
  const [contextMenu, setContextMenu] = useState(false)

  const [tutorial, setTutorial] = useState({})
  const [inviteModalVisible, setInviteModalVisible] = useState(false)

  const [personalProfileVisitedCount, setPersonalProfileVisitedCount] =
    useState(0)
  const [completeProfileReminderOpen, setCompleteProfileReminderOpen] =
    useState(true)
  const [avatarError, setAvatarError] = useState(false)

  const [profile, setProfile] = useState(
    isAlien ? navigation.state.params.user : myProfile,
  )

  const [showProfile, setShowProfile] = useState(
    !(
      isAlien &&
      profile.user_stats &&
      (profile.user_stats.is_blocking || profile.user_stats.is_blocked)
    ),
  )

  const isPrivate = useMemo(
    () =>
      isAlien &&
      profile.user_stats &&
      profile.user_stats.follow_state &&
      profile.user_stats.follow_state !== 'follow' &&
      !profile.public,
    [],
  )

  const onRefresh = useCallback(() => {
    refreshProfile()
    fetchActive()
    fetchCompleted()
    fetchCreated()
  })

  const fetchActive = useCallback(() => {
    Manager.getActiveChallenges(token, profile.id)
      .then(({ completions }) => {
        setMyActiveChallenges(
          completions.filter(
            ({ challenge }) => challenge.user.id === profile.id,
          ),
        )
        setCompletedActiveChallenges(
          completions.filter(
            ({ challenge }) => challenge.user.id !== profile.id,
          ),
        )
        setTaggedChallenges(
          completions.filter(({ challenge }) =>
            challenge.tagged_users.map((x) => x.user.id).includes(profile.id),
          ),
        )
      })
      .catch(handleErrors)
  })

  const fetchCreated = useCallback((page = 1) => {
    Manager.getUserChallenges(token, profile.id, page)
      .then((res) => {
        setPaginationCreated({ hasMore: res.has_more, page: res.page })

        if (page === 1) setChallenges(res.completions)
        else setChallenges([...challenges, ...res.completions])
      })
      .catch(handleErrors)
  })

  const fetchCompleted = useCallback((page = 1) => {
    Manager.getUserChallengeHistory(token, profile.id, page)
      .then((res) => {
        setPaginationCompleted({ hasMore: res.has_more, page: res.page })

        if (page === 1) setChallengeHistory(res.completions)
        else setChallengeHistory([...challengeHistory, ...res.completions])
      })
      .catch(handleErrors)
  })

  const fetchTagged = useCallback((page = 1) => {
    Manager.getTaggedChallengeHistory(token, profile.id, page)
      .then((res) => {
        setPaginationTagged({ hasMore: res.has_more, page: res.page })

        if (page === 1) setTaggedHistory(res.completions)
        else setTaggedHistory([...taggedHistory, ...res.completions])
      })
      .catch(handleErrors)
  })

  const onScrollToEnd = useCallback(({ distanceFromEnd }) => {
    if (distanceFromEnd < 0) return

    if (tabIndex === 0) {
      if (paginationCreated && paginationCreated.hasMore)
        fetchCreated(paginationCreated.page + 1)
    } else if (tabIndex === 1) {
      if (paginationCompleted && paginationCompleted.hasMore)
        fetchCompleted(paginationCompleted.page + 1)
    } else if (tabIndex === 2) {
      if (paginationTagged && paginationTagged.hasMore)
        fetchTagged(paginationTagged.page + 1)
    }
  })

  useEffect(() => {
    if (!isFocused) return
    !isAlien && refreshProfile()
    getTutorial().then((tutorial) => {
      setTutorial(tutorial)
      if (!tutorial[TUTORIAL.INVITE] && tutorial[TUTORIAL.PROFILE_VIEW]) {
        if (isAlien) return
        setInviteModalVisible(true)
      } else {
        saveTutorial({ ...tutorial, [TUTORIAL.PROFILE_VIEW]: true })
      }
    })
  }, [isFocused])

  useEffect(() => {
    if (isAlien) {
      updateInteractions(profile)
    }
  })

  useEffect(() => {
    if (isPrivate || !isFocused) return
    tabIndex === 0 && !paginationCreated.page
      ? fetchCreated()
      : tabIndex === 1 && !paginationCompleted.page
      ? fetchCompleted()
      : tabIndex === 2 && !paginationTagged.page
      ? fetchTagged()
      : null
  }, [tabIndex, isFocused])

  useEffect(() => {
    if (!isFocused) return

    if (myId === profile.id && personalProfileVisitedCount < 20) {
      setPersonalProfileVisitedCount((prevState) => prevState + 1)
    }

    setUserLoading(true)
    fetchActive()
    if (isAlien) {
      Manager.getUserById(token, profile.id)
        .then((user) => {
          setUserLoading(false)
          setProfile(user)
        })
        .catch(handleErrors)
    }
  }, [profile.id, isFocused, myId])

  useEffect(() => {
    if (isFocused && !completeProfileReminderOpen) {
      setCompleteProfileReminderOpen(true)
    }
  }, [isFocused])

  const showCompleteProfileReminder =
    profile.id === myId &&
    (personalProfileVisitedCount === 1 ||
      personalProfileVisitedCount ===
        SHOW_COMPLETE_REMINDER_PROFILE_VISITS_COUNT) &&
    (avatarError || !profile.photo_url || !profile.bio) &&
    completeProfileReminderOpen

  const toggleHeader = useCallback((e) => {
    const offset = e.nativeEvent.contentOffset.y
    setOverlayState(offset > 100)

    if (tabsSection.current) {
      tabsSection.current.measure((fx, fy, w, h, px, py) => {
        setTabsSticked(py < 110)
      })
    }
  })

  const manageUserBlock = useCallback(() => {
    if (profile.user_stats.is_blocking) {
      Manager.unblockUser(token, profile.id).then(() => {
        setProfile({
          ...profile,
          user_stats: { ...profile.user_stats, is_blocking: false },
        })
        DropdownService.alert(
          'success',
          'Done!',
          `You've unblocked ${profile.name}`,
        )
        setShowProfile(true)
      })
    } else {
      Manager.blockUser(token, profile.id).then(() => {
        setProfile({
          ...profile,
          user_stats: { ...profile.user_stats, is_blocking: true },
        })
        DropdownService.alert(
          'success',
          'Done!',
          `You've blocked ${profile.name}`,
        )
        setShowProfile(false)
      })
    }
  })

  const BLOCK_TYPE_BLOCKING = 'blocking'
  const BLOCK_TYPE_BLOCKED = 'blocked'

  const blockType =
    isAlien && profile.user_stats && profile.user_stats.is_blocking
      ? BLOCK_TYPE_BLOCKING
      : BLOCK_TYPE_BLOCKED

  const renderActiveChallenge = useCallback(({ item, index }) => (
    <ChallengeContainer
      key={'active-' + item.id.toString()}
      style={{
        width: width / 3.2 - 3,
        height: ((width / 3.2 - 3) * 5) / 3,
        marginLeft: index == 0 ? 20 : 5,
        marginRight: 5,
      }}
      onPress={() => {
        navigation.push('CompletionsTile', { challenge: item.challenge })
      }}
    >
      <Player media={item.media} play={false} />
    </ChallengeContainer>
  ))

  const renderChallenge = useCallback(({ item }) => (
    <ChallengeContainer
      key={item.id.toString()}
      style={{ width: width / 2 - 3, height: ((width / 2 - 3) * 5) / 3 }}
      onPress={() => {
        navigation.push('CompletionsTile', { challenge: item.challenge })
      }}
    >
      <Player media={item.media} play={false} />
      <CompletedCountCountainer>
        <CompletionsCountText>
          {item.challenge.completed_count}
        </CompletionsCountText>
      </CompletedCountCountainer>
      <ChallengeTitle>{item.challenge.title}</ChallengeTitle>
    </ChallengeContainer>
  ))

  const renderChallenges = useCallback(({ item }) => (
    <ChallengeList
      data={item.list}
      numColumns={2}
      renderItem={renderChallenge}
      columnWrapperStyle={{ justifyContent: 'space-between' }}
      onEndReached={onScrollToEnd}
      ListEmptyComponent={() => (
        <EmptyState text='Games will be displayed here' />
      )}
    />
  ))

  const renderHeader = useCallback(() => (
    <ProfileInfoContainerWrapper>
      <ProfileInfoContainer>
        <ProfileInfo>
          <Lightbox
            renderContent={() => (
              <AvatarWrapper>
                <Avatar
                  uri={isAlien ? profile.photo_url : photoUrl}
                  size={AvatarSize.XL}
                />
              </AvatarWrapper>
            )}
          >
            <Avatar
              onError={() => setAvatarError(true)}
              uri={isAlien ? profile.photo_url : photoUrl}
              size={AvatarSize.L}
            />
          </Lightbox>
          <AdditionalButton
            onPress={() => {
              scrollView.current.scrollToLocation({
                sectionIndex: 0,
                itemIndex: 0,
              })
            }}
          >
            <AdditionalText>Games</AdditionalText>
            <AdditionalValue>{profile.challenges_count || 0}</AdditionalValue>
          </AdditionalButton>

          <AdditionalButton
            onPress={() =>
              navigation.push(
                isAlien ? 'AlienFollowingUsers' : 'FollowingUsers',
                { id: profile.id },
              )
            }
          >
            <AdditionalText>Following</AdditionalText>
            <AdditionalValue>
              {(isAlien ? profile.following_count : followingCount) || 0}
            </AdditionalValue>
          </AdditionalButton>
          <AdditionalButton
            onPress={() =>
              navigation.push(
                isAlien ? 'AlienFollowersUsers' : 'FollowersUsers',
                { id: profile.id },
              )
            }
          >
            <AdditionalText>Followers</AdditionalText>
            <AdditionalValue>
              {(isAlien ? profile.followers_count : followersCount) || 0}
            </AdditionalValue>
          </AdditionalButton>
        </ProfileInfo>

        <InfoContainer>
          <InfoName>{profile.name}</InfoName>
          <InfoBio>{profile.bio}</InfoBio>
          {profile.invited_by ? (
            <InviterContainer>
              <InviterText>{`I'm from `}</InviterText>
              <InviterUsername
                onPress={() => {
                  if (myId && myId === profile.invited_by.id) {
                    navigation.push('Profile')
                    return
                  }
                  navigation.push('AlienProfile', { user: profile.invited_by })
                }}
              >
                <InviterText color={'#fff'}>
                  {profile.invited_by.username || profile.invited_by.name || ''}
                </InviterText>
              </InviterUsername>
            </InviterContainer>
          ) : null}
        </InfoContainer>
      </ProfileInfoContainer>
      {profile ? (
        <ButtonContainer>
          {isAlien && profile.user_stats ? (
            <ComplexButton
              onPress={() => {
                const follow = profile.user_stats.follow_state === 'follow'
                if (follow)
                  Manager.unfollow(token, profile.id).catch(handleErrors)
                else Manager.follow(token, profile.id).catch(handleErrors)
                setProfile({
                  ...profile,
                  user_stats: {
                    ...profile.user_stats,
                    follow_state: follow ? 'none' : 'follow',
                  },
                })
              }}
              text={
                profile.user_stats.follow_state == 'follow'
                  ? 'Unfollow'
                  : profile.user_stats.follow_state == 'pending'
                  ? 'Cancel follow request'
                  : 'Follow'
              }
              loading={userLoading}
              size={'small'}
              primary={profile.user_stats.follow_state == 'none'}
            />
          ) : (
            <ProfileButton
              text={'Edit Profile'}
              onPress={() => {
                navigation.navigate('EditProfile')
              }}
              size={'small'}
            />
          )}
        </ButtonContainer>
      ) : null}

      <View>
        <InspirationsTitle>Influenced on</InspirationsTitle>
        <InspirationsRow>
          <InspirationItem>
            <InspirationItemTitle>Today</InspirationItemTitle>
            <InspirationItemValue>
              {profile.today_inspirations_count}
            </InspirationItemValue>
          </InspirationItem>

          <InspirationItem>
            <InspirationItemTitle>All time</InspirationItemTitle>
            <InspirationItemValue>
              {profile.inspirations_count}
            </InspirationItemValue>
          </InspirationItem>
        </InspirationsRow>
      </View>

      <View>
        <InspirationsTitle>Active games</InspirationsTitle>
        <View>
          <Tabs
            value={activeChallengesTab}
            tabs={['Created', 'Completed', 'Tagged']}
            containerStyle={{
              paddingHorizontal: 20,
              justifyContent: 'space-between',
            }}
            onPressTab={setActiveChallengesTab}
          />
        </View>

        <FlatList
          horizontal={true}
          data={
            activeChallengesTab === 0
              ? myActiveChallenges
              : activeChallengesTab === 1
              ? completedActiveChallenges
              : taggedChallenges
          }
          keyExtractor={keyExtractor}
          renderItem={renderActiveChallenge}
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={() => (
            <EmptyState text='Games will be displayed here' />
          )}
          contentContainerStyle={{ flexGrow: 1 }}
        />
      </View>
      <View>
        <InspirationsTitle>Archive</InspirationsTitle>
      </View>
    </ProfileInfoContainerWrapper>
  ))

  const renderTabs = useCallback(({ section: { title } }) => (
    <View
      ref={tabsSection}
      style={{
        backgroundColor: tabsSticked
          ? THEME.primaryBackgroundColor
          : THEME.secondaryBackgroundColor,
        borderBottomLeftRadius: tabsSticked ? 35 : 0,
        borderBottomRightRadius: tabsSticked ? 35 : 0,
        // borderBottomWidth: tabsSticked ? 0 : 1
      }}
    >
      <Tabs
        value={tabIndex}
        tabs={['Created', 'Completed', 'Tagged']}
        onPressTab={setTabIndex}
        containerStyle={{
          paddingHorizontal: 20,
          justifyContent: 'space-between',
          borderBottomWidth: tabsSticked ? 0 : 1,
          marginTop: 0,
        }}
      />
    </View>
  ))

  const onClosePress = () => setCompleteProfileReminderOpen(false)

  return showCompleteProfileReminder ? (
    <CompleteProfile
      avatarError={avatarError}
      onClosePress={onClosePress}
      onEditPress={() => {
        onClosePress()
        navigation.navigate('EditProfile')
      }}
    />
  ) : (
    <>
      <Container>
        <Header
          leftButton={
            isAlien || navigation.dangerouslyGetParent().state.index > 0
              ? {
                  onPress: () => navigation.goBack(),
                  icon: BackIcon,
                }
              : {
                  onPress: () => navigation.navigate('Invite'),
                  icon: InviteContactIcon,
                }
          }
          title={profile.username}
          caps={false}
          rightButton={{
            onPress: isAlien
              ? () => setContextMenu(true)
              : () => navigation.navigate('ProfileSetting'),
            icon: isAlien ? PointsIcon : BurgerIcon,
          }}
          summary={
            overlayState ? (
              <>
                <Avatar uri={profile.photo_url} size={AvatarSize.M} />
                <View>
                  <NavBarTitle>{profile.username}</NavBarTitle>
                  <Followers>
                    {profile.followers_count || 0} followers
                  </Followers>
                </View>
              </>
            ) : null
          }
        />

        {showProfile ? (
          <ProfileContainer
            ref={scrollView}
            ListHeaderComponent={renderHeader}
            sections={
              isPrivate
                ? []
                : [
                    {
                      title: '',
                      data: [
                        {
                          list:
                            tabIndex === 0
                              ? challenges
                              : tabIndex === 1
                              ? challengeHistory
                              : taggedHistory,
                        },
                      ],
                    },
                  ]
            }
            renderItem={renderChallenges}
            renderSectionHeader={renderTabs}
            keyExtractor={(item, index) => item + index}
            onScroll={toggleHeader}
            scrollEventThrottle={200}
            refreshControl={
              !isAlien ? (
                <RefreshControl
                  tintColor={THEME.textColor}
                  refreshing={false}
                  onRefresh={onRefresh}
                />
              ) : null
            }
          />
        ) : (
          <>
            {blockType == BLOCK_TYPE_BLOCKED ? (
              <EmptyState text="You're blocked by this user" />
            ) : (
              <EmptyState text="You're blocking this user" />
            )}
          </>
        )}
      </Container>

      {isAlien ? (
        <ContextMenuModal
          isVisible={contextMenu}
          buttons={[
            {
              title:
                profile && profile.user_stats && profile.user_stats.is_blocking
                  ? 'Unblock'
                  : 'Block',
              onPress: () => {
                manageUserBlock()
                setContextMenu(false)
              },
            },
            {
              title: 'Profile Link',
              onPress: () => {
                setContextMenu(false)
                Clipboard.setString(profile.profile_url)
                DropdownService.alert(
                  'success',
                  'Profile link copied in clipboard',
                )
              },
            },
          ]}
          onPressClose={() => setContextMenu(false)}
        />
      ) : null}
      {inviteModalVisible ? (
        <TutorialTooltip
          position={{ left: 0, top: STATUS_BAR_HEIGHT + 62 }}
          text={
            'Press here to invite friends,\nit’s much more fun to play together!'
          }
          positionArrow={{ left: 30, top: -5 }}
          onPressOk={() => {
            saveTutorial({ ...tutorial, [TUTORIAL.INVITE]: true })
            setInviteModalVisible(false)
          }}
        />
      ) : null}
    </>
  )
}

const Profile = R.compose(
  withNavigationFocus,
  connect(
    R.applySpec({
      token: getToken,
      myProfile: getProfile,
      photoUrl: getProfilePhoto,
      followersCount: getProfileFollowersCount,
      followingCount: getProfileFollowingConut,
      myId: getProfileId,
    }),
    { refreshProfile },
  ),
)(ProfileDumb)

export const AlienProfile = R.compose(
  withNavigationFocus,
  connect(
    R.applySpec({
      isAlien: R.T,
      token: getToken,
      myId: getProfileId,
    }),
    { manageFollowUser, selectUser },
  ),
)(ProfileDumb)

export default Profile
