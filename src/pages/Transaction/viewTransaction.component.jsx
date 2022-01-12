import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../store/action/gitAction";
import PropTypes from "prop-types";
import clsx from "clsx";

// UI Components
import { lighten, makeStyles } from "@material-ui/core/styles";
import TableContainer from "@material-ui/core/TableContainer";
import TablePagination from "@material-ui/core/TablePagination";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Box from "@material-ui/core/Box";
import FormControl from "@material-ui/core/FormControl";
import Collapse from "@material-ui/core/Collapse";
import { toast } from "react-toastify";
import {
    Select,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";

// Share Components
import "./viewTransaction.component.css";
import Logo from "../../assets/logos/logo.png";
import SearchBar from "../../components/SearchBar/SearchBar"
import { ArrowRoundedUp13x8Svg, ArrowRoundedDown12x7Svg } from '../../assets/svg';
import { isContactValid, isEmailValid, isStringNullOrEmpty } from "../../tools/Helpers";

function mapStateToProps(state) {
    return {
        allpromocodes: state.counterReducer["promoCodes"],
        allstocks: state.counterReducer["products"],
        alltransactions: state.counterReducer["transactions"],
        logistic: state.counterReducer["logistic"],
        tracking: state.counterReducer["tracking"],
        alltransactionstatus: state.counterReducer["transactionStatus"],
        allAddress: state.counterReducer["allAddress"],
        countries: state.counterReducer["countries"],
        order: state.counterReducer["order"],
        merchant: state.counterReducer["merchant"],

    };
}

function mapDispatchToProps(dispatch) {
    return {
        CallGetTransaction: (transactionData) => dispatch(GitAction.CallGetTransaction(transactionData)),
        CallCourierService: () => dispatch(GitAction.CallCourierService()),
        CallGetTransactionStatus: () => dispatch(GitAction.CallGetTransactionStatus()),
        CallResetOrderTracking: () => dispatch(GitAction.CallResetOrderTracking()),
        // CallAllUserAddress: (propData) => dispatch(GitAction.CallAllUserAddress(propData)),
        CallCountry: () => dispatch(GitAction.CallCountry()),
        CallClearOrder: () => dispatch(GitAction.CallClearOrder()),
        CallUpdateOrderTracking: (propData) => dispatch(GitAction.CallUpdateOrderTracking(propData)),
        CallUpdateOrderUserDetails: (propData) => dispatch(GitAction.CallUpdateOrderUserDetails(propData)),
        CallMerchants: (propData) => dispatch(GitAction.CallMerchants(propData)),
    };
}

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
    },
    paper: {
        width: "100%",
        margin: "auto",
        padding: "1%",
        // paddingRight: "1%",
        marginTop: "15px",
    },
    table: {
        // margin: "20px",
        minWidth: 750,
    },
    visuallyHidden: {
        border: 0,
        clip: "rect(0 0 0 0)",
        height: 1,
        margin: -1,
        overflow: "hidden",
        padding: 0,
        position: "absolute",
        top: 20,
        width: 1,
    },
    highlight:
        theme.palette.type === "light"
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    title: {
        flex: "1 1 100%",
    },
}));

const headCells = [
    {
        id: "",
        numeric: false,
        disablePadding: false,
        label: "",
    },
    {
        id: "OrderName",
        numeric: false,
        disablePadding: false,
        label: "Order Name",
    },
    {
        id: "Username",
        numeric: false,
        disablePadding: false,
        label: "Username",
    },
    {
        id: "PaymentMethod",
        numeric: false,
        disablePadding: false,
        label: "Payment Method",
    },
    {
        id: "TrackingStatus",
        numeric: false,
        disablePadding: false,
        label: "Tracking Status",
    },
    {
        id: "OrderProductDetail",
        numeric: false,
        disablePadding: false,
        label: "No. of Products",
    },
];

function DisplayTableHead(props) {
    const {
        onSelectAllClick,
        order,
        orderBy,
        numSelected,
        rowCount,
        onRequestSort,
    } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };
    const classes = useStyles();
    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? "right" : "left"}
                        padding={headCell.disablePadding ? "none" : "default"}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : "asc"}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === "desc" ? "sorted descending" : "sorted ascending"}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

DisplayTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const DisplayTableToolbar = (props) => {
    const classes = useStyles();
    const { numSelected } = props;

    return <Toolbar className={clsx(classes.root)}></Toolbar>;
};

DisplayTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

const useRowStyles = makeStyles({
    root: {
        "& > *": {
            borderBottom: "unset",
        },
    },
});


