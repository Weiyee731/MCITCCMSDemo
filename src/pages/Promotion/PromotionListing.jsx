import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableComponents from "../../components/TableComponents/TableComponents";
import SearchBar from "../../components/SearchBar/SearchBar"
import { GitAction } from "../../store/action/gitAction";
import Button from "@mui/material/Button";
import { convertDateTimeToString112Format, isArrayNotEmpty, getFileExtension, getFileTypeByExtension, isStringNullOrEmpty } from "../../tools/Helpers"
import { FormControl, InputLabel, TableCell, OutlinedInput, IconButton, Tooltip } from '@mui/material';
import Logo from "../../assets/logos/logo.png";
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from "react-toastify";
import AddCircleIcon from '@mui/icons-material/AddCircle';

export const PromotionListing = (props) => {
    const { products, } = useSelector(state => ({
        products: state.counterReducer.products
    }));

    const dispatch = useDispatch()
    const [searchKeywords, setSearchKeywords] = useState("")
    const [isFilter, setIsFilter] = useState(false)
    const [filteredListing, setFilteredListing] = useState([])
    const [selectedList, setSelectedList] = useState([])
    const [promotionList, setPromotionList] = useState([])

    const searchSpace = (data) => {
        setSearchKeywords(data)
        let filteredListing = []
        let DataSet = promotionList

        DataSet.length > 0 && DataSet.filter((searchedItem) =>
            searchedItem.PromotionName !== null && searchedItem.PromotionName.toLowerCase().includes(
                data.toLowerCase()
            )
        ).map((filteredItem) => {
            filteredListing.push(filteredItem);
        })
        setIsFilter(true)
        setFilteredListing(filteredListing)
    }

    useEffect(() => {
        if (localStorage.getItem("promotionList") !== null) {
            setPromotionList(JSON.parse(localStorage.getItem("promotionList")))
        }
    }, [])

    const tableHeadCells = [
        {
            id: "PromotionName",
            align: 'left',
            disablePadding: false,
            label: "Promotion Name",
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
    ];

    const onDelete = () => {
        if (selectedList.length > 0) {
            setSelectedList([])
        } else {
            toast.error("Please select at least 1 promotion to delete")
        }
    }

    const checkPromotionPeriod = (startDate, endDate, type) => {
        let currentDate = convertDateTimeToString112Format(new Date())
        let isActive = type === "color" ? "grey" : "Expired"

        if (currentDate > convertDateTimeToString112Format(startDate) && currentDate < convertDateTimeToString112Format(endDate))
            isActive = type === "color" ? "green" : "On Going"
        if (currentDate < convertDateTimeToString112Format(startDate) && currentDate < convertDateTimeToString112Format(endDate))
            isActive = type === "color" ? "orange" : "Upcoming"

        return isActive
    }
    const renderTableRows = (data, index) => {

        console.log("dsaasda", data)
        if (data !== undefined) {
            return (
                <>
                    <TableCell align="left" style={{ fontWeight: "bold" }}>{data.PromotionName}</TableCell>
                    <TableCell align="left" >
                        {
                            data.PromotionDetails !== undefined && data.PromotionDetails.length > 0 && data.PromotionDetails.map((x) => {
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
                    <TableCell align="left">
                        <Button variant="contained" size="sm" style={{ backgroundColor: data.isActive !== false ? checkPromotionPeriod(data.PromotionStartDate, data.PromotionEndDate, "color",) : "grey", fontWeight: "bold" }}>
                            {data.isActive !== false ? checkPromotionPeriod(data.PromotionStartDate, data.PromotionEndDate, "period") : "Inactive"}
                        </Button>
                    </TableCell>
                    <TableCell align="left" >{data.PromotionStartDate !== undefined && data.PromotionEndDate !== undefined && data.PromotionStartDate.split("T")[0] + " " + data.PromotionStartDate.split("T")[1] + " to " + data.PromotionEndDate.split("T")[0] + " " + data.PromotionEndDate.split("T")[1]}</TableCell>
                </>
            )
        }
    }

    return (
        <div className="container-fluid my-2">
            <div className="row">
                <SearchBar
                    id=""
                    placeholder="Search By Promotion Name"
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
                                onClick={() => window.location.href = "/PromotionDetails/0"}
                            ><AddCircleIcon />  New Promotion
                            </Button>
                        </div>

                    </div>
                }
                tableOptions={{
                    dense: true,                // optional, default is false
                    tableOrderBy: 'asc',        // optional, default is asc
                    sortingIndex: "PromotionName",        // require, it must the same as the desired table header
                    stickyTableHeader: false,    // optional, default is true
                }}
                paginationOptions={[8, 15, 20, { label: 'All', value: -1 }]} // optional, by default it will hide the table pagination. You should set settings for pagination options as in array, eg.: [5, 100, 250, { label: 'All', value: -1 }]
                tableHeaders={tableHeadCells}        //required
                tableRows={{
                    renderTableRows: renderTableRows,   // required, it is a function, please refer to the example I have done in Table Components
                    checkbox: true,                          // optional, by default is true
                    checkboxColor: "primary",                // optional, by default is primary, as followed the MUI documentation
                    onRowClickSelect: false                  // optional, by default is false. If true, the ** onTableRowClick() ** function will be ignored
                }}
                selectedIndexKey={"ProductID"}                    // required, as follow the data targetting key of the row, else the data will not be chosen when checkbox is click. 

                Data={isFilter ? filteredListing : promotionList.length > 0 ? promotionList : []}                                  // required, the data that listing in the table
                onSelectRow={(e) => setSelectedList(e)}
                onSelectAllRows={(e) => setSelectedList(e)}
                onTableRowClick={(e, row) => window.location.href = "/PromotionDetails/" + row.PromotionId}       // optional, onTableRowClick = (event, row) => { }. The function should follow the one shown, as it will return the data from the selected row
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
