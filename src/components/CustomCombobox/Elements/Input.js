import React from 'react';
import ReactDom from 'react-dom';
import styled from 'styled-components';

const InputElement = styled.input`
    padding: 0 8px;
    line-height: 32px;
    border: 1px solid #ccc;
    border-radius: 2px;
    width: 250px;
    font-family: inherit;
    font-size: 14px;
    margin: 0;
`;

export default class Input extends React.Component {
    componentWillMount() {
    }

    componentDidMount() {
        if (this.props.focused) {
            const inputDomElement = ReactDom.findDOMNode(this.refs.input);
            inputDomElement.focus();
            inputDomElement.select();
        }
    }

    render() {
        return <InputElement ref='input' {...this.props} />;
    }
}

