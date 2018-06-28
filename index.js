'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var createAction = require('redux-actions').createAction;
var handleActions = require('redux-actions').handleActions;
var denormalize = require('normalizr').denormalize;
var createSelector = require('reselect').createSelector;

var toSuccess = function toSuccess(asyncType) {
    return asyncType + '_SUCCESS';
};
var toFail = function toFail(asyncType) {
    return asyncType + '_FAIL';
};
var toRequest = function toRequest(asyncType) {
    return asyncType + '_REQUEST';
};

var globalErrorAction = createAction('ASYNC_ERROR_GLOBAL');

var identity = function identity(o) {
    return o;
};

var createAsyncAction = function createAsyncAction(asyncType, request) {
    var after = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : identity;

    var asyncAction = function asyncAction() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var pendingType = createAction(toRequest(asyncType));
        var completeType = createAction(toSuccess(asyncType));
        var errorType = createAction(toFail(asyncType));

        return function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(dispatch) {
                var response, data, payload;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                dispatch(pendingType());

                                _context.prev = 1;
                                _context.next = 4;
                                return request.apply(undefined, args);

                            case 4:
                                response = _context.sent;
                                data = response.data || response;

                                if (!data) {
                                    _context.next = 12;
                                    break;
                                }

                                _context.next = 9;
                                return after(data, dispatch);

                            case 9:
                                _context.t0 = _context.sent;
                                _context.next = 13;
                                break;

                            case 12:
                                _context.t0 = null;

                            case 13:
                                payload = _context.t0;

                                dispatch(completeType(payload));
                                return _context.abrupt('return', payload);

                            case 18:
                                _context.prev = 18;
                                _context.t1 = _context['catch'](1);

                                dispatch(errorType(_context.t1));
                                dispatch(globalErrorAction(_context.t1));
                                return _context.abrupt('return', _context.t1);

                            case 23:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, undefined, [[1, 18]]);
            }));

            return function (_x2) {
                return _ref.apply(this, arguments);
            };
        }();
    };

    asyncAction.__ACTION_TYPE = asyncType;

    return asyncAction;
};

var initialAsyncState = { loading: false, data: null, error: '' };

var createAsyncReducer = function createAsyncReducer(asyncType) {
    var _ref4;

    return _ref4 = {}, _defineProperty(_ref4, toRequest(asyncType), function (state) {
        return Object.assign({}, state, { loading: true });
    }), _defineProperty(_ref4, toSuccess(asyncType), function (state, _ref2) {
        var payload = _ref2.payload;
        return Object.assign({}, state, {
            loading: false,
            data: payload.result || payload
        });
    }), _defineProperty(_ref4, toFail(asyncType), function (state, _ref3) {
        var payload = _ref3.payload;
        return Object.assign({}, state, {
            loading: false,
            error: payload
        });
    }), _ref4;
};

var createAsyncSelector = function createAsyncSelector(selector, schema) {
    if (schema) {
        return createSelector([selector, function (state) {
            return state.entities;
        }], function (listOrId, allList) {
            var data = listOrId.data;


            if (!data) {
                return Array.isArray(schema) ? [] : {};
            }

            return schema ? denormalize(data, schema, allList) : data;
        });
    }

    return createSelector([selector], function (listOrId) {
        var data = listOrId.data;


        return data;
    });
};

var handleAsyncActions = function handleAsyncActions(asyncAction) {
    return handleActions(createAsyncReducer(asyncAction.__ACTION_TYPE), initialAsyncState);
};

var createLoadingSelector = function createLoadingSelector() {
    for (var _len2 = arguments.length, selectors = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        selectors[_key2] = arguments[_key2];
    }

    return function (state) {
        return selectors.some(function (selector) {
            var _selector = selector(state),
                loading = _selector.loading;

            return loading;
        });
    };
};

exports.createAsyncAction = createAsyncAction;
exports.handleAsyncActions = handleAsyncActions;
exports.createAsyncSelector = createAsyncSelector;
exports.createLoadingSelector = createLoadingSelector;
exports.toSuccess = toSuccess;
exports.toFail = toFail;
exports.toRequest = toRequest;
exports.globalErrorAction = globalErrorAction;

