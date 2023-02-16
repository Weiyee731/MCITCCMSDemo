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
import Typography from "@mui/material/Typography";
import AccountCircle from '@mui/icons-material/AccountCircle';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import { toast } from "react-toastify";
import AlertDialog from "../../components/ModalComponent/ModalComponent";
import CircularProgress from '@mui/material/CircularProgress';
import CheckIcon from '@mui/icons-material/Check';

// import css
import "./Login.css"


var CryptoJS = require("crypto-js");

function mapStateToProps(state) {
    return {
        logonUser: state.counterReducer["logonUser"],
        loading: state.counterReducer["loading"],
        check_Mail: state.counterReducer["check_Mail"],
        otp_verification: state.counterReducer["otp_verification"],
        new_password: state.counterReducer["new_password"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        CallUserLogin: (data) => dispatch(GitAction.CallUserLogin(data)),
        CallUserLoginServer: (data) => dispatch(GitAction.CallUserLoginServer(data)),
        CheckEmail_Duplication: (data) => dispatch(GitAction.CheckEmail_Duplication(data)),
        SendOTP_Email: (data) => dispatch(GitAction.SendOTP_Email(data)),
        Update_NewPassword: (data) => dispatch(GitAction.Update_NewPassword(data)),
    };
}


const INITIAL_STATE = {
    // input 
    username: "",
    password: "",
    showPassword: false,
    showPassword2: false,
    isSubmit: false,
    openModal: false, 
    email:"",
    checkMail_Data: "",
    OTP: "",
    newPassword:"",
    isSubmitEmail: false,

    //Error validation:
    //-- Forget Password
    isRecoveryEmail_Empty: false,
    isOTP_Empty: false,
    isNewPassword_Empty: false,
   
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

        if(prevProps.check_Mail !== this.props.check_Mail){
         this.setState({checkMail_Data:this.props.check_Mail})

         this.getOTP()
        }
    }

    getOTP = () => {
        const id = this.props.check_Mail.map((x)=>(x.UserID))
        const data = {
            UserID : id,
            Type: 'EMAIL',
            ValidationField: 'PASSWORD'
        }
        this.props.SendOTP_Email(data)
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

            case "email":
                this.setState({email: e.target.value})
                break;

            case "otp":
                this.setState({OTP: e.target.value.toUpperCase().substr(0, 6)})
                break;

            case "newPassword":
                this.setState({newPassword: e.target.value})
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
                        ProjectDomainName: project,
                        ProjectDomainName: 'emporia'
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

        if (path !== undefined && path.length > 0 && path[1] !== "" && path[1] !== undefined && path[1].toUpperCase() === "CMS.MYEMPORIA.MY" && path[2] !== undefined && path[2] !== "" && path[2].toUpperCase() !== "ECOMMERCECMS") {
        
        // if (path !== undefined && path.length > 0 && path[1] !== "" && path[1] !== undefined && path[1].toUpperCase() === "CMS.MYEMPORIA.MY" && path[2] !== undefined && path[2] !== "" && path[2].toUpperCase() !== "") {
            credential = path[path.length - 1];
            let username = decryptData(credential.split("_")[0].replace(/p1L2u3S/g, '+').replace(/s1L2a3S4h/g, '/').replace(/e1Q2u3A4l/g, '='))
            let password = decryptData(credential.split("_")[1].replace(/p1L2u3S/g, '+').replace(/s1L2a3S4h/g, '/').replace(/e1Q2u3A4l/g, '='))

            if (username !== "" && password !== "")
            {
                this.OnSubmitLogin(username, password)
            }
             

        } else {
            return false
        }
    }

    handleModal = () =>{
        this.setState({openModal: !this.state.openModal})
    }

    handleSubmit_email = (type) => {

        console.log('type', type)
        const check_Email = {
            email: this.state.email,
            ProjectID:2
        }

        const retrieve_OTP = {
            UserID: this.props.check_Mail.map((x)=>(x.UserID)),
            Type: 'PASSWORD',
            OTP: this.state.OTP.slice(),
            UpdatedField: this.state.newPassword
        }

        // this.setState({isSubmitEmail: true})
        setTimeout(
            function() {
                this.setState({ isSubmitEmail: true });
            }
            .bind(this),
            2000
        );

        switch(type){
            case 'checkMail':
                this.props.CheckEmail_Duplication(check_Email)
                break;
            case 'hasOTP':
                console.log('woiii')
                this.props.Update_NewPassword(retrieve_OTP)
                this.handleModal()
                toast.success('Password updated successfully. Please log in with your new password.')
                break;
            default:
                break;
        }

    }

    handleOTP = (e,i) => {

        let array1 = []
        array1.push(e.target.value.slice(0,1))

        this.setState({arr1:this.state.arr1.concat(e.target.value.slice(0,1))})

        if(this.state.arr1 !== undefined && this.state.arr1[i].length > 0){

            let newArr = this.state.arr1
            newArr[i].push(e.target.value.slice(0,1))

        }
      } 
    
    render_OTPBox = () => {
        return(
            <div className="col-12" style={{margin:'1%',display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                {/* <div className="col-6" style={{display:'flex', flexDirection:'row', margin:'4%', justifyContent:'center'}}>
            { [0,1,2,3,4,5].map((x,i)=>(
                        <Input
                            id="OTP"
                            value={this.state.arr1[i]}
                            onChange={(e) => this.handleOTP(e,i)}
                            size="small"
                            style={{margin:'2%', borderRadius:8, padding:'2%', textUnderlineOffset:'none', textAlign:'center'}}
                        />  
                ))}

                
                </div> */}
                  <div className="col-6">
                    <FormControl sx={{ width: '100%', marginTop:'2%' }} variant="standard">
                        <InputLabel htmlFor="login-username">OTP</InputLabel>
                        <Input
                            id="otp"
                            value={this.state.OTP}
                            onChange={(e) => this.handleInputChange(e)}
                            size="small"
                            
                        />
                          {this.state.isOTP_Empty === true &&
                                <Typography variant="caption" color="error">Please enter received OTP.</Typography>
                            }
                    </FormControl>
                </div>
                <div className="col-6">
                    <FormControl sx={{width: '100%', marginTop:'4%' }} variant="standard">
                            <InputLabel htmlFor="login-password">Password</InputLabel>
                            <Input
                                id="newPassword"
                                type={this.state.showPassword2 ? 'text' : 'password'}
                                value={this.state.newPassword}
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
                                            onMouseUp={() => this.setState({ showPassword2: false })}
                                            onMouseDown={() => this.setState({ showPassword2: true })}
                                        >
                                            {this.state.showPassword2 ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />

              
                             {this.state.isNewPassword_Empty === true &&
                                <Typography variant="caption" color="error">Please set your new password.</Typography>
                            }
                        </FormControl>
                </div>
            </div>
        )
    }

    render_Modal = () => {
            return(
             <AlertDialog
                open={this.state.openModal}
                fullWidth
                maxWidth="sm"
                handleToggleDialog={() => this.handleModal()}
                title="Forgot Password"
                showAction={false}
              >
                <div className="container-fluid">
                  <div className="container">
                    <Typography >Enter your email to receive OTP for password.</Typography>
                    <FormControl sx={{ width: '100%' }} variant="standard">
                            <InputLabel htmlFor="login-username">Email</InputLabel>
                            <Input
                                id="email"
                                value={this.state.email}
                                onChange={(e) => this.handleInputChange(e)}
                                size="small"
                                endAdornment={
                                    <InputAdornment position="start">
                                        {this.state.email.length > 0 && this.state.isSubmitEmail === true && this.props.check_Mail.length > 0 ?
                                        <CheckIcon color="success"/>
                                        :
                                        this.state.email.length > 0 && 
                                        <CircularProgress size={20}/>
                                        }
                                    </InputAdornment>
                                }
                               
                            />

                            {this.state.isRecoveryEmail_Empty === true &&
                                <Typography variant="caption" color="error">Please Fill in your email</Typography>
                            }
                     </FormControl>
                    

                  </div>
          
                  {
                  
                    this.state.checkMail_Data.length > 0 && this.state.isSubmitEmail === true?
                        <div style={{margin:'2%', backgroundColor:'#DFDFDF', padding:'2%'}}>
                        <Typography>Please check your email and enter the OTP AND your new password.</Typography>
                    
                        {this.render_OTPBox()}
                        </div>

                    :

                    this.state.isSubmitEmail === true && this.props.check_Mail.length === 0 &&
                        <div style={{margin:'2%', backgroundColor:'#F3A5A5', padding:'2%'}}>
                        <Typography>Email not exist. Please re-enter valid email.</Typography>
                        </div>

                  }
                </div>
                <div style={{display:'flex', flexDirection:'row', justifyContent:'center', marginTop:'5%'}}>
                            <Button variant="contained" color="primary" onClick={()=>this.state.checkMail_Data.length > 0 ? this.error_Validation('hasOTP') : this.error_Validation('checkMail')}>Submit</Button>
                </div>
              </AlertDialog >
            )
    }

    error_Validation = (type) => {
        switch(type){
            case 'checkMail':
        
                if (this.state.email.length === 0 && this.state.isSubmitEmail === true){
                    this.setState({isRecoveryEmail_Empty:true})
                    toast.error('Please fill in required information.')
                }
                else{
                    this.handleSubmit_email(type)
                }
            break;

        case 'hasOTP':
            if(this.state.OTP.length === 0 && this.state.newPassword.length !== 0 && this.state.isSubmitEmail === true)
            {
                this.setState({isOTP_Empty:true})
                toast.error('Please enter required information')
            }
    
            else if (this.state.newPassword.length === 0 && this.state.OTP.length !== 0 &&  this.state.isSubmitEmail === true){
                this.setState({isNewPassword_Empty: true})
                toast.error('Please enter required information')
            }

            else if (this.state.newPassword.length === 0 && this.state.OTP.length === 0 && this.state.isSubmitEmail === true){
                this.setState({isNewPassword_Empty: true, isOTP_Empty: true})
                toast.error('Please enter required information')
            }

            else if(this.state.OTP.length !== 0 && this.state.newPassword.length !== 0 && this.state.isSubmitEmail === true)
            {
                this.handleSubmit_email(type)
            }
        break;

        }
      
    }

    render() {

        {console.log('ss', this.state.newPassword.length, this.state.isSubmitEmail === true)}

        return (
            <div style={{ display: 'flex', width: '100%', height: '100vh', }}>
                <div className="container login-container m-auto">

                    <div className="logo-container w-100" style={{textAlign:"center"}}>
                        <img src="" alt="System Logo" width='250px' height='100%' onError={event => { event.target.src = GetDefaultImage(); event.onerror = null }} />
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

                        <a href="#" title="Forget Password?" style={{ marginLeft: '0.5em', fontSize: '11pt', textDecoration:'none'}} onClick={()=>this.handleModal()}>Problem on login ?</a>

                        {this.render_Modal()}

                    </div>
                </div>
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);