function Row(props) {
    const { row, setData, index, logistic, prop, address, country } = props;
    const [open, setOpen] = React.useState(false);
    const [openId, setOpenId] = React.useState(false);
    const classes = useRowStyles();
    const [selectedProductDetailsID, setSelectedProductDetailsID] = React.useState([]);
    const [selectedRowID, setSelectedRowID] = React.useState([]);
    const [selectedProductIndex, setSelectedProductIndex] = React.useState([]);
    const [logisticID, setLogisticID] = React.useState(1);
    const [trackingNumber, setTrackingNumber] = React.useState("");
    const [existingTrackingData, setTrackingData] = React.useState([]);
    const [newUserDetails, setUserDetails] = React.useState([]);

    // Check Particular Product
    const handleSelectedProduct = (product, index) => {

        let tempArray = selectedProductDetailsID.filter((x) => parseInt(x) === parseInt(product.OrderProductDetailID))
        if (selectedProductDetailsID.length > 0) {

            if (tempArray.length > 0) {
                selectedProductDetailsID.map((X) => {

                    if (X === product.OrderProductDetailID) {
                        let tempIndex = selectedProductIndex
                        let tempID = selectedRowID

                        tempIndex = selectedProductIndex.filter((x) => selectedProductIndex.indexOf(x) !== selectedProductDetailsID.indexOf(X))
                        tempID = selectedProductDetailsID.filter((x) => parseInt(x) !== parseInt(product.OrderProductDetailID))
                        setSelectedProductDetailsID(tempID)
                    }
                })
            }
            else {
                setSelectedProductDetailsID(selectedProductDetailsID => [...selectedProductDetailsID, product.OrderProductDetailID])
            }
        }
        else {
            setSelectedProductDetailsID(selectedProductDetailsID => [...selectedProductDetailsID, product.OrderProductDetailID])
        }
    }
    // Check All Product
    const handleSelectAllProduct = (order, index) => {

        if (selectedRowID.length === selectedProductDetailsID.length) {
            setSelectedProductDetailsID([])
        }
        else {
            setSelectedProductDetailsID(selectedRowID)
        }
    }

    //Set the available row of product can be select
    const handleSetProduct = (row) => {
        let tempOrderDetails = []
        row.OrderProductDetail !== null && JSON.parse(row.OrderProductDetail).filter((filtered) => filtered.LogisticID === null || filtered.LogisticID === 0)
            .filter((x) => JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID === 16 ? parseInt(x.MerchantID) === parseInt(JSON.parse(localStorage.getItem("loginUser"))[0].UserID) : [])
            .map((x) => {
                tempOrderDetails.push(x.OrderProductDetailID)
            })
        setSelectedRowID(tempOrderDetails)
    }

    //View the listing with without tracking number
    const orderListing = (product, i) => {
        return (

            <TableBody>
                <TableRow>
                    <TableCell style={{ width: "10%" }}>
                        <Checkbox
                            checked={
                                selectedProductDetailsID.length > 0 ?
                                    selectedProductDetailsID.filter(x => x === product.OrderProductDetailID).length > 0 ?
                                        true : false : false
                            }
                            onClick={() => handleSelectedProduct(product, i)}
                        />
                    </TableCell>
                    <TableCell style={{ width: "10%" }}>
                        <img
                            height={60}
                            src={product.ProductImage !== null ? JSON.parse(product.ProductImages)[0] : Logo}
                            onError={(e) => { e.target.onerror = null; e.target.src = Logo }}
                            alt={product.ProductName}
                        />
                    </TableCell>
                    <TableCell style={{ width: "50%" }}>
                        <div style={{ fontWeight: "bold", fontSize: "13px" }}>  {product.ProductName} </div>
                        <div style={{ fontSize: "11px" }}>  Variation : {product.ProductVariationValue}  </div>
                        <div style={{ fontSize: "11px" }}>  SKU : {product.SKU}  </div>
                        <div style={{ fontSize: "11px" }}>  Dimension : {product.ProductDimensionWidth}m (W) X {product.ProductDimensionHeight}m (H) X {product.ProductDimensionDeep}m (L) </div>
                        <div style={{ fontSize: "11px" }}>  Weight : {product.ProductWeight} kg   </div>
                    </TableCell>
                    <TableCell style={{ width: "5%" }}> X {product.ProductQuantity}</TableCell>
                    <TableCell style={{ width: "20%" }}>
                        <div style={{ fontWeight: "bold" }}>   Total : RM {(product.ProductQuantity * product.ProductVariationPrice).toFixed(2)}</div>
                    </TableCell>
                </TableRow>
            </TableBody>
        )
    }

    //View the listing with existing tracking number (Product Detail)
    const confirmListing = (product, i) => {
        return (
            <div className="col-8" style={{ paddingTop: "10px" }}>
                <div className="row">
                    <div className="col-3" style={{ width: "20%" }}>
                        <img
                            height={60}
                            src={product.ProductImage !== null ? JSON.parse(product.ProductImages)[0] : Logo}
                            onError={(e) => { e.target.onerror = null; e.target.src = Logo }}
                            alt={product.ProductName}
                        />
                    </div>
                    <div className="col-9" style={{ width: "40%" }}>
                        <div style={{ fontWeight: "bold", fontSize: "13px" }}>  {product.ProductName} </div>
                        <div style={{ fontSize: "11px" }}>  Variation : {product.ProductVariationValue}  </div>
                        <div style={{ fontSize: "11px" }}>  SKU : {product.SKU}  </div>
                        <div style={{ fontSize: "11px" }}>  Dimension : {product.ProductDimensionWidth}m (W) X {product.ProductDimensionHeight}m (H) X {product.ProductDimensionDeep}m (L) </div>
                        <div style={{ fontSize: "11px" }}>  Weight : {product.ProductWeight} kg   </div>
                        <div style={{ fontSize: "13px", fontWeight: "bold" }}>  Total Paid : {(product.ProductQuantity * product.ProductVariationPrice).toFixed(2)}  / Qty ({product.ProductQuantity})</div>
                    </div>
                </div>
            </div>
        )
    }

    //View the listing with existing tracking number (Tracking Details)
    const confirmListingTracking = (product, i, TrackingData) => {
        return (
            <div className="col-4" style={{ paddingTop: "10px" }}>
                <div className="row">
                    <div className="col-6" >
                        <div>   Tracking Number :</div>            {
                            checkExisting(product) !== 0 ?
                                checkExisting(product).map((Data) => {
                                    return (
                                        <>
                                            <FormControl variant="outlined" size="small" style={{ width: "100%" }}>
                                                <Select
                                                    native
                                                    id="Logistic"
                                                    value={Data.existingLogisticID}
                                                    onChange={(x) => handleInputChange(x.target.value, "LogisticID", product)}
                                                    className="select"
                                                >
                                                    {logistic.map((courier) => (
                                                        <option
                                                            value={courier.LogisticID}
                                                            key={courier.LogisticID}
                                                        >
                                                            {courier.LogisticName}
                                                        </option>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <TextField
                                                id="outlined-size-small" size="small"
                                                width="100%"
                                                className="font"
                                                variant="outlined"
                                                value={Data.existingTrackingNumber}
                                                onChange={(x) => handleInputChange(x.target.value, "Tracking", product)}
                                            />
                                        </>
                                    )
                                })
                                :
                                <>
                                    <div style={{ fontWeight: "bold", fontSize: "14px", color: "red" }}> {product.TrackingNumber}</div>
                                    {logistic.filter(x => x.LogisticID === product.LogisticID).map((courier) => {
                                        return (
                                            <div style={{ fontWeight: "bold", fontSize: "12px" }}> {courier.LogisticName}  </div>
                                        )
                                    })}
                                </>
                        }
                    </div>
                    <div className="col-6"  >
                        <div className="row">
                            {checkExisting(product) !== 0 &&
                                <div className="col-4" style={{ alignItems: "center" }}>
                                    <Button style={{ backgroundColor: "#28a745", color: "white" }}
                                        onClick={() => handleUpdateExistingTracking(product.OrderProductDetailID, TrackingData, "update")}
                                    >UPDATE</Button>
                                </div>
                            }
                            <div className="col-4" style={{ alignItems: "center" }}>
                                <Button style={{
                                    backgroundColor: checkExisting(product) !== 0 ? "#808080" : "#28a745", color: "white"
                                }}
                                    onClick={() => handleEditExistingTracking(product, i, TrackingData)}  >{checkExisting(product) !== 0 ? "CANCEL" : "EDIT"}</Button>
                            </div>
                            {checkExisting(product) !== 0 &&
                                <div className="col-4" style={{ alignItems: "center" }}>
                                    <Button style={{ backgroundColor: "#FF7F7F", color: "white" }}
                                        onClick={() => handleUpdateExistingTracking(product.OrderProductDetailID, TrackingData, "delete")}
                                    // onClick={() => handleUpdateExistingTracking(product.OrderProductDetailID)}
                                    >DELETE</Button>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Check whether the selected orderdetail is in the editing list
    const checkExisting = (product) => {
        if (existingTrackingData.length > 0) {
            let filterData = []
            let DataIndex = ""

            existingTrackingData.map((tracking, index) => {
                if (tracking.existingProductDetailsID.filter((x) => parseInt(x) === parseInt(product.OrderProductDetailID)).length > 0)
                    DataIndex = index
            })

            if (DataIndex !== "")
                filterData.push(existingTrackingData[DataIndex])

            if (filterData.length > 0)
                return filterData
            else
                return 0
        }
        else
            return 0
    }

    // Edit Tracking and Logistic ID 
    const handleInputChange = (value, type, product) => {
        let Listing = [...existingTrackingData]
        let DataIndex = ""

        existingTrackingData.map((tracking, index) => {
            if (tracking.existingProductDetailsID.filter((x) => parseInt(x) === parseInt(product.OrderProductDetailID)).length > 0)
                DataIndex = index
        })

        switch (type) {
            case "Tracking":
                Listing[DataIndex].existingTrackingNumber = value
                break;

            case "LogisticID":
                Listing[DataIndex].existingLogisticID = value

                break;

            default:
                break;
        }
        setTrackingData(Listing)
    }

    // Check whether the Data is in the editing list 
    const handleEditExistingTracking = (product, productIndex, TrackingData) => {
        if (checkExisting(product) !== 0) {
            let filterIndex = ""
            existingTrackingData.map((tracking, index) => {
                if (tracking.existingProductDetailsID.filter((x) => parseInt(x) === parseInt(product.OrderProductDetailID)).length > 0)
                    filterIndex = index
            })
            setTrackingData(existingTrackingData.filter((x, i) => i !== filterIndex))
        } else {

            setTrackingData([...existingTrackingData,
            {
                existingLogisticID: product.LogisticID,
                existingTrackingNumber: product.TrackingNumber,
                existingProductDetailsID: getOrderDetailsID(TrackingData, product),
            }])
        }
    }

    //Call to get OrderDetailsID with same tracking number
    const getOrderDetailsID = (TrackingData, product) => {
        let OrderProductDetailID = []
        TrackingData.filter((x) => x.TrackingNumber === product.TrackingNumber && x.LogisticID === product.LogisticID).map((order) => {
            OrderProductDetailID.push(order.OrderProductDetailID)
        })
        return OrderProductDetailID
    }

    // Call API to update tracking number
    const handleUpdateExistingTracking = (ProductDetailsID, TrackingData, option) => {
        let Listing = []
        let filterIndex = ""

        existingTrackingData.map((tracking, index) => {
            if (tracking.existingProductDetailsID.filter((x) => parseInt(x) === parseInt(ProductDetailsID)).length > 0)
                filterIndex = index
        })
        Listing = existingTrackingData.filter((x, i) => i === filterIndex)

        switch (option) {
            case "update":
                prop.CallUpdateOrderTracking({
                    ORDERTRACKINGNUMBER: encodeURIComponent(Listing[0].existingTrackingNumber),
                    LOGISTICID: Listing[0].existingLogisticID,
                    ORDERPRODUCTDETAILSID: Listing[0].existingProductDetailsID
                })
                break;

            case "delete":
                prop.CallUpdateOrderTracking({
                    ORDERTRACKINGNUMBER: "-",
                    LOGISTICID: 0,
                    ORDERPRODUCTDETAILSID: Listing[0].existingProductDetailsID
                })
                break;

            default:
                break;
        }

        setTrackingData(existingTrackingData.filter((x, i) => i !== filterIndex))
    }

    // Submit First Tracking Number
    const handleSubmitTracking = (tracking, LogisticID, ProductDetailsID) => {
        prop.CallUpdateOrderTracking({
            ORDERTRACKINGNUMBER: encodeURIComponent(tracking),
            LOGISTICID: LogisticID,
            ORDERPRODUCTDETAILSID: ProductDetailsID
        })
        setSelectedProductDetailsID([])
    }

    // Before having Tracking Number 
    const trackingView = () => {
        return (
            <div style={{ textAlign: "left" }}>
                <div className="row" >
                    <div className="col-3" style={{ paddingTop: "20px" }}>
                        <label className="px-6">Logistic Tracking Number : </label>
                    </div>
                    <div className="col-3" style={{ paddingTop: "10px" }}>
                        <FormControl variant="outlined" size="small" style={{ width: "100%" }}>
                            <Select
                                native
                                id="Logistic"
                                defaultValue={1}
                                value={logisticID}
                                onChange={(x) => setLogisticID(x.target.value)}
                                className="select"
                            >
                                {logistic.map((courier) => (
                                    <option
                                        value={courier.LogisticID}
                                        key={courier.LogisticID}
                                    >
                                        {courier.LogisticName}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div className="col-3" style={{ paddingTop: "10px" }}>
                        <TextField
                            id="outlined-size-small" size="small"
                            width="100%"
                            className="font"
                            variant="outlined"
                            value={trackingNumber}
                            onChange={(x) => setTrackingNumber(x.target.value)}
                        />
                    </div>
                    <div className="col-2" style={{ paddingTop: "10px" }}>
                        <Button style={{ backgroundColor: trackingNumber === "" ? "#808080" : "#28a745", color: "white" }}
                            onClick={() => handleSubmitTracking(trackingNumber, logisticID, selectedProductDetailsID)}
                            disabled={trackingNumber === "" ? true : false}
                        >SUBMIT</Button>
                    </div>
                </div>
            </div >

        )
    }

    // Get Total Number of different tracking
    const getTrackingLength = (Data) => {
        let checkDuplicte = Data.filter((ele, ind) => ind === Data.findIndex(elem => elem.TrackingNumber === ele.TrackingNumber && elem.LogisticID === ele.LogisticID && elem.LogisticID !== null && elem.LogisticID !== 0))
        return (checkDuplicte)
    }

    // Check whether the selected user details is in the editing list
    const checkExistingUserDetails = (userdetails) => {
        let filterData = []
        if (newUserDetails.length > 0) {
            filterData = newUserDetails.filter((x) => parseInt(x.OrderID) === parseInt(userdetails.OrderID))

            if (filterData.length > 0)
                return filterData
            else
                return 0
        }
        else
            return 0
    }

    // set the address into the array
    const handleSetAddressDetails = (row) => {
        let AddressList = []

        if (row.UserAddressLine1 === null) {

            if (row.UserAddresID === 0)
                AddressList = row
            else
                address.length > 0 && row.UserAddresID !== 0 && address.filter((x) => x.UserAddressBookID === row.UserAddresID).map((address) => {
                    AddressList = address
                })
        }
        else
            AddressList = row

        if (checkExistingUserDetails(row) !== 0) {
            setUserDetails(newUserDetails.filter((x, i) => x.OrderID !== row.OrderID))
        }
        else {
            setUserDetails([...newUserDetails,
            {
                OrderID: row.OrderID,
                UserFullName: row.FirstName !== null ? row.FirstName + row.LastName : "",
                UserContactNo: row.UserContactNo !== null ? row.UserContactNo : "",
                UserEmailAddress: row.UserEmailAddress !== null ? row.UserEmailAddress : "",
                Method: row.PickUpInd === 1 ? "Self Pick Up" : "Delivery",

                UserAddressLine1: AddressList.UserAddressLine1 !== null ? AddressList.UserAddressLine1 : "",
                UserAddressLine2: AddressList.UserAddressLine2 !== null ? AddressList.UserAddressLine2 : "",
                UserCity: AddressList.UserCity !== null ? AddressList.UserCity : "",
                UserPoscode: AddressList.UserPoscode !== null ? AddressList.UserPoscode : "",
                UserState: AddressList.UserState !== null ? AddressList.UserState : "",
                CountryID: AddressList.CountryID !== null ? AddressList.CountryID : 148,
            }])
        }
    }

    // show the list of address
    const addressList = (address, row) => {
        return (
            <>
                <div className="row" style={{ display: "flex" }}>
                    <div className="col-6" >
                        <div className="row">
                            <div className="col-3">
                                <p className="subTextLeft">{"Address Line 1  "}</p>
                            </div>
                            <div className="col-8">
                                <TextField
                                    id="outlined-size-small" size="small"
                                    width="100%"
                                    className="font"
                                    variant="outlined"
                                    value={checkExistingUserDetails(row) !== 0 ? checkExistingUserDetails(row).map((Data) => { return (Data.UserAddressLine1) }) : address.UserAddressLine1}
                                    disabled={checkExistingUserDetails(row) !== 0 ? false : true}
                                    onChange={(x) => handleUserDetailsChange(x.target.value, "Address1", row)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className=" col-6" >
                        <div className="row">
                            <div className="col-3" style={{ textAlign: "left" }}>
                                <p className="subTextLeft">{"Address Line 2"}</p>
                            </div>
                            <div className="col-8">
                                <TextField
                                    id="outlined-size-small" size="small"
                                    width="100%"
                                    className="font"
                                    variant="outlined"
                                    value={checkExistingUserDetails(row) !== 0 ? checkExistingUserDetails(row).map((Data) => { return (Data.UserAddressLine2) }) : address.UserAddressLine2}
                                    disabled={checkExistingUserDetails(row) !== 0 ? false : true}
                                    onChange={(x) => handleUserDetailsChange(x.target.value, "Address2", row)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row" style={{ display: "flex" }}>
                    <div className=" col-3">
                        <div className="row">
                            <div className="col-3" >
                                <p className="subTextLeft">{"City"}</p>
                            </div>
                            <div className="col-8">
                                <TextField
                                    id="outlined-size-small" size="small"
                                    width="100%"
                                    className="font"
                                    variant="outlined"
                                    value={checkExistingUserDetails(row) !== 0 ? checkExistingUserDetails(row).map((Data) => { return (Data.UserCity) }) : address.UserCity}
                                    disabled={checkExistingUserDetails(row) !== 0 ? false : true}
                                    onChange={(x) => handleUserDetailsChange(x.target.value, "City", row)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-3">
                        <div className="row">
                            <div className="col-3">
                                <p className="subTextLeft">{"State"}</p>
                            </div>
                            <div className="col-8">
                                <TextField
                                    id="outlined-size-small" size="small"
                                    width="100%"
                                    className="font"
                                    variant="outlined"
                                    value={checkExistingUserDetails(row) !== 0 ? checkExistingUserDetails(row).map((Data) => { return (Data.UserState) }) : address.UserState}
                                    disabled={checkExistingUserDetails(row) !== 0 ? false : true}
                                    onChange={(x) => handleUserDetailsChange(x.target.value, "State", row)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className=" col-3">
                        <div className="row">
                            <div className="col-3">
                                <p className="subTextLeft">{"Poscode"}</p>
                            </div>
                            <div className="col-8">
                                <TextField
                                    id="outlined-size-small" size="small"
                                    width="100%"
                                    className="font"
                                    variant="outlined"
                                    value={checkExistingUserDetails(row) !== 0 ? checkExistingUserDetails(row).map((Data) => { return (Data.UserPoscode) }) : address.UserPoscode}
                                    disabled={checkExistingUserDetails(row) !== 0 ? false : true}
                                    onChange={(x) => handleUserDetailsChange(x.target.value, "Poscode", row)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className=" col-3">
                        <div className="row">
                            <div className="col-3">
                                <p className="subTextLeft">{"Country"}</p>
                            </div>
                            <div className="col-8">
                                <FormControl variant="outlined" size="small" style={{ width: "100%" }}>
                                    <Select
                                        native
                                        id="Logistic"
                                        value={checkExistingUserDetails(row) !== 0 ? checkExistingUserDetails(row).map((Data) => { return (Data.CountryID) }) : address.CountryID}
                                        onChange={(x) => handleUserDetailsChange(x.target.value, "Country", row)}
                                        className="select"
                                        disabled={checkExistingUserDetails(row) !== 0 ? false : true}
                                    >
                                        {country.length > 0 && country.map((country) => (
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
                    </div>
                </div>
            </>
        )
    }

    // handle user details change
    const handleUserDetailsChange = (data, type, userDetails) => {
        let Listing = [...newUserDetails]
        let DataIndex = 0

        DataIndex = newUserDetails.findIndex((x) => parseInt(x.OrderID) === parseInt(userDetails.OrderID))
        switch (type) {
            case "Name":
                Listing[DataIndex].UserFullName = data
                setUserDetails(Listing)
                break;

            case "Contact":
                Listing[DataIndex].UserContactNo = data
                setUserDetails(Listing)
                break;

            case "Email":
                Listing[DataIndex].UserEmailAddress = data
                break;

            case "Method":
                Listing[DataIndex].Method = data
                break;

            case "Address1":
                Listing[DataIndex].UserAddressLine1 = data
                break;

            case "Address2":
                Listing[DataIndex].UserAddressLine2 = data
                break;

            case "City":
                Listing[DataIndex].UserCity = data
                break;

            case "State":
                Listing[DataIndex].UserState = data
                break;

            case "Poscode":
                Listing[DataIndex].UserPoscode = data
                break;

            case "Country":
                Listing[DataIndex].CountryID = data
                break;

            default:
                break;
        }
        setUserDetails(Listing)
    }

    // handle submit user details into db
    const handleSubmitChangeUserDetails = (userDetails) => {
        let filterData = []
        if (newUserDetails.length > 0) {
            filterData = newUserDetails.filter((x) => parseInt(x.OrderID) === parseInt(userDetails.OrderID))
            prop.CallUpdateOrderUserDetails({
                OrderID: filterData[0].OrderID,
                FirstName: filterData[0].UserFullName !== "" ? filterData[0].UserFullName : "-",
                LastName: "-",
                PickUpInd: filterData[0].Method === "Delivery" ? 0 : 1,
                UserContactNo: filterData[0].UserContactNo !== "" ? filterData[0].UserContactNo : "-",
                UserEmailAddress: filterData[0].UserEmailAddress !== "" ? filterData[0].UserEmailAddress : "-",
                UserAddressLine1: filterData[0].UserAddressLine1 !== "" ? filterData[0].UserAddressLine1 : "-",
                UserAddressLine2: filterData[0].UserAddressLine2 !== "" ? filterData[0].UserAddressLine2 : "-",

                UserPoscode: filterData[0].UserPoscode !== "" ? filterData[0].UserPoscode : "-",
                UserState: filterData[0].UserState !== "" ? filterData[0].UserState : "-",

                UserCity: filterData[0].UserCity !== "" ? filterData[0].UserCity : "-",
                CountryID: filterData[0].CountryID,
            })

            setUserDetails(newUserDetails.filter((x) => parseInt(x.OrderID) !== parseInt(userDetails.OrderID)))
        } else {
            toast.warning("Unable to update the User Details, Please Try Again Later")
        }
    }

    // check error of userdetails before submission to db
    const checkError = (userDetails) => {
        let filterData = []
        if (newUserDetails.length > 0) {
            filterData = newUserDetails.filter((x) => parseInt(x.OrderID) === parseInt(userDetails.OrderID))
            if (filterData.length > 0) {

                if (filterData[0].Method === "Delivery") {
                    if (isContactValid(filterData[0].UserContactNo) === true && isEmailValid(filterData[0].UserEmailAddress) === true && isStringNullOrEmpty(filterData[0].UserAddressLine1) === false
                        && isStringNullOrEmpty(filterData[0].UserAddressLine2) === false && isStringNullOrEmpty(filterData[0].UserCity) === false && isStringNullOrEmpty(filterData[0].UserFullName) === false
                        && isStringNullOrEmpty(filterData[0].UserPoscode) === false && isStringNullOrEmpty(filterData[0].UserState) === false)
                        return 1
                    else
                        return 0
                }
                else
                    return 1
            }
            else
                return 0
        }
        else
            return 0
    }

    return (
        <React.Fragment>
            <TableRow
                hover
                role="checkbox"
                tabIndex={-1}
                key={row.Username}
                onClick={() =>
                    <>
                        {(setOpen(!open), setOpenId(row.OrderID), handleSetProduct(row))}
                    </>
                }
            >
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                    >
                        {open ? <ArrowRoundedUp13x8Svg /> : <ArrowRoundedDown12x7Svg />}
                    </IconButton>
                </TableCell>
                <TableCell align="left">{row.OrderName}</TableCell>
                <TableCell align="left">{row.Username}</TableCell>
                <TableCell align="left">{row.PaymentMethod}</TableCell>
                <TableCell align="left">{row.TrackingStatus}</TableCell>
                <TableCell align="left">
                    {row.OrderProductDetail ? (
                        <p>{JSON.parse(row.OrderProductDetail).length}</p>
                    ) : (
                        0
                    )}
                </TableCell>
            </TableRow>
            <TableRow className="subTable">
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={2}>
                            <div className="row" style={{ display: "flex" }}>
                                <div className=" col-10"><p className="subHeading">User Details</p></div>
                                <div className=" col-2" >
                                    <div classNam="row" style={{ display: "flex", textAlign: "right" }}>
                                        <div className="col-6">
                                            {
                                                checkExistingUserDetails(row) !== 0 &&
                                                <Button style={{ backgroundColor: checkError(row) === 0 ? "#4d6b53" : "#28a745", color: "white" }}
                                                    onClick={() => handleSubmitChangeUserDetails(row)}
                                                    disabled={checkError(row) === 0 ? true : false}
                                                >UPDATE</Button>
                                            }
                                        </div>
                                        <div className="col-6"><Button style={{ backgroundColor: checkExistingUserDetails(row) !== 0 ? "#808080" : "#0277bd", color: "white" }}
                                            onClick={() => handleSetAddressDetails(row)}
                                        >{checkExistingUserDetails(row) !== 0 ? "CANCEL" : "EDIT"}</Button></div>
                                    </div>
                                </div>
                            </div>


                            <div className="row" style={{ display: "flex", paddingTop: "10px" }}>
                                <div className="col-6">
                                    <div className="row">
                                        <div className="col-3" >
                                            <p className="subTextLeft">{"Full Name "}</p>
                                        </div>
                                        <div className="col-8">
                                            <TextField
                                                id="outlined-size-small" size="small"
                                                width="100%"
                                                className="font"
                                                variant="outlined"
                                                value={checkExistingUserDetails(row) !== 0 ? checkExistingUserDetails(row).map((Data) => { return (Data.UserFullName) }) : row.UserFullName}
                                                disabled={checkExistingUserDetails(row) !== 0 ? false : true}
                                                onChange={(x) => handleUserDetailsChange(x.target.value, "Name", row)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="row">
                                        <div className="col-3" style={{ textAlign: "left" }}>
                                            <p className="subTextLeft">{"Contact Number"}</p>
                                        </div>
                                        <div className="col-8">
                                            <TextField
                                                id="outlined-size-small" size="small"
                                                width="100%"
                                                className="font"
                                                variant="outlined"
                                                value={checkExistingUserDetails(row) !== 0 ? checkExistingUserDetails(row).map((Data) => { return (Data.UserContactNo) }) : row.UserContactNo}
                                                disabled={checkExistingUserDetails(row) !== 0 ? false : true}
                                                onChange={(x) => handleUserDetailsChange(x.target.value, "Contact", row)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row" style={{ display: "flex" }}>
                                <div className=" col-6">
                                    <div className="row">
                                        <div className="col-3" >
                                            {/* <div className="col-2" style={{ textAlign: "left", paddingLeft: "0px" }}> */}
                                            <p className="subTextLeft">{"Email"}</p>
                                        </div>

                                        <div className="col-8">
                                            <TextField
                                                id="outlined-size-small" size="small"
                                                width="100%"
                                                className="font"
                                                variant="outlined"
                                                value={checkExistingUserDetails(row) !== 0 ? checkExistingUserDetails(row).map((Data) => { return (Data.UserEmailAddress) }) : row.UserEmailAddress}
                                                disabled={checkExistingUserDetails(row) !== 0 ? false : true}
                                                onChange={(x) => handleUserDetailsChange(x.target.value, "Email", row)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6">
                                    {
                                        <>
                                            <div className="row">
                                                <div className="col-3" style={{ textAlign: "left" }}>
                                                    <p className="subTextLeft">{"Method"}</p>
                                                </div>
                                                <div className="col-8">
                                                    <FormControl variant="outlined" size="small" style={{ width: "100%" }}>
                                                        <Select
                                                            native
                                                            id="Logistic"
                                                            value={checkExistingUserDetails(row) !== 0 ? checkExistingUserDetails(row).map((Data) => { return (Data.Method) }) : row.PickUpInd === 1 ? "Self Pick Up" : "Delivery"}
                                                            onChange={(x) => handleUserDetailsChange(x.target.value, "Method", row)}
                                                            className="select"
                                                            disabled={checkExistingUserDetails(row) !== 0 ? false : true}
                                                        >
                                                            <option> Self Pick Up </option>
                                                            <option> Delivery </option>
                                                        </Select>
                                                    </FormControl>
                                                </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>
                            {
                                row.UserAddresID === 0 && row.PickUpInd === 1 && row.UserAddressLine1 === null && checkExistingUserDetails(row) !== 0 && checkExistingUserDetails(row).filter((x) => x.Method === "Delivery").length > 0 &&
                                addressList(row, row)
                            }

                            {
                                row.UserAddressLine1 !== null && row.PickUpInd === 0 && checkExistingUserDetails(row) === 0 &&
                                addressList(row, row)
                            }
                            {
                                row.UserAddressLine1 !== null && row.PickUpInd === 1 && checkExistingUserDetails(row) !== 0 && checkExistingUserDetails(row).filter((x) => x.Method === "Delivery").length > 0 &&
                                addressList(row, row)
                            }

                            {
                                row.UserAddressLine1 !== null && row.PickUpInd === 0 && checkExistingUserDetails(row) !== 0 && checkExistingUserDetails(row).filter((x) => x.Method === "Delivery").length > 0 &&
                                addressList(row, row)
                            }

                            <p className="subHeading">Products Ordered</p>
                            {row.OrderProductDetail ? (
                                <>
                                    <div size="small" aria-label="products">
                                        {JSON.parse(row.OrderProductDetail).filter((x) => x.LogisticID === null || x.LogisticID === 0)
                                            .filter((x) => JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID === 16 ? parseInt(x.MerchantID) === parseInt(JSON.parse(localStorage.getItem("loginUser"))[0].UserID) : [])
                                            .length > 0 ?
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedProductDetailsID.length === 0 ? false :
                                                        selectedRowID.length === selectedProductDetailsID.length ? true : false
                                                    }
                                                    onClick={() => handleSelectAllProduct(row, index)}
                                                />
                                            </TableCell> : ""}
                                        <>
                                            {
                                                row.OrderProductDetail ?
                                                    <>
                                                        {JSON.parse(row.OrderProductDetail)
                                                            .filter((x) => JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID === 16 ? parseInt(x.MerchantID) === parseInt(JSON.parse(localStorage.getItem("loginUser"))[0].UserID) : [])
                                                            .map((product, i) => (
                                                                <>
                                                                    {

                                                                        product.LogisticID === null ?
                                                                            selectedProductDetailsID.length > 0 && selectedProductDetailsID.filter(x => x === product.OrderProductDetailID).length > 0 &&
                                                                            orderListing(product, i)
                                                                            :
                                                                            product.LogisticID === 0 &&
                                                                            selectedProductDetailsID.length > 0 && selectedProductDetailsID.filter(x => x === product.OrderProductDetailID).length > 0 &&
                                                                            orderListing(product, i)
                                                                    }
                                                                </>
                                                            ))
                                                        }
                                                        {selectedProductDetailsID.length > 0 && trackingView()}
                                                        {JSON.parse(row.OrderProductDetail)
                                                            .filter((x) => JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID === 16 ? parseInt(x.MerchantID) === parseInt(JSON.parse(localStorage.getItem("loginUser"))[0].UserID) : [])
                                                            .map((product, i) => (
                                                                <>
                                                                    {
                                                                        selectedProductDetailsID.length > 0 && selectedProductDetailsID.filter(x => x === product.OrderProductDetailID).length > 0 ? "" :
                                                                            product.LogisticID === null ? orderListing(product, i) :
                                                                                product.LogisticID === 0 && orderListing(product, i)
                                                                    }
                                                                </>
                                                            ))
                                                        }
                                                    </>
                                                    : null
                                            }
                                        </>
                                    </div>
                                    {getTrackingLength(JSON.parse(row.OrderProductDetail)).length > 0 && getTrackingLength(JSON.parse(row.OrderProductDetail))
                                        .filter((x) => JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID === 16 ? parseInt(x.MerchantID) === parseInt(JSON.parse(localStorage.getItem("loginUser"))[0].UserID) : [])
                                        .map((track, index) => {
                                            return (
                                                <div className="row" style={{ borderTop: "4px solid #fff", paddingTop: "5px", paddingBottom: "5px" }}>
                                                    {row.OrderProductDetail ? JSON.parse(row.OrderProductDetail)
                                                        .filter((x) => JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID === 16 ? parseInt(x.MerchantID) === parseInt(JSON.parse(localStorage.getItem("loginUser"))[0].UserID) : [])
                                                        .map((product, i) => (
                                                            <>
                                                                {
                                                                    product.TrackingNumber === track.TrackingNumber && product.LogisticID === track.LogisticID &&
                                                                    <>{confirmListing(product, i)}
                                                                    </>
                                                                }
                                                            </>
                                                        ))
                                                        : null}
                                                    {confirmListingTracking(track, index, JSON.parse(row.OrderProductDetail).filter((x) => x.LogisticID !== null && x.LogisticID !== 0))}
                                                </div>
                                            )
                                        })}
                                </>

                            ) : (
                                <p className="fadedText">No Products To Display</p>
                            )}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow >
        </React.Fragment >
    );
}

class DisplayTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            order: "asc",
            orderBy: "OrderID",
            selected: [],
            page: 0,
            dense: false,
            rowsPerPage: 5,
            detailsShown: false,
            deleteActive: false,
            isFiltered: false,
            filteredProduct: [],
            searchKeywords: "",
        };

        this.handleRequestSort = this.handleRequestSort.bind(this);
        this.onRowClick = this.onRowClick.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeDense = this.handleChangeDense.bind(this);
        this.isSelected = this.isSelected.bind(this);
    }

    handleRequestSort = (event, property) => {
        const isAsc = this.state.orderBy === property && this.state.order === "asc";
        this.setState({ order: isAsc ? "desc" : "asc" });
        this.setState({ orderBy: property });
    };

    onRowClick = (event, row, index) => {
        this.setState({
            name: row.OrderName,
            PaymentMethod: row.PaymentMethod,
            TrackingStatus: row.TrackingStatus,
            orderProductDetail: row.OrderProductDetail,
            username: row.Username,
            orderID: row.OrderID,
            row: index,
            fullName: row.UserFullName,
            phoneNumber: row.UserContactNo,
            email: row.UserEmailAddress,
            address: row.UserAddressLine1,
            detailsShown: false,
        });

        if (this.state.detailsShown) {
            this.setState({
                detailsShown: false,
            });
            this.props.setTabsHidden(false);
        } else {
            this.setState({
                detailsShown: true,
            });
            this.props.setTabsHidden(true);
        }
    };

    setData = (row, index) => {
        this.setState({
            name: row.OrderName,
            PaymentMethod: row.PaymentMethod,
            TrackingStatus: row.TrackingStatus,
            orderProductDetail: row.OrderProductDetail,
            username: row.Username,
            orderID: row.OrderID,
            row: index,
            fullName: row.UserFullName,
            phoneNumber: row.UserContactNo,
            email: row.UserEmailAddress,
            address: row.UserAddressLine1,
            detailsShown: false,
        });
        if (this.state.detailsShown) {
            this.setState({
                detailsShown: false,
            });
            this.props.setTabsHidden(false);
        } else {
            this.setState({
                detailsShown: true,
            });
            this.props.setTabsHidden(true);
        }
    };

    handleChangePage = (event, newPage) => {
        this.setState({ page: newPage });
    };

    handleChangeRowsPerPage = (event) => {
        this.setState({ rowsPerPage: parseInt(event.target.value, 10) });
        this.setState({ page: 0 });
    };

    handleChangeDense = (event) => {
        this.setState({ dense: event.target.checked });
    };

    isSelected = (name) => {
        // this.state.selected.indexOf(name) !== -1;
    };

    setDetailsShown = () => {
        if (this.state.detailsShown) {
            this.setState({
                detailsShown: false,
            });
            this.props.setTabsHidden(false);
        } else {
            this.setState({
                detailsShown: true,
            });
            this.props.setTabsHidden(true);
        }
    };

    searchSpace = (value) => {
        var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

        this.setState({ searchKeywords: value })
        this.state.filteredProduct.splice(0, this.state.filteredProduct.length)

        this.props.Data.filter((searchedItem) =>
            searchedItem.OrderName !== null && searchedItem.OrderName.toLowerCase().includes(
                value.toLowerCase()
            )
        ).map((filteredItem) => {
            this.state.filteredProduct.push(filteredItem);
        })

        this.props.Data.map((list) => {
            list.OrderProductDetail !== null && JSON.parse(list.OrderProductDetail).filter(x => x.TrackingNumber !== null
                && x.TrackingNumber.toLowerCase().includes(value.toLowerCase())).map(filteredItem => {
                    this.state.filteredProduct.push(list);
                });
        })

        let removeDeplicate = this.state.filteredProduct.filter((ele, ind) => ind === this.state.filteredProduct.findIndex(elem => elem.OrderID === ele.OrderID))
        this.setState({ isFiltered: true, filteredProduct: removeDeplicate })
    }

    render() {
        const { classes } = this.props;
        const emptyRows =
            this.state.rowsPerPage -
            Math.min(
                this.state.rowsPerPage,
                this.props.Data.length - this.state.page * this.state.rowsPerPage
            );


        const divStyle = {
            width: "100%",
            margin: "auto",
            padding: "1%",
            marginTop: "15px",
        };

        const table = {
            minWidth: 750,
        };

        const classes2 = {
            border: 0,
            clip: "rect(0 0 0 0)",
            height: 1,
            margin: -1,
            overflow: "hidden",
            padding: 0,
            position: "absolute",
            top: 20,
            width: 1,
        };

        return (
            <div style={{ margin: "2%" }}>
                {this.state.detailsShown ? (
                    ""
                    //   <TransactionDetails
                    //     data={this.state}
                    //     data2={this.props}
                    //     history={this.props.history}
                    //     forMerchants={false}
                    //     setDetailsShown={this.setDetailsShown}
                    //   />
                ) : (
                    <div>
                        <div>
                            <Paper style={divStyle}>
                                <TableContainer>
                                    {this.props.Data.length != 0 ? (
                                        <Table
                                            className={table}
                                            aria-labelledby="tableTitle"
                                            size={this.state.dense ? "small" : "medium"}
                                            aria-label="enhanced table"
                                        >
                                            <DisplayTableHead
                                                classes={classes2}
                                                numSelected={this.state.selected.length}
                                                order={this.state.order}
                                                orderBy={this.state.orderBy}
                                                onRequestSort={this.handleRequestSort}
                                                rowCount={this.props.Data.length}
                                            />
                                            <TableBody>
                                                {stableSort(
                                                    this.state.isFiltered ? this.state.filteredProduct : this.props.Data,
                                                    getComparator(this.state.order, this.state.orderBy)
                                                )
                                                    .slice(
                                                        this.state.page * this.state.rowsPerPage,
                                                        this.state.page * this.state.rowsPerPage +
                                                        this.state.rowsPerPage
                                                    )
                                                    .map((row, index) => {
                                                        const isItemSelected = this.isSelected(
                                                            row.Username
                                                        );
                                                        const labelId = `enhanced-table-checkbox-${index}`;
                                                        return (
                                                            <Row
                                                                row={row}
                                                                setDetailsShown={this.setDetailsShown}
                                                                index={index}
                                                                setData={this.setData}
                                                                prop={this.props.ProductProps}
                                                                logistic={this.props.ProductProps.logistic}
                                                                address={this.props.ProductProps.allAddress}
                                                                country={this.props.ProductProps.countries}
                                                            />
                                                        );
                                                    })}
                                                {emptyRows > 0 && (
                                                    <TableRow
                                                        style={{
                                                            height: (this.state.dense ? 33 : 53) * emptyRows,
                                                        }}
                                                    >
                                                        <TableCell colSpan={6} />
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    ) : (
                                        <p className="fadedText">No Orders to Display</p>
                                    )}
                                </TableContainer>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    component="div"
                                    count={this.props.Data.length}
                                    rowsPerPage={this.state.rowsPerPage}
                                    page={this.state.page}
                                    onPageChange={this.handleChangePage}
                                    onRowsPerPageChange={this.handleChangeRowsPerPage}
                                />
                            </Paper>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

class ViewTransactionsComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fixedHeader: true,
            fixedFooter: true,
            stripedRows: false,
            showRowHover: false,
            selectable: true,
            multiSelectable: false,
            enableSelectAll: false,
            deselectOnClickaway: true,
            showCheckboxes: true,
            selection: [],
            selectAll: false,
            height: "300px",
            detailsShown: false,
            index: null,
            name: null,
            category: null,
            supplier: null,
            height: null,
            width: null,
            depth: null,
            weight: null,
            description: null,
            sku: null,
            brand: null,
            model: null,
            tags: null,
            grid: null,
            shoplot: null,
            productCategory: null,
            productSupplier: null,
            productGrid: null,
            productShoplot: null,
            productStatus: "Endorsed",
            backPage: "viewProduct",
            value: 0,
            tabsHidden: false,
            currentlyChosen: "Payment Confirm",
            setting: false,

            searchKeywords: "",
            isFiltered: false,
            filteredProduct: [],
        };
    }

    componentDidMount() {
        this.props.CallGetTransactionStatus();
        this.props.CallGetTransaction({ TrackingStatus: "Payment Confirm", ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID });
        this.props.CallCourierService();
        // this.props.CallAllUserAddress({ ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID });
        this.props.CallCountry();

        this.props.CallMerchants({
            type: "Status",
            typeValue: "Endorsed",
            USERID: JSON.parse(localStorage.getItem("loginUser"))[0].UserID !== undefined ? JSON.parse(localStorage.getItem("loginUser"))[0].UserID : 0,
            userRoleID: JSON.parse(localStorage.getItem("loginUser"))[0].UserID !== undefined ? JSON.parse(localStorage.getItem("loginUser"))[0].UserID : 0,
            productPage: 999,
            page: 1,
            ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID
        })
    }


    componentDidUpdate(prevProps) {
        if (this.props.tracking.length > 0 && this.props.tracking[0].ReturnVal !== undefined) {
            this.props.CallResetOrderTracking()
            this.props.CallGetTransaction({ TrackingStatus: "Payment Confirm", ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID });
            this.setState({ setting: true })
        }

        if (this.props.order.length > 0 && this.props.order[0].ReturnVal !== undefined) {
            this.props.CallClearOrder()
            this.props.CallGetTransaction({ TrackingStatus: "Payment Confirm", ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID });
            this.setState({ setting: true })
        }
    }



    setTabsHidden = (value) => {
        this.setState({
            tabsHidden: value,
        });
    };

    updateList = (e) => {
        this.setState({
            currentlyChosen: e.target.value,
        });
    };

    searchSpace = (value) => {

        let transactionList = []
        if (JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID === 1)
            this.props.alltransactions.filter((x) => x.TrackingStatus === this.state.currentlyChosen).map((y) => {
                transactionList.push(y)
            })

        if (JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID === 16) {
            this.props.alltransactions !== null && this.props.alltransactions.map((list) => {
                list.OrderProductDetail !== null && JSON.parse(list.OrderProductDetail).filter((y) => parseInt(y.MerchantID) === parseInt(JSON.parse(localStorage.getItem("loginUser"))[0].UserID) && list.TrackingStatus === this.state.currentlyChosen).map((data) => {
                    transactionList.push(list)
                })
            })
        }

        console.log("transactionList", transactionList)


        // var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

        this.setState({ searchKeywords: value })
        this.state.filteredProduct.splice(0, this.state.filteredProduct.length)


        transactionList.length > 0 && transactionList.filter((searchedItem) =>
            searchedItem.OrderName !== null && searchedItem.OrderName.toLowerCase().includes(
                value.toLowerCase()
            )
        ).map((filteredItem) => {
            this.state.filteredProduct.push(filteredItem);
        })

        transactionList.length > 0 && transactionList.map((list) => {
            list.OrderProductDetail !== null && JSON.parse(list.OrderProductDetail).filter(x => x.TrackingNumber !== null
                && x.TrackingNumber.toLowerCase().includes(value.toLowerCase())).map(filteredItem => {
                    this.state.filteredProduct.push(list);
                });
        })


        console.log("filteredProduct", this.state.filteredProduct)
        let removeDeplicate = this.state.filteredProduct.filter((ele, ind) => ind === this.state.filteredProduct.findIndex(elem => elem.OrderID === ele.OrderID))
        this.setState({ isFiltered: true, filteredProduct: removeDeplicate })
    }


    render() {
        const handleChange = (event, newValue) => {
            this.setState({ value: newValue });
        };

        function a11yProps(index) {
            return {
                id: `scrollable-auto-tab-${index}`,
                "aria-controls": `scrollable-auto-tabpanel-${index}`,
            };
        }

        function TabPanel(props) {
            const { children, value, index, ...other } = props;

            return (
                <div
                    role="tabpanel"
                    hidden={value !== index}
                    id={`scrollable-auto-tabpanel-${index}`}
                    aria-labelledby={`scrollable-auto-tab-${index}`}
                    {...other}
                >
                    {value === index && (
                        <Box p={3}>
                            <Typography>{children}</Typography>
                        </Box>
                    )}
                </div>
            );
        }

        const changeData = (value) => {
            this.props.CallGetTransaction(value);
        };

        let allTransactionStatusData = this.props.alltransactionstatus
            ? Object.keys(this.props.alltransactionstatus).map((key) => {
                return this.props.alltransactionstatus[key];
            })
            : {};

        if (allTransactionStatusData.length > 0) {
            var generateOptions = allTransactionStatusData.map((status, i) => {
                return (
                    <option value={status.TrackingStatus}>{status.TrackingStatus}</option>
                );
            });
        }

        if (allTransactionStatusData.length > 0) {
            let transactionList = []
            if (JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID === 1)
                this.props.alltransactions.filter((x) => x.TrackingStatus === this.state.currentlyChosen).map((y) => {
                    transactionList.push(y)
                })

            if (JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID === 16) {
                this.props.alltransactions !== null && this.props.alltransactions.map((list) => {
                    list.OrderProductDetail !== null && JSON.parse(list.OrderProductDetail).filter((y) => parseInt(y.MerchantID) === parseInt(JSON.parse(localStorage.getItem("loginUser"))[0].UserID) && list.TrackingStatus === this.state.currentlyChosen).map((data) => {
                        transactionList.push(list)
                    })
                })
            }
            var generateTable =
                (
                    <div>
                        <DisplayTable
                            Data={
                                this.state.isFiltered === false ?
                                    transactionList.filter((ele, ind) => ind === transactionList.findIndex(elem => elem.OrderID === ele.OrderID))
                                    :
                                    this.state.filteredProduct.filter((ele, ind) => ind === this.state.filteredProduct.findIndex(elem => elem.OrderID === ele.OrderID))
                            }
                            ProductProps={this.props}
                            history={this.props.history}
                            tabsHidden={this.state.tabsHidden}
                            setTabsHidden={this.setTabsHidden}
                        />
                    </div>
                );

        }
        return (
            <div className="mainContainer">
                {!this.state.tabsHidden ? (
                    <div>
                        <p className="heading">Orders List</p>
                        <div className="selectContainer">
                            <div style={{ marginBottom: "10px", margin: "2%" }}></div>
                            <div className="row" style={{ marginBottom: "10px", margin: "2%" }}>
                                <div className="col-md-10 col-10 m-auto" >
                                    <SearchBar
                                        id=""
                                        placeholder="Search By Tracking Number or Order Number..."
                                        buttonOnClick={() => this.onSearch("", "")}
                                        onChange={(e) => this.searchSpace(e.target.value)}
                                        className="searchbar-input mb-auto"
                                        disableButton={this.state.isDataFetching}
                                        tooltipText="Search with current data"
                                        value={this.state.searchKeywords}
                                    />
                                </div>

                                <div className="col-md-2 col-2 m-auto" style={{ paddingTop: "10px" }}>
                                    <div className="selectContainer">
                                        <FormControl variant="outlined" size="small">
                                            <Select
                                                native
                                                value={this.state.productSupplier}
                                                onChange={this.updateList.bind(this)}
                                                inputProps={{
                                                    name: "Product Supplier",
                                                    id: "productSupplier",
                                                }}
                                                className="select"
                                            >
                                                {generateOptions}
                                            </Select>
                                        </FormControl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}
                {generateTable}
                {console.log("list", this.props)}
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ViewTransactionsComponent);
