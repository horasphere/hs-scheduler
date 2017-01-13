import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import withScrolling, { createVerticalStrength } from 'react-dnd-scrollzone';
import { List } from 'react-virtualized';
import HTML5Backend from 'react-dnd-html5-backend';
import { DropTarget, DragDropContext } from 'react-dnd';

import DraggableItem from './DraggableItem'

// creates array with 1000 entries
const testArray = Array.from(Array(1000)).map((e,i)=>'Item '+i);

const ScrollZoneVirtualList = DragDropContext(HTML5Backend)(withScrolling(List));
const vStrength = createVerticalStrength(30);

window.document.body.addEventListener('dragend', function() { console.warn('dragend')});
window.document.body.addEventListener('drop', function() { console.warn('drop')});
window.document.body.addEventListener('mousewheel', function(event) {
  console.error(event.deltaY)
});


storiesOf('Virtual list DnD', module)
  .add('Item dnd scroll', () => (
    <ScrollZoneVirtualList
      verticalStrength={vStrength}
      horizontalStrength={ ()=>{} }
      speed={30}
      height={300}
      width={800}
      rowCount={testArray.length}
      rowHeight={34}
      onScroll={({ scrollTop }) => { console.log('on scroll: ' + scrollTop) }}
      rowRenderer={
        ({ key, index, style }) => {
          return <DraggableItem key={key} style={style} text={testArray[index]} />
        }
      }
    />
  ))