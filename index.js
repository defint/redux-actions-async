const createAction = require('redux-actions').createAction;
const handleActions = require('redux-actions').handleActions;
const denormalize = require('normalizr').denormalize;
const createSelector = require('reselect').createSelector;

const toSuccess = asyncType => asyncType + '_SUCCESS';
const toFail = asyncType => asyncType + '_FAIL';
const toRequest = asyncType => asyncType + '_REQUEST';

const globalErrorAction = createAction('ASYNC_ERROR_GLOBAL');

const identity = o => o;

const createAsyncAction = (asyncType, request, after = identity) => {
  const asyncAction = (...args) => {
    const pendingType = createAction(toRequest(asyncType));
    const completeType = createAction(toSuccess(asyncType));
    const errorType = createAction(toFail(asyncType));

    return async dispatch => {
      dispatch(pendingType());

      try {
        const response = await request(...args);
        const data = response.data || response;
        const payload = data ? await after(data, dispatch) : null;
        dispatch(completeType(payload));
        return payload;
      } catch (error) {
        dispatch(errorType(error));
        dispatch(globalErrorAction(error));
        return error;
      }
    };
  };

  asyncAction.__ACTION_TYPE = asyncType;

  return asyncAction;
};

const initialAsyncState = { loading: false, data: null, error: '' };

const createAsyncReducer = asyncType => ({
  [toRequest(asyncType)]: state => Object.assign({}, state, { loading: true }),
  [toSuccess(asyncType)]: (state, { payload }) =>
    Object.assign({}, state, {
      loading: false,
      data: payload.result || payload,
    }),
  [toFail(asyncType)]: (state, { payload }) =>
    Object.assign({}, state, {
      loading: false,
      error: payload,
    }),
});

const createAsyncSelector = (selector, schema) => {
  if (schema) {
    return createSelector(
      [selector, state => state.entities],
      (listOrId, allList) => {
        const { data } = listOrId;

        if (!data) {
          return Array.isArray(schema) ? [] : {};
        }

        return schema ? denormalize(data, schema, allList) : data;
      }
    );
  }

  return createSelector([selector], listOrId => {
    const { data } = listOrId;

    return data;
  });
};

const handleAsyncActions = asyncAction =>
  handleActions(
    createAsyncReducer(asyncAction.__ACTION_TYPE),
    initialAsyncState
  );

const createLoadingSelector = (...selectors) => state =>
  selectors.some(selector => {
    const { loading } = selector(state);
    return loading;
  });

exports.createAsyncAction = createAsyncAction;
exports.handleAsyncActions = handleAsyncActions;
exports.createAsyncSelector = createAsyncSelector;
exports.createLoadingSelector = createLoadingSelector;
exports.toSuccess = toSuccess;
exports.toFail = toFail;
exports.toRequest = toRequest;
exports.globalErrorAction = globalErrorAction;
