import React, { Component } from 'react';

export class FileUploader extends Component{

    render() {
        return (
            <div className="container mt-5 text-center">
                <div className="form-group color text-center">
                    <form action="/profile" method="post" encType="multipart/form-data">
                        <input type="file" onChange={e => this.props.upload(e.target.files[0])} className="files form-control text-center" multiple=""/>
                    </form>
                </div>
            </div>
        )
    }
}

export default FileUploader;