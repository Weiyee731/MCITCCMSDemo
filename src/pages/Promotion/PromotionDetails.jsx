import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { GitAction } from "../../store/action/gitAction";
import { ArrowRoundedLeft8x13Svg } from '../../assets/svg';
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { isArrayNotEmpty, isStringNullOrEmpty } from "../../tools/Helpers"
import { Typography, Card, CardContent, CardHeader, OutlinedInput, InputAdornment, FormHelperText, MenuItem, FormControl, Box, InputLabel, Select, TextField, IconButton } from "@mui/material";
import AlertDialog from "../../components/ModalComponent/ModalComponent";
import SearchBar from "../../components/SearchBar/SearchBar"
import Logo from "../../assets/logos/logo.png";
import TableComponents from "../../components/TableComponents/TableComponents";
import Checkbox from '@mui/material/Checkbox';
import DeleteIcon from '@mui/icons-material/Delete';
import Switch from '@mui/material/Switch';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControlLabel } from '@mui/material';
import { toast } from "react-toastify";

export const PromotionDetails = (props) => {
    const { products, } = useSelector(state => ({
        products: state.counterReducer.products
    }));

    const dispatch = useDispatch()
    const TitleStyle = { fontWeight: "bold", fontSize: "14pt" }
    const SubtitleStyle = { fontSize: "12pt", color: "gray" }
    const LabelStyle = { fontSize: "13pt" }
    const [promotionName, setPromotionName] = useState("")
    const [selectionRange, handleselectionRange] = useState({
        startDate: "",
        endDate: "",
        isDateError: false,
    })
    const [isModalOpen, setModalOpen] = useState(false)
    const [promotionID, setPromotionID] = useState("")
    const [isActive, setActive] = useState(true)
    const [isPromotionEdit, setPromotionEdit] = useState(false)
    const [searchKeywords, setSearchKeywords] = useState("")
    const [filteredListing, setFilteredListing] = useState([])
    const [selectedList, setSelectedList] = useState([])
    const [confirmList, setConfirmList] = useState([])
    const [localPromotion, setLocalPromotion] = useState([])
    const [selectedConfirmList, setSelectedConfirmList] = useState([])
    const [batchData, setBatchData] = useState({
        discountPercent: "",
        isDiscountError: false,
        stockLimitType: "No Limit",
        stockLimitQty: "",
        isStockLimitQtyError: false,
        purchaseLimitType: "No Limit",
        purchaseLimit: "",
        isPurchaseLimitError: false,
    })
    const [errorData, setErrorData] = useState({
        nameError: [],
        dateError: [],
        purchaseError: [],
        discountError: [],
        stockError: [],
    })


    useEffect(() => {
        let pathname = window.location.pathname
        if (pathname !== undefined) {
            let pathlength = pathname.split("/").length
            let pathId = pathname.split("/")[pathlength - 1]
            if (pathId != 0) {
                setPromotionID(pathId)
            }
        }

        dispatch(GitAction.CallAllProducts({
            type: "Merchant",
            typeValue: '0',
            userId: JSON.parse(localStorage.getItem("loginUser"))[0].UserID,
            productPage: '999',
            page: '1',
            ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID,
        }))
    }, [])

    useEffect(() => {
        if (promotionID !== "") {
            if (localStorage.getItem("promotionList") !== null && isPromotionEdit === false) {
                JSON.parse(localStorage.getItem("promotionList")).filter((x) => x.PromotionId == promotionID).map((details) => {
                    setPromotionName(details.PromotionName)
                    handleselectionRange({
                        startDate: details.PromotionStartDate,
                        endDate: details.PromotionEndDate,
                        isDateError: false
                    })
                    setConfirmList(details.PromotionDetails)
                    setSelectedList(details.PromotionDetails)
                    setActive(details.isActive !== undefined ? details.isActive : true)
                    setPromotionEdit(true)
                })
            }

            let localData = []
            if (localStorage.getItem("promotionList") !== undefined && localStorage.getItem("promotionList") !== null) {
                if (isArrayNotEmpty(JSON.parse(localStorage.getItem("promotionList"))))
                    localData = JSON.parse(localStorage.getItem("promotionList"))
                else
                    localData.push(JSON.parse(localStorage.getItem("promotionList")))
            }

        }
    }, [products])

    const tableHeadCells = [
        {
            id: "ProductName",
            align: 'left',
            disablePadding: false,
            label: "Product Name",
        },
        {
            id: "ProductSold",
            align: 'left',
            disablePadding: false,
            label: "Product Sold ",
        },
        {
            id: "ProductPrice",
            align: 'left',
            disablePadding: false,
            label: "Price Sold (RM)",
        },
        {
            id: "ProductStockAmount",
            align: 'left',
            disablePadding: false,
            label: "Product Stock",
        },
    ];

    const confirmListHeadCells = [
        {
            id: "ProductName",
            align: 'center',
            width: "20%",
            disablePadding: false,
            label: "Product Name",
        },
        {
            id: "ProductPrice",
            align: 'center',
            width: "8%",
            disablePadding: false,
            label: "Original Price (RM)",
        },
        {
            id: "Discount",
            align: 'center',
            width: "20%",
            disablePadding: false,
            label: "Discount",
        },
        {
            id: "ProductStockAmount",
            align: 'center',
            width: "7%",
            disablePadding: false,
            label: "Available Stock",
        },
        {
            id: "PromotionStock",
            align: 'center',
            width: "15%",
            disablePadding: false,
            label: "Promotion Stock",
        },
        {
            id: "PurchaseLimit",
            align: 'center',
            width: "15%",
            disablePadding: false,
            label: "Purchase Limit",
        },
        {
            id: "Enabled",
            align: 'center',
            width: "5%",
            disablePadding: false,
            label: "Enable/Disabled",
        },
        {
            id: "Action",
            align: 'center',
            width: "5%",
            disablePadding: false,
            label: "Action",
        },
    ];

    const searchSpace = (data) => {
        setSearchKeywords(data)
        let filteredListing = []

        let DataSet = JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID === 1 ? products :
            JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID === 16 && products !== undefined ? products.filter((x) => parseInt(x.MerchantID) === parseInt(localStorage.getItem("loginUser")[0].UserID)) : []

        DataSet.length > 0 && DataSet.filter((searchedItem) =>
            searchedItem.ProductName !== null && searchedItem.ProductName.toLowerCase().includes(
                data.toLowerCase()
            )
        ).map((filteredItem) => {
            filteredListing.push(filteredItem);
        })
        setFilteredListing(filteredListing)

    }


    const addConfirmList = (dataList) => {
        let listing = []
        let filteredList = dataList

        if (confirmList.length > 0) {
            confirmList.map((y) => {
                filteredList = filteredList.filter((x) => x.ProductID != y.ProductID)
            })

            filteredList.length > 0 && filteredList.map((x) => {
                let detailListing = []
                x.ProductVariation !== undefined && JSON.parse(x.ProductVariation).map((data) => {
                    detailListing = [...detailListing, {
                        ...data,
                        discountPercent: "",
                        isDiscountError: false,
                        discountPrice: "",
                        stockLimitType: "No Limit",
                        stockLimitQty: "",
                        isStockLimitError: false,
                        isEnable: true
                    }]
                })

                setConfirmList(listing => [...listing, {
                    ...x,
                    purchaseLimitType: "No Limit",
                    purchaseLimit: "",
                    isPurchaseLimitError: false,
                    detailListing
                }]);
            })
            setModalOpen(false)
        }
        else {
            dataList.length > 0 && dataList.map((x) => {
                let detailListing = []
                x.ProductVariation !== undefined && JSON.parse(x.ProductVariation).map((data) => {
                    detailListing = [...detailListing, {
                        ...data,
                        discountPercent: "",
                        discountPrice: "",
                        isDiscountError: false,
                        stockLimitType: "No Limit",
                        stockLimitQty: "",
                        isStockLimitError: false,
                        isEnable: true
                    }]
                })

                listing.push({
                    ...x,
                    purchaseLimitType: "No Limit",
                    purchaseLimit: "",
                    isPurchaseLimitError: false,
                    detailListing

                })
            })
            setConfirmList(listing)
            setModalOpen(false)
        }
    }

    const checkExisting = (listing, data) => {
        let confirmListing = listing
        let existing = false
        if (confirmListing.length > 0 && confirmListing.filter((x) => x.ProductID == data.ProductID).length > 0)
            existing = true
        return existing
    }

    const setCheckBoxListing = (event, data, type) => {
        let listing = type === "CONFIRMLIST" ? selectedConfirmList : selectedList
        if (listing.length > 0) {
            if (listing.filter((x) => x.ProductID === data.ProductID).length > 0) {
                listing = listing.filter((x) => x.ProductID != data.ProductID)
                if (type === "CONFIRMLIST")
                    setSelectedConfirmList(listing)
                else
                    setSelectedList(listing)

            } else {
                if (type === "CONFIRMLIST")
                    setSelectedConfirmList(listing => [...listing, data]);
                else
                    setSelectedList(listing => [...listing, data]);
            }
        } else {
            if (type === "CONFIRMLIST")
                setSelectedConfirmList(listing => [...listing, data]);
            else
                setSelectedList(listing => [...listing, data]);
        }


    }

    const filterConfirmList = () => {
        let listing = confirmList
        let filteredListing = []

        if (products.length > 0) {
            listing.length > 0 && listing.map((y) => {
                products.filter((x) => x.ProductID === y.ProductID).map((data) => {
                    filteredListing.push(data)
                })
            })
        }
        setSelectedList(filteredListing)
    }

    const deleteConfirmList = (deleteData) => {
        let listing = confirmList
        if (listing.length > 0) {
            if (deleteData.length > 0)
                deleteData.map((y) => {
                    listing = listing.filter((x) => x.ProductID != y.ProductID)
                })
            else
                listing = listing.filter((x) => x.ProductID != deleteData.ProductID)

        }
        setConfirmList(listing)
        setSelectedList(listing)
    }

    const updateALLConfirmList = () => {
        let newArr = confirmList

        if (batchData.isDiscountError || batchData.isStockLimitQtyError || batchData.isPurchaseLimitError)
            toast.warning("Insert only positive value data")
        else {
            if (selectedConfirmList.length > 0) {
                selectedConfirmList.map((y) => {
                    confirmList.map((data, index) => {
                        if (data.ProductID === y.ProductID) {
                            isArrayNotEmpty(data.detailListing) && data.detailListing.map((x, detailIndex) => {
                                newArr[index].detailListing[detailIndex].discountPercent = batchData.discountPercent
                                newArr[index].detailListing[detailIndex].discountPrice = parseFloat(x.ProductVariationPrice * (batchData.discountPercent / 100)).toFixed(2)
                                newArr[index].detailListing[detailIndex].stockLimitType = batchData.stockLimitType
                                newArr[index].detailListing[detailIndex].stockLimitQty = batchData.stockLimitQty
                            })
                            newArr[index].purchaseLimitType = batchData.purchaseLimitType
                            newArr[index].purchaseLimit = batchData.purchaseLimit
                        }
                    })
                })
                setConfirmList([...newArr]);
            } else {
                confirmList.map((data, index) => {
                    isArrayNotEmpty(data.detailListing) && data.detailListing.map((x, detailIndex) => {
                        newArr[index].detailListing[detailIndex].discountPercent = batchData.discountPercent
                        newArr[index].detailListing[detailIndex].discountPrice = parseFloat(x.ProductVariationPrice * (batchData.discountPercent / 100)).toFixed(2)
                        newArr[index].detailListing[detailIndex].stockLimitType = batchData.stockLimitType
                        newArr[index].detailListing[detailIndex].stockLimitQty = batchData.stockLimitQty
                    })
                    newArr[index].purchaseLimitType = batchData.purchaseLimitType
                    newArr[index].purchaseLimit = batchData.purchaseLimit
                })
                setConfirmList([...newArr]);
            }
        }
    }

    const verifySubmitData = () => {
        let isError = {
            nameError: [],
            dateError: [],
            purchaseError: [],
            discountError: [],
            stockError: [],
        }

        if (isArrayNotEmpty(confirmList)) {
            confirmList.map((data, index) => {
                if (data.purchaseLimitType !== "No Limit" && data.purchaseLimit === "" && data.purchaseLimit < 0)
                    isError.purchaseError.push(index)

                isArrayNotEmpty(data.detailListing) && data.detailListing.map((details, detailsIndex) => {
                    if (details.isEnable === true) {
                        if (details.discountPercent === "" || details.discountPercent < 0)
                            isError.discountError.push({
                                listingIndex: index,
                                detailsIndex: detailsIndex
                            })

                        if (details.stockLimitType !== "No Limit" && details.stockLimitQty === "" && details.stockLimitQty > 0)
                            isError.stockError.push({
                                listingIndex: index,
                                detailsIndex: detailsIndex
                            })
                    }
                })
            })
        }

        if (promotionName === "")
            isError.nameError.push(true)

        if (selectionRange.startDate == "" || selectionRange.endDate == "" || selectionRange.isDateError == true)
            isError.dateError.push(true)

        if (!isArrayNotEmpty(isError.nameError) && !isArrayNotEmpty(isError.dateError) && !isArrayNotEmpty(isError.purchaseError) && !isArrayNotEmpty(isError.discountError) && !isArrayNotEmpty(isError.stockError)) {
            let localData = []
            if (localStorage.getItem("promotionList") !== undefined && localStorage.getItem("promotionList") !== null) {
                if (isArrayNotEmpty(JSON.parse(localStorage.getItem("promotionList"))))
                    localData = JSON.parse(localStorage.getItem("promotionList"))
                else
                    localData.push(JSON.parse(localStorage.getItem("promotionList")))
            }

            if (promotionID !== "") {
                localData.length > 0 && localData.map((detailData, index) => {
                    if (detailData.PromotionId == promotionID) {
                        localData[index].PromotionName = promotionName
                        localData[index].PromotionStartDate = selectionRange.startDate
                        localData[index].PromotionEndDate = selectionRange.endDate
                        localData[index].PromotionDetails = confirmList
                        localData[index].isActive = isActive
                    }
                })
            } else {
                let propsData = {
                    PromotionId: localData.length + 1,
                    PromotionName: promotionName,
                    PromotionStartDate: selectionRange.startDate,
                    PromotionEndDate: selectionRange.endDate,
                    PromotionDetails: confirmList,
                    isActive: isActive
                }
                localData.push(propsData)
            }
            localStorage.setItem("promotionList", JSON.stringify(localData));
            window.location.href = "/PromotionListing"
            window.reload("false")
        } else
            toast.warning("Valid Promotion Data is required")

        setErrorData(isError)
    }

    const renderTableRows = (data, index) => {
        if (data !== undefined) {
            return (
                <>
                    <TableCell align="left" style={{ opacity: checkExisting(confirmList, data) ? "0.5" : "1.0" }}>
                        <div className="row">
                            <div className="col-1">
                                <Checkbox
                                    disabled={checkExisting(confirmList, data)}
                                    checked={checkExisting(selectedList, data)}
                                    onClick={(event) => setCheckBoxListing(event, data, "SELECTLIST")}
                                />
                            </div>
                            <div className="col-2">
                                <img height={50}
                                    alt={data.ProductImage}
                                    src={
                                        data.ProductImage
                                            ? data.ProductImage
                                            : ""
                                    }
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = Logo;
                                    }}
                                />
                            </div>
                            <div className="col-9">
                                {data.ProductName}
                            </div>
                        </div>
                    </TableCell>
                    <TableCell align="left" style={{ opacity: checkExisting(confirmList, data) ? "0.5" : "1.0" }}>{data.ProductSold}</TableCell>
                    <TableCell align="left" style={{ opacity: checkExisting(confirmList, data) ? "0.5" : "1.0" }}>{data.ProductStockAmount}</TableCell>
                    <TableCell align="left" style={{ opacity: checkExisting(confirmList, data) ? "0.5" : "1.0" }}> {data.ProductPrice} </TableCell>
                </>
            )
        }
    }

    const renderBatchSetting = () => {
        return (
            <Card style={{ marginTop: "10px" }} >
                <CardContent>
                    <Typography style={TitleStyle}>Batch Setting</Typography>
                    <div className="row">
                        <div className="col-8">
                            <div className="row">
                                <div className="col">
                                    <InputLabel shrink htmlFor="bootstrap-input">Discount</InputLabel>
                                    <FormControl size="small" variant="outlined">
                                        <OutlinedInput
                                            id="outlined-adornment-discountPercent"
                                            label=""
                                            value={batchData.discountPercent}
                                            type="number"
                                            onChange={(e) => setBatchData({
                                                ...batchData,
                                                discountPercent: e.target.value,
                                                isDiscountError: e.target.value !== "" && e.target.value > 0 ? false : true
                                            })}
                                            endAdornment={<InputAdornment position="end">% OFF</InputAdornment>}
                                            inputProps={{
                                                'aria-label': 'discountPercent',
                                                'inputProps': "min: 0"
                                            }}

                                        />
                                    </FormControl>
                                    {batchData.isDiscountError && <FormHelperText style={{ color: "red" }}>Insert value discount data</FormHelperText>}
                                </div>
                                <div className="col">
                                    <InputLabel shrink htmlFor="bootstrap-input">Stock Limit Type</InputLabel>
                                    <FormControl fullWidth size="small" variant="outlined">
                                        <Select
                                            labelId="demo-simple-select-stockLimitType"
                                            id="demo-simple-select"
                                            value={batchData.stockLimitType}
                                            onChange={(e) => setBatchData({
                                                ...batchData,
                                                stockLimitType: e.target.value
                                            })}
                                        >
                                            <MenuItem value={"No Limit"}>No Limit</MenuItem>
                                            <MenuItem value={"Set Limit"}>Set Limit</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                {
                                    batchData.stockLimitType === "Set Limit" &&
                                    <div className="col">
                                        <InputLabel shrink htmlFor="bootstrap-input">Limit Quantity</InputLabel>
                                        <FormControl size="small" variant="outlined">
                                            <OutlinedInput
                                                id="outlined-adornment-stockLimit"
                                                label=""
                                                type="number"
                                                value={batchData.stockLimitQty}
                                                onChange={(e) => setBatchData({
                                                    ...batchData,
                                                    stockLimitQty: e.target.value,
                                                    isStockLimitQtyError: e.target.value !== "" && e.target.value > 0 ? false : true
                                                })}
                                            />
                                        </FormControl>
                                        {batchData.isStockLimitQtyError && <FormHelperText style={{ color: "red" }}>Insert value stock limit</FormHelperText>}
                                    </div>
                                }
                                <div className="col">
                                    <InputLabel shrink htmlFor="bootstrap-input">Purchase Limit</InputLabel>
                                    <FormControl fullWidth size="small" variant="outlined">
                                        <Select
                                            labelId="demo-simple-select-purchaseLimitType"
                                            id="demo-simple-select"
                                            value={batchData.purchaseLimitType}
                                            onChange={(e) => setBatchData({
                                                ...batchData,
                                                purchaseLimitType: e.target.value
                                            })}
                                        >
                                            <MenuItem value={"No Limit"}>No Limit</MenuItem>
                                            <MenuItem value={"Set Limit"}>Set Limit</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                {
                                    batchData.purchaseLimitType === "Set Limit" &&
                                    <div className="col">
                                        <InputLabel shrink htmlFor="bootstrap-input">Limit Quantity</InputLabel>
                                        <FormControl size="small" variant="outlined">
                                            <OutlinedInput
                                                id="outlined-adornment-purchaseLimit"
                                                label=""
                                                value={batchData.purchaseLimit}
                                                type="number"
                                                onChange={(e) =>
                                                    setBatchData({
                                                        ...batchData,
                                                        purchaseLimit: e.target.value,
                                                        isPurchaseLimitError: e.target.value !== "" && e.target.value > 0 ? false : true
                                                    })}
                                            />
                                        </FormControl>
                                        {batchData.isPurchaseLimitError && <FormHelperText style={{ color: "red" }}>Insert value purchase limit</FormHelperText>}
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="col-4" style={{ textAlign: "right" }}>
                            <Button variant="contained"
                                style={{ margin: "10px", backgroundColor: "primary" }}
                                onClick={() => updateALLConfirmList()}>
                                {selectedConfirmList.length === 0 ? "Update All" : "Update Selected"}
                            </Button>
                            <Button variant="contained"
                                style={{ backgroundColor: "#C70039" }}
                                onClick={() => selectedConfirmList.length === 0 ? deleteConfirmList(confirmList) : deleteConfirmList(selectedConfirmList)}>
                                {selectedConfirmList.length === 0 ? "Delete All" : "Delete Selected"}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const checkError = (type, index, detailsIndex) => {
        let isError = false
        switch (type) {
            case "purchaseError":
                if (errorData.purchaseError.filter((x) => x == index).length > 0)
                    isError = true
                break;

            case "discountError":
                if (errorData.discountError.filter((x) => x.listingIndex == index && x.detailsIndex == detailsIndex).length > 0)
                    isError = true
                break;

            case "stockError":
                if (errorData.stockError.filter((x) => x.listingIndex == index && x.detailsIndex == detailsIndex).length > 0)
                    isError = true
                break;

            default:
                break;
        }

        return isError
    }

    const renderConfirmListTable = (product) => {
        return (
            <>
                <div style={{ marginBottom: "10px", marginTop: "15px" }}>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                        <TableRow >
                            <TableCell></TableCell>
                            {
                                isArrayNotEmpty(confirmListHeadCells) && confirmListHeadCells.map((headCell) => {
                                    return (
                                        <TableCell
                                            key={headCell.id}
                                            width={headCell.width}
                                            align={isStringNullOrEmpty(headCell.align) ? "left" : headCell.align}
                                            style={{ fontWeight: "bold", fontSize: "12px" }}
                                        >{headCell.label}</TableCell>
                                    )
                                })
                            }
                        </TableRow>
                    </Table>
                </div>

                {
                    isArrayNotEmpty(product) && product.map((data, index) => {
                        return (
                            <Card style={{ marginBottom: "15px" }}>
                                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                                    <TableBody >
                                        <TableRow
                                            hover
                                            tabIndex={-1}
                                            key={"table_row_product_" + index}
                                            style={{ backgroundColor: "#ededed" }}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={checkExisting(selectedConfirmList, data)}
                                                    onClick={(event) => setCheckBoxListing(event, data, "CONFIRMLIST")}
                                                />
                                            </TableCell>
                                            <TableCell align="left" style={{ fontWeight: "bold", fontSize: "13px" }}>
                                                <div className="row">
                                                    <div className="col-1">
                                                        <img height={50}
                                                            alt={data.ProductImage}
                                                            src={
                                                                data.ProductImage
                                                                    ? data.ProductImage
                                                                    : ""
                                                            }
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = Logo;
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="col-10" style={{ alignItems: "center", display: "inline-flex" }}>
                                                        {data.ProductName}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell align="left" width="15%">
                                                <div className="row">
                                                    <div className="col">
                                                        <FormControl fullWidth size="small" variant="outlined">
                                                            <Select
                                                                labelId="demo-simple-select-stockLimitType"
                                                                id="demo-simple-select"
                                                                value={data.purchaseLimitType}
                                                                onChange={(e) => {
                                                                    let newArr = confirmList
                                                                    newArr[index].purchaseLimitType = e.target.value
                                                                    setConfirmList([...newArr]);
                                                                }}
                                                            >
                                                                <MenuItem value={"No Limit"}>No Limit</MenuItem>
                                                                <MenuItem value={"Set Limit"}>Set Limit</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </div>
                                                    {
                                                        data.purchaseLimitType === "Set Limit" &&
                                                        <div className="col">
                                                            <FormControl size="small" variant="outlined">
                                                                <OutlinedInput
                                                                    id="outlined-adornment-stockLimit"
                                                                    label=""
                                                                    type="number"
                                                                    placeholder="Stock Limit"
                                                                    value={data.purchaseLimit}
                                                                    onChange={(e) => {
                                                                        let newArr = confirmList
                                                                        newArr[index].purchaseLimit = e.target.value
                                                                        newArr[index].isPurchaseLimitError = e.target.value !== "" && e.target.value > 0 ? false : true
                                                                        setConfirmList([...newArr]);
                                                                    }}
                                                                />
                                                            </FormControl>
                                                        </div>
                                                    }
                                                    {checkError("purchaseError", index, 0) || confirmList[index].isPurchaseLimitError ? <FormHelperText style={{ color: "red" }}>Valid stock limit is required</FormHelperText> : ""}
                                                </div>
                                            </TableCell>
                                            <TableCell align="left" width="5%"></TableCell>
                                            <TableCell align="left" width="5%"><IconButton><DeleteIcon onClick={() => deleteConfirmList(data)} /></IconButton></TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                                {
                                    isArrayNotEmpty(data.detailListing) && data.detailListing.map((x, detailIndex) => {
                                        return (
                                            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                                                <TableBody>
                                                    <TableCell width="5%"></TableCell>
                                                    <TableCell align="left" width="15%" style={{ fontWeight: "bold", fontSize: "13px" }}> {x.ProductVariationValue} </TableCell>
                                                    <TableCell align="center" width="10%"> {x.ProductVariationPrice} </TableCell>
                                                    <TableCell align="left" width="20%">
                                                        <div className="row">
                                                            <div className="col">
                                                                <FormControl fullWidth size="small" variant="outlined">
                                                                    <OutlinedInput
                                                                        id="outlined-adornment-discountPrice"
                                                                        label=""
                                                                        value={x.discountPrice}
                                                                        disabled={!x.isEnable}
                                                                        type="number"
                                                                        style={{ opacity: x.isEnable ? "100%" : "50%" }}
                                                                        onChange={(e) => {
                                                                            let newArr = confirmList
                                                                            newArr[index].detailListing[detailIndex].discountPrice = e.target.value
                                                                            newArr[index].detailListing[detailIndex].discountPercent = parseFloat((e.target.value / x.ProductVariationPrice) * 100).toFixed(2)
                                                                            newArr[index].detailListing[detailIndex].isDiscountError = e.target.value !== "" && e.target.value > 0 ? false : true
                                                                            setConfirmList([...newArr]);
                                                                        }}
                                                                        startAdornment={<InputAdornment position="start">RM</InputAdornment>}
                                                                        inputProps={{
                                                                            'aria-label': 'discountPrice',
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                            </div>
                                                            <div className="col">
                                                                <FormControl size="small" variant="outlined">
                                                                    <OutlinedInput
                                                                        id="outlined-adornment-discountPercent"
                                                                        label=""
                                                                        value={x.discountPercent}
                                                                        disabled={!x.isEnable}
                                                                        type="number"
                                                                        style={{ opacity: x.isEnable ? "100%" : "50%" }}
                                                                        onChange={(e) => {
                                                                            let newArr = confirmList
                                                                            newArr[index].detailListing[detailIndex].discountPercent = e.target.value
                                                                            newArr[index].detailListing[detailIndex].discountPrice = parseFloat(x.ProductVariationPrice * (e.target.value / 100)).toFixed(2)
                                                                            newArr[index].detailListing[detailIndex].isDiscountError = e.target.value !== "" && e.target.value > 0 ? false : true
                                                                            setConfirmList([...newArr]);
                                                                        }}
                                                                        endAdornment={<InputAdornment position="end">% OFF</InputAdornment>}
                                                                        inputProps={{
                                                                            'aria-label': 'discountPercent',
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                            </div>
                                                            {checkError("discountError", index, detailIndex) || confirmList[index].detailListing[detailIndex].isDiscountError ? <FormHelperText style={{ color: "red" }}>Valid discount is required</FormHelperText> : ""}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell align="left" width="5%"> {x.ProductStockAmount} </TableCell>
                                                    <TableCell align="left" width="15%">
                                                        <div className="row">
                                                            <div className="col">
                                                                <FormControl fullWidth size="small" variant="outlined">
                                                                    <Select
                                                                        labelId="demo-simple-select-stockLimitType"
                                                                        id="demo-simple-select"
                                                                        value={x.stockLimitType}
                                                                        disabled={!x.isEnable}
                                                                        style={{ opacity: x.isEnable ? "100%" : "50%" }}
                                                                        onChange={(e) => {
                                                                            let newArr = confirmList
                                                                            newArr[index].detailListing[detailIndex].stockLimitType = e.target.value
                                                                            setConfirmList([...newArr]);
                                                                        }}
                                                                    >
                                                                        <MenuItem value={"No Limit"}>No Limit</MenuItem>
                                                                        <MenuItem value={"Set Limit"}>Set Limit</MenuItem>
                                                                    </Select>
                                                                </FormControl>
                                                            </div>
                                                            {
                                                                x.stockLimitType === "Set Limit" &&
                                                                <div className="col">
                                                                    <FormControl size="small" variant="outlined">
                                                                        <OutlinedInput
                                                                            id="outlined-adornment-stockLimit"
                                                                            label=""
                                                                            type="number"
                                                                            placeholder="Stock Limit"
                                                                            value={x.stockLimitQty}
                                                                            style={{ opacity: x.isEnable ? "100%" : "50%" }}
                                                                            disabled={!x.isEnable}
                                                                            onChange={(e) => {
                                                                                let newArr = confirmList
                                                                                newArr[index].detailListing[detailIndex].stockLimitQty = e.target.value
                                                                                newArr[index].detailListing[detailIndex].isStockLimitError = e.target.value !== "" && e.target.value > 0 ? false : true
                                                                                setConfirmList([...newArr]);
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                </div>
                                                            }
                                                            {checkError("stockError", index, detailIndex) || confirmList[index].detailListing[detailIndex].isStockLimitError ? <FormHelperText style={{ color: "red" }}>Valid Stock Limit is required</FormHelperText> : ""}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell width="15%"></TableCell>
                                                    <TableCell width="5%" align="center"> <Switch checked={x.isEnable} onChange={
                                                        (e) => {
                                                            let newArr = confirmList
                                                            newArr[index].detailListing[detailIndex].isEnable = e.target.checked
                                                            setConfirmList([...newArr]);
                                                        }
                                                    }
                                                    /></TableCell>
                                                    <TableCell width="5%"></TableCell>
                                                </TableBody>
                                            </Table>
                                        )
                                    })
                                }
                            </Card>
                        )
                    })
                }
            </>
        )
    }

    return (
        <div className="container-fluid my-2">
            {/* <div style={{ display: "flex" }}> */}
            <div className="row">
                <div className="col">
                    <Button onClick={() => window.location.href = "/PromotionListing"}>
                        <ArrowRoundedLeft8x13Svg fontSize="inherit" />
                        <Link style={{ paddingLeft: "10px", paddingRight: "10px", textDecoration: "none", color: "black" }}>
                            Back
                        </Link>
                    </Button>
                    <h4> {isPromotionEdit === true ? "Update Promotion Data" : "Create New Discount Promotion"}</h4>
                </div>
                {
                    isPromotionEdit === true &&
                    <div className="col" style={{ textAlign: "right", padding: "10px" }}>
                        <FormControlLabel
                            control={
                                <Switch size="medium" checked={isActive} onChange={(e) => { setActive(e.target.checked) }} />
                            }
                            style={{
                                backgroundColor: "#e9ecef", borderRadius: "10px", padding: "10px", fontWeight: "bold"
                            }}
                            label={isActive ? "ACTIVE" : "INACTIVE"}
                        />
                    </div>
                }
            </div>

            <hr />
            <Card>
                <CardContent>
                    <Typography style={TitleStyle}>Basic Promotion Information</Typography>
                    <div className="row">
                        <div className="col-xl-2 col-lg-3 col-md-3 col-s-12 col-xs-12">
                            Promotion Name:
                        </div>
                        <div className="col-xl-6 col-lg-6 col-md-8 col-s-12 col-xs-12">
                            <FormControl fullWidth size="small" variant="outlined">
                                <OutlinedInput
                                    id="outlined-adornment-name"
                                    label=""
                                    value={promotionName}
                                    onChange={(e) => setPromotionName(e.target.value)}
                                    endAdornment={<InputAdornment position="end"> {promotionName.length}/50</InputAdornment>}
                                    inputProps={{
                                        'aria-label': 'name',
                                        maxLength: 50
                                    }}
                                    required
                                />
                            </FormControl>
                            {errorData.nameError[0] === true && <FormHelperText style={{ color: "red" }}>Promotion Name is required</FormHelperText>}
                        </div>
                    </div>
                    <div className="row" style={{ paddingTop: "10px" }}>
                        <div className="col-xl-2 col-lg-3 col-md-3 col-s-12 col-xs-12">
                            Promotion Period:
                        </div>
                        <div className="col-xl-3 col-lg-3 col-md-3 col-s-6 col-xs-12">
                            <FormControl fullWidth size="small" variant="outlined">
                                <OutlinedInput
                                    id="outlined-adornment-startdate"
                                    type="datetime-local"
                                    label=""
                                    value={selectionRange.startDate}
                                    onChange={(e) => handleselectionRange({
                                        ...selectionRange,
                                        startDate: e.target.value,
                                        isDateError: selectionRange.endDate < e.target.value ? true : false
                                    })}
                                />
                            </FormControl>
                            {errorData.dateError[0] === true && <FormHelperText style={{ color: "red" }}>Valid Promotion Period is required</FormHelperText>}
                        </div>
                        <div className="col-xl-3 col-lg-3 col-md-3 col-s-6 col-xs-12">
                            <FormControl fullWidth size="small" variant="outlined">
                                <OutlinedInput
                                    id="outlined-adornment-endDate"
                                    type="datetime-local"
                                    label=""
                                    value={selectionRange.endDate}
                                    onChange={(e) => handleselectionRange({
                                        ...selectionRange,
                                        endDate: e.target.value,
                                        isDateError: selectionRange.startDate > e.target.value ? true : false
                                    })}
                                />
                            </FormControl>
                            {selectionRange.isDateError === true &&
                                <FormHelperText style={{ color: "red" }}>Please select valid date range</FormHelperText>}
                        </div>

                    </div>
                </CardContent>
            </Card>

            <div style={{ paddingTop: "20px" }}>
                <Card>
                    <CardContent>
                        <div className="row">
                            <div className="col">
                                <Typography style={TitleStyle}>Promotion Product Information</Typography>
                                <Typography style={SubtitleStyle}>Add products to promotion and set discount price.</Typography>
                            </div>
                            <div className="col">
                                <div style={{ textAlign: "right", padding: "10px" }}>
                                    <Button variant="outlined" color="primary" onClick={() => setModalOpen(true)}>
                                        Add Product
                                    </Button>
                                </div>
                            </div>
                        </div>
                        {
                            isArrayNotEmpty(confirmList) &&
                            <>
                                {renderBatchSetting()}
                                {renderConfirmListTable(confirmList)}
                                <div style={{ textAlign: "right" }}>
                                    <Button variant="contained"
                                        style={{ margin: "5px", backgroundColor: "primary" }}
                                        onClick={() => verifySubmitData()}
                                    >Confirm</Button>
                                </div>
                            </>
                        }
                    </CardContent>
                </Card>
            </div>

            <AlertDialog
                open={isModalOpen}
                fullWidth
                maxWidth="md"
                handleToggleDialog={() => setModalOpen(false)}
                title="Select Promotion Product"
                style={TitleStyle}
                showAction={false}
            >
                <div className="container-fluid">
                    <SearchBar
                        id=""
                        placeholder="Search By Product Name"
                        // buttonOnClick={() => this.onSearch("", "")}
                        onChange={(e) => searchSpace(e.target.value)}
                        className="searchbar-input mb-auto"
                        tooltipText="Search with current data"
                        value={searchKeywords}
                    />
                    <div className="row">
                        <div className="col-1">
                            <Checkbox
                                checked={selectedList.length === products.length}
                                onClick={(event) => confirmList.length > 0 ? selectedList.length === products.length ?
                                    filterConfirmList() : setSelectedList(products)
                                    : selectedList.length === products.length ? setSelectedList([]) : setSelectedList(products)}
                            />
                        </div>
                        <div className="col-10" style={{ paddingTop: "10px" }}>
                            <Typography>Select All </Typography>
                        </div>
                    </div>

                    <TableComponents
                        tableTopLeft={"empty"}
                        tableOptions={{
                            dense: true,
                            tableOrderBy: 'asc',
                            sortingIndex: "ProductName",
                            stickyTableHeader: false,
                        }}
                        paginationOptions={[8, 15, 20, { label: 'All', value: -1 }]}
                        tableHeaders={tableHeadCells}
                        tableRows={{
                            renderTableRows: renderTableRows,
                            checkbox: false,
                            checkboxColor: "primary",
                            onRowClickSelect: false
                        }}
                        selectedIndexKey={"ProductID"}

                        Data={filteredListing.length > 0 ? filteredListing : products.length > 0 && products[0].ProductName !== undefined ? products : []}
                    />
                    <div style={{ textAlign: "right" }}>
                        <Button variant="outlined" color="primary" style={{ margin: "5px" }} >Cancel</Button>
                        <Button variant="contained"
                            style={{ margin: "5px", backgroundColor: "primary" }}
                            disabled={selectedList.length > 0 ? false : true}
                            onClick={() => {
                                addConfirmList(selectedList)
                            }}

                        >Confirm</Button>
                    </div>
                </div>
            </AlertDialog >
        </div>

    )
}


