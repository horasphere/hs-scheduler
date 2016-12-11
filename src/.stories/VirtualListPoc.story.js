import React, {Component} from 'react';
import { storiesOf, action } from '@kadira/storybook';
import 'react-virtualized/styles.css';

import {VirtualListPoc} from './../Playground'

storiesOf('Virtual list', module)
    .add('Week view', () => (
        <VirtualListPoc />
    ))