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

import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import TableCell from '@mui/material/TableCell';


import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import AppBar from "@mui/material/AppBar";

import ProductPurchaseOrderDetailsComponent from './ProductPurchaseOrderDetailsComponent';

// Share Components
import TableComponents from "../../components/TableComponents/TableComponents";
// import SearchBar from "../../../components/SearchBar/SearchBar"


function mapStateToProps(state) {
    return {
        countrylist: state.counterReducer["countries"],
        merchant: state.counterReducer["merchant"],
        shopUpdated: state.counterReducer["shopUpdated"],
        currentUser: state.counterReducer["currentUser"],
        productsListing: state.counterReducer["productsListing"],

        POListing: state.counterReducer["POListing"],
        POAction: state.counterReducer["POAction"],

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

        CallUpdatePurchaseOrderStatus: (orderData) =>
            dispatch(GitAction.CallUpdatePurchaseOrderStatus(orderData)),
        CallGetPurchaseOrders: (orderData) =>
            dispatch(GitAction.CallGetPurchaseOrders(orderData)),
        CallDeletePurchaseOrder: (orderData) =>
            dispatch(GitAction.CallDeletePurchaseOrder(orderData)),

    };
}

const INITIAL_STATE = {

    // USERID: localStorage.getItem("loginUser") !== null ? JSON.parse(localStorage.getItem("loginUser"))[0].UserID : 0,
    // USERFIRSTNAME: "",
    // USERLASTNAME: "",
    // USERCONTACTNO: "",
    // USERDATEBIRTH: "",
    // USEREMAIL: "",
    // USERGENDER: "",
    // open: false,
    // open1: false,
    // showBoxForImage: false,
    // fileAdded: false,
    // file: "",
    // fileInfo: "",
    // url: "",
    // imageFile: null,
    // imageName: null,
    // preview: null,

    // editContact: false,
    // editEmail: false,
    // validfirstName: false,
    // validlastName: false,
    // validDOB: false,
    // validGender: false,
    // validContact: false,
    // validEmail: false,

    // type: "MerchantProfile",
    // typeValue: localStorage.getItem("loginUser") !== null && JSON.parse(localStorage.getItem("loginUser"))[0].UserID !== undefined ? JSON.parse(localStorage.getItem("loginUser"))[0].UserID : 0,
    // userRoleID: localStorage.getItem("loginUser") !== null ? JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID : 0,
    // productPage: 999,
    // page: 1,
    // ProjectID: localStorage.getItem("loginUser") !== null ? JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID : 0,

    // SHOPNAME: "",
    // SHOPDESC: "",
    // SHOPCOUNTRYID: 148,
    // SHOPPOSCODE: "",
    // SHOPSTATE: "",
    // SHOPCITY: "",
    // shopRating: 0,

    tabValue: "",
    POListing: "",
    isPOListingSet: false,

    ProductPurchaseOrderID: "",
    ProductPurchaseOrderCode: "",
    ProductPurchaseOrderStatus: "",
    CreatedDate: "",
    MerchantID: "",
    CompanyName: "",
    CompanyContactNo: "",
    CompanyWebsite: "",
    CompanyAddressLine1: "",
    CompanyAddressLine2: "",
    CompanyPoscode: "",
    CompanyCity: "",
    CompanyState: "",
    CompanyCountryID: "",
    ProductPurchaseOrderDetail: "",
    detailsShown: false
}
class ProductPurchaseOrder extends Component {
    constructor(props) {
        super(props);

        this.state = INITIAL_STATE;
        // this.handleChange = this.handleChange.bind(this);
        // this.uploadHandler = this.uploadHandler.bind(this);
        // this.setDetails = this.setDetails.bind(this);
    }


