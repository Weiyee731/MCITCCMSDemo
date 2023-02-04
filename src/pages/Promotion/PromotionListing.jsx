import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableComponents from "../../components/TableComponents/TableComponents";
import SearchBar from "../../components/SearchBar/SearchBar"
import { GitAction } from "../../store/action/gitAction";
import Button from "@mui/material/Button";
import { convertDateTimeToString112Format, isArrayNotEmpty, getFileExtension, getFileTypeByExtension, isStringNullOrEmpty } from "../../tools/Helpers"
import { FormControl, InputLabel, TableCell, OutlinedInput, IconButton, Tooltip, FormControlLabel } from '@mui/material';
import Logo from "../../assets/logos/logo.png";
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from "react-toastify";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Switch from '@mui/material/Switch';


export const PromotionListing = (props) => {
    const { promotions, promoAction } = useSelector(state => ({
        promotions: state.counterReducer.promotions,
        promoAction: state.counterReducer.promoAction
    }));

    const dispatch = useDispatch()
    const [searchKeywords, setSearchKeywords] = useState("")
    const [isFilter, setIsFilter] = useState(false)
    const [filteredListing, setFilteredListing] = useState([])
    const [selectedList, setSelectedList] = useState([])
    const [promotionList, setPromotionList] = useState([])
    const [isPromoListSet, setPromo] = useState(false)
    const [isPromoSubmit, setSubmitPromo] = useState(false)
    const [isStatusSubmit, setSubmitStatus] = useState(false)
    const [isActive, setActive] = useState(true)

    const searchSpace = (data) => {
        setSearchKeywords(data)
        let filteredListing = []
        let DataSet = promotionList

        DataSet.length > 0 && DataSet.filter((searchedItem) =>
            searchedItem.PromotionTitle !== null && searchedItem.PromotionTitle.toLowerCase().includes(
                data.toLowerCase()
            )
        ).map((filteredItem) => {
            filteredListing.push(filteredItem);
        })
        setIsFilter(true)
        setFilteredListing(filteredListing)
    }

    useEffect(() => {

        if (isPromoListSet === false && isArrayNotEmpty(promotions)) {
            setPromotionList(promotions)
            setPromo(isPromoListSet)
        }
    }, [promotions])

    useEffect(() => {
        dispatch(GitAction.CallViewPromotion({
            ActiveInd: -1,
            ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID,
            UserID: JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID === 1 ? 0 : JSON.parse(localStorage.getItem("loginUser"))[0].UserID,
        }))
    }, [])

    useEffect(() => {
        if (isPromoSubmit || isStatusSubmit) {
            dispatch(GitAction.CallClearPromotion())
            dispatch(GitAction.CallViewPromotion({
                ActiveInd: -1,
                ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID,
                UserID: JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID === 1 ? 0 : JSON.parse(localStorage.getItem("loginUser"))[0].UserID,

            }))
            if (isPromoSubmit)
                toast.success("Successfully Delete")
            setSubmitPromo(false)
            setPromo(false)
        }
    }, [promoAction])

    const tableHeadCells = [
        {
            id: "PromotionTitle",
            align: 'left',
            disablePadding: false,
            label: "Promotion Title",
        },
        {
            id: "ProductName",
            align: 'left',
            disablePadding: false,
            label: "Products ",
        },
        {
            id: "ShopName",
            align: 'left',
            disablePadding: false,
            label: "Merchant Shop",
        },
        {
            id: "PromotionStatus",
            align: 'left',
            disablePadding: false,
            label: "Status",
        },
        {
            id: "PromotionPeriod",
            align: 'left',
            disablePadding: false,
            label: "Product Period",
        },
        {
            id: "PromotionStatusInd",
            align: 'left',
            disablePadding: false,
            label: "Is Active",
        },
    ];

    const merchantTableHeadCells = [
        {
            id: "PromotionTitle",
            align: 'left',
            disablePadding: false,
            label: "Promotion Title",
        },
        {
            id: "ProductName",
            align: 'left',
            disablePadding: false,
            label: "Products ",
        },
        {
            id: "PromotionStatus",
            align: 'left',
            disablePadding: false,
            label: "Status",
        },
        {
            id: "PromotionPeriod",
            align: 'left',
            disablePadding: false,
            label: "Product Period",
        },
        {
            id: "PromotionStatusInd",
            align: 'left',
            disablePadding: false,
            label: "Is Active",
        },
    ];

    const updateStatus = (activeInd, promotionID) => {
        dispatch(GitAction.CallUpdatePromotionStatus({
            PromotionID: promotionID,
            ActiveInd: activeInd === true ? 1 : 0,
            UserID: JSON.parse(localStorage.getItem("loginUser"))[0].UserID,
        }))
        setSubmitStatus(true)
    }

    const onDelete = () => {
        if (isArrayNotEmpty(selectedList)) {
            let promotionID = []
            selectedList.map((x) => {
                promotionID.push(x.PromotionID)
            })
            dispatch(GitAction.CallDeletePromotion({ PromotionID: promotionID, UserID: JSON.parse(localStorage.getItem("loginUser"))[0].UserID }))
            setSubmitPromo(true)
            setSelectedList([])
        } else {
            toast.error("Please select at least 1 promotion to delete")
        }
    }

    const checkPromotionPeriod = (startDate, endDate, type) => {
        let currentDate = convertDateTimeToString112Format(new Date())
        let isActive = type === "color" ? "grey" : "Expired"

        if (currentDate >= convertDateTimeToString112Format(startDate) && currentDate <= convertDateTimeToString112Format(endDate))
            isActive = type === "color" ? "green" : "On Going"
        if (currentDate < convertDateTimeToString112Format(startDate) && currentDate < convertDateTimeToString112Format(endDate))
            isActive = type === "color" ? "orange" : "Upcoming"
        return isActive
    }
    const renderTableRows = (data, index) => {

        const propPage = (ID) => {
            window.location.href = "./PromotionDetails/" + ID
        }
        if (data !== undefined) {
            return (
                <>
                    <TableCell align="left" style={{ fontWeight: "bold" }} onClick={() => propPage(data.PromotionID)}>{data.PromotionTitle}</TableCell>
                    <TableCell align="left" onClick={() => propPage(data.PromotionID)} >
                        {
                            data.PromotionDetail !== undefined && JSON.parse(data.PromotionDetail).map((x) => {
                                return (
                                    <img height={60}
                                        alt={x.ProductImage}
                                        src={
                                            x.ProductImage
                                                ? x.ProductImage
                                                : ""
                                        }
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = Logo;
                                        }}
                                    />
                                )
                            })
                        }
                    </TableCell>
                    {
                        JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID === 1 &&
                        <TableCell align="left" style={{ fontWeight: "bold" }} onClick={() => propPage(data.PromotionID)}>{data.ShopName}</TableCell>
                    }
                    <TableCell align="left" onClick={() => propPage(data.PromotionID)}>
                        <Button variant="contained" size="sm" style={{ backgroundColor: data.ActiveInd == 1 ? checkPromotionPeriod(data.BeginDate, data.EndDate, "color",) : "grey", fontWeight: "bold" }}>
                            {data.ActiveInd == 1 ? checkPromotionPeriod(data.BeginDate, data.EndDate, "period") : "Inactive"}
                        </Button>
                    </TableCell>
                    <TableCell align="left" onClick={() => propPage(data.PromotionID)} >{data.BeginDate !== undefined && data.EndDate !== undefined && data.BeginDate + " to " + data.EndDate}</TableCell>
                    <TableCell align="left" >
                        <FormControlLabel
                            control={
                                <Switch size="medium" checked={data.ActiveInd == 1 ? true : false} onChange={(e) => { updateStatus(e.target.checked, data.PromotionID) }} />
                            }
                            label={data.ActiveInd == 1 ? "ACTIVE" : "INACTIVE"}
                        />
                    </TableCell>

                </>
            )
        }
    }

    return (
        <div className="container-fluid my-2">
            <div className="row">
                <SearchBar
                    id=""
                    placeholder="Enter Promotion Name"
                    onChange={(e) => searchSpace(e.target.value)}
                    className="searchbar-input mb-auto"
                    tooltipText="Search with current data"
                    value={searchKeywords}
                />
            </div>

            <hr />
            <TableComponents
                tableTopLeft={
                    <div className="d-flex">
                        <h3 style={{ fontWeight: 600 }}>Promotion Listing</h3>
                        <div className="col" style={{ textAlign: "right", padding: "10px" }}>
                            <Button variant="contained" size="sm"
                                onClick={() => window.location.href = "./PromotionDetails/0"}
                            ><AddCircleIcon />  New Promotion
                            </Button>
                        </div>

                    </div>
                }
                tableOptions={{
                    dense: true,                // optional, default is false
                    tableOrderBy: 'asc',        // optional, default is asc
                    sortingIndex: "PromotionTitle",        // require, it must the same as the desired table header
                    stickyTableHeader: false,    // optional, default is true
                }}
                paginationOptions={[8, 15, 20, { label: 'All', value: -1 }]} // optional, by default it will hide the table pagination. You should set settings for pagination options as in array, eg.: [5, 100, 250, { label: 'All', value: -1 }]
                tableHeaders={JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID === 1 ? tableHeadCells : merchantTableHeadCells}        //required
                tableRows={{
                    renderTableRows: renderTableRows,   // required, it is a function, please refer to the example I have done in Table Components
                    checkbox: true,                          // optional, by default is true
                    checkboxColor: "primary",                // optional, by default is primary, as followed the MUI documentation
                    onRowClickSelect: false                  // optional, by default is false. If true, the ** onTableRowClick() ** function will be ignored
                }}
                selectedIndexKey={"ProductID"}                    // required, as follow the data targetting key of the row, else the data will not be chosen when checkbox is click. 

                Data={isFilter ? filteredListing : isArrayNotEmpty(promotionList) ? promotionList : []}                                  // required, the data that listing in the table
                onSelectRow={(e) => setSelectedList(e)}
                onSelectAllRows={(e) => setSelectedList(e)}
                // onTableRowClick={(e, row) => window.location.href = "/PromotionDetails/" + row.PromotionID}       // optional, onTableRowClick = (event, row) => { }. The function should follow the one shown, as it will return the data from the selected row
                SelectionActionButtons={
                    <Tooltip title="Delete">
                        <IconButton aria-label="delete" onClick={() => { onDelete() }}   >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                }
            />

        </div>
    )
}
