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
import LoadingPanel from "../../tools/LoadingPanel";
import { Button } from "reactstrap";
import moment from "moment/moment";
import Logo from "../../assets/logos/logo.png";
import AlertDialog from "../../components/ModalComponent/ModalComponent";
import SearchBar from "../../components/SearchBar/SearchBar"

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
    const { transactions, countries, transactionStatus, logistic, tracking, orderShipment, orderShipmentStatus, trackingStatusAction, currentUser } = useSelector(state => ({
        transactions: state.counterReducer.transactions,
        transactionStatus: state.counterReducer.transactionStatus,
        countries: state.counterReducer.countries,
        logistic: state.counterReducer.logistic,
        tracking: state.counterReducer.tracking,
        trackingStatusAction: state.counterReducer.trackingStatusAction,
        currentUser: state.counterReducer.userProfile,
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
    const [isShipmentSubmit, setShipmentSubmit] = useState(false)
    const [isViewTracking, setViewTracking] = useState(false)
    const [isStatusViewClick, setViewClick] = useState(false)
    const [selectedMerchant, setSelectedMerchant] = useState(0)

    const [searchkeyword, setSearchKeyword] = useState("")
    const [filteredListing, setFilteredListing] = useState([])
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

    useEffect(() => {
        dispatch(GitAction.CallGetTransaction({
            TrackingStatus: "Payment Confirm",
            ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID,
            UserID: JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID === 1 ? 0 : JSON.parse(localStorage.getItem("loginUser"))[0].UserID,

        }))
        dispatch(GitAction.CallCountry())
        dispatch(GitAction.CallGetTransactionStatus())
        dispatch(GitAction.CallCourierService())
        dispatch(GitAction.CallUserProfile({
            TYPE: "Usertype",
            TYPEVALUE: 0,
            USERID: JSON.parse(localStorage.getItem("loginUser"))[0].UserID ? JSON.parse(localStorage.getItem("loginUser"))[0].UserID : 0,
            USERROLEID: JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID ? JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID : 0,
            LISTPERPAGE: 999,
            PAGE: 1,
            ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID
        }))
    }, [])


    useEffect(() => {
        if (isStatusViewClick === true)
            setViewTracking(true)
    }, [orderShipmentStatus])

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

    useEffect(() => {
        if (isArrayNotEmpty(orderShipment) && orderShipment[0].PDFLabel !== undefined && isShipmentSubmit === true) {
            setShipmentSubmit(false)
            previewCosignment(orderShipment[0].PDFLabel)
            setTimeout(
                () => window.location.reload(false),
                1000
            );
        }
    }, [orderShipment])

    useEffect(() => {
        if (isArrayNotEmpty(trackingStatusAction)) {
            dispatch(GitAction.CallResetUpdateTrackingStatus())
            if (trackingStatusAction[0].OrderID !== undefined) {
                toast.success("Successfully Update Tracking Status")
                setTimeout(
                    () => window.location.reload(false),
                    2000
                );
            } else
                toast.error("Fail to Update Tracking Status")
        }
    }, [trackingStatusAction])

    useEffect(() => {
        if (isArrayNotEmpty(tracking)) {
            dispatch(GitAction.CallResetOrderTracking())
            if (tracking[0].PDFLabel !== undefined) {
                dispatch(GitAction.CallGetTransaction({
                    TrackingStatus: "Payment Confirm",
                    ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID,
                    UserID: JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID === 1 ? 0 : JSON.parse(localStorage.getItem("loginUser"))[0].UserID,

                }))
                toast.success("Successfully Update Tracking Number")
                setOrder(false)
            } else {
                toast.error("Fail to Update Tracking Status")
            }
        }
    }, [tracking])

    // set base64 to PDF file 
    const previewCosignment = (Base64Label) => {
        let byteCharacters = atob(Base64Label);
        let byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        let byteArray = new Uint8Array(byteNumbers);
        let file = new Blob([byteArray], { type: 'application/pdf;base64' });
        let fileURL = URL.createObjectURL(file);
        window.open(fileURL);
    }

    const headerLayout = () => {
        return (
            <TableHead style={{ backgroundColor: "#f8f9fa" }}>
                <TableRow>
                    <TableCell width="5%" />
                    {value + 1 === 2 && <TableCell width="5%"></TableCell>}
                    <TableCell width="10%" style={HeaderStyle} >Order Date</TableCell>
                    <TableCell width="10%" align="left" style={HeaderStyle}  >Order ID</TableCell>
                    <TableCell width="15%" align="left" style={HeaderStyle} >Customer</TableCell>
                    <TableCell width="15%" align="left" style={HeaderStyle} >Contact</TableCell>
                    <TableCell width="15%" align="left" style={HeaderStyle} >Status</TableCell>
                    <TableCell width="15%" align="left" style={HeaderStyle} >No Item</TableCell>
                    <TableCell width="10%" align="left" style={HeaderStyle} >Total</TableCell>
                    {value + 1 !== 1 && <TableCell width="10%" align="left" style={HeaderStyle}>Action</TableCell>}
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
        let selectedIndex = getIndex(OrderListing, maindata)

        let isToSet = false
        if (layer === 1) {
            if (isArrayNotEmpty(listingData)) {
                let data = listingData[selectedIndex]
                let checkBoxStatus = false
                if (data.isCheckBoxSelected === false)
                    checkBoxStatus = true
                data.isCheckBoxSelected = checkBoxStatus
                setOrderListing(listingData)
            }
        } else {
            if (isArrayNotEmpty(listingData)) {
                let mainData = listingData[selectedIndex]
                let data = listingData[selectedIndex].orderDetails[subindex]
                let orderDetailsLength = listingData[selectedIndex].orderDetails.length
                let selectedData = []
                if (data.isCheckBoxSelected === false)
                    data.isCheckBoxSelected = true

                else
                    data.isCheckBoxSelected = false

                selectedData = mainData.orderDetails !== undefined && isArrayNotEmpty(mainData.orderDetails) && mainData.orderDetails.filter((x) => x.isCheckBoxSelected == true)

                if (selectedData.length === orderDetailsLength)
                    listingData[selectedIndex].isCheckBoxSelected = true
                else
                    listingData[selectedIndex].isCheckBoxSelected = false
                setOrderListing(listingData)
            }
        }
        if (isArrayNotEmpty(checkSelectedListing(listingData)))
            isToSet = true

        setSelectedList(isToSet)
    }

    const checkLogistic = (ID) => {
        let data = ""
        if (isArrayNotEmpty(logistic)) {
            logistic.filter((x) => x.LogisticID === parseInt(ID)).map((y) => {
                data = y.LogisticName
            })
        }
        return data
    }

    const getIndex = (newArr, data) => {
        let selectedIndex = ""
        newArr.map((x, i) => {
            if (x.OrderID === data.OrderID)
                selectedIndex = i
        })
        return selectedIndex
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
                {value + 1 === 2 &&
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
                    value + 1 === 2 &&
                    <TableCell align="left">
                        <IconButton>
                            <Button style={{ backgroundColor: "#e74c3c" }} onClick={() => {
                                dispatch(GitAction.CallUpdateOrderTrackingStatus({
                                    OrderID: data.OrderID,
                                    TrackingStatusID: 6
                                }))
                            }}>
                                Cancel
                            </Button>
                            <Button style={{ backgroundColor: "#F05E16", margin: "10px" }} onClick={() => {
                                dispatch(GitAction.CallUpdateOrderTrackingStatus({
                                    OrderID: data.OrderID,
                                    TrackingStatusID: 7
                                }))
                            }}>
                                Refund
                            </Button>
                        </IconButton>
                        <IconButton>
                        </IconButton>
                    </TableCell>
                }
                {
                    value + 1 === 3 &&
                    <TableCell align="left">
                        <IconButton>
                            <Button style={{ backgroundColor: "#86DC3D" }} onClick={() => {
                                dispatch(GitAction.CallUpdateOrderTrackingStatus({
                                    OrderID: data.OrderID,
                                    TrackingStatusID: 5
                                }))
                            }}>
                                Complete
                            </Button>
                            <Button style={{ backgroundColor: "#F05E16", margin: "10px" }} onClick={() => {
                                dispatch(GitAction.CallUpdateOrderTrackingStatus({
                                    OrderID: data.OrderID,
                                    TrackingStatusID: 7
                                }))
                            }}>
                                Refund
                            </Button>
                        </IconButton>
                        <IconButton>
                        </IconButton>
                    </TableCell>
                }
                {
                    value + 1 === 5 &&
                    <TableCell align="left">
                        <IconButton>
                            <Button style={{ backgroundColor: "#F05E16", margin: "10px" }} onClick={() => {
                                dispatch(GitAction.CallUpdateOrderTrackingStatus({
                                    OrderID: data.OrderID,
                                    TrackingStatusID: 7
                                }))
                            }}>
                                Refund
                            </Button>
                        </IconButton>
                        <IconButton>
                        </IconButton>
                    </TableCell>
                }
                {
                    value + 1 === 8 &&
                    <TableCell align="left">
                        <IconButton>
                            <Button style={{ backgroundColor: "#86DC3D" }} onClick={() => {
                                dispatch(GitAction.CallUpdateOrderTrackingStatus({
                                    OrderID: data.OrderID,
                                    TrackingStatusID: 5
                                }))
                            }}>
                                Complete
                            </Button>
                            <Button style={{ backgroundColor: "#F05E16", margin: "10px" }} onClick={() => {
                                dispatch(GitAction.CallUpdateOrderTrackingStatus({
                                    OrderID: data.OrderID,
                                    TrackingStatusID: 7
                                }))
                            }}>
                                Refund
                            </Button>
                        </IconButton>
                        <IconButton>
                        </IconButton>
                    </TableCell>
                }
            </TableRow >
        )
    }

    const senderInformationLayout = () => {
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
        let error = false
        let selectedData = []

        if (isArrayNotEmpty(data.orderDetails)) {
            data.orderDetails.filter((x) => x.isCheckBoxSelected === true).map((y) => {
                selectedData.push(y.OrderProductDetailID)
            })
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

        let userObject = {
            OrderID: data.OrderID,
            FirstName: data.UserFullName !== "" ? data.UserFullName : "-",
            LastName: "-",
            PickUpInd: data.Method === "Delivery" ? 0 : 1,
            UserContactNo: data.UserContactNo !== "" ? data.UserContactNo : "-",
            UserEmailAddress: data.UserEmailAddress !== "" ? data.UserEmailAddress : "-",
            UserAddressLine1: data.UserAddressLine1 !== "" ? data.UserAddressLine1 : "-",
            UserAddressLine2: data.UserAddressLine2 !== "" ? data.UserAddressLine2 : "-",

            UserPoscode: data.UserPoscode !== "" ? data.UserPoscode : "-",
            UserState: data.UserState !== "" ? data.UserState : "-",

            UserCity: data.UserCity !== "" ? data.UserCity : "-",
            CountryID: data.CountryID,
        }

        if (data.logisticID === 3) {
            if (data.parcelLength === "" || data.parcelHeight === "" || data.parcelQuantity === "" || data.parcelWeight === "" || data.parcelWidth === "" ||
                data.parcelLength <= 0 || data.parcelHeight <= 0 || data.parcelQuantity <= 0 || data.parcelWeight <= 0 || data.parcelWidth <= 0) {
                error = true
                toast.error("Please fill in all required parcel information")
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
                    ORDERNAME: data.OrderName,
                    PROJECTID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID
                }
                dispatch(GitAction.CallAddOrderShipment(object))
                dispatch(GitAction.CallUpdateOrderUserDetails(userObject))
                setShipmentSubmit(true)
                toast.success("Creating shipment, Waiting for shipment processing...")
            }
        } else {
            if (data.trackingNumber !== null && data.trackingNumber !== undefined && data.trackingNumber !== "") {
                if (error === false) {
                    let object = {
                        ORDERTRACKINGNUMBER: data.trackingNumber,
                        LOGISTICID: data.logisticID,
                        PDFLABEL: "-",
                        ORDERPRODUCTDETAILSID: selectedData
                    }
                    dispatch(GitAction.CallUpdateOrderTracking(object))
                    dispatch(GitAction.CallUpdateOrderUserDetails(userObject))
                }
            }
            else
                toast.error("Tracking Number is required for this logistic service")
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
                        <div className={value + 1 === 2 ? "col-3" : "col-2"}></div>
                        <div className="col-3">  <Typography style={TitleStyle} > Product Variation</Typography></div>
                        <div className="col-2">  <Typography style={TitleStyle} > Order Details</Typography></div>
                        {
                            value + 1 > 2 && <div className="col-4">  <Typography style={TitleStyle} > Shipping Details</Typography></div>
                        }
                    </div>
                    <hr />
                    {
                        data.orderDetails.map((details, subindex) => {
                            return (
                                <div className="row" >
                                    {value + 1 === 2 &&
                                        <div className="col-1">
                                            {
                                                details.TrackingNumber === null || details.TrackingNumber === undefined || details.TrackingNumber === "-" ?
                                                    <Checkbox color="primary"
                                                        checked={details.isCheckBoxSelected}
                                                        onClick={() => setCheckBoxListing(data, index, details, subindex, 2)} />
                                                    : ""
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
                                        <div style={{ fontSize: "11px" }}>  Merchant : {details.ShopName} </div>
                                    </div>
                                    <div className="col-2" >
                                        <div >  </div>
                                        <div style={{ fontSize: "11px", fontWeight: "bold" }}>  Total Order Quantity : {details.ProductQuantity} </div>
                                        <div style={{ fontSize: "11px" }}>  Total Price : RM {(details.ProductQuantity * details.ProductVariationPrice).toFixed(2)}  </div>
                                    </div>
                                    <div className="col-4">
                                        {
                                            details.TrackingNumber !== "-" && details.TrackingNumber !== undefined &&
                                            <div className="row">
                                                <div className="col-5">
                                                    <div >  </div>
                                                    <div style={{ fontSize: "11px", fontWeight: "bold" }}>  {checkLogistic(details.LogisticID)} </div>
                                                    <div style={{ fontSize: "11px", fontWeight: "bold" }}>  {details.TrackingNumber}  </div>
                                                </div>
                                                {
                                                    details.PDFLabel !== "" && details.PDFLabel !== undefined && details.TrackingNumber !== null && details.TrackingNumber !== undefined && details.TrackingNumber !== "-" &&
                                                    <div className="col-7">
                                                        <div className="row" >
                                                            <div className="col">
                                                                <Button style={{ fontSize: "11px" }} color="primary" onClick={() =>
                                                                    previewCosignment(details.PDFLabel)
                                                                }>Reprint</Button>
                                                            </div>
                                                            <div className="col">
                                                                <Button style={{ fontSize: "11px" }} color="primary" onClick={() =>
                                                                    <>
                                                                        {
                                                                            dispatch(GitAction.CallOrderRequestShipmentStatus({
                                                                                TRACKINGNUMBER: details.TrackingNumber,
                                                                                TYPE: "true",
                                                                                PROJECTID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID
                                                                            }))
                                                                        }
                                                                        {setViewClick(true)}
                                                                    </>
                                                                }>Tracking</Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        }
                                    </div>
                                    <hr />
                                    <AlertDialog
                                        open={isViewTracking}
                                        fullWidth
                                        maxWidth="md"
                                        handleToggleDialog={() => {
                                            setViewTracking(false)
                                            setViewClick(false)
                                        }}
                                        title="Tracking Status"
                                        showAction={false}
                                    >
                                        <div className="container-fluid">
                                            <div className="container">
                                                {isArrayNotEmpty(orderShipmentStatus) ?
                                                    <>
                                                        {isArrayNotEmpty(orderShipmentStatus.trackHeader) &&
                                                            <Typography style={{ fontSize: "11px", fontWeight: "bold" }}>Tracking Number :{orderShipmentStatus.trackHeader[0].hawb}</Typography>
                                                        }
                                                        <hr />
                                                        {
                                                            isArrayNotEmpty(orderShipmentStatus.trackDetails) &&
                                                            <div className="row">
                                                                <Typography style={{ fontSize: "11px", fontWeight: "bold" }}>Parcel Status</Typography>
                                                                <Typography>Shiping Status : {orderShipmentStatus.trackDetails[0].status}</Typography>
                                                                <Typography>Latest Location : {orderShipmentStatus.trackDetails[0].location}</Typography>
                                                                <Typography>Latest Update Time : {orderShipmentStatus.trackDetails[0].detTime}</Typography>
                                                                <Typography>Latest Update Date : {orderShipmentStatus.trackDetails[0].detDate}</Typography>
                                                            </div>
                                                        }
                                                        <hr />
                                                        {
                                                            isArrayNotEmpty(orderShipmentStatus.trackHeader) &&
                                                            <div className="row">
                                                                <Typography style={{ fontSize: "11px", fontWeight: "bold" }}>Parcel Details</Typography>
                                                                <Typography>Parcel Origin : {orderShipmentStatus.trackHeader[0].status}</Typography>
                                                                <Typography>Parcel Destination : {orderShipmentStatus.trackHeader[0].location}</Typography>
                                                                <Typography>Parcel Weight : {orderShipmentStatus.trackHeader[0].t_weight} kg</Typography>
                                                                <Typography>Parcel Dimension : {orderShipmentStatus.trackHeader[0].vw_height + "cm(H) * " + orderShipmentStatus.trackHeader[0].vw_length + "cm(L) * " + orderShipmentStatus.trackHeader[0].vw_width + "cm(W)"}</Typography>
                                                            </div>
                                                        }
                                                    </>
                                                    :
                                                    <Typography>There is an error while retrieving Order Tracking Status</Typography>
                                                }
                                            </div>
                                        </div>
                                    </AlertDialog >
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
                                                let newArr = OrderListing
                                                let selectedIndex = getIndex(newArr, data)
                                                newArr[selectedIndex].logisticID = e.target.value
                                                newArr[selectedIndex].parcelQuantity = newArr[selectedIndex].parcelQuantity !== undefined ? newArr[selectedIndex].parcelQuantity : 1
                                                newArr[selectedIndex].isParcelQuantityError = false
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
                                                                let newArr = OrderListing
                                                                let selectedIndex = getIndex(newArr, data)
                                                                newArr[selectedIndex].parcelQuantity = e.target.value
                                                                newArr[selectedIndex].isParcelQuantityError = e.target.value <= 0 || e.target.value == "" ? true : false
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
                                                            onChange={(e) => {
                                                                let newArr = OrderListing
                                                                let selectedIndex = getIndex(newArr, data)
                                                                newArr[selectedIndex].trackingNumber = e.target.value
                                                                newArr[selectedIndex].isTrackingNumberError = e.target.value === "" ? true : false
                                                                setOrderListing([...newArr]);
                                                            }}
                                                            required
                                                        />
                                                    </FormControl>
                                                    {data.isTrackingNumberError && <FormHelperText style={{ color: "red" }}>Insert Tracking Number</FormHelperText>}
                                                </div>
                                                <div className="col" style={{ paddingTop: "20px", textAlign: "right" }} onClick={() => handleSubmitTracking(index, data)}>
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
                                                        let newArr = OrderListing
                                                        let selectedIndex = getIndex(newArr, data)
                                                        newArr[selectedIndex].parcelWeight = e.target.value
                                                        newArr[selectedIndex].isParcelWeightError = e.target.value <= 0 || e.target.value == "" ? true : false
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
                                                        let newArr = OrderListing
                                                        let selectedIndex = getIndex(newArr, data)
                                                        newArr[selectedIndex].parcelWidth = e.target.value
                                                        newArr[selectedIndex].isParcelWidthError = e.target.value <= 0 || e.target.value == "" ? true : false
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
                                                        let newArr = OrderListing
                                                        let selectedIndex = getIndex(newArr, data)
                                                        newArr[selectedIndex].parcelHeight = e.target.value
                                                        newArr[selectedIndex].isParcelHeightError = e.target.value <= 0 || e.target.value == "" ? true : false
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
                                                        let newArr = OrderListing
                                                        let selectedIndex = getIndex(newArr, data)
                                                        newArr[selectedIndex].parcelLength = e.target.value
                                                        newArr[selectedIndex].isParcelLengthError = e.target.value <= 0 || e.target.value == "" ? true : false
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
    const checkSelectedMerchant = (listing, MerchantID) => {
        let dataSet = []
        let OverallListing = listing

        if (MerchantID === 0)
            dataSet = OverallListing
        else {
            isArrayNotEmpty(OverallListing) && OverallListing.map((data) => {

                let detailsListing = []
                detailsListing = data.orderDetails !== undefined ? data.orderDetails.filter((x) => x.MerchantID === MerchantID) : []

                if (detailsListing.length > 0) {

                    // data.map((x) => {
                    data.OrderID === 2008 && data.OrderProductDetail !== undefined && JSON.parse(data.OrderProductDetail).map((y) => {
            
                    })
                    // })

                    // dataSet.push(data)
                    dataSet = [...dataSet, data]
                    dataSet.map((y, index) => {
                        if (y.OrderID === data.OrderID) {
                            dataSet[index].orderDetails = detailsListing
                        }
                    })
                }
            })

            dataSet = isArrayNotEmpty(dataSet) ? dataSet.filter((ele, ind) => ind === dataSet.findIndex(elem => parseInt(elem.OrderID) === parseInt(ele.OrderID))) : []
        }
        return dataSet
    }
    const OrderLayout = (Listing) => {
        return (
            <>
                <TableContainer component={Paper} style={{ overflow: "hidden" }}>
                    {isOrderSelected && senderInformationLayout()}
                    <Table aria-label="collapsible table" size="small">
                        {isShipmentSubmit === true && <LoadingPanel />}
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
                                                                                    value + 1 === 2 &&
                                                                                    <div className="col" style={{ textAlign: "right" }}>
                                                                                        <Button color="primary" onClick={() => {
                                                                                            let newArr = OrderListing
                                                                                            let selectedIndex = getIndex(newArr, data)
                                                                                            newArr[selectedIndex].isEdit = newArr[selectedIndex].isEdit === undefined ? true : !newArr[selectedIndex].isEdit
                                                                                            setOrderListing([...newArr])
                                                                                        }}>{OrderListing[getIndex(OrderListing, data)].isEdit === true ? "CANCEL" : "EDIT"}</Button>
                                                                                    </div>
                                                                                }
                                                                            </div>
                                                                            {
                                                                                OrderListing[getIndex(OrderListing, data)].isEdit === true ?
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
                                                                                                            let newArr = OrderListing
                                                                                                            let selectedIndex = getIndex(newArr, data)
                                                                                                            newArr[selectedIndex].UserFullName = e.target.value
                                                                                                            newArr[selectedIndex].isUserFullNameError = e.target.value === "" ? true : false
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
                                                                                                            let newArr = OrderListing
                                                                                                            let selectedIndex = getIndex(newArr, data)
                                                                                                            newArr[selectedIndex].UserContactNo = e.target.value
                                                                                                            newArr[selectedIndex].isUserContactNoError = e.target.value === "" ? true : false
                                                                                                            setOrderListing([...newArr]);
                                                                                                        }}
                                                                                                        required
                                                                                                    />
                                                                                                </FormControl>
                                                                                            </div>
                                                                                            <div className="col-xl-4 col-lg-4 col-md-4  col-s-6 col-xs-6">
                                                                                                <InputLabel shrink htmlFor="bootstrap-input" style={{ fontSize: "12pt", paddingLeft: value + 1 === 2 ? "0px" : "15px" }}>Delivery Method</InputLabel>
                                                                                                <FormControl fullWidth size="small" variant="outlined">

                                                                                                    <Select
                                                                                                        id={"outlined-adornment-Method-" + index} label=""
                                                                                                        value={data.PickUpInd}
                                                                                                        onChange={(e) => {
                                                                                                            let newArr = OrderListing
                                                                                                            let selectedIndex = getIndex(newArr, data)
                                                                                                            newArr[selectedIndex].PickUpInd = e.target.value
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
                                                                                                            let newArr = OrderListing
                                                                                                            let selectedIndex = getIndex(newArr, data)
                                                                                                            newArr[selectedIndex].UserAddressLine1 = e.target.value
                                                                                                            newArr[selectedIndex].isUserAddressLine1Error = e.target.value === "" ? true : false
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
                                                                                                            let newArr = OrderListing
                                                                                                            let selectedIndex = getIndex(newArr, data)
                                                                                                            newArr[selectedIndex].UserAddressLine2 = e.target.value
                                                                                                            newArr[selectedIndex].isUserAddressLine2Error = e.target.value === "" ? true : false
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
                                                                                                            let newArr = OrderListing
                                                                                                            let selectedIndex = getIndex(newArr, data)
                                                                                                            newArr[selectedIndex].UserCity = e.target.value
                                                                                                            newArr[selectedIndex].isUserCityError = e.target.value === "" ? true : false
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
                                                                                                            let newArr = OrderListing
                                                                                                            let selectedIndex = getIndex(newArr, data)
                                                                                                            newArr[selectedIndex].UserPoscode = e.target.value
                                                                                                            newArr[selectedIndex].isUserPoscodeError = e.target.value === "" ? true : false
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
                                                                                                            let newArr = OrderListing
                                                                                                            let selectedIndex = getIndex(newArr, data)
                                                                                                            newArr[selectedIndex].UserState = e.target.value
                                                                                                            newArr[selectedIndex].isUserStateError = e.target.value === "" ? true : false
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
                                                                                                            let newArr = OrderListing
                                                                                                            let selectedIndex = getIndex(newArr, data)
                                                                                                            newArr[selectedIndex].CountryID = e.target.value
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

    const searchSpace = (value) => {

        setFilteredListing([])

        let DataSet = OrderListing
        let filterListing = []

        isArrayNotEmpty(DataSet) && DataSet.filter((searchedItem) =>
            searchedItem.OrderName !== null && searchedItem.OrderName.toLowerCase().includes(
                value.toLowerCase()
            )
        ).map((filteredItem) => {
            filterListing.push(filteredItem)
        })

        isArrayNotEmpty(DataSet) && DataSet.map((x) => {
            isArrayNotEmpty(x.orderDetails) && x.orderDetails.filter((y) => y.TrackingNumber !== null && y.TrackingNumber.toLowerCase().includes(value.toLowerCase())).map((z) => {
                filterListing.push(x)
            })
        })
        let removeDuplicate = filterListing.length > 0 ? filterListing.filter((ele, ind) => ind === filterListing.findIndex(elem => elem.OrderID === ele.OrderID)) : []
        setFilteredListing(removeDuplicate)
    }

    return (
        <div style={{ width: "100%" }}>
            <div className="row" >
                <div className={JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID === 1 ? "col-10" : "col-12"}>
                    <SearchBar
                        id=""
                        placeholder="Enter Order ID or parcel tracking number to search"
                        buttonOnClick={() => searchSpace(searchkeyword)}
                        onChange={(e) => {
                            if (e.target.value === "") {
                                setSearchKeyword(e.target.value)
                                setFilteredListing([])
                            }
                            else
                                setSearchKeyword(e.target.value)
                        }}
                        className="searchbar-input mb-auto"
                        tooltipText="Search with current data"
                        value={searchkeyword}
                    />
                </div>
                {
                    JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID === 1 &&
                    <div className="col-2">
                        <FormControl fullWidth size="small" variant="outlined">
                            <InputLabel id="demo-simple-select-label">Merchant Shop</InputLabel>
                            <Select
                                id={"outlined-adornment-merchant"}
                                value={selectedMerchant}
                                onChange={(e) => { setSelectedMerchant(e.target.value) }}
                                size="small"
                                label="Merchant Shop"
                                placeholder="Merchant Shop"
                                className="select"
                            >
                                <MenuItem value={0}>All Merchant Shop</MenuItem>
                                {
                                    currentUser.filter(x => x.UserTypeID < 17)
                                        .map((data, i) => {
                                            return (
                                                <MenuItem value={data.UserID}>{data.ShopName}</MenuItem>
                                            )
                                        })
                                }
                            </Select>
                        </FormControl>
                    </div>
                }
            </div>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    {
                        isArrayNotEmpty(transactionStatus) && transactionStatus.map((x, index) => {

                            const orderLength = () => {
                                let listing = ""
                                let DataSet = isArrayNotEmpty(filteredListing) ? filteredListing : OrderListing
                                if (isArrayNotEmpty(DataSet)) {
                                    let listingLength = checkSelectedMerchant(DataSet.filter((y) => y.TrackingStatusID == x.TrackingStatusID), selectedMerchant).length
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
                JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID === 1 ?
                    isArrayNotEmpty(transactionStatus) && transactionStatus.map((x, statusIndex) => {
                        return (<TabPanel value={value} index={statusIndex}> {
                            OrderLayout(
                                isArrayNotEmpty(filteredListing) ?
                                    checkSelectedMerchant(filteredListing.filter((y) => y.TrackingStatusID === x.TrackingStatusID), selectedMerchant)
                                    :
                                    isArrayNotEmpty(OrderListing) ?
                                        checkSelectedMerchant(OrderListing.filter((y) => y.TrackingStatusID === x.TrackingStatusID), selectedMerchant)
                                        : [])
                        } </TabPanel>)
                    })

                    :
                    isArrayNotEmpty(transactionStatus) && transactionStatus.map((x, statusIndex) => {
                        return (<TabPanel value={value} index={statusIndex}> {
                            OrderLayout(
                                isArrayNotEmpty(filteredListing) ?
                                    checkSelectedMerchant(filteredListing.filter((y) => y.TrackingStatusID === x.TrackingStatusID), JSON.parse(localStorage.getItem("loginUser"))[0].UserID)
                                    :
                                    isArrayNotEmpty(OrderListing) ?
                                        checkSelectedMerchant(OrderListing.filter((y) => y.TrackingStatusID === x.TrackingStatusID), JSON.parse(localStorage.getItem("loginUser"))[0].UserID)
                                        : [])
                        } </TabPanel>)
                    })
            }
        </div>
    );
}

