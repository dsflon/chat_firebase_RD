const Login = (value) => {
    return { type: "LOGIN", value };
}
const Meta = (value) => {
    return { type: "META", value };
}
const Messages = (value) => {
    return { type: "MESSAGES", value };
}
const ImagesDB = (value) => {
    return { type: "IMAGE_DB", value };
}
const ShowDetail = (value) => {
    return { type: "SHOW_DETAIL", value };
}

export {
    Login,
    Meta,
    Messages,
    ShowDetail,
    ImagesDB
}
