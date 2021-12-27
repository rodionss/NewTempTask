import { BackIcon } from '@components/icons'
import { Header } from '@components/index'
import React from 'react'
import { withNavigationFocus } from 'react-navigation'
import { Container } from './atoms'
import CompletionsList from './CompletionsList'

type Props = {
  navigation: any
}

function CompletionsTileDumb({ navigation }: Props) {
  const challenge = navigation.state.params.challenge || {}
  const fromCompletion = navigation.state.params.fromCompletion || {}

  return (
    <Container>
      <Header
        title='PEOPLE'
        leftButton={{
          onPress: () => navigation.goBack(),
          icon: BackIcon,
        }}
      />
      <CompletionsList
        initialChallenge={challenge}
        fromCompletion={fromCompletion}
      />
    </Container>
  )
}

const CompletionsTile = withNavigationFocus(CompletionsTileDumb)

export default CompletionsTile
