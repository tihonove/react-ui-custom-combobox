export function bindActionsToDispatch(actions, dispatch) {
    if (typeof actions === 'object') {
        const result = {};
        for (const key in actions) {
            if (Object.prototype.hasOwnProperty.call(actions, key)) {
                result[key] = bindActionsToDispatch(actions[key], dispatch);
            }
        }
        return result;
    }
    if (typeof actions === 'function') {
        return (...args) => dispatch(actions(...args));
    }
    throw new Error('Unexpected type of actions');
}

class CanceledError {}

function isCanceled(getState, actionId) {
    return !(getState().actionsInProcess || []).includes(actionId);
}

export function processCancelableActions(state, action) {
    if (action.type === 'SetCurrentAction') {
        return state.merge({
            actionId: action.actionId,
            actionsInProcess: [action.actionId],
        });
    }
    return state;
}

export function cancelAll(state) {
    return state.merge({ actionsInProcess: [] });
}

export function cancelable(asyncAction) {
    async function cancelPreviousAndStartAction(dispatch, getProps, getState) {
        const actionId = (getState().actionId || 0) + 1;
        await dispatch({ type: 'SetCurrentAction', actionId: actionId });
        return actionId;
    }

    return async (dispatch, getProps, getState) => {
        const actionId = await dispatch(cancelPreviousAndStartAction);
        try {
            const checkCanceled = () => {
                if (isCanceled(getState, actionId)) {
                    throw new CanceledError();
                }
            };
            await asyncAction(dispatch, getProps, getState, checkCanceled);
        }
        catch (e) {
            if (!e instanceof CanceledError) {
                throw e;
            }
        }
    };
}
