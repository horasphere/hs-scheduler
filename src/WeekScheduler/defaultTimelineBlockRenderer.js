import React from 'react'

export default function({ resource, event, isScrolling, isVisible, style }) {
  return <div style={{
    ...style,
    opacity: 0.7,
    backgroundColor: '#777',
    top: 2,
    height: 4
  }} />
}