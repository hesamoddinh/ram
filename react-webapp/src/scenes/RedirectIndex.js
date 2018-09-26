import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'

class RedirectIndex extends Component {
    render() {
        return (
            <Redirect to='/dashboard'/>
        );
    }
}

export default RedirectIndex