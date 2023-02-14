import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../store/action/gitAction";
// import { browserHistory } from "react-router";
import { setLogonUser } from "../../components/auth/AuthManagement"
import { GetDefaultImage } from "../../tools/MediaHelpers"
import { isStringNullOrEmpty, isContactValid, isEmailValid, isArrayNotEmpty } from "../../tools/Helpers"

import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import AccountCircle from '@mui/icons-material/AccountCircle';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { toast } from "react-toastify";
import { Tooltip, OutlinedInput, Card, CardContent, Typography, InputAdornment, FormHelperText, MenuItem, FormControl, Box, InputLabel, Select, TextField, IconButton } from "@mui/material";
import HorizontalLinearStepper from "./Stepper";
import InfoIcon from '@mui/icons-material/Info';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import moment from 'moment';

// import css
import "./registerMerchant.css";
import { redirect } from "react-router";

function mapStateToProps(state) {
    return {
        logonUser: state.counterReducer["logonUser"],
        states: state.counterReducer["states"],
        shopUpdated: state.counterReducer["shopUpdated"],
        merchantUpdateProfile: state.counterReducer["merchantUpdateProfile"],

    };
}

function mapDispatchToProps(dispatch) {
    return {
        CallGetUpdateMerchantProfile: (data) => dispatch(GitAction.CallGetUpdateMerchantProfile(data)),
        CallState: (data) => dispatch(GitAction.CallState(data)),
        CallUpdateShopDetails: (data) => dispatch(GitAction.CallUpdateShopDetails(data)),
    };
}



const INITIAL_STATE = {
    // input 
    username: "",
    password: "",
    showPassword: false,
    isSubmit: false,
    steps: 1,
    activeStep: 0,
    firstname: "",
    lastname: "",
    icnumber: "",
    password: "",
    confirmpassword: "",
    contactno: "",
    email: "",
    DOB: "",
    ShopName: "",
    website: "",
    address1: "",
    address2: "",
    postcode: "",
    city: "",
    country: "",
    contactno: "",
    shopdesc: "",
    Err: false,
    firstNameErr: false,
    lastNameErr: false,
    icnumberErr: false,
    // passwordErr: false,
    // confirmpasswordErr: false,
    // pwNotMatch: false,
    emailErr: false,
    contactnoErr: false,
    DOBErr: false,
    ShopNameErr: false,
    address1Err: false,
    postcodeErr: false,
    cityErr: false,
    countryErr: false,
    countryArry: [],
}

