// @flow
import React from 'react';
import ReactDom from 'react-dom';
import styled from 'styled-components';

import CustomComboboxDemo from './components/CustomComboboxDemo';

import './styles/reset.less';
import './styles/typography.less';

const Layout = styled.div`
    margin: 0 auto;
    max-width: 800px;

    h1 {
        margin: 40px 0 20px 0;
    }

    h4 {
        margin: 20px 0 10px 0;
    }
`;

ReactDom.render(
    <Layout>
        <CustomComboboxDemo />
    </Layout>,
    document.getElementById('content'));
