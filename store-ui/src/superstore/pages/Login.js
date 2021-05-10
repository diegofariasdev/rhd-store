import React, {useState} from 'react'
import {Box, Button, Form, FormField, Heading, TextInput} from 'grommet'
import Layout from '../components/Layout'
import ProfileModel from '../model/ProfileModel'
import {useHistory, useLocation} from 'react-router'
import UsersClient from '../clients/UsersClient'

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
}

function Login() {
    const profileModel = ProfileModel
    const userClient = new UsersClient()
    const history = useHistory()
    const query = useQuery()
    const [usernameError, setUsernameError] = useState(null)
    const [passwordError, setPasswordError] = useState(null)
    const [usernameSignUpError, setUsernameSignUpError] = useState(null)

    const login = ({value}) => {
        setUsernameError(null)
        setPasswordError(null)

        userClient.login((token) => {
            profileModel.setToken(token)
            if(query.get("from") === "cart") history.push('/cart')
            else profileModel.isAdmin()
                ? history.push('/adminorders')
                : history.push('/')
        }, (error) => {
            if(error.details[0] === "Username not found") {
                setUsernameError("Username not found")
            }
            if(error.details[0] === "Bad credentials") {
                setPasswordError("Incorrect username and/or password")
            }
            if(error.details[0] === "User is disabled") {
                setUsernameError("Too many failed attempts")
            }
        }, value.username
        , value.password)
    }

    const signup = ({value}) => {
        userClient.signUp(() => {
                login({value})
            }, () => {
                setUsernameSignUpError("Unexpected error while creating user")
            }, value.username
            , value.password)
    }

    return (
        <Layout title='Login'>
            <Box
                fill='horizontal'
                pad={{"horizontal": "10em"}}>
                <Heading level={2}>Please login</Heading>
                <Form
                    onSubmit={login}
                >
                    <FormField name="username" htmlFor="username-id" label="Username" error={usernameError}>
                        <TextInput id="username-id" name="username" />
                    </FormField>
                    <FormField name="password" htmlFor="password-id" label="Password" error={passwordError}>
                        <TextInput id="password-id" name="password" type="password"/>
                    </FormField>
                    <Box pad={{'horizontal': 'large'}}>
                        <Button primary type="submit" label="Login" />
                    </Box>
                </Form>
            </Box>
            <Box
                fill='horizontal'
                pad={{"horizontal": "10em"}}
                margin={{"top": "18em", "bottom": "22em"}}
            >
                <Heading level={3}>... Or sign up if you're new</Heading>
                <Form
                    onSubmit={signup}
                >
                    <FormField
                        name="username"
                        htmlFor="username-su-id"
                        label="Username"
                        validate={(field, form) => {
                            if(typeof (form.username) == 'undefined' || form.username === "") return "Username is missing"
                        }}
                        error={usernameSignUpError}>
                        <TextInput id="username-su-id" name="username" />
                    </FormField>
                    <FormField
                        name="password"
                        htmlFor="password-su-id"
                        label="Password">
                        <TextInput id="password-su-id" name="password" type="password"/>
                    </FormField>
                    <FormField
                        name="passwordConf"
                        htmlFor="password-su-conf-id"
                        label="Confirm Password"
                        validate={(field, form) => {
                            if(form.passwordConf !== form.password) return "Password and Confirm Password mismatch"
                        }}>
                        <TextInput id="password-su-conf-id" name="passwordConf" type="password"/>
                    </FormField>
                    <Box pad={{'horizontal': 'large'}}>
                        <Button type="submit" label="Sign Up" />
                    </Box>
                </Form>
            </Box>
        </Layout>
    )
}

export default Login
