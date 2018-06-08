const TimeStamp = (num) => {

    let today = new Date();
        today = today.getFullYear() + "/" + (today.getMonth()+1) + "/" + today.getDate();

    const data = new Date(num);
    let year = data.getFullYear(),
        month = data.getMonth()+1,
        day = data.getDate(),
        hour = data.getHours(),
        minute = data.getMinutes();

    let talkDate = year + "/" + month + "/" + day;

    if( today === talkDate ) {
        talkDate = hour + ":" + String(minute).padStart(2, "0")
    } else {
        talkDate = month + "/" + day + " " + hour + ":" + String(minute).padStart(2, "0")
    }

    return talkDate

}

export default TimeStamp;
