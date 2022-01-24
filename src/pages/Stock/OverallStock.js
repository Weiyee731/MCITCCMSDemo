import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../store/action/gitAction";

import { Link } from "react-router-dom";

import { browserHistory } from "react-router";
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableCell';
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
import { url } from "../../tools/Helpers";
import "./OverallStock.css";

// UI Components
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
import InputAdornment from '@mui/material/InputAdornment';
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import Collapse from "@material-ui/core/Collapse";





function mapStateToProps(state) {
    return {
        foods: state.counterReducer["foods"],
        grid: state.counterReducer["grid"],
        variationAction: state.counterReducer["variationAction"],
        variationStock: state.counterReducer["variationStock"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        // CallTesting: () => dispatch(GitAction.CallTesting()),
        CallAddProductVariationStock: (prodData) => dispatch(GitAction.CallAddProductVariationStock(prodData)),
        CallGridList: (prodData) => dispatch(GitAction.CallGridList(prodData)),
        CallResetProductVariationStock: () => dispatch(GitAction.CallResetProductVariationStock()),

        CallViewAllProductVariationStock: (prodData) => dispatch(GitAction.CallViewAllProductVariationStock(prodData)),

    };
}

const overallHeadCells = [
    {
        id: 'ProductName',
        align: 'left',
        disablePadding: false,
        label: 'Product Name',
    },
    {
        id: 'ProductStockAmount',
        align: 'center',
        disablePadding: false,
        label: 'Product Stock',
    },
    {
        id: 'FirstDate',
        align: 'center',
        disablePadding: false,
        label: 'First Stock Date',
    },
    {
        id: 'LastDate',
        align: 'center',
        disablePadding: false,
        label: 'Last Stock Date',
    },
]

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
        id: 'StockCost',
        align: 'center',
        disablePadding: false,
        label: 'Stock Cost(RM)',
    },
];

function createData(StockInDate, ProductSKU, ProductName, Store, StockInAmount, StockID) {
    return {
        StockInDate,
        ProductSKU,
        ProductName,
        Store,
        StockInAmount,
        StockID
    };
}

