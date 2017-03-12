// @flow
import React from 'react';
import ReactDom from 'react-dom';
import styled from 'styled-components';
import { containsTargetOrRenderContainer } from 'retail-ui/lib/listenFocusOutside';

function nextTick(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 0));
}

const Root = styled.div`
    display: inline-block;
`;

const InputContainer = styled.div`
    display: inline-block;
    position: relative;
`;

const ButtomLine = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    height: 0px;
    z-index: 1;
`;

const TopAttchedContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
`;

export default class CustomComboboxContainer extends React.Component {
    state = {};

    componentWillMount() {
        this.manager = this.props.manager(this.props, this.dispatch);
        this.setState(this.manager(this.props, this.state, { type: 'Mount' }));
    }

    componentWillUnmount() {
        this.dispatch({ type: 'Unmount' });
    }

    componentDidMount() {
        document.addEventListener(
            'click', (event: MouseEvent) => {
                if (!containsTargetOrRenderContainer(event.target)(ReactDom.findDOMNode(this.refs.root))) {
                    this.dispatch({ type: 'FocusOutside' });
                }
            });
        document.addEventListener(
            'focusin', (event: MouseEvent) => {
                if (!containsTargetOrRenderContainer(event.target)(ReactDom.findDOMNode(this.refs.root))) {
                    this.dispatch({ type: 'FocusOutside' });
                }
            });
    }

    componentWillReceiveProps(nextProps) {
        this.dispatch({ type: 'ReceiveProps', nextProps: nextProps });
    }

    dispatch = action => {
        if (typeof action === 'function') {
            return this.dispatchAsyncAction(action);
        }
        return new Promise(resolve => {
            const newState = this.manager(this.props, this.state, action);
            this.setState(newState, () => {
                resolve(this.state);
            });
        });
    }

    getProps = () => this.props;
    getState = () => this.state;

    dispatchAsyncAction = async asyncAction => {
        await nextTick();
        return await asyncAction(this.dispatch, this.getProps, this.getState);
    }

    render(): React.Element<*> {
        const { editorContent, dropdownContent } = this.state;
        return (
            <Root ref='root'>
                <InputContainer>
                    {editorContent}
                    {dropdownContent && (
                        <ButtomLine>
                            <TopAttchedContainer>
                                {dropdownContent}
                            </TopAttchedContainer>
                        </ButtomLine>
                    )}
                </InputContainer>
            </Root>
        );
    }
}

