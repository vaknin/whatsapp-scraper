import React, { Component } from 'react';

export class TopContainer extends Component {

    // Receive an array of Emojis/Words and its count, and display it
    renderResults = type => {

        // If no results returned, don't display anything
        if (this.props[type] === undefined) return;
        const renderResults = () => {
            let array = this.props[type];

            // Iterate through each keyvaluepair, and display it
            return array.map(keyValuePair => {
                let key = keyValuePair[0]; 
                let count = keyValuePair[1];

                return (
                    <p key={key} onClick={() => this.props.remove(type, key)} className="entry">
                        <span className="badge badge-info">{`${count}` }</span>{ ` - ${key.toString()}`} 
                    </p>
                );
            });
        }

        // Render
        return (
            <div className="mx-5 rounded border border-light col-9" style={{backgroundColor: '#eee'}}>
                <h3 className="my-3">{type[0].toUpperCase() + type.slice(1)}</h3>
                {renderResults()}
            </div>
        );
    }

    render() {
        return (
            <div className="d-flex justify-content-center mt-4 row">

                {/*Top Words*/}
                <div>
                    { this.renderResults('words') }
                </div>

                {/*Top Emojis*/}
                <div>
                    { this.renderResults('emojis') }
                </div>
            </div>
        )
    }
}

export default TopContainer;