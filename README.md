Redux async actions
=========

A small library that facilitates the development of asynchronous actions in the redux ecosystem. Without copy-paste code and without headache.


## Installation

* npm: 
  `npm install --save redux-actions-async`
  
* yarn:
   `yarn add redux-actions-async`

## Basic usage

2) Create your async function, for example to make request with axios:

    ```
    import axios from 'axios';

    export const fetchPlanet = () =>
      axios.request({
        url: 'https://api.nasa.gov/planetary/apod',
        method: 'get',
      });
    ``` 
    
3) Create the first async action creator:

    ```
    import { createAsyncAction } from 'redux-actions-async';
    
    export const NASA_DATA_FETCH = 'NASA_DATA_FETCH';
    
    export const nasaFetchPlanet = createAsyncAction(NASA_DATA_FETCH, fetchPlanet);
    ```
    
4) Create async reducer:

    ```
    import { handleAsyncActions } from 'redux-actions-async';
    
    export default handleAsyncActions(NASA_DATA_FETCH);
    ```
    
5) Create selectors:

    ```
    import { createAsyncSelector, createLoadingSelector } from 'redux-actions-async';
    
    const _selector = state => state.nasa;
    export const dataSelector = createAsyncSelector(_selector);
    export const loadingSelector = createLoadingSelector(_selector);
    ``` 

5) Using in container:

    ```
    import { connect } from 'react-redux';
    import * as actionCreators from '../actionCreators';
    import * as selectors from '../selectors';
    
    const mapStateToProps = state => ({
      loading: selectors.loadingSelector(state),
      planet: selectors.dataSelector(state),
    });
    
    const mapDispatchToProps = {
      nasaFetchPlanet: actionCreators.nasaFetchPlanet,
    };
    
    export default connect(mapStateToProps, mapDispatchToProps)(App);
    
    ```

## Basic usage with nested reducers

1) 

    ```
    import { handleAsyncActions } from 'redux-actions-async';
    import { combineReducers } from 'redux';
    
    export default combineReducers({
      main: handleAsyncActions(NASA_DATA_FETCH),
      another: handleAsyncActions(NASA_ANOTHER_DATA_FETCH),
    });
    
    ```

## Usage with normalizr


2) Create function to make request (same as basic usage):

    ```
    import axios from 'axios';

    export const fetchCuriosityPhotos = () =>
      axios.request({
        url: 'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/',
        method: 'get',
      });
    ``` 
    
3) Define schema:

    ```
    import { schema } from 'normalizr';
    
    const photo = new schema.Entity('photo');
    
    export default photo;
    
    ```
    
3) Create the first async action creator:

    ```
    import { createAsyncAction } from 'redux-actions-async';
    import photo from '../schemas/photo';
    
    export const NASA_CURIOSITY_FETCH = 'NASA_CURIOSITY_FETCH';
    
    export const nasaFetchCuriosity = createAsyncAction(
      NASA_CURIOSITY_FETCH,
      fetchCuriosityPhotos,
      data => normalize(data.photos, [photo])
    );    
    ```
    
4) Create async reducer (same as basic usage):

    ```
    import { handleAsyncActions } from 'redux-actions-async';
    
    export default handleAsyncActions(NASA_CURIOSITY_FETCH);
    ```
   
5)  Create selectors:
    
    ```
    import { createAsyncSelector, createLoadingSelector } from 'redux-actions-async';
    import photo from '../schemas/photo';
    
    const _selector = state => state.nasaCuriosity;
    export const dataSelector = createAsyncSelector(_selector, [photo]);
    export const loadingSelector = createLoadingSelector(_selector);
    ``` 
    
5) Using in container:

    ```
    import { connect } from 'react-redux';
    import * as actionCreators from '../actionCreators';
    import * as selectors from '../selectors';
    
    const mapStateToProps = state => ({
      loading: selectors.loadingSelector(state),
      curiosity: selectors.dataSelector(state),
    });
    
    const mapDispatchToProps = {
      nasaFetchCuriosity: actionCreators.nasaFetchCuriosity,
    };
    
    export default connect(mapStateToProps, mapDispatchToProps)(App);
    
    ```
