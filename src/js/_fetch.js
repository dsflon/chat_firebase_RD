const Fetch = (actions,roomId) => {

    // Fetchはローカル用
    fetch('/initial_messages.json')
    .then( (response) => {
        return response.json();
    })
    .then( (json) => {
        actions.Members(json.members);
        actions.Meta(json.meta);

        let messages = roomId ? json.messages[roomId] : json.messages;
        actions.Messages(messages);
    });

}

export default Fetch;
