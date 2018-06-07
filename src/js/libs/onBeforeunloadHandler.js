const onBeforeunloadHandler = {

    add: () => {

        window.onbeforeunload = window.onunload = (e) => {
            var confirmationMessage = "";

            (e || window.event).returnValue = confirmationMessage;
            return confirmationMessage;
        };

    },

    remove: () => {

        window.onbeforeunload = window.onunload = null;

    }


}

export default onBeforeunloadHandler;
