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
import LoadingPanel from "../../tools/LoadingPanel";
import ResponsiveDatePickers from "../../tools/datePicker";
import { url } from "../../tools/Helpers";
import { ArrowRoundedLeft8x13Svg } from '../../assets/svg';

// UI Components
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

import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from 'react-select';

// Function Usage
import { Card, CardText, CardBody } from 'reactstrap'

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


const INITIAL_STATE = {
    isShoplotSet: false,
    isGridtSet: false,
    isEditBlock: false,

    // Grid Storage
    isGridModal: false,
    selectedListID: [],
    GridModalData: [{
        gridId: "",
        gridStorage: "",
        rental: "",

        shopLot: [],

        isStorageError: false,
        isRentalError: false,
    }],

    //Shoplot Modal
    ShopModalData: [{
        ShoplotID: "",
        ShoplotName: "",
        ShoplotCoordinate: "",
        ShoplotPolygonString: "",
        ShoplotBlock: "",
        isShoplotNameError: false,
        isShoplotCoordinateError: false
    }],
    isShopModal: false

}

const tableHeadCells = [
    {
        id: "GridStorage",
        align: 'left',
        numeric: false,
        disablePadding: true,
        label: "Grid Code",
    },
    {
        id: "RentalPrice",
        align: 'left',
        numeric: false,
        disablePadding: false,
        label: "Rental Price (Month)",
    },
];



