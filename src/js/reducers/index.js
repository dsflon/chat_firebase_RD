const reducer = (state, action) => {

    switch (action.type) {

        case 'LOGIN':
        return Object.assign({}, state, {
            myAccount: action.value,
        })

        case 'META':
        return Object.assign({}, state, {
            meta: action.value,
        })

        case 'MESSAGES':
        return Object.assign({}, state, {
            messages: action.value,
        })

        case 'SHOW_DETAIL':
        return Object.assign({}, state, {
            showDetail: action.value,
        })

        default:
        return state;

    }

}

export default reducer;
