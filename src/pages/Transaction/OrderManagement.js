import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GitAction } from "../../store/action/gitAction";
import "../../app/App.scss";
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from "react-toastify";
import { isArrayNotEmpty, isContactValid } from "../../tools/Helpers";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
    Paper, Typography, Card, CardContent, Select, MenuItem, TableRow, Box, TableHead, FormHelperText,
    InputLabel, Checkbox, TableContainer, OutlinedInput, FormControl, TableCell, TableBody, Table, IconButton, Collapse,
    TablePagination, Tabs, Tab,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import LoadingPanel from "../../tools/LoadingPanel";
import { Button } from "reactstrap";
import moment from "moment/moment";
import Logo from "../../assets/logos/logo.png";


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export const OrderManagement = (props) => {
    const { transactions, countries, transactionStatus } = useSelector(state => ({
        transactions: state.counterReducer.transactions,
        transactionStatus: state.counterReducer.transactionStatus,
        countries: state.counterReducer.countries
    }));

    const dispatch = useDispatch()
    const [value, setValue] = useState(0);
    const [isOrderSet, setOrder] = useState(false)
    const [isOrderSelected, setSelectedList] = useState(false)
    const [OrderListing, setOrderListing] = useState(false)
    const [deliveryMan, setDeliveryMan] = useState([
        { id: 1, driverName: "Ali" },
        { id: 2, driverName: "Vincent" },
        { id: 3, driverName: "Peter" },
        { id: 4, driverName: "Aladin" }
    ])
    const [OrderDeliverySetting, setOrderDeliverySetting] = useState({
        deliveryMan: "",
        isDeliverymanError: false,
        deliveryDateTime: "",
        isDeliveryDateTimeError: false,
    })
    const TitleStyle = { fontWeight: "bold", fontSize: "15pt" }
    const HeaderStyle = { fontWeight: "bold", fontSize: "12pt" }
    const DetailStyle = { fontSize: "10pt", color: "gray" }

    useEffect(() => {
        dispatch(GitAction.CallGetTransaction({
            TrackingStatus: "Payment Confirm",
            ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID
        }))
        dispatch(GitAction.CallCountry())
        dispatch(GitAction.CallGetTransactionStatus())
    }, [])

    useEffect(() => {
        if (isOrderSet === false && isArrayNotEmpty(transactions)) {
            let listing = []
            transactions.map((order) => {
                let detailListing = []
                order.OrderProductDetail !== undefined && JSON.parse(order.OrderProductDetail).map((detail) => {
                    detailListing = [...detailListing, {
                        ...detail,
                        pendingDeliveryQty: detail.ProductQuantity,
                        deliveryDateTime: "",
                        isDeliveryDateTimeError: false,
                        deliveryQuantity: "",
                        isDeliveryQuantityError: false,
                        deliveryman: "",
                        isDeliverymanError: false,
                        isCheckBoxSelected: false
                    }]
                })
                listing = [...listing, {
                    ...order,
                    orderDetails: detailListing,
                    deliveryDateTime: "",
                    isDeliveryDateTimeError: false,
                    deliveryQuantity: "",
                    isDeliveryQuantityError: false,
                    deliveryman: "",
                    isDeliverymanError: false,
                    isOpen: false,
                    isCheckBoxSelected: false
                }]
            })
            setOrderListing(listing)
            setOrder(true)
        }
    }, [transactions])

    const headerLayout = () => {
        return (
            <TableHead>
                <TableRow>
                    <TableCell width="5%" />
                    <TableCell width="5%"></TableCell>
                    <TableCell width="10%" style={HeaderStyle} >Order Date</TableCell>
                    <TableCell width="15%" align="left" style={HeaderStyle}  >Order ID</TableCell>
                    <TableCell width="15%" align="left" style={HeaderStyle} >Customer</TableCell>
                    <TableCell width="15%" align="left" style={HeaderStyle} >Contact</TableCell>
                    <TableCell width="15%" align="left" style={HeaderStyle} >Status</TableCell>
                    <TableCell width="10%" align="left" style={HeaderStyle} >Total</TableCell>
                </TableRow>
            </TableHead>
        )
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const clickCollapseOpen = (mainIndex) => {
        let listingData = [...OrderListing]
        listingData[mainIndex].isOpen = !listingData[mainIndex].isOpen

        setOrderListing(listingData)
    }

    const checkCollapseOpen = (mainIndex) => {
        let listingData = [...OrderListing]
        let isOpen = false

        if (isArrayNotEmpty(listingData)) {
            if (listingData[mainIndex] !== undefined)
                isOpen = listingData[mainIndex].isOpen
        }
        return isOpen
    }

    const checkSelectedListing = (listingData) => {
        let filterListing = []
        isArrayNotEmpty(listingData) && listingData.map((x) => {
            isArrayNotEmpty(x.orderDetails) && x.orderDetails.filter((y) => y.isCheckBoxSelected == true).map((data) => {
                filterListing.push(data)
            })
        })
        return filterListing
    }

    const setCheckBoxListing = (maindata, index, subdata, subindex, layer) => {
        let listingData = [...OrderListing]
        let isToSet = false
        if (layer === 1) {
            if (isArrayNotEmpty(listingData)) {
                let data = listingData[index]
                let checkBoxStatus = false
                if (data.isCheckBoxSelected === false)
                    checkBoxStatus = true

                data.orderDetails !== undefined && isArrayNotEmpty(data.orderDetails) && data.orderDetails.map((x, detailIndex) => {
                    data.orderDetails[detailIndex].isCheckBoxSelected = checkBoxStatus
                    if (checkBoxStatus === true) {
                        data.orderDetails[detailIndex].deliveryQuantity = x.pendingDeliveryQty
                        data.orderDetails[detailIndex].isDeliveryQuantityError = false
                    }
                    else {
                        data.orderDetails[detailIndex].deliveryQuantity = 0
                        data.orderDetails[detailIndex].isDeliveryQuantityError = false
                    }

                })

                data.isCheckBoxSelected = checkBoxStatus
                setOrderListing(listingData)
            }
        } else {
            if (isArrayNotEmpty(listingData)) {
                let mainData = listingData[index]
                let data = listingData[index].orderDetails[subindex]
                let orderDetailsLength = listingData[index].orderDetails.length
                let selectedData = []
                if (data.isCheckBoxSelected === false) {
                    data.isCheckBoxSelected = true
                    data.deliveryQuantity = data.pendingDeliveryQty
                    data.isDeliveryQuantityError = false
                }
                else {
                    data.isCheckBoxSelected = false
                    data.deliveryQuantity = 0
                    data.isDeliveryQuantityError = false
                }

                selectedData = mainData.orderDetails !== undefined && isArrayNotEmpty(mainData.orderDetails) && mainData.orderDetails.filter((x) => x.isCheckBoxSelected == true)

                if (selectedData.length === orderDetailsLength)
                    listingData[index].isCheckBoxSelected = true
                else
                    listingData[index].isCheckBoxSelected = false
                setOrderListing(listingData)
            }
        }
        if (isArrayNotEmpty(checkSelectedListing(listingData)))
            isToSet = true

        setSelectedList(isToSet)
    }

    const checkStatus = (status) => {
        let background = "#7393B3"  //Payment Confirm

        switch (status) {
            case 2: background = "#F28C28"; break;  //In Purchasing"
            case 3: background = "#F88379"; break; //In Shipping
            case 4: background = "#CCCCFF"; break; //To Receive
            case 5: background = "green"; break; //Completed
            case 6: background = "grey"; break; //Cancelled
            case 7: background = "#b3531a"; break; //Return Refund
            case 8: background = "#880808"; break; //Delivered But Incomplete Payment
        }
        return background
    }

    const submitDelivery = () => {
        let listing = checkSelectedListing(OrderListing)
        let error = false
        console.log("OrderDeliverySetting.deliveryMan", OrderDeliverySetting.deliveryMan)
        if (OrderDeliverySetting.deliveryMan == "" || OrderDeliverySetting.isDeliverymanError == true) {
            error = true
            setOrderDeliverySetting({
                ...OrderDeliverySetting,
                isDeliverymanError: true,
            })
        }

        if (OrderDeliverySetting.deliveryDateTime == "" || OrderDeliverySetting.isDeliveryDateTimeError == true) {
            error = true
            setOrderDeliverySetting({
                ...OrderDeliverySetting,
                isDeliveryDateTimeError: true,
            })
        } else { }

        if (isArrayNotEmpty(listing) && listing.filter((x) => x.deliveryQuantity == 0).length > 0) {
            error = true
        }

        if (error === false) {
            let deliveryQuantity = []
            let OrderProductDetailID = []
            let OrderID = []

            listing.map((x) => {
                deliveryQuantity.push(x.deliveryQuantity)
                OrderProductDetailID.push(x.OrderProductDetailID)
                OrderID.push(x.OrderID)
            })
            let propData = {
                deliveryMan: OrderDeliverySetting.deliveryMan,
                deliveryDateTime: moment(OrderDeliverySetting.deliveryDateTime).format("YYYY-MM-DD HH:mm:ss"),
                deliveryQuantity: deliveryQuantity,
                OrderProductDetailID: OrderProductDetailID,
                OrderID: OrderID,
                ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID,
                UserID: JSON.parse(localStorage.getItem("loginUser"))[0].UserID,
            }
        } else {
            toast.warning("Please fill in all required data")
        }
    }

    const CollapseLayout = (data, index) => {
        return (
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => clickCollapseOpen(index)}
                    >
                        {checkCollapseOpen(index) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell> <Checkbox color="primary"
                    checked={data.isCheckBoxSelected}
                    onClick={() => setCheckBoxListing(data, index, 0, 0, 1)}
                /></TableCell>
                <TableCell component="th" scope="row">{data.CreatedDate !== undefined && moment(data.CreatedDate).format("DD-MM-YYYY")}</TableCell>
                <TableCell align="left"> {data.OrderName}</TableCell>
                <TableCell align="left">{data.UserFullName}</TableCell>
                <TableCell align="left">{data.UserContactNo}</TableCell>
                <TableCell align="left">
                    {/* <Button disabled style={{ backgroundColor: checkStatus(data.TrackingStatusID) }}> */}
                    {data.TrackingStatus}
                    {/* </Button> */}
                </TableCell>
                <TableCell align="left">{isNaN(data.OrderTotalAmount) === false && parseFloat(data.OrderTotalAmount).toFixed(2)}</TableCell>
            </TableRow >
        )
    }

    const orderDeliveryDetail = () => {
        const orderDelivery = (type) => {
            let data = ""
            let listing = checkSelectedListing(OrderListing)
            switch (type) {
                case "order":
                    let removeDuplicate = isArrayNotEmpty(listing) ? listing.filter((ele, ind) => ind === listing.findIndex(elem => parseInt(elem.OrderID) === parseInt(ele.OrderID))) : []
                    data = removeDuplicate.length
                    break;

                case "quantity":
                    data = listing.reduce((subtotal, item) => subtotal + parseInt(item.deliveryQuantity), 0)
                    break;

                case "price":
                    data = listing.reduce((subtotal, item) => subtotal + (parseInt(item.deliveryQuantity) * item.ProductVariationPrice), 0)
                    break;

                default:
                    break;
            }
            return data
        }
        return (
            <div className="row" style={{ padding: "10px" }}>
                <div className="col-xl-3 col-lg-3 col-md-3 col-s-3 col-xs-3">
                    <InputLabel shrink htmlFor="bootstrap-input" style={{ fontSize: "12pt" }}>Delivery Man</InputLabel>
                    <FormControl fullWidth size="small" variant="outlined">
                        <Select
                            id={"outlined-adornment-deliveryman"} label=""
                            value={OrderDeliverySetting.deliveryMan}
                            onChange={(e) => setOrderDeliverySetting({
                                ...OrderDeliverySetting,
                                deliveryMan: e.target.value,
                                isDeliverymanError: false
                            })}
                            className="select"
                            required
                        >
                            {isArrayNotEmpty(deliveryMan) && deliveryMan.map((x) => {
                                return (
                                    <MenuItem value={x.id}> {x.driverName}</MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                    {console.log("isDeliverymanError", OrderDeliverySetting)}
                    {OrderDeliverySetting.isDeliverymanError && <FormHelperText style={{ color: "red" }}>Deliveryman is required</FormHelperText>}
                </div>
                <div className="col-xl-3 col-lg-3 col-md-3 col-s-3 col-xs-3">
                    <InputLabel shrink htmlFor="bootstrap-input" style={{ fontSize: "12pt" }}>Delivery Date</InputLabel>
                    <FormControl fullWidth size="small" variant="outlined">
                        <OutlinedInput
                            id={"outlined-adornment-deliverydate"}
                            label=""
                            value={OrderDeliverySetting.deliveryDateTime}
                            type="datetime-local"
                            onChange={(e) => setOrderDeliverySetting({
                                ...OrderDeliverySetting,
                                deliveryDateTime: e.target.value,
                                isDeliveryDateTimeError: false
                            })}
                            required
                        />
                    </FormControl>
                    {OrderDeliverySetting.isDeliveryDateTimeError && <FormHelperText style={{ color: "red" }}>Delivery Date is required</FormHelperText>}
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-s-6 col-xs-6">
                    <div className="row" >
                        <div className="col">
                            <InputLabel shrink htmlFor="bootstrap-input" style={{ fontSize: "12pt" }}>Total Orders: </InputLabel>
                            <Typography> {orderDelivery("order")}</Typography>
                        </div>
                        <div className="col">
                            <InputLabel shrink htmlFor="bootstrap-input" style={{ fontSize: "12pt" }}>Total Quantity: </InputLabel>
                            <Typography> {orderDelivery("quantity")}</Typography>
                        </div>
                        <div className="col">
                            <InputLabel shrink htmlFor="bootstrap-input" style={{ fontSize: "12pt" }}>Total Price: </InputLabel>
                            <Typography> {!isNaN(orderDelivery("price")) && parseFloat(orderDelivery("price")).toFixed(2)}</Typography>
                        </div>
                        <div className="col">
                            <Button variant="contained" style={{ backgroundColor: "#0d6efd" }} onClick={() => submitDelivery()}>Confirm</Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    const OrderDetailLayout = (data, index) => {
        return (
            <Card style={{ marginTop: "10px" }}>
                <CardContent>
                    <div className="row" style={{ paddingBottom: "10px" }}>
                        <div className="col">
                            <Typography style={TitleStyle} > Product Order Details</Typography>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-2"></div>
                        <div className="col-2">  <Typography style={TitleStyle} > Product Variation</Typography></div>
                        <div className="col-2">  <Typography style={TitleStyle} > Order Details</Typography></div>
                        <div className="col-2">  <Typography style={TitleStyle} > Delivery Quantity</Typography></div>
                    </div>
                    <hr />
                    {
                        data.orderDetails.map((details, subindex) => {
                            return (
                                <div className="row">
                                    <div className="col-2">
                                        <div className="row">
                                            <div className="col-1">
                                                <Checkbox color="primary"
                                                    checked={details.isCheckBoxSelected}
                                                    onClick={() => setCheckBoxListing(data, index, details, subindex, 2)} />
                                            </div>
                                            <div className="col" style={{ textAlign: "center" }}>
                                                <img
                                                    height={60}
                                                    src={details.ProductImages !== "[]" && details.ProductImages !== undefined && details.ProductImages !== null ? JSON.parse(details.ProductImages)[0] : Logo}
                                                    onError={(e) => { e.target.onerror = null; e.target.src = Logo }}
                                                    alt={details.ProductName}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-2">
                                        <div style={{ fontWeight: "bold", fontSize: "13px" }}>  {details.ProductName} </div>
                                        <div style={{ fontSize: "11px" }}>  Variation : {details.ProductVariationValue} kg </div>
                                        <div style={{ fontSize: "11px" }}>  Total Price : RM {(details.ProductQuantity * details.ProductVariationPrice).toFixed(2)}  </div>
                                    </div>
                                    <div className="col-2">
                                        <div >  </div>
                                        <div style={{ fontSize: "11px", fontWeight: "bold" }}>  Total Order Quantity : {details.ProductQuantity} </div>
                                        <div style={{ fontSize: "11px", fontWeight: "bold" }}>  Pending Deliver Quantity : {details.PendingDeliveryQty !== undefined ? details.PendingDeliveryQty : details.ProductQuantity} </div>
                                    </div>
                                    <div className="col-2">
                                        <FormControl fullWidth size="small" variant="outlined">
                                            <OutlinedInput
                                                id={"outlined-adornment-Quantity-" + subindex}
                                                label=""
                                                value={details.deliveryQuantity}
                                                type="number"
                                                onChange={(e) => {
                                                    let newArr = OrderListing
                                                    let max = details.PendingDeliveryQty !== undefined ? details.PendingDeliveryQty : details.ProductQuantity
                                                    if (e.target.value <= max && e.target.value >= 0) {
                                                        newArr[index].orderDetails[subindex].deliveryQuantity = e.target.value
                                                        newArr[index].orderDetails[subindex].isDeliveryQuantityError = false
                                                    } else {
                                                        newArr[index].orderDetails[subindex].isDeliveryQuantityError = true
                                                    }
                                                    setOrderListing([...newArr]);
                                                }}
                                                inputProps={{ 'aria-label': 'UserContactNo', inputProps: { min: 1, max: details.PendingDeliveryQty != undefined ? details.PendingDeliveryQty : details.ProductQuantity } }}
                                                required
                                            />
                                        </FormControl>
                                        {details.isDeliveryQuantityError && <FormHelperText style={{ color: "red" }}>Insert valid Delivery Quantity</FormHelperText>}
                                        {details.isCheckBoxSelected && details.deliveryQuantity == 0 && !details.isDeliveryQuantityError && <FormHelperText style={{ color: "red" }}>Insert at least 1 Quantity</FormHelperText>}
                                    </div>
                                    <hr />
                                </div>
                            )
                        })
                    }
                </CardContent>
            </Card >
        )
    }

    const OrderLayout = () => {
        return (
            <TableContainer component={Paper} style={{ overflow: "hidden" }}>
                {isOrderSelected && orderDeliveryDetail()}
                <Table aria-label="collapsible table">
                    {headerLayout()}
                    {
                        isOrderSet ?
                            <TableBody>
                                {OrderListing.length > 0 && OrderListing.map((data, index) => {
                                    return (
                                        <>
                                            {CollapseLayout(data, index)}
                                            <TableRow style={{ backgroundColor: "#f8f9fa" }}>
                                                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
                                                    <Collapse in={checkCollapseOpen(index)} timeout="auto" unmountOnExit>
                                                        <Box sx={{ margin: 1 }}>
                                                            {console.log("ddadsadsa", data)}
                                                            {OrderDetailLayout(data, index)}
                                                            <Card style={{ marginTop: "10px" }}>
                                                                <CardContent>
                                                                    <div className="row">
                                                                        <div className="col">
                                                                            <Typography style={TitleStyle} > Delivery Details </Typography>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row" style={{ paddingTop: "10px" }}>
                                                                        <div className="row">

                                                                            <div className="col-xl-3 col-lg-3 col-md-3 col-s-3 col-xs-3">
                                                                                <div className="row">
                                                                                    <InputLabel shrink htmlFor="bootstrap-input" style={{ paddingLeft: "15px", fontSize: "12pt" }}>Receiver Details</InputLabel>
                                                                                    <Typography style={DetailStyle}> Name: {data.UserFullName}</Typography>
                                                                                    <Typography style={DetailStyle}> Contact: {data.UserContactNo}</Typography>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-xl-4 col-lg-4 col-md-4 col-s-4 col-xs-4">
                                                                                <div className="row">
                                                                                    <InputLabel shrink htmlFor="bootstrap-input" style={{ paddingLeft: "15px", fontSize: "12pt" }}>Receiver Address</InputLabel>
                                                                                    <Typography style={DetailStyle}> {data.UserAddressLine1 + " " + data.UserAddressLine2 + " " + data.UserCity + " " + data.UserPoscode + " , " + data.UserState}</Typography>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-xl-3 col-lg-3 col-md-3 col-s-3 col-xs-3">
                                                                                <div className="row">
                                                                                    <InputLabel shrink htmlFor="bootstrap-input" style={{ fontSize: "12pt" }}>Delivery Method</InputLabel>
                                                                                    <FormControl fullWidth size="small" variant="outlined">
                                                                                        <Select
                                                                                            id={"outlined-adornment-Method-" + index} label=""
                                                                                            value={data.PickUpInd}
                                                                                            onChange={(e) => {
                                                                                                let newArr = OrderListing
                                                                                                newArr[index].PickUpInd = e.target.value
                                                                                                setOrderListing([...newArr]);
                                                                                            }}
                                                                                            className="select"
                                                                                            required
                                                                                        >
                                                                                            <MenuItem value={1}> Self Pick Up </MenuItem>
                                                                                            <MenuItem value={0}> Delivery </MenuItem>
                                                                                        </Select>
                                                                                    </FormControl>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                            {/* {
                                                    data.PickUpInd === 0 &&
                                                    <Card style={{ marginTop: "10px" }}>
                                                        <CardContent>
                                                            <div className="row" style={{ paddingBottom: "10px" }}>
                                                                <div className="col">
                                                                    <Typography style={TitleStyle} > Delivery Address Details </Typography>
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <div className="row">
                                                                    <div className="col-xl-6 col-lg-6 col-md-6 col-s-12 col-xs-12">
                                                                        <div className="row">
                                                                            <div className="col-xl-2 col-lg-3 col-md-3 col-s-12 col-xs-12">
                                                                                <Typography style={SubtitleStyle} > Address Line 1:</Typography>
                                                                            </div>
                                                                            <div className="col-xl-9 col-lg-8 col-md-8 col-s-12 col-xs-12">
                                                                                <FormControl fullWidth size="small" variant="outlined">
                                                                                    <OutlinedInput
                                                                                        id={"outlined-adornment-UserFullName-" + index}
                                                                                        label=""
                                                                                        value={data.UserAddressLine1}
                                                                                        onChange={(e) => {
                                                                                            let newArr = OrderListing
                                                                                            newArr[index].UserAddressLine1 = e.target.value
                                                                                            setOrderListing([...newArr]);
                                                                                        }}
                                                                                        inputProps={{ 'aria-label': 'UserAddressLine1' }}
                                                                                        required
                                                                                    />
                                                                                </FormControl>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-xl-6 col-lg-6 col-md-6 col-s-12 col-xs-12">
                                                                        <div className="row">
                                                                            <div className="col-xl-3 col-lg-3 col-md-3 col-s-12 col-xs-12">
                                                                                <Typography style={SubtitleStyle} > Address Line 2:</Typography>
                                                                            </div>
                                                                            <div className="col-xl-9 col-lg-8 col-md-8 col-s-12 col-xs-12">
                                                                                <FormControl fullWidth size="small" variant="outlined">
                                                                                    <OutlinedInput
                                                                                        id={"outlined-adornment-UserAddressLine2-" + index}
                                                                                        label=""
                                                                                        value={data.UserAddressLine2}
                                                                                        onChange={(e) => {
                                                                                            let newArr = OrderListing
                                                                                            newArr[index].UserAddressLine2 = e.target.value
                                                                                            setOrderListing([...newArr]);
                                                                                        }}
                                                                                        inputProps={{ 'aria-label': 'UserAddressLine2' }}
                                                                                        required
                                                                                    />
                                                                                </FormControl>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="row" style={{ paddingTop: "10px" }}>
                                                                <div className="row">
                                                                    <div className="col-xl-6 col-lg-6 col-md-6 col-s-12 col-xs-12">
                                                                        <div className="row">
                                                                            <div className="col-xl-2 col-lg-3 col-md-3 col-s-12 col-xs-12">
                                                                                <Typography style={SubtitleStyle} > City:</Typography>
                                                                            </div>
                                                                            <div className="col-xl-9 col-lg-8 col-md-8 col-s-12 col-xs-12">
                                                                                <FormControl fullWidth size="small" variant="outlined">
                                                                                    <OutlinedInput
                                                                                        id={"outlined-adornment-UserCity-" + index}
                                                                                        label=""
                                                                                        value={data.UserCity}
                                                                                        onChange={(e) => {
                                                                                            let newArr = OrderListing
                                                                                            newArr[index].UserCity = e.target.value
                                                                                            setOrderListing([...newArr]);
                                                                                        }}
                                                                                        inputProps={{ 'aria-label': 'UserCity' }}
                                                                                        required
                                                                                    />
                                                                                </FormControl>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-xl-6 col-lg-6 col-md-6 col-s-12 col-xs-12">
                                                                        <div className="row">
                                                                            <div className="col-xl-3 col-lg-3 col-md-3 col-s-12 col-xs-12">
                                                                                <Typography style={SubtitleStyle} > State:</Typography>
                                                                            </div>
                                                                            <div className="col-xl-9 col-lg-8 col-md-8 col-s-12 col-xs-12">
                                                                                <FormControl fullWidth size="small" variant="outlined">
                                                                                    <OutlinedInput
                                                                                        id={"outlined-adornment-UserState-" + index}
                                                                                        label=""
                                                                                        value={data.UserState}
                                                                                        onChange={(e) => {
                                                                                            let newArr = OrderListing
                                                                                            newArr[index].UserState = e.target.value
                                                                                            setOrderListing([...newArr]);
                                                                                        }}
                                                                                        inputProps={{ 'aria-label': 'UserState' }}
                                                                                        required
                                                                                    />
                                                                                </FormControl>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="row" style={{ paddingTop: "10px" }}>
                                                                <div className="row">
                                                                    <div className="col-xl-6 col-lg-6 col-md-6 col-s-12 col-xs-12">
                                                                        <div className="row">
                                                                            <div className="col-xl-2 col-lg-3 col-md-3 col-s-12 col-xs-12">
                                                                                <Typography style={SubtitleStyle} > Poscode:</Typography>
                                                                            </div>
                                                                            <div className="col-xl-9 col-lg-8 col-md-8 col-s-12 col-xs-12">
                                                                                <FormControl fullWidth size="small" variant="outlined">
                                                                                    <OutlinedInput
                                                                                        id={"outlined-adornment-UserPoscode-" + index}
                                                                                        label=""
                                                                                        value={data.UserPoscode}
                                                                                        onChange={(e) => {
                                                                                            let newArr = OrderListing
                                                                                            newArr[index].UserPoscode = e.target.value
                                                                                            setOrderListing([...newArr]);
                                                                                        }}
                                                                                        inputProps={{ 'aria-label': 'UserPoscode' }}
                                                                                        required
                                                                                    />
                                                                                </FormControl>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-xl-6 col-lg-6 col-md-6 col-s-12 col-xs-12">
                                                                        <div className="row">
                                                                            <div className="col-xl-3 col-lg-3 col-md-3 col-s-12 col-xs-12">
                                                                                <Typography style={SubtitleStyle} > Country:</Typography>
                                                                            </div>
                                                                            <div className="col-xl-9 col-lg-8 col-md-8 col-s-12 col-xs-12">
                                                                                <FormControl fullWidth size="small" variant="outlined">
                                                                                    <Select
                                                                                        id={"outlined-adornment-Country-" + index} label=""
                                                                                        value={data.CountryID}
                                                                                        onChange={(e) => {
                                                                                            let newArr = OrderListing
                                                                                            newArr[index].CountryID = e.target.value
                                                                                            setOrderListing([...newArr]);
                                                                                        }}
                                                                                        className="select"
                                                                                        required
                                                                                    >
                                                                                        {isArrayNotEmpty(countries) && countries.map((country) => (
                                                                                            <MenuItem
                                                                                                value={country.CountryId}
                                                                                                key={country.CountryId}
                                                                                            >
                                                                                                {country.CountryName}
                                                                                            </MenuItem>
                                                                                        ))}
                                                                                    </Select>
                                                                                </FormControl>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                } */}
                                                        </Box>
                                                    </Collapse>
                                                </TableCell>
                                            </TableRow>
                                        </>
                                    )
                                }
                                )}
                            </TableBody>
                            :
                            <LoadingPanel />
                    }
                </Table>
            </TableContainer>
        )
    }

    console.log("transactionStatus", transactionStatus)
    return (
        <div style={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    {
                        isArrayNotEmpty(transactionStatus) && transactionStatus.map((x, index) => {
                            return (<Tab label={x.TrackingStatus} {...a11yProps(index)} />)
                        })
                    }

                    {/* <Tab label="Item Two" {...a11yProps(1)} />
                    <Tab label="Item Three" {...a11yProps(2)} /> */}
                </Tabs>
            </Box>
            {
                isArrayNotEmpty(transactionStatus) && transactionStatus.map((x, statusIndex) => {
                    return (<TabPanel value={value} index={statusIndex}> {OrderLayout(x.TrackingStatusID)} </TabPanel>)
                })
            }


        </div>
    );
}

