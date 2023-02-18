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

// import moment from 'moment';

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
    };
}

function mapDispatchToProps(dispatch) {
    return {
        CallCountry: () => dispatch(GitAction.CallCountry()),
        CallUpdateProfileImage: (propsData) => dispatch(GitAction.CallUpdateProfileImage(propsData)),
        CallMerchants: (propData) => dispatch(GitAction.CallMerchants(propData)),
        CallUpdateShopDetail: (propData) => dispatch(GitAction.CallUpdateShopDetail(propData)),
        CallClearCurrentUser: () => dispatch(GitAction.CallClearCurrentUser()),
        CallClearShopUpdate: () => dispatch(GitAction.CallClearShopUpdate()),
        CallAllProductsListing: (propData) => dispatch(GitAction.CallAllProductsListing(propData)),
        CallUserProfile: (propData) => dispatch(GitAction.CallUserProfile(propData)),
        CallState: () => dispatch(GitAction.CallState()),
        CallPaymentMethod: (data) => dispatch(GitAction.CallPaymentMethod(data)),
    };
}

const group = {

    UserInfo: localStorage.getItem("loginUser") !== null ? JSON.parse(localStorage.getItem("loginUser"))[0] : 0,
    USERID: localStorage.getItem("loginUser") !== null ? JSON.parse(localStorage.getItem("loginUser"))[0].UserID : 0,
    USERFIRSTNAME: "",
    USERLASTNAME: "",
    USERCONTACTNO: "",
    USERDATEBIRTH: "",
    USEREMAIL: "",
    USERGENDER: "",
    open: false,
    open1: false,
    showBoxForImage: false,
    fileAdded: false,
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
        // this.handleChange = this.handleChange.bind(this);
        this.uploadHandler = this.uploadHandler.bind(this);
        this.setDetails = this.setDetails.bind(this);
    }


    setDetails(shopDetails) {
        this.setState({
            SHOPNAME: shopDetails.ShopName !== undefined ? shopDetails.ShopName : "",
            SHOPDESC: shopDetails.ShopDescription !== undefined ? shopDetails.ShopDescription : "",
            SHOPCOUNTRYID: shopDetails.ShopCountryID !== null ? shopDetails.ShopCountryID : 148,
            SHOPPOSCODE: shopDetails.ShopPoscode !== undefined ? shopDetails.ShopPoscode : "",
            SHOPSTATE: shopDetails.ShopState !== undefined ? shopDetails.ShopState : "",
            SHOPCITY: shopDetails.ShopCity !== undefined ? shopDetails.ShopCity : "",
        })
    }

    componentDidMount() {

        if (this.state.USERID !== undefined && this.state.USERID !== null && this.state.typeValue !== undefined) {
            this.props.CallMerchants(this.state);
            this.props.CallUserProfile(this.state);
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
        if (this.props.shopUpdated !== undefined && this.props.shopUpdated.length > 0) {
            this.props.CallMerchants(this.state);
            this.props.CallClearShopUpdate()

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

    }
    // componentWillUnmount(){ 
    //   this.setState(group); 
    //   window.location.reload(false);
    // }


    /////////////////////UPLOAD PROFILE PHOTO/////////////////////////////////////////////////
    onFileUpload = () => {
        const formData = new FormData();

        let imageName = new Date().valueOf();
        let fileExt = this.state.imageFile.map((imagedetails) =>
            imagedetails.name.split('.').pop());

        let FullImageName = JSON.stringify(imageName) + "." + fileExt;

        formData.append("ID", JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID);
        formData.append("targetFolder", "shopProfile");
        formData.append("projectDomain", localStorage.getItem("projectDomain"));
        formData.append("upload[]", this.state.imageFile[0]);
        formData.append("imageName[]", imageName);

        // formData.append("imageFile", this.state.imageFile[0]);
        // formData.append("imageName", imageName);

        let file = {
            USERID: localStorage.getItem("loginUser") !== null && JSON.parse(localStorage.getItem("loginUser"))[0].UserID,
            USERPROFILEIMAGE: FullImageName,
            TYPE: "SHOPIMAGE",
        };

        let imageURL = "https://" + localStorage.getItem("projectURL") + "/eCommerceCMSImage/uploadImages.php"

        axios
            .post(
                // "https://" + localStorage.getItem("projectDomain") + "/emporiaimage/uploaduserprofilepicture.php",
                //  "https://" + localStorage.getItem("projectDomain") + "/images/uploadproductImages.php"
                imageURL,
                formData,
                {}
            )
            .then((res) => {
                if (res.status === 200) {
                    this.props.CallUpdateProfileImage(file);

                }
            });
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
    handleChangeforShopName = (e) => {
        var { value } = e.target;
        var chars = { ' ': '%20', '\n': 'C285' };
        // value = value.replace(/ /g , "%20","C285");
        value = value.replace(/[ ]/g, m => chars[m]);
        if (value !== null) {
            value = value.replace(/ /g, "%20");
            this.setState({
                SHOPNAME: value,
            });
        } else {
        }
    };

    handleChangeforSHOPDESC = (e) => {
        var { value } = e.target;
        var chars = { ' ': '%20', '\n': 'C285' };
        // value = value.replace(/ /g , "%20","C285");
        value = value.replace(/[ ]/g, m => chars[m]);
        if (value !== null) {
            this.setState({
                SHOPDESC: value
            });
        } else {
        }
    };

    handleChange(data, e) {
        if (data === "SHOPPOSCODE") {
            this.setState({
                SHOPPOSCODE: e.target.value,
            });
        } else if (data === "SHOPSTATE") {
            this.setState({
                SHOPSTATE: e.target.value,
            });
        } else if (data === "SHOPCOUNTRYID") {
            this.setState({
                SHOPCOUNTRYID: e.target.value,
            });
        } else if (data === "SHOPCITY") {
            this.setState({
                SHOPCITY: e.target.value,
            });
        } else {
        }
    }

    updateShop() {
        let data = this.props.merchant

        this.props.CallUpdateShopDetail({

            USERID: this.state.USERID === "" || this.state.USERID === undefined ? data[0].UserID : this.state.USERID,
            SHOPNAME: this.state.SHOPNAME === "" || this.state.SHOPNAME === undefined ? data[0].ShopName : this.state.SHOPNAME,
            SHOPDESC: this.state.SHOPDESC === "" || this.state.SHOPDESC === undefined ? data[0].ShopDescription : this.state.SHOPDESC,
            SHOPPOSCODE: this.state.SHOPPOSCODE === "" || this.state.SHOPPOSCODE === undefined ? data[0].ShopPoscode : this.state.SHOPPOSCODE,
            SHOPCITY: this.state.SHOPCITY === "" || this.state.SHOPCITY === undefined ? data[0].ShopCity : this.state.SHOPCITY,
            SHOPSTATE: this.state.SHOPSTATE === "" || this.state.SHOPSTATE === undefined ? data[0].ShopState : this.state.SHOPSTATE,
            SHOPCOUNTRYID: this.state.SHOPCOUNTRYID === "" || this.state.SHOPCOUNTRYID === undefined ? data[0].ShopCountryID : this.state.SHOPCOUNTRYID
        });
        toast.success("Shop profile is updated");
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

        const imgurl = "https://" + localStorage.getItem("projectURL") + "/eCommerceCMSImage/shopProfile/" + JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID + "/"

        // const links = [
        //     { title: "Products", url: "", data: merchantDetails ? merchantDetails.MerchantTotalProduct : [0], icons: <ListAltOutlinedIcon className="titleicon" /> },

        //     {
        //         title: "Shop Rating",
        //         url: "",
        //         data: this.state.shopRating,
        //         icons: <GradeOutlinedIcon className="titleicon" />
        //     },
        // ].map((link) => {
        //     return (
        //         <div key={link.title} className="info-row">
        //             <div className="info-row-left">
        //                 {link.icons}{link.title}
        //             </div>
        //             <div className="info-row-right">{link.data}</div>
        //         </div>
        //     );
        // })

        const getUploadParams = () => {
            return { url: "http://pmappapi.com/Memo/uploads/uploads/" };
        };

        const handleChangeStatus = ({ meta }, status) => {
        };

        const handleSubmit = (files, allFiles) => {
            allFiles.forEach((f) => f.remove());
        };
        const selectedCity = this.props.states.filter((x) => x.State === this.state.SHOPSTATE).map((y) => JSON.parse(y.CityDetail))
        let bankName = this.props.paymentMethod.filter((x) => x.PaymentMethodType === "Direct Bank").map((y) => JSON.parse(y.PaymentMethod))
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
                                <Typography variant="caption" >Shop Review Count</Typography>
                                <div className="mt-3" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <Typography variant="h4">{merchantDetails.ShopReviewCount}</Typography>
                                </div>
                            </div>
                            <div className="col p-4 shop_Box">
                                <Typography variant="caption" >Shop Rating</Typography>
                                <div className="mt-3" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <Rating name="read-only" value={merchantDetails.ShopRating} readOnly size="medium"></Rating>
                                </div>
                            </div>
                            <div className="col p-4 shop_Box" >
                                <Typography variant='caption'>Total Product</Typography>
                                <div className="mt-3" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <Typography variant="h4">{merchantDetails.MerchantTotalProduct}</Typography>
                                </div>
                            </div>

                        </div>
                        <Divider variant="fullWidth" className="dividerbottom" />

                        <div className="row" style={{ marginTop: '5%', marginBottom: '5%' }}>
                            <div className="col-4 col-md-4 col-lg-4 ">
                                <div className="description row d-flex justify-content-center ml-4 mr-2"><Typography variant='subtitle2' >Last Joined: {merchantDetails.LastJoined} </Typography></div>
                                <div className="row" style={{ marginBottom: '3%' }}>

                                    <div onClick={() => this.modalOpen()} className="imagecontainer" style={{ border: '3px solid #E1DCDC', borderStyle: 'dashed' }}>
                                        <img
                                            // className="profilePic"
                                            src={merchantDetails.ShopImage && merchantDetails.ShopImage.length ? imgurl + merchantDetails.ShopImage : Logo}
                                            alt="Profile"
                                            width="100%"
                                            height="auto"
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
                                                    defaultValue={userData.FirstName === null ? '-' : userData.FirstName}
                                                    onChange={this.handleChangeforShopName.bind(this)}
                                                />
                                            </div>
                                            <div className="col-6 m-1">
                                                <TextField
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    label="Last Name"
                                                    id="lastName"
                                                    defaultValue={userData.LastName === null ? '-' : userData.LastName}
                                                    onChange={this.handleChangeforShopName.bind(this)}
                                                />
                                            </div>
                                        </div>

                                        <div className="col mt-4" style={{ display: 'flex', flexDirection: 'row' }}>
                                            <div className="col-6 m-1">
                                                <FormControl>
                                                    <FormLabel id="demo-controlled-radio-buttons-group">Gender</FormLabel>
                                                    <RadioGroup
                                                        aria-labelledby="demo-controlled-radio-buttons-group"
                                                        name="controlled-radio-buttons-group"
                                                        value={this.state.Gender}
                                                    // onChange={handleChange}
                                                    >
                                                        <FormControlLabel value="Female" control={<Radio />} label="Female" checked={userData.UserGender.toLowercase === 'Female'} />
                                                        <FormControlLabel value="Male" control={<Radio />} label="Male" checked={userData.UserGender === 'Male'} />
                                                    </RadioGroup>
                                                </FormControl>
                                            </div>
                                            <div className="col-6 m-1" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                                <TextField
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    label="Date of Birth"
                                                    id="dob"
                                                    defaultValue={this.state.UserInfo.LastName === null ? '-' : this.state.UserInfo.LastName}
                                                    onChange={this.handleChangeforShopName.bind(this)}
                                                />

                                                <TextField
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    label="NRIC"
                                                    id="dob"
                                                    defaultValue={this.state.UserInfo.UserNRIC === null ? '-' : this.state.UserInfo.UserNRIC}
                                                    onChange={this.handleChangeforShopName.bind(this)}
                                                />
                                            </div>
                                        </div>

                                        <div className="col mt-4" style={{ display: 'flex', flexDirection: 'row' }}>
                                            <div className="col-6 m-1">
                                                <TextField
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    label="Contact No"
                                                    id="contactNo"
                                                    defaultValue={this.state.UserInfo.UserContactNo === null ? '-' : this.state.UserInfo.UserContactNo}
                                                    onChange={this.handleChangeforShopName.bind(this)}
                                                />
                                            </div>
                                            <div className="col-6 m-1">
                                                <TextField
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    label="Email"
                                                    id="email"
                                                    defaultValue={this.state.UserInfo.UserEmailAddress === null ? '-' : this.state.UserInfo.UserEmailAddress}
                                                    onChange={this.handleChangeforShopName.bind(this)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                ))}


                            </div>

                            <div className="col-4 col-md-4 col-lg-4 border-line-right">
                                <div className="container">
                                    <div className="row" >
                                        <Typography variant='caption'>Bank Information</Typography>
                                    </div>
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
                                                        onChange={this.handleChangeforShopName.bind(this)}
                                                    >
                                                        {
                                            isArrayNotEmpty(bankName) && bankName[0].map((el, idx) => {
                                                return <MenuItem key={el.PaymentMethodID} value={el.BankName}>{el.BankName}</MenuItem>
                                            })
                                        }
                                                    </Select>
                                                </FormControl>
                                                    {/* <TextField
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        label="Shop Bank"
                                                        id="shopBank"
                                                        defaultValue={row.ShopBank === null ? 'None' : row.ShopBank}
                                                        onChange={this.handleChangeforShopName.bind(this)}
                                                    /> */}
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
                                                        defaultValue={row.ShopBankAccountName === null ? 'None' : row.ShopBankAccountName}
                                                        onChange={this.handleChangeforSHOPDESC.bind(this)}
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
                                                        defaultValue={row.ShopBankAccountNo === null ? 'None' : row.ShopBankAccountNo}
                                                        onChange={this.handleChangeforSHOPDESC.bind(this)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col mt-4" >
                                                    <Dropzone
                                                        style={{ width: "100%" }}
                                                        onDrop={(acceptedFiles) => {
                                                            if (acceptedFiles.length > 0) {
                                                                this.setState({
                                                                    preview: acceptedFiles.map(file => URL.createObjectURL(file)),
                                                                    imageName: acceptedFiles[0].name,
                                                                    fileAdded: true,
                                                                    imageFile: acceptedFiles,
                                                                });
                                                                return;
                                                            } else {
                                                                this.setState({
                                                                    imageName: "",
                                                                    fileAdded: false,
                                                                    fileUpload: [],
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

                                                                    style={{
                                                                        width: '100%',
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
                                                                    {this.state.fileAdded ? (
                                                                        <div className="droppedFileImage">
                                                                            <img className="bankHeaderStatement" src={this.state.preview} alt={this.state.imageName} />
                                                                        </div>
                                                                    ) : (
                                                                        <div style={{ margin: 'auto' }}>
                                                                            {!isDragActive && "Upload Bank Statement Header"}
                                                                            {isDragActive &&
                                                                                !isDragReject &&
                                                                                "Upload Bank Statement Header"}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </section>
                                                        )}
                                                    </Dropzone>
                                                </div></div>
                                            <br />
                                        </div>
                                    ))}
                            </div>


                            <div className="col-4 col-md-4 col-lg-4">
                                <div className="container">
                                    <div style={{ display: 'flex', flexDirection: "row", justifyContent: 'space-between' }}>
                                        <div style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                                            <Typography variant='caption' >Shop Information</Typography>
                                        </div>
                                        <div>
                                            <Button color="primary" variant="contained" size="small">Update Shop Info</Button>
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
                                                        id="userfirstname"
                                                        defaultValue={row.ShopName}
                                                        onChange={this.handleChangeforShopName.bind(this)}
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
                                                        id="userlastname"
                                                        defaultValue={row.ShopDescription}
                                                        onChange={this.handleChangeforSHOPDESC.bind(this)}
                                                    />
                                                </div>
                                            </div>
                                            <br />
                                            <div className="row">
                                                {/* <div className="col"> */}
                                                <FormControl fullWidth>
                                                    <InputLabel id="demo-simple-select-label">Country</InputLabel>
                                                    <Select
                                                        id="Country"
                                                        variant="outlined"
                                                        defaultValue={row.ShopCountryID ? row.ShopCountryID : 148}
                                                        label="Country"
                                                        size="small"
                                                        onChange={this.handleChange.bind(this, "SHOPCOUNTRYID")}
                                                    >
                                                        {this.props.countrylist.map((country) => (
                                                            <MenuItem
                                                                value={country.CountryId}
                                                                key={country.CountryId}
                                                            >
                                                                {country.CountryName}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                                {/* </div> */}
                                            </div>
                                            <div className="row mt-4" >
                                                <FormControl fullWidth>
                                                    <InputLabel id="demo-simple-select-label">State</InputLabel>
                                                    <Select
                                                        id="State"
                                                        label="State"
                                                        variant="outlined"
                                                        defaultValue={row.ShopState}
                                                        size="small"
                                                        onChange={this.handleChange.bind(this, "SHOPSTATE")}
                                                    >
                                                        {
                                                            isArrayNotEmpty(this.props.states) && this.props.states.map((el, idx) => {
                                                                return <MenuItem key={el.StateID} value={el.State}>{el.State}</MenuItem>
                                                            })
                                                        }
                                                    </Select>
                                                </FormControl>
                                            </div>

                                            <div className="row mt-4" >
                                                <FormControl fullWidth>
                                                    <InputLabel id="demo-simple-select-label">City</InputLabel>
                                                    <Select
                                                        label="City"
                                                        variant="outlined"
                                                        defaultValue={row.ShopCity}
                                                        size="small"
                                                        onChange={this.handleChange.bind(this, "SHOPCITY")}
                                                    >
                                                        {
                                                            isArrayNotEmpty(selectedCity[0]) && selectedCity[0].map((data, idx) => {
                                                                return <MenuItem key={idx} value={data.City}>{data.City}</MenuItem>
                                                            })
                                                        }
                                                    </Select>
                                                </FormControl>
                                            </div>
                                            <div className="row" >
                                                <div className="col mt-4 ">
                                                    <TextField
                                                        className="font"
                                                        variant="outlined"
                                                        size="small"
                                                        id="userfirstname"
                                                        label="Poscode"
                                                        defaultValue={row.ShopPoscode}
                                                        onChange={this.handleChange.bind(this, "SHOPPOSCODE")}
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
                                                        preview: acceptedFiles.map(file => URL.createObjectURL(file)),
                                                        imageName: acceptedFiles[0].name,
                                                        fileAdded: true,
                                                        imageFile: acceptedFiles,
                                                    });
                                                    return;
                                                } else {
                                                    this.setState({
                                                        imageName: "",
                                                        fileAdded: false,
                                                        fileUpload: [],
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
                                                        {this.state.fileAdded ? (
                                                            <div className="droppedFileImage">
                                                                <img className="profilePic" src={this.state.preview} alt={this.state.imageName} />
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
                                            {this.state.fileAdded && (
                                                <div >
                                                    <button
                                                        className="button-font mb-2 mr-1 btn btn-primary"
                                                        size="sm"
                                                        theme="light"
                                                        onClick={() => {
                                                            this.removeFile();
                                                        }}
                                                    >
                                                        <CloseIcon />
                                                        Remove file
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {this.state.fileAdded ? (
                                            <div className="col-6">
                                                <button style={{ float: "left" }}
                                                    className="btn btn-primary button-font"
                                                    onClick={this.onFileUpload}
                                                >
                                                    Upload Image
                                                </button>
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
