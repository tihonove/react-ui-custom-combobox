import React from 'react';
import ReactDom from 'react-dom';
import styled from 'styled-components';

const InputLikeElement = styled.span`
    padding: 0 8px;
    display: inline-block;
    line-height: 32px;
    border: 1px solid #ccc;
    border-radius: 2px;
    cursor: text;
    width: 250px;
`;

export default class InputLikeBlock extends React.Component {
    render() {
        const { children, ...props } = this.props;
        return <InputLikeElement tabIndex='0' {...props}>{children}</InputLikeElement>;
    }
}

