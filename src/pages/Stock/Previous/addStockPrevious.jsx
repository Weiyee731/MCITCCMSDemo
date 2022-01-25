import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../../store/action/gitAction";
import { Link } from "react-router-dom";

// Share Components
import ResponsiveDatePickers from "../../../tools/datePicker";
import SearchBar from "../../../components/SearchBar/SearchBar"
import { isStringNullOrEmpty, convertDateTimeToDDMMYY, isArrayNotEmpty, convertDateTimeToString112Format } from "../../../tools/Helpers";
import TableComponents from "../../../components/TableComponents/TableComponents";
import AlertDialog from "../../../components/ModalComponent/ModalComponent";
import Logo from "../../assets/logos/logo.png";
import { ArrowRoundedLeft8x13Svg } from '../../../assets/svg';
import "./OverallStock.css";

// UI Components
import { Button } from "@mui/material";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Select from 'react-select';
import SubmitIcon from '@mui/icons-material/Backup';
import GroupAddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Box from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText';
import { toast } from "react-toastify";
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import createHistory from 'history/createBrowserHistory'
const history = createHistory()


function mapStateToProps(state) {
    return {
        foods: state.counterReducer["foods"],
        allstocks: state.counterReducer["products"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        CallTesting: () => dispatch(GitAction.CallTesting()),
        CallAllProducts: (prodData) => dispatch(GitAction.CallAllProducts(prodData)),
    };
}

const headCells = [
    {
        id: 'ProductSKU',
        align: 'left',
        disablePadding: false,
        label: 'Product SKU ',
    },
    {
        id: 'ProductName',
        align: 'center',
        disablePadding: false,
        label: 'Product Name',
    },
    {
        id: 'Total Stock',
        align: 'center',
        disablePadding: false,
        label: 'Stock',
    },
    {
        id: 'TotalPrice',
        align: 'center',
        disablePadding: false,
        label: 'Total Price (RM)',
    },
    {
        id: 'Store',
        align: 'center',
        disablePadding: false,
        label: 'Store',
    },
];

const INITIAL_STATE = {
    OrderDate: new Date(),
    ReceiveDate: new Date(),
    StockInDate: new Date(),

    isDiscountClick: false,
    isBackClick: false,

    Remarks: "",
    StockPrice: "",
    StockInAmount: "",
    Store: [],
    InvoiceNo: "",

    isInvoiceError: false,
    isStoreError: false,
    isStockInAmountError: false,
    isStockPriceError: false,
    // isRemarkError: false,
    ReceiveValidated: true,
    OrderValidated: true,
    StockInValidated: true,
    searchKeywords: "",

    filteredProduct: [],
    isFiltered: false,
    isDataEdit: false,
    rowIndex: "",
    DraftNo: "",
    selectedListID: [],

    isOpenStockModal: true,
}

const StockInData = []

class AddStock extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE
        this.DataState = StockInData

        this.props.CallAllProducts({
            type: 'Merchant',
            typeValue: '0',
            userId: JSON.parse(localStorage.getItem("loginUser"))[0].UserID,
            productPage: '999',
            page: '1',
            ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID,
        });
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState) {
    }

    renderTableRows = (data, index) => {
        return (
            <>
                <TableCell
                    component="th"
                    id={`enhanced-table-checkbox-${index}`}
                    scope="row"
                    padding="normal"
                    style={{ width: "15%" }}
                >
                    {data.ProductSKU}
                </TableCell>
                <TableCell align="center" style={{ width: "35%" }}>{data.ProductName}</TableCell>
                <TableCell align="center" style={{ width: "15%" }}>{data.StockInAmount}</TableCell>
                <TableCell align="center" style={{ width: "15%" }}>{data.StockPrice}</TableCell>
                <TableCell align="center" style={{ width: "20%" }}>{data.Store.value}</TableCell>
            </>
        )
    }

    onTableRowClick = (event, row) => {
        this.setState({
            searchKeywords: row.SKU,
            DraftNo: row.DraftNo,
            rowIndex: row.rowIndex,
            filteredProduct: row.filteredProduct,
            OrderDate: row.OrderDate,
            ReceiveDate: row.ReceiveDate,
            InvoiceNo: row.InvoiceNo,
            Store: row.Store,

            StockInAmount: row.StockInAmount,
            StockPrice: row.StockPrice,
            isDiscountClick: row.isDiscountClick,
            Remarks: row.Remarks,

            isOpenStockModal: true,
            isDataEdit: true
        })
    }

    // Remove selected state listing and localStorage listing data
    onDelete = () => {
        let statelisting = this.DataState
        let localListing = localStorage.getItem("DataSetDraft") !== null ? JSON.parse(localStorage.getItem("DataSetDraft")) : []
        let selectedList = this.state.selectedListID
        let stateDraftNo = []

        // to remove state data
        if (statelisting.length > 0 && selectedList.length > 0) {
            selectedList.map((datalist) => {
                statelisting.filter((data) => data.ProductSKU !== datalist.ProductSKU).map((details) => {
                    stateDraftNo.push(details.DraftNo)
                })
            })
        }
        // to remove localstorage data
        if (localListing.length > 0 && stateDraftNo.length > 0) {
            stateDraftNo.map((DraftID) => {
                localListing = localListing.filter((data) => data.DraftNo !== DraftID)
            })
        }

        this.DataState = statelisting
        localStorage.setItem("DataSetDraft", JSON.stringify(localListing))
        this.setState({ selectedListID: [] })
    }

    onDateChange = (e, name) => {
        switch (name) {
            case "StockInDate":
                this.setState({ StockInDate: isStringNullOrEmpty(e) ? "Invalid Date" : e, StockInValidated: (!isStringNullOrEmpty(e) && e !== "Invalid Date") })
                break;

            case "OrderDate":
                this.setState({ OrderDate: isStringNullOrEmpty(e) ? "Invalid Date" : e, OrderValidated: (!isStringNullOrEmpty(e) && e !== "Invalid Date") })
                break;

            case "ReceiveDate":
                this.setState({ ReceiveDate: isStringNullOrEmpty(e) ? "Invalid Date" : e, ReceiveValidated: (!isStringNullOrEmpty(e) && e !== "Invalid Date") })
                break;

            default:
                break;
        }
    }

    handleFormInput = (e, name) => {
        switch (name) {
            case "Invoice":
                if (isStringNullOrEmpty(e.target.value))
                    this.setState({ InvoiceNo: e.target.value, isInvoiceError: true })
                else
                    this.setState({ InvoiceNo: e.target.value, isInvoiceError: false })

                break;

            case "Store":
                if (isStringNullOrEmpty(e))
                    this.setState({
                        Store: [{
                            id: e.id,
                            value: e.value,
                            label: e.label
                        }], isStoreError: true
                    })
                else
                    this.setState({
                        Store: [{
                            id: e.id,
                            value: e.value,
                            label: e.label
                        }], isStoreError: false
                    })
                break;

            case "StockIn":
                if (isStringNullOrEmpty(e.target.value))
                    this.setState({ StockInAmount: e.target.value, isStockInAmountError: true })
                else
                    this.setState({ StockInAmount: e.target.value, isStockInAmountError: false })
                break;

            case "StockPrice":
                if (isStringNullOrEmpty(e.target.value))
                    this.setState({ StockPrice: e.target.value, isStockPriceError: true })
                else
                    this.setState({ StockPrice: e.target.value, isStockPriceError: false })
                break;

            case "Remark":
                this.setState({ Remarks: e.target.value })
                break;

            default:
                break;

        }
    }

    // Search for corresponsing SKU
    searchSpace = (value) => {
        if (isStringNullOrEmpty(value)) {
            this.setState({ filteredProduct: [], searchKeywords: value })
        }
        else {
            this.setState({ searchKeywords: value })
            if (this.state.filteredProduct !== undefined) {
                this.state.filteredProduct.splice(0, this.state.filteredProduct.length)
                let filteredListing = []

                let DataSet = JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID === 1 ? this.props.allstocks :
                    JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID === 16 && this.props.allstocks !== undefined ? this.props.allstocks.filter((x) => parseInt(x.MerchantID) === parseInt(localStorage.getItem("loginUser")[0].UserID)) : []

                DataSet.length > 0 && DataSet.filter((searchedItem) =>
                    searchedItem.SKU !== null && searchedItem.SKU.toLowerCase().includes(
                        value.toLowerCase()
                    )
                ).map((filteredItem) => {
                    filteredListing.push(filteredItem);
                })

                if (filteredListing.length > 0)
                    this.state.filteredProduct.push(filteredListing[0])
            }
        }
    }

    // Check whether similar SKU product has been added into the list
    checkSimilarProduct = (product) => {
        let checkSimilar = false
        let listing = this.DataState

        console.log("pproduct checkSimilarProduct", product)

        if (listing.length > 0) {
            if (listing.filter((data) => data.ProductSKU == product.SKU).length > 0) {
                checkSimilar = true
                toast.warning("Duplicate Error : Product with SKU is already added in the list")
            }
        }

        return checkSimilar

    }

    // Check whether all input has been filled
    errorChecking = () => {
        let error = false
        if (!this.state.isInvoiceError && !this.state.isStoreError && !this.state.isStockInAmountError && !this.state.isStockPriceError
            && this.state.ReceiveValidated && this.state.OrderValidated && this.state.StockInValidated) {
            if (isStringNullOrEmpty(this.state.StockPrice) || isStringNullOrEmpty(this.state.StockInAmount) || isStringNullOrEmpty(this.state.Store) || isStringNullOrEmpty(this.state.InvoiceNo)) {
                error = true
                // } else if ((this.state.ReceiveDate < this.state.OrderDate) || (this.state.OrderDate > this.state.StockInDate) || (this.state.ReceiveDate > this.state.StockInDate)) {
                // toast.warning("Please cross check on date input")
                // error = true
            }
            else if ((convertDateTimeToDDMMYY(this.state.OrderDate) > convertDateTimeToDDMMYY(this.state.StockInDate))) {
                this.setState({ OrderValidated: false, StockInValidated: false })
                error = true
            } else if ((convertDateTimeToDDMMYY(this.state.ReceiveDate) < convertDateTimeToDDMMYY(this.state.OrderDate))) {
                this.setState({ OrderValidated: false, ReceiveValidated: false })
                error = true
            }
            else if ((convertDateTimeToDDMMYY(this.state.ReceiveDate) > convertDateTimeToDDMMYY(this.state.StockInDate))) {
                this.setState({ ReceiveValidated: false, StockInValidated: false })
                error = true

            } else {
                error = false
            }
        } else {
            error = true
        }
        return error
    }

    // Add data in a temporary listing without upload to database
    OnSubmitCache = () => {
        if (!this.errorChecking()) {
            let rowSize = this.DataState.length
            let index = localStorage.getItem("DataSetDraft") !== null && JSON.parse(localStorage.getItem("DataSetDraft")).length
            let DraftNo = localStorage.getItem("DataSetDraft") === null || localStorage.getItem("DataSetDraft") === "[]" ? 0 : JSON.parse(localStorage.getItem("DataSetDraft"))[index - 1].DraftNo + 1
            let Listing = []

            var DraftListing = {
                DraftNo: DraftNo,
                rowIndex: rowSize,
                filteredProduct: this.state.filteredProduct,
                ProductID: this.state.filteredProduct[0].ProductID,
                ProductName: this.state.filteredProduct[0].ProductName,
                ProductSKU: this.state.filteredProduct[0].SKU,

                InvoiceNo: this.state.InvoiceNo,
                Store: this.state.Store,
                StoreID: this.state.Store.id,
                OrderDate: this.state.OrderDate,
                ReceiveDate: this.state.ReceiveDate,
                StockInDate: this.state.StockInDate,

                StockPrice: this.state.StockPrice,
                StockInAmount: this.state.StockInAmount,
                isDiscountClick: this.state.isDiscountClick,
                Remarks: isStringNullOrEmpty(this.state.Remarks) ? "-" : this.state.Remarks,
            }

            if (localStorage.getItem("DataSetDraft") !== null) {
                Listing = JSON.parse(localStorage.getItem("DataSetDraft"))
            }

            this.DataState = [...this.DataState, DraftListing]      // add into state Listing
            Listing = [...Listing, DraftListing]                    // add into local storage
            localStorage.setItem("DataSetDraft", JSON.stringify(Listing))
            this.setState({ filteredProduct: [] })
            this.setState(INITIAL_STATE)
        }
        else {
            // toast.warning("Please fill in All require information")
            toast.warning("Input Error: Please cross check on All Stock Details Input")

        }
    }
    // Update data in a temporary listing without upload to database
    OnSubmitUpdateCache = (data, DraftNo) => {
        if (!this.errorChecking()) {
            let stateListing = this.DataState.length > 0 ? this.DataState : []
            stateListing.length > 0 && stateListing.map((list, index) => {
                if (index === data) {
                    stateListing[index] =
                    {
                        rowIndex: index,
                        DraftNo: DraftNo,
                        filteredProduct: this.state.filteredProduct,
                        ProductID: this.state.filteredProduct[0].ProductID,
                        ProductName: this.state.filteredProduct[0].ProductName,
                        ProductSKU: this.state.filteredProduct[0].SKU,

                        InvoiceNo: this.state.InvoiceNo,
                        Store: this.state.Store,
                        StoreID: this.state.Store.id,
                        OrderDate: this.state.OrderDate,
                        ReceiveDate: this.state.ReceiveDate,

                        StockPrice: this.state.StockPrice,
                        StockInAmount: this.state.StockInAmount,
                        isDiscountClick: this.state.isDiscountClick,
                        Remarks: isStringNullOrEmpty(this.state.Remarks) ? "-" : this.state.Remarks
                    }
                }
            })

            let localListing = localStorage.getItem("DataSetDraft") !== null ? JSON.parse(localStorage.getItem("DataSetDraft")) : []
            localListing.length > 0 && localListing.map((list, index) => {
                if (list.DraftNo === DraftNo) {
                    localListing[index] = {
                        rowIndex: index,
                        DraftNo: DraftNo,
                        filteredProduct: this.state.filteredProduct,
                        ProductID: this.state.filteredProduct[0].ProductID,
                        ProductName: this.state.filteredProduct[0].ProductName,
                        ProductSKU: this.state.filteredProduct[0].SKU,

                        InvoiceNo: this.state.InvoiceNo,
                        Store: this.state.Store,
                        StoreID: this.state.Store.id,
                        StockInDate: this.state.StockInDate,
                        OrderDate: this.state.OrderDate,
                        ReceiveDate: this.state.ReceiveDate,

                        StockPrice: this.state.StockPrice,
                        StockInAmount: this.state.StockInAmount,
                        isDiscountClick: this.state.isDiscountClick,
                        Remarks: isStringNullOrEmpty(this.state.Remarks) ? "-" : this.state.Remarks
                    }
                }
            })
            localStorage.setItem("DataSetDraft", JSON.stringify(localListing))
            this.setState(INITIAL_STATE)
        }
        else {
            toast.warning("Input Error: Please cross check on All Stock Details Input")
        }
    }

    OnHandleSubmitStock = () => {
        localStorage.setItem("DataSetDraft", JSON.stringify(this.DataState))
        localStorage.setItem("DataSetDraft2", [this.DataState])
        localStorage.setItem("DataSetDraft3", JSON.stringify([this.DataState]))
    }

    render() {
        const dummyStore =
            [
                { id: "1", Store: "Store A" },
                { id: "2", Store: "Store B" },
                { id: "3", Store: "Store C" },
            ]

        const TextFieldData = (type, variant, title, name, stateValue, error) => {
            return (
                <div className="col-12 col-md-6">
                    <TextField variant={variant} type={type} size="small" fullWidth label={title} value={stateValue} name={name} onChange={(e) => this.handleFormInput(e, name)} required />
                    {error && <FormHelperText sx={{ color: 'red' }} id={error}>Invalid {title} </FormHelperText>}
                </div>
            )
        }

        const DateData = (title, name, stateValue, error) => {
            return (
                <div className="col-12 col-md-6">
                    <ResponsiveDatePickers variant="standard" title={title} value={stateValue} onChange={(e) => this.onDateChange(e, name)} required />
                    {error === false && <FormHelperText sx={{ color: 'red' }} id={error}>Invalid {title} </FormHelperText>}
                </div>
            )
        }

        const ModalListing = () => {
            return (
                <>
                    <div className="row" style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                        <div className="col-2" style={{ textAlign: "left" }}>
                            <img height="100px" width="100px" alt="Image"
                                src={this.state.filteredProduct.length > 0 && this.state.filteredProduct[0].ProductImage !== null ? this.state.filteredProduct[0].ProductImage : Logo}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = Logo;
                                }}
                            />
                        </div>
                        <div className="col-8">
                            <div><label style={{ fontWeight: "bold" }}>Product Name: {this.state.filteredProduct.length > 0 && this.state.filteredProduct[0].ProductName !== null ? this.state.filteredProduct[0].ProductName : ""}</label></div>
                            <div><label style={{ fontSize: "13px", color: "lightslategrey" }}>Variation: {this.state.filteredProduct.length > 0 && this.state.filteredProduct[0].Variation !== null ? this.state.filteredProduct[0].Variation : ""}</label></div>
                            <div><label style={{ fontSize: "13px", color: "lightslategrey" }}>Brand: {this.state.filteredProduct.length > 0 && this.state.filteredProduct[0].Brand !== null ? this.state.filteredProduct[0].Brand : "No Brand"}</label></div>
                            <div><label style={{ fontSize: "13px", color: "lightslategrey" }}>Model:  {this.state.filteredProduct.length > 0 && this.state.filteredProduct[0].Model !== null ? this.state.filteredProduct[0].Model : "No Model"}</label></div>
                            <div><label style={{ fontSize: "13px", color: "lightslategrey" }}>SKU: {this.state.filteredProduct.length > 0 && this.state.filteredProduct[0].SKU !== null ? this.state.filteredProduct[0].SKU : ""}</label></div>
                        </div>
                    </div>
                    <hr />
                    <div className="row" style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                        {TextFieldData("text", "standard", "Purchase Order Number", "Invoice", this.state.InvoiceNo, this.state.isInvoiceError)}
                        {DateData("Order Date", "OrderDate", this.state.OrderDate, this.state.OrderValidated)}
                        <br />
                        <div className="col-12 col-md-6">
                            <FormControl variant="standard" size="small" fullWidth>
                                <InputLabel id="Store-label">Store</InputLabel>
                                <Select
                                    labelId="Store"
                                    id="Store"
                                    name="Store"
                                    value={this.state.Store[0]}
                                    onChange={(e) => this.handleFormInput(e, "Store")}
                                    label="Store"
                                    options={
                                        isArrayNotEmpty(dummyStore) && dummyStore.map((el, idx) => {
                                            return { id: el.id, value: el.Store, label: el.Store }
                                        })
                                    }
                                >
                                </Select>
                            </FormControl>
                        </div>
                        {DateData("Receive Date", "ReceiveDate", this.state.ReceiveDate, this.state.ReceiveValidated)}
                    </div>
                    <hr />
                    {
                        this.state.Store.length > 0 ?
                            <>
                                <div className="row" style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                                    <div className="col-12 col-md-6">
                                        <label style={{ color: "grey" }}>Current Stock : 75</label>
                                    </div>
                                    <div className="col-12 col-md-6" style={{ textAlign: "right" }}>
                                        <CheckBoxIcon style={{ color: this.state.isDiscountClick === true ? "blue" : "grey" }} onClick={() => this.setState({ isDiscountClick: !this.state.isDiscountClick })} /> <label style={{ color: "grey" }}>Discount</label>
                                    </div>
                                    {TextFieldData("number", "standard", "Stock In Amount", "StockIn", this.state.StockInAmount, this.state.isStockInAmountError)}
                                    {TextFieldData("number", "standard", "Stock Price", "StockPrice", this.state.StockPrice, this.state.isStockPriceError)}
                                    <div className="col-12 mt-3">
                                        <Box sx={{ width: '100%' }}>
                                            <TextField
                                                variant="outlined"
                                                size="large"
                                                name="Remark"
                                                label="Remark"
                                                value={this.state.Remarks}
                                                onChange={(e) => this.handleFormInput(e, "Remark")}
                                                fullWidth
                                            />
                                        </Box>
                                    </div>
                                </div>
                                <br />

                                <div className="col-12 col-md-12" style={{ textAlign: "right" }}>
                                    {
                                        this.state.isDataEdit ?
                                            <Button variant="contained" onClick={() => { this.OnSubmitUpdateCache(this.state.rowIndex, this.state.DraftNo) }} color="primary"  >
                                                Update
                                            </Button>
                                            :
                                            <Button variant="contained" onClick={() => { this.OnSubmitCache() }} color="primary"  >
                                                Submit
                                            </Button>
                                    }
                                </div>
                            </>
                            :
                            <div style={{ paddingBottom: "50px" }}>
                            </div>
                    }
                </>
            )
        }
        
        const goBack = () => {
            if (this.DataState.length > 0)
                this.setState({ isBackClick: true })
            else {
                history.push("/stockList")
                window.location.reload(false)
            }
        }

        return (
            <div className="container-fluid my-2" >
                <div className="row">
                    <div className="d-flex px-3">
                        <Button style={{ paddingLeft: "10px", paddingRight: "10px", textDecoration: "none", color: "black" }} onClick={() => goBack()}>
                            <ArrowRoundedLeft8x13Svg fontSize="inherit" style={{ margin: "10px" }} />
                            Back
                        </Button>
                        <h2 style={{ paddingTop: "5px" }}>Stock List</h2>
                        <div className="d-md-flex my-2" style={{ marginLeft: 'auto' }}>
                            <div style={{ width: '200px', marginLeft: 5 }}>
                                <ResponsiveDatePickers variant="standard" title="Stock In Date" value={this.state.StockInDate} onChange={(e) => this.onDateChange(e, "StockInDate")} />
                            </div>
                        </div>
                    </div>

                    <div className="w-100 container-fluid">
                        <TableComponents
                            tableTopRight={
                                <div className="row" style={{ display: "flex" }}>
                                    <Tooltip title="Add Stock">
                                        <IconButton size="small" sx={{ color: "#0074ea", marginRight: 4 }} onClick={() => this.setState({ isOpenStockModal: true, filteredProduct: [] })}>
                                            <GroupAddIcon />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            }

                            tableTopLeft={
                                this.DataState.length > 0 &&
                                <Tooltip title="Submit New Stock">
                                    <IconButton size="small" sx={{ color: "#0074ea", marginRight: 2, }} onClick={() => this.OnHandleSubmitStock()}>
                                        <SubmitIcon /> <label style={{ paddingLeft: "5px" }}>Upload Stock  </label>
                                    </IconButton>
                                </Tooltip>
                            }
                            tableOptions={{
                                dense: true,
                                tableOrderBy: 'asc',
                                sortingIndex: "fat",
                                stickyTableHeader: false,
                                stickyTableHeight: 300,
                                elevation: 1
                            }}
                            paginationOptions={[5, 100, 250, { label: 'All', value: -1 }]}
                            tableHeaders={headCells}
                            tableRows={{
                                renderTableRows: this.renderTableRows,
                                checkbox: true,
                                checkboxColor: "primary",
                                onRowClickSelect: false
                            }}
                            Data={this.DataState}
                            onSelectRow={(e) => this.setState({ selectedListID: e })}
                            onSelectAllRows={(e) => this.setState({ selectedListID: e })}
                            onTableRowClick={this.onTableRowClick}
                            SelectionActionButtons={<Tooltip title="Delete">
                                <IconButton aria-label="delete" onClick={() => { this.onDelete() }}   >
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>}
                        />
                    </div>
                </div>

                <AlertDialog
                    open={this.state.isOpenStockModal}
                    fullWidth
                    maxWidth="md"
                    handleToggleDialog={() => <>{this.setState(INITIAL_STATE)}{this.setState({ isOpenStockModal: false })}</>}
                    title="New Stock"
                    showAction={false}
                >
                    <div className="container-fluid">
                        <div className="container" style={{ padding: "10px" }}>
                            {
                                this.state.isDataEdit ? "" :
                                    <SearchBar
                                        id=""
                                        inputRef={input => input && input.focus()}
                                        autoFocus={true}
                                        placeholder="Enter Product SKU"
                                        buttonOnClick={() => this.onSearch("", "")}
                                        onChange={(e) => this.searchSpace(e.target.value)}
                                        className="searchbar-input mb-auto"
                                        tooltipText="Search with current data"
                                        value={this.state.searchKeywords}
                                    />
                            }
                            <hr />
                            {
                                this.state.isDataEdit ?
                                    this.state.filteredProduct.length > 0 && ModalListing()
                                    :
                                    this.state.filteredProduct.length > 0 && this.state.searchKeywords.length > 0 && this.checkSimilarProduct(this.state.filteredProduct[0]) === false && ModalListing()
                            }
                        </div>
                    </div>
                </AlertDialog >
                <AlertDialog
                    open={this.state.isBackClick}
                    fullWidth
                    maxWidth="sm"
                    handleToggleDialog={() => this.setState({ isBackClick: false })}
                    title="Reminder"
                    showAction={false}
                >
                    <div className="container-fluid">
                        <div className="container">
                            <label style={{ fontSize: "18px" }}>Are you sure to leave this page? All changes will temporary save into draft</label>
                            <div style={{ paddingTop: "10px" }}>
                                <p className="text-danger" style={{ fontSize: "16px" }}><i>Disclaimer: Draft will be remove on user logout</i></p>
                            </div>
                            <br />
                            <div style={{ textAlign: "right" }}>
                                <Button variant="contained" color="primary" style={{ margin: "10px" }}>
                                    <Link to={"/stockList"} style={{ textDecoration: "none", color: "white" }} >
                                        Yes
                                    </Link>
                                </Button>
                                <Button variant="contained" color="secondary" onClick={() => this.setState({ isBackClick: false })
                                }>
                                    No
                                </Button>
                            </div>
                        </div>
                    </div>
                </AlertDialog >
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddStock);