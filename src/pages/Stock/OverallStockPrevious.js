import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../store/action/gitAction";

import { Link } from "react-router-dom";

import { browserHistory } from "react-router";
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import DraftsIcon from '@mui/icons-material/Drafts';

// Share Components
import SearchBar from "../../components/SearchBar/SearchBar"
import { isArrayNotEmpty } from "../../tools/Helpers";
import TableComponents from "../../components/TableComponents/TableComponents";
import AlertDialog from "../../components/ModalComponent/ModalComponent";
import { convertDateTimeToDDMMYY, isStringNullOrEmpty } from "../../tools/Helpers";
import Logo from "../../assets/logos/logo.png";
import ResponsiveDatePickers from "../../tools/datePicker";
import "./OverallStock.css";

// UI Components
import MenuItem from '@mui/material/MenuItem';
import Select from 'react-select';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import GroupAddIcon from '@mui/icons-material/Add';
import Badge from '@mui/material/Badge';
import { toast } from "react-toastify";
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Box from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from "@mui/material";
// import ResponsiveDatePickers from "../../tools/datePicker";
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';



function mapStateToProps(state) {
    return {
        foods: state.counterReducer["foods"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        CallTesting: () => dispatch(GitAction.CallTesting()),
    };
}

const headCells = [
    {
        id: 'StockInDate',
        align: 'left',
        disablePadding: false,
        label: 'Stock In Date ',
    },
    {
        id: 'ProductSKU',
        align: 'center',
        disablePadding: false,
        label: 'ProductSKU',
    },
    {
        id: 'ProductName',
        align: 'center',
        disablePadding: false,
        label: 'Product Name',
    },
    {
        id: 'Store',
        align: 'center',
        disablePadding: false,
        label: 'Store',
    },
    {
        id: 'StockInAmount',
        align: 'center',
        disablePadding: false,
        label: 'Stock In Amount',
    },
    {
        id: 'StockPrice',
        align: 'center',
        disablePadding: false,
        label: 'Stock Price(RM)',
    },
];

function createData(StockInDate, ProductSKU, ProductName, Store, StockInAmount, StockPrice, StockID) {
    return {
        StockInDate,
        ProductSKU,
        ProductName,
        Store,
        StockInAmount,
        StockPrice,
        StockID
    };
}

const rows = [
    createData(1, 'Cupcake', 305, 3.7, 67, 4.3, 1),
    createData(2, 'Donut', 452, 25.0, 51, 4.9, 2),
    createData(3, 'Eclair', 262, 16.0, 24, 6.0, 3),
    createData(4, 'Frozen yoghurt', 159, 6.0, 24, 4.0, 4),
    createData(5, 'Gingerbread', 356, 16.0, 49, 3.9, 5),
    createData(6, 'Honeycomb', 408, 3.2, 87, 6.5, 6),
    createData(7, 'Ice cream sandwich', 237, 9.0, 37, 4.3, 7),
    createData(8, 'Jelly Bean', 375, 0.0, 94, 0.0, 8),
    createData(9, 'KitKat', 518, 26.0, 65, 7.0, 9),
    createData(10, 'Lollipop', 392, 0.2, 98, 0.0, 10),
    createData(11, 'Marshmallow', 318, 0, 81, 2.0, 11),
    createData(12, 'Nougat', 360, 19.0, 9, 37.0, 12),
    createData(13, 'Oreo', 437, 18.0, 63, 4.0, 13),
];


const INITIAL_STATE = {

    // DraftListing Details
    isOpenDraftModal: false,
    isDataEdit: false,

    OrderDate: new Date(),
    ReceiveDate: new Date(),
    StockInDate: new Date(),

    ProductData: [],
    Remarks: "",
    StockPrice: "",
    StockInAmount: "",
    Store: [],
    InvoiceNo: "",
    rowIndex: "",
    DraftNo: "",
    selectedListID: [],
    isDiscountClick: false,

    isInvoiceError: false,
    isStoreError: false,
    isStockInAmountError: false,
    isStockPriceError: false,
    ReceiveValidated: true,
    OrderValidated: true,
    StockInValidated: true,

    isSet: false,

    // Database Lisiting
    DBStockInDate: "",
}

const DraftListing_State = [{
    isDraftListingShown: false,
    storageListing: [],
}]

const OverallListing_State = []

class Stock extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE
        this.DraftListing = DraftListing_State
        this.DatabaseListing = OverallListing_State
    }

    componentDidMount() {
        if (localStorage.getItem("DataSetDraft") !== null &&
            JSON.parse(localStorage.getItem("DataSetDraft")).length > 0) {
            this.DraftListing[0].storageListing = JSON.parse(localStorage.getItem("DataSetDraft"))
            // this.setState({ storageListing: JSON.parse(localStorage.getItem("DataSetDraft")) })
        }

        if (rows.length > 0) {
            this.DatabaseListing = rows
        }
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
                >
                    {data.StockInDate}
                </TableCell>
                <TableCell align="center">{data.ProductSKU}</TableCell>
                <TableCell align="center">{data.ProductName}</TableCell>
                <TableCell align="center">{data.Store}</TableCell>
                <TableCell align="center">{data.StockInAmount}</TableCell>
                <TableCell align="center">{data.StockPrice}</TableCell>
            </>
        )
    }

    renderDraftTableRows = (data, index) => {
        return (
            <>
                <TableCell
                    component="th"
                    id={`enhanced-table-checkbox-${index}`}
                    scope="row"
                    padding="normal"
                >
                    {data.StockInDate !== undefined && convertDateTimeToDDMMYY(data.StockInDate)}
                </TableCell>
                <TableCell align="center">{data.ProductSKU}</TableCell>
                <TableCell align="center">{data.ProductName}</TableCell>
                <TableCell align="center">{data.Store[0].value}</TableCell>
                <TableCell align="center">{data.StockInAmount}</TableCell>
                <TableCell align="center">{data.StockPrice}</TableCell>

            </>
        )
    }

    onDraftTableRowClick = (event, row) => {
        console.log("row", row)
        this.setState({
            DraftNo: row.DraftNo,
            rowIndex: row.rowIndex,
            ProductData: row.filteredProduct,
            OrderDate: row.OrderDate,
            StockInDate: row.StockInDate,
            ReceiveDate: row.ReceiveDate,
            InvoiceNo: row.InvoiceNo,
            Store: row.Store,

            StockInAmount: row.StockInAmount,
            StockPrice: row.StockPrice,
            isDiscountClick: row.isDiscountClick,
            Remarks: row.Remarks,

            isOpenDraftModal: true,
        })
    }

    renderTableActionButton = () => {
        return (
            <div className="d-flex">
                <Tooltip sx={{ marginLeft: 5 }} title="Add New Items">
                    <IconButton onClick={(event) => { this.onAddButtonClick() }}>
                        <AddIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Buton">
                    <IconButton onClick={(event) => { this.onAddButtonClick() }}>
                        <AddIcon />
                    </IconButton>
                </Tooltip>
            </div>
        )
    }

    onTableRowClick = (event, row) => {
    }

    onAddButtonClick = (item) => {
        console.log('add button')
    }

    // Remove selected state listing and localStorage listing data
    onDelete = () => {
        // let statelisting = this.DataState
        let localListing = localStorage.getItem("DataSetDraft") !== null ? JSON.parse(localStorage.getItem("DataSetDraft")) : []
        let selectedList = this.state.selectedListID

        if (localListing.length > 0 && selectedList.length > 0) {
            selectedList.map((datalist) => {
                localListing = localListing.filter((data) => data.DraftNo !== datalist.DraftNo)
            })
        }
        localStorage.setItem("DataSetDraft", JSON.stringify(localListing))
        this.DraftListing[0].storageListing = localListing
        this.setState({ selectedListID: [] })
    }

    OnSubmitUpdateCache = (data, DraftNo) => {
        if (!this.errorChecking()) {
            let localListing = localStorage.getItem("DataSetDraft") !== null ? JSON.parse(localStorage.getItem("DataSetDraft")) : []
            localListing.length > 0 && localListing.map((list, index) => {
                if (list.DraftNo === DraftNo) {
                    localListing[index] = {
                        rowIndex: index,
                        DraftNo: DraftNo,
                        filteredProduct: this.state.ProductData,
                        ProductID: this.state.ProductData[0].ProductID,
                        ProductName: this.state.ProductData[0].ProductName,
                        ProductSKU: this.state.ProductData[0].SKU,

                        InvoiceNo: this.state.InvoiceNo,
                        Store: this.state.Store,
                        StoreID: this.state.Store.id,
                        OrderDate: this.state.OrderDate,
                        StockInDate: this.state.StockInDate,
                        ReceiveDate: this.state.ReceiveDate,

                        StockPrice: this.state.StockPrice,
                        StockInAmount: this.state.StockInAmount,
                        isDiscountClick: this.state.isDiscountClick,
                        Remarks: isStringNullOrEmpty(this.state.Remarks) ? "-" : this.state.Remarks
                    }
                }
            })
            localStorage.setItem("DataSetDraft", JSON.stringify(localListing))
            this.DraftListing[0].storageListing = localListing
            this.setState(INITIAL_STATE)
        }
        else {
            toast.warning("Input Error: Please cross check on All Stock Details Input")
        }
    }

    OnSubmitAdd = () => {
        if (!this.errorChecking()) {

            let localListing = localStorage.getItem("DataSetDraft") !== null ? JSON.parse(localStorage.getItem("DataSetDraft")) : []
            if (localListing.length > 0) {
                localListing = localListing.filter((data) => data.DraftNo !== this.state.DraftNo)
            }

            localStorage.setItem("DataSetDraft", JSON.stringify(localListing))
            this.DraftListing[0].storageListing = localListing
            this.setState(INITIAL_STATE)
            toast.success("New Stock Data has been added")

        } else {
            toast.warning("Input Error: Please cross check on All Stock Details Input")
        }
    }

    // Check whether all input has been filled
    errorChecking = () => {
        let error = false
        if (!this.state.isInvoiceError && !this.state.isStoreError && !this.state.isStockInAmountError && !this.state.isStockPriceError
            && this.state.ReceiveValidated && this.state.OrderValidated && this.state.StockInValidated) {
            if (isStringNullOrEmpty(this.state.StockPrice) || isStringNullOrEmpty(this.state.StockInAmount) || isStringNullOrEmpty(this.state.Store) || isStringNullOrEmpty(this.state.InvoiceNo)) {
                error = true
            } else if ((convertDateTimeToDDMMYY(this.state.OrderDate) > convertDateTimeToDDMMYY(this.state.StockInDate))) {
                this.setState({ OrderValidated: false, StockInValidated: false })
                error = true
            } else if ((convertDateTimeToDDMMYY(this.state.ReceiveDate) < convertDateTimeToDDMMYY(this.state.OrderDate))) {
                this.setState({ OrderValidated: false, ReceiveValidated: false })
                error = true
            }
            else if ((convertDateTimeToDDMMYY(this.state.ReceiveDate) > convertDateTimeToDDMMYY(this.state.StockInDate))) {
                this.setState({ ReceiveValidated: false, StockInValidated: false })
                error = true
            }
            else {
                error = false
            }
        } else {
            error = true
        }
        return error
    }

    onDateChange = (e, name) => {

        console.log("e", e)
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

            case "DBStockInDate":
                this.setState({ DBStockInDate: isStringNullOrEmpty(e) ? "Invalid Date" : e, DBStockInDateValidated: (!isStringNullOrEmpty(e) && e !== "Invalid Date") })
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
                console.log("eeee", e)
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

        const ModalListing = (filteredProduct) => {
            return (
                <>
                    <div className="col-12 col-md-2" style={{ float: "right" }}>
                        <ResponsiveDatePickers variant="standard" title="Stock In Date" value={this.state.StockInDate} onChange={(e) => this.onDateChange(e, "StockInDate")} required />
                        {this.state.StockInValidated === false && <FormHelperText sx={{ color: 'red' }} id={this.state.StockInValidated}>Invalid Stock In Date </FormHelperText>}
                    </div>
                    <div className="row" style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                        <div className="col-2" style={{ textAlign: "left" }}>
                            <img height="100px" width="100px" alt="Image"
                                src={filteredProduct.length > 0 && filteredProduct[0].ProductImage !== null ? filteredProduct[0].ProductImage : Logo}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = Logo;
                                }}
                            />
                        </div>
                        <div className="col-8">
                            <div><label style={{ fontWeight: "bold" }}>Product Name: {filteredProduct.length > 0 && filteredProduct[0].ProductName !== null ? filteredProduct[0].ProductName : ""}</label></div>
                            <div><label style={{ fontSize: "13px", color: "lightslategrey" }}>Variation: {filteredProduct.length > 0 && filteredProduct[0].Variation !== null ? filteredProduct[0].Variation : ""}</label></div>
                            <div><label style={{ fontSize: "13px", color: "lightslategrey" }}>Brand: {filteredProduct.length > 0 && filteredProduct[0].Brand !== null ? filteredProduct[0].Brand : "No Brand"}</label></div>
                            <div><label style={{ fontSize: "13px", color: "lightslategrey" }}>Model:  {filteredProduct.length > 0 && filteredProduct[0].Model !== null ? filteredProduct[0].Model : "No Model"}</label></div>
                            <div><label style={{ fontSize: "13px", color: "lightslategrey" }}>SKU: {filteredProduct.length > 0 && filteredProduct[0].SKU !== null ? filteredProduct[0].SKU : ""}</label></div>
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
                                            <Button variant="contained"
                                                // onClick={() =>   { this.OnSubmitUpdateCache(this.state.rowIndex, this.state.DraftNo) }} 
                                                color="primary"  >
                                                Update
                                            </Button>
                                            :
                                            <>
                                                <Button variant="contained"
                                                    onClick={() => { this.OnSubmitUpdateCache(this.state.rowIndex, this.state.DraftNo) }}
                                                    color="secondary" style={{ margin: "10px" }}>
                                                    Update Draft
                                                </Button>
                                                <Button variant="contained"
                                                    onClick={() => { this.OnSubmitAdd() }}
                                                    color="primary"  >
                                                    Add Stock
                                                </Button>
                                            </>
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

        console.log(localStorage.getItem("DataSetDraft") !== null &&
            JSON.parse(localStorage.getItem("DataSetDraft")).length > 0 &&
            JSON.parse(localStorage.getItem("DataSetDraft")))

        return (
            <div className="container-fluid my-2">
                <div className="row">
                    <div className="col-md-12 col-12 mb-2 d-flex">
                        <div className="col-2 d-inline-flex">
                            {/* <label className="my-auto col-2">Filter By:</label> */}
                            <Select
                                labelId="search-filter-category"
                                id="search-filter-category"
                                label="Search By"
                                onChange={this.handleSearchCategory}
                                size="small"
                                IconComponent={FilterListOutlinedIcon}
                                className="col-11"
                                placeholder="filter by"
                            >
                                <MenuItem key="search_all" value="All">All</MenuItem>
                                <MenuItem key="search_tracking" value="Tracking">Product SKU</MenuItem>
                                <MenuItem key="search_member" value={"Member"}>Product Name</MenuItem>
                                <MenuItem key="search_container" value={"Container"}>Store</MenuItem>
                            </Select>
                        </div>
                        <div className="col-4 d-inline-flex">
                            <SearchBar
                                id=""
                                placeholder="Enter Product SKU, Product Name or Store to search"
                                buttonOnClick={() => this.onSearch("", "")}
                                onChange={this.handleSearchInput}
                                className="searchbar-input mb-auto"
                                disableButton={this.state.isDataFetching}
                                tooltipText="Search with current data"
                                value={this.state.searchKeywords}
                            />
                        </div>
                        {/* <div className="col-3 d-inline-flex">
                            <ResponsiveDatePickers variant="outlined" style={{borderColor:"grey"}} size="small" title="Stock In Date" value={this.state.DBStockInDate} onChange={(e) => this.onDateChange(e, "DBStockInDate")} />
                        </div> */}

                        {/* <label className="my-auto" style={{ marginRight: '15px' }}> </label> */}
                        {/* <ResponsiveDatePickers title="Stock In Date" value={this.state.DBStockInDate} onChange={(e) => this.onDateChange(e, "DBStockInDate")} /> */}
                        {/* <ResponsiveDatePickers
                            rangePicker
                            openTo="day"
                            title="FromDate"
                            value={this.state.datevalue ? this.state.datevalue : ""}
                            onChange={(e) => this.onDateChange(e)}
                            variant="outlined"
                            startPickerPropsOptions={{ placeholder: "From", className: "start-date-picker" }}
                            endPickerPropsOptions={{ placeholder: "To", className: "end-date-picker" }}
                        /> */}
                        {/* <Tooltip title="Search Date">
                            <IconButton
                                aria-label="Search Date"
                                size="small"
                                onClick={() => { this.onDatabaseSearch() }}
                                sx={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: '5px', border: '1px solid rgba(33, 33, 33, 0.6)' }}
                                disabled={this.state.isDataFetching}
                            >
                                <ManageSearchOutlinedIcon fontSize="medium" />
                            </IconButton>
                        </Tooltip> */}
                    </div>
                    {/* <div className="row">
                        <div className="col-md-4 col-12 mb-2">
                            <div className="filter-down row">
                                <div className="d-inline-flex w-100">
                                    <label className="my-auto col-3">Filter By:</label>
                                    <Select
                                        labelId="search-filter-category"
                                        id="search-filter-category"
                                        label="Search By"
                                        onChange={this.handleSearchCategory}
                                        size="small"
                                        IconComponent={FilterListOutlinedIcon}
                                        className="col-9"
                                        placeholder="filter by"
                                    >
                                        <MenuItem key="search_all" value="All">All</MenuItem>
                                        <MenuItem key="search_tracking" value="Tracking">Product SKU</MenuItem>
                                        <MenuItem key="search_member" value={"Member"}>Product Name</MenuItem>
                                        <MenuItem key="search_container" value={"Container"}>Store</MenuItem>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-12 d-flex">
                            <div className="pr-1 w-100">
                                <SearchBar
                                    id=""
                                    placeholder="Enter Product SKU, Product Name or Store to search"
                                    buttonOnClick={() => this.onSearch("", "")}
                                    onChange={this.handleSearchInput}
                                    className="searchbar-input mb-auto"
                                    disableButton={this.state.isDataFetching}
                                    tooltipText="Search with current data"
                                    value={this.state.searchKeywords}
                                />
                            </div>
                        </div>
                    </div> */}

                    <h1>Stock List</h1>
                    <div className="w-100 container-fluid">
                        <TableComponents
                            tableTopRight={
                                <div className="d-flex">
                                    <Tooltip title="Add Stock">
                                        <IconButton size="small" sx={{ color: "#0074ea", marginRight: 1 }}>
                                            <Link className="nav-link" to={"/addStock"}>
                                                <GroupAddIcon />
                                            </Link>
                                        </IconButton>
                                    </Tooltip>
                                    {
                                        localStorage.getItem("DataSetDraft") !== null && JSON.parse(localStorage.getItem("DataSetDraft")).length > 0 &&
                                        <Tooltip title="Draft Listing">
                                            <IconButton size="small" sx={{ color: "#0074ea", marginRight: 2 }} onClick={() => <>{this.DraftListing[0].isDraftListingShown = true}
                                                {this.setState({ isSet: true })}
                                            </>}>
                                                <Badge badgeContent={JSON.parse(localStorage.getItem("DataSetDraft")).length} color="primary">
                                                    <DraftsIcon />
                                                </Badge>
                                            </IconButton>
                                        </Tooltip>
                                    }

                                </div>

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
                            Data={rows}
                            onSelectRow={(e) => console.log(e)}
                            onSelectAllRows={(e) => console.log(e)}
                            onTableRowClick={this.onTableRowClick}
                            SelectionActionButtons={<Button onClick={() => alert('hi')}>SelectionActionButtons</Button>}
                        />
                    </div>
                </div>
                <AlertDialog
                    open={this.DraftListing[0].isDraftListingShown}
                    fullWidth={true}
                    maxWidth="xl"
                    handleToggleDialog={() => <>{this.DraftListing[0].isDraftListingShown = false}
                        {this.setState({ isSet: false })}
                    </>}
                >
                    <TableComponents
                        tableTopLeft={<h3>Unsaved Stock Listing</h3>}
                        tableOptions={{
                            dense: true,
                            tableOrderBy: 'asc',
                            sortingIndex: "DraftNo",
                            stickyTableHeader: false,
                            stickyTableHeight: 300,
                            elevation: 1
                        }}
                        paginationOptions={[10, 15, 20, { label: 'All', value: -1 }]}
                        tableHeaders={headCells}
                        tableRows={{
                            renderTableRows: this.renderDraftTableRows,
                            checkbox: true,
                            checkboxColor: "primary",
                            onRowClickSelect: false
                        }}
                        Data={this.DraftListing[0].storageListing}
                        onSelectRow={(e) => this.setState({ selectedListID: e })}
                        onSelectAllRows={(e) => this.setState({ selectedListID: e })}
                        onTableRowClick={this.onDraftTableRowClick}
                        SelectionActionButtons={<Tooltip title="Delete">
                            <IconButton aria-label="delete" onClick={() => { this.onDelete() }}   >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>}
                    />
                </AlertDialog >
                <AlertDialog
                    open={this.state.isOpenDraftModal}
                    fullWidth
                    maxWidth="md"
                    handleToggleDialog={() => this.setState(INITIAL_STATE)}
                    title="Draft Stock"
                    showAction={false}
                >
                    <div className="container-fluid">
                        <div className="container" style={{ padding: "10px" }}>
                            {ModalListing(this.state.ProductData)}
                        </div>
                    </div>
                </AlertDialog >
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Stock);