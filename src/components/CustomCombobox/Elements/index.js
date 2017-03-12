import React from 'react';
import Input from './Input';
import InputLikeBlock from './InputLikeBlock';
import { Menu, MenuItem } from './Menu';
import Spinner from 'retail-ui/components/Spinner';

export function renderItemsMenu(items, hightlightedItemIndex, renderItem, onChangeHighlightedItem, onSelectItem) {
    return (
        <Menu>
            {items.map((item, i) => (
                <MenuItem
                    key={i}
                    selected={i === hightlightedItemIndex}
                    onMouseEnter={() => onChangeHighlightedItem(item)}
                    onClick={() => onSelectItem(item)}>
                    {renderItem(item)}
                </MenuItem>
            ))}
        </Menu>
    );
}

export function inputLikeBlock(value, onReceiveFocus) {
    return (
        <InputLikeBlock
            onClick={onReceiveFocus}
            onFocus={onReceiveFocus}>
            {value || 'None'}
        </InputLikeBlock>
    );
}

export function inputLikeLoadingBlock(onReceiveFocus) {
    return (
        <InputLikeBlock
            onClick={onReceiveFocus}
            onFocus={onReceiveFocus}>
            <Spinner type='mini' caption='Загрузка' />
        </InputLikeBlock>
    );
}

export function input(value, onChange, onKeyPress) {
    return (
        <Input
            focused
            onKeyDown={e => {
                if (['Escape', 'ArrowUp', 'ArrowDown', 'Enter'].includes(e.key)) {
                    e.preventDefault();
                    onKeyPress(e.key);
                    return false;
                }
                return undefined;
            }}
            onChange={e => onChange(e.target.value)}
            value={value}
        />
    );
}
