
import React, { Component } from 'react'

import { FlexRow, FlexCell } from './../Flex'

class Block extends Component {
  render () {
    const { height, bgColor, width } = this.props

    const style = {
      height,
      backgroundColor: bgColor,
      margin: 5,
      width: width || 'auto'
    }

    return (
      <div style={style}>
        {this.props.children}
      </div>
    )
  }
}

class FlexGrid extends Component {
  render () {
    return (
      <div style={{width: 500}}>
        <FlexRow>
          <FlexCell width={20} style={{backgroundColor: 'grey'}} />
          <FlexCell width={80} style={{backgroundColor: 'pink'}}>
            <FlexRow style={{position: 'relative'}}>
              <FlexCell width={50} style={{backgroundColor: 'pink'}}>
                <Block height={20} bgColor='red'>B1</Block>
                <Block height={60} bgColor='red'>B2</Block>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 4,
                  width: 5,
                  height: 5,
                  backgroundColor: 'black'
                }} />
              </FlexCell>
              <FlexCell width={50} style={{backgroundColor: 'orange'}}>
                <Block height={30} bgColor='blue'>B3</Block>
              </FlexCell>
            </FlexRow>
            <FlexRow>
              <FlexCell width={100} style={{backgroundColor: 'green'}}>
                <Block height={3} bgColor='red' width={50}>B4</Block>
              </FlexCell>
            </FlexRow>
          </FlexCell>
        </FlexRow>
      </div>
    )
  }
}

export default FlexGrid

