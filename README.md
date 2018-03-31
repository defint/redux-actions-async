Redux async actions
=========

A small library that facilitates the development of asynchronous actions in the redux ecosystem. Without copy-paste code and without headache.


## Installation

* npm: 
  `npm install --save redux-actions-async`
  
* yarn:
   `yarn add redux-actions-async`

## Basic usage

1) Define action type:

    ```
    export const NASA_DATA_FETCH = 'NASA_DATA_FETCH';
    ```

2) Create function to make request:

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
    
    export const nasaFetchPlanet = createAsyncAction(NASA_DATA_FETCH, fetchPlanet);
    
    ```
    
4) Create async reducer:

    ```
    import { handleAsyncActions } from 'redux-actions-async';
    
    export default handleAsyncActions(NASA_DATA_FETCH);
    ```
    
5) Using in container:

    ```
    import { connect } from 'react-redux';
    import * as actionCreators from '../actionCreators';
    
    const mapStateToProps = state => ({
      loading: state.nasa.loading,
      planet: state.nasa.data,
    });
    
    const mapDispatchToProps = {
      nasaFetchPlanet: actionCreators.nasaFetchPlanet,
    };
    
    export default connect(mapStateToProps, mapDispatchToProps)(App);
    
    ```

## Basic usage with nested reducers

```
import { handleAsyncActions } from 'redux-actions-async';
import { combineReducers } from 'redux';

export default combineReducers({
  main: handleAsyncActions(NASA_DATA_FETCH),
  another: handleAsyncActions(NASA_ANOTHER_DATA_FETCH),
});

```

## Basic usage with normalizr


1) Define action type:

    ```
    export const NASA_CURIOSITY_FETCH = 'NASA_CURIOSITY_FETCH';
    ```

2) Create function to make request:

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
    
    export const nasaFetchCuriosity = createAsyncAction(
      NASA_CURIOSITY_FETCH,
      fetchCuriosityPhotos,
      data => normalize(data.photos, [photo])
    );    
    ```
    
4) Create async reducer:

    ```
    import { handleAsyncActions } from 'redux-actions-async';
    
    export default handleAsyncActions(NASA_CURIOSITY_FETCH);
    ```
    
5) Using in container:

    ```
    import { connect } from 'react-redux';
    import * as actionCreators from '../actionCreators';
    import photo from '../schemas/photo';
    
    const getCuriosityPhotos = createAsyncNormalizeSelector(
      [photo],
      state => state.curiosity
    );
    
    const mapStateToProps = state => ({
      loading: state.curiosity.loading,
      curiosity: getCuriosityPhotos(state),
    });
    
    const mapDispatchToProps = {
      nasaFetchCuriosity: actionCreators.nasaFetchCuriosity,
      changeStore: actionCreators.changeStore,
    };
    
    export default connect(mapStateToProps, mapDispatchToProps)(App);
    
    ```
