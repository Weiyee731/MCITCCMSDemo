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
import TableCell from '@mui/material/TableCell';
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AppBar from "@material-ui/core/AppBar";

import ProductPurchaseOrderDetailsComponent from './ProductPurchaseOrderDetailsComponent';

// Share Components
import TableComponents from "../../components/TableComponents/TableComponents";


function mapStateToProps(state) {
    return {
        quotations: state.counterReducer["quotations"],
        quotationAction: state.counterReducer["quotationAction"],

    };
}

function mapDispatchToProps(dispatch) {
    return {

        CallViewProductQuotation: (orderData) =>
            dispatch(GitAction.CallViewProductQuotation(orderData)),
        CallDeleteQuotation: (orderData) =>
            dispatch(GitAction.CallDeleteQuotation(orderData)),

    };
}

const INITIAL_STATE = {
    tabValue: "",
    QuotationListing: "",
    isQuotationSet: false,

    ProductQuotationID: "",
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
    }


    componentDidMount() {

        this.props.CallViewProductQuotation(JSON.parse(localStorage.getItem("loginUser"))[0].UserID)

    }
    componentDidUpdate(prevProps) {

        if (prevProps.quotations !== this.props.quotations) {
            if (this.state.isQuotationSet === false && this.props.quotations.length > 0) {
                let Listing = this.props.quotations
                Listing = Listing.length > 0 ? Listing.filter((x) => x.ProductQuotationStatus === "Pending") : []

                this.setState({ QuotationListing: Listing, isQuotationSet: true })
            }
        }
    }

    renderTableRows = (data, index) => {
        return (
            <>
                <TableCell align="left">
                    {data.ProductQuotationCode}
                </TableCell>
                <TableCell align="left"> {data.ShopName} </TableCell>
                <TableCell align="left">{data.ShopCity}</TableCell>
                <TableCell align="left"> {data.ProductQuotationStatus} </TableCell>
                <TableCell align="left">{data.CreatedDate}</TableCell>
            </>
        )
    }

    onTableRowClick = (event, row) => {
        this.setState({
            ProductQuotationID: row.ProductQuotationID,
            ProductPurchaseOrderCode: row.ProductQuotationCode,
            ProductPurchaseOrderStatus: row.ProductQuotationStatus,
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
            ProductPurchaseOrderDetail: row.ProductQuotationDetail,
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
            let databaseListing = this.props.quotations

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
                    status = "Delivered"
                    break;
                case 4:
                    status = "History"
                    break;

                default:
                    break;
            }
            databaseListing = databaseListing.length > 0 ? databaseListing.filter((x) => x.ProductQuotationStatus === status) : []
            this.setState({ tabValue: newValue, QuotationListing: databaseListing });
        };

        return (
            <div style={{ width: "100%" }}>
                {!this.state.detailsShown ? (
                    <>
                        <h1 style={{ margin: "20px" }}>Quotation Listing</h1>
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
                                {localStorage.getItem("roleid") <= 2 ? (
                                    <Tab
                                        label="Seen by Merchant"
                                        {...a11yProps(1)}
                                    />
                                ) : null}
                                <Tab
                                    label="Replied PO"
                                    {...a11yProps(2)}
                                />
                                <Tab
                                    label="Delivered"
                                    {...a11yProps(3)}
                                />
                                {localStorage.getItem("roleid") <= 2 ? (
                                    <Tab
                                        label="History"
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
                                    this.state.QuotationListing
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
