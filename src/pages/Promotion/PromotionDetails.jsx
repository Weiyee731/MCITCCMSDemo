import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { GitAction } from "../../store/action/gitAction";
import { ArrowRoundedLeft8x13Svg } from '../../assets/svg';
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { isArrayNotEmpty, isStringNullOrEmpty } from "../../tools/Helpers"
import { Typography, Card, CardContent, OutlinedInput, InputAdornment, FormHelperText, MenuItem, FormControl, Box, InputLabel, Select, TextField, IconButton } from "@mui/material";
import AlertDialog from "../../components/ModalComponent/ModalComponent";
import SearchBar from "../../components/SearchBar/SearchBar"
import Logo from "../../assets/logos/logo.png";
import TableComponents from "../../components/TableComponents/TableComponents";
import Checkbox from '@mui/material/Checkbox';
import DeleteIcon from '@mui/icons-material/Delete';
import Switch from '@mui/material/Switch';
import { Table, TableBody, TableCell, TableRow, FormControlLabel } from '@mui/material';
import { toast } from "react-toastify";
import Dropzone from "react-dropzone";
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import axios from "axios";
import moment from 'moment';
import LoadingPanel from "../../tools/LoadingPanel";

export const PromotionDetails = (props) => {
    const { products, promotionByID, promoAction } = useSelector(state => ({
        products: state.counterReducer.products,
        promoAction: state.counterReducer.promoAction,
        promotionByID: state.counterReducer.promotionByID
    }));

    const dispatch = useDispatch()
    const TitleStyle = { fontWeight: "bold", fontSize: "14pt" }
    const SubtitleStyle = { fontSize: "12pt", color: "gray" }
    const [promotionName, setPromotionName] = useState("")
    const [promotionBanner, setPromotionBanner] = useState([])
    const [promotionDesc, setPromotionDesc] = useState("")
    const [deletedProduct, setDeleteProduct] = useState([])
    const [selectionRange, handleselectionRange] = useState({
        startDate: "",
        endDate: "",
        isDateError: false,
    })
    const [isPromotionSubmit, setSubmitPromotion] = useState(false)
    const [isModalOpen, setModalOpen] = useState(false)
    const [promotionID, setPromotionID] = useState("")
    const [isActive, setActive] = useState(true)
    const [isPromotionEdit, setPromotionEdit] = useState(false)
    const [searchKeywords, setSearchKeywords] = useState("")
    const [filteredListing, setFilteredListing] = useState([])
    const [selectedList, setSelectedList] = useState([])
    const [confirmList, setConfirmList] = useState([])
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
                dispatch(GitAction.CallViewPromotionByID({ PromotionID: pathId }))
            }
        }

        dispatch(GitAction.CallAllProducts({
            type: "Merchant",
            typeValue: JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID === 1 ? 0 : JSON.parse(localStorage.getItem("loginUser"))[0].UserID,
            userId: JSON.parse(localStorage.getItem("loginUser"))[0].UserID,
            productPage: '999',
            page: '1',
            ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID,
        }))
    }, [])

    useEffect(() => {
        if (isPromotionSubmit === true) {
            dispatch(GitAction.CallClearPromotion())
            toast.success("Successfully Upload Promotion")
            setTimeout(
                window.location.href = "/ecommerceCMSDev/PromotionListing"
                , 5000
            );
        }
    }, [promoAction])

    useEffect(() => {
        if (isArrayNotEmpty(promotionByID) && isPromotionEdit === false) {
            let details = promotionByID[0]
            let PromoDetail = []
            details.PromotionDetail !== undefined && JSON.parse(details.PromotionDetail).map((promo) => {
                let detailListing = []
                let ProductPurchaselimit = ""
                let itemID = ""

                promo.ProductVariation !== undefined && JSON.parse(promo.ProductVariation).map((data) => {
                    detailListing = [...detailListing, {
                        discountPercent: data.ProductDiscount,
                        isDiscountError: false,
                        discountPrice: parseFloat(data.ProductVariationPrice * (data.ProductDiscount / 100)).toFixed(2),
                        stockLimitType: data.ProductStockLimit == 99999 ? "No Limit" : "Set Limit",
                        stockLimitQty: data.ProductStockLimit,
                        isStockLimitError: data.ProductStockLimit != 99999 ? isNaN(data.ProductStockLimit) ? true : false : false,
                        isEnable: data.ActiveInd == 1 ? true : false,
                        ProductStockAmount: data.ProductStockAmount,
                        ProductVariation: data.ProductVariation,
                        ProductVariationDetailID: data.ProductVariationDetailID,
                        ProductVariationPrice: data.ProductVariationPrice,
                        ProductVariationSKU: data.ProductVariationSKU,
                        ProductVariationValue: data.ProductVariationValue,
                        PromotionItemID: data.PromotionItemID
                    }]
                    ProductPurchaselimit = data.ProductPurchaselimit
                    itemID = data.PromotionItemID
                })
                PromoDetail = [...PromoDetail, {
                    ...promo,
                    promotionID: details.PromotionID,
                    purchaseLimit: ProductPurchaselimit,
                    purchaseLimitType: ProductPurchaselimit == 99999 ? "No Limit" : "Set Limit",
                    isPurchaseLimitError: ProductPurchaselimit != 99999 ? isNaN(ProductPurchaselimit) ? true : false : false,
                    PromotionItemID: itemID,
                    detailListing
                }]
            })
            setPromotionName(details.PromotionTitle)
            setPromotionBanner(details.BannerImage)
            setPromotionDesc(details.PromotionDesc)
            handleselectionRange({
                startDate: moment(details.BeginDate).format("YYYY-MM-DDTHH:mm:ss"),
                endDate: moment(details.EndDate).format("YYYY-MM-DDTHH:mm:ss"),
                isDateError: false
            })
            setConfirmList(PromoDetail)
            setSelectedList(PromoDetail)
            setActive(details.ActiveInd == 1 ? true : false)
            setPromotionEdit(true)
            setPromotionBanner(details.BannerImage)
        }
    }, [promotionByID])

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
        {
            id: "MerchantShopName",
            align: 'left',
            disablePadding: false,
            label: "Shop Name",
        },
    ];

    const merchantTableHeadCells = [
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
        let deletedListing = deletedProduct

        if (listing.length > 0) {
            if (deleteData.length > 0)
                deleteData.map((y) => {
                    listing.filter((x) => x.ProductID == y.ProductID && y.promotionID !== undefined).map((x) => {
                        deletedListing = [...deletedListing, x]
                    })
                    listing = listing.filter((x) => x.ProductID != y.ProductID)
                    setDeleteProduct(deletedListing)
                })
            else {
                listing.filter((x) => x.ProductID == deleteData.ProductID && deleteData.promotionID !== undefined).map((x) => { deletedListing = [...deletedListing, x] })
                listing = listing.filter((x) => x.ProductID != deleteData.ProductID)
                setDeleteProduct(deletedListing)
            }
        }
        setConfirmList(listing)
        setSelectedList(listing)
    }

    const updateALLConfirmList = () => {
        let newArr = confirmList

        if (batchData.isDiscountError || batchData.isStockLimitQtyError || batchData.isPurchaseLimitError)
            toast.warning("Insert only positive value data")
        else {

            let error = []

            // newArr[index].purchaseLimitType = e.target.value
            // if (e.target.value === "No Limit") {
            //     newArr[index].isPurchaseLimitError = false
            //     error = errorData.purchaseError.filter((x) => x != index)
            //     setErrorData({
            //         ...errorData,
            //         purchaseError: error
            //     })
            // }
            // setConfirmList([...newArr]);

            // purchaseLimitType: "No Limit",
            // purchaseLimit: "",
            // isPurchaseLimitError: false,
            // detailListing

            // discountPercent: "",
            // isDiscountError: false,
            // discountPrice: "",
            // stockLimitType: "No Limit",
            // stockLimitQty: "",
            // isStockLimitError: false,
            // isEnable: true


            if (selectedConfirmList.length > 0) {
                selectedConfirmList.map((y) => {
                    confirmList.map((data, index) => {
                        if (data.ProductID === y.ProductID) {
                            isArrayNotEmpty(data.detailListing) && data.detailListing.map((x, detailIndex) => {
                                newArr[index].detailListing[detailIndex].discountPercent = batchData.discountPercent
                                newArr[index].detailListing[detailIndex].discountPrice = parseFloat(x.ProductVariationPrice * (batchData.discountPercent / 100)).toFixed(2)
                                newArr[index].detailListing[detailIndex].stockLimitType = batchData.stockLimitType
                                newArr[index].detailListing[detailIndex].stockLimitQty = batchData.stockLimitQty

                                if (batchData.discountPercent === "")
                                    newArr[index].detailListing[detailIndex].isDiscountError = true
                                else
                                    newArr[index].detailListing[detailIndex].isDiscountError = false

                                if (batchData.stockLimitType === "No Limit")
                                    newArr[index].detailListing[detailIndex].isStockLimitError = false
                                else {
                                    if (batchData.stockLimitQty > -1 && batchData.stockLimitQty !== "")
                                        newArr[index].detailListing[detailIndex].isStockLimitError = false
                                    else
                                        newArr[index].detailListing[detailIndex].isStockLimitError = true
                                }
                            })
                            newArr[index].purchaseLimitType = batchData.purchaseLimitType
                            newArr[index].purchaseLimit = batchData.purchaseLimit

                            if (batchData.purchaseLimitType === "No Limit")
                                newArr[index].isPurchaseLimitError = false
                            else {
                                if (batchData.purchaseLimit > -1 && batchData.purchaseLimit !== "")
                                    newArr[index].isPurchaseLimitError = false
                                else
                                    newArr[index].isPurchaseLimitError = true
                            }
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

                        if (batchData.discountPercent === "")
                            newArr[index].detailListing[detailIndex].isDiscountError = true
                        else
                            newArr[index].detailListing[detailIndex].isDiscountError = false

                        if (batchData.stockLimitType === "No Limit")
                            newArr[index].detailListing[detailIndex].isStockLimitError = false
                        else {
                            if (batchData.stockLimitQty > -1 && batchData.stockLimitQty !== "")
                                newArr[index].detailListing[detailIndex].isStockLimitError = false
                            else
                                newArr[index].detailListing[detailIndex].isStockLimitError = true
                        }
                    })
                    newArr[index].purchaseLimitType = batchData.purchaseLimitType
                    newArr[index].purchaseLimit = batchData.purchaseLimit

                    if (batchData.purchaseLimitType === "No Limit")
                        newArr[index].isPurchaseLimitError = false
                    else {
                        if (batchData.purchaseLimit > -1 && batchData.purchaseLimit !== "")
                            newArr[index].isPurchaseLimitError = false
                        else
                            newArr[index].isPurchaseLimitError = true
                    }
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

        let deletedProductID = []

        const getBannerImage = () => {
            var today = new Date();
            var date = today.getFullYear() + '' + (today.getMonth() + 1) + '' + today.getDate();
            var time = today.getHours() + "" + today.getMinutes() + "" + today.getSeconds();
            var BannerImage = date + '_' + time + "_" + promotionName;
            return BannerImage
        }
        if (isArrayNotEmpty(confirmList)) {
            confirmList.map((data, index) => {
                if (data.purchaseLimitType !== "No Limit")
                    if (data.purchaseLimit === "" || data.purchaseLimit < 0)
                        isError.purchaseError.push(index)

                isArrayNotEmpty(data.detailListing) && data.detailListing.map((details, detailsIndex) => {
                    if (details.isEnable === true) {
                        if (details.discountPercent === "" || details.discountPercent < 0)
                            isError.discountError.push({
                                listingIndex: index,
                                detailsIndex: detailsIndex
                            })

                        if (details.stockLimitType !== "No Limit")
                            if (details.stockLimitQty === "" || details.stockLimitQty > 0)
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

        if (isArrayNotEmpty(deletedProduct)) {
            deletedProduct.map((x) => {
                deletedProductID.push(x.PromotionItemID)
            })
        }

        if (!isArrayNotEmpty(isError.nameError) && !isArrayNotEmpty(isError.dateError) && !isArrayNotEmpty(isError.purchaseError) && !isArrayNotEmpty(isError.discountError) && !isArrayNotEmpty(isError.stockError)) {

            // if (localStorage.getItem("promotionList") !== undefined && localStorage.getItem("promotionList") !== null) {
            //     if (isArrayNotEmpty(JSON.parse(localStorage.getItem("promotionList"))))
            //         localData = JSON.parse(localStorage.getItem("promotionList"))
            //     else
            //         localData.push(JSON.parse(localStorage.getItem("promotionList")))
            // }

            let productIDList = []
            let PromotionItemID = []
            let productDiscountList = []
            let productVariationDetailIDList = []
            let productStockLimitList = []
            let productPurchaseLimitList = []
            let activeIndList = []

            confirmList.map((x) => {
                isArrayNotEmpty(x.detailListing) && x.detailListing.map((details) => {
                    productIDList.push(x.ProductID)
                    PromotionItemID.push(x.PromotionItemID !== undefined ? x.PromotionItemID : 0)
                    productPurchaseLimitList.push(x.purchaseLimitType === "No Limit" ? 99999 : x.purchaseLimit)
                    productDiscountList.push(details.discountPercent)
                    productVariationDetailIDList.push(details.ProductVariationDetailID)
                    productStockLimitList.push(details.stockLimitType === "No Limit" ? 99999 : details.stockLimitQty)
                    activeIndList.push(details.isEnable)
                })
            })

            if (promotionID == "") {

                if (promotionBanner.length > 0) {

                    let fileExtLength = promotionBanner[0].path.split(".").length
                    let fileExt = promotionBanner[0].path.split(".")[fileExtLength - 1]
                    let propsData = {
                        PromotionTitle: promotionName,
                        ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID,
                        BannerImage: getBannerImage() + "." + fileExt,
                        PromotionDesc: promotionDesc === "" ? "-" : promotionDesc,
                        PromotionStartDate: moment(selectionRange.startDate).format("YYYY-MM-DD HH:mm:ss"),
                        PromotionEndDate: moment(selectionRange.endDate).format("YYYY-MM-DD HH:mm:ss"),
                        SlideOrder: 1,
                        ProductID: productIDList,
                        ProductDiscount: productDiscountList,
                        ProductStockLimit: productStockLimitList,
                        ProductPurchaseLimit: productPurchaseLimitList,
                        ProductVariationDetailID: productVariationDetailIDList,
                        ActiveInd: activeIndList,
                        UserID: JSON.parse(localStorage.getItem("loginUser"))[0].UserID,
                    }
                    const formData = new FormData();
                    formData.append("imageFile", promotionBanner[0]);
                    formData.append("imageName", getBannerImage());
                    let url = "https://" + localStorage.getItem("projectURL") + "/eCommerceCMSImage/uploadpromotion.php"
                    axios.post(url, formData, {}).then(res => {
                        if (res.status === 200) {
                            dispatch(GitAction.CallAddPromotion(propsData))
                            setSubmitPromotion(true)
                        }
                        else {
                            toast.error("Res Status error.");
                        }
                    });

                } else {
                    toast.warning("Valid Promotion Data is required")
                }
            }
            else {
                if (promotionBanner !== "") {
                    if (isArrayNotEmpty(promotionBanner)) {
                        let fileExtLength = promotionBanner[0].path.split(".").length
                        let fileExt = promotionBanner[0].path.split(".")[fileExtLength - 1]
                        let propsData = {
                            PromotionID: promotionID,
                            PromotionTitle: promotionName,
                            PromotionDesc: promotionDesc === "" ? "-" : promotionDesc,
                            BannerImage: getBannerImage() + "." + fileExt,
                            SlideOrder: 1,
                            PromotionStartDate: moment(selectionRange.startDate).format("YYYY-MM-DD HH:mm:ss"),
                            PromotionEndDate: moment(selectionRange.endDate).format("YYYY-MM-DD HH:mm:ss"),
                            DeletedPromotionProductID: isArrayNotEmpty(deletedProductID) ? deletedProductID : "-",
                            UpdatedPromotionProductID: PromotionItemID,
                            ProductID: productIDList,
                            ProductDiscount: productDiscountList,
                            ProductStockLimit: productStockLimitList,
                            ProductVariationDetailID: productVariationDetailIDList,
                            ProductPurchaseLimit: productPurchaseLimitList,
                            ActiveInd: activeIndList,
                            UserID: JSON.parse(localStorage.getItem("loginUser"))[0].UserID,
                        }
                        const formData = new FormData();
                        formData.append("imageFile", promotionBanner[0]);
                        formData.append("imageName", getBannerImage());
                        let url = "https://" + localStorage.getItem("projectURL") + "/eCommerceCMSImage/uploadpromotion.php"
                        axios.post(url, formData, {}).then(res => {
                            if (res.status === 200) {
                                dispatch(GitAction.CallUpdatePromotion(propsData))
                                setSubmitPromotion(true)
                            }
                            else {
                                toast.error("Res Status error.");
                            }
                        });
                    } else {
                        let bannerlength = promotionBanner.split("/").length
                        let propsData = {
                            PromotionID: promotionID,
                            PromotionTitle: promotionName,
                            PromotionDesc: promotionDesc === "" ? "-" : promotionDesc,
                            BannerImage: promotionBanner.split("/")[bannerlength - 1],
                            SlideOrder: 1,
                            PromotionStartDate: moment(selectionRange.startDate).format("YYYY-MM-DD HH:mm:ss"),
                            PromotionEndDate: moment(selectionRange.endDate).format("YYYY-MM-DD HH:mm:ss"),
                            DeletedPromotionProductID: isArrayNotEmpty(deletedProductID) ? deletedProductID : "-",
                            UpdatedPromotionProductID: PromotionItemID,
                            ProductID: productIDList,
                            ProductDiscount: productDiscountList,
                            ProductStockLimit: productStockLimitList,
                            ProductVariationDetailID: productVariationDetailIDList,
                            ProductPurchaseLimit: productPurchaseLimitList,
                            ActiveInd: activeIndList,
                            UserID: JSON.parse(localStorage.getItem("loginUser"))[0].UserID,
                        }
                        dispatch(GitAction.CallUpdatePromotion(propsData))
                        setSubmitPromotion(true)
                    }
                } else {
                    toast.warning("Valid Promotion Data is required")
                }
            }
        } else
            toast.warning("Valid Promotion Data is required")

        setErrorData(isError)
    }

    const updateStatus = (activeInd) => {
        setActive(activeInd)
        dispatch(GitAction.CallUpdatePromotionStatus({
            PromotionID: promotionID,
            ActiveInd: activeInd === true ? 1 : 0,
            UserID: JSON.parse(localStorage.getItem("loginUser"))[0].UserID,
        }))
    }

    const checkProductVariation = (data) => {
        let error = false
        if (data === "[]" || data === null || data === undefined)
            error = true

        return error
    }

    const renderTableRows = (data, index) => {
        if (data !== undefined) {
            return (
                <>
                    <TableCell align="left" style={{ opacity: checkExisting(confirmList, data) || checkProductVariation(data.ProductVariation) ? "0.5" : "1.0" }}>
                        <div className="row">
                            <div className="col-1">
                                <Checkbox
                                    disabled={checkExisting(confirmList, data) || checkProductVariation(data.ProductVariation)}
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
                                {checkProductVariation(data.ProductVariation) &&
                                    <Typography style={{ color: "red" }}>Unable to add this product as <strong>No Variation</strong> for this product</Typography>
                                }
                            </div>
                        </div>

                    </TableCell>
                    <TableCell align="left" style={{ opacity: checkExisting(confirmList, data) ? "0.5" : "1.0" }}>{data.ProductSold}</TableCell>
                    <TableCell align="left" style={{ opacity: checkExisting(confirmList, data) ? "0.5" : "1.0" }}>{data.ProductStockAmount}</TableCell>
                    <TableCell align="left" style={{ opacity: checkExisting(confirmList, data) ? "0.5" : "1.0" }}> {data.ProductPrice} </TableCell>
                    {JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID === 1 &&
                        <TableCell align="left" style={{ opacity: checkExisting(confirmList, data) ? "0.5" : "1.0" }}> {data.MerchantShopName} </TableCell>
                    }
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
                                            disabled={isActive ? false : true}
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
                                            disabled={isActive ? false : true}
                                            onChange={(e) => setBatchData({
                                                ...batchData,
                                                stockLimitType: e.target.value,
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
                                                disabled={isActive ? false : true}
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
                                            disabled={isActive ? false : true}
                                            onChange={(e) => setBatchData({
                                                ...batchData,
                                                purchaseLimitType: e.target.value,
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
                                                disabled={isActive ? false : true}
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
                                disabled={isActive ? false : true}
                                onClick={() => updateALLConfirmList()}>
                                {selectedConfirmList.length === 0 ? "Update All" : "Update Selected"}
                            </Button>
                            <Button variant="contained"
                                style={{ backgroundColor: "#C70039" }}
                                disabled={isActive ? false : true}
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
                                                    disabled={isActive ? false : true}
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
                                                                disabled={isActive ? false : true}
                                                                onChange={(e) => {
                                                                    let newArr = confirmList
                                                                    let error = []

                                                                    newArr[index].purchaseLimitType = e.target.value
                                                                    if (e.target.value === "No Limit") {
                                                                        newArr[index].isPurchaseLimitError = false
                                                                        error = errorData.purchaseError.filter((x) => x != index)
                                                                        setErrorData({
                                                                            ...errorData,
                                                                            purchaseError: error
                                                                        })
                                                                    }
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
                                                                    disabled={isActive ? false : true}
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
                                                                        // disabled={isActive ? false : true}
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
                                                                        // disabled={isActive ? false : true}
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
                                                                        // disabled={isActive ? false : true}
                                                                        onChange={(e) => {
                                                                            let newArr = confirmList
                                                                            let error = []
                                                                            newArr[index].detailListing[detailIndex].stockLimitType = e.target.value

                                                                            if (e.target.value === "No Limit") {
                                                                                newArr[index].detailListing[detailIndex].isStockLimitError = false
                                                                                error = errorData.stockError.filter((x) => !(x.listingIndex == index && x.detailsIndex == detailIndex))
                                                                                setErrorData({
                                                                                    ...errorData,
                                                                                    stockError: error
                                                                                })
                                                                            }
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
            <div className="row">
                <div className="col">
                    <Button onClick={() => window.location.href = "/ecommerceCMSDev/PromotionListing"}>
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
                                <Switch size="medium" checked={isActive} onChange={(e) => { updateStatus(e.target.checked) }} />
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

            <Card style={{ opacity: isActive ? "100%" : "60%" }}>
                <CardContent >
                    <Typography style={TitleStyle}>Basic Promotion Information</Typography>
                    <div className="row">
                        <div className="col-8" style={{ paddingTop: "10px" }}>
                            <div className="row">
                                <div className="col-xl-2 col-lg-3 col-md-3 col-s-12 col-xs-12">
                                    Promotion Name:
                                </div>
                                <div className="col-xl-10 col-lg-9 col-md-9 col-s-12 col-xs-12">
                                    <FormControl fullWidth size="small" variant="outlined">
                                        <OutlinedInput
                                            id="outlined-adornment-name"
                                            label=""
                                            value={promotionName}
                                            disabled={isActive ? false : true}
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
                                    Promotion Description:
                                </div>
                                <div className="col-xl-10 col-lg-9 col-md-9 col-s-12 col-xs-12">
                                    <FormControl fullWidth size="small" variant="outlined">
                                        <OutlinedInput
                                            id="outlined-adornment-name"
                                            label=""
                                            disabled={isActive ? false : true}
                                            value={promotionDesc}
                                            onChange={(e) => setPromotionDesc(e.target.value)}
                                            inputProps={{
                                                'aria-label': 'name',
                                                maxLength: 50
                                            }}
                                        />
                                    </FormControl>
                                </div>
                            </div>
                            <div className="row" style={{ paddingTop: "10px" }}>
                                <div className="col-xl-2 col-lg-3 col-md-3 col-s-12 col-xs-12">
                                    Promotion Period:
                                </div>
                                <div className="col-xl-5 col-lg-4 col-md-4 col-s-6 col-xs-12">
                                    <FormControl fullWidth size="small" variant="outlined">
                                        <OutlinedInput
                                            id="outlined-adornment-startdate"
                                            type="datetime-local"
                                            label=""
                                            value={selectionRange.startDate}
                                            disabled={isActive ? false : true}
                                            onChange={(e) => handleselectionRange({
                                                ...selectionRange,
                                                startDate: e.target.value,
                                                isDateError: selectionRange.endDate < e.target.value ? true : false
                                            })}
                                        />
                                    </FormControl>
                                    {errorData.dateError[0] === true && <FormHelperText style={{ color: "red" }}>Valid Promotion Period is required</FormHelperText>}
                                </div>
                                <div className="col-xl-5 col-lg-4 col-md-4 col-s-6 col-xs-12">
                                    <FormControl fullWidth size="small" variant="outlined">
                                        <OutlinedInput
                                            id="outlined-adornment-endDate"
                                            type="datetime-local"
                                            label=""
                                            value={selectionRange.endDate}
                                            disabled={isActive ? false : true}
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
                        </div>
                        <div className="col-4">
                            <Dropzone onDrop={acceptedFiles => setPromotionBanner(acceptedFiles)} disabled={isActive ? false : true}>
                                {({
                                    getRootProps,
                                    getInputProps,
                                    isDragActive,
                                    isDragReject,
                                }) => (
                                    <div
                                        {...getRootProps({
                                            className: "dropzone",
                                        })}
                                        style={{
                                            borderColor: isDragActive
                                                ? isDragReject
                                                    ? "#fc5447"
                                                    : "#a0d100"
                                                : "#b8b8b8",
                                            color: isDragActive
                                                ? isDragReject
                                                    ? "#a31702"
                                                    : "#507500"
                                                : "#828282",

                                            width: "100%",
                                            height: "100%",
                                        }}
                                    >
                                        {
                                            promotionBanner.length > 0 ?
                                                <>
                                                    <div className="row">
                                                        <div className="col" style={{ textAlign: "right", paddingRight: "0px" }}>
                                                            <img
                                                                className="DropZoneImage"
                                                                src={isPromotionEdit === true && promotionBanner[0].name === undefined ? promotionBanner : promotionBanner[0].name !== undefined && URL.createObjectURL(promotionBanner[0])}
                                                                alt=""
                                                            />
                                                        </div>
                                                        <div className="col" style={{ textAlign: "left", paddingLeft: "0px" }}>
                                                            <IconButton
                                                                onClick={() => setPromotionBanner([])}
                                                                disabled={isActive ? false : true}
                                                            >
                                                                <CloseIcon
                                                                    className="DropZoneImageDeleteButtonIcon"
                                                                    color="secondary"
                                                                />
                                                            </IconButton>
                                                        </div>
                                                    </div>
                                                </>
                                                :
                                                <>
                                                    <input {...getInputProps()} />
                                                    <AddIcon fontSize="large" className="DropZoneAddIcon" />
                                                </>
                                        }
                                    </div>
                                )}
                            </Dropzone>
                        </div>
                    </div>
                </CardContent >
            </Card >

            <div style={{ paddingTop: "20px", opacity: isActive ? "100%" : "60%" }}>
                <Card>
                    <CardContent>
                        <div className="row">
                            <div className="col">
                                <Typography style={TitleStyle}>Promotion Product Information</Typography>
                                <Typography style={SubtitleStyle}>Add products to promotion and set discount price.</Typography>
                            </div>
                            <div className="col">
                                <div style={{ textAlign: "right", padding: "10px" }}>
                                    <Button variant="outlined" color="primary" onClick={() => setModalOpen(true)} disabled={isActive ? false : true}>
                                        Add Product
                                    </Button>
                                </div>
                            </div>
                        </div>
                        {
                            promotionID !== "" ?
                                isPromotionEdit === true ?
                                    isArrayNotEmpty(confirmList) &&
                                    <>
                                        {renderBatchSetting()}
                                        {renderConfirmListTable(confirmList)}
                                        <div style={{ textAlign: "right" }}>
                                            <Button variant="contained"
                                                style={{ margin: "5px", backgroundColor: "primary" }}
                                                disabled={isActive ? false : true}
                                                onClick={() => verifySubmitData()}
                                            >Confirm</Button>
                                        </div>
                                    </>
                                    :
                                    <LoadingPanel />
                                :
                                isArrayNotEmpty(confirmList) &&
                                <>
                                    {renderBatchSetting()}
                                    {renderConfirmListTable(confirmList)}
                                    <div style={{ textAlign: "right" }}>
                                        <Button variant="contained"
                                            style={{ margin: "5px", backgroundColor: "primary" }}
                                            disabled={isActive ? false : true}
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
                maxWidth="lg"
                handleToggleDialog={() => setModalOpen(false)}
                title="Select Promotion Product"
                style={TitleStyle}
                showAction={false}
            >
                <div className="container-fluid">
                    <SearchBar
                        id=""
                        placeholder="Enter Product Name"
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
                        tableHeaders={JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID === 1 ? tableHeadCells : merchantTableHeadCells}
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
                        <Button variant="outlined" color="primary" style={{ margin: "5px" }} onClick={() => setModalOpen(false)} >Cancel</Button>
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
        </div >

    )
}


