import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../store/action/gitAction";
import { Link } from "react-router-dom";

import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

// Share Components
import SearchBar from "../../components/SearchBar/SearchBar"
import Pagination from "../../tools/Pagination";
import TableComponents from "../../components/TableComponents/TableComponents";
import AlertDialog from "../../components/ModalComponent/ModalComponent";
import { isArrayNotEmpty, isStringNullOrEmpty, isContactValid } from "../../tools/Helpers";
import { url } from "../../tools/Helpers";
import GoogleMaps from "../../components/GoogleMap/GoogleMapForPolygonCreation";

// UI Components
import Select from 'react-select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import GroupAddIcon from '@mui/icons-material/Add';
import { toast } from "react-toastify";
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from "@mui/material";
import RoomIcon from '@mui/icons-material/Room';
import InfoIcon from '@mui/icons-material/Info';


function mapStateToProps(state) {
    return {
        shoplot: state.counterReducer["shoplot"],
        grid: state.counterReducer["grid"],
        block: state.counterReducer["block"],
        blockAction: state.counterReducer["blockAction"],
        shoplotAction: state.counterReducer["shoplotAction"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        CallGridList: (prodData) => dispatch(GitAction.CallGridList(prodData)),

        CallShopList: (prodData) => dispatch(GitAction.CallShopList(prodData)),
        CallAddShopList: (prodData) => dispatch(GitAction.CallAddShopList(prodData)),
        CallResetShopAction: () => dispatch(GitAction.CallResetShopAction()),

        CallBlockList: (prodData) => dispatch(GitAction.CallBlockList(prodData)),
        CallAddBlockList: (prodData) => dispatch(GitAction.CallAddBlockList(prodData)),
        CallDeleteBlockList: (prodData) => dispatch(GitAction.CallDeleteBlockList(prodData)),
        CallUpdateBlockList: (prodData) => dispatch(GitAction.CallUpdateBlockList(prodData)),
        CallResetBlockAction: (prodData) => dispatch(GitAction.CallResetBlockAction(prodData)),
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
    filteredShoplot: [],
    isAddModal: false,

    // Database Lisiting
    isOpenOverallDetails: [],
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
    selectedID: [],
    isBlockAlert: false,
}

class ShoplotListing extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE
        this.DatabaseListing = []
        this.PagingListing = [{
            isOpenOverallDetails: [],
            Listing: []
        }]
    }

    componentDidMount() {
        this.props.CallGridList({ ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID })
        this.props.CallBlockList({ ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID })
        this.props.CallShopList({ ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.shoplotAction !== this.props.shoplotAction) {
            if (this.props.shoplotAction.length > 0 && this.props.shoplotAction[0].ReturnVal === 1) {
                this.props.CallResetShopAction()
                toast.success("Data is uploaded")
            }
            else
                this.props.CallShopList({ ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID })
        }

        if (prevProps.blockAction !== this.props.blockAction) {
            if (this.props.blockAction.length > 0 && this.props.blockAction[0].ReturnVal === 1) {
                this.props.CallResetBlockAction()
                toast.success("Data is uploaded")
            }
            else
                this.props.CallBlockList({ ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID })
        }
    }

    ///////////////////////////////////////////////////  Share Function ///////////////////////////////////////////////////
   
    renderTableRows = (data, index) => {
        return (
            <>
                <TableCell
                    component="th"
                    id={`enhanced-table-checkbox-${index}`}
                    scope="row"
                    padding="normal"
                >
                    {data.StorageBlock}   <label onClick={() => this.onBlockRowClick(data)} style={{ color: "blue", paddingTop: "9px", paddingLeft: "10px", fontSize: "10px" }}>Click to edit Block Name</label>
                </TableCell>
            </>
        )
    }

    renderTableCollapseRows = (data, index) => {
        const shoplotView = (shop, i) => {
            return (
                <>
                    {
                        <Link className="nav-link" style={{ paddingLeft: "0px" }} to={{ pathname: url.shoplotDetails(shop.ShoplotID) }}>
                            <div className="row flex-1" style={{ backgroundColor: i % 2 === 1 ? "#f5f5f5" : "#fffff", paddingTop: i % 2 === 1 ? "10px" : "5px", paddingBottom: i % 2 === 1 ? "10px" : "0px" }}>
                                <div className="col-12 col-md-3">
                                    <label style={{ paddingLeft: "10px" }}>{shop.ShoplotName}</label>
                                </div>
                                <div className="col-12 col-md-3">
                                    <label>{shop.ContactNumber}</label>
                                </div>
                            </div>
                        </Link>
                    }
                </>
            )
        }

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
                        this.state.isFiltered === true ?
                            <>
                                {this.state.filteredShoplot !== undefined && this.state.filteredShoplot !== null && this.state.filteredShoplot.length > 0 && this.state.filteredShoplot.filter((x) => x.StorageBlockID === this.state.selectedBlock)
                                    .slice((this.state.page - 1) * this.state.rowsPerPage, (this.state.page - 1) * this.state.rowsPerPage + this.state.rowsPerPage)
                                    .map((data, index) => {
                                        return (shoplotView(data, index))
                                    })
                                }
                            </>
                            :
                            <>
                                {this.props.shoplot !== undefined && this.props.shoplot !== null && this.props.shoplot.length > 0 ? this.props.shoplot.filter((x) => x.StorageBlockID === this.state.selectedBlock)
                                    .slice((this.state.page - 1) * this.state.rowsPerPage, (this.state.page - 1) * this.state.rowsPerPage + this.state.rowsPerPage)
                                    .map((data, index) => {
                                        return (shoplotView(data, index))
                                    })
                                    :
                                    (<div style={{ paddingLeft: "0px", paddingTop: "10px" }}> Temporarily there is no shoplot in this block </div>)}
                            </>
                    }

                    <Pagination
                        current={this.state.page}
                        total={
                            this.state.isFiltered === true ?
                                Math.ceil(this.state.filteredShoplot !== undefined && this.state.filteredShoplot !== null && this.state.filteredShoplot.filter((x) => x.StorageBlockID === this.state.selectedBlock).length / this.state.rowsPerPage)
                                :
                                Math.ceil(this.props.shoplot !== undefined && this.props.shoplot !== null && this.props.shoplot.filter((x) => x.StorageBlockID === this.state.selectedBlock).length / this.state.rowsPerPage)
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
        let DatabaseListing = this.props.block
        let DBShopList = this.props.shoplot
        let DBGridList = this.props.grid
        let selectedShoplot = []
        let selectedBlock = []
        this.setState({ searchKeywords: value })
        this.state.filteredProduct.splice(0, this.state.filteredProduct.length)

        if (DatabaseListing.length > 0) {
            if (this.state.selectedFilter.id === undefined)
                toast.warning("Input Error: A filter range is required")

            else if (parseInt(this.state.selectedFilter.id) === 1) {
                DatabaseListing = DatabaseListing.filter((data) => data.StorageBlock !== null && data.StorageBlock.toLowerCase().includes(value.toLowerCase()));
                this.setState({ filteredProduct: DatabaseListing, isFiltered: true, filteredShoplot: this.props.shoplot })
            }

            else if (parseInt(this.state.selectedFilter.id) === 2) {
                DatabaseListing = DatabaseListing.filter((data) => data.StorageBlock !== null);

                if (value !== "") {
                    DBShopList = DBShopList.filter((data) => data.ShoplotName !== null && data.ShoplotName.toLowerCase().includes(value.toLowerCase()));
                    let removeDuplicate = DBShopList.length > 0 ? DBShopList.filter((ele, ind) => ind === DBShopList.findIndex(elem => parseInt(elem.StorageBlockID) === parseInt(ele.StorageBlockID))) : []
                    removeDuplicate.length > 0 && removeDuplicate.map((shop) => {
                        DatabaseListing.filter((block) => parseInt(block.StorageBlockID) === parseInt(shop.StorageBlockID)).map((x) => {
                            selectedBlock.push(x)
                        })
                    })
                }
                else {
                    selectedBlock = DatabaseListing
                }
                this.setState({ filteredProduct: selectedBlock, isFiltered: true, filteredShoplot: DBShopList })
            }

            else if (parseInt(this.state.selectedFilter.id) === 3) {

                DatabaseListing = DatabaseListing.filter((data) => data.StorageBlock !== null);
                if (value !== "") {
                    DBGridList = DBGridList.length > 0 && DBGridList.filter((data) => data.GridStorageCode !== null && data.GridStorageCode.toLowerCase().includes(value.toLowerCase()))
                    let removeDuplicateGrid = DBGridList.length > 0 ? DBGridList.filter((ele, ind) => ind === DBGridList.findIndex(elem => parseInt(elem.ShoplotID) === parseInt(ele.ShoplotID))) : []

                    removeDuplicateGrid.length > 0 && removeDuplicateGrid.map((grid) => {
                        DBShopList.length > 0 && DBShopList.filter((shop) => parseInt(shop.ShoplotID) === parseInt(grid.ShoplotID)).map((x) => {
                            selectedShoplot.push(x)
                        })
                    })
                    let removeDuplicateShop = selectedShoplot.length > 0 ? selectedShoplot.filter((ele, ind) => ind === selectedShoplot.findIndex(elem => parseInt(elem.StorageBlockID) === parseInt(ele.StorageBlockID))) : []
                    removeDuplicateShop.length > 0 && removeDuplicateShop.map((shop) => {
                        DatabaseListing.filter((block) => parseInt(block.StorageBlockID) === parseInt(shop.StorageBlockID)).map((x) => {
                            selectedBlock.push(x)
                        })
                    })
                }
                else {
                    selectedShoplot = DBShopList
                    selectedBlock = DatabaseListing
                }
                this.setState({ filteredProduct: selectedBlock, isFiltered: true, filteredShoplot: selectedShoplot })
            }
        }
        else toast.warning("No Listing Available for filter")
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

    errorChecking = (data) => {
        let error = false
        let blockListing = this.state.BlockData
        let shopListing = this.state.ShopModalData

        if (blockListing.length > 0 && data === "block") {
            if (blockListing.filter((data) => data.isLatitudeError === true || data.isLongitudeError === true).length > 0)
                error = true
        }
        if (shopListing.length > 0 && data === "shop") {
            if (shopListing.filter((data) => data.isContactNoError === true || data.isShoplotNameError === true).length > 0)
                error = true
            if (this.state.Location === "")
                error = true
            if (shopListing[0].ShoplotBlock[0].id === "")
                error = true
        }
        return error
    }
    
    clearState = () => {
        this.PagingListing = [{
            isOpenOverallDetails: [],
            Listing: []
        }]
        this.setState(INITIAL_STATE)
    }

    ///////////////////////////////////////////////////  Block Function ///////////////////////////////////////////////////

    onBlockRowClick = (data) => {
        this.setState({
            isBlockModal: true,
            isEditBlock: true,
            selectedBlockID: data.StorageBlockID,
            isBlockNameError: false,
            BlockName: data.StorageBlock,
        })
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

    OnSubmitAddBlockDatabase = () => {
        if (!this.errorChecking("block")) {
            this.props.CallAddBlockList({
                ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID,
                BlockName: this.state.BlockName
            })
            this.setState(INITIAL_STATE)
        }
        else {
            toast.warning("Input Error: Please cross check on All Shop Details Input")
        }
    }
    OnDeleteBlockDatabase = () => {
        let selectedID = []
        let containShop = []
        this.state.selectedList.length > 0 && this.state.selectedList.map((data) => {
            selectedID.push(data.StorageBlockID)
        })

        selectedID.map((ID) => {
            this.props.shoplot.length > 0 && this.props.shoplot.filter((x) => parseInt(x.StorageBlockID) === parseInt(ID)).map((data) => {
                containShop.push(data)
            })
        })

        if (containShop.length > 0) {
            this.setState({ selectedID: selectedID, isBlockAlert: true })
        }
        else {
            this.props.CallDeleteBlockList({ StorageBlockID: selectedID })
            this.setState(INITIAL_STATE)
        }
    }

    ///////////////////////////////////////////////////  Shop Function ///////////////////////////////////////////////////

    handlePageChange = (page) => {
        this.setState(() => ({ page }));
    };

    OnSubmitShoplotDatabase = () => {
        if (!this.errorChecking("shop")) {
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
                StorageBlockID: this.state.ShopModalData[0].ShoplotBlock[0].id,
                ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID,
                ShoplotPolygon: this.state.Location,
                Longitude: longitude,
                Latitude: latitude
            })
            this.setState(INITIAL_STATE)
        }
        else {
            toast.warning("Input Error: Please cross check on All Shop Details Input")
        }
    }

    OnSubmitUpdateShoplotDatabase = () => {
        if (!this.errorChecking("block")) {

            this.props.CallUpdateBlockList({
                StorageBlockID: this.state.selectedBlockID,
                BlockName: this.state.BlockName
            })
            this.setState(INITIAL_STATE)
            this.PagingListing = [{
                isOpenOverallDetails: [],
                Listing: []
            }]
        }
        else {
            toast.warning("Input Error: Please cross check on All Shop Details Input")
        }

    }

    // set Map Marker Location
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
                { id: "1", value: "Block" },
                { id: "2", value: "Shoplot" },
                { id: "3", value: "Grid" }
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
                        <div className="col-10 d-inline-flex">
                            <SearchBar
                                id=""
                                placeholder="Enter Block Name, Shoplot Name or Grid Code to search"
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
                                    <Tooltip title="Add Shop And Block">
                                        <IconButton size="small" sx={{ color: "#0074ea", marginRight: 1 }} onClick={() => this.setState({ isAddModal: true })}>
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
                                <IconButton aria-label="delete" onClick={() => { this.OnDeleteBlockDatabase() }}   >
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>}
                            carryDataFromChild={this.carryDataFromChild}
                        />
                    </div>

                    <AlertDialog
                        open={this.state.isBlockModal}
                        fullWidth
                        maxWidth="sm"
                        handleToggleDialog={() => this.clearState()}
                        title={this.state.isEditBlock === true ? "Edit Block" : "New Block"}
                        showAction={false}
                    >
                        <div className="container-fluid">
                            <div className="container" style={{ padding: "10px" }}>
                                <div className="col-12 col-md-12" style={{ paddingBottom: "10px" }}>
                                    {TextFieldData("text", "outlined", "Block Name", "BlockName", this.state.BlockName, this.state.isBlockNameError, 0)}
                                </div>
                                <div className="row">
                                    <div className="col-12 col-md-12" style={{ textAlign: "right" }}>
                                        {
                                            this.state.isEditBlock ?
                                                <Button variant="contained" onClick={() => { this.OnSubmitUpdateShoplotDatabase() }} color="primary" disabled={this.state.isBlockNameError === false && this.state.BlockName !== "" ? false : true}>
                                                    Update
                                                </Button>
                                                :
                                                <Button variant="contained" onClick={() => { this.OnSubmitAddBlockDatabase() }} color="primary" disabled={this.state.isBlockNameError === false && this.state.BlockName !== "" ? false : true}>
                                                    Submit
                                                </Button>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AlertDialog>

                    <AlertDialog
                        open={this.state.isShopModal}
                        fullWidth
                        maxWidth="md"
                        handleToggleDialog={() => this.clearState()}
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
                        handleToggleDialog={() => this.clearState()}
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

                    <AlertDialog
                        open={this.state.isBlockAlert}
                        fullWidth
                        maxWidth="sm"
                        handleToggleDialog={() => this.clearState()}
                        title="Reminder"
                        showAction={false}
                    >
                        <div className="container-fluid">
                            <div className="container">
                                <label style={{ fontSize: "18px" }}>Are you sure to delete this block? Still have a list of shop under this block</label>
                                <div style={{ paddingTop: "10px" }}>
                                    <p className="text-danger" style={{ fontSize: "16px" }}><i>Disclaimer: Shoplot under this block will be remove from list</i></p>
                                </div>
                                <br />
                                <div style={{ textAlign: "right" }}>
                                    <Button variant="contained" color="primary" style={{ margin: "10px" }} onClick={() => {
                                        <>
                                            {this.props.CallDeleteBlockList({ StorageBlockID: this.state.selectedID })}
                                            {this.clearState()}
                                        </>
                                    }}>
                                        Yes
                                    </Button>
                                    <Button variant="contained" color="secondary" onClick={() => this.clearState()}>
                                        No
                                    </Button>
                                </div>
                            </div>
                        </div >
                    </AlertDialog >

                    <AlertDialog
                        open={this.state.isAddModal}
                        fullWidth
                        maxWidth="sm"
                        handleToggleDialog={() => this.clearState()}
                        title="Select the Desired Action"
                        showAction={false}
                    >
                        <div className="container-fluid">
                            <div style={{ textAlign: "center" }}>
                                <Button variant="contained" color="primary" style={{ margin: "10px", padding: "30px" }} onClick={() => { this.setState({ isBlockModal: true }) }}>
                                    Add Block
                                </Button>
                                <Button variant="contained" color="secondary" style={{ margin: "10px", padding: "30px" }} onClick={() => this.setState({ isShopModal: true })}>
                                    Add Shoplot
                                </Button>
                            </div>
                        </div >
                    </AlertDialog >
                </div >
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShoplotListing);