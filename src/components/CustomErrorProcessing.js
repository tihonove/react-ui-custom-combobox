import React from 'react';
import Immutable from 'seamless-immutable';
import Button from 'retail-ui/components/Button';
import styled from 'styled-components';

import { bindActionsToDispatch, cancelable } from './CustomCombobox/ActionUtils';
import createDefaultBehaviour, { ComboboxActions } from './CustomCombobox/DefaultBehaviour';
import { input } from './CustomCombobox/Elements';
import { Menu } from './CustomCombobox/Elements/Menu';

const ErrorContainer = styled.div`
    padding: 0 8px;
`;

const ErrorText = styled.div`
    padding-top: 4px;
    padding-bottom: 3px;
`;

const CustomActions = {
    ...ComboboxActions,
    updateItems: query => cancelable(async (dispatch, getProps, getState, checkCanceled) => {
        let items;
        await dispatch({ type: 'BeginReceiveItems' });
        try {
            items = await getProps().findItems(query);
        }
        catch (e) {
            checkCanceled();
            await dispatch({ type: 'ReceiveItemsFail' });
            return;
        }
        checkCanceled();
        await dispatch({ type: 'EndReceiveItems', items: items });
    }),
};

export default function createComboBoxManager(initialProps, dispatch) {
    const Actions = bindActionsToDispatch(CustomActions, dispatch);
    const defaultBehaviour = createDefaultBehaviour(initialProps, dispatch);

    return function comboBoxManager(props, prevState, action) {
        let state = Immutable(prevState);

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
        if (action.type === 'ReceiveItemsFail') {
            return state.merge({
                focused: true,
                dropdownContent: (
                    <Menu>
                        <ErrorContainer>
                            <ErrorText>
                                Произшла ошибка, <Button use='link' onClick={() => Actions.updateItems(state.inputValue)}>повторить запрос</Button>.
                            </ErrorText>
                        </ErrorContainer>
                    </Menu>
                ),
            });
        }
        return defaultBehaviour(props, prevState, action);
    };
}
