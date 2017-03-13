import React from 'react';
import Immutable from 'seamless-immutable';

import { Menu, Loader } from './Elements/Menu';
import { renderItemsMenu, inputLikeBlock, inputLikeLoadingBlock, input } from './Elements';
import { bindActionsToDispatch, processCancelableActions, cancelable, cancelAll } from './ActionUtils';

export const ComboboxActions = {
    focus: () => ({ type: 'Focus' }),
    changeSelectedItem: item => ({ type: 'SelectItem', item: item }),
    selectItemFromMenu: item => ({ type: 'ChangeValue', item: item }),
    keyPress: key => ({ type: 'KeyPress', key: key }),
    inputChange: value => ({ type: 'InputChange', value: value }),

    updateCurrentItemByValue: value => cancelable(async (dispatch, getProps, getState, checkCanceled) => {
        await dispatch({ type: 'BeginUpdateItem' });
        const item = await getProps().valueToItem(value);
        checkCanceled();
        await dispatch({ type: 'EndUpdateItem', item: item });
    }),
    updateItems: query => cancelable(async (dispatch, getProps, getState, checkCanceled) => {
        await dispatch({ type: 'BeginReceiveItems' });
        const items = await getProps().findItems(query);
        checkCanceled();
        await dispatch({ type: 'EndReceiveItems', items: items });
    }),
};

export default function createComboBoxManager(initialProps, dispatch) {
    const Actions = bindActionsToDispatch(ComboboxActions, dispatch);

    return function comboBoxManager(props, prevState, action) {
        let state = Immutable(prevState);
        state = processCancelableActions(state, action);

        if (action.type === 'Mount') {
            if (props.value !== null) {
                Actions.updateCurrentItemByValue(props.value);
                return state.merge({ editorContent: inputLikeLoadingBlock(Actions.focus) });
            }
            return state.merge({ editorContent: inputLikeBlock(null, Actions.focus) });
        }
        if (action.type === 'ReceiveProps') {
            if (action.nextProps.value !== props.value) {
                let currentItem;
                if (action.nextProps.value !== null) {
                    if (state.items) {
                        currentItem = state.items.find(x => props.itemToValue(x) === action.nextProps.value);
                    }
                    if (!currentItem) {
                        Actions.updateCurrentItemByValue(action.nextProps.value);
                        return state.merge({ editorContent: inputLikeLoadingBlock(Actions.focus) });
                    }
                }
                return state.merge({
                    currentItem: currentItem,
                    editorContent: inputLikeBlock(props.itemToString(currentItem), Actions.focus),
                });
            }
        }
        if (action.type === 'EndUpdateItem') {
            return state.merge({
                currentItem: action.item,
                editorContent: inputLikeBlock(props.itemToString(action.item), Actions.focus),
                dropdownContent: null,
            });
        }
        if (action.type === 'FocusOutside') {
            if (state.focused) {
                if (state.initialInputValue !== state.inputValue) {
                    if (state.items && state.items.length === 1) {
                        dispatch(() => props.onChange(props.itemToValue(state.items[0])));
                    }
                    else {
                        dispatch(() => props.onChange(null));
                    }
                }
                return cancelAll(state).merge({
                    focused: false,
                    editorContent: inputLikeBlock(state.currentItem ? props.itemToString(state.currentItem) : '', Actions.focus),
                    dropdownContent: null,
                });
            }
        }
        if (action.type === 'InputChange') {
            Actions.updateItems(action.value);
            return state.merge({
                inputValue: action.value,
                editorContent: input(action.value, Actions.inputChange, Actions.keyPress),
            });
        }
        if (action.type === 'Focus') {
            Actions.updateItems('');
            const intpuValue = state.currentItem ? props.itemToString(state.currentItem) : '';
            return state.merge({
                focused: true,
                inputValue: intpuValue,
                initialInputValue: intpuValue,
                editorContent: input(intpuValue, Actions.inputChange, Actions.keyPress),
            });
        }
        if (action.type === 'EndReceiveItems') {
            return state.merge({
                items: action.items,
                selectedIndex: 0,
                dropdownContent: renderItemsMenu(action.items, 0, x => x.name, Actions.changeSelectedItem, Actions.selectItemFromMenu),
            });
        }
        if (action.type === 'KeyPress' && state.items && action.key === 'Enter') {
            dispatch(() => props.onChange(props.itemToValue(state.items[state.selectedIndex])));
            return state.merge({
                focused: false,
                dropdownContent: null,
            });
        }
        if (action.type === 'KeyPress' && state.items && ['ArrowDown', 'ArrowUp'].includes(action.key)) {
            const nextSelectedIndex = state.selectedIndex + (action.key === 'ArrowDown' ? 1 : -1);
            state = state.merge({
                selectedIndex: Math.max(0, Math.min(state.items.length - 1, nextSelectedIndex)),
            });
            return state.merge({
                dropdownContent: renderItemsMenu(state.items, state.selectedIndex, x => x.name, Actions.changeSelectedItem, Actions.selectItemFromMenu),
            });
        }
        if (action.type === 'KeyPress' && action.key === 'Escape') {
            state = cancelAll(state);
            return state.merge({ dropdownContent: null });
        }
        if (action.type === 'ChangeValue') {
            dispatch(() => props.onChange(props.itemToValue(action.item)));
            return state.merge({
                focused: false,
                dropdownContent: null,
            });
        }
        if (action.type === 'SelectItem') {
            return state.merge({
                selectedIndex: state.items.indexOf(action.item),
                dropdownContent: renderItemsMenu(state.items, state.items.indexOf(action.item), x => x.name, Actions.changeSelectedItem, Actions.selectItemFromMenu),
            });
        }
        if (action.type === 'BeginReceiveItems') {
            return state.merge({
                selectedIndex: null,
                items: null,
                dropdownContent: <Menu><Loader /></Menu>,
            });
        }
        return state;
    };
}
