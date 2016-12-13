import React, {Component} from 'react';
import { storiesOf, action } from '@kadira/storybook';
import 'react-virtualized/styles.css';

import { FlexGrid } from './../Playground'



storiesOf('Flex grid', module)
    .add('with timeline', () => (
        <FlexGrid />
    ))