class RegisterMerchant extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE


    }

    componentDidMount() {
        this.props.CallState()
    }

    componentDidUpdate(prevProps, prevState) {
        console.log(this.props.shopUpdated,this.props.merchantUpdateProfile)
        console.log(prevProps.shopUpdated !== this.props.shopUpdated)
        console.log(prevProps.merchantUpdateProfile !==this.props.merchantUpdateProfile)
        // console.log(prevProps.this.props.shopUpdated,prevProps.merchantUpdateProfile)
        if(prevProps.shopUpdated !== this.props.shopUpdated && prevProps.merchantUpdateProfile !==this.props.merchantUpdateProfile){
            console.log(this.props.shopUpdated,this.props.merchantUpdateProfile)
            if(isArrayNotEmpty(this.props.shopUpdated) && this.props.shopUpdated[0].ShopID !== null && isArrayNotEmpty(this.props.merchantUpdateProfile) && this.props.merchantUpdateProfile[0].UserID !== 0){
                toast.success("Shop account has successfully created!")
                // window.location.replace("/")
            }
        }
    }

    getProps = (activeStep, Err) => {
        if (Err === false) {
            this.setState({ activeStep: activeStep })
            if (parseInt(activeStep) === 2) {
                let param = {
                    USERID: 12,
                    SHOPNAME: this.state.ShopName,
                    SHOPDESC: this.state.shopdesc,
                    SHOPPOSCODE: this.state.postcode,
                    SHOPCITY: this.state.city,
                    SHOPSTATE: this.state.country,
                    SHOPCOUNTRYID: this.state.countryid,
                }
                let param2 = {
                    USERID:12,
                    FIRSTNAME:this.state.firstname, 
                    LASTNAME:this.state.lastname,
                    USEREMAIL:this.state.email,
                    USERGENDER:"-",
                    USERCONTACTNO:this.state.contactno,
                    USERDOB:moment(this.state.DOB).format("YYYY-MM-DD"),
                    USERNRIC:this.state.icnumber,
                }
                this.props.CallUpdateShopDetails(param)
                this.props.CallGetUpdateMerchantProfile(param2)
                // window.location.replace("/")
            }
        } else {
            if (this.state.firstname === "") {
                this.setState({ firstNameErr: true })
            }
            if (this.state.lastname === "") {
                this.setState({ lastNameErr: true })
            }
            if (this.state.icnumber === "") {
                this.setState({ icnumberErr: true })
            }
            if (this.state.password === "") {
                this.setState({ passwordErr: true })
            }
            if (this.state.confirmpassword === "") {
                this.setState({ confirmpasswordErr: true })
            }
            if (this.state.contactno === "") {
                this.setState({ contactnoErr: true })
            }
            if (this.state.email === "") {
                this.setState({ emailErr: true })
            }
            if (this.state.DOB === "") {
                this.setState({ DOBErr: true })
            }
            if (this.state.ShopName === "") {
                this.setState({ ShopNameErr: true })
            }
            if (this.state.address1 === "") {
                this.setState({ address1Err: true })
            }
            if (this.state.postcode === "") {
                this.setState({ postcodeErr: true })
            }
            if (this.state.city === "") {
                this.setState({ cityErr: true })
            }
            if (this.state.country === "") {
                this.setState({ countryErr: true })
            }
            // if(this.state.lastname === "" && this.state.icnumber === "" && this.state.contactno === ""
            // && this.state.email && this.state.ShopName === "" && this.state.address1 === "" 
            // && this.state.postcode === "" && this.state.city === "" && this.state.country === ""){
            //     this.setState({Err:Err})
            // }
        }

    }

    handleChange(e, name) {
        this.setState({ firstNameErr: false, lastNameErr: false, DOBErr: false, icnumberErr: false, passwordErr: false, confirmpasswordErr: false, emailErr: false, contactnoErr: false, ShopNameErr: false, address1Err: false, postcodeErr: false, cityErr: false, countryErr: false })
        switch (name) {
            case "lastname":
                this.setState({ lastname: e })
                if (e === "") {
                    this.setState({ lastNameErr: true, })
                }
                break;
            case "firstname":
                this.setState({ firstname: e })
                if (e === "") {
                    this.setState({ firstNameErr: true, })
                }
                break;
            case "icnumber":
                this.setState({ icnumber: e })
                if (e === "") {
                    this.setState({ icnumberErr: true })
                }
                break;
            case "DOB":
                this.setState({ DOB: e })
                if (e === "") {
                    this.setState({ DOBErr: true })
                }
                break;
            // case "password":
            //     this.setState({ password: e})
            //     if (e === ""){
            //         this.setState({passwordErr:true})
            //     }
            //     break;
            // case "confirmpassword":
            //     this.setState({ confirmpassword: e})
            //     if (e === ""){
            //         this.setState({confirmpasswordErr:true})
            //     }else if (e !== this.state.password){
            //         this.setState({pwNotMatchErr:true})
            //     }else if(e === this.state.password){
            //         this.setState({confirmpasswordErr:false,pwNotMatchErr:false})
            //     }
            //     break;
            case "ShopName":
                this.setState({ ShopName: e })
                if (e === "") {
                    this.setState({ ShopNameErr: true })
                }
                break;
            case "shopdesc":
                this.setState({ shopdesc: e })
                break;
            case "website":
                this.setState({ website: e })
                break;
            case "address1":
                this.setState({ address1: e })
                if (e === "") {
                    this.setState({ address1Err: true })
                }
                break;
            case "address2":
                this.setState({ address2: e })
                break;
            case "contactno":
                this.setState({ contactno: e })
                if (e === "") {
                    this.setState({ contactnoErr: true })
                }
                if (this.state.email !== "" && isEmailValid(e)) {
                    this.setState({ emailvalidErr: true })
                }
                break;
            case "email":
                this.setState({ email: e })
                if (e === "") {
                    this.setState({ emailErr: true })
                }
                break;
            case "postcode":
                this.setState({ postcode: e })
                if (e === "") {
                    this.setState({ postcodeErr: true })
                }
                break;
            case "city":
                this.setState({ city: e })
                if (e === "") {
                    this.setState({ cityErr: true })
                }
                break;
            case "country":
                let selected= this.props.states.filter((x) => x.State === e)
                selected.map((x)=>this.setState({countryid:x.StateID}))
                this.setState({ country: e})
                if (e === "") {
                    this.setState({ countryErr: true })
                }
                break;

            default:

        }
    }

    renderCard(activeStep) {
        const country = this.props.states
        const selectedCity = this.props.states.filter((x) => x.State === this.state.country).map((y) => JSON.parse(y.CityDetail))
        switch (activeStep) {
            case 0:
                return (
                    <div>
                        <div className="row m-4 d-flex justify-content-center">
                            <div className="col-xl-2 col-lg-2 col-md-2 col-s-12 col-xs-12 inputForm">
                                <div className="asterisk">*</div>First Name:
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-s-12 col-xs-12">
                                <FormControl fullWidth size="small" variant="outlined">
                                    <OutlinedInput
                                        id="outlined-adornment-name"
                                        label=""
                                        type="string"
                                        value={this.state.firstname}
                                        // disabled={isActive ? false : true}
                                        onChange={(e) => this.handleChange(e.target.value, "firstname")}
                                        endAdornment={<InputAdornment position="end"> {this.state.firstname.length}/20</InputAdornment>}
                                        inputProps={{
                                            'aria-label': 'name',
                                            maxLength: 20,
                                        }}
                                        required
                                    />
                                </FormControl>
                                {(this.state.firstNameErr === true || this.state.Err === true) && <FormHelperText style={{ color: "red" }}>First name is required</FormHelperText>}
                            </div>
                        </div>
                        <div className="row m-4 d-flex justify-content-center">
                            <div className="col-xl-2 col-lg-2 col-md-2 col-s-12 col-xs-12 inputForm">
                                <div className="asterisk">*</div>Last Name:
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-s-12 col-xs-12">
                                <FormControl fullWidth size="small" variant="outlined">
                                    <OutlinedInput
                                        id="outlined-adornment-name"
                                        label=""
                                        type="string"
                                        value={this.state.lastname}
                                        // disabled={isActive ? false : true}
                                        onChange={(e) => this.handleChange(e.target.value, "lastname")}
                                        endAdornment={<InputAdornment position="end"> {this.state.lastname.length}/20</InputAdornment>}
                                        inputProps={{
                                            'aria-label': 'name',
                                            maxLength: 20,
                                        }}
                                        required
                                    />
                                </FormControl>
                                {(this.state.lastNameErr === true || this.state.Err === true) && <FormHelperText style={{ color: "red" }}>Last name is required</FormHelperText>}
                            </div>
                        </div>
                        <div className="row m-4 d-flex justify-content-center">
                            <div className="col-xl-2 col-lg-2 col-md-2 col-s-12 col-xs-12 inputForm">
                                <div className="asterisk">*</div>IC Number/Passport:
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-s-12 col-xs-12">
                                <FormControl fullWidth size="small" variant="outlined">
                                    <OutlinedInput
                                        id="outlined-adornment-name"
                                        label=""
                                        value={this.state.icnumber}
                                        // disabled={isActive ? false : true}
                                        onChange={(e) => this.handleChange(e.target.value, "icnumber")}
                                        endAdornment={<InputAdornment position="end"> {this.state.icnumber.length}/20</InputAdornment>}
                                        inputProps={{
                                            'aria-label': 'name',
                                            maxLength: 20
                                        }}
                                        required
                                    />
                                </FormControl>
                                {(this.state.icnumberErr === true || this.state.Err === true) && <FormHelperText style={{ color: "red" }}>IC/Passport No. is required</FormHelperText>}
                            </div>
                        </div>
                        <div className="row m-4 d-flex justify-content-center">
                            <div className="col-xl-2 col-lg-2 col-md-2 col-s-12 col-xs-12 inputForm">
                                <div className="asterisk">*</div>Contact No:
                            </div>
                            <div className="col-xl-4 col-lg-4 col-md-4 col-s-12 col-xs-12">
                                <FormControl fullWidth size="small" variant="outlined">
                                    <OutlinedInput
                                        id="outlined-adornment-name"
                                        label=""
                                        value={this.state.contactno}
                                        type="number"
                                        // disabled={isActive ? false : true}
                                        onChange={(e) => this.handleChange(e.target.value, "contactno")}
                                        endAdornment={<InputAdornment position="end"> {this.state.contactno.length}/12</InputAdornment>}
                                        inputProps={{
                                            'aria-label': 'name',
                                            maxLength: 12
                                        }}
                                        required
                                    />
                                </FormControl>
                                {(this.state.contactnoErr === true || this.state.Err) === true && <FormHelperText style={{ color: "red" }}>Contact Number is required</FormHelperText>}
                            </div>
                            <div className="col-2"></div>
                        </div>
                        <div className="row m-4 d-flex justify-content-center">
                            <div className="col-xl-2 col-lg-2 col-md-2 col-s-12 col-xs-12 inputForm">
                                <div className="asterisk">*</div>Email:
                            </div>
                            <div className="col-xl-4 col-lg-4 col-md-4 col-s-12 col-xs-12">
                                <FormControl fullWidth size="small" variant="outlined">
                                    <OutlinedInput
                                        id="outlined-adornment-name"
                                        label=""
                                        value={this.state.email}
                                        // disabled={isActive ? false : true}
                                        onChange={(e) => this.handleChange(e.target.value, "email")}
                                        inputProps={{
                                            'aria-label': 'name',
                                        }}
                                        required
                                    />
                                </FormControl>
                                {(this.state.emailErr === true || this.state.Err) === true && <FormHelperText style={{ color: "red" }}>Email is required</FormHelperText>}
                            </div>
                            <div className="col-2"></div>
                        </div>
                        <div className="row m-4 d-flex justify-content-center">
                            <div className="col-xl-2 col-lg-2 col-md-2 col-s-12 col-xs-12 inputForm">
                                <div className="asterisk">*</div>Date of birth:
                            </div>
                            <div className="col-xl-4 col-lg-4 col-md-4 col-s-12 col-xs-12">
                            <FormControl fullWidth size="small" variant="outlined">
                                        <OutlinedInput
                                            id="outlined-adornment-startdate"
                                            type="date"
                                            label=""
                                            value={this.state.DOB}
                                            onChange={(e) => {
                                                this.handleChange(e.target.value,"DOB")
                                                }}
                                        />
                                    </FormControl>
                                {(this.state.DOBErr === true || this.state.Err) === true && <FormHelperText style={{ color: "red" }}>Date of birth is required</FormHelperText>}
                            </div>
                            <div className="col-2"></div>
                        </div>
                        {/* <div className="row m-4 d-flex justify-content-center">
                            <div className="col-xl-2 col-lg-2 col-md-2 col-s-12 col-xs-12 inputForm">
                            <div className="asterisk">*</div>Password:
                            </div>
                            <div className="col-xl-4 col-lg-4 col-md-4 col-s-12 col-xs-12">
                                <div>
                                    <FormControl style={{display:"flex", flexDirection: "row",alignItems: "center"}} fullWidth size="small" variant="outlined">
                                    <OutlinedInput
                                        id="outlined-adornment-name"
                                        label=""
                                        value={this.state.password}
                                        // disabled={isActive ? false : true}
                                        onChange={(e) => this.handleChange(e.target.value,"password")}
                                        endAdornment={<InputAdornment position="end"> {this.state.password.length}/12</InputAdornment>}
                                        inputProps={{
                                            'aria-label': 'name',
                                            maxLength: 12
                                        }}
                                        required
                                    />
                                    <Tooltip style={{marginLeft:"0.5vw"}} title="Password must contained at least one upper case, number and special character" placement="right-end" arrow>
                                        <InfoIcon />
                                    </Tooltip>
                                </FormControl>
                                </div>
                                {(this.state.passwordErr === true || this.state.Err )=== true && <FormHelperText style={{ color: "red" }}>Password is required</FormHelperText>}
                            </div>
                            <div className="col-2"></div>
                        </div>
                        <div className="row m-4 d-flex justify-content-center">
                            <div className="col-xl-2 col-lg-2 col-md-2 col-s-12 col-xs-12 inputForm">
                            <div className="asterisk">*</div>Confirm password:
                            </div>
                            <div className="col-xl-4 col-lg-4 col-md-4 col-s-12 col-xs-12">
                                <FormControl fullWidth size="small" variant="outlined">
                                    <OutlinedInput
                                        id="outlined-adornment-name"
                                        label=""
                                        value={this.state.confirmpassword}
                                        onChange={(e) => this.handleChange(e.target.value,"confirmpassword")}
                                        endAdornment={<InputAdornment position="end"> {this.state.confirmpassword.length}/12</InputAdornment>}
                                        inputProps={{
                                            'aria-label': 'name',
                                            maxLength: 12
                                        }}
                                        required
                                    />
                                </FormControl>
                                {(this.state.confirmpasswordErr === true || this.state.Err || this.state.pwNotMatchErr === true ) && <FormHelperText style={{ color: "red" }}>Password does not match</FormHelperText>}
                            </div>
                            <div className="col-2"></div>
                        </div> */}
                    </div>
                )
            case 1:
                return (
                    <div>
                        <div className="row m-4 d-flex justify-content-center">
                            <div className="col-xl-2 col-lg-2 col-md-2 col-s-12 col-xs-12 inputForm">
                                <div className="asterisk">*</div>Company Name:
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-s-12 col-xs-12">
                                <FormControl fullWidth size="small" variant="outlined">
                                    <OutlinedInput
                                        id="outlined-adornment-name"
                                        label=""
                                        value={this.state.ShopName}
                                        // disabled={isActive ? false : true}
                                        onChange={(e) => this.handleChange(e.target.value, "ShopName")}
                                        endAdornment={<InputAdornment position="end"> {this.state.ShopName.length}/30</InputAdornment>}
                                        inputProps={{
                                            'aria-label': 'name',
                                            maxLength: 30
                                        }}
                                        required
                                    />
                                </FormControl>
                                {(this.state.ShopNameErr === true || this.state.Err) === true && <FormHelperText style={{ color: "red" }}>Company name is required</FormHelperText>}
                            </div>
                        </div>
                        <div className="row m-4 d-flex justify-content-center">
                            <div className="col-xl-2 col-lg-2 col-md-2 col-s-12 col-xs-12 inputForm">
                                Company Description:
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-s-12 col-xs-12">
                                <FormControl fullWidth size="small" variant="outlined">
                                    <OutlinedInput
                                        id="outlined-adornment-name"
                                        label=""
                                        value={this.state.shopdesc}
                                        // disabled={isActive ? false : true}
                                        onChange={(e) => this.handleChange(e.target.value, "shopdesc")}
                                        required
                                    />
                                </FormControl>
                                {/* {(this.state.ShopDescErr === true || this.state.Err) === true && <FormHelperText style={{ color: "red" }}>Company description is required</FormHelperText>} */}
                            </div>
                        </div>
                        {/* <div className="row m-4 d-flex justify-content-center">
                            <div className="col-xl-2 col-lg-2 col-md-2 col-s-12 col-xs-12 inputForm">
                                Website:
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-s-12 col-xs-12">
                                <FormControl fullWidth size="small" variant="outlined">
                                    <OutlinedInput
                                        id="outlined-adornment-name"
                                        label=""
                                        value={this.state.website}
                                        onChange={(e) => this.handleChange(e.target.value, "website")}
                                        inputProps={{
                                            'aria-label': 'name',
                                        }}
                                        required
                                    />
                                </FormControl>
                                </div>
                        </div> */}
                        {/* <div className="row m-4 d-flex justify-content-center">
                            <div className="col-xl-2 col-lg-2 col-md-2 col-s-12 col-xs-12 inputForm">
                                <div className="asterisk">*</div>Address 1:
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-s-12 col-xs-12">
                                <FormControl fullWidth size="small" variant="outlined">
                                    <OutlinedInput
                                        id="outlined-adornment-name"
                                        label=""
                                        value={this.state.address1}
                                        onChange={(e) => this.handleChange(e.target.value, "address1")}
                                        inputProps={{
                                            'aria-label': 'name',
                                        }}
                                        required
                                    />
                                </FormControl>
                                {(this.state.address1Err === true || this.state.Err) === true && <FormHelperText style={{ color: "red" }}>Address is required</FormHelperText>}
                            </div>
                        </div> */}
                        {/* <div className="row m-4 d-flex justify-content-center">
                            <div className="col-xl-2 col-lg-2 col-md-2 col-s-12 col-xs-12 inputForm">
                                Address 2:
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-s-12 col-xs-12">
                                <FormControl fullWidth size="small" variant="outlined">
                                    <OutlinedInput
                                        id="outlined-adornment-name"
                                        label=""
                                        value={this.state.address2}
                                        onChange={(e) => this.handleChange(e.target.value, "address2")}
                                        inputProps={{
                                            'aria-label': 'name',
                                        }}
                                        required
                                    />
                                </FormControl>
                                </div>
                        </div> */}
                        <div className="row m-4 d-flex justify-content-center">
                            <div className="row justify-content-center col-9">
                                <div className="col-xl-4 col-lg-4 col-md-4 col-s-12 col-xs-12">
                                    <div className="col-xl-2 col-lg-2 col-md-2 col-s-12 col-xs-12 d-flex">
                                <div className="asterisk">*</div>State:
                                    </div>
                                    <div className="col-xl-10 col-lg-10 col-md-10 col-s-12 col-xs-12">
                                    <FormControl fullWidth size="small" variant="outlined">
                                        <Select
                                            labelId="search-filter-category"
                                            id="search-filter-category"
                                            label="Search By"
                                            onChange={(e) => this.handleChange(e.target.value, "country")}
                                            size="small"
                                            value={this.state.country}
                                            // IconComponent={FilterListOutlinedIcon}
                                            className="col-11"
                                            placeholder="State"
                                        // options={
                                        //     isArrayNotEmpty(country) && country.map((el, idx) => {
                                        //         return { id: el.StateID, value: el.State, label: el.State }
                                        //     })
                                        // }
                                        >
                                            {
                                                isArrayNotEmpty(this.props.states) && this.props.states.map((el, idx) => {
                                                    return <MenuItem key={el.StateID} value={el.State}>{el.State}</MenuItem>
                                                })
                                            }

                                        </Select>
                                    </FormControl>
                                    {(this.state.countryErr === true || this.state.Err) && <FormHelperText style={{ color: "red" }}>State is required</FormHelperText>}
                                    </div>
                                </div>
                                <div className="col-xl-4 col-lg-4 col-md-4 col-s-12 col-xs-12">
                                    <div className="col-xl-2 col-lg-2 col-md-2 col-s-12 col-xs-12 d-flex">
                                    <div className="asterisk">*</div>City:
                                </div>
                                <div className="col-xl-10 col-lg-10 col-md-10 col-s-12 col-xs-12">
                                    <FormControl fullWidth size="small" variant="outlined">
                                        <Select
                                            labelId="search-filter-category"
                                            id="search-filter-category"
                                            label="Search By"
                                            onChange={(e) => this.handleChange(e.target.value, "city")}
                                            size="small"
                                            value={this.state.city}
                                            className="col-11"
                                            placeholder="City"
                                        // options={
                                        //     isArrayNotEmpty(selectedCity) && selectedCity.map((x) => {
                                        //         return { value: x.City, label: x.City }
                                        //     })
                                        // }
                                        >
                                            {
                                                isArrayNotEmpty(selectedCity[0]) && selectedCity[0].map((data,idx) => {
                                                    return <MenuItem key={idx} value={data.City}>{data.City}</MenuItem>
                                                })
                                            }

                                        </Select>
                                    </FormControl>
                                    {(this.state.cityErr === true || this.state.cityErr) && <FormHelperText style={{ color: "red" }}>City is required</FormHelperText>}
                                </div>
                                </div>
                                <div className="col-xl-4 col-lg-4 col-md-4 col-s-12 col-xs-12">
                                    <div className="col-xl-2 col-lg-2 col-md-2 col-s-12 col-xs-12 d-flex">
                                    <div className="asterisk">*</div>Postcode:
                                </div>
                                <div className="col-xl-10 col-lg-10 col-md-10 col-s-12 col-xs-12">
                                    <FormControl fullWidth size="small" variant="outlined">
                                        <OutlinedInput
                                            id="outlined-adornment-name"
                                            label=""
                                            type="number"
                                            value={this.state.postcode}
                                            onChange={(e) => this.handleChange(e.target.value, "postcode")}
                                            inputProps={{
                                                'aria-label': 'name',
                                            }}
                                            required
                                        />
                                    </FormControl>
                                    {(this.state.postcodeErr === true || this.state.Err) && <FormHelperText style={{ color: "red" }}>Postcode is required</FormHelperText>}
                                </div>
                                </div>
                            </div>
                            
                                
                            </div>
                        </div>
                )
            case 2:
                return (
                    <div className="" style={{ display: "flex", justifyContent: "space-around" }}>
                        Congratulations.You are done!
                    </div>
                )

            default:

        }
    }

    render() {
        return (
            <div>
                <Card>
                    <CardContent>
                        <HorizontalLinearStepper
                            Data={this.state}
                            propsData={this.getProps}
                            data={this.renderCard(1)}>
                        </HorizontalLinearStepper>
                        {/* {this.renderCard()} */}
                    </CardContent>
                </Card>
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterMerchant);