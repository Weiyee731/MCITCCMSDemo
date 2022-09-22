import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../store/action/gitAction";
// import { browserHistory } from "react-router";
import { setLogonUser } from "../../components/auth/AuthManagement"
import { GetDefaultImage } from "../../tools/MediaHelpers"
import { isStringNullOrEmpty, isArrayNotEmpty } from "../../tools/Helpers"

import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import AccountCircle from '@mui/icons-material/AccountCircle';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import { toast } from "react-toastify";

// import css
import "./Login.css"

var CryptoJS = require("crypto-js");

function mapStateToProps(state) {
    return {
        logonUser: state.counterReducer["logonUser"],
        loading: state.counterReducer["loading"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        CallUserLogin: (data) => dispatch(GitAction.CallUserLogin(data)),
        CallUserLoginServer: (data) => dispatch(GitAction.CallUserLoginServer(data)),
    };
}


const INITIAL_STATE = {
    // input 
    username: "",
    password: "",
    showPassword: false,
    isSubmit: false
}

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE

        this.handleInputChange = this.handleInputChange.bind(this)
        this.OnSubmitLogin = this.OnSubmitLogin.bind(this)
    }

    componentDidMount() {
        this.checkPathName()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.logonUser !== this.props.logonUser && this.state.isSubmit === true) {

            if (this.props.logonUser.length > 0) {
                if (this.props.logonUser[0].ReturnVal !== "0") {
                    // if (window.location.hostname !== "localhost")
                    //     setLogonUser(this.props.logonUser,
                    //         this.props.sidebars,
                    //         window.location.hostname.split(".")[1],
                    //         window.location.hostname.split(".")[2],
                    //         window.location.hostname
                    //     )
                    // else
                    //     setLogonUser(this.props.logonUser,
                    //         this.props.sidebars,
                    //         window.location.pathname.split(".")[1],
                    //         window.location.pathname.split(".")[2],
                    //         window.location.pathname.split("/")[1]
                    //     )

                    setLogonUser(
                        this.props.logonUser,
                        this.props.sidebars,
                        "myemporia",
                        "my",
                        "CMS.myemporia.my"
                    )
                }
                else {
                    toast.error("The username and password does not match.")
                }
            }

        }
    }

    handleInputChange = (e) => {
        const elementId = e.target.id
        switch (elementId) {
            case "login-username":
                this.setState({ username: e.target.value.trim() })
                break;

            case "login-password":
                this.setState({ password: e.target.value })
                break;

            default:
                break;
        }
    }

    isInputsVerified = (username, password) => {
        return (!isStringNullOrEmpty(username) && !isStringNullOrEmpty(password))
    }

    OnSubmitLogin = (username, password) => {
        let project = ""

        if (window.location.hostname === "localhost") {
            project = window.location.pathname !== "/" && window.location.pathname.split(".")[1];
            if (window.location.pathname !== "/") {
                if (this.isInputsVerified(username, password)) {
                    let object = {
                        username: username,
                        password: password,
                        ProjectDomainName: project
                    }
                    this.props.CallUserLogin(object)
                }
                this.setState({ isSubmit: true })
            }
            else
                toast.error("Error: 1101.2: Unable to login. Project Error")
        }
        else {
            project = window.location.hostname !== "/" && window.location.hostname.split(".")[1];
            if (window.location.hostname !== "/") {
                if (this.isInputsVerified(username, password)) {
                    let object = {
                        username: username,
                        password: password,
                        ProjectDomainName: project
                    }
                    this.props.CallUserLoginServer(object)
                }
                this.setState({ isSubmit: true })
            }
            else
                toast.error("Error: 1101.2: Unable to login. Project Error")
        }
    }



    checkPathName = () => {
        const decryptData = (data) => {
            var bytes = CryptoJS.AES.decrypt(data, 'myemporia@123');
            var decryptedData = bytes.toString(CryptoJS.enc.Utf8);

            return decryptedData
        }
        let project = ""
        let credential = ""
        let path = ""

        if (window.location.hostname === "localhost")
            path = window.location.pathname !== "/" && window.location.pathname.split("/")
        else
            path = window.location.hostname !== "/" && window.location.hostname.split("/");

        console.log("pathhh", path)
        console.log("pathhh", path[2])

        if (path !== undefined && path.length > 0 && path[1] !== "" && path[1].toUpperCase() === "CMS.MYEMPORIA.MY" && path[2] !== undefined && path[2] !== "") {
            credential = path[path.length - 1];
            let username = decryptData(credential.split("_")[0])
            let password = decryptData(credential.split("_")[1])

            if (username !== "" && password !== "")
                this.OnSubmitLogin(username, password)

        } else {
            return false
        }
    }

    render() {
        return (
            <div style={{ display: 'flex', width: '100%', height: '100vh', }}>
                <div className="container login-container m-auto">

                    <div className="logo-container w-100">
                        <img src="" alt="System Logo" width='100%' height='100%' onError={event => { event.target.src = GetDefaultImage(); event.onerror = null }} />
                    </div>
                    <div className="login-inputs-group">
                        <FormControl sx={{ m: 1, width: '100%' }} variant="standard">
                            <InputLabel htmlFor="login-username">Username</InputLabel>
                            <Input
                                id="login-username"
                                value={this.state.username}
                                onChange={(e) => this.handleInputChange(e)}
                                size="small"
                                startAdornment={
                                    <InputAdornment position="start">
                                        <AccountCircle />
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                        <FormControl sx={{ m: 1, width: '100%' }} variant="standard">
                            <InputLabel htmlFor="login-password">Password</InputLabel>
                            <Input
                                id="login-password"
                                type={this.state.showPassword ? 'text' : 'password'}
                                value={this.state.password}
                                onChange={(e) => this.handleInputChange(e)}
                                size="small"
                                startAdornment={
                                    <InputAdornment position="start">
                                        <VpnKeyIcon />
                                    </InputAdornment>
                                }
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onMouseUp={() => this.setState({ showPassword: false })}
                                            onMouseDown={() => this.setState({ showPassword: true })}
                                        >
                                            {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                        <Button
                            sx={{ m: 1 }}
                            className="w-100"
                            variant="contained"
                            type="submit"
                            onClick={() => this.OnSubmitLogin(this.state.username, this.state.password)}
                            disabled={this.state.username !== '' && this.state.password !== '' ? false : true}

                        >
                            Login
                        </Button>

                        <a href="#" title="Forget Password?" style={{ marginLeft: '0.5em', fontSize: '11pt' }}>Problem on login?</a>
                    </div>
                </div>
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);