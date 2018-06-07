const reducer = (state, action) => {

    switch (action.type) {

        case 'FETCH': //members
        return Object.assign({}, state, {
            fetch: action.value,
        })

        case 'META': //members
        return Object.assign({}, state, {
            meta: action.value,
        })

        case 'MEMBERS': //members
        return Object.assign({}, state, {
            members: action.value,
        })

        case 'MESSAGES': //members
        return Object.assign({}, state, {
            messages: action.value,
        })

        default:
        return state;

    }

}

export default reducer;
