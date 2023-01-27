import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GitAction } from "../../store/action/gitAction";
import "../../app/App.scss";
import { toast } from "react-toastify";
import { isArrayNotEmpty, isContactValid } from "../../tools/Helpers";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
    Paper, Typography, Card, CardContent, Select, MenuItem, TableRow, Box, TableHead, FormHelperText,
    InputLabel, Checkbox, TableContainer, OutlinedInput, FormControl, TableCell, TableBody, Table, IconButton, Collapse,
    TablePagination, Tabs, Tab,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import LoadingPanel from "../../tools/LoadingPanel";
import { Button } from "reactstrap";
import moment from "moment/moment";
import Logo from "../../assets/logos/logo.png";
import { useReactToPrint } from 'react-to-print';

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

export const TransactionManagement = (props) => {
    const { transactions, countries, transactionStatus, logistic, orderShipment, orderShipmentStatus } = useSelector(state => ({
        transactions: state.counterReducer.transactions,
        transactionStatus: state.counterReducer.transactionStatus,
        countries: state.counterReducer.countries,
        logistic: state.counterReducer.logistic,
        orderShipment: state.counterReducer["orderShipment"],
        orderShipmentStatus: state.counterReducer["orderShipmentStatus"],
    }));

    const dispatch = useDispatch()
    const [value, setValue] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isOrderSet, setOrder] = useState(false)
    const [isOrderSelected, setSelectedList] = useState(false)
    const [OrderListing, setOrderListing] = useState(false)
    const [PDFLabel, setOrderPDFLabel] = useState("")
    const [isShipmentSubmit, setShipmentSubmit] = useState(false)

    // const [logisticID, setLogisticID] = React.useState(3);
    // const [trackingNumber, setTrackingNumber] = React.useState("");
    // const [deliveryMan, setDeliveryMan] = useState([
    //     { id: 1, driverName: "Ali" },
    //     { id: 2, driverName: "Vincent" },
    //     { id: 3, driverName: "Peter" },
    //     { id: 4, driverName: "Aladin" }
    // ])
    const [OrderDeliverySetting, setOrderDeliverySetting] = useState({
        deliveryMan: "",
        isDeliverymanError: false,
        deliveryDateTime: "",
        isDeliveryDateTimeError: false,
    })
    const [senderInformation, setSenderInformation] = React.useState({
        sendername: "MYEMPORIA SDN BHD",
        sendercompany: "MYEMPORIA SDN BHD",
        sendercontact: "016-863 0091",
        senderadd1: "Suite 3, 2nd Floor, Sublot 25",
        senderadd2: "Tabuan Commercial Centre, Jalan Canna",
        sendercity: "Kuching",
        senderstate: "Sarawak",
        senderposcode: "93350",
        isEdit: false,
    });

    const TitleStyle = { fontWeight: "bold", fontSize: "15pt" }
    const HeaderStyle = { fontWeight: "bold", fontSize: "12pt" }
    const DetailStyle = { fontSize: "10pt", color: "gray" }

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });



    useEffect(() => {
        dispatch(GitAction.CallGetTransaction({
            TrackingStatus: "Payment Confirm",
            ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID
        }))
        dispatch(GitAction.CallCountry())
        dispatch(GitAction.CallGetTransactionStatus())
        dispatch(GitAction.CallCourierService())
    }, [])

    useEffect(() => {
        if (isOrderSet === false && isArrayNotEmpty(transactions)) {
            let listing = []
            transactions.map((order) => {
                let detailListing = []
                order.OrderProductDetail !== undefined && JSON.parse(order.OrderProductDetail).map((detail) => {
                    console.log("SADASDASDA", detail)
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
                console.log("dsadasdasddsa", detailListing)
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

    useEffect(() => {
        if (isArrayNotEmpty(orderShipment) && orderShipment[0].PDFLabel !== undefined && isShipmentSubmit === true) {
            setShipmentSubmit(false)
            setOrderPDFLabel(orderShipment[0].PDFLabel)
            handlePrint()
        }
    }, [orderShipment])


    const headerLayout = () => {
        return (
            <TableHead style={{ backgroundColor: "#f8f9fa" }}>
                <TableRow>
                    <TableCell width="5%" />
                    {value + 1 === 1 && <TableCell width="5%"></TableCell>}
                    <TableCell width="10%" style={HeaderStyle} >Order Date</TableCell>
                    <TableCell width="10%" align="left" style={HeaderStyle}  >Order ID</TableCell>
                    <TableCell width="15%" align="left" style={HeaderStyle} >Customer</TableCell>
                    <TableCell width="15%" align="left" style={HeaderStyle} >Contact</TableCell>
                    <TableCell width="15%" align="left" style={HeaderStyle} >Status</TableCell>
                    <TableCell width="15%" align="left" style={HeaderStyle} >No Item</TableCell>
                    <TableCell width="10%" align="left" style={HeaderStyle} >Total</TableCell>
                    {value + 1 === 1 && <TableCell width="10%" align="left" style={HeaderStyle}>Action</TableCell>}
                </TableRow>
            </TableHead>
        )
    }

    const handleChange = (event, newValue) => {
        console.log("handleChange", newValue)
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

        console.log("setCheckBoxListing")
        let listingData = [...OrderListing.filter((y) => y.TrackingStatusID == value + 1)]
        let isToSet = false
        if (layer === 1) {
            if (isArrayNotEmpty(listingData)) {
                console.log("setCheckBoxListing1")
                let data = listingData[index]
                let checkBoxStatus = false
                if (data.isCheckBoxSelected === false)
                    checkBoxStatus = true

                // data.orderDetails !== undefined && isArrayNotEmpty(data.orderDetails) && data.orderDetails.map((x, detailIndex) => {
                //     data.orderDetails[detailIndex].isCheckBoxSelected = checkBoxStatus
                //     if (checkBoxStatus === true) {
                //         data.orderDetails[detailIndex].deliveryQuantity = x.pendingDeliveryQty
                //         data.orderDetails[detailIndex].isDeliveryQuantityError = false
                //     }
                //     else {
                //         data.orderDetails[detailIndex].deliveryQuantity = 0
                //         data.orderDetails[detailIndex].isDeliveryQuantityError = false
                //     }

                // })

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
                    // data.deliveryQuantity = data.pendingDeliveryQty
                    // data.isDeliveryQuantityError = false
                }
                else {
                    data.isCheckBoxSelected = false
                    // data.deliveryQuantity = 0
                    // data.isDeliveryQuantityError = false
                }

                console.log("setCheckBoxListing2", data)

                selectedData = mainData.orderDetails !== undefined && isArrayNotEmpty(mainData.orderDetails) && mainData.orderDetails.filter((x) => x.isCheckBoxSelected == true)

                if (selectedData.length === orderDetailsLength)
                    listingData[index].isCheckBoxSelected = true
                else
                    listingData[index].isCheckBoxSelected = false

                console.log("setCheckBoxListing22", listingData)
                setOrderListing(listingData)
            }
        }
        if (isArrayNotEmpty(checkSelectedListing(listingData)))
            isToSet = true

        setSelectedList(isToSet)
    }

    // const checkStatus = (status) => {
    //     let background = "#7393B3"  //Payment Confirm

    //     switch (status) {
    //         case 2: background = "#F28C28"; break;  //In Purchasing"
    //         case 3: background = "#F88379"; break; //In Shipping
    //         case 4: background = "#CCCCFF"; break; //To Receive
    //         case 5: background = "green"; break; //Completed
    //         case 6: background = "grey"; break; //Cancelled
    //         case 7: background = "#b3531a"; break; //Return Refund
    //         case 8: background = "#880808"; break; //Delivered But Incomplete Payment
    //     }
    //     return background
    // }

    const checkLogistic = (ID) => {
        let data = ""
        if (isArrayNotEmpty(logistic)) {
            logistic.filter((x) => x.LogisticID === parseInt(ID)).map((y) => {
                data = y.LogisticName
            })
        }
        return data
    }

    // const submitDelivery = () => {
    //     let listing = checkSelectedListing(OrderListing)
    //     let error = false
    //     if (OrderDeliverySetting.deliveryMan == "" || OrderDeliverySetting.isDeliverymanError == true) {
    //         error = true
    //         setOrderDeliverySetting({
    //             ...OrderDeliverySetting,
    //             isDeliverymanError: true,
    //         })
    //     }

    //     if (OrderDeliverySetting.deliveryDateTime == "" || OrderDeliverySetting.isDeliveryDateTimeError == true) {
    //         error = true
    //         setOrderDeliverySetting({
    //             ...OrderDeliverySetting,
    //             isDeliveryDateTimeError: true,
    //         })
    //     } else { }

    //     if (isArrayNotEmpty(listing) && listing.filter((x) => x.deliveryQuantity == 0).length > 0) {
    //         error = true
    //     }

    //     if (error === false) {
    //         let deliveryQuantity = []
    //         let OrderProductDetailID = []
    //         let OrderID = []

    //         listing.map((x) => {
    //             deliveryQuantity.push(x.deliveryQuantity)
    //             OrderProductDetailID.push(x.OrderProductDetailID)
    //             OrderID.push(x.OrderID)
    //         })
    //         let propData = {
    //             deliveryMan: OrderDeliverySetting.deliveryMan,
    //             deliveryDateTime: moment(OrderDeliverySetting.deliveryDateTime).format("YYYY-MM-DD HH:mm:ss"),
    //             deliveryQuantity: deliveryQuantity,
    //             OrderProductDetailID: OrderProductDetailID,
    //             OrderID: OrderID,
    //             ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID,
    //             UserID: JSON.parse(localStorage.getItem("loginUser"))[0].UserID,
    //         }
    //     } else {
    //         toast.warning("Please fill in all required data")
    //     }
    // }

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
                {value + 1 === 1 &&
                    <TableCell>
                        <Checkbox color="primary"
                            checked={data.isCheckBoxSelected}
                            onClick={() => setCheckBoxListing(data, index, 0, 0, 1)} />
                    </TableCell>
                }
                <TableCell component="th" scope="row">{data.CreatedDate !== undefined && moment(data.CreatedDate).format("DD-MM-YYYY")}</TableCell>
                <TableCell align="left"> {data.OrderName}</TableCell>
                <TableCell align="left">{data.UserFullName}</TableCell>
                <TableCell align="left">{data.UserContactNo}</TableCell>
                <TableCell align="left">
                    <Typography>{data.TrackingStatus}</Typography>
                    <Typography style={DetailStyle}>{data.PaymentMethod}</Typography>
                </TableCell>
                <TableCell align="left">{data.OrderProductDetail !== undefined ? JSON.parse(data.OrderProductDetail).length : 0}</TableCell>
                <TableCell align="left">{isNaN(data.OrderTotalAmount) === false && parseFloat(data.OrderTotalAmount).toFixed(2)}</TableCell>
                {
                    value + 1 === 1 &&
                    <TableCell align="left">
                        <IconButton>
                            <Button disabled style={{ backgroundColor: "RED" }}>
                                <CancelIcon /> Cancel
                            </Button>
                        </IconButton>
                    </TableCell>
                }
            </TableRow >
        )
    }

    const orderDeliveryDetail = () => {
        // const orderDelivery = (type) => {
        //     let data = ""
        //     let listing = checkSelectedListing(OrderListing)
        //     switch (type) {
        //         case "order":
        //             let removeDuplicate = isArrayNotEmpty(listing) ? listing.filter((ele, ind) => ind === listing.findIndex(elem => parseInt(elem.OrderID) === parseInt(ele.OrderID))) : []
        //             data = removeDuplicate.length
        //             break;

        //         case "quantity":
        //             data = listing.reduce((subtotal, item) => subtotal + parseInt(item.deliveryQuantity), 0)
        //             break;

        //         case "price":
        //             data = listing.reduce((subtotal, item) => subtotal + (parseInt(item.deliveryQuantity) * item.ProductVariationPrice), 0)
        //             break;

        //         default:
        //             break;
        //     }
        //     return data
        // }
        return (
            <div className="row" style={{ padding: "10px" }}>
                <div className="col">
                    <Typography>Sender Information</Typography>
                </div>
                <div className="col" style={{ textAlign: "right" }}>
                    <Button color="primary" onClick={() => setSenderInformation({
                        ...senderInformation, isEdit: !senderInformation.isEdit
                    })}>{senderInformation.isEdit === true ? "CANCEL" : "EDIT"}</Button>
                </div>
                {
                    senderInformation.isEdit === true ?
                        <>
                            <div className="row">
                                <div className="col-xl-4 col-lg-4 col-md-4 col-s-6 col-xs-6">
                                    <InputLabel shrink htmlFor="bootstrap-input" style={{ fontSize: "12pt" }}>Sender Name</InputLabel>
                                    <FormControl fullWidth size="small" variant="outlined">
                                        <OutlinedInput
                                            id={"outlined-adornment-sendername"}
                                            label=""
                                            value={senderInformation.sendername}
                                            onChange={(e) => setSenderInformation({
                                                ...senderInformation,
                                                sendername: e.target.value
                                            })}
                                            required
                                        />
                                    </FormControl>
                                    {senderInformation.sendername === "" && <FormHelperText style={{ color: "red" }}>Sender Name is required</FormHelperText>}
                                </div>
                                <div className="col-xl-4 col-lg-4 col-md-4 col-s-6 col-xs-6">
                                    <InputLabel shrink htmlFor="bootstrap-input" style={{ fontSize: "12pt" }}>Sender Company</InputLabel>
                                    <FormControl fullWidth size="small" variant="outlined">
                                        <OutlinedInput
                                            id={"outlined-adornment-sendercompany"}
                                            label=""
                                            value={senderInformation.sendercompany}
                                            onChange={(e) => setSenderInformation({
                                                ...senderInformation,
                                                sendercompany: e.target.value
                                            })}
                                            required
                                        />
                                    </FormControl>
                                    {senderInformation.sendercompany === "" && <FormHelperText style={{ color: "red" }}>Sender Company is required</FormHelperText>}
                                </div>
                                <div className="col-xl-4 col-lg-4 col-md-4 col-s-6 col-xs-6">
                                    <InputLabel shrink htmlFor="bootstrap-input" style={{ fontSize: "12pt" }}>Sender Contact</InputLabel>
                                    <FormControl fullWidth size="small" variant="outlined">
                                        <OutlinedInput
                                            id={"outlined-adornment-sendercontact"}
                                            label=""
                                            value={senderInformation.sendercontact}
                                            onChange={(e) => setSenderInformation({
                                                ...senderInformation,
                                                sendercontact: e.target.value
                                            })}
                                            required
                                        />
                                    </FormControl>
                                    {senderInformation.sendercompany === "" && <FormHelperText style={{ color: "red" }}>Sender Company is required</FormHelperText>}
                                </div>
                            </div>
                            <div className="row" style={{ paddingTop: "10px" }}>
                                <div className="col-xl-4 col-lg-4 col-md-4 col-s-6 col-xs-6">
                                    <InputLabel shrink htmlFor="bootstrap-input" style={{ fontSize: "12pt" }}>Sender Address1</InputLabel>
                                    <FormControl fullWidth size="small" variant="outlined">
                                        <OutlinedInput
                                            id={"outlined-adornment-senderadd1"}
                                            label=""
                                            value={senderInformation.senderadd1}
                                            onChange={(e) => setSenderInformation({
                                                ...senderInformation,
                                                senderadd1: e.target.value
                                            })}
                                            required
                                        />
                                    </FormControl>
                                    {senderInformation.senderadd1 === "" && <FormHelperText style={{ color: "red" }}>Sender Address is required</FormHelperText>}
                                </div>
                                <div className="col-xl-4 col-lg-4 col-md-4 col-s-6 col-xs-6">
                                    <InputLabel shrink htmlFor="bootstrap-input" style={{ fontSize: "12pt" }}>Sender Address2</InputLabel>
                                    <FormControl fullWidth size="small" variant="outlined">
                                        <OutlinedInput
                                            id={"outlined-adornment-senderadd2"}
                                            label=""
                                            value={senderInformation.senderadd2}
                                            onChange={(e) => setSenderInformation({
                                                ...senderInformation,
                                                senderadd2: e.target.value
                                            })}
                                        />
                                    </FormControl>
                                    {senderInformation.senderadd2 === "" && <FormHelperText style={{ color: "red" }}>Sender Address is required</FormHelperText>}
                                </div>
                                <div className="col-xl-4 col-lg-4 col-md-4 col-s-6 col-xs-6">
                                    <InputLabel shrink htmlFor="bootstrap-input" style={{ fontSize: "12pt" }}>Sender City</InputLabel>
                                    <FormControl fullWidth size="small" variant="outlined">
                                        <OutlinedInput
                                            id={"outlined-adornment-sendercity"}
                                            label=""
                                            value={senderInformation.sendercity}
                                            onChange={(e) => setSenderInformation({
                                                ...senderInformation,
                                                sendercity: e.target.value
                                            })}
                                            required
                                        />
                                    </FormControl>
                                    {senderInformation.sendercity === "" && <FormHelperText style={{ color: "red" }}>Sender City is required</FormHelperText>}
                                </div>
                            </div>
                            <div className="row" style={{ paddingTop: "10px" }}>
                                <div className="col-xl-4 col-lg-4 col-md-4 col-s-6 col-xs-6">
                                    <InputLabel shrink htmlFor="bootstrap-input" style={{ fontSize: "12pt" }}>Sender State</InputLabel>
                                    <FormControl fullWidth size="small" variant="outlined">
                                        <OutlinedInput
                                            id={"outlined-adornment-senderstate"}
                                            label=""
                                            value={senderInformation.senderstate}
                                            onChange={(e) => setSenderInformation({
                                                ...senderInformation,
                                                senderstate: e.target.value
                                            })}
                                            required
                                        />
                                    </FormControl>
                                    {senderInformation.senderstate === "" && <FormHelperText style={{ color: "red" }}>Sender State is required</FormHelperText>}
                                </div>
                                <div className="col-xl-4 col-lg-4 col-md-4 col-s-6 col-xs-6">
                                    <InputLabel shrink htmlFor="bootstrap-input" style={{ fontSize: "12pt" }}>Sender Poscode</InputLabel>
                                    <FormControl fullWidth size="small" variant="outlined">
                                        <OutlinedInput
                                            id={"outlined-adornment-senderposcode"}
                                            label=""
                                            value={senderInformation.senderposcode}
                                            onChange={(e) => setSenderInformation({
                                                ...senderInformation,
                                                senderposcode: e.target.value
                                            })}
                                        />
                                    </FormControl>
                                    {senderInformation.senderposcode === "" && <FormHelperText style={{ color: "red" }}>Sender Poscode is required</FormHelperText>}
                                </div>
                            </div>
                        </>
                        :
                        <div className="row">
                            <div className="row">
                                <div className="col-xl-3 col-lg-3 col-md-3 col-s-6 col-xs-6">
                                    <div className="row">
                                        <InputLabel shrink htmlFor="bootstrap-input" style={{ paddingLeft: "15px", fontSize: "12pt" }}>Sender Name</InputLabel>
                                        <Typography style={DetailStyle}> {senderInformation.sendername}</Typography>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-lg-3 col-md-3 col-s-6 col-xs-6">
                                    <div className="row">
                                        <InputLabel shrink htmlFor="bootstrap-input" style={{ paddingLeft: "15px", fontSize: "12pt" }}>Sender Company</InputLabel>
                                        <Typography style={DetailStyle}>  {senderInformation.sendercompany}</Typography>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-lg-3 col-md-3 col-s-6 col-xs-6">
                                    <div className="row">
                                        <InputLabel shrink htmlFor="bootstrap-input" style={{ paddingLeft: "15px", fontSize: "12pt" }}>Sender Contact</InputLabel>
                                        <Typography style={DetailStyle}>  {senderInformation.sendercontact}</Typography>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-lg-3 col-md-3 col-s-6 col-xs-6">
                                    <div className="row">
                                        <InputLabel shrink htmlFor="bootstrap-input" style={{ paddingLeft: "15px", fontSize: "12pt" }}>Sender Address </InputLabel>
                                        <Typography style={DetailStyle}> {senderInformation.senderadd1 + " " + senderInformation.senderadd2 + " " + senderInformation.sendercity + " " + senderInformation.senderposcode + " , " + senderInformation.senderstate}</Typography>

                                    </div>
                                </div>
                            </div>
                        </div>
                }
            </div>
        )
    }

    const handleSubmitTracking = (selectedIndex, data) => {
        console.log("handleSubmitTracking selectedIndex", selectedIndex)
        console.log("handleSubmitTracking data", data)

        if (data.logisticID === 3) {
            let error = false
            let selectedData = []

            if (isArrayNotEmpty(data.orderDetails)) {
                data.orderDetails.filter((x) => x.isCheckBoxSelected === true).map((y) => {
                    selectedData.push(y.OrderProductDetailID)
                })
            }

            if (data.parcelLength === "" || data.parcelHeight === "" || data.parcelQuantity === "" || data.parcelWeight === "" || data.parcelWidth === "" ||
                data.parcelLength <= 0 || data.parcelHeight <= 0 || data.parcelQuantity <= 0 || data.parcelWeight <= 0 || data.parcelWidth <= 0) {
                error = true
                toast.error("Please fill in all required parcel information")
            }

            if (data.PickUpInd === 1) {
                error = true
                toast.error("Please make sure is Set to Delivery mode")
            }

            if (data.UserFullName === "" || data.UserContactNo === "" || data.UserAddressLine1 === "" || data.UserAddressLine2 === "" || data.UserCity === "" || data.UserState === "" || data.UserPoscode === "" || data.CountryID === "" ||
                data.UserFullName === undefined || data.UserContactNo === undefined || data.UserAddressLine1 === undefined || data.UserAddressLine2 === undefined || data.UserCity === undefined || data.UserState === undefined || data.UserPoscode === undefined || data.CountryID === undefined) {
                error = true
                toast.error("Please make sure all receiver information is set correctly")
            }

            if (senderInformation.sendername === "" || senderInformation.sendercompany === "" || senderInformation.sendercontact === "" || senderInformation.senderadd1 === "" ||
                senderInformation.senderadd2 === "" || senderInformation.sendercity === "" || senderInformation.senderstate === "" || senderInformation.senderposcode === "") {
                error = true
                toast.error("Please make sure all sender information is set correctly")
            }

            if (error === false) {
                let object = {
                    PACKAGETYPE: "SPX",
                    WEIGHT: data.parcelWeight,
                    LENGTH: data.parcelLength,
                    WIDTH: data.parcelWidth,
                    HEIGHT: data.parcelHeight,
                    PARCELQUANTITY: data.parcelQuantity,
                    SENDER_CONTACTPERSON: senderInformation.sendername,
                    SENDER_COMPANY: senderInformation.sendercompany,
                    SENDER_CONTACTNO: senderInformation.sendercontact,
                    SENDER_ADDLINE1: senderInformation.senderadd1,
                    SENDER_ADDLINE2: senderInformation.senderadd2,
                    SENDER_CITY: senderInformation.sendercity,
                    SENDER_STATE: senderInformation.senderstate,
                    SENDER_POSCODE: senderInformation.senderposcode,
                    RECEIVER_FULLNAME: data.UserFullName,
                    RECEIVER_CONTACTNO: data.UserContactNo,
                    RECEIVER_ADDLINE1: data.UserAddressLine1,
                    RECEIVER_ADDLINE2: data.UserAddressLine2,
                    RECEIVER_CITY: data.UserCity,
                    RECEIVER_STATE: data.UserState,
                    RECEIVER_POSCODE: data.UserPoscode,
                    RECEIVER_COUNTRYCODE: "MY",
                    LOGISTICID: data.logisticID,
                    ORDERPRODUCTDETAILSID: selectedData,
                    PROJECTID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID
                }
                dispatch(GitAction.CallAddOrderShipment(object))
                setShipmentSubmit(true)
                console.log("trackingviewtrackingview objectobject", object)
            }
        }
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
                        <div className={value + 1 === 1 ? "col-3" : "col-2"}></div>
                        <div className="col-3">  <Typography style={TitleStyle} > Product Variation</Typography></div>
                        <div className="col-3">  <Typography style={TitleStyle} > Order Details</Typography></div>
                        {
                            value + 1 > 2 && <div className="col-3">  <Typography style={TitleStyle} > Shipping Details</Typography></div>
                        }
                    </div>
                    <hr />
                    {
                        data.orderDetails.map((details, subindex) => {
                            return (
                                <div className="row" >
                                    {value + 1 === 1 &&
                                        <div className="col-1">
                                            {
                                                data.TrackingNumber == "-" || data.TrackingNumber == undefined &&
                                                <Checkbox color="primary"
                                                    checked={details.isCheckBoxSelected}
                                                    onClick={() => setCheckBoxListing(data, index, details, subindex, 2)} />
                                            }
                                        </div>
                                    }
                                    <div className="col-2" style={{ textAlign: "center" }}>
                                        <img
                                            height={60}
                                            src={details.ProductImages !== "[]" && details.ProductImages !== undefined && details.ProductImages !== null ? JSON.parse(details.ProductImages)[0] : Logo}
                                            onError={(e) => { e.target.onerror = null; e.target.src = Logo }}
                                            alt={details.ProductName}
                                        />
                                    </div>
                                    <div className="col-3">
                                        <div style={{ fontWeight: "bold", fontSize: "13px" }}>  {details.ProductName} </div>
                                        <div style={{ fontSize: "11px" }}>  SKU : {details.SKU} </div>
                                        <div style={{ fontSize: "11px" }}>  Variation : {details.ProductVariationValue} </div>
                                    </div>
                                    <div className="col-3" >
                                        <div >  </div>
                                        <div style={{ fontSize: "11px", fontWeight: "bold" }}>  Total Order Quantity : {details.ProductQuantity} </div>
                                        <div style={{ fontSize: "11px" }}>  Total Price : RM {(details.ProductQuantity * details.ProductVariationPrice).toFixed(2)}  </div>
                                    </div>
                                    <div className="col-3">
                                        {console.log("dsadasdada", details)}
                                        {
                                            details.TrackingNumber !== "-" && details.TrackingNumber !== undefined &&
                                            <div className="col-5">
                                                <div >  </div>
                                                <div style={{ fontSize: "11px", fontWeight: "bold" }}>  {checkLogistic(details.LogisticID)} </div>
                                                <div style={{ fontSize: "11px", fontWeight: "bold" }}>  {details.TrackingNumber}  </div>
                                            </div>
                                        }
                                    </div>
                                    {
                                        details.PDFLabel !== "" && details.PDFLabel !== undefined &&
                                        <div className="col-3">
                                            <Button onClick={() =>
                                                <>
                                                    {setOrderPDFLabel(details.PDFLabel)}
                                                    {handlePrint()}
                                                </>
                                            }>Reprint Cosignment</Button>
                                        </div>
                                    }
                                    <hr />

                                    {/* {value + 1 === 1 &&
                                        <div className="col-2">
                                            <FormControl fullWidth size="small" variant="outlined">
                                                <OutlinedInput
                                                    id={"outlined-adornment-Quantity-" + subindex}
                                                    label=""
                                                    value={details.deliveryQuantity}
                                                    type="number"
                                                    onChange={(e) => {
                                                       let newArr = OrderListing.filter((y) => y.TrackingStatusID == value + 1)
                                                        let max = details.PendingDeliveryQty !== undefined ? details.PendingDeliveryQty : details.ProductQuantity
                                                        if (e.target.value <= max && e.target.value >= 0) {
                                                            newArr[index * page * rowsPerPage].orderDetails[subindex].deliveryQuantity = e.target.value
                                                            newArr[index * page * rowsPerPage].orderDetails[subindex].isDeliveryQuantityError = false
                                                        } else {
                                                            newArr[index * page * rowsPerPage].orderDetails[subindex].isDeliveryQuantityError = true
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
                                    } */}

                                </div>
                            )
                        })
                    }
                    <div>
                        {
                            data.orderDetails !== undefined && data.orderDetails.filter((x) => x.isCheckBoxSelected === true).length > 0 &&
                            <div className="row">
                                <div className="col-3">
                                    <InputLabel shrink htmlFor="bootstrap-input" style={{ fontSize: "12pt" }}>Courier Service</InputLabel>
                                    <FormControl fullWidth size="small" variant="outlined">
                                        <Select
                                            id={"outlined-adornment-logistic-" + index} label=""
                                            value={data.logisticID}
                                            onChange={(e) => {
                                                let newArr = OrderListing.filter((y) => y.TrackingStatusID == value + 1)
                                                newArr[index * page * rowsPerPage].logisticID = e.target.value
                                                newArr[index * page * rowsPerPage].parcelQuantity = newArr[index * page * rowsPerPage].parcelQuantity !== undefined ? newArr[index * page * rowsPerPage].parcelQuantity : 1
                                                newArr[index * page * rowsPerPage].isParcelQuantityError = false
                                                setOrderListing([...newArr]);
                                            }}
                                            className="select"
                                            required
                                        >
                                            {isArrayNotEmpty(logistic) && logistic.map((x) => {
                                                return (
                                                    <MenuItem value={x.LogisticID}> {x.LogisticName}</MenuItem>
                                                )
                                            })}
                                        </Select>
                                    </FormControl>
                                    {data.logisticID === "" && <FormHelperText style={{ color: "red" }}>Courier is required</FormHelperText>}
                                </div>
                                <div className="col">
                                    {
                                        data.logisticID === 3 ?
                                            <div className="row">
                                                <div className="col-4">
                                                    <InputLabel shrink htmlFor="bootstrap-input" style={{ fontSize: "12pt" }}>Parcel Quantity</InputLabel>
                                                    <FormControl fullWidth size="small" variant="outlined">
                                                        <OutlinedInput
                                                            id={"outlined-adornment-parcelQty-" + index}
                                                            label=""
                                                            value={data.parcelQuantity}
                                                            type="number"
                                                            onChange={(e) => {
                                                                let newArr = OrderListing.filter((y) => y.TrackingStatusID == value + 1)
                                                                newArr[index * page * rowsPerPage].parcelQuantity = e.target.value
                                                                newArr[index * page * rowsPerPage].isParcelQuantityError = e.target.value <= 0 || e.target.value == "" ? true : false
                                                                setOrderListing([...newArr]);
                                                            }}
                                                            required
                                                        />
                                                    </FormControl>
                                                    {data.isParcelQuantityError && <FormHelperText style={{ color: "red" }}>Insert Parcel Quantity</FormHelperText>}
                                                </div>
                                                <div className="col" style={{ textAlign: "right" }}>
                                                    <div style={{ paddingTop: "20px" }} onClick={() => handleSubmitTracking(index, data)}>
                                                        <Button color="primary">Create Shipment</Button>
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            <div className="row">
                                                <div className="col">
                                                    <InputLabel shrink htmlFor="bootstrap-input" style={{ fontSize: "12pt" }}>Tracking Number</InputLabel>
                                                    <FormControl fullWidth size="small" variant="outlined">
                                                        <OutlinedInput
                                                            id={"outlined-adornment-tracking-" + index}
                                                            label=""
                                                            value={data.trackingNumber}
                                                            type="number"
                                                            onChange={(e) => {
                                                                let newArr = OrderListing.filter((y) => y.TrackingStatusID == value + 1)
                                                                newArr[index * page * rowsPerPage].trackingNumber = e.target.value
                                                                newArr[index * page * rowsPerPage].isTrackingNumberError = e.target.value === "" ? true : false
                                                                setOrderListing([...newArr]);
                                                            }}
                                                            required
                                                        />
                                                    </FormControl>
                                                    {data.isTrackingNumberError && <FormHelperText style={{ color: "red" }}>Insert Tracking Number</FormHelperText>}
                                                </div>
                                                <div className="col" style={{ paddingTop: "20px" }}>
                                                    <Button color="primary">Create Shipment</Button>
                                                </div>
                                            </div>
                                    }
                                </div>

                                <hr style={{ marginTop: "10px" }} />
                                {data.logisticID === 3 &&
                                    <div className="row">
                                        <Typography>Parcel Measurement</Typography>

                                        <div className="col">
                                            <InputLabel shrink htmlFor="bootstrap-input" style={{ fontSize: "12pt" }}>Parcel Weight</InputLabel>
                                            <FormControl fullWidth size="small" variant="outlined">
                                                <OutlinedInput
                                                    id={"outlined-adornment-parcelWeight-" + index}
                                                    label=""
                                                    value={data.parcelWeight}
                                                    type="number"
                                                    onChange={(e) => {
                                                        let newArr = OrderListing.filter((y) => y.TrackingStatusID == value + 1)
                                                        newArr[index * page * rowsPerPage].parcelWeight = e.target.value
                                                        newArr[index * page * rowsPerPage].isParcelWeightError = e.target.value <= 0 || e.target.value == "" ? true : false
                                                        setOrderListing([...newArr]);
                                                    }}
                                                    required
                                                />
                                            </FormControl>
                                            {data.isParcelWeightError && <FormHelperText style={{ color: "red" }}>Insert Parcel Weight</FormHelperText>}
                                        </div>
                                        <div className="col">
                                            <InputLabel shrink htmlFor="bootstrap-input" style={{ fontSize: "12pt" }}>Parcel Width</InputLabel>
                                            <FormControl fullWidth size="small" variant="outlined">
                                                <OutlinedInput
                                                    id={"outlined-adornment-parcelWidth-" + index}
                                                    label=""
                                                    value={data.parcelWidth}
                                                    type="number"
                                                    onChange={(e) => {
                                                        let newArr = OrderListing.filter((y) => y.TrackingStatusID == value + 1)
                                                        newArr[index * page * rowsPerPage].parcelWidth = e.target.value
                                                        newArr[index * page * rowsPerPage].isParcelWidthError = e.target.value <= 0 || e.target.value == "" ? true : false
                                                        setOrderListing([...newArr]);
                                                    }}
                                                    required
                                                />
                                            </FormControl>
                                            {data.isParcelWidthError && <FormHelperText style={{ color: "red" }}>Insert Parcel Width</FormHelperText>}
                                        </div>
                                        <div className="col">
                                            <InputLabel shrink htmlFor="bootstrap-input" style={{ fontSize: "12pt" }}>Parcel Height</InputLabel>
                                            <FormControl fullWidth size="small" variant="outlined">
                                                <OutlinedInput
                                                    id={"outlined-adornment-parcelHeight-" + index}
                                                    label=""
                                                    value={data.parcelHeight}
                                                    type="number"
                                                    onChange={(e) => {
                                                        let newArr = OrderListing.filter((y) => y.TrackingStatusID == value + 1)
                                                        newArr[index * page * rowsPerPage].parcelHeight = e.target.value
                                                        newArr[index * page * rowsPerPage].isParcelHeightError = e.target.value <= 0 || e.target.value == "" ? true : false
                                                        setOrderListing([...newArr]);
                                                    }}
                                                    required
                                                />
                                            </FormControl>
                                            {data.isParcelHeightError && <FormHelperText style={{ color: "red" }}>Insert Parcel Height</FormHelperText>}
                                        </div>
                                        <div className="col">
                                            <InputLabel shrink htmlFor="bootstrap-input" style={{ fontSize: "12pt" }}>Parcel Length</InputLabel>
                                            <FormControl fullWidth size="small" variant="outlined">
                                                <OutlinedInput
                                                    id={"outlined-adornment-parcelLength-" + index}
                                                    label=""
                                                    value={data.parcelLength}
                                                    type="number"
                                                    onChange={(e) => {
                                                        let newArr = OrderListing.filter((y) => y.TrackingStatusID == value + 1)
                                                        newArr[index * page * rowsPerPage].parcelLength = e.target.value
                                                        newArr[index * page * rowsPerPage].isParcelLengthError = e.target.value <= 0 || e.target.value == "" ? true : false
                                                        setOrderListing([...newArr]);
                                                    }}
                                                    required
                                                />
                                            </FormControl>
                                            {data.isParcelLengthError && <FormHelperText style={{ color: "red" }}>Insert Parcel Length</FormHelperText>}
                                        </div>
                                    </div>
                                }
                            </div>
                        }
                        {console.log("data", data.orderDetails)}
                    </div>
                </CardContent>
            </Card >
        )
    }

    const checkIndex = (index) => {
        let returnIndex = index
        if (page !== 0) {
            returnIndex = rowsPerPage * page + index
        }
        return returnIndex
    }

    const OrderLayout = (Listing) => {
        return (
            <>
                <TableContainer component={Paper} style={{ overflow: "hidden" }}>
                    <div style={{ display: "none" }} >
                        <div ref={componentRef}>
                            <div>
                                {
                                    PDFLabel !== "" && <iframe src={'data:application/pdf;base64,' + PDFLabel} />
                                }
                            </div>
                        </div>
                    </div>
                    {/* } */}

                    <Table aria-label="collapsible table" size="small">
                        {headerLayout()}
                        {
                            isOrderSet ?
                                <TableBody >
                                    {isArrayNotEmpty(Listing) && Listing.slice((page) * rowsPerPage, (page) * rowsPerPage + rowsPerPage)
                                        .map((data, index) => {
                                            return (
                                                <>
                                                    {CollapseLayout(data, checkIndex(index))}
                                                    <TableRow style={{ backgroundColor: "#f8f9fa" }} >
                                                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
                                                            <Collapse in={checkCollapseOpen(checkIndex(index))} timeout="auto" unmountOnExit>
                                                                <Box sx={{ margin: 1 }}>
                                                                    {OrderDetailLayout(data, checkIndex(index))}
                                                                    <Card style={{ marginTop: "10px" }}>
                                                                        <CardContent>
                                                                            <div className="row">
                                                                                <div className="col">
                                                                                    <Typography style={TitleStyle} > Delivery Details </Typography>
                                                                                </div>
                                                                                {
                                                                                    value + 1 === 1 &&
                                                                                    <div className="col" style={{ textAlign: "right" }}>
                                                                                        <Button color="primary" onClick={() => {
                                                                                            let newArr = OrderListing.filter((y) => y.TrackingStatusID == value + 1)
                                                                                            newArr[index * page * rowsPerPage].isEdit = newArr[index * page * rowsPerPage].isEdit === undefined ? true : !newArr[index * page * rowsPerPage].isEdit
                                                                                            setOrderListing([...newArr])
                                                                                        }}>{OrderListing[index].isEdit === false ? "EDIT" : "CANCEL"}</Button>
                                                                                    </div>
                                                                                }
                                                                            </div>
                                                                            {
                                                                                OrderListing[index].isEdit === true ?
                                                                                    <div className="row">
                                                                                        <div className="row" style={{ paddingTop: "10px" }}>
                                                                                            <div className="col-xl-4 col-lg-4 col-md-4  col-s-6 col-xs-6">
                                                                                                <InputLabel shrink htmlFor="bootstrap-input" style={{ paddingLeft: "15px", fontSize: "12pt" }}>Receiver Name</InputLabel>
                                                                                                <FormControl fullWidth size="small" variant="outlined">
                                                                                                    <OutlinedInput
                                                                                                        id={"outlined-adornment-receiverName-" + index}
                                                                                                        label=""
                                                                                                        value={data.UserFullName}
                                                                                                        onChange={(e) => {
                                                                                                            let newArr = OrderListing.filter((y) => y.TrackingStatusID == value + 1)
                                                                                                            newArr[index * page * rowsPerPage].UserFullName = e.target.value
                                                                                                            newArr[index * page * rowsPerPage].isUserFullNameError = e.target.value === "" ? true : false
                                                                                                            setOrderListing([...newArr]);
                                                                                                        }}
                                                                                                        required
                                                                                                    />
                                                                                                </FormControl>
                                                                                                {data.isUserFullNameError && <FormHelperText style={{ color: "red" }}>Insert Receiver Name</FormHelperText>}
                                                                                            </div>
                                                                                            <div className="col-xl-4 col-lg-4 col-md-4  col-s-6 col-xs-6">
                                                                                                <InputLabel shrink htmlFor="bootstrap-input" style={{ fontSize: "12pt" }}>Receiver Contact</InputLabel>
                                                                                                <FormControl fullWidth size="small" variant="outlined">
                                                                                                    <OutlinedInput
                                                                                                        id={"outlined-adornment-receiverContact-" + index}
                                                                                                        label=""
                                                                                                        value={data.UserContactNo}
                                                                                                        onChange={(e) => {
                                                                                                            let newArr = OrderListing.filter((y) => y.TrackingStatusID == value + 1)
                                                                                                            newArr[index * page * rowsPerPage].UserContactNo = e.target.value
                                                                                                            newArr[index * page * rowsPerPage].isUserContactNoError = e.target.value === "" ? true : false
                                                                                                            setOrderListing([...newArr]);
                                                                                                        }}
                                                                                                        required
                                                                                                    />
                                                                                                </FormControl>
                                                                                            </div>
                                                                                            <div className="col-xl-4 col-lg-4 col-md-4  col-s-6 col-xs-6">
                                                                                                <InputLabel shrink htmlFor="bootstrap-input" style={{ fontSize: "12pt", paddingLeft: value + 1 === 1 ? "0px" : "15px" }}>Delivery Method</InputLabel>
                                                                                                <FormControl fullWidth size="small" variant="outlined">
                                                                                                    <Select
                                                                                                        id={"outlined-adornment-Method-" + index * page * rowsPerPage} label=""
                                                                                                        value={data.PickUpInd}
                                                                                                        onChange={(e) => {
                                                                                                            let newArr = OrderListing.filter((y) => y.TrackingStatusID == value + 1)
                                                                                                            newArr[index * page * rowsPerPage].PickUpInd = e.target.value
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
                                                                                        <div className="row" style={{ paddingTop: "10px" }}>
                                                                                            <div className="col-xl-4 col-lg-4 col-md-4  col-s-6 col-xs-6">
                                                                                                <InputLabel shrink htmlFor="bootstrap-input" style={{ fontSize: "12pt" }}>Address Line 1</InputLabel>
                                                                                                <FormControl fullWidth size="small" variant="outlined">
                                                                                                    <OutlinedInput
                                                                                                        id={"outlined-adornment-receiverAdd1-" + index}
                                                                                                        label=""
                                                                                                        value={data.UserAddressLine1}
                                                                                                        onChange={(e) => {
                                                                                                            let newArr = OrderListing.filter((y) => y.TrackingStatusID == value + 1)
                                                                                                            newArr[index * page * rowsPerPage].UserAddressLine1 = e.target.value
                                                                                                            newArr[index * page * rowsPerPage].isUserAddressLine1Error = e.target.value === "" ? true : false
                                                                                                            setOrderListing([...newArr]);
                                                                                                        }}
                                                                                                        required
                                                                                                    />
                                                                                                </FormControl>
                                                                                            </div>
                                                                                            <div className="col-xl-4 col-lg-4 col-md-4  col-s-6 col-xs-6">
                                                                                                <InputLabel shrink htmlFor="bootstrap-input" style={{ fontSize: "12pt" }}>Address Line 2</InputLabel>
                                                                                                <FormControl fullWidth size="small" variant="outlined">
                                                                                                    <OutlinedInput
                                                                                                        id={"outlined-adornment-receiverAdd2-" + index}
                                                                                                        label=""
                                                                                                        value={data.UserAddressLine2}
                                                                                                        onChange={(e) => {
                                                                                                            let newArr = OrderListing.filter((y) => y.TrackingStatusID == value + 1)
                                                                                                            newArr[index * page * rowsPerPage].UserAddressLine2 = e.target.value
                                                                                                            newArr[index * page * rowsPerPage].isUserAddressLine2Error = e.target.value === "" ? true : false
                                                                                                            setOrderListing([...newArr]);
                                                                                                        }}
                                                                                                        required
                                                                                                    />
                                                                                                </FormControl>
                                                                                            </div>
                                                                                            <div className="col-xl-4 col-lg-4 col-md-4  col-s-6 col-xs-6">
                                                                                                <InputLabel shrink htmlFor="bootstrap-input" style={{ fontSize: "12pt" }}>City</InputLabel>
                                                                                                <FormControl fullWidth size="small" variant="outlined">
                                                                                                    <OutlinedInput
                                                                                                        id={"outlined-adornment-receiverCity-" + index}
                                                                                                        label=""
                                                                                                        value={data.UserCity}
                                                                                                        onChange={(e) => {
                                                                                                            let newArr = OrderListing.filter((y) => y.TrackingStatusID == value + 1)
                                                                                                            newArr[index * page * rowsPerPage].UserCity = e.target.value
                                                                                                            newArr[index * page * rowsPerPage].isUserCityError = e.target.value === "" ? true : false
                                                                                                            setOrderListing([...newArr]);
                                                                                                        }}
                                                                                                        required
                                                                                                    />
                                                                                                </FormControl>
                                                                                            </div>
                                                                                        </div>

                                                                                        <div className="row" style={{ paddingTop: "10px" }}>
                                                                                            <div className="col-xl-4 col-lg-4 col-md-4  col-s-6 col-xs-6">
                                                                                                <InputLabel shrink htmlFor="bootstrap-input" style={{ fontSize: "12pt" }}>Receiver Poscode</InputLabel>
                                                                                                <FormControl fullWidth size="small" variant="outlined">
                                                                                                    <OutlinedInput
                                                                                                        id={"outlined-adornment-receiverPoscode-" + index}
                                                                                                        label=""
                                                                                                        value={data.UserPoscode}
                                                                                                        onChange={(e) => {
                                                                                                            let newArr = OrderListing.filter((y) => y.TrackingStatusID == value + 1)
                                                                                                            newArr[index * page * rowsPerPage].UserPoscode = e.target.value
                                                                                                            newArr[index * page * rowsPerPage].isUserPoscodeError = e.target.value === "" ? true : false
                                                                                                            setOrderListing([...newArr]);
                                                                                                        }}
                                                                                                        required
                                                                                                    />
                                                                                                </FormControl>
                                                                                            </div>
                                                                                            <div className="col-xl-4 col-lg-4 col-md-4  col-s-6 col-xs-6">
                                                                                                <InputLabel shrink htmlFor="bootstrap-input" style={{ fontSize: "12pt" }}>Receiver State</InputLabel>
                                                                                                <FormControl fullWidth size="small" variant="outlined">
                                                                                                    <OutlinedInput
                                                                                                        id={"outlined-adornment-receiverState-" + index}
                                                                                                        label=""
                                                                                                        value={data.UserState}
                                                                                                        onChange={(e) => {
                                                                                                            let newArr = OrderListing.filter((y) => y.TrackingStatusID == value + 1)
                                                                                                            newArr[index * page * rowsPerPage].UserState = e.target.value
                                                                                                            newArr[index * page * rowsPerPage].isUserStateError = e.target.value === "" ? true : false
                                                                                                            setOrderListing([...newArr]);
                                                                                                        }}
                                                                                                        required
                                                                                                    />
                                                                                                </FormControl>
                                                                                            </div>
                                                                                            <div className="col-xl-4 col-lg-4 col-md-4  col-s-6 col-xs-6">
                                                                                                <InputLabel shrink htmlFor="bootstrap-input" style={{ fontSize: "12pt" }}>Receiver Country</InputLabel>
                                                                                                <FormControl fullWidth size="small" variant="outlined">
                                                                                                    <Select
                                                                                                        id={"outlined-adornment-receiverCountry-" + index}
                                                                                                        label=""
                                                                                                        value={data.CountryID}
                                                                                                        onChange={(e) => {
                                                                                                            let newArr = OrderListing.filter((y) => y.TrackingStatusID == value + 1)
                                                                                                            newArr[index * page * rowsPerPage].CountryID = e.target.value
                                                                                                            setOrderListing([...newArr]);
                                                                                                        }}
                                                                                                        className="select"
                                                                                                        required
                                                                                                    >
                                                                                                        {countries.length > 0 && countries.map((country) => (
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
                                                                                    :
                                                                                    <div className="row" style={{ paddingTop: "10px" }}>
                                                                                        <div className="row">
                                                                                            <div className="col-xl-2 col-lg-2 col-md-2 col-s-6 col-xs-6">
                                                                                                <div className="row">
                                                                                                    <InputLabel shrink htmlFor="bootstrap-input" style={{ paddingLeft: "15px", fontSize: "12pt" }}>Receiver Name</InputLabel>
                                                                                                    <Typography style={DetailStyle}> {data.UserFullName}</Typography>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-xl-2 col-lg-2 col-md-2  col-s-6 col-xs-6">
                                                                                                <div className="row">
                                                                                                    <InputLabel shrink htmlFor="bootstrap-input" style={{ paddingLeft: "15px", fontSize: "12pt" }}>Receiver Contact</InputLabel>
                                                                                                    <Typography style={DetailStyle}>  {data.UserContactNo}</Typography>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-xl-5 col-lg-5 col-md-5  col-s-6 col-xs-6">
                                                                                                <div className="row">
                                                                                                    <InputLabel shrink htmlFor="bootstrap-input" style={{ paddingLeft: "15px", fontSize: "12pt" }}>Receiver Address</InputLabel>
                                                                                                    <Typography style={DetailStyle}> {data.UserAddressLine1 + " " + data.UserAddressLine2 + " " + data.UserCity + " " + data.UserPoscode + " , " + data.UserState}</Typography>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-xl-3 col-lg-3 col-md-3 col-s-6 col-xs-6">
                                                                                                <div className="row">
                                                                                                    <InputLabel shrink htmlFor="bootstrap-input" style={{ paddingLeft: "15px", fontSize: "12pt" }}>Delivery Method</InputLabel>
                                                                                                    <Typography style={DetailStyle}>{data.PickUpInd === 1 ? "Self Pick Up" : "Delivery"}</Typography>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>

                                                                            }

                                                                        </CardContent>
                                                                    </Card>
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
                </TableContainer >
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={Listing.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(e, page) => setPage(page)}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                />
            </>
        )
    }

    return (
        <div style={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    {
                        isArrayNotEmpty(transactionStatus) && transactionStatus.map((x, index) => {

                            const orderLength = () => {
                                let listing = ""
                                if (isArrayNotEmpty(OrderListing)) {
                                    let listingLength = OrderListing.filter((y) => y.TrackingStatusID == x.TrackingStatusID).length
                                    listing = " ( " + listingLength + " )"
                                }
                                return listing
                            }
                            return (<Tab label={x.TrackingStatus + orderLength()} {...a11yProps(index)} />)
                        })
                    }
                </Tabs>
            </Box>
            {
                isArrayNotEmpty(transactionStatus) && transactionStatus.map((x, statusIndex) => {
                    return (<TabPanel value={value} index={statusIndex}> {OrderLayout(isArrayNotEmpty(OrderListing) ? OrderListing.filter((y) => y.TrackingStatusID === x.TrackingStatusID) : [])} </TabPanel>)
                })
            }
        </div>
    );
}

