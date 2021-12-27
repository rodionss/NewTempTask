import React, { useEffect, useState } from 'react'
import { getParamFromUrl } from '@utils/functions'
import * as Manager from '@modules/main/managers'
import * as R from 'ramda'
import { withNavigationFocus } from 'react-navigation'
import { connect } from 'react-redux'
import { getToken } from '@modules/auth'
import Header from '@components/common/Header'
import { BackIcon } from '@components/icons'
import { Container } from '@screens/main/challenge/CompletionsTile/atoms'
import ReactionList from './ReactionList'

type Props = {
  token: string
  navigation: any
}

function ReactionsTileDumb({ token, navigation }: Props) {
  const [challenge, setChallenge] = useState(
    navigation.state.params.challenge || {},
  )

  useEffect(() => {
    const accessToken = !challenge.public
      ? getParamFromUrl('token', challenge.access_url)
      : null
    Manager.getChallengeById(token, challenge.id, accessToken).then(
      setChallenge,
    )
  }, [])

  return (
    <Container>
      <Header
        title='REACTED'
        leftButton={{
          onPress: () => navigation.goBack(),
          icon: BackIcon,
        }}
      />
      <ReactionList
        initialCompletion={navigation.state.params.completion}
        initialChallenge={challenge}
      />
    </Container>
  )
}

const ReactionsTile = R.compose(
  withNavigationFocus,
  connect(R.applySpec({ token: getToken })),
)(ReactionsTileDumb)

export default ReactionsTile
