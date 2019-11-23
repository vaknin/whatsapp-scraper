import React, { Component } from 'react';

export class Reset extends Component {
    render() {
        return (
            <div>
                <button onClick={this.props.onClick} type="button" className="btn btn-secondary">Reset</button>
            </div>
        )
    }
}

export default Reset;
