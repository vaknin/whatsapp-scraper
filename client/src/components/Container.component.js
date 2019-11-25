import React, { Component } from 'react'
import axios from 'axios';
import instructions from '../images/instructions.jpeg';
import Results from './Results.component';
import FileUploader from './FileUploader.component';

export class Container extends Component {

    state = {
        words: undefined,
        emojis: undefined
    };

    prepareChat = chat => {

        // Get top ten words
        let words = chat.slice(1, 11);

        // Prepare top ten emojis
        let emojisObject = chat[0][1];
        let emojis = [];

        // Convert emoji object to array
        for (let key in emojisObject){
            let emoji = key;
            let count = emojisObject[key];
            emojis.push([emoji, count]);
        }

        // Sort emoji array by descending order
        emojis = emojis.sort((a,b) => b[1] - a[1]).slice(0, 10);

        // Save the chat, words & emojis to state
        this.setState({
            chat,
            words: words,
            emojis: emojis
        });
    }

    // Post request to the backend
    upload = file => {

        const data = new FormData();
        data.append('file', file);
        
        // Send the request
        axios.post('/upload', data,
        {
            }).then(res => {

                // Prepare the words and emojis
                let chat = Object.values(res.data);

                // Remove Media Messages entry
                for (let keyValuePair of chat){
                    let word = keyValuePair[0];
                    if (word === 'MediaMessages'){
                        let count = keyValuePair[1];
                        chat.splice(chat.indexOf(keyValuePair), 1);
                        this.setState({media: count});
                        break;
                    }
                }

                // Save info to state
                this.prepareChat(chat);
            }).catch(e => {
                console.log('Error: ' + e);
        });
    }

    // Remove a certain word/emoji from the list
    remove = (type, entry) => {

        let chat = this.state.chat;

        // Remove a word
        if (type === 'words'){

            // Loop through all words
            for (let keyValuePair of chat){
                let word = keyValuePair[0];
                if (word === entry){
                    chat.splice(chat.indexOf(keyValuePair), 1);
                    break;
                }
            }
        }

        // Remove an emoji
        else{

            // Loop through all emojis
            for (let emoji in chat[0][1]){
                if (emoji === entry){
                    delete chat[0][1][entry];
                    break;
                }
            }
        }

        // Update info
        this.setState({chat});
        this.prepareChat(chat);
    }

    // Reset
    reset = () => {
        this.setState({
            media: undefined,
            chat: undefined,
            words: undefined,
            emojis: undefined,
        });
    }

    render() {
        return (
            <div>

                { /*Header*/ }
                <h1 className="display-3 mt-3 mb-5 text-center strong">WhatsApp Analyzer</h1>
                <br/>

                { /*Body*/ }
                <div>
                    {this.state.chat ?
                    <Results
                        words={this.state.words}
                        emojis={this.state.emojis}
                        media={this.state.media}
                        remove={this.remove}
                        reset={this.reset}
                    />
                    :
                    <div className="text-center">
                        <h4>Upload the exported WhatsApp chat file in order to analyze it.</h4>
                        <img src={instructions}></img>
                        <FileUploader upload={this.upload} />
                    </div>
                    }
                </div>

            </div>
        )
    }
}

export default Container;