    // setDetails(shopDetails) {
    //     this.setState({
    //         SHOPNAME: shopDetails.ShopName !== undefined ? shopDetails.ShopName : "",
    //         SHOPDESC: shopDetails.ShopDescription !== undefined ? shopDetails.ShopDescription : "",
    //         SHOPCOUNTRYID: shopDetails.ShopCountryID !== null ? shopDetails.ShopCountryID : 148,
    //         SHOPPOSCODE: shopDetails.ShopPoscode !== undefined ? shopDetails.ShopPoscode : "",
    //         SHOPSTATE: shopDetails.ShopState !== undefined ? shopDetails.ShopState : "",
    //         SHOPCITY: shopDetails.ShopCity !== undefined ? shopDetails.ShopCity : "",
    //     })
    // }

    componentDidMount() {

        this.props.CallGetPurchaseOrders(JSON.parse(localStorage.getItem("loginUser"))[0].UserID)

    }
    componentDidUpdate(prevProps) {

        if (prevProps.POListing !== this.props.POListing) {
            if (this.state.isPOListingSet === false && this.props.POListing.length > 0) {
                let Listing = this.props.POListing
                Listing = Listing.length > 0 ? Listing.filter((x) => x.ProductPurchaseOrderStatus === "Pending") : []

                this.setState({ POListing: Listing, isPOListingSet: true })
            }

        }

        // if (prevProps.travelAgentAction !== this.props.travelAgentAction) {
        //     if (this.props.travelAgentAction.length > 0 && this.props.travelAgentAction[0].ReturnVal === 1) {
        //         this.props.ViewPackageAgentList({ agentCountryID: 0 })
        //         this.props.CallClearPackageAction()
        //     }
        // }

    }

    renderTableRows = (data, index) => {
        return (
            <>
                <TableCell align="left">
                    {data.ProductPurchaseOrderCode}
                </TableCell>
                <TableCell align="left"> {data.ShopName} </TableCell>
                <TableCell align="left">{data.ShopCity}</TableCell>
                <TableCell align="left"> {data.ProductPurchaseOrderStatus} </TableCell>
                <TableCell align="left">{data.CreatedDate}</TableCell>
            </>
        )
    }

    onTableRowClick = (event, row) => {
        this.setState({
            ProductPurchaseOrderID: row.ProductPurchaseOrderID,
            ProductPurchaseOrderCode: row.ProductPurchaseOrderCode,
            ProductPurchaseOrderStatus: row.ProductPurchaseOrderStatus,
            CreatedDate: row.CreatedDate,
            MerchantID: row.MerchantID,
            CompanyName: row.CompanyName,
            CompanyContactNo: row.CompanyContactNo,
            CompanyWebsite: row.CompanyWebsite,
            CompanyAddressLine1: row.CompanyAddressLine1,
            CompanyAddressLine2: row.CompanyAddressLine2,
            CompanyPoscode: row.CompanyPoscode,
            CompanyCity: row.CompanyCity,
            CompanyState: row.CompanyState,
            CompanyCountryID: row.CompanyCountryID,
            ProductPurchaseOrderDetail: row.ProductPurchaseOrderDetail,
        });

        if (this.state.detailsShown) {
            this.setState({
                detailsShown: false,
            });
        } else {
            this.setState({
                detailsShown: true,
            });
        }
    }


    render() {

        const tableHeadCells = [
            {
                id: "ProductQuotationCode",
                numeric: false,
                disablePadding: true,
                label: "Product Quotation Code",
                // label: "Grid Storage Code",
            },
            {
                id: "CompanyName",
                numeric: false,
                disablePadding: false,
                label: "Company Name",
                // label: "Rental Price (Month)",
            },
            {
                id: "CompanyCity",
                numeric: false,
                disablePadding: false,
                label: "Company City",
                // label: "Rental Price (Month)",
            },
            {
                id: "ProductQuotationStatus",
                numeric: false,
                disablePadding: false,
                label: "Status",
                // label: "Shoplot ID",
            },
            {
                id: "CreatedDate",
                numeric: true,
                disablePadding: false,
                label: "Created Date",
                // label: "Rental Price (Month)",
            },
        ];
        function a11yProps(index) {
            return {
                id: `scrollable-auto-tab-${index}`,
                "aria-controls": `scrollable-auto-tabpanel-${index}`,
            };
        }

        const handleChange = (event, newValue) => {
            let status = ""
            let databaseListing = this.props.POListing

            switch (newValue) {
                case 0:
                    status = "Pending"
                    break;
                case 1:
                    status = "SALEORDER"
                    break;
                case 2:
                    status = "Payable"
                    break;
                case 3:
                    status = "Received"
                    break;
                case 4:
                    status = "Endorsed"
                    break;

                default:
                    break;
            }
            databaseListing = databaseListing.length > 0 ? databaseListing.filter((x) => x.ProductPurchaseOrderStatus === status) : []
            this.setState({ tabValue: newValue, POListing: databaseListing });
        };

        return (
            <div style={{ width: "100%" }}>
                {!this.state.detailsShown ? (
                    <>
                        <h1 style={{ margin: "20px" }}>Purchase Order Listing</h1>
                        <AppBar position="static" color="default">
                            <Tabs
                                value={this.state.tabValue}
                                onChange={handleChange}
                                indicatorColor="primary"
                                textColor="primary"
                                variant="scrollable"
                                scrollButtons="auto"
                                aria-label="scrollable auto tabs example"
                            >
                                <Tab
                                    label="Pending"
                                    {...a11yProps(0)}
                                />
                                {localStorage.getItem("roleid") == 1 ||
                                    localStorage.getItem("roleid") == 2 ? (
                                    <Tab
                                        label="Seen by Supplier"
                                        {...a11yProps(1)}
                                    />
                                ) : null}
                                <Tab
                                    label="Replied SO"
                                    {...a11yProps(2)}
                                />
                                <Tab
                                    label="Received"
                                    {...a11yProps(3)}
                                />
                                {localStorage.getItem("roleid") == 1 ||
                                    localStorage.getItem("roleid") == 2 ? (
                                    <Tab
                                        label="Endorsed"
                                        {...a11yProps(4)}
                                    />
                                ) : null}
                            </Tabs>
                        </AppBar>
                        <div>
                            <TableComponents
                                // table settings 
                                tableTopLeft={<h3 style={{ fontWeight: 600 }}>Merchants List</h3>}
                                tableOptions={{
                                    dense: true,                // optional, default is false
                                    tableOrderBy: 'asc',        // optional, default is asc
                                    sortingIndex: "UserID",        // require, it must the same as the desired table header
                                    stickyTableHeader: true,    // optional, default is true
                                }}

                                paginationOptions={[5, 10, 25, { label: 'All', value: -1 }]} // optional, by default it will hide the table pagination. You should set settings for pagination options as in array, eg.: [5, 100, 250, { label: 'All', value: -1 }]
                                tableHeaders={tableHeadCells}        //required
                                tableRows={{
                                    renderTableRows: this.renderTableRows,   // required, it is a function, please refer to the example I have done in Table Components
                                    checkbox: false,                          // optional, by default is true
                                    checkboxColor: "primary",                // optional, by default is primary, as followed the MUI documentation
                                    onRowClickSelect: false                  // optional, by default is false. If true, the ** onTableRowClick() ** function will be ignored
                                }}
                                selectedIndexKey={"UserID"}                    // required, as follow the data targetting key of the row, else the data will not be chosen when checkbox is click. 
                                Data={
                                    this.state.POListing
                                    // this.state.isFiltered === false ?
                                    //     DataList.length > 0 && DataList.filter((x) => x.Userstatus === status)
                                    //     :
                                    //     this.state.filteredProduct.length > 0 && this.state.filteredProduct.filter((x) => x.Userstatus === status)
                                }                                 // required, the data that listing in the table
                                onSelectRow={(e) => this.setState({ selectedListID: e })}
                                onSelectAllRows={(e) => this.setState({ selectedListID: e })}
                                onTableRowClick={this.onTableRowClick}       // optional, onTableRowClick = (event, row) => { }. The function should follow the one shown, as it will return the data from the selected row
                            />
                        </div>
                    </>


                ) :

                    <ProductPurchaseOrderDetailsComponent
                        pageTitle={"Purchase Order Details"}
                        data={this.state}
                        data2={this.props}
                    />
                }


            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductPurchaseOrder);
