import React, {Component} from 'react';
import { storiesOf, action } from '@kadira/storybook';
import 'react-virtualized/styles.css';

import {VirtualGridPoc} from './../Playground'

storiesOf('Virtual grid', module)
    .add('Week view', () => (
        <VirtualGridPoc />
    ))