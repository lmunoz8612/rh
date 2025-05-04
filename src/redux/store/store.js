import { createStore, combineReducers } from 'redux';
import userReducer from '../reducers/userReducer';

const preloadedState = () => {
    try {
        const serializedState = localStorage.getItem('user');
        if (serializedState) {
            return JSON.parse(serializedState);
        }

        return undefined;
    }
    catch (e) {
        return undefined;
    }
};

const rootReducer = combineReducers({
    user: userReducer
});

const store = createStore(
    rootReducer,
    preloadedState(),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;