class StoreDetailListing extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE
        this.ShoplotListing = []
        this.GridListing = []
        this.props.CallGridList({ ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID })
        this.props.CallShopList({ Block: "A" })
    }

    componentDidMount() {
        if (this.props.shoplot !== null && this.props.shoplot.length > 0 && this.state.isShoplotSet === false) {
            console.log("COMPONENTDIDUPDATE HERE", this.props.shoplot)
            this.ShoplotListing = this.props.shoplot.length > 0 && this.props.shoplot.filter((x) => parseInt(x.ShoplotID) === parseInt(this.props.match.params.shoplotID))
            this.setState({ isShoplotSet: true })
        }
        if (this.props.grid !== null && this.props.grid.length > 0 && this.state.isGridtSet === false) {
            this.GridListing = this.props.grid
            this.setState({ isGridtSet: true })
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.shoplot !== null && this.props.shoplot.length > 0 && this.state.isShoplotSet === false) {
            this.ShoplotListing = this.props.shoplot.length > 0 && this.props.shoplot.filter((x) => parseInt(x.ShoplotID) === parseInt(this.props.match.params.shoplotID))
            this.setState({ isShoplotSet: true })
        }
        // if (this.props.grid !== null && this.props.grid.length > 0 && this.state.isGridtSet === false) {
        //     this.GridListing = this.props.grid
        //     this.setState({ isGridtSet: true })
        // }
    }

    renderTableRows = (data, index) => {
        return (
            <>
                <TableCell align="left"> {data.GridStorage}  </TableCell>
                <TableCell align="left"> {data.GridStorage} </TableCell>
            </>
        )
    }

    handleFormInput = (e, name, index) => {
        if (name === "Shoplot") {
            let gridData = this.state.GridModalData
            let shopLotListing = []
            shopLotListing = [{
                id: e.id,
                label: e.label,
                value: e.value,
            }]

            gridData[0] = {
                gridId: gridData[0].gridId,
                gridStorage: gridData[0].gridStorage,
                rental: gridData[0].rental,
                shopLot: shopLotListing,
                isStorageError: false,
                isRentalError: false,
            }
            this.setState({ GridModalData: gridData })
        }

        if (name === "GridStorage") {
            let gridData = this.state.GridModalData
            let isStorageError = false
            if (isStringNullOrEmpty(e.target.value))
                isStorageError = true

            gridData[0] = {
                gridId: gridData[0].gridId,
                gridStorage: e.target.value,
                rental: gridData[0].rental,
                shopLot: gridData[0].shopLot,
                isStorageError: isStorageError,
                isRentalError: gridData[0].isRentalError,
            }
            this.setState({ GridModalData: gridData })
        }

        if (name === "Rental") {
            let gridData = this.state.GridModalData
            let isRentalError = false
            if (isStringNullOrEmpty(e.target.value))
                isRentalError = true

            gridData[0] = {
                gridId: gridData[0].gridId,
                gridStorage: gridData[0].gridStorage,
                rental: e.target.value,
                shopLot: gridData[0].shopLot,
                isStorageError: gridData[0].isStorageError,
                isRentalError: isRentalError,
            }
            this.setState({ GridModalData: gridData })
        }
    }

    addModal = () => {
        let gridData = this.state.GridModalData
        let shopLotListing = []

        shopLotListing = [{
            id: this.props.match.params.shoplotID,
            value: this.ShoplotListing[0].ShoplotName,
            label: this.ShoplotListing[0].ShoplotName,
        }]

        gridData[0] = {
            gridId: "",
            gridStorage: "",
            rental: "",
            shopLot: shopLotListing,
            isStorageError: false,
            isRentalError: false,
        }
        this.setState({ GridModalData: gridData, isGridModal: true })
    }

    onTableRowClick = (event, row) => {
        let gridData = []
        let shopLotListing = []

        shopLotListing = [{
            id: this.props.match.params.shoplotID,
            value: this.ShoplotListing[0].ShoplotName,
            label: this.ShoplotListing[0].ShoplotName,
        }]

        gridData[0] = {
            gridId: row.GridStorageID,
            gridStorage: row.GridStorage,
            rental: row.Rental,
            shopLot: shopLotListing,
            isStorageError: false,
            isRentalError: false,
        }
        this.setState({ GridModalData: gridData, isGridModal: true, isEditBlock: true })
    }

    editShop = () => {

        let shopLotListing = this.ShoplotListing

        shopLotListing[0] = {
            ShoplotID: shopLotListing[0].ShoplotID,
            ShoplotName: shopLotListing[0].ShoplotName,
            ShoplotCoordinate: shopLotListing[0].ShoplotCoordinate,
            ShoplotPolygonString: shopLotListing[0].ShoplotPolygonString,
            ShoplotBlock: shopLotListing[0].ShoplotBlock,
            isShoplotNameError: false,
            isShoplotCoordinateError: false
        }
        this.setState({ ShopModalData: shopLotListing, isShopModal: true })
    }

    OnSubmitDatabase = () => {
        if (!this.errorChecking()) {
            var gridData = {
                GridStorage: this.state.GridModalData[0].gridStorage,
                GridRental: this.state.GridModalData[0].rental
            }
            this.GridListing = [...this.GridListing, gridData]
            this.setState(INITIAL_STATE)
        }
        else {
            toast.warning("Input Error: Please cross check on All Grid Details Input")
        }
    }

    OnSubmitUpdateDatabase = () => {
        if (!this.errorChecking()) {
            let dbGridListing = this.GridListing
            let index = dbGridListing.findIndex(x => parseInt(x.GridStorageID) === parseInt(this.state.GridModalData[0].gridId))

            dbGridListing[index] = {
                GridStorage: this.state.GridModalData[0].gridStorage,
                GridRental: this.state.GridModalData[0].rental
            }
            this.GridListing = dbGridListing
            this.setState({ isGridModal: false })
            // this.setState(INITIAL_STATE)
        }
        else {
            toast.warning("Input Error: Please cross check on All Grid Details Input")
        }

    }

    errorChecking = () => {
        let error = false
        let gridListing = this.state.GridModalData

        if (gridListing.length > 0) {
            if (gridListing.filter((data) => data.isStorageError === true || data.isRentalError === true).length > 0)
                error = true
            if (gridListing.filter((data) => data.GridStorage === undefined || data.GridRental === undefined).length > 0)
                error = true
        }
        return error
    }


    render() {
        console.log(" this.GridListing", this.GridListing)
        console.log(" this.ShoplotListing", this.props.match.params.shoplotID)
        console.log(" this.props", this.props)
        console.log("this.state", this.state.GridModalData)
        const productInfoLabelStyle = {
            fontSize: "14px",
            fontWeight: "bold",
        }

        const renderButtonOnTableTopRight = () => {
            return (
                <div className="d-flex">
                    <Tooltip title="Add New Grid">
                        <IconButton size="medium" sx={{ color: "#0074ea", marginRight: 1 }} onClick={() => this.addModal()}>
                            <GroupAddIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            )
        }

        const TextFieldData = (type, variant, title, name, stateValue, error, index) => {
            return (
                <div className="col-12 col-md-12" style={{ paddingBottom: "10px" }}>
                    <TextField variant={variant} type={type} size="small" fullWidth label={title} value={stateValue} name={name} onChange={(e) => this.handleFormInput(e, name, index)}
                        required />
                    {error && <FormHelperText sx={{ color: 'red' }} id={error}>Invalid {title} </FormHelperText>}
                </div>
            )
        }

        return (
            this.ShoplotListing !== undefined && this.ShoplotListing.length > 0 ?
                <div style={{ width: "100%" }}>
                    <div >
                        {/* <div style={{ margin: "1%" }}>
                        </div> */}
                        <div style={{ display: "flex", marginLeft: "1%" }}>
                            <Button onClick={() => typeof this.props.backToList === "function" && this.handleBack()}>
                                <ArrowRoundedLeft8x13Svg fontSize="inherit" />
                                <Link style={{ paddingLeft: "10px", paddingRight: "10px", textDecoration: "none", color: "black" }} to={"/shoplotList"}>
                                    Back
                                </Link>
                            </Button>
                            <h3>{typeof this.ShoplotListing !== "undefined" ? this.ShoplotListing[0].ShoplotName : "Shoplot Information"}</h3>
                        </div>

                        <div style={{ marginLeft: "2%", marginRight: "2%", marginBottom: "2%" }}>
                            <Card style={{ width: '100%' }}>
                                <CardBody>
                                    <CardText>
                                        <div className="row">
                                            <div className="col-lg-10">
                                                <h6 style={{ textAlign: "left" }} >Shop Information</h6>
                                            </div>
                                            <div className="col-lg-2" style={{ textAlign: "right" }}>
                                                <Button style={{ backgroundColor: "white" }} onClick={() => this.editShop()}>
                                                    View Details
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-8">
                                                <div className="row">
                                                    <div className="col-3">
                                                        <div className="row">
                                                            <img
                                                                width="200"
                                                                height="100%"
                                                                src={Logo}
                                                                onError={(e) => { e.target.onerror = null; e.target.src = Logo }}
                                                                alt=""
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-9">
                                                        <div className="row">
                                                            <div className="col-lg-4">
                                                                <label style={productInfoLabelStyle}>Block :</label>
                                                            </div>
                                                            <div className="col-lg-8">
                                                                <label>{this.ShoplotListing[0].ShoplotBlock !== "" ? this.ShoplotListing[0].ShoplotBlock : "-"}</label>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-4">
                                                                <label style={productInfoLabelStyle}>Contact :</label>
                                                            </div>
                                                            <div className="col-lg-8">
                                                                <label>{this.ShoplotListing[0].ContactNumber !== "" ? this.ShoplotListing[0].ContactNumber : "-"}</label>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-4">
                                                                <label style={productInfoLabelStyle}>Coordinate :</label>
                                                            </div>
                                                            <div className="col-lg-8">
                                                                <label>{this.ShoplotListing[0].ShoplotPolygonString !== "" ? this.ShoplotListing[0].ShoplotPolygonString : "-"}</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-4">

                                            </div>
                                        </div>
                                    </CardText>
                                </CardBody>
                            </Card>
                        </div>

                        <div style={{ marginLeft: "2%", marginRight: "2%", marginBottom: "2%" }}>
                            <Card style={{ width: '100%' }}>
                                <CardBody>
                                    <CardText>
                                        <TableComponents
                                            // table settings 
                                            tableTopLeft={
                                                <div className="d-flex">
                                                    <h5 style={{ fontWeight: 600 }}>Grid Storage</h5>
                                                </div>
                                            }
                                            tableTopRight={renderButtonOnTableTopRight()}                        //components on table top right
                                            tableOptions={{
                                                dense: true,                // optional, default is false
                                                tableOrderBy: 'asc',        // optional, default is asc
                                                sortingIndex: "GridStorage",        // require, it must the same as the desired table header
                                                stickyTableHeader: false,    // optional, default is true
                                            }}
                                            paginationOptions={[8, 15, 20, { label: 'All', value: -1 }]} // optional, by default it will hide the table pagination. You should set settings for pagination options as in array, eg.: [5, 100, 250, { label: 'All', value: -1 }]
                                            tableHeaders={tableHeadCells}        //required
                                            tableRows={{
                                                renderTableRows: this.renderTableRows,   // required, it is a function, please refer to the example I have done in Table Components
                                                checkbox: true,                          // optional, by default is true
                                                checkboxColor: "primary",                // optional, by default is primary, as followed the MUI documentation
                                                onRowClickSelect: false                  // optional, by default is false. If true, the ** onTableRowClick() ** function will be ignored
                                            }}
                                            selectedIndexKey={"GridStorageID"}                    // required, as follow the data targetting key of the row, else the data will not be chosen when checkbox is click. 

                                            Data={this.GridListing}                                 // required, the data that listing in the table
                                            onSelectRow={(e) => this.setState({ selectedListID: e })}
                                            onSelectAllRows={(e) => this.setState({ selectedListID: e })}
                                            onTableRowClick={this.onTableRowClick}       // optional, onTableRowClick = (event, row) => { }. The function should follow the one shown, as it will return the data from the selected row
                                            SelectionActionButtons={
                                                <Tooltip title="Delete">
                                                    <IconButton aria-label="delete" onClick={() => { this.onDelete() }}   >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            }
                                        />

                                    </CardText>
                                </CardBody>
                            </Card>
                        </div>

                        <AlertDialog
                            open={this.state.isShopModal}
                            fullWidth
                            maxWidth="md"
                            handleToggleDialog={() => <>{this.setState(INITIAL_STATE)}{this.setState({ isShopModal: false })}</>}
                            title={this.state.ShopModalData[0].ShoplotName}
                            showAction={false}
                        >
                            <div className="container-fluid">
                                {/*   shopLotListing[0] = {
            ShoplotID: shopLotListing[0].ShoplotID,
            ShoplotName: shopLotListing[0].ShoplotName,
            ShoplotCoordinate: shopLotListing[0].ShoplotCoordinate,
            ShoplotPolygonString: shopLotListing[0].ShoplotPolygonString,
            ShoplotBlock: shopLotListing[0].ShoplotBlock,
            isShoplotNameError: false,
            isShoplotCoordinateError: false
        }
        this.setState({ ShopModalData: shopLotListing, isShopModal: true }) */}
                                <div className="container" style={{ padding: "10px" }}>
                                    <div className="col-12 col-md-12" style={{ paddingBottom: "10px" }}>
                                        {TextFieldData("text", "outlined", "Shoplot Name", "ShoplotName", this.state.ShopModalData[0].ShoplotName, this.state.GridModalData[0].isShoplotNameError, 0)}
                                    </div>
                                    {/* <div className="col-12 col-md-12" style={{ paddingBottom: "10px" }}>
                                        {TextFieldData("number", "outlined", "Rental (Monthly)", "ShoplotCoordinate", this.state.ShoplotCoordinate[0].rental, this.state.GridModalData[0].isShoplotCoordinateError, 0)}
                                    </div> */}
                                    <div className="col-12 col-md-12" style={{ paddingBottom: "30px" }}>
                                        <FormControl variant="standard" size="small" fullWidth>
                                            <InputLabel id="Store-label">Shoplot</InputLabel>
                                            <Select
                                                labelId="Shoplot"
                                                id="Shoplot"
                                                name="Shoplot"
                                                value={this.state.GridModalData[0].shopLot}
                                                onChange={(e) => this.handleFormInput(e, "Shoplot", 0)}
                                                label="Store"
                                                options={
                                                    isArrayNotEmpty(this.props.shoplot) && this.props.shoplot.map((el, idx) => {
                                                        return { id: el.ShoplotID, value: el.ShoplotName, label: el.ShoplotName }
                                                    })
                                                }
                                            >
                                            </Select>
                                        </FormControl>
                                        {console.log("this.props.shoplot", this.props.shoplot)}
                                    </div>
                                    {
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
                            open={this.state.isGridModal}
                            fullWidth
                            maxWidth="sm"
                            handleToggleDialog={() => <>{this.setState(INITIAL_STATE)}{this.setState({ isGridModal: false })}</>}
                            title={this.state.isEditGrid === true ? this.state.GridName : "New Grid Storage"}
                            showAction={false}
                        >
                            <div className="container-fluid">
                                <div className="container" style={{ padding: "10px" }}>
                                    <div className="col-12 col-md-12" style={{ paddingBottom: "10px" }}>
                                        {TextFieldData("text", "outlined", "Grid Storage", "GridStorage", this.state.GridModalData[0].gridStorage, this.state.GridModalData[0].isStorageError, 0)}
                                    </div>
                                    <div className="col-12 col-md-12" style={{ paddingBottom: "10px" }}>
                                        {TextFieldData("number", "outlined", "Rental (Monthly)", "Rental", this.state.GridModalData[0].rental, this.state.GridModalData[0].isRentalError, 0)}
                                    </div>
                                    <div className="col-12 col-md-12" style={{ paddingBottom: "30px" }}>
                                        <FormControl variant="standard" size="small" fullWidth>
                                            <InputLabel id="Store-label">Shoplot</InputLabel>
                                            <Select
                                                labelId="Shoplot"
                                                id="Shoplot"
                                                name="Shoplot"
                                                value={this.state.GridModalData[0].shopLot}
                                                onChange={(e) => this.handleFormInput(e, "Shoplot", 0)}
                                                label="Store"
                                                options={
                                                    isArrayNotEmpty(this.props.shoplot) && this.props.shoplot.map((el, idx) => {
                                                        return { id: el.ShoplotID, value: el.ShoplotName, label: el.ShoplotName }
                                                    })
                                                }
                                            >
                                            </Select>
                                        </FormControl>
                                        {console.log("this.props.shoplot", this.props.shoplot)}
                                    </div>
                                    {
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
                : <LoadingPanel />
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoreDetailListing);