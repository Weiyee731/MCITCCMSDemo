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

// UI Components
import { Button } from "@mui/material";
import Select from 'react-select';
import SubmitIcon from '@mui/icons-material/Backup';
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

    };
}

function mapDispatchToProps(dispatch) {
    return {
        // CallTesting: () => dispatch(GitAction.CallTesting()),
        CallAllProducts: (prodData) => dispatch(GitAction.CallAllProducts(prodData)),
        CallViewProductVariationStock: (prodData) => dispatch(GitAction.CallViewProductVariationStock(prodData)),
        CallAddProductVariationStock: (prodData) => dispatch(GitAction.CallAddProductVariationStock(prodData)),
        CallGridList: (prodData) => dispatch(GitAction.CallGridList(prodData)),
        CallResetProductVariationStock: () => dispatch(GitAction.CallResetProductVariationStock()),
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
        id: 'VariationCost',
        align: 'center',
        disablePadding: false,
        label: 'Variation Cost (RM)',
    },
];

const INITIAL_STATE = {
    StockInDate: new Date(),
    ContainerID: 0,
    ContainerName: "",
    isContainerError: false,

    isBackClick: false,

    InvoiceNo: "",
    StoreStockInData: [{
        id: "",
        label: "",
        value: "",
        StockInAmount: "",
        VariationCost: "",
        // VariationPrice: "",
        CurrentStock: "",
        isStockInAmountError: false,
        isVariationCostError: false,
        // isVariationPriceError: false
    }],
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

        this.props.CallGridList({ ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID })

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
        this.props.CallViewProductVariationStock({
            ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID,
            ProductPerPage: 999,
            Page: 1
        })
    }

    componentDidUpdate(prevProps, prevState) {

        if (this.props.variationAction.length > 0 && this.props.variationAction[0].ReturnVal === "1") {
            this.props.CallResetProductVariationStock()
            toast.success("Stock is update")

            let statelisting = this.DataState
            let localListing = localStorage.getItem("DataSetDraft") !== null ? JSON.parse(localStorage.getItem("DataSetDraft")) : []
            let stateDraftNo = []

            statelisting.length > 0 && statelisting.map((data) => {
                stateDraftNo.push(data.DraftNo)
            })

            // to remove localstorage data
            if (localListing.length > 0 && stateDraftNo.length > 0) {
                stateDraftNo.map((DraftID) => {
                    localListing = localListing.filter((data) => data.DraftNo !== DraftID)
                })
            }
            this.DataState = []
            localStorage.setItem("DataSetDraft", JSON.stringify(localListing))
            this.setState({ selectedListID: [] })
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
                    style={{ width: "15%" }}
                >
                    {data.ProductSKU}
                </TableCell>
                <TableCell align="center" style={{ width: "35%" }}>{data.ProductName}</TableCell>
                <TableCell align="center" style={{ width: "15%" }}>{data.StoreStockInData.length > 0 && data.StoreStockInData.map((details) => {
                    return (<> <label >{details.value}</label> <br /> </>)
                })}</TableCell>
                <TableCell align="center" style={{ width: "15%" }}>{data.StoreStockInData.length > 0 && data.StoreStockInData.map((details) => {
                    return (<> <label >{details.StockInAmount}</label> <br />  </>)
                })}</TableCell>
                <TableCell align="center" style={{ width: "15%" }}>{data.StoreStockInData.length > 0 && data.StoreStockInData.map((details) => {
                    return (<>  <label >{parseFloat(details.VariationCost).toFixed(2)}</label> <br /> </>)
                })}</TableCell>
            </>
        )
    }

    onTableRowClick = (event, row) => {
        this.setState({
            searchKeywords: row.ProductSKU,
            DraftNo: row.DraftNo,
            rowIndex: row.rowIndex,
            filteredProduct: row.filteredProduct,
            StoreStockInData: row.StoreStockInData,
            CurrentStock: row.CurrentStock,
            ContainerID: row.ContainerID,
            ContainerName: row.ContainerName,
            StockInDate: row.StockInDate,

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
                statelisting.filter((data) => data.ProductSKU === datalist.ProductSKU).map((list) => {
                    stateDraftNo.push(list)
                })
                statelisting = statelisting.filter((data) => data.ProductSKU !== datalist.ProductSKU)
            })
        }
        // to remove localstorage data
        if (localListing.length > 0 && stateDraftNo.length > 0) {
            stateDraftNo.map((DraftID) => {
                localListing = localListing.filter((data) => data.DraftNo !== DraftID.DraftNo)
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

    handleFormInput = (e, name, index) => {
        let storeListing = this.state.StoreStockInData
        switch (name) {
            case "Store":
                storeListing[index] = {
                    id: e.id,
                    label: e.label,
                    value: e.value,
                    CurrentStock: storeListing[index].CurrentStock,

                    StockInAmount: storeListing[index].StockInAmount,
                    VariationCost: storeListing[index].VariationCost,
                    isStockInAmountError: storeListing[index].isStockInAmountError,
                    isVariationCostError: storeListing[index].isVariationCostError,
                }
                this.setState({ StoreStockInData: storeListing })
                break;

            case "StockInAmount":
                let isStockInAmountError = false
                if (isStringNullOrEmpty(e.target.value))
                    isStockInAmountError = true

                storeListing[index] = {
                    id: storeListing[index].id,
                    label: storeListing[index].label,
                    value: storeListing[index].value,
                    CurrentStock: storeListing[index].CurrentStock,

                    StockInAmount: e.target.value,
                    VariationCost: storeListing[index].VariationCost,
                    isStockInAmountError: isStockInAmountError,
                    isVariationCostError: storeListing[index].isVariationCostError,
                }
                this.setState({ StoreStockInData: storeListing })
                break;

            case "VariationCost":
                let isVariationCostError = false
                if (isStringNullOrEmpty(e.target.value))
                    isVariationCostError = true

                storeListing[index] = {
                    id: storeListing[index].id,
                    label: storeListing[index].label,
                    value: storeListing[index].value,
                    CurrentStock: storeListing[index].CurrentStock,

                    StockInAmount: storeListing[index].StockInAmount,
                    VariationCost: e.target.value,
                    isStockInAmountError: storeListing[index].isStockInAmountError,
                    isVariationCostError: isVariationCostError,
                }
                this.setState({ StoreStockInData: storeListing })
                break;
            case "Container":
                if (isStringNullOrEmpty(e.target.value))
                    this.setState({ isContainerError: true, ContainerID: e.target.value })
                else
                    this.setState({ isContainerError: false, ContainerID: e.target.value })
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
                let DataSet = this.props.variationStock

                DataSet.length > 0 && DataSet !== undefined && DataSet.filter((searchedItem) =>
                    searchedItem.ProductVariationSKU !== null && searchedItem.ProductVariationSKU.toLowerCase() ===
                    value.toLowerCase()
                ).map((filteredItem) => {
                    filteredListing.push(filteredItem);
                })

                if (filteredListing.length > 0) {
                    this.state.filteredProduct.push(filteredListing[0])
                    let GridList = this.props.grid
                    let GridValue = GridList.length > 0 && GridList.filter((x) => parseInt(x.GridStorageID) === parseInt(filteredListing[0].GridStorageID))

                    this.setState({
                        StoreStockInData: [{
                            id: filteredListing[0].GridStorageID,
                            label: GridValue.GridStorage,
                            value: GridValue.GridStorage,
                            StockInAmount: filteredListing[0].ProductStockAmount,
                            VariationCost: filteredListing[0].ProductVariationCost,
                            isStockInAmountError: false,
                            isVariationCostError: false,
                        }]
                    })
                }

            }
        }
    }

    // Check whether similar SKU product has been added into the list
    checkSimilarProduct = (product) => {
        let checkSimilar = false
        let listing = this.DataState
        if (listing.length > 0) {
            if (listing.filter((data) => data.ProductSKU == product.ProductVariationSKU).length > 0) {
                checkSimilar = true
                toast.warning("Duplicate Error : Product with SKU is already added in the list")
            }
        }
        return checkSimilar

    }

    // Check whether all input has been filled
    errorChecking = () => {
        let error = false
        let StockListing = this.state.StoreStockInData

        if (StockListing.length > 0) {
            if (StockListing.filter((data) => data.isStockInAmountError === true || data.isStockInAmountError === undefined).length > 0)
                error = true
            else if (StockListing.filter((data) => data.isVariationCostError === true || data.isVariationCostError === undefined).length > 0)
                error = true
            // else if (StockListing.filter((data) => data.isVariationPriceError === true || data.isVariationPriceError === undefined).length > 0)
            //     error = true
            else if (this.state.isContainerError === true || this.state.ContainerID === "")
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
                ContainerID: this.state.ContainerID,
                StockInDate: this.state.StockInDate,
                filteredProduct: this.state.filteredProduct,
                ProductID: this.state.filteredProduct[0].ProductID,
                ProductName: this.state.filteredProduct[0].ProductName,
                ProductSKU: this.state.filteredProduct[0].ProductVariationSKU,
                StoreStockInData: this.state.StoreStockInData,
            }

            if (localStorage.getItem("DataSetDraft") !== null) {
                Listing = JSON.parse(localStorage.getItem("DataSetDraft"))
            }

            this.DataState = [...this.DataState, DraftListing]      // add into state Listing
            Listing = [...Listing, DraftListing]                    // add into local storage
            localStorage.setItem("DataSetDraft", JSON.stringify(Listing))
            this.setState(INITIAL_STATE)
        }
        else {
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
                        ContainerID: this.state.ContainerID,
                        StockInDate: this.state.StockInDate,
                        filteredProduct: this.state.filteredProduct,
                        ProductID: this.state.filteredProduct[0].ProductID,
                        ProductName: this.state.filteredProduct[0].ProductName,
                        ProductSKU: this.state.filteredProduct[0].ProductVariationSKU,
                        StoreStockInData: this.state.StoreStockInData,
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
                        ContainerID: this.state.ContainerID,
                        StockInDate: this.state.StockInDate,
                        ProductID: this.state.filteredProduct[0].ProductID,
                        ProductName: this.state.filteredProduct[0].ProductName,
                        ProductSKU: this.state.filteredProduct[0].ProductVariationSKU,
                        StoreStockInData: this.state.StoreStockInData,
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

        if (!this.errorChecking()) {
            let ProductVariationDetailID = []
            let ProductStock = []
            let ProductVariationCost = []
            let GridStorageID = []



            let Listing = this.DataState
            Listing.length > 0 && Listing.map((data) => {
                data.StoreStockInData.length > 0 && data.StoreStockInData.map((stockDetails) => {

                    ProductVariationDetailID.push(data.filteredProduct[0].ProductVariationDetailID)
                    ProductStock.push(stockDetails.StockInAmount)
                    ProductVariationCost.push(parseFloat(stockDetails.VariationCost).toFixed(2))
                    GridStorageID.push(stockDetails.id)
                })
            })

            console.log("Listing", Listing)
            console.log("Listing ProductVariationDetailID", ProductVariationDetailID)

            this.props.CallAddProductVariationStock({
                ContainerID: this.state.ContainerID,
                UserID: JSON.parse(localStorage.getItem("loginUser"))[0].UserID,
                ProductVariationDetailsID: ProductVariationDetailID,
                ProductStock: ProductStock,
                ProductVariationCost: ProductVariationCost,
                GridStorageID: GridStorageID
            })

        } else {
            toast.warning("Input Error: Please cross check on All Stock Details Input")
        }
    }

    addNewStore = () => {
        let storeListing = this.state.StoreStockInData

        storeListing = [...storeListing, {
            id: "",
            label: "",
            value: "",
            StockInAmount: "",
            VariationCost: "",
            // VariationPrice: ""
        }]
        this.setState({ StoreStockInData: storeListing })
    }

    removeStoreData = (index) => {
        let storeListing = this.state.StoreStockInData
        storeListing = storeListing.filter((x, i) => i !== index)
        this.setState({ StoreStockInData: storeListing })
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
                            <div><label style={{ fontSize: "13px", color: "lightslategrey" }}>Variation: {this.state.filteredProduct.length > 0 && this.state.filteredProduct[0].ProductVariationValue !== null ? this.state.filteredProduct[0].ProductVariationValue : ""}</label></div>
                            <div><label style={{ fontSize: "13px", color: "lightslategrey" }}>SKU: {this.state.filteredProduct.length > 0 && this.state.filteredProduct[0].ProductVariationSKU !== null ? this.state.filteredProduct[0].ProductVariationSKU : ""}</label></div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-md-12" style={{ textAlign: "right" }}>
                            <Tooltip title="Add Store">
                                <IconButton size="small" sx={{ color: "#0074ea", marginRight: 4 }} onClick={() => this.addNewStore()}>
                                    <GroupAddIcon /><label style={{ paddingLeft: "5px" }}>Add Store</label>
                                </IconButton>
                            </Tooltip>
                        </div>
                    </div>
                    <hr />
                    {
                        this.state.StoreStockInData.length > 0 && this.state.StoreStockInData.map((data, index) => {
                            return (
                                <>
                                    <div className="row" style={{ paddingTop: "5px", paddingBottom: "5px" }}>
                                        <div className="col-12 col-md-6">
                                            <div className="row">
                                                {
                                                    this.state.StoreStockInData.length > 1 &&
                                                    <div className="col-12 col-md-1" >
                                                        <RemoveCircleOutlineIcon
                                                            className="DeleteOptionButton mr-2"
                                                            style={{ cursor: 'pointer' }}
                                                            color="secondary"
                                                            onClick={() => this.removeStoreData(index)}
                                                        />
                                                    </div>
                                                }
                                                <div className="col-12 col-md-10" >
                                                    <FormControl variant="standard" size="small" fullWidth>
                                                        <InputLabel id="Store-label">Store</InputLabel>
                                                        <Select
                                                            labelId="Store"
                                                            id="Store"
                                                            name="Store"
                                                            value={data}
                                                            onChange={(e) => this.handleFormInput(e, "Store", index)}
                                                            label="Store"
                                                            options={
                                                                isArrayNotEmpty(this.props.grid) && this.props.grid.map((el, idx) => {
                                                                    return { id: el.GridStorageID, value: el.GridStorage, label: el.GridStorage }
                                                                })
                                                            }
                                                        >
                                                        </Select>
                                                    </FormControl>
                                                    {
                                                        data.value !== "" && data.CurrentStock !== undefined &&
                                                        <div style={{ paddingTop: "15px" }} >
                                                            <label style={{ color: "grey" }}>Current Stock : {data.CurrentStock}</label>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            data.value !== "" && data.value !== undefined ?
                                                <>
                                                    <br />
                                                    <div className="col-12 col-md-6">
                                                        {TextFieldData("number", "outlined", "Stock In Amount", "StockInAmount", data.StockInAmount, data.isStockInAmountError, index)}
                                                        {TextFieldData("number", "outlined", "Variation Cost", "VariationCost", data.VariationCost, data.isVariationCostError, index)}
                                                    </div>
                                                    <br />
                                                </>
                                                :
                                                <div style={{ paddingBottom: "50px" }}>
                                                </div>
                                        }
                                        <hr />
                                    </div>
                                </>
                            )
                        })
                    }

                    <div className="row">
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
                    </div>
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
                            Stock List
                        </Button>
                        <div className="d-md-flex my-2" style={{ marginLeft: 'auto' }}>
                            <div style={{ width: '200px', marginRight: "15px", marginTop: "5px" }}>
                                <TextField variant="standard" size="small" fullWidth label="Container" value={this.state.ContainerID} onChange={(e) => this.handleFormInput(e, "Container", 0)} required />
                            </div>
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
                                <>
                                    <h4 style={{ paddingTop: "5px" }}>New Stock List</h4>
                                    {this.DataState.length > 0 &&
                                        <Tooltip title="Submit New Stock">
                                            <IconButton size="small" sx={{ color: "#0074ea", marginRight: 2, }} onClick={() => this.OnHandleSubmitStock()}>
                                                <SubmitIcon /> <label style={{ paddingLeft: "5px" }}>Upload Stock  </label>
                                            </IconButton>
                                        </Tooltip>}
                                </>

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
                                <Button variant="contained" color="primary" style={{ margin: "10px" }} onClick={() => {
                                    <>
                                        {history.push("/stockList")}
                                        {window.location.reload(false)}
                                    </>
                                }}>
                                    Yes
                                </Button>
                                <Button variant="contained" color="secondary" onClick={() => this.setState({ isBackClick: false })
                                }>
                                    No
                                </Button>
                            </div>
                        </div>
                    </div >
                </AlertDialog >
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddStock);