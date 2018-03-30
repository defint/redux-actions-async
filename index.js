import { createAction } from 'redux-actions';
import { denormalize } from 'normalizr';
import { createSelector } from 'reselect';

const toSuccess = asyncType => `${asyncType}_SUCCESS`;
const toFail = asyncType => `${asyncType}_FAIL`;
const toRequest = asyncType => `${asyncType}_REQUEST`;

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
  [toRequest(asyncType)]: state => ({ ...state, loading: true }),
  [toSuccess(asyncType)]: (state, { payload }) => ({
    ...state,
    loading: false,
    data: payload.result || payload,
  }),
  [toFail(asyncType)]: (state, { payload }) => ({
    ...state,
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

module.exports = {
  createAsyncAction,
  initialAsyncState,
  createAsyncReducer,
  createAsyncNormalizeSelector,
  toSuccess,
  toFail,
  toRequest,
};
