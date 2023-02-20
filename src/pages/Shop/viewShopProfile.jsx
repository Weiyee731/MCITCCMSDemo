// react
import React, { Component } from "react";
import { toast } from "react-toastify";
// third-party
import { Modal, ModalBody } from "reactstrap";

// data stubs
// import { DropzoneArea } from 'material-ui-dropzone'
import Dropzone from "react-dropzone";
import { connect } from "react-redux";
import { GitAction } from "../../store/action/gitAction";
import { Link, matchPath, Redirect, Switch, Route } from "react-router-dom";

import {
    Card,
    Divider,
} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import FormLabel from '@mui/material/FormLabel';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography"
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import axios from "axios";
import { MenuItem } from "@mui/material";
import { isArrayNotEmpty } from "../../tools/Helpers";

import IconButton from "@mui/material/IconButton";
import CancelIcon from '@mui/icons-material/Cancel';
import moment from 'moment';

import { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import CloseIcon from '@mui/icons-material/Close';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Rating from '@mui/material/Rating';

// import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
// import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import Logo from "../../assets/logos/logo.png";

import './viewShopProfile.scss';
import { ignoreElements } from "rxjs/operator/ignoreElements";
import { UpdateDisabled } from "@mui/icons-material";


function mapStateToProps(state) {
    return {
        countrylist: state.counterReducer["countries"],
        merchant: state.counterReducer["merchant"],
        shopUpdated: state.counterReducer["shopUpdated"],
        currentUser: state.counterReducer["currentUser"],
        userProfile: state.counterReducer["userProfile"],
        productsListing: state.counterReducer["productsListing"],
        states: state.counterReducer["states"],
        paymentMethod: state.counterReducer["paymentMethod"],
        merchantUpdateProfile: state.counterReducer["merchantUpdateProfile"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        CallCountry: () => dispatch(GitAction.CallCountry()),
        CallMerchants: (propData) => dispatch(GitAction.CallMerchants(propData)),
        CallUpdateShopDetails: (propData) => dispatch(GitAction.CallUpdateShopDetails(propData)),
        CallClearCurrentUser: () => dispatch(GitAction.CallClearCurrentUser()),
        CallClearShopUpdate: () => dispatch(GitAction.CallClearShopUpdate()),
        CallAllProductsListing: (propData) => dispatch(GitAction.CallAllProductsListing(propData)),
        CallUserProfile: (propData) => dispatch(GitAction.CallUserProfile(propData)),
        CallState: () => dispatch(GitAction.CallState()),
        CallPaymentMethod: (data) => dispatch(GitAction.CallPaymentMethod(data)),
        CallGetUpdateMerchantProfile: (propData) => dispatch(GitAction.CallGetUpdateMerchantProfile(propData)),
    };
}

const group = {

    UserInfo: localStorage.getItem("loginUser") !== null ? JSON.parse(localStorage.getItem("loginUser"))[0] : 0,
    USERID: localStorage.getItem("loginUser") !== null ? JSON.parse(localStorage.getItem("loginUser"))[0].UserID : 0,
    SHOP_PROFILEIMAGE: "",
    SHOP_PROFILEIMAGE_FILE:"",
    SHOP_PROFILEIMAGE_NAME:"",

    SHOP_COVERIMAGE: "",
    SHOP_COVERIMAGE_FILE:"",
    SHOP_COVERIMAGE_NAME:"",

    FIRSTNAME: "",
    LASTNAME: "",
    USERCONTACTNO: "",
    USERDOB: "",
    USEREMAIL: "",
    USERGENDER: "",
    USERNRIC:"",
    SHOPBANK:"",
    SHOPBANKACCOUNTNAME:"",
    SHOPBANKACCOUNTNO:"", 
    SHOPBANKACCOUNTHEADER:"",
    SHOPBANKACCOUNTHEADER_NAME:"",
    SHOPBANKACCOUNTHEADER_FILE:"",

    open: false,
    open1: false,
    showBoxForImage: false,
    fileAdded: false,
    fileAdded2: false,
    fileAdded3: false,
    newFile: false,
    newFile2: false,
    newFile3: false,
    file: "",
    fileInfo: "",
    url: "",
    imageFile: null,
    imageName: null,
    preview: null,

    editContact: false,
    editEmail: false,
    validfirstName: false,
    validlastName: false,
    validDOB: false,
    validGender: false,
    validContact: false,
    validEmail: false,

    type: "MerchantProfile",
    type2: "UserProfile",
    typeValue: localStorage.getItem("loginUser") !== null ? JSON.parse(localStorage.getItem("loginUser"))[0].UserID : 0,
    userRoleID: localStorage.getItem("loginUser") !== null ? JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID : 0,
    productPage: 999,
    page: 1,
    ProjectID: localStorage.getItem("loginUser") !== null ? JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID : 0,

    SHOPNAME: "",
    SHOPDESC: "",
    SHOPCOUNTRYID: 148,
    SHOPPOSCODE: "",
    SHOPSTATE: "",
    SHOPCITY: "",
    shopRating: 0,

}
class EditShopProfile extends Component {
    constructor(props) {
        super(props);

        this.state = group;
        this.uploadHandler = this.uploadHandler.bind(this);
        this.setDetails = this.setDetails.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }


    setDetails(shopDetails) {
        
        this.setState({
            SHOPNAME: shopDetails.ShopName !== undefined ? shopDetails.ShopName : "",
            SHOPDESC: shopDetails.ShopDescription !== undefined ? shopDetails.ShopDescription : "",
            SHOPCOUNTRYID: shopDetails.ShopCountryID !== null ? shopDetails.ShopCountryID : 148,
            SHOPPOSCODE: shopDetails.ShopPoscode !== undefined ? shopDetails.ShopPoscode : "",
            SHOPSTATE: shopDetails.ShopState !== undefined ? shopDetails.ShopState : "",
            SHOPCITY: shopDetails.ShopCity !== undefined ? shopDetails.ShopCity : "",
            SHOPBANK:shopDetails.ShopBank,
            SHOPBANKACCOUNTNAME:shopDetails.ShopBankAccountName,
            SHOPBANKACCOUNTNO:shopDetails.ShopBankAccountNo, 
            SHOPBANKACCOUNTHEADER:shopDetails.ShopBankAccountHeader,
            fileAdded: shopDetails.ShopBankAccountHeader.length > 0 ? true : false,

            SHOP_PROFILEIMAGE: shopDetails.ShopImage,
            fileAdded2: shopDetails.ShopImage.length > 0 ? true : false,

            SHOP_COVERIMAGE: shopDetails.ShopCoverImage,
            fileAdded3: shopDetails.ShopCoverImage !== null && shopDetails.ShopCoverImage.length > 0 ? true: false,
        })
        
    }

    getDate = (d) => {
        const dob_Date = d && Number(d.replace(/\D/g, ""))
        
        const convertDate = new Date(dob_Date)

        return convertDate
    }

    setProfileDetails(data){
        this.setState({
            FIRSTNAME: data.FirstName,
            LASTNAME: data.LastName,
            USERCONTACTNO: data.UserContactNo,
            USERDOB: this.getDate(data.UserDOB),
            USEREMAIL: data.UserEmailAddress1,
            USERGENDER: data.UserGender,
            USERNRIC:data.UserNRIC
        })
    }

    componentDidMount() {

        if (this.state.USERID !== undefined && this.state.USERID !== null && this.state.typeValue !== undefined) {

            const userProfile = {
                TYPE: this.state.type2,
                TYPEVALUE: this.state.typeValue,
                USERID: this.state.USERID,
                USERROLEID: this.state.userRoleID,
                LISTPERPAGE: this.state.productPage,
                PAGE: this.state.page,
                PROJECTID: this.state.ProjectID,
            }
          
            this.props.CallMerchants(this.state);
            this.props.CallUserProfile(userProfile);
            this.props.CallCountry();
            this.props.CallState();
            this.props.CallPaymentMethod();

            this.props.CallAllProductsListing({
                type: "Merchant",
                typeValue: localStorage.getItem("loginUser") !== null ? 0 : JSON.parse(localStorage.getItem("loginUser"))[0].UserID,
                userId: localStorage.getItem("loginUser") !== null ? 0 : JSON.parse(localStorage.getItem("loginUser"))[0].UserID,
                productPage: 999,
                page: 1,
                ProjectID: localStorage.getItem("loginUser") !== null !== null ? JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID : 0,

            })
            if (this.props.merchant !== null) {
                let shopDetails = this.props.merchant[0];
                if (shopDetails !== undefined) {
                    this.setDetails(shopDetails)
                }
            }
            let ratingCount = []
            if (this.props.productsListing !== null && this.props.productsListing.length > 0) {
                this.props.productsListing.map((X) => {
                    ratingCount.push(X.ProductRating)
                })
            }
            this.setState({ shopRating: parseFloat(ratingCount.reduce((subtotal, item) => subtotal + item, 0) / ratingCount.length).toFixed(2) })

        } else {
            // browserHistory.push("/login");
            // window.location.reload(false);
        }

        if(this.props.merchant.lenght > 0){
            this.props.merchant((x)=>this.setState({SHOPSTATE:x.ShopState}))
        }
    }
    componentDidUpdate(prevProps) {

        if (prevProps.shopUpdated !== this.props.shopUpdated) {
            // browserHistory.push("/");
            // delete this.state;

            // this.setState(group);

            // clearImmediate(this.props.merchant);
            // window.location.reload(false);
        }
        if (this.props.shopUpdated !== undefined && this.props.shopUpdated.length > 0 && prevProps.shopUpdated !== this.props.shopUpdated) {
            this.props.CallMerchants(this.state);
            // this.props.CallClearShopUpdate()

            if (this.props.merchant !== null) {
                let shopDetails = this.props.merchant[0];
                if (shopDetails !== undefined) {
                    this.setDetails(shopDetails)
                }
            }
        }

        if (this.props.currentUser.length > 0) {
            this.props.CallMerchants(this.state);
            this.props.CallClearCurrentUser()
            this.modalClose()
        }

        if(prevProps.userProfile !== this.props.userProfile){
            let data = this.props.userProfile[0]
            this.setProfileDetails(data)
        }

        
        if(prevProps.merchant !== this.props.merchant){
            let data = this.props.userProfile[0]
            let shopDetails = this.props.merchant[0];
            if (shopDetails !== undefined) {
                this.setDetails(shopDetails)
            }
        }

     
    }


    /////////////////////UPLOAD PROFILE PHOTO/////////////////////////////////////////////////
    onFileUpload = (type) => {

        const formData = new FormData();

        let fileExt = "";
        let imageName = "";
        let targetFolder = "";
        let upload = ""

        switch(type){
            case 'shopBank_Header':
                fileExt = this.state.SHOPBANKACCOUNTHEADER_FILE.length > 0 ? this.state.SHOPBANKACCOUNTHEADER_FILE.map((imagedetails) =>
                imagedetails.name.split('.').pop()): null;
                imageName = new Date().valueOf() ;
                targetFolder = "userbank" ;
                upload = this.state.SHOPBANKACCOUNTHEADER_FILE[0]

                break;

            case 'shopBank_Profile':
                fileExt = this.state.SHOP_PROFILEIMAGE_FILE.length > 0 ? this.state.SHOP_PROFILEIMAGE_FILE.map((imagedetails) =>
                imagedetails.name.split('.').pop()): null;
                imageName = new Date().valueOf() ;
                targetFolder = "shopProfile" ;
                upload = this.state.SHOP_PROFILEIMAGE_FILE[0]
            
            case 'default':
                break;
            }
        

        formData.append("ID", JSON.parse(localStorage.getItem("loginUser"))[0].UserID);
        formData.append("targetFolder", targetFolder);
        formData.append("projectDomain", localStorage.getItem("projectDomain"));
        formData.append("upload[]", upload );
        formData.append("imageName[]", imageName);

        let uploadImageURL = "https://" + localStorage.getItem("projectURL") + "/eCommerceCMSImage/uploadImages.php"

        const updateData = {
            USERID: this.state.USERID,
            FIRSTNAME: this.state.FIRSTNAME,
            LASTNAME: this.state.LASTNAME,
            USEREMAIL: this.state.USEREMAIL,
            USERGENDER: this.state.USERGENDER,
            USERCONTACTNO: this.state.USERCONTACTNO,
            USERDOB: moment(new Date(this.state.USERDOB)).format('YYYYMMDD'),
            USERNRIC: this.state.USERNRIC,
            SHOPBANK: this.state.SHOPBANK,
            SHOPBANKACCOUNTNAME: this.state.SHOPBANKACCOUNTNAME,
            SHOPBANKACCOUNTNO: this.state.SHOPBANKACCOUNTNO,
            SHOPBANKACCOUNTHEADER: this.state.fileAdded === true && this.state.newFile === true ? imageName + "." + fileExt : this.state.SHOPBANKACCOUNTHEADER.split("/").pop(),
        }

        const update_ShopProfile = {
            USERID: this.state.USERID,
            SHOPNAME: this.state.SHOPNAME,
            SHOPDESC: this.state.SHOPDESC,
            SHOPPOSCODE: this.state.SHOPPOSCODE,
            SHOPCITY:this.state.SHOPCITY,
            SHOPSTATE: this.state.SHOPSTATE,
            SHOPCOUNTRYID: this.state.SHOPCOUNTRYID,
            SHOPIMAGE: this.state.fileAdded2 === true && this.state.newFile2 ? imageName + "." + fileExt : this.state.SHOP_PROFILEIMAGE.split("/").pop(),
            SHOPCOVERIMAGE: this.state.fileAdded3 === true && this.state.newFile3 === true ? imageName + "." + fileExt : this.state.SHOP_COVERIMAGE.split("/").pop(),
        }

        if(type === 'shopBank_Header'){
            if(this.state.fileAdded === true && this.state.newFile === true){
                axios.post(
                    uploadImageURL,
                    formData
                )
                .then((res) => {
                    if (res.status === 200) {
                        this.props.CallGetUpdateMerchantProfile(updateData)
                    }
                });
            }
    
            else if(this.state.fileAdded === true && this.state.newFile === false) {
                this.props.CallGetUpdateMerchantProfile(updateData)
            }
        }

        else if(type === 'shopBank_Profile'){
            if(this.state.fileAdded2 === true && this.state.newFile2 === true){
                axios.post(
                    uploadImageURL,
                    formData
                )
                .then((res) => {
                    if (res.status === 200) {
                       console.log('profile image changed!', update_ShopProfile)
                       this.props.CallUpdateShopDetails(update_ShopProfile)
                    }
                });
            }
            else if(this.state.fileAdded3 === true && this.state.newFile3 === true) {
                console.log('cover image changed!', update_ShopProfile)
            }

            else{
                this.props.CallUpdateShopDetails(update_ShopProfile)
                console.log('sss')
            }
        }
    };

    ///////////////////////////DELETE PHOTO SELECTED////////////////////////////////
    removeFile() {
        this.setState({
            fileAdded: false,
        });
        const index = this.state.imageFile.indexOf(0);
        const files = this.state.imageFile.slice(0);
        files.splice(index, 1);
    }

    /////////////////////HANDLE OPEN OR CLOSE TABLE//////////////////////////////////////////
    setOpenTable(status) {
        if (status == false) {
            this.setState({ open: false });
        } else {
            this.setState({ open: true });
        }
    }

    ////////////////////////HANDLE OPEN OR CLOSE DROPZONE////////////////////////////////////////////
    modalOpen() {
        this.setState({ showBoxForImage: true });
    }
    modalClose() {
        this.setState({ showBoxForImage: false });
    }

    //////////////////////GET INPUT FROM USER///////////////////////////////////////////////////////////

    handleChange(data, e) {

       switch(data){
        case 'FIRSTNAME':
            this.setState({FIRSTNAME: e.target.value})
            break;
        
        case 'LASTNAME' :
            this.setState({LASTNAME: e.target.value})
            break;
        
        case 'NRIC' :
            this.setState({USERNRIC: e.target.value})
            break;

        case 'GENDER' :
            console.log('s', e.target.value)
            this.setState({USERGENDER: e.target.value})
            break;

        case 'CONTACTNO' :
            this.setState({USERCONTACTNO: e.target.value})
            break;

        case 'EMAIL' :
            this.setState({USEREMAIL: e.target.value})
            break;
        
        case 'SHOPBANK':
            console.log('value shopbank', e.target.value)
            this.setState({SHOPBANK: e.target.value})
            break;
        
        case 'SHOPBANKNAME' :
            this.setState({SHOPBANKACCOUNTNAME: e.target.value})
            break;

        case 'SHOPBANKACCOUNTNO':
            this.setState({SHOPBANKACCOUNTNO: e.target.value})
            break;

        case 'SHOPNAME' :
            this.setState({SHOPNAME: e.target.value})
            break;
        
        case 'SHOPDESC':
            this.setState({SHOPDESC: e.target.value})
            break;

        case 'SHOPSTATE' :
            this.setState({SHOPSTATE: e.target.value})
            break;
        
        case 'SHOPCITY' :
            this.setState({SHOPCITY: e.target.value})
            break;

        case 'POSCODE' :
            this.setState({SHOPPOSCODE: e.target.value})
            break;

        case 'default':
            break;
            

       }
    }

    uploadHandler(e) {
        this.setState({ file: e });
    }

    opennewtab(url) {
        window.open(url, '_blank');
    }

    render() {

        const merchantDetails = this.props.merchant.length > 0 &&
            this.props.merchant[0].ReturnVal === undefined && this.props.merchant[0];

        const getUploadParams = () => {
            return { url: "http://pmappapi.com/Memo/uploads/uploads/" };
        };

        const handleChangeStatus = ({ meta }, status) => {
            console.log('ss', status, meta);
        };

        const handleSubmit = (files, allFiles) => {
            allFiles.forEach((f) => f.remove());
        };
        const selectedCity = this.props.states.filter((x) => x.State === this.state.SHOPSTATE).map((y) => JSON.parse(y.CityDetail))
        let bankName = this.props.paymentMethod.filter((x) => x.PaymentMethodType === "Direct Bank").map((y) => JSON.parse(y.PaymentMethod))

     

        const imgURL = "https://" + localStorage.getItem("projectURL") + "/eCommerceCMSImage/userbank/" + JSON.parse(localStorage.getItem("loginUser"))[0].UserID + "/"

        return (
            <div className="MainContainer" style={{ flex: 1 }}>
                <Card>
                    <CardContent>
                        <div className="row" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', margin: '4%' }}>
                            <div className="col m-auto">
                                <div
                                    style={{
                                        textAlign: "left",
                                        fontWeight: 800,
                                        marginBottom: '4%',
                                    }}
                                >
                                    <h3> Shop Profile </h3>

                                </div>

                                <div className="font font-subtitle">
                                    Manage your shop information
                                </div>

                            </div>
                            <div className="col p-4 shop_Box" >
                                <Typography variant="body1" >Shop Review Count</Typography>
                                <div className="mt-3" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <Typography variant="h4">{merchantDetails.ShopReviewCount}</Typography>
                                </div>
                            </div>
                            <div className="col p-4 shop_Box">
                                <Typography variant="body1"  >Shop Rating</Typography>
                                <div className="mt-3" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <Rating name="read-only" value={merchantDetails.ShopRating} readOnly size="large"></Rating>
                                </div>
                            </div>
                            <div className="col p-4 shop_Box" >
                                <Typography variant="body1" >Total Product</Typography>
                                <div className="mt-3" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <Typography variant="h4">{merchantDetails.MerchantTotalProduct}</Typography>
                                </div>
                            </div>

                        </div>
                        <Divider variant="fullWidth" className="dividerbottom" />

                        <div className="row" style={{ marginTop: '5%', marginBottom: '5%' }}>
                            <div className="col-4 col-md-4 col-lg-4 ">
                                <div className="container" style={{marginBottom:'3%'}}>
                                <div className="row" >
                                    <div >
                                        <Typography variant='caption'>Profile Information</Typography>
                                    </div>
                                    
                                    <div >
                                        <Typography variant="subtitle2">Last Joined {merchantDetails.LastJoined} </Typography>
                                    </div>
                                    
                                    </div>
                                </div>
                          
                                <div className="row" style={{ display:'flex', flexDirection:'row', justifyContent:'center', alignItem:'center' }}>

                                    <div onClick={() => this.modalOpen()} style={{width:'150px', height:'auto', }}>
                                        <img
                                            className="profilePic"
                                            src={this.state.SHOP_PROFILEIMAGE}
                                            alt="Profile"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src =
                                                    "https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-512.png";
                                            }}
                                        />
                                        <div className="overlay">Edit</div>
                                    </div>
                                </div>
                                <div className="description row d-flex justify-content-center ml-4 mr-2"><br /> Click on the image above to edit profile picture</div>


                                {this.props.userProfile && this.props.userProfile.map((userData) => (
                                    <div>
                                        <div className="col mt-4" style={{ display: 'flex', flexDirection: 'row' }}>
                                            <div className="col-6 m-1">
                                                <TextField
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    label="First Name"
                                                    id="firstName"
                                                    value={this.state.FIRSTNAME === null ? '-' : this.state.FIRSTNAME}
                                                    onChange={(e) => this.handleChange('FIRSTNAME', e)}
                                                />
                                            </div>
                                            <div className="col-6 m-1">
                                                <TextField
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    label="Last Name"
                                                    id="lastName"
                                                    value={this.state.LASTNAME  === null ? '-' : this.state.LASTNAME}
                                                    onChange={(e) => this.handleChange('LASTNAME', e)}
                                                />
                                            </div>
                                        </div>

                                <div className="col mt-4" style={{display:'flex', flexDirection:'row'}}>
                                    <div className="col-6 m-1">
                                        <FormControl>
                                            <FormLabel id="demo-controlled-radio-buttons-group">Gender</FormLabel>
                                            <RadioGroup
                                                aria-labelledby="demo-controlled-radio-buttons-group"
                                                name="controlled-radio-buttons-group"
                                                value={this.state.USERGENDER}
                                                onChange={(e) => this.handleChange('GENDER', e)}
                                            >
                                                <FormControlLabel value="Female" control={<Radio />} label="Female" checked={this.state.USERGENDER === 'Female'}/>
                                                <FormControlLabel value="Male" control={<Radio />} label="Male" checked={this.state.USERGENDER === 'Male'}/>
                                            </RadioGroup>
                                        </FormControl>
                                    </div>
                                    <div className="col-6 m-1" style={{display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
       
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label="Date of Birth"
                                            value={this.state.USERDOB}
                                            onChange={(newValue) => {
                                            this.setState({USERDOB: newValue});
                                            }}
                                            renderInput={(params) => <TextField {...params} />}
                                        />
                                        </LocalizationProvider>

                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            label="NRIC"
                                            id="nric"
                                            value={this.state.USERNRIC === null ? '-' : this.state.USERNRIC}
                                            onChange={(e) => this.handleChange('NRIC', e)}
                                        />
                                    </div>
                                </div>

                                <div className="col mt-4" style={{display:'flex', flexDirection:'row'}}>
                                <div className="col-6 m-1">
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            label="Contact No"
                                            id="contactNo"
                                            value={this.state.USERCONTACTNO === null ? '-' : this.state.USERCONTACTNO}
                                            onChange={(e) => this.handleChange('CONTACTNO', e)}
                                        />
                                    </div>
                                    <div className="col-6 m-1">
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            label="Email"
                                            id="email"
                                            value={this.state.USEREMAIL === null ? '-' : this.state.USEREMAIL}
                                            onChange={(e) => this.handleChange('EMAIL', e)}
                                        />
                                    </div>
                                </div>
                        </div>

                        ))}
                                                        
                            </div>

                            <div className="col-4 col-md-4 col-lg-4 border-line-right">
                            <div className="container" style={{display:'flex', flexDirection:'row', justifyContent:"flex-end", marginTop:0}} onClick={() => this.onFileUpload('shopBank_Header')}>
                                        <Button variant="contained" color="primary">Update Profile Info</Button>
                                    </div>
                          
                                {this.props.merchant && this.props.merchant.length > 0 && this.props.merchant[0] !== null &&
                                    this.props.merchant.map((row) => (
                                        <div className="container" key={row.ShopName}>
                                            <div className="row" >
                                                <div className="col mt-4">
                                                <FormControl fullWidth>
                                                    <InputLabel id="demo-simple-select-label">Shop Bank</InputLabel>
                                                    <Select
                                                        id="Shop Bank"
                                                        label="Shop Bank"
                                                        variant="outlined"
                                                        defaultValue={row.ShopBank}
                                                        size="small"
                                                        onChange={(e) => this.handleChange('SHOPBANK', e)}
                                                    >
                                                        {
                                            isArrayNotEmpty(bankName) && bankName[0].map((el, idx) => {
                                                return <MenuItem key={el.PaymentMethodID} value={el.BankName}>{el.BankName}</MenuItem>
                                            })
                                        }
                                                    </Select>
                                                </FormControl>
                                                  
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col mt-4">
                                                    <TextField
                                                        className="font"
                                                        variant="outlined"
                                                        multiline
                                                        maxRows={5}
                                                        size="small"
                                                        label="Bank Account Name"
                                                        id="bankAccName"
                                                        value={this.state.SHOPBANKACCOUNTNAME === null ? 'None' : this.state.SHOPBANKACCOUNTNAME}
                                                        onChange={(e) => this.handleChange('SHOPBANKNAME', e)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col mt-4">
                                                    <TextField
                                                        className="font"
                                                        variant="outlined"
                                                        multiline
                                                        maxRows={5}
                                                        size="small"
                                                        label="Bank Account Number"
                                                        id="bankAccNo"
                                                        value={this.state.SHOPBANKACCOUNTNO === null ? 'None' : this.state.SHOPBANKACCOUNTNO }
                                                        onChange={(e) => this.handleChange('SHOPBANKACCOUNTNO', e)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col mt-4" >

                                                    {this.state.fileAdded === true ? (
                                                        <div style={{border:'2px solid #E1DCDC', borderStyle:'dashed'}}>
                                                        <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-end', padding:'2%'}}>
                                                            <IconButton onClick={() =>  this.removeFile()}>
                                                                <CancelIcon color="error" />
                                                            </IconButton>
                                                        </div>
                                                        <div className="droppedFileImage" style={{padding:'2%'}}>
                                                            <img src={this.state.SHOPBANKACCOUNTHEADER} alt={this.state.bankHeaderStatement} style={{width:'100%'}} />
                                                        </div>
                                     
                                                        </div>
                                                    ) : (
                                                        <Dropzone
                                                        style={{ width: "100%"}}
                                                        onDrop={(acceptedFiles) => {
                                                            if (acceptedFiles.length > 0) {
                                                                this.setState({
                                                                    SHOPBANKACCOUNTHEADER: acceptedFiles.map(file => URL.createObjectURL(file)),
                                                                    SHOPBANKACCOUNTHEADER_NAME: acceptedFiles[0].name,
                                                                    fileAdded: true,
                                                                    SHOPBANKACCOUNTHEADER_FILE: acceptedFiles,
                                                                    newFile: true,
                                                                });
                                                                return;
                                                            } else {
                                                                this.setState({
                                                                    imageName: "",
                                                                    fileAdded: false,
                                                                    fileUpload: [],
                                                                    newFile: false,
                                                                });
                                                            }
                                                        }}
                                                        accept="image/*"
                                                        maxFiles={1}
                                                        multiple={false}
                                                        getUploadParams={getUploadParams}
                                                        onChangeStatus={handleChangeStatus}
                                                        // onSubmit={handleSubmit}
                                                    >
                                                        {({
                                                            getRootProps,
                                                            getInputProps,
                                                            isDragActive,
                                                            isDragAccept,
                                                            isDragReject,
                                                        }) => (
                                                            <section>
                                                                <div
                                                                    {...getRootProps({
                                                                        className: "dropzone",
                                                                    })}
                                                          
                                                                    style={{
                                                                        width:'100%',
                                                                        borderColor: isDragActive
                                                                            ? isDragReject
                                                                                ? "#fc5447"
                                                                                : "#a0d100"
                                                                            : "#b8b8b8",
                                                                        color: isDragActive
                                                                            ? isDragReject
                                                                                ? "#a31702"
                                                                                : "#507500"
                                                                            : "#828282",
                                                                    }}
                                                                >
                                                                    <input {...getInputProps()} />
                                                                    <div className="preview-word" >
                                                                        {!isDragActive && "Upload Bank Statement Header"}
                                                                        {isDragActive &&
                                                                            !isDragReject &&
                                                                            "Upload Bank Statement Header ..."}
                                                                    </div>
                                                                </div>
                                                            </section>
                                                        )}
                                                    </Dropzone>
                                                    )}

                                                    
                                                </div></div>
                                            <br />
                                        </div>
                                    ))}

                                    
                            </div>


                            <div className="col-4 col-md-4 col-lg-4">
                            <div className="container">
                                <div style={{display:'flex', flexDirection:"row", justifyContent:'space-between'}}>
                                    <div style={{marginTop:'auto', marginBottom:'auto'}}>
                                        <Typography variant='caption' >Shop Information</Typography>
                                    </div>
                             
                                    <div style={{display:'flex', flexDirection:"row", justifyContent:'flex-end'}} onClick={() => this.onFileUpload('shopBank_Profile')}>
                                        <Button color="primary" variant="contained" >Update Shop Info</Button>
                                    </div>
                                </div>
                                </div>
                                {this.props.merchant && this.props.merchant.length > 0 && this.props.merchant[0] !== null &&
                                    this.props.merchant.map((row) => (
                                        <div className="container" key={row.ShopName}>
                                            <div className="row" >
                                                <div className="col mt-4">
                                                    <TextField
                                                        className="font"
                                                        variant="outlined"
                                                        size="small"
                                                        label="Shop Name"
                                                        id="shopName"
                                                        value={this.state.SHOPNAME}
                                                        onChange={(e) => this.handleChange('SHOPNAME', e)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col mt-4">
                                                    <TextField
                                                        className="font"
                                                        variant="outlined"
                                                        multiline
                                                        maxRows={5}
                                                        label="Shop Description"
                                                        size="small"
                                                        id="shopDesc"
                                                        value={this.state.SHOPDESC}
                                                        onChange={(e) => this.handleChange('SHOPDESC', e)}
                                                    />
                                                </div>
                                            </div>
                                            <br />
                                            <div className="row">
                                                <div className="col">
                                                    <FormControl
                                                        fullWidth
                                                    >
                                                         <InputLabel id="demo-simple-select-label">Country</InputLabel>
                                                        <Select
                                                            id="Country"
                                                            variant="outlined"
                                                            value={this.state.SHOPCOUNTRYID}
                                                            label="Country"
                                                            size="small"
                                                            onChange={(e)=>(this.setState({SHOPCOUNTRYID: e.target.value }))}
                                                        >
                                                            {this.props.countrylist.map((country) => (
                                                                <option
                                                                    value={country.CountryId}
                                                                    key={country.CountryId}
                                                                >
                                                                    {country.CountryName}
                                                                </option>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </div>
                                            </div>
                                            <div className="row" >
                                                <div className="col mt-4 ">
                                                    <TextField
                                                        className="font"
                                                        variant="outlined"
                                                        size="small"
                                                        id="shopState"
                                                        label="State"
                                                        value={this.state.SHOPSTATE}
                                                        onChange={(e) => this.handleChange('SHOPSTATE', e)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row" >
                                                <div className="col mt-4 ">
                                                    <TextField
                                                        className="font"
                                                        variant="outlined"
                                                        size="small"
                                                        label="City"
                                                        id="City"
                                                        value={this.state.SHOPCITY}
                                                        onChange={(e) => this.handleChange('SHOPCITY', e)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row" >
                                                <div className="col mt-4 ">
                                                    <TextField
                                                        className="font"
                                                        variant="outlined"
                                                        size="small"
                                                        id="Poscode"
                                                        label="Poscode"
                                                        value={this.state.SHOPPOSCODE}
                                                        onChange={(e) => this.handleChange('POSCODE', e)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    
                             
                                  
                            </div>

                        </div>
                    </CardContent>

                    <div
                        style={{
                            textAlign: "center",
                            padding: "inherit",
                        }}
                    >
                        <Modal
                            className="modal-dialog-centered"
                            isOpen={this.state.showBoxForImage}
                            toggle={() => this.modalClose()}
                        >
                            <ModalBody>
                                <CloseIcon
                                    className="closeIcon"
                                    onClick={() => this.modalClose()}
                                    data-dismiss="modal" />
                                <div
                                    align="center"
                                    className="form-content p-2"
                                >
                                    <div>
                                       
                                        <Dropzone
                                            style={{ width: "150vw", height: "60vh" }}
                                            onDrop={(acceptedFiles) => {
                                    
                                                if (acceptedFiles.length > 0) {
                                                    this.setState({
                                                        SHOP_PROFILEIMAGE: acceptedFiles.map(file => URL.createObjectURL(file)),
                                                        SHOP_PROFILEIMAGE_NAME: acceptedFiles[0].name,
                                                        fileAdded2: true,
                                                        newFile2: true,
                                                        SHOP_PROFILEIMAGE_FILE: acceptedFiles,
                                                    });
                                                    return;
                                                } else {
                                                    this.setState({
                                                        SHOP_PROFILEIMAGE: "",
                                                        fileAdded2: false,
                                                        newFile2: false
                                                    });
                                                }
                                            }}
                                            accept="image/*"
                                            maxFiles={1}
                                            multiple={false}
                                            getUploadParams={getUploadParams}
                                            onChangeStatus={handleChangeStatus}
                                            onSubmit={handleSubmit}
                                        >
                                            {({
                                                getRootProps,
                                                getInputProps,
                                                isDragActive,
                                                isDragAccept,
                                                isDragReject,
                                            }) => (
                                                <section>
                                                    <div
                                                        {...getRootProps({
                                                            className: "dropzone",
                                                        })}
                                                        className="preview-container"
                                                        style={{
                                                            borderColor: isDragActive
                                                                ? isDragReject
                                                                    ? "#fc5447"
                                                                    : "#a0d100"
                                                                : "#b8b8b8",
                                                            color: isDragActive
                                                                ? isDragReject
                                                                    ? "#a31702"
                                                                    : "#507500"
                                                                : "#828282",
                                                        }}
                                                    >
                                                        <input {...getInputProps()} />
                                                        {this.state.fileAdded2 ? (
                                                            <div className="droppedFileImage" style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
                                                                <img className="profilePic" src={this.state.SHOP_PROFILEIMAGE} alt={this.state.SHOP_PROFILEIMAGE} />
                                                            </div>
                                                        ) : (
                                                            <div className="preview-word">
                                                                {!isDragActive && "Drop a file"}
                                                                {isDragActive &&
                                                                    !isDragReject &&
                                                                    "Drop the file here ..."}
                                                            </div>
                                                        )}
                                                    </div>
                                                </section>
                                            )}
                                        </Dropzone>
                                    </div>
                                    <div className="row justify-content-center">
                                        <div className="col-6">
                                            {this.state.fileAdded2 && (
                                                <div >
                                                    <Button variant="contained" color="secondary" onClick={() => this.removeFile()}>
                                                        Remove File
                                                    </Button>
                                                </div>
                                            )}
                                        </div>

                                        {this.state.fileAdded2 ? (
                                            <div className="col-6">
                                                <Button variant="contained" color="primary" onClick={() => this.onFileUpload('shopBank_Profile')}>
                                                        Upload Image
                                                </Button>
                                            
                                            </div>
                                        ) : (
                                            <div style={{ textAlign: "center", color: "grey" }}><div>Click on the box to add or edit the photo</div></div>
                                        )}

                                    </div>
                                </div>
                            </ModalBody>
                        </Modal>
                    </div>
                </Card>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditShopProfile);
