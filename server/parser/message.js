class Message{
    constructor(date, time, sender, text){
        this.date = date;
        this.time = time;
        this.sender = sender;
        this.text = text;
    }
}

module.exports.Message = Message;