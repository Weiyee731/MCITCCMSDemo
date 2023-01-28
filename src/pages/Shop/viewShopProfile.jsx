// react
import React, { Component } from "react";
import { toast } from "react-toastify";
// third-party
import { Modal, ModalBody } from "reactstrap";

// data stubs
// import { DropzoneArea } from 'material-ui-dropzone'
import Dropzone from "react-dropzone";
// import Dropzone from "react-dropzone";
import { connect } from "react-redux";
import { GitAction } from "../../store/action/gitAction";
import { Link, matchPath, Redirect, Switch, Route } from "react-router-dom";

import {
    Card,
    Divider,
} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import axios from "axios";
// import moment from 'moment';

import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined';
// import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
// import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import Logo from "../../assets/logos/logo.png";

import './viewShopProfile.scss';


function mapStateToProps(state) {
    return {
        countrylist: state.counterReducer["countries"],
        merchant: state.counterReducer["merchant"],
        shopUpdated: state.counterReducer["shopUpdated"],
        currentUser: state.counterReducer["currentUser"],
        productsListing: state.counterReducer["productsListing"],
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
    };
}

const group = {

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
    typeValue: localStorage.getItem("loginUser") !== null && JSON.parse(localStorage.getItem("loginUser"))[0].UserID !== undefined ? JSON.parse(localStorage.getItem("loginUser"))[0].UserID : 0,
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
            this.props.CallCountry();

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
                    // this.props.CallUserProfile(this.state);
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

        const links = [
            { title: "Products", url: "", data: merchantDetails ? merchantDetails.MerchantTotalProduct : [0], icons: <ListAltOutlinedIcon className="titleicon" /> },
     
            {
                title: "Shop Rating",
                url: "",
                data: this.state.shopRating,
                icons: <GradeOutlinedIcon className="titleicon" />
            },
        ].map((link) => {
            return (
                <div key={link.title} className="info-row">
                    <div className="info-row-left">
                        {link.icons}{link.title}
                    </div>
                    <div className="info-row-right">{link.data}</div>
                </div>
            );
        })

        const getUploadParams = () => {
            return { url: "http://pmappapi.com/Memo/uploads/uploads/" };
        };

        const handleChangeStatus = ({ meta }, status) => {
            console.log(status, meta);
        };

        const handleSubmit = (files, allFiles) => {
            allFiles.forEach((f) => f.remove());
        };
        return (
            <div className="MainContainer" style={{ flex: 1 }}>
                <Card>
                    <CardContent>
                        <div className="row">
                            <div className="col-6 ">
                                <div
                                    style={{
                                        textAlign: "left",
                                        fontWeight: 800
                                    }}
                                >
                                    Shop Profile
                                </div>

                                <div className="font font-subtitle">
                                    Manage your shop information
                                </div>
                            </div>
                            <div className="col-6 " style={{ textAlign: "right" }}>
                                <button
                                    variant="contained"
                                    className="btn btn-primary"
                                    onClick={() => this.updateShop()}
                                >
                                    <DoneIcon className="saveicon" />
                                    Save
                                </button>
                            </div>
                        </div>
                        <Divider variant="fullWidth" className="dividerbottom" />

                        <div className="row">
                            <div className="col-4 col-md-4 col-lg-4 border-line-right">
                                <div className="row">
                                    <div onClick={() => this.modalOpen()} className="imagecontainer">
                                        <img
                                            // className="profilePic"
                                            src={merchantDetails.ShopImage && merchantDetails.ShopImage.length ? imgurl + merchantDetails.ShopImage : Logo}
                                            alt="Profile"
                                            width="100px"
                                            height="100px"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src =
                                                    "https://img-cdn.tid.al/o/4858a4b2723b7d0c7d05584ff57701f7b0c54ce3.jpg";
                                            }}
                                        />
                                        <div className="overlay">Edit</div>
                                    </div>
                                </div>
                                <div className="description row d-flex justify-content-center ml-2 mr-2"><br /> Click on the image above to edit profile picture</div>

                                <div className="description row">
                                    <div className="col">
                                        <div className=" display-button">
                                            <SmsOutlinedIcon className="titleicon" />Response Rate: 37% </div>
                                    </div>
                                    <div className="col">
                                        <div className=" display-button">
                                            <AccessTimeOutlinedIcon className="titleicon" />Response Time: Within Hour </div>
                                    </div>
                                </div>
                                {links}
                            </div>
   
                            <div className="col-8 col-md-8 col-lg-8">
                                {this.props.merchant && this.props.merchant.length > 0 && this.props.merchant[0] !== null &&
                                    this.props.merchant.map((row) => (
                                        <div className="container" key={row.ShopName}>
                                            <div className="row" >
                                                <div className="col-2 rowStyle vertical-align">Shop Name</div>
                                                <div className="col-9 ">
                                                    <TextField
                                                        className="font"
                                                        variant="outlined"
                                                        size="small"
                                                        id="userfirstname"
                                                        defaultValue={row.ShopName}
                                                        onChange={this.handleChangeforShopName.bind(this)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-2 rowStyle vertical-align">Description</div>
                                                <div className="col-9">
                                                    <TextField
                                                        className="font"
                                                        variant="outlined"
                                                        multiline
                                                        maxRows={5}
                                                        size="small"
                                                        id="userlastname"
                                                        defaultValue={row.ShopDescription}
                                                        onChange={this.handleChangeforSHOPDESC.bind(this)}
                                                    />
                                                </div>
                                            </div>
                                            <br />
                                            <div className="row">
                                                <div className="col-2 rowStyle vertical-align">Country</div>
                                                <div className="col-9">
                                                    <FormControl
                                                        variant="filled"
                                                        size="small"
                                                        style={{ width: "100%" }}
                                                    >
                                                        <Select
                                                            id="Country"
                                                            variant="outlined"
                                                            defaultValue={row.ShopCountryID ? row.ShopCountryID : 148}
                                                            // {this.state.SHOPCOUNTRYID}
                                                            size="small"
                                                            onChange={this.handleChange.bind(this, "SHOPCOUNTRYID")}
                                                            className="font"
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
                                                <div className="col-2 rowStyle vertical-align">State</div>
                                                <div className="col-9 ">
                                                    <TextField
                                                        className="font"
                                                        variant="outlined"
                                                        size="small"
                                                        id="userfirstname"
                                                        defaultValue={row.ShopState}
                                                        onChange={this.handleChange.bind(this, "SHOPSTATE")}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row" >
                                                <div className="col-2 rowStyle vertical-align">City</div>
                                                <div className="col-9 ">
                                                    <TextField
                                                        className="font"
                                                        variant="outlined"
                                                        size="small"
                                                        id="userfirstname"
                                                        defaultValue={row.ShopCity}
                                                        onChange={this.handleChange.bind(this, "SHOPCITY")}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row" >
                                                <div className="col-2 rowStyle vertical-align">Poscode</div>
                                                <div className="col-9 ">
                                                    <TextField
                                                        className="font"
                                                        variant="outlined"
                                                        size="small"
                                                        id="userfirstname"
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
