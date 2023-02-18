import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../store/action/gitAction";
// import { browserHistory } from "react-router";
import { setLogonUser } from "../../components/auth/AuthManagement"
import { GetDefaultImage } from "../../tools/MediaHelpers"
import { isStringNullOrEmpty, isContactValid, convertDateTimeToString, getFileExtension, getFileTypeByExtension, isEmailValid, isArrayNotEmpty } from "../../tools/Helpers"
import axios from "axios";

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
import Dropzone from "react-dropzone";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from "@mui/icons-material/Close";
// import css
import "./registerMerchant.css";
import { redirect } from "react-router";
import LoadingPanel from "../../tools/LoadingPanel";

import AlertDialog from "../../components/ModalComponent/ModalComponent";
function mapStateToProps(state) {
    return {
        logonUser: state.counterReducer["logonUser"],
        states: state.counterReducer["states"],
        shopUpdated: state.counterReducer["shopUpdated"],
        merchantUpdateProfile: state.counterReducer["merchantUpdateProfile"],
        paymentMethod: state.counterReducer["paymentMethod"],

    };
}

function mapDispatchToProps(dispatch) {
    return {
        CallGetUpdateMerchantProfile: (data) => dispatch(GitAction.CallGetUpdateMerchantProfile(data)),
        CallState: (data) => dispatch(GitAction.CallState(data)),
        CallUpdateShopDetails: (data) => dispatch(GitAction.CallUpdateShopDetails(data)),
        CallPaymentMethod: (data) => dispatch(GitAction.CallPaymentMethod(data)),
    };
}



const INITIAL_STATE = {
    // personal info 
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
    //bank info
    userName: "",
    accNo: "",
    bankName: "",
    //shopDetail
    ShopName: "",
    website: "",
    address1: "",
    address2: "",
    postcode: "",
    city: "",
    country: "",
    contactno: "",
    shopdesc: "",
    //err handling
    Err: false,
    firstNameErr: false,
    lastNameErr: false,
    icnumberErr: false,
    //bank info
    userNameErr: false,
    accNoErr: false,
    bankNameErr: false,
    bankHeaderErr: false,
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
    //image
    file: [],
    fileInfo: [],
    url: [],
    openErrorModal: false
}

class RegisterMerchant extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE


    }

    componentDidMount() {
        this.props.CallState()
        this.props.CallPaymentMethod()
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.isProfileCheck === "error" || this.props.isProfileCheck === "wrongpath") {
            if (this.state.openErrorModal === false) {
                this.setState({ openErrorModal: true })
                setTimeout(() => {
                    const eCommercePlatform = window.location.hostname === "localhost" ? "http://localhost:3000/EmporiaDev" : "https://myemporia.my/emporiadev/"
                    window.location.href = eCommercePlatform
                }, 5000);
            }
        }
    }

    getProps = (activeStep, Err) => {
        if (Err === false) {
            this.setState({ activeStep: activeStep })
            if (activeStep === 2) {
                // combine images and video for upload in an array
                let uploadingMedia = [...this.state.file]
                if (this.state.file.length > 0 && uploadingMedia.length > 0) {
                    //basic form setup
                    const formData = new FormData()

                    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
                    formData.append("ID", this.props.userData.UserID);
                    formData.append("targetFolder", "userbank");
                    formData.append("projectDomain", localStorage.getItem("projectDomain"));

                    //upload single file
                    let filenames = ""
                    //   let variationID = ""
                    //   let slideOrder = ""
                    let mediaType = ""
                    //   let imageWidth = ""
                    //   let imageHeight = ""

                    for (let i = 0; i < uploadingMedia.length; i++) {
                        let fileExt = getFileExtension(uploadingMedia[i])
                        // let filename = productID + "_" + i + "_" + convertDateTimeToString(new Date())
                        let filename = "_" + i + "_" + convertDateTimeToString(new Date())
                        let image = uploadingMedia[i]

                        filenames += filename + "." + fileExt
                        mediaType += getFileTypeByExtension(fileExt)
                        // variationID += "0"
                        // slideOrder += i
                        // imageWidth += "0"
                        // imageHeight += "0"

                        formData.append("upload[]", image);
                        formData.append("imageName[]", filename);

                        let param = {
                            USERID: this.props.userData.UserID,
                            SHOPNAME: this.state.ShopName,
                            SHOPDESC: this.state.shopdesc,
                            SHOPPOSCODE: this.state.postcode,
                            SHOPCITY: this.state.city,
                            SHOPSTATE: this.state.country,
                            SHOPCOUNTRYID: this.state.countryid,
                        }
                        let param2 = {
                            USERID: this.props.userData.UserID,
                            FIRSTNAME: this.state.firstname,
                            LASTNAME: this.state.lastname,
                            USEREMAIL: this.state.email,
                            USERGENDER: "-",
                            USERCONTACTNO: this.state.contactno,
                            USERDOB: moment(this.state.DOB).format("YYYY-MM-DD"),
                            USERNRIC: this.state.icnumber,
                            SHOPBANK: this.state.bankName,
                            SHOPBANKACCOUNTNAME: this.state.userName,
                            SHOPBANKACCOUNTNO: this.state.accNo,
                            SHOPBANKACCOUNTHEADER: filenames,

                        }
                        let imageURL = "https://" + localStorage.getItem("projectURL") + "/eCommerceCMSImage/uploadImages.php"

                        // let imageURL = "https://" + localStorage.getItem("projectDomain") + "/images/uploadproductImages.php"
                        // let imageURL = "https://" + localStorage.getItem("projectDomain") + "/images/uploadproductImages.php"
                        // axios.post("https://tourism.denoo.my/MCITCApi/php/uploadproductImages.php", formData, config).then((res) => {
                        // axios.post("https://myemporia.my/emporiaimage/uploadproductImages.php", formData, config).then((res) => {
                        axios.post(imageURL, formData, config).then((res) => {
                            if (res.status === 200) {
                                this.props.CallGetUpdateMerchantProfile(param2)
                            }
                            else {
                                toast.error("There is something wrong with uploading images. Please try again.")
                            }
                        }).catch(e => {
                            toast.error("There is something wrong with uploading images. Please try again.")
                        })

                        this.props.CallUpdateShopDetails(param)

                    }
                }
            }

        } else if (activeStep === 3) {
        }
        else {
            if (activeStep === 0) {
                if (this.state.firstname === "") {
                    this.setState({ firstNameErr: true })
                }
                if (this.state.lastname === "") {
                    this.setState({ lastNameErr: true })
                }
                if (this.state.icnumber === "") {
                    this.setState({ icnumberErr: true })
                }
                if (this.state.userName === "") {
                    this.setState({ userNameErr: true })
                }
                if (this.state.accNo === "") {
                    this.setState({ accNoErr: true })
                }
                if (this.state.bankName === "") {
                    this.setState({ bankNameErr: true })
                }
                if (!isArrayNotEmpty(this.state.file)) {
                    this.setState({ bankHeaderErr: true })
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
            } else if (activeStep === 1) {
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
            }

        }
    }

    handleChange(e, name) {
        this.setState({ firstNameErr: false, lastNameErr: false, DOBErr: false, icnumberErr: false, userNameErr: false, bankNameErr: false, bankHeaderErr: false, accNoErr: false, emailErr: false, contactnoErr: false, ShopNameErr: false, address1Err: false, postcodeErr: false, cityErr: false, countryErr: false })
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
            case "userName":
                this.setState({ userName: e })
                if (e === "") {
                    this.setState({ userNameErr: true })
                }
                break;
            case "bankName":
                this.setState({ bankName: e })
                if (e === "") {
                    this.setState({ bankNameErr: true })
                }
                break;
            case "accNo":
                this.setState({ accNo: e })
                if (e === "") {
                    this.setState({ accNoErr: true })
                }
                break;
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
                let selected = this.props.states.filter((x) => x.State === e)
                selected.map((x) => this.setState({ countryid: x.StateID }))
                this.setState({ country: e })
                if (e === "") {
                    this.setState({ countryErr: true })
                }
                break;

            default:

        }
    }

    mouseOut = (id) => {
        this.setState({
            onImage: false,
            currentlyHovered: id,
        });
    };

    mouseIn = (id) => {
        this.setState({
            onImage: true,
            currentlyHovered: id,
        });
    };

    onDelete = (index, data) => {
        if (data === "512x512") {
            var newList2 = this.state.file;
            this.state.file.map((file, i) => {
                var valueToBeUsed2 = parseInt(index);
                if (i === valueToBeUsed2) {
                    newList2 = newList2.filter((file2) => file !== file2);
                    this.setState({
                        counter2: this.state.counter2 + 1,
                    });
                }
            });
            this.setState({
                file: newList2.map((file3) => file3),
                fileInfo: newList2.map((file3) => file3.name),
                url: newList2.map((file3) => URL.createObjectURL(file3)),
            });

            if (this.state.fileInfo.length === 1) {
                this.setState({
                    file1Added: false,
                    file2Added: false,
                    file3Added: false,
                    Total512x512: 0,
                });
            } else if (this.state.fileInfo.length === 2) {
                this.setState({
                    file1Added: true,
                    file2Added: false,
                    file3Added: false,
                    Total512x512: 1 / 3,
                });
            } else if (this.state.fileInfo.length === 3) {
                this.setState({
                    file1Added: true,
                    file2Added: true,
                    file3Added: false,
                    Total512x512: 2 / 3,
                });
            } else if (this.state.fileInfo.length === 4) {
                this.setState({
                    file1Added: true,
                    file2Added: true,
                    file3Added: true,
                    Total512x512: 3 / 3,
                });
            }
        }
        setTimeout(
            function () {
                this.checkFiles512x512();
            }.bind(this),
            500
        );
    };

    checkFiles512x512 = () => {
        if (this.state.file.length < 1) {
            this.setState({
                notEnoughFiles512x512: true,
                Total512x512: this.state.file.length / 1,
            });
        } else {
            this.setState({
                notEnoughFiles512x512: false,
                Total512x512: 1,
            });
        }
    };

    handleDrop = (data, acceptedFiles) => {
        this.setState({ firstNameErr: false, lastNameErr: false, DOBErr: false, icnumberErr: false, userNameErr: false, bankNameErr: false, bankHeaderErr: false, accNoErr: false, emailErr: false, contactnoErr: false, ShopNameErr: false, address1Err: false, postcodeErr: false, cityErr: false, countryErr: false })
        if (data === "512x512") {

            if (acceptedFiles.length === 0) {
                this.setState({ isOverFileSize: true })
            }

            this.setState((state) => {
                const file = state.file.concat(acceptedFiles.map((file) => file));
                const fileInfo = state.fileInfo.concat(
                    acceptedFiles.map((file) => file.name)
                );
                const url = state.url.concat(
                    acceptedFiles.map((file) => URL.createObjectURL(file))
                );
                return {
                    file,
                    fileInfo,
                    url,
                };
            });
            if (this.state.fileInfo.length === 1) {
                this.setState({
                    file1Added: true,
                });
            }

        } else if (data === "1600x900") {
            if (this.state.fileInfo2.length + acceptedFiles.length > 3) {
                toast.error("Only 3 files are allowed.");
            } else {
                this.setState((state) => {
                    const file2 = state.file2.concat(acceptedFiles.map((file) => file));
                    const fileInfo2 = state.fileInfo2.concat(
                        acceptedFiles.map((file) => file.name)
                    );
                    const url2 = state.url2.concat(
                        acceptedFiles.map((file) => URL.createObjectURL(file))
                    );
                    return {
                        file2,
                        fileInfo2,
                        url2,
                    };
                });
                if (this.state.fileInfo2.length === 1) {
                    this.setState({
                        file1Added2: true,
                    });
                }
            }
        } else if (data === "video") {
            if (this.state.fileInfo3.length + acceptedFiles.length > 1) {
                toast.error("Only 1 video is allowed.");
            } else {
                this.setState((state) => {
                    const file3 = state.file3.concat(acceptedFiles.map((file) => file));
                    const fileInfo3 = state.fileInfo3.concat(
                        acceptedFiles.map((file) => file.name)
                    );
                    const url3 = state.url3.concat(
                        acceptedFiles.map((file) => URL.createObjectURL(file))
                    );
                    return {
                        file3,
                        fileInfo3,
                        url3,
                    };
                });
                if (this.state.fileInfo3.length === 1) {
                    this.setState({
                        file1Added3: true,
                    });
                }
                this.checkFilesVideo();
            }
        }

        acceptedFiles.map((file) => {
            var reader = new FileReader();
            reader.readAsDataURL(file);
        });
    };

    renderCard(activeStep) {
        let bankName = this.props.paymentMethod.filter((x) => x.PaymentMethodType === "Direct Bank").map((y) => JSON.parse(y.PaymentMethod))
        // bankName = bankName[0].map((x)=>x)
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
                                            this.handleChange(e.target.value, "DOB")
                                        }}
                                    />
                                </FormControl>
                                {(this.state.DOBErr === true || this.state.Err) === true && <FormHelperText style={{ color: "red" }}>Date of birth is required</FormHelperText>}
                            </div>
                            <div className="col-2"></div>
                        </div>
                        <div className="row m-2" style={{ borderTop: "1px solid grey", paddingTop: "5px" }}></div>
                        <div className="col-8" style={{ marginLeft: "2vw" }}><Typography variant="h6">Bank account Info</Typography></div>
                        <div className="row m-4 d-flex justify-content-center">
                            <div className="col-xl-2 col-lg-2 col-md-2 col-s-12 col-xs-12 inputForm">
                                <div className="asterisk">*</div>Account Holder Name:
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-s-12 col-xs-12">
                                <FormControl fullWidth size="small" variant="outlined">
                                    <OutlinedInput
                                        id="outlined-adornment-name"
                                        label=""
                                        value={this.state.userName}
                                        // disabled={isActive ? false : true}
                                        onChange={(e) => this.handleChange(e.target.value, "userName")}
                                        endAdornment={<InputAdornment position="end"> {this.state.userName.length}/30</InputAdornment>}
                                        inputProps={{
                                            'aria-label': 'name',
                                            maxLength: 30
                                        }}
                                        required
                                    />
                                </FormControl>
                                {(this.state.userNameErr === true || this.state.Err) === true && <FormHelperText style={{ color: "red" }}>User name is required</FormHelperText>}
                            </div>
                        </div>
                        <div className="row m-4 d-flex justify-content-center">
                            <div className="col-xl-2 col-lg-2 col-md-2 col-s-12 col-xs-12 inputForm">
                                <div className="asterisk">*</div>Bank Name:
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-s-12 col-xs-12">
                                <FormControl fullWidth size="small" variant="outlined">
                                    <InputLabel id="demo-simple-select-label"></InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label=""
                                        onChange={(e) => this.handleChange(e.target.value, "bankName")}
                                        size="small"
                                        value={this.state.bankName}
                                    // IconComponent={FilterListOutlinedIcon}
                                    // options={
                                    //     isArrayNotEmpty(country) && country.map((el, idx) => {
                                    //         return { id: el.StateID, value: el.State, label: el.State }
                                    //     })
                                    // }
                                    >
                                        {
                                            isArrayNotEmpty(bankName) && bankName[0].map((el, idx) => {
                                                return <MenuItem key={el.PaymentMethodID} value={el.BankName}>{el.BankName}</MenuItem>
                                            })
                                        }

                                    </Select>
                                </FormControl>
                                {(this.state.bankNameErr === true || this.state.Err) === true && <FormHelperText style={{ color: "red" }}>Bank Name is required</FormHelperText>}
                            </div>
                        </div>
                        <div className="row m-4 d-flex justify-content-center">
                            <div className="col-xl-2 col-lg-2 col-md-2 col-s-12 col-xs-12 inputForm">
                                <div className="asterisk">*</div>Account Number:
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-s-12 col-xs-12">
                                <FormControl fullWidth size="small" variant="outlined">
                                    <OutlinedInput
                                        id="outlined-adornment-name"
                                        label=""
                                        value={this.state.accNo}
                                        // type="number"
                                        onChange={(e) => this.handleChange(e.target.value, "accNo")}
                                        endAdornment={<InputAdornment position="end"> {this.state.accNo.length}/30</InputAdornment>}
                                        inputProps={{
                                            'aria-label': 'name',
                                            maxLength: 30
                                        }}
                                        required
                                    />
                                </FormControl>
                                {(this.state.accNoErr === true || this.state.Err) === true && <FormHelperText style={{ color: "red" }}>User name is required</FormHelperText>}
                            </div>
                        </div>
                        <div className="row m-4 d-flex justify-content-center">
                            <div className="col-xl-2 col-lg-2 col-md-2 col-s-12 col-xs-12 inputForm">
                                <div className="asterisk">*</div>Bank Header:
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-s-12 col-xs-12">
                                <FormControl fullWidth size="small" variant="outlined">
                                    {!this.state.file1Added && (
                                        <Dropzone
                                            onDrop={this.handleDrop.bind(this, "512x512")}
                                            accept="image/*"
                                            maxSize="1000000"
                                            style={{
                                                display: "flex",
                                                justifyContent: "flex-end"
                                            }}
                                            onBlur={() =>
                                                this.setState({
                                                    FocusOn: false,
                                                })
                                            }
                                        >
                                            {({
                                                getRootProps,
                                                getInputProps,
                                                isDragActive,
                                                isDragAccept,
                                                isDragReject,
                                            }) => (
                                                <div
                                                    {...getRootProps({
                                                        className: "dropzone",
                                                    })}
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
                                                        width: "100%",
                                                        height: "100%",
                                                    }}
                                                >
                                                    <input {...getInputProps()} />
                                                    <AddIcon className="DropZoneAddIcon" />
                                                </div>
                                            )}
                                        </Dropzone>
                                    )}
                                    {this.state.file1Added && (
                                        <div
                                            onMouseLeave={this.mouseOut.bind(this, 1)}
                                            onMouseEnter={this.mouseIn.bind(this, 1)}
                                            className=""
                                            style={{ display: "flex", justifyContent: "flex-end" }}
                                        >
                                            {this.state.onImage &&
                                                this.state.currentlyHovered === 1 && (
                                                    <div className="DropZoneImageDeleteButtonDiv">
                                                        <IconButton
                                                            className=""
                                                            onClick={() => this.onDelete(0, "512x512")}
                                                        >
                                                            <CloseIcon
                                                                className="DropZoneImageDeleteButtonIcon"
                                                                color="secondary"
                                                            />
                                                        </IconButton>
                                                    </div>
                                                )}
                                            <img
                                                className="DropZoneImage"
                                                src={this.state.url[0]}
                                                style={{ width: "100%", height: "100%" }}
                                                alt=""
                                            />
                                        </div>
                                    )}
                                </FormControl>
                                {(this.state.bankHeaderErr === true || this.state.Err) === true && <FormHelperText style={{ color: "red" }}>Bank Header No is required</FormHelperText>}
                            </div>
                        </div>

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
                        <div className="row m-4 d-flex justify-content-center">
                            <div className="row justify-content-center col-9">
                                <div className="col-xl-4 col-lg-4 col-md-4 col-s-12 col-xs-12">
                                    <div className="col-xl-2 col-lg-2 col-md-2 col-s-12 col-xs-12 d-flex">
                                        <div className="asterisk">*</div>States
                                    </div>
                                    <div className="col-xl-10 col-lg-10 col-md-10 col-s-12 col-xs-12">
                                        <FormControl fullWidth size="small" variant="outlined">
                                            <InputLabel id="demo-simple-select-label"></InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                label=""
                                                onChange={(e) => this.handleChange(e.target.value, "country")}
                                                size="small"
                                                value={this.state.country}
                                            // IconComponent={FilterListOutlinedIcon}
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
                                        <div className="asterisk">*</div>City
                                    </div>
                                    <div className="col-xl-10 col-lg-10 col-md-10 col-s-12 col-xs-12">
                                        <FormControl fullWidth size="small" variant="outlined">
                                            <InputLabel id="demo-simple-select-label"></InputLabel>
                                            <Select
                                                labelId="search-filter-category"
                                                id="search-filter-category"
                                                label=""
                                                onChange={(e) => this.handleChange(e.target.value, "city")}
                                                size="small"
                                                value={this.state.city}
                                            // options={
                                            //     isArrayNotEmpty(selectedCity) && selectedCity.map((x) => {
                                            //         return { value: x.City, label: x.City }
                                            //     })
                                            // }
                                            >
                                                {
                                                    isArrayNotEmpty(selectedCity[0]) && selectedCity[0].map((data, idx) => {
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
                            </div></div>
                    </div>
                )
            case 2:
                return (
                    <div className="" style={{ display: "flex", justifyContent: "space-around" }}>
                        {isArrayNotEmpty(this.props.shopUpdated) && this.props.shopUpdated[0].ShopID !== null && isArrayNotEmpty(this.props.merchantUpdateProfile) && this.props.merchantUpdateProfile[0].UserID !== 0 &&
                            <Typography>Shop account has successfully created!</Typography>
                        }
                    </div>
                )
            case 3:
                return (
                    <>
                        {window.location.replace("/CMS.myemporia.my/")}
                    </>
                )

            default:

        }
    }

    render() {
        return (
            <Card style={{ margin: "3vw" }} elevation={3}>
                <CardContent>
                    <h4>Seller Registration</h4>
                    {
                        this.props.isProfileCheck === false ?
                            <LoadingPanel />
                            :
                            <HorizontalLinearStepper
                                Data={this.state}
                                propsData={this.getProps}
                                data={this.renderCard(this.state.activeStep)}>
                            </HorizontalLinearStepper>
                    }
                    <div>
                        <AlertDialog
                            open={this.state.openErrorModal}
                            fullWidth={true}
                            maxWidth="sm"
                            handleToggleDialog={() => this.setState({ openErrorModal: false })} >
                            <div className="container-fluid">
                                <h4 style={{ fontWeight: "bold" }}>{this.props.isProfileCheck === "error" ? "Wrong user data is detected" : "Invalid Path detected"} </h4>
                                <hr />
                                <div className="container">
                                    <Typography>Page will prompt back to Emporia Ecommerce Platform.
                                        Relogin is required to proceed to this merchant registration page.</Typography>
                                </div>
                            </div>

                        </AlertDialog >
                    </div>
                </CardContent>
            </Card>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterMerchant);