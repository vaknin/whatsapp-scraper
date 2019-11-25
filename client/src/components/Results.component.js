import React, { Component } from 'react';
import Reset from './Reset.component';


export class Results extends Component {

    // Receive an array of Emojis/Words and its count, and display it
    renderResults = type => {

        // If no results returned, don't display anything
        if (this.props[type] === undefined) return;

        const render = () => {
            let array = this.props[type];

            // Iterate through each keyvaluepair, and display it
            return array.map(keyValuePair => {
                let key = keyValuePair[0]; 
                let count = keyValuePair[1];

                return (
                    <p key={key} onClick={() => this.props.remove(type, key)} className="entry text-center">
                        <span className="badge badge-info">{`${count}` }</span>{ ` - ${key.toString()}`} 
                    </p>
                );
            });
        }

        // Render
        return (
            <div className="mx-5 rounded border border-light col-9" style={{backgroundColor: '#eee'}}>
                <h3 className="my-3 text-center">{type[0].toUpperCase() + type.slice(1)}</h3>
                {render()}
            </div>
        );
    }

    render() {
        return (
            <div className="container">

                <div className="row d-flex justify-content-center">
                    {/*Top Words*/}
                    <div className="col-4 d-flex justify-content-center">
                        { this.renderResults('words') }
                    </div>

                    { /*Top Emojis*/ }
                    <div className="col-4 d-flex justify-content-center">
                        { this.renderResults('emojis') }
                    </div>
                </div>

                { /* Media */ }
                <div className="row d-flex justify-content-center">
                    <h5 className="mt-4">{this.props.media || 0} Media and voice messages</h5>
                </div>

                { /* Reset Button */ }
                <div className="row mt-3 d-flex justify-content-center">
                    <Reset onClick={this.props.reset}/>
                </div>
            </div>
        )
    }
}

export default Results;