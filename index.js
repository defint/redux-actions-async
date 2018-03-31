const createAction = require('redux-actions').createAction;
const handleActions = require('redux-actions').handleActions;
const denormalize = require('normalizr').denormalize;
const createSelector = require('reselect').createSelector;

const toSuccess = asyncType => asyncType + '_SUCCESS';
const toFail = asyncType => asyncType + '_FAIL';
const toRequest = asyncType => asyncType + '_REQUEST';

const identity = o => o;

const createAsyncAction = (asyncType, request, after = identity) => (
  ...args
) => {
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
      return error;
    }
  };
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

const createAsyncNormalizeSelector = (schema, selector) =>
  createSelector([selector, state => state.entities], (listOrId, allList) => {
    const { data } = listOrId;

    if (!data) {
      return Array.isArray(schema) ? [] : {};
    }

    return schema ? denormalize(data, schema, allList) : data;
  });

const handleAsyncActions = asyncType => handleActions(
    createAsyncReducer(asyncType),
    initialAsyncState
);

exports.createAsyncAction = createAsyncAction;
exports.initialAsyncState = initialAsyncState;
exports.createAsyncReducer = createAsyncReducer;
exports.handleAsyncActions = handleAsyncActions;
exports.createAsyncNormalizeSelector = createAsyncNormalizeSelector;
exports.toSuccess = toSuccess;
exports.toFail = toFail;
exports.toRequest = toRequest;
