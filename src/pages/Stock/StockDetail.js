import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../store/action/gitAction";
import { Link } from "react-router-dom";

// Share Components
import ResponsiveDatePickers from "../../tools/datePicker";
import SearchBar from "../../components/SearchBar/SearchBar"
import { isStringNullOrEmpty, convertDateTimeToDDMMYY, isArrayNotEmpty, convertDateTimeToString112Format } from "../../tools/Helpers";
import TableComponents from "../../components/TableComponents/TableComponents";
import AlertDialog from "../../components/ModalComponent/ModalComponent";
import Logo from "../../assets/logos/logo.png";
import { ArrowRoundedLeft8x13Svg } from '../../assets/svg';
import "./OverallStock.css";
import { url } from "../../tools/Helpers";

// UI Components
import { Button } from "@mui/material";
import Select from 'react-select';
import GroupAddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import { toast } from "react-toastify";
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

import createHistory from 'history/createBrowserHistory'
const history = createHistory()


function mapStateToProps(state) {
    return {
        // foods: state.counterReducer["foods"],
        allstocks: state.counterReducer["products"],
        variationStock: state.counterReducer["variationStock"],
        variationAction: state.counterReducer["variationAction"],
        grid: state.counterReducer["grid"],
        variationStockDetails: state.counterReducer["variationStockDetails"],

    };
}

function mapDispatchToProps(dispatch) {
    return {
        CallAllProducts: (prodData) => dispatch(GitAction.CallAllProducts(prodData)),
        CallUpdateProductVariationStockDetails: (prodData) => dispatch(GitAction.CallUpdateProductVariationStockDetails(prodData)),
        CallAddProductVariationStock: (prodData) => dispatch(GitAction.CallAddProductVariationStock(prodData)),
        CallDeleteProductVariationStock: (prodData) => dispatch(GitAction.CallDeleteProductVariationStock(prodData)),
        CallGridList: (prodData) => dispatch(GitAction.CallGridList(prodData)),
        CallResetProductVariationStock: () => dispatch(GitAction.CallResetProductVariationStock()),
        CallViewAllProductVariationStock: (prodData) => dispatch(GitAction.CallViewAllProductVariationStock(prodData)),
        CallViewProductVariationStockDetails: (prodData) => dispatch(GitAction.CallViewProductVariationStockDetails(prodData)),

    };
}

const headCells = [
    {
        id: 'ProductVariation',
        align: 'left',
        disablePadding: false,
        label: 'Product Variation ',
    },
    {
        id: 'GridStorage',
        align: 'center',
        disablePadding: false,
        label: 'Store',
    },
    {
        id: 'ProductStockAmount',
        align: 'center',
        disablePadding: false,
        label: 'Stock Amount',
    },
    {
        id: 'ProductVariationCost',
        align: 'center',
        disablePadding: false,
        label: 'Variation Cost (RM)',
    },
];

const INITIAL_STATE = {

    isBackClick: false,
    stockListData: [],
    stockProductData: [],
    isStockListSet: false,
    isParentListSet: false,
    filteredData: [],

    selectedListID: [],

    // GridStorageID: [],
    GridStorage: [],
    ProductStockAmount: "",
    isProductStockAmountError: false,
    ProductVariationCost: "",
    isProductVariationCostError: false,

    ProductVariation: "",
    ProductVariationValue: "",
    ProductVariationStockID: "",
    ProductVariationSKU: "",

    isOpenStockModal: false,
    ProductID: "",
    ProductName: ""

}

const StockInData = []

class StockDetail extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE
        this.DataState = StockInData

        this.props.CallGridList({ ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID })

        this.props.CallAllProducts({
            type: 'Merchant',
            typeValue: '0',
            userId: JSON.parse(localStorage.getItem("loginUser"))[0].UserID,
            productPage: '999',
            page: '1',
            ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID,
        });
        this.props.CallViewAllProductVariationStock({
            ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID,
            ProductID: 0,
            ProductPerPage: 999,
            Page: 1
        })
        this.props.CallViewProductVariationStockDetails({
            ProductVariationDetailID: this.checkDetailID(),
            ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID
        })
    }

    componentDidMount() {
        if (this.props.match.params.ProductVariationDetailID !== undefined) {
            let ProductVariationDetailID = this.props.match.params.ProductVariationDetailID.split("-")
            if (ProductVariationDetailID.length > 1 && !isNaN(ProductVariationDetailID[1])) {
                this.setState({ ProductID: ProductVariationDetailID[1] })
            }
        }

        if (this.props.variationStockDetails !== null && this.props.variationStockDetails.length > 0 && this.state.isStockListSet === false) {
            // this.DataState = this.props.variationStock.length > 0 && this.props.variationStock.filter((data) => data.ProductVariationStockID === this.props.match.params.ProductVariationDetailID)
            if (this.checkDetailID() === "0" && this.state.ProductID !== "") {
                let listing = this.props.variationStockDetails
                let filteredListing = []
                filteredListing = listing.length > 0 && listing.filter((x) => parseInt(x.ProductID) === parseInt(this.state.ProductID))
                this.setState({ stockListData: filteredListing, isStockListSet: true, ProductName: filteredListing.length > 0 ? filteredListing[0].ProductName : "" })
            } else
                this.setState({ stockListData: this.props.variationStockDetails, isStockListSet: true })
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.variationAction.length > 0 && this.props.variationAction[0].ReturnVal === "1") {
            this.props.CallResetProductVariationStock()
            toast.success("Stock is update")
        }

        if (this.props.variationStockDetails !== null && this.props.variationStockDetails.length > 0 && this.state.isStockListSet === false) {
            // this.DataState = this.props.variationStock.length > 0 && this.props.variationStock.filter((data) => data.ProductVariationStockID === this.props.match.params.ProductVariationDetailID)
            // this.setState({ stockListData: this.props.variationStockDetails, isStockListSet: true })
            if (this.checkDetailID() === "0" && this.state.ProductID !== "") {
                let listing = this.props.variationStockDetails
                let filteredListing = []
                filteredListing = listing.length > 0 && listing.filter((x) => parseInt(x.ProductID) === parseInt(this.state.ProductID))
                this.setState({ stockListData: filteredListing, isStockListSet: true, ProductName: filteredListing.length > 0 ? filteredListing[0].ProductName : "" })

            } else
                this.setState({ stockListData: this.props.variationStockDetails, isStockListSet: true })
        }
    }

    renderTableRows = (data, index) => {
        return (
            <>
                <TableCell
                    component="th"
                    id={`enhanced-table-checkbox-${index}`}
                    scope="row"
                    padding="normal"
                    style={{ width: "40%" }}
                >
                    {data.ProductVariation} - ({data.ProductVariationValue})
                </TableCell>
                <TableCell align="center" style={{ width: "20%" }}>{data.GridStorage}</TableCell>
                <TableCell align="center" style={{ width: "20%" }}>{data.ProductStockAmount}</TableCell>
                <TableCell align="center" style={{ width: "20%" }}>{data.ProductVariationCost}</TableCell>
            </>
        )
    }

    onTableRowClick = (event, row) => {
        let filteredProduct = []

        filteredProduct = this.props.variationStock !== null && this.props.variationStock.length > 0 &&
            this.props.variationStock.filter((x) => parseInt(x.ProductVariationDetailID) === parseInt(row.ProductVariationDetailID))
        // parseInt(this.props.match.params.ProductVariationDetailID))

        this.setState({
            GridStorage: [{
                id: row.GridStorageID,
                label: row.GridStorage,
                value: row.GridStorage,
            }],

            ProductStockAmount: row.ProductStockAmount,
            ProductVariationCost: row.ProductVariationCost,

            ProductVariation: row.ProductVariation,
            ProductVariationValue: row.ProductVariationValue,
            ProductVariationStockID: row.ProductVariationStockID,
            ProductVariationSKU: row.ProductVariationSKU,

            filteredData: filteredProduct,
            isOpenStockModal: true,
        })
    }

    // Remove selected state listing and localStorage listing data
    onDelete = () => {

        let deleteIDListing = []
        let Listing = this.state.stockListData
        this.state.selectedListID.length > 0 && this.state.selectedListID.map((x) => {
            deleteIDListing.push(x.ProductVariationStockID)
        })
        deleteIDListing.length > 0 && deleteIDListing.map((id) => {
            Listing = Listing.length > 0 && Listing.filter((data) => data.ProductVariationStockID !== id)
        })

        this.props.CallDeleteProductVariationStock({
            ProductVariationStockID: deleteIDListing,
            UserID: JSON.parse(localStorage.getItem("loginUser"))[0].UserID,
            ApprovedBy: JSON.parse(localStorage.getItem("loginUser"))[0].UserID,
        })

        this.setState({ stockListData: Listing, selectedListID: [] })
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

    OnSubmitUpdate = () => {
        if (!this.errorChecking()) {

            let Listing = this.state.stockListData

            Listing.map((data, index) => {
                if (data.ProductVariationStockID === this.state.ProductVariationStockID) {
                    Listing[index].GridStorage = this.state.GridStorage[0].label
                    Listing[index].GridStorageID = this.state.GridStorage[0].id
                    Listing[index].ProductStockAmount = this.state.ProductStockAmount
                    Listing[index].ProductVariation = this.state.ProductVariation
                    Listing[index].ProductVariationCost = this.state.ProductVariationCost
                    Listing[index].ProductVariationSKU = this.state.ProductVariationSKU
                    Listing[index].ProductVariationStockID = this.state.ProductVariationStockID
                    Listing[index].ProductVariationValue = this.state.ProductVariationValue
                }
            })

            this.props.CallUpdateProductVariationStockDetails({
                ProductVariationStockID: this.state.ProductVariationStockID,
                UserID: JSON.parse(localStorage.getItem("loginUser"))[0].UserID,
                ApprovedBy: JSON.parse(localStorage.getItem("loginUser"))[0].UserID,
                ProductStock: this.state.ProductStockAmount,
                ProductVariationCost: this.state.ProductVariationCost,
                GridStorage: this.state.GridStorage[0].id,
            })

            this.setState({ stockListData: Listing, isOpenStockModal: false })
        }
        else {
            toast.warning("Input Error: Please cross check on All Stock Details Input")
        }
    }

    // Check whether all input has been filled
    errorChecking = () => {
        let error = false

        if (this.state.isProductStockAmountError === true || this.state.isProductStockAmountError === undefined)
            error = true
        else if (this.state.isProductVariationCostError === true || this.state.isProductVariationCostError === undefined)
            error = true

        return error
    }

    handleFormInput = (e, name, index) => {
        let storeListing = this.state.StoreStockInData
        switch (name) {
            case "Store":
                this.setState({
                    GridStorage: [{
                        id: e.id,
                        label: e.label,
                        value: e.value,
                    }]
                })
                break;

            case "StockInAmount":
                let isStockInAmountError = false
                if (isStringNullOrEmpty(e.target.value))
                    isStockInAmountError = true
                this.setState({ ProductStockAmount: e.target.value, isProductStockAmountError: isStockInAmountError })
                break;

            case "VariationCost":
                let isVariationCostError = false
                if (isStringNullOrEmpty(e.target.value))
                    isVariationCostError = true
                this.setState({ ProductVariationCost: e.target.value, isProductVariationCostError: isVariationCostError })
                break;

            default:
                break;
        }
    }

    checkDetailID = () => {
        let ProductVariationDetailID = this.props.match.params.ProductVariationDetailID
        if (ProductVariationDetailID !== undefined) {
            return ProductVariationDetailID.split("-")[0]
        }
    }

    render() {

        const TextFieldData = (type, variant, title, name, stateValue, error, index) => {
            return (
                <div className="col-12 col-md-12" style={{ paddingBottom: "10px" }}>
                    <TextField variant={variant} type={type} size="small" inputProps={{ min: "0", step: name === "StockInAmount" ? "1.00" : "0.10" }} fullWidth label={title} value={name === "StockInAmount" ? parseFloat(stateValue).toFixed(0) : stateValue} name={name} onChange={(e) => this.handleFormInput(e, name, index)}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">{name === "StockInAmount" ? "  " : "RM"}</InputAdornment>,
                        }}
                        required />
                    {error && <FormHelperText sx={{ color: 'red' }} id={error}>Invalid {title} </FormHelperText>}
                </div>
            )
        }

        const ModalListing = (filteredProduct) => {
            return (
                <>
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
                            <div><label style={{ fontWeight: "bold" }}>Product Name: {filteredProduct.length > 0 && filteredProduct[0].ProductName !== null ? filteredProduct[0].ProductName : ""}</label>
                                <label onClick={() => window.location = url.inventoryProduct(filteredProduct[0].ProductID)} style={{ color: "blue", paddingTop: "9px", paddingLeft: "10px", fontSize: "10px" }}>Click to view Product Info</label>
                            </div>
                            <div><label style={{ fontSize: "13px", color: "lightslategrey" }}>Variation:{this.state.ProductVariation} - ({this.state.ProductVariationValue} )</label></div>
                            <div><label style={{ fontSize: "13px", color: "lightslategrey" }}>SKU: {this.state.ProductVariationSKU}</label></div>
                        </div>
                    </div>
                    <hr />
                    <div className="row" style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                        <div className="col-12 col-md-6">
                            <div className="row">

                                <div className="col-12 col-md-10" >
                                    <FormControl variant="standard" size="small" fullWidth>
                                        <InputLabel id="Store-label">Store</InputLabel>
                                        <Select
                                            labelId="Store"
                                            id="Store"
                                            name="Store"
                                            value={this.state.GridStorage}
                                            onChange={(e) => this.handleFormInput(e, "Store")}
                                            label="Store"
                                            options={
                                                isArrayNotEmpty(this.props.grid) && this.props.grid.map((el, idx) => {
                                                    return { id: el.GridStorageID, value: el.GridStorage, label: el.GridStorage }
                                                })
                                            }
                                        >
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>
                        </div>
                        {
                            this.state.GridStorage.length > 0 ?
                                <>
                                    <br />
                                    <div className="col-12 col-md-6">
                                        {TextFieldData("number", "outlined", "Stock In Amount", "StockInAmount", this.state.ProductStockAmount, this.state.isProductStockAmountError)}
                                        {TextFieldData("number", "outlined", "Variation Cost", "VariationCost", this.state.ProductVariationCost, this.state.isProductVariationCostError)}
                                    </div>
                                    <br />
                                    <hr />
                                    <div className="row">
                                        <div className="col-12 col-md-12" style={{ textAlign: "right" }}>
                                            <Button variant="contained" onClick={() => { this.OnSubmitUpdate(this.state.rowIndex, this.state.DraftNo) }} color="primary"  >
                                                Update
                                            </Button>
                                        </div>
                                    </div>
                                </>
                                :
                                <div style={{ paddingBottom: "50px" }}>
                                </div>
                        }
                    </div>
                </>
            )
        }

        const goBack = () => {
            history.push("/stockList")
            window.location.reload(false)
        }

        return (
            <div className="container-fluid my-2" >
                <div className="row">
                    <div className="d-flex px-3">
                        <Button style={{ paddingLeft: "10px", paddingRight: "10px", textDecoration: "none", color: "black" }} onClick={() => goBack()}>
                            <ArrowRoundedLeft8x13Svg fontSize="inherit" style={{ margin: "10px" }} />
                            Stock List
                        </Button>
                    </div>

                    <div className="w-100 container-fluid">
                        {
                            this.state.stockListData.length > 0 && this.state.stockListData[0].ReturnVal !== "0" ?

                                <TableComponents
                                    tableTopRight={
                                        <div className="row" style={{ display: "flex" }}>
                                            <Tooltip title="Add Stock">
                                                <IconButton size="small" sx={{ color: "#0074ea", marginRight: 4 }} onClick={() => <>
                                                    {history.push("/addStock")}
                                                    {window.location.reload(false)}
                                                </>}>
                                                    <GroupAddIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                    }

                                    tableTopLeft={
                                        parseInt(this.checkDetailID()) === 0 ? this.state.ProductName === "" ? <h4>All Product Variation List</h4> : <h4>{this.state.ProductName} Variation List</h4> :
                                            this.props.variationStock !== null && this.props.variationStock.length > 0 ?
                                                this.props.variationStock.filter((x) => parseInt(x.ProductVariationDetailID) === parseInt(this.checkDetailID())).map((data) => {
                                                    return (
                                                        <div className="d-flex">
                                                            <h4 onClick={() => window.location = url.inventoryProduct(data.ProductID)}>{data.ProductName}</h4>
                                                            <label onClick={() => window.location = url.inventoryProduct(data.ProductID)} style={{ color: "blue", paddingTop: "9px", paddingLeft: "10px", fontSize: "10px" }}>Click to view Product Info</label>
                                                        </div>
                                                    )
                                                }) : ""
                                    }
                                    tableOptions={{
                                        dense: true,
                                        tableOrderBy: 'asc',
                                        sortingIndex: "fat",
                                        stickyTableHeader: false,
                                        stickyTableHeight: 300,
                                        elevation: 1
                                    }}
                                    paginationOptions={[10, 20, 30, { label: 'All', value: -1 }]}
                                    tableHeaders={headCells}
                                    tableRows={{
                                        renderTableRows: this.renderTableRows,
                                        checkbox: true,
                                        checkboxColor: "primary",
                                        onRowClickSelect: false
                                    }}
                                    Data={this.state.stockListData}
                                    onSelectRow={(e) => this.setState({ selectedListID: e })}
                                    onSelectAllRows={(e) => this.setState({ selectedListID: e })}
                                    onTableRowClick={this.onTableRowClick}
                                    SelectionActionButtons={<Tooltip title="Delete">
                                        <IconButton aria-label="delete" onClick={() => { this.onDelete() }}   >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>}
                                />
                                :
                                <label>There is no variation data for this variation ID.</label>
                        }
                    </div>

                    <AlertDialog
                        open={this.state.isOpenStockModal}
                        fullWidth
                        maxWidth="md"
                        handleToggleDialog={() => <>{this.setState(INITIAL_STATE)}{this.setState({ isOpenStockModal: false })}</>}
                        title="Stock Details"
                        showAction={false}
                    >
                        <div className="container-fluid">
                            <div className="container" style={{ padding: "10px" }}>
                                {this.state.filteredData.length > 0 && ModalListing(this.state.filteredData)}
                            </div>
                        </div>
                    </AlertDialog >
                </div>
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StockDetail);