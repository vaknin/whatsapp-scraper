// Requires
const fs = require('fs');
const Message = require('./message').Message;

class ChatParser{

    // Read the chat file
    read(chat){

        // Extract messages from the chat
        const messages = this.getMessages(chat);

        // Extract text from the messages, replace single byte heart with emoji heart
        let sentences = messages.map(msg => msg.text ? msg.text.replace(/[❤]/g, '❤️') : undefined);

        // Find the most used words and emojis
        return this.getRanking(sentences);
    }

    // Receives a WhatsApp chat and returns an array of message objects with text,date,time etc.
    getMessages(chat){

        function removeInvalidEmojis(string){
            let regex = /[🏻🏼🏽🏾🏿♀�]/g;
            return string.replace(regex, '');
        }

        let messages = [];

        outerloop:
        while (true){

            // Extract date & time
            let date = chat.substring(0, chat.indexOf(','));
            let time = chat.substring(chat.indexOf(',') + 2, chat.indexOf('-') - 1);

            // Extract message & sender
            let text = chat.substring(chat.indexOf(':', chat.indexOf(':') + 1) + 2 , chat.indexOf('\n'));
            text = removeInvalidEmojis(text);
            
            let sender = 'sender';

            // Delete the extracted line
            chat = chat.slice(chat.indexOf('\n') + 1);

            // Media message - set text as undefined
            if(text.includes('Media omitted')){
                let msg = new Message(date, time, sender, undefined);
                messages.push(msg);
                continue;
            }

            // Check if the next line is a new message or a newline
            innerloop:
            while(true){

                const pushMessage = () => messages.push(new Message(date, time, sender, text.replace(/[^א-תA-z \u00a9|\u00ae|\u2000-\u3300|\ud83c\ud000-\udfff|\ud83d\ud000-\udfff|\ud83e\ud000-\udfff]/gi,' ')));
                
                // The next line to examine
                let nextLine = chat.substring(0, chat.indexOf('\n'));
                if (nextLine == ''){
                    pushMessage();
                    break outerloop;
                }

                // Contains one of our names - might be a line or a msg
                if (nextLine.includes('טל') || nextLine.includes('אביב')){

                    // New message
                    if(nextLine.includes('-') && nextLine.includes(',') && nextLine.includes('/') && nextLine.includes(':')){
                        pushMessage();
                        break innerloop;
                    };
                }

                // New line
                text += nextLine;
                chat = chat.slice(chat.indexOf('\n') + 1);
            }
        }

        return messages;
    }

    // Extract all words from a sentence into an array
    sentenceToPieces(sentence){

        let pieces = [];
        let currentWord = '';
        let halfEmoji = '';

        // Media message
        if (sentence == undefined){
            return ['📷'];
        }

        for (let i = 0; i < sentence.length; i++){

            // The character to inspect
            let char = sentence[i];

            // Emoji
            if (this.isEmoji(char)){

                // Push the piece that is being built
                if (currentWord){
                    pieces.push(currentWord);
                    currentWord = '';
                }

                // There's already half an emoji - add the other half and push the emoji
                else if (halfEmoji){
                    
                    let emoji = halfEmoji + char;
                    halfEmoji = '';
                    pieces.push(emoji);
                    continue;
                }

                // Add the char as the first half of emoji
                halfEmoji = char;
            }

            // Check for space to end the word
            else if (char == ' '){

                // Add the last character - if a piece is being built
                if (currentWord){
                    pieces.push(currentWord); 
                    currentWord = '';
                }

                else if (halfEmoji){
                    halfEmoji = '';
                }
                continue; // Continue to next word or return if last iteration
            }

            // Regular character
            else{

                // Build the word
                currentWord += char;
        
                // Last iteration - push the word
                if (i == sentence.length - 1){
                    pieces.push(currentWord);
                }
            }

        }

        return pieces;
    }

    // Is the character an emoji?
    isEmoji = char => char.match(/[א-תA-z ]/) == null ? true : false;

    // Sort the words by count
    getRanking(sentences){

        // Ranking object
        let ranking = {
            Emojis: {},
            MediaMessages: 0
        };

        // Loop through all given sentences
        for (let sentence of sentences){

            // All of the words and emojis that are used in the sentence
            let pieces = this.sentenceToPieces(sentence);

            // Loop through all used ranking
            for (let piece of pieces){
                
                // Emoji / Media message
                if (this.isEmoji(piece)){
                    
                    // Media Message
                    if (piece == '📷'){
                        ranking.MediaMessages++;
                        continue;
                    }

                    else if (!Object.keys(ranking.Emojis).includes(piece)){
                        ranking.Emojis[piece] = 1;
                    }

                    else ranking.Emojis[piece]++;
                }
            
                // New piece
                else if (!Object.keys(ranking).includes(piece)) ranking[piece] = 1;
                
                // A recognized piece
                else ranking[piece]++;
            }
        }

        let array = [];

        // Convert the object to an array => [word, count]
        for (let key of Object.keys(ranking)){
            array.push([key, ranking[key]]);
        }

        // Sort by descending order
        let sorted = array.sort((a,b) => b[1] - a[1]);

        // Return the ranked array
        return sorted;
    }
}

module.exports.ChatParser = ChatParser;