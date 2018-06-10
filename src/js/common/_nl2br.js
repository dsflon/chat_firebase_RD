import React from 'react';

const nl2br = (text) => {

    var regex = /(\r?\n)/g;

    return text.split(regex).map(function (line,i) {
        if (line.match(regex)) {
            return React.createElement('br', { key: "br_"+i })
        } else {
            return line;
        }
    });

}

export default nl2br;
