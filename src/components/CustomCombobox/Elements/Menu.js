import React from 'react';
import ReactDom from 'react-dom';
import styled from 'styled-components';
import Spinner from 'retail-ui/components/Spinner';

const MenuContainer = styled.div`
    min-width: 266px;
    border: 1px solid #d5d5d5;
    box-shadow: 0 2px 6px rgba(0,0,0,.2);
    background-color: #ffffff;
    max-height: 300px;
    overflow-y: auto;
`;

const MenuItemContainer = styled.div`
    padding: 4px 8px;
    cursor: default;
    color: ${props => props.selected ? '#fff' : '#333'};
    background-color: ${props => props.selected ? '#5199db' : '#ffffff'};
`;

const LoaderContainer = styled.div`
    padding: 4px 8px;
    cursor: default;
`;

export class Menu extends React.Component {
    static childContextTypes = {
        menu: React.PropTypes.any,
    };

    getChildContext() {
        return {
            menu: this,
        };
    }

    scrollTo(el) {
        if (!el) {
            return;
        }
        const maxScroll = el.offsetTop;
        const scrollContainer = ReactDom.findDOMNode(this.refs.root);
        if (scrollContainer.scrollTop > maxScroll) {
            scrollContainer.scrollTop = maxScroll;
            return;
        }

        const minScroll = el.offsetTop + el.scrollHeight - scrollContainer.offsetHeight;
        if (scrollContainer.scrollTop < minScroll) {
            scrollContainer.scrollTop = minScroll;
        }
    }

    scrollToMenuItem(menuItem) {
        this.scrollTo(ReactDom.findDOMNode(menuItem));
    }

    render() {
        const { children } = this.props;

        return (
            <MenuContainer ref='root'>
                {children}
            </MenuContainer>
        );
    }
}

export class Loader extends React.Component {
    render() {
        return (
            <LoaderContainer>
                <Spinner type="mini" caption="Загрузка" />
            </LoaderContainer>
        )
    }
}

export class MenuItem extends React.Component {
    static contextTypes = {
        menu: React.PropTypes.any,
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.selected !== nextProps.selected) {
            const { menu } = this.context;
            if (menu) {
                menu.scrollToMenuItem(this);
            }
        }
    }

    render() {
        const { onClick, onMouseEnter, selected, children } = this.props;

        return (
            <MenuItemContainer
                onClick={onClick}
                onMouseEnter={onMouseEnter}
                selected={selected}>
                {children}
            </MenuItemContainer>
        );
    }
}
