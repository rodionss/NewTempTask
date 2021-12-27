import React from 'react'
import { Button, Indicator, Label, TabsContainer } from './atoms'

type TabType = {
  tabs: string[]
  value?: number
  onPressTab: (index: number) => void
  containerStyle?: object
  tabStyle?: object
  textStyle?: object
}

function Tabs({
  tabs = [],
  value,
  onPressTab,
  containerStyle = {},
  tabStyle = {},
  textStyle = {},
}: TabType) {
  return (
    <TabsContainer style={containerStyle}>
      {tabs.map((tab: string, index: number) => (
        <Button
          style={tabStyle}
          key={`${tab}${index}`}
          onPress={() => onPressTab(index)}
        >
          <Label style={textStyle} active={index === value}>
            {tab}
          </Label>
          {index === value ? <Indicator /> : null}
        </Button>
      ))}
    </TabsContainer>
  )
}

export default Tabs
