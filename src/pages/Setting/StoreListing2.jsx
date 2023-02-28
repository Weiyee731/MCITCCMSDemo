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
import { isArrayNotEmpty, isLatitude, isLongitude, isStringNullOrEmpty, isContactValid } from "../../tools/Helpers";
import Logo from "../../assets/logos/logo.png";
import ResponsiveDatePickers from "../../tools/datePicker";
import { url } from "../../tools/Helpers";

// UI Components
import Select from 'react-select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import GroupAddIcon from '@mui/icons-material/Add';
import { toast } from "react-toastify";
import TextField from '@mui/material/TextField';
import PageviewIcon from '@mui/icons-material/Pageview';
import FormHelperText from '@mui/material/FormHelperText';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import GoogleMaps from "../../components/GoogleMap/GoogleMapForPolygonCreation";
import RoomIcon from '@mui/icons-material/Room';
import InfoIcon from '@mui/icons-material/Info';

const TOKEN = "pk.eyJ1Ijoic21peWFrYXdhIiwiYSI6ImNqcGM0d3U4bTB6dWwzcW04ZHRsbHl0ZWoifQ.X9cvdajtPbs9JDMG-CMDsA";


function mapStateToProps(state) {
    return {
        shoplot: state.counterReducer["shoplot"],
        grid: state.counterReducer["grid"],
        block: state.counterReducer["block"],
        shoplotAction: state.counterReducer["shoplotAction"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        CallGridList: (prodData) => dispatch(GitAction.CallGridList(prodData)),
        CallBlockList: (prodData) => dispatch(GitAction.CallBlockList(prodData)),
        CallShopList: (prodData) => dispatch(GitAction.CallShopList(prodData)),

        CallAddShopList: (prodData) => dispatch(GitAction.CallAddShopList(prodData)),

        CallResetShopAction: () => dispatch(GitAction.CallResetShopAction()),


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

    isShopModal: false,
    ShopModalData: [{
        ShoplotName: "",
        ShoplotBlock: [{
            id: "",
            value: "",
            label: ""
        }],
        ContactNo: "",
        isShoplotNameError: false,
        isContactNoError: false,
    }],
    Location: "",
    isMapAlert: false,

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
        this.props.CallGridList({
            ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID,
            USERID: JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID === 1 ? 0 : JSON.parse(localStorage.getItem("loginUser"))[0].UserID
        })
        this.props.CallBlockList({
            ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID,
            USERID: JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID === 1 ? 0 : JSON.parse(localStorage.getItem("loginUser"))[0].UserID
        })
        this.props.CallShopList({
            ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID,
            USERID: JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID === 1 ? 0 : JSON.parse(localStorage.getItem("loginUser"))[0].UserID
        })
    }


    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.shoplotAction !== this.props.shoplotAction) {
            if (this.props.shoplotAction.length > 0 && this.props.shoplotAction[0].ReturnVal === 1) {
                this.props.CallResetShopAction()
                toast.success("Data is uploaded")
            }
            else
                this.props.CallShopList({
                    ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID,
                    USERID: JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID === 1 ? 0 : JSON.parse(localStorage.getItem("loginUser"))[0].UserID
                })
        }

        // if (prevProps.shoplot !== this.props.shoplot) {
        //     if (this.props.shoplot !== null && this.props.shoplot.length > 0 && this.state.isShoplotSet === false) {
        //         this.ShoplotListing = this.props.shoplot
        //         this.setState({ isShoplotSet: true })
        //     }
        // }
    }

    renderTableRows = (data, index) => {
        return (
            <>
                <TableCell
                    component="th"
                    id={`enhanced-table-checkbox-${index}`}
                    scope="row"
                    padding="normal"
                >
                    {data.StorageBlock}   <label onClick={() => this.onBlockRowClick(data)} style={{ color: "blue", paddingTop: "9px", paddingLeft: "10px", fontSize: "10px" }}>Click to view Block Info</label>
                </TableCell>
            </>
        )
    }

    onBlockRowClick = (data) => {
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
                        this.props.shoplot !== undefined && this.props.shoplot !== null &&
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
                        this.props.shoplot !== undefined && this.props.shoplot !== null ? this.props.shoplot.filter((x) => x.StorageBlockID === this.state.selectedBlock)
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
                            Math.ceil(this.props.shoplot.length / this.state.rowsPerPage)
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
        let listing = this.PagingListing[0].Listing
        let selected = ""
        let OverallCollapseTable = this.PagingListing[0].isOpenOverallDetails

        listing.map((data, i) => {
            if (parseInt(data.StorageBlockID) === parseInt(row.StorageBlockID))
                selected = i
        })

        OverallCollapseTable.map((data, index) => {
            if (index === selected) {
                OverallCollapseTable[index] = !OverallCollapseTable[index]
            } else
                OverallCollapseTable[index] = false
        })

        this.PagingListing[0].isOpenOverallDetails = OverallCollapseTable
        this.setState({ isOpenOverallDetails: OverallCollapseTable, selectedBlock: row.StorageBlockID })
    }


    // Remove selected state listing and localStorage listing data
    onDelete = () => {
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
        let shopListing = this.state.ShopModalData
        let blockData = shopListing[0].ShoplotBlock
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

            // {TextFieldData("text", "outlined", "Shoplot Name", "ShoplotName", this.state.ShopModalData[0].ShoplotName, this.state.ShopModalData[0].isShoplotNameError, 0)}

            case "ShoplotName":
                let isShoplotNameError = false
                if (isStringNullOrEmpty(e.target.value))
                    isShoplotNameError = true
                let block = [{
                    id: blockData[0].id,
                    value: blockData[0].value,
                    label: blockData[0].label,
                }]
                shopListing[index] = {
                    ShoplotName: e.target.value,
                    ShoplotBlock: block,
                    ContactNo: shopListing[index].ContactNo,
                    isShoplotNameError: isShoplotNameError,
                    isContactNoError: shopListing[index].isContactNoError,
                }
                this.setState({ ShopModalData: shopListing })
                break;

            case "ContactNo":
                let isContactNoError = false
                if (isStringNullOrEmpty(e.target.value) || !isContactValid(e.target.value))
                    isContactNoError = true

                block = [{
                    id: blockData[0].id,
                    value: blockData[0].value,
                    label: blockData[0].label,
                }]

                shopListing[index] = {
                    ShoplotName: shopListing[index].ShoplotName,
                    ShoplotBlock: block,
                    ContactNo: e.target.value,
                    isShoplotNameError: shopListing[index].isShoplotNameError,
                    isContactNoError: isContactNoError,
                }
                this.setState({ ShopModalData: shopListing })
                break;

            case "Block":
                block = [{
                    id: e.id,
                    value: e.value,
                    label: e.label,
                }]

                shopListing[index] = {
                    ShoplotName: shopListing[index].ShoplotName,
                    ShoplotBlock: block,
                    ContactNo: shopListing[index].ContactNo,
                    isShoplotNameError: shopListing[index].isShoplotNameError,
                    isContactNoError: shopListing[index].isContactNoError,
                }
                this.setState({ ShopModalData: shopListing })
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

            // let dataCoordinate = []
            // this.state.BlockData.length > 0 && this.state.BlockData.map((data) => {
            //     dataCoordinate.push({
            //         lat: parseFloat(data.Latitude),
            //         lng: parseFloat(data.Longitude),
            //     })
            // })
            // var blockData = {
            //     id: this.BlockListing.length + 1,
            //     block: this.state.BlockName,
            //     ShoplotCoordinate: dataCoordinate
            // }
            // this.BlockListing = [...this.BlockListing, blockData]
            // this.setState(INITIAL_STATE)
        }
        else {
            toast.warning("Input Error: Please cross check on All Shop Details Input")
        }
    }

    OnSubmitShoplotDatabase = () => {
        if (!this.errorChecking()) {

            let replacePolygon = this.state.Location.replace("POLYGON((", '')
            let replacePolygon2 = replacePolygon.replace("POLYGON ((", '')
            let replacePolygon3 = replacePolygon2.replace("))", '')

            let coordinate = replacePolygon3.split(",")
            let latitude = []
            let longitude = []
            coordinate.length > 0 && coordinate.map((data) => {
                if (data.split(" ")[0] === "") {
                    latitude.push(parseFloat(data.split(" ")[2]))
                    longitude.push(parseFloat(data.split(" ")[1]))
                }
                else {
                    latitude.push(parseFloat(data.split(" ")[1]))
                    longitude.push(parseFloat(data.split(" ")[0]))
                }
            })

            this.props.CallAddShopList({
                ShoplotName: this.state.ShopModalData[0].ShoplotName,
                ContactNo: this.state.ShopModalData[0].ContactNo,
                ShoplotBlock: this.state.ShopModalData[0].ShoplotBlock[0].value,
                ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID,
                ShoplotPolygon: this.state.Location,
                Longitude: longitude,
                Latitude: latitude,
                USERID: JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID === 1 ? 0 : JSON.parse(localStorage.getItem("loginUser"))[0].UserID
            })
            this.setState(INITIAL_STATE)
            this.setState({ isShopModal: false })
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
        let shopListing = this.state.ShopModalData

        if (blockListing.length > 0) {
            if (blockListing.filter((data) => data.isLatitudeError === true || data.isLongitudeError === true).length > 0)
                error = true
        }
        if (shopListing.length > 0) {
            if (shopListing.filter((data) => data.isContactNoError === true || data.isShoplotNameError === true).length > 0)
                error = true
            if (this.state.Location === "")
                error = true
            if (shopListing[0].ShoplotBlock[0].id === "")
                error = true
        }
        return error
    }

    setTheState = (value) => {
        this.setState({
            Location: value,
        });
    };

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
                                label="Enter"
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
                                    <Tooltip title="Add Shop">
                                        <IconButton size="small" sx={{ color: "#0074ea", marginRight: 1 }} onClick={() => this.setState({ isShopModal: true })}>
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
                            Data={this.state.isFiltered === true ? this.state.filteredProduct : this.props.block}
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

                    <AlertDialog
                        open={this.state.isShopModal}
                        fullWidth
                        maxWidth="md"
                        handleToggleDialog={() => <>{this.setState(INITIAL_STATE)}{this.setState({ isShopModal: false })}</>}
                        title={"New Shoplot"}
                        showAction={false}
                    >
                        <div className="container-fluid" >
                            <div className="container" style={{ padding: "10px" }}>
                                <div className="row" >
                                    <div className="col-4 col-md-4" style={{ paddingBottom: "10px" }}>
                                        {TextFieldData("text", "outlined", "Shoplot Name", "ShoplotName", this.state.ShopModalData[0].ShoplotName, this.state.ShopModalData[0].isShoplotNameError, 0)}
                                    </div>
                                    <div className="col-4 col-md-4" style={{ paddingBottom: "10px" }}>
                                        <FormControl variant="standard" size="small" fullWidth>
                                            <InputLabel id="Store-label">Block</InputLabel>
                                            <Select
                                                labelId="Block"
                                                id="Block"
                                                name="Block"
                                                value={this.state.ShopModalData[0].ShoplotBlock}
                                                onChange={(e) => this.handleFormInput(e, "Block", 0)}
                                                label="Store"
                                                options={
                                                    isArrayNotEmpty(this.props.block) && this.props.block.map((el, idx) => {
                                                        return { id: el.StorageBlockID, value: el.StorageBlock, label: el.StorageBlock }
                                                    })
                                                }
                                            >
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="col-4 col-md-4" >
                                        {TextFieldData("text", "outlined", "Contact Number", "ContactNo", this.state.ShopModalData[0].ContactNo, this.state.ShopModalData[0].isContactNoError, 0)}
                                    </div>
                                    <hr />
                                    <div className="col-12" style={{ textAlign: "right" }}>
                                        <Tooltip title="Map Guide">
                                            <IconButton size="medium" sx={{ color: "#0074ea", marginRight: 1 }} onClick={() => this.setState({ isMapAlert: true })}>
                                                < InfoIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                    <div className="col-12 col-md-12" style={{ paddingBottom: "10px", height: "350px" }}>
                                        {/* <GoogleMaps
                                            width="100%"
                                            height="500"
                                            zoom={14}
                                            data={this.state}
                                            setValue={this.setTheState}
                                        /> */}
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12 col-md-12" style={{ textAlign: "right" }}>
                                    <Button variant="contained" onClick={() => { this.OnSubmitShoplotDatabase() }} color="primary"  >
                                        Submit
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </AlertDialog >

                    <AlertDialog
                        open={this.state.isMapAlert}
                        fullWidth
                        maxWidth="sm"
                        handleToggleDialog={() => <>{this.setState({ isMapAlert: false })}</>}
                        title={"Map Guide"}
                        showAction={false}
                    >
                        <div className="container-fluid">
                            <div className="container" style={{ padding: "10px" }}>
                                <div className="row">
                                    <label><label style={{ fontWeight: "bold" }}>Left Click</label> on the map to add <RoomIcon /> new coordinate point</label>
                                    <label><label style={{ fontWeight: "bold" }}>Right Click</label> on the marker to <label style={{ color: "red" }}>remove</label> the marker</label>
                                </div>
                            </div>
                        </div >
                    </AlertDialog>
                </div>
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShoplotListing);