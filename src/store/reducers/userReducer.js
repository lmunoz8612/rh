const initialState = {
    data: {},
};

const deleteAllCookies = () => {
    document.cookie.split(";").forEach(cookie => {
        document.cookie = cookie
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/");
    });
};

const saveState = (state) => {
    localStorage.setItem('user', JSON.stringify({ user: state }));
    return state;
};

const deleteState = () => {
    localStorage.clear();
    deleteAllCookies();
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN':
            return saveState({
                ...state,
                data: action.payload,
            });
        case 'LOGOUT':
            deleteState();
            return {
                ...state,
                data: {},
            };
        case 'UPDATE':
            return saveState({
                ...state,
                data: {
                    ...state.data,
                    ...action.payload
                },
            });
        default:
            return state;
    }
};

export default userReducer;