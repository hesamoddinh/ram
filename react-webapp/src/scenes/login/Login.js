import React, {Component} from 'react'
import AuthService from '../../services/AuthService'
import {Redirect} from 'react-router-dom'
import {Button, Form, Grid, Input, Message, Segment} from 'semantic-ui-react'
import {FormattedMessage, injectIntl, intlShape} from 'react-intl'

const CryptoJS = require('crypto-js')

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            redirectToReferrer: false,
            username: '',
            passwordHash: '',
            error: false,
            loading: false
        }
        this.onChangeUsername = this.onChangeUsername.bind(this)
        this.onChangePassword = this.onChangePassword.bind(this)
    }

    getToken = () => {
        AuthService.getToken('admin')
    }

    login = () => {
        this.setState({loading: true})
        AuthService.login(this.state.username, this.state.passwordHash.toString())
            .then(payload => {
                this.setState({loading: false})
                localStorage.setItem("auth", 'true')
                localStorage.setItem("username", this.state.username)
                localStorage.setItem("passwordHash", this.state.passwordHash)
                this.setState({redirectToReferrer: true}, () => {
                    this.props.history.push('/dashboard')
                })
            })
            .catch(err => {
                this.setState({loading: false})
                if (err) {
                    this.setState({errorCode: err.errorCode})
                }
            })
    }

    onChangePassword = (e, input) => {
        this.setState({passwordHash: CryptoJS.SHA256(input.value)})
    }

    onChangeUsername = (e, input) => {
        this.setState({username: input.value})
    }

    style = {
        // marginTop: "5%",
        margin: '0',
        height: '100vh',
        // background: `url(${loginBackground})`,
        backgroundSize: 'cover'
    }

    componentDidMount = () => {
        this.getToken()
    }

    render() {
        const textAlign = this.props.intl.formatMessage({id: 'layout.textAlign'})
        const {from} = this.props.location.state || {from: {pathname: '/'}}
        const {redirectToReferrer} = this.state

        if (redirectToReferrer) {
            return (
                <Redirect to={from}/>
            )
        }

        return (
            <Segment style={{borderRadius: '0'}} inverted={true} color={'violet'}>
                <Grid relaxed padded centered columns={1} style={this.style}>
                    <Grid.Row verticalAlign='middle'>
                        <Grid.Column computer={6} mobile={14} tablet={10} largeScreen={5}>
                            <Segment>
                                <Form error={!!this.state.errorCode}>
                                    <Form.Field>
                                        <label style={{textAlign: textAlign}}><FormattedMessage
                                            id='scenes.login.username'/></label>
                                        <Input style={{direction:'ltr',textAlign: textAlign}} name="username"
                                               onChange={this.onChangeUsername}/>
                                    </Form.Field>
                                    <Form.Field>
                                        <label style={{textAlign: textAlign}}><FormattedMessage
                                            id='scenes.login.password'/></label>
                                        <Input style={{direction:'ltr',textAlign: textAlign}} name="password" type="password"
                                               onChange={this.onChangePassword}/>
                                    </Form.Field>
                                    {this.state.errorCode
                                        ? <Message
                                            style={{textAlign: textAlign}}
                                            error
                                            header={this.props.intl.formatMessage({id: 'error'})}
                                            content={this.props.intl.formatMessage({id: `login.error.${this.state.errorCode}`})}
                                        /> : null}
                                    <Form.Field>
                                        <Button loading={this.state.loading} style={{marginTop: '5%'}} fluid color={'violet'} onClick={this.login}>
                                            <FormattedMessage id='scenes.login.login'/></Button>
                                    </Form.Field>
                                    <Form.Field>
                                        <Button fluid color={'violet'} onClick={() => this.props.history.push('/signup')} basic
                                                content={this.props.intl.formatMessage({id: 'signup.title'})}/>
                                    </Form.Field>

                                </Form>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        )
    }
}

Login.propTypes = {
    intl: intlShape
}
export default injectIntl(Login)
