import React from 'react'

export default function({resource, searchQuery, searchMatches}) {
  return <div style={{backgroundColor: searchMatches.indexOf(resource) > -1 ? 'yellow': 'transparent'}}>
    {resource.title}<br />{resource.id}
  </div>
}