Redux async actions
=========

A small library that adds commas to numbers

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
