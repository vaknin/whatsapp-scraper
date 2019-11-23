import React, { Component } from 'react';

export class FileUploader extends Component{

    render() {
        return (
            <div className="container mt-5">
                <div className="form-group color">
                    <form action="/profile" method="post" encType="multipart/form-data">
                        <input type="file" onChange={e => this.props.upload(e.target.files[0])} className="files form-control" multiple=""/>
                    </form>
                </div>
            </div>
        )
    }
}

export default FileUploader;