const INITIAL_STATE = {
    // DraftListing Details
    isOpenDraftModal: false,
    isDataEdit: false,

    OrderDate: new Date(),
    ReceiveDate: new Date(),
    StockInDate: new Date(),

    ProductData: [],
    rowIndex: "",
    DraftNo: "",
    CurrentStock: "",
    ContainerID: "",
    ContainerName: "",
    isContainerError: false,


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

    filteredProduct: [],
    selectedFilter: [],
    selectedListID: [],
    isDiscountClick: false,

    isInvoiceError: false,
    isStoreError: false,
    isStockInAmountError: false,
    // isStockPriceError: false,
    ReceiveValidated: true,
    OrderValidated: true,
    StockInValidated: true,

    isSet: false,

    // Database Lisiting
    DBStockInDate: "",
    isOpenOverallDetails: [],
    isDatabaseSet: false,
    searchKeywords: "",
    isFiltered: false,
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
        this.PagingListing = [{
            isOpenOverallDetails: [],
            Listing: []
        }]

        this.props.CallGridList({ ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID })
        this.props.CallViewAllProductVariationStock({
            ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID,
            ProductID: 0,
            ProductPerPage: 999,
            Page: 1
        })
    }

    componentDidMount() {
        if (localStorage.getItem("DataSetDraft") !== null &&
            JSON.parse(localStorage.getItem("DataSetDraft")).length > 0) {
            this.DraftListing[0].storageListing = JSON.parse(localStorage.getItem("DataSetDraft"))
            // this.setState({ storageListing: JSON.parse(localStorage.getItem("DataSetDraft")) })
        }
    }

    componentDidUpdate(prevProps, prevState) {

        if (this.props.variationStock !== null && this.props.variationStock.length > 0 && this.state.isDatabaseSet === false) {
            this.DatabaseListing = this.props.variationStock

            // this.props.variationStock.length > 0 && this.props.variationStock.map((data) => {
            //     this.state.isOpenOverallDetails.push(false)
            // })
            this.setState({ isDatabaseSet: true })
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
                    style={{ width: "55%" }}
                >
                    {data.ProductName} - ({data.ProductVariation})
                </TableCell>
                <TableCell align="center" style={{ width: "15%" }}>{data.ProductStockAmount}</TableCell>
                <TableCell align="center" style={{ width: "15%" }}>{data.FirstDate}</TableCell>
                <TableCell align="center" style={{ width: "15%" }}>{data.LastDate}</TableCell>
            </>
        )
    }

    renderTableCollapseRows = (data, index) => {
        return (
            <div className="container-fluid my-2">
                <div className="row" style={{ paddingLeft: "10px" }}>
                    {
                        data.ProductVariationStockDetail !== undefined &&
                        <div className="row" style={{ backgroundColor: "#f5f5f5", paddingTop: "10px" }}>
                            <div className="col-12 col-md-3" style={{ paddingBottom: "10px" }}>
                                <label style={{ fontWeight: "bold" }}>Store</label>
                            </div>
                            <div className="col-12 col-md-3" style={{ paddingBottom: "10px" }}>
                                <label style={{ fontWeight: "bold" }}>Stock Amount</label>
                            </div>
                        </div>
                    }
                    {
                        data.ProductVariationStockDetail !== undefined && JSON.parse(data.ProductVariationStockDetail).map((details, index) => {
                            return (
                                <>
                                    {
                                        <Link className="nav-link" to={{ pathname: url.stockDetails(data.ProductVariationDetailID) }}>
                                            <div className="row flex-1" style={{ backgroundColor: index % 2 === 1 ? "#f5f5f5" : "#fffff", padding: "15px" }}>
                                                <div className="col-12 col-md-3">
                                                    <label>{details.Column1}</label>
                                                </div>
                                                <div className="col-12 col-md-3">
                                                    <label>{details.ProductStockAmount}</label>
                                                </div>
                                            </div>
                                        </Link>
                                    }
                                </>
                            )
                        })
                    }
                </div>
            </div>
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

    onDraftTableRowClick = (event, row) => {
        this.setState({

            DraftNo: row.DraftNo,
            rowIndex: row.rowIndex,
            ProductData: row.filteredProduct,
            StoreStockInData: row.StoreStockInData,
            CurrentStock: row.CurrentStock,
            ContainerID: row.ContainerID,
            ContainerName: row.ContainerName,
            StockInDate: row.StockInDate,

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

        let listing = this.PagingListing[0].Listing
        let selected = ""
        let OverallCollapseTable = this.PagingListing[0].isOpenOverallDetails

        listing.map((data, i) => {
            if (data.ProductVariationDetailID === row.ProductVariationDetailID)
                selected = i
        })

        OverallCollapseTable.map((data, index) => {
            if (index === selected) {
                OverallCollapseTable[index] = !OverallCollapseTable[index]
            } else
                OverallCollapseTable[index] = false
        })

        this.PagingListing[0].isOpenOverallDetails = OverallCollapseTable
        this.setState({ isOpenOverallDetails: OverallCollapseTable })
    }

    addNewStore = () => {
        let storeListing = this.state.StoreStockInData

        storeListing = [...storeListing, {
            id: "",
            label: "",
            value: "",
            StockInAmount: "",
            VariationCost: "",
        }]
        this.setState({ StoreStockInData: storeListing })
    }

    // Remove selected state listing and localStorage listing data
    onDelete = () => {
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
                        ContainerID: this.state.ContainerID,
                        StockInDate: this.state.StockInDate,
                        ProductID: this.state.ProductData[0].ProductID,
                        ProductName: this.state.ProductData[0].ProductName,
                        ProductSKU: this.state.ProductData[0].ProductVariationSKU,
                        StoreStockInData: this.state.StoreStockInData,
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

            let ProductVariationDetailID = []
            let ProductStock = []
            let ProductVariationCost = []
            let GridStorageID = []

            this.state.StoreStockInData.length > 0 && this.state.StoreStockInData.map((stockDetails) => {

                ProductVariationDetailID.push(this.state.ProductData[0].ProductVariationDetailID)
                ProductStock.push(stockDetails.StockInAmount)
                ProductVariationCost.push(parseFloat(stockDetails.VariationCost).toFixed(2))
                GridStorageID.push(stockDetails.id)
            })

            this.props.CallAddProductVariationStock({
                ContainerID: this.state.ContainerID,
                UserID: JSON.parse(localStorage.getItem("loginUser"))[0].UserID,
                ProductVariationDetailsID: ProductVariationDetailID,
                ProductStock: ProductStock,
                ProductVariationCost: ProductVariationCost,
                GridStorageID: GridStorageID
            })

            let localListing = localStorage.getItem("DataSetDraft") !== null ? JSON.parse(localStorage.getItem("DataSetDraft")) : []
            localListing = localListing.filter((data) => data.DraftNo !== this.state.DraftNo)

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
        let StockListing = this.state.StoreStockInData

        if (StockListing.length > 0) {
            if (StockListing.filter((data) => data.isStockInAmountError === true || data.isStockInAmountError === undefined).length > 0)
                error = true
            else if (StockListing.filter((data) => data.isVariationCostError === true || data.isVariationCostError === undefined).length > 0)
                error = true
            else if (this.state.isContainerError === true || this.state.ContainerID === "")
                error = true
        }
        return error
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

            case "DBStockInDate":
                this.setState({ DBStockInDate: isStringNullOrEmpty(e) ? "Invalid Date" : e, DBStockInDateValidated: (!isStringNullOrEmpty(e) && e !== "Invalid Date") })
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

            case "Filter":
                this.setState({ selectedFilter: { id: e.id, value: e.value, label: e.label } })
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

    carryDataFromChild = (e) => {
        let checkFiltering = false

        if (this.PagingListing[0] !== null && this.PagingListing[0].Listing.length > 0) {
            checkFiltering = JSON.stringify(this.PagingListing[0].Listing) === JSON.stringify(e)

            if (checkFiltering === false) {
                this.PagingListing[0].isOpenOverallDetails = []
                this.PagingListing[0].Listing = e
                e.map((x) => {
                    this.PagingListing[0].isOpenOverallDetails.push(false)
                })
            } }
        else {
            this.PagingListing[0].Listing = e
            e.map((x) => {
                this.PagingListing[0].isOpenOverallDetails.push(false)
            })
        }
    }

    searchSpace = (value) => {
        var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        let DatabaseListing = this.DatabaseListing
        this.setState({ searchKeywords: value })
        this.state.filteredProduct.splice(0, this.state.filteredProduct.length)

        if (DatabaseListing.length > 0) {
            if (this.state.selectedFilter.id === undefined)
                toast.warning("Input Error: A filter range is required")

            else if (parseInt(this.state.selectedFilter.id) === 1) {
                DatabaseListing.map((list) => {
                    list.ProductVariationStockDetail !== null && JSON.parse(list.ProductVariationStockDetail).filter((x) =>
                        x.Column1 !== null && x.Column1.toLowerCase().includes(value.toLowerCase())).map(filteredItem => {
                            this.state.filteredProduct.push(list);
                        });
                })
                this.setState({ isFiltered: true })
            }
            else if (parseInt(this.state.selectedFilter.id) === 2) {
                DatabaseListing = DatabaseListing.filter((data) => data.ProductName !== null && data.ProductName.toLowerCase().includes(value.toLowerCase()));
                this.setState({ filteredProduct: DatabaseListing, isFiltered: true })
            }
        } else toast.warning("No Listing Available for filter")
    }

    render() {

        const filterSelection =
            [
                { id: "1", value: "Store" },
                { id: "2", value: "Product Name" }
            ]

        const TextFieldData = (type, variant, title, name, stateValue, error, index) => {
            return (
                <div className="col-12 col-md-12" style={{ paddingBottom: "10px" }}>
                    <TextField variant={variant} type={type} size="small" inputProps={{ min: "0", step: name === "StockInAmount" ? "1.00" : "0.10" }} fullWidth label={title} value={name === "StockInAmount" ? parseFloat(stateValue).toFixed(0) : stateValue} name={name} onChange={(e) => this.handleFormInput(e, name, index)} 
                     InputProps={{
                        startAdornment: <InputAdornment position="start">{name === "StockInAmount" ? "  " : "RM"}</InputAdornment>,
                    }} required />
                    {error && <FormHelperText sx={{ color: 'red' }} id={error}>Invalid {title} </FormHelperText>}
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
                            <div><label style={{ fontSize: "13px", color: "lightslategrey" }}>SKU: {filteredProduct.length > 0 && filteredProduct[0].SKU !== null ? filteredProduct[0].SKU : ""}</label></div>
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
                                                        {/* {TextFieldData("number", "outlined", "Variation Selling Price", "VariationSellingPrice", data.VariationPrice, data.isVariationPriceError, index)} */}
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
                    </div>
                </>
            )
        }

        return (
            <div className="container-fluid my-2">
                <div className="row">
                    <div className="col-md-12 col-12 mb-2 d-flex">
                        <div className="col-2 d-inline-flex">
                            {/* <Select
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
                            </Select> */}

                            <Select
                                labelId="search-filter-category"
                                id="search-filter-category"
                                label="Search By"
                                onChange={(e) => this.handleFormInput(e, "Filter", 0)}
                                size="small"
                                value={this.state.selectedFilter}
                                IconComponent={FilterListOutlinedIcon}
                                className="col-11"
                                placeholder="Filter By"
                                options={
                                    isArrayNotEmpty(filterSelection) && filterSelection.map((el, idx) => {
                                        return { id: el.id, value: el.value, label: el.value }
                                    })
                                }
                            >
                            </Select>
                        </div>
                        <div className="col-4 d-inline-flex">
                            <SearchBar
                                id=""
                                placeholder="Enter Product SKU, Product Name or Store to search"
                                buttonOnClick={() => this.onSearch("", "")}
                                onChange={(e) => this.searchSpace(e.target.value)}
                                className="searchbar-input mb-auto"
                                disableButton={this.state.isDataFetching}
                                tooltipText="Search with current data"
                                value={this.state.searchKeywords}
                            />
                        </div>
                    </div>

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
                            paginationOptions={[10, 30, 40, { label: 'All', value: -1 }]}
                            tableHeaders={overallHeadCells}
                            tableRows={{
                                renderTableRows: this.renderTableRows,
                                checkbox: false,
                                checkboxColor: "primary",
                                onRowClickSelect: false,

                                isExpandable: true,
                                renderTableCollapseRows: this.renderTableCollapseRows,
                                isCollapseOpen: this.PagingListing[0].isOpenOverallDetails
                                // isCollapseOpen: this.state.isOpenOverallDetails
                            }}
                            Data={this.state.isFiltered === true ? this.state.filteredProduct : this.DatabaseListing}
                            onTableRowClick={this.onTableRowClick}
                            SelectionActionButtons={<Button onClick={() => alert('hi')}>SelectionActionButtons</Button>}
                            carryDataFromChild={this.carryDataFromChild}
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
                            onRowClickSelect: false,
                            isExpandable: false,
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