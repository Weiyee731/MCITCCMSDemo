import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../store/action/gitAction";

import { Link } from "react-router-dom";

// import { browserHistory } from "react-router";
import TableCell from '@mui/material/TableCell';
// import TableRow from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import DraftsIcon from '@mui/icons-material/Drafts';

// Share Components
import SearchBar from "../../components/SearchBar/SearchBar"
import Pagination from "../../tools/Pagination";
// import { isArrayNotEmpty,isLatitude,  isLongitude} from "../../tools/Helpers";
import TableComponents from "../../components/TableComponents/TableComponents";
import AlertDialog from "../../components/ModalComponent/ModalComponent";
import { isArrayNotEmpty, isLatitude, isLongitude, isStringNullOrEmpty } from "../../tools/Helpers";
import Logo from "../../assets/logos/logo.png";
import ResponsiveDatePickers from "../../tools/datePicker";
import { url } from "../../tools/Helpers";

// UI Components
import Select from 'react-select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import GroupAddIcon from '@mui/icons-material/Add';
import Badge from '@mui/material/Badge';
import { toast } from "react-toastify";
import TextField from '@mui/material/TextField';
import PageviewIcon from '@mui/icons-material/Pageview';
import FormHelperText from '@mui/material/FormHelperText';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";



function mapStateToProps(state) {
    return {
        shoplot: state.counterReducer["shoplot"],
        grid: state.counterReducer["grid"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        CallGridList: (prodData) => dispatch(GitAction.CallGridList(prodData)),
        CallShopList: (prodData) => dispatch(GitAction.CallShopList(prodData)),
    };
}

const overallHeadCells = [
    {
        id: 'Block',
        align: 'left',
        disablePadding: false,
        label: 'Block Name',
    },
]


const INITIAL_STATE = {
    filteredProduct: [],
    selectedFilter: [],

    // Database Lisiting
    DBStockInDate: "",
    isOpenOverallDetails: [],
    isDatabaseSet: false,
    searchKeywords: "",
    isFiltered: false,

    // Store
    isBlockModal: false,
    selectedList: [],
    selectedBlock: "",

    // Block Modal
    isBlockNameError: false,
    BlockName: "",
    selectedBlockID: "",
    BlockData: [{
        Latitude: "",
        Longitude: "",
        isLatitudeError: false,
        isLongitudeError: false
    }],
    isEditBlock: false,

    // Shoplot
    isShoplotSet: false,
    page: 1,
    rowsPerPage: 10,
}

const DraftListing_State = [{
    isDraftListingShown: false,
    storageListing: [],
}]

const OverallListing_State = []

const DUMMYBLOCK =
    [
        {
            id: "1", block: "A", ShoplotCoordinate: [
                { lat: 1.5921641925052, lng: 110.431633074988 },
                { lat: 1.59115338985581, lng: 110.429951329936 },
                { lat: 1.59001492677904, lng: 110.430582476623 },
                { lat: 1.59102304881136, lng: 110.432309819229 },
                { lat: 1.5921641925052, lng: 110.431633074988 },
            ],
        },
        {
            id: "2", block: "B", ShoplotCoordinate: [
                { lat: 1.59219311478493, lng: 110.431658803505 },
                { lat: 1.59105065831252, lng: 110.432325065247 },
                { lat: 1.59264758826223, lng: 110.434993215471 },
                { lat: 1.59378358792204, lng: 110.43431969478 },
                { lat: 1.59219311478493, lng: 110.431658803505 },
            ],
        },
        {
            id: "3", block: "C", ShoplotCoordinate: [
                { lat: 1.5939685198604472, lng: 110.43665361977425 },
                { lat: 1.5936590240065396, lng: 110.43611937906833 },
                { lat: 1.5945346343454787, lng: 110.43560473453614 },
                { lat: 1.5937790950076558, lng: 110.43433013423987 },
                { lat: 1.592637929429218, lng: 110.43500991320931 },
                { lat: 1.593685862577975, lng: 110.43677943664157 },
                { lat: 1.5939685198604472, lng: 110.43665361977425 },
            ],
        },
    ]


class ShoplotListing extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE
        this.DraftListing = DraftListing_State
        this.DatabaseListing = OverallListing_State
        this.PagingListing = [{
            isOpenOverallDetails: [],
            Listing: []
        }]

        this.BlockListing = DUMMYBLOCK
        this.ShoplotListing = []

        this.props.CallGridList({ ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID })
        this.props.CallShopList({ Block: "A" })
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.shoplot !== null && this.props.shoplot.length > 0 && this.state.isShoplotSet === false) {
            this.ShoplotListing = this.props.shoplot
            this.setState({ isShoplotSet: true })
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
                // style={{ width: "55%" }}
                >
                    {data.block}   <label onClick={() => this.onBlockRowClick(data)} style={{ color: "blue", paddingTop: "9px", paddingLeft: "10px", fontSize: "10px" }}>Click to view Block Info</label>
                </TableCell>
            </>
        )
    }

    onBlockRowClick = (data) => {
        console.log("this is data", data)
        let dataList = []
        data.ShoplotCoordinate.map((x) => {
            dataList.push({
                Latitude: x.lat,
                Longitude: x.lng,
                isLatitudeError: false,
                isLongitudeError: false
            })
        })
        this.setState({
            isBlockModal: true,
            isEditBlock: true,

            selectedBlockID: data.id,
            isBlockNameError: false,
            BlockName: data.block,
            BlockData: dataList,
        })
    }

    handlePageChange = (page) => {
        this.setState(() => ({ page }));
    };

    renderTableCollapseRows = (data, index) => {
        return (
            <div className="container-fluid my-2">
                <div className="row" style={{ paddingLeft: "10px" }}>
                    {
                        this.ShoplotListing !== undefined && this.ShoplotListing !== null &&
                        <div className="row" style={{ backgroundColor: "#f5f5f5", paddingTop: "10px" }}>
                            <div className="col-12 col-md-3" style={{ paddingBottom: "10px" }}>
                                <label style={{ fontWeight: "bold" }}>Shoplot Name</label>
                            </div>
                            <div className="col-12 col-md-3" style={{ paddingBottom: "10px" }}>
                                <label style={{ fontWeight: "bold" }}>Shoplot Contact</label>
                            </div>
                        </div>
                    }
                    {
                        this.ShoplotListing !== undefined && this.ShoplotListing !== null ? this.ShoplotListing.filter((x) => x.ShoplotBlock === this.state.selectedBlock)
                            .slice((this.state.page - 1) * this.state.rowsPerPage, (this.state.page - 1) * this.state.rowsPerPage + this.state.rowsPerPage)
                            .map((data, index) => {
                                return (
                                    <>
                                        {
                                            <Link className="nav-link" style={{ paddingLeft: "0px" }} to={{ pathname: url.shoplotDetails(data.ShoplotID) }}>
                                                <div className="row flex-1" style={{ backgroundColor: index % 2 === 1 ? "#f5f5f5" : "#fffff", paddingTop: index % 2 === 1 ? "10px" : "5px", paddingBottom: index % 2 === 1 ? "10px" : "0px" }}>
                                                    <div className="col-12 col-md-3">
                                                        <label style={{ paddingLeft: "10px" }}>{data.ShoplotName}</label>
                                                    </div>
                                                    <div className="col-12 col-md-3">
                                                        <label>{data.ContactNumber}</label>
                                                    </div>
                                                </div>
                                            </Link>
                                        }
                                    </>
                                )
                            })

                            :
                            <div style={{ paddingLeft: "0px", paddingTop: "10px" }}> Temporarily this variation is not available </div>
                    }

                    <Pagination
                        current={this.state.page}
                        total={
                            // this.state.setRating === 0 ?
                            Math.ceil(this.ShoplotListing.length / this.state.rowsPerPage)
                            // :
                            // Math.ceil(this.filterRating(this.state.setRating) / this.state.rowsPerPage)
                        }
                        onPageChange={this.handlePageChange}
                    />
                </div>
            </div>
        )
    }

    onTableRowClick = (event, row) => {
        console.log("this.PagingListing[0]", this.PagingListing[0])

        let listing = this.PagingListing[0].Listing
        let selected = ""
        let OverallCollapseTable = this.PagingListing[0].isOpenOverallDetails

        listing.map((data, i) => {
            if (data.id === row.id)
                selected = i
        })

        OverallCollapseTable.map((data, index) => {
            if (index === selected) {
                OverallCollapseTable[index] = !OverallCollapseTable[index]
            } else
                OverallCollapseTable[index] = false
        })

        console.log("ROW12345", row)

        this.PagingListing[0].isOpenOverallDetails = OverallCollapseTable
        this.setState({ isOpenOverallDetails: OverallCollapseTable, selectedBlock: row.block })
    }


    // Remove selected state listing and localStorage listing data
    onDelete = () => {
        console.log("this.state.selectedListID", this.state.selectedList)
        alert(this.state.selectedList)
        // let localListing = localStorage.getItem("DataSetDraft") !== null ? JSON.parse(localStorage.getItem("DataSetDraft")) : []
        // let selectedList = this.state.selectedListID

        // if (localListing.length > 0 && selectedList.length > 0) {
        //     selectedList.map((datalist) => {
        //         localListing = localListing.filter((data) => data.DraftNo !== datalist.DraftNo)
        //     })
        // }
        // localStorage.setItem("DataSetDraft", JSON.stringify(localListing))
        // this.DraftListing[0].storageListing = localListing
        // this.setState({ selectedListID: [] })
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
            }
        }
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

    handleFormInput = (e, name, index) => {
        let blockListing = this.state.BlockData
        switch (name) {

            case "Filter":
                this.setState({ selectedFilter: { id: e.id, value: e.value, label: e.label } })
                break;


            case "BlockName":
                if (isStringNullOrEmpty(e.target.value))
                    this.setState({ isBlockNameError: true, BlockName: e.target.value })
                else
                    this.setState({ isBlockNameError: false, BlockName: e.target.value })
                break;

            case "Latitude":
                console.log("isLatitude(e.target.value)", isLatitude(e.target.value))
                let isLatitudeError = false
                if (isStringNullOrEmpty(e.target.value) || !isLatitude(e.target.value))
                    isLatitudeError = true
                blockListing[index] = {
                    Latitude: e.target.value,
                    Longitude: blockListing[index].Longitude,
                    isLatitudeError: isLatitudeError,
                    isLongitudeError: blockListing[index].isLongitudeError,
                }
                this.setState({ BlockData: blockListing })
                break;

            case "Longitude":
                console.log("isLongitude(e.target.value)", isLongitude(e.target.value))
                let isLongitudeError = false
                if (isStringNullOrEmpty(e.target.value) || !isLongitude(e.target.value))
                    isLongitudeError = true
                blockListing[index] = {
                    Latitude: blockListing[index].Latitude,
                    Longitude: e.target.value,
                    isLatitudeError: blockListing[index].isLatitudeError,
                    isLongitudeError: isLongitudeError,
                }
                this.setState({ BlockData: blockListing })
                break;

            default:
                break;
        }
    }

    addNewBlock = () => {
        let blockListing = this.state.BlockData

        blockListing = [...blockListing, {
            Latitude: "",
            Longitude: "",
            isLatitudeError: false,
            isLongitudeError: false
        }]
        this.setState({ BlockData: blockListing })
    }

    removeBlockData = (index) => {
        let blockListing = this.state.BlockData
        blockListing = blockListing.filter((x, i) => i !== index)
        this.setState({ BlockData: blockListing })
    }

    OnSubmitDatabase = () => {
        if (!this.errorChecking()) {

            let dataCoordinate = []
            this.state.BlockData.length > 0 && this.state.BlockData.map((data) => {
                dataCoordinate.push({
                    lat: parseFloat(data.Latitude),
                    lng: parseFloat(data.Longitude),
                })
            })
            var blockData = {
                id: this.BlockListing.length + 1,
                block: this.state.BlockName,
                ShoplotCoordinate: dataCoordinate
            }
            this.BlockListing = [...this.BlockListing, blockData]
            this.setState(INITIAL_STATE)
        }
        else {
            toast.warning("Input Error: Please cross check on All Shop Details Input")
        }
    }

    OnSubmitUpdateDatabase = () => {
        if (!this.errorChecking()) {
            let dbBlockListing = this.BlockListing
            let index = dbBlockListing.findIndex(x => parseInt(x.id) === parseInt(this.state.selectedBlockID))
            let dataCoordinate = []

            this.state.BlockData.length > 0 && this.state.BlockData.map((data) => {
                dataCoordinate.push({
                    lat: parseFloat(data.Latitude),
                    lng: parseFloat(data.Longitude),
                })
            })

            dbBlockListing[index] = {
                id: this.state.selectedListID,
                block: this.state.BlockName,
                ShoplotCoordinate: dataCoordinate
            }
            this.BlockListing = dbBlockListing
            this.setState(INITIAL_STATE)
        }
        else {
            toast.warning("Input Error: Please cross check on All Shop Details Input")
        }

    }

    errorChecking = () => {
        let error = false
        let blockListing = this.state.BlockData

        if (blockListing.length > 0) {
            if (blockListing.filter((data) => data.isLatitudeError === true || data.isLongitudeError === true).length > 0)
                error = true
        }
        return error
    }

    render() {

        const TextFieldData = (type, variant, title, name, stateValue, error, index) => {
            return (
                <div className="col-12 col-md-12" style={{ paddingBottom: "10px" }}>
                    <TextField variant={variant} type={type} size="small" fullWidth label={title} value={stateValue} name={name} onChange={(e) => this.handleFormInput(e, name, index)}
                        required />
                    {error && <FormHelperText sx={{ color: 'red' }} id={error}>Invalid {title} </FormHelperText>}
                </div>
            )
        }

        const filterSelection =
            [
                { id: "1", value: "Store" },
                { id: "2", value: "Product Name" }
            ]

        return (
            <div className="container-fluid my-2">
                <div className="row">
                    <div className="col-md-12 col-12 mb-2 d-flex">
                        <div className="col-2 d-inline-flex">
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

                    <div className="w-100 container-fluid">
                        <TableComponents
                            tableTopLeft={
                                <h3 style={{ fontWeight: 600 }}>Shoplot List</h3>}
                            tableTopRight={
                                <div className="d-flex">
                                    <Tooltip title="Add Block">
                                        <IconButton size="small" sx={{ color: "#0074ea", marginRight: 1 }} onClick={() => this.setState({ isBlockModal: true })}>
                                            <GroupAddIcon />
                                        </IconButton>
                                    </Tooltip>
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
                                checkbox: true,
                                checkboxColor: "primary",
                                onRowClickSelect: false,

                                isExpandable: true,
                                renderTableCollapseRows: this.renderTableCollapseRows,
                                isCollapseOpen: this.PagingListing[0].isOpenOverallDetails
                            }}
                            Data={this.state.isFiltered === true ? this.state.filteredProduct : this.BlockListing}
                            onTableRowClick={this.onTableRowClick}
                            onSelectRow={(e) => this.setState({ selectedList: e })}
                            onSelectAllRows={(e) => this.setState({ selectedList: e })}
                            SelectionActionButtons={<Tooltip title="Delete">
                                <IconButton aria-label="delete" onClick={() => { this.onDelete() }}   >
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>}
                            carryDataFromChild={this.carryDataFromChild}
                        />
                    </div>

                    <AlertDialog
                        open={this.state.isBlockModal}
                        fullWidth
                        maxWidth="md"
                        handleToggleDialog={() => <>{this.setState(INITIAL_STATE)}{this.setState({ isBlockModal: false })}</>}
                        title={this.state.isEditBlock === true ? this.state.BlockName : "New Block"}
                        showAction={false}
                    >
                        <div className="container-fluid">
                            <div className="container" style={{ padding: "10px" }}>
                                <div className="col-12 col-md-12" style={{ paddingBottom: "10px" }}>
                                    {TextFieldData("text", "outlined", "Block Name", "BlockName", this.state.BlockName, this.state.isBlockNameError, 0)}
                                </div>
                                {
                                    this.state.isBlockNameError === false && this.state.BlockName !== "" &&
                                    <>
                                        <hr />
                                        <div className="row">
                                            <div className="col-12 col-md-12" style={{ textAlign: "right" }}>
                                                <Tooltip title="Add Store">
                                                    <IconButton size="small" sx={{ color: "#0074ea", marginRight: 4 }} onClick={() => this.addNewBlock()}>
                                                        <GroupAddIcon /><label style={{ paddingLeft: "5px" }}>Add Coordinate</label>
                                                    </IconButton>
                                                </Tooltip>
                                            </div>
                                        </div>
                                    </>
                                }
                                {this.state.BlockData.length > 0 && this.state.BlockData.map((data, index) => {
                                    return (
                                        <>
                                            <div className="row">
                                                {
                                                    this.state.isBlockNameError === false && this.state.BlockName !== "" ?
                                                        <>
                                                            <div className="col-12 col-md-6" style={{ paddingBottom: "10px" }}>
                                                                <div className="row">

                                                                    {
                                                                        this.state.BlockData.length > 1 &&
                                                                        <div className="col-1 col-md-1">
                                                                            <RemoveCircleOutlineIcon
                                                                                className="DeleteOptionButton mr-2"
                                                                                style={{ cursor: 'pointer' }}
                                                                                color="secondary"
                                                                                onClick={() => this.removeBlockData(index)}
                                                                            />
                                                                        </div>
                                                                    }
                                                                    <div className="col-6 col-md-6">
                                                                        <label style={{ fontWeight: "bold" }}>Coordinate {index + 1}</label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <br />
                                                            <div className="row">
                                                                <div className="col-6 col-md-6">
                                                                    {TextFieldData("number", "outlined", "Latitude", "Latitude", data.Latitude, data.isLatitudeError, index)}
                                                                </div>
                                                                <div className="col-6 col-md-6">
                                                                    {TextFieldData("number", "outlined", "Longitude", "Longitude", data.Longitude, data.isLongitudeError, index)}
                                                                </div>
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
                                })}
                                {
                                    this.state.isBlockNameError === false && this.state.BlockName !== "" &&
                                    <div className="row">
                                        <div className="col-12 col-md-12" style={{ textAlign: "right" }}>
                                            {
                                                this.state.isEditBlock ?
                                                    <Button variant="contained" onClick={() => { this.OnSubmitUpdateDatabase() }} color="primary"  >
                                                        Update
                                                    </Button>
                                                    :
                                                    <Button variant="contained" onClick={() => { this.OnSubmitDatabase() }} color="primary"  >
                                                        Submit
                                                    </Button>
                                            }
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </AlertDialog >
                </div>
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShoplotListing);