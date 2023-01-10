import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../store/action/gitAction";
import { Link } from "react-router-dom";

// Share Components
import SearchBar from "../../components/SearchBar/SearchBar"
import TableComponents from "../../components/TableComponents/TableComponents";
import AlertDialog from "../../components/ModalComponent/ModalComponent";
import { isArrayNotEmpty, isStringNullOrEmpty, isContactValid } from "../../tools/Helpers";
import Logo from "../../assets/logos/logo.png";
import LoadingPanel from "../../tools/LoadingPanel";
import { ArrowRoundedLeft8x13Svg } from '../../assets/svg';
import GoogleMaps from "../../components/GoogleMap/GoogleMapForPolygonCreation";

// UI Components
import InputLabel from '@mui/material/InputLabel';
import GroupAddIcon from '@mui/icons-material/Add';
import { toast } from "react-toastify";
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from "@mui/material";
import FormControl from '@mui/material/FormControl';
import Select from 'react-select';
import createHistory from 'history/createBrowserHistory'
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import RoomIcon from '@mui/icons-material/Room';
import InfoIcon from '@mui/icons-material/Info';
import { Card, CardText, CardBody } from 'reactstrap'


const history = createHistory()

function mapStateToProps(state) {
    return {
        shoplot: state.counterReducer["shoplot"],
        shoplotByID: state.counterReducer["shoplotByID"],
        block: state.counterReducer["block"],
        grid: state.counterReducer["grid"],
        gridAction: state.counterReducer["gridAction"],
        coordinateAction: state.counterReducer["coordinateAction"],
        shoplotAction: state.counterReducer["shoplotAction"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        CallBlockList: (prodData) => dispatch(GitAction.CallBlockList(prodData)),

        CallShopList: (prodData) => dispatch(GitAction.CallShopList(prodData)),
        CallShopListByID: (prodData) => dispatch(GitAction.CallShopListByID(prodData)),
        CallUpdateShopList: (prodData) => dispatch(GitAction.CallUpdateShopList(prodData)),
        CallUpdateShoplotCoordinate: (prodData) => dispatch(GitAction.CallUpdateShoplotCoordinate(prodData)),
        CallDeleteShopList: (prodData) => dispatch(GitAction.CallDeleteShopList(prodData)),
        CallResetShopAction: (prodData) => dispatch(GitAction.CallResetShopAction(prodData)),

        CallGridList: (prodData) => dispatch(GitAction.CallGridList(prodData)),
        CallDeleteGridList: (prodData) => dispatch(GitAction.CallDeleteGridList(prodData)),
        CallUpdateGridList: (prodData) => dispatch(GitAction.CallUpdateGridList(prodData)),
        CallAddGridList: (prodData) => dispatch(GitAction.CallAddGridList(prodData)),
        CallResetGridAction: (prodData) => dispatch(GitAction.CallResetGridAction(prodData)),

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
        gridStorageCode: "",

        shopLot: [],

        isStorageError: false,
    }],

    //Shoplot Modal
    ShopModalData: [{
        ShoplotID: "",
        ShoplotName: "",
        ShoplotCoordinate: "",
        ShoplotPolygonString: "",
        ShoplotBlock: "",
        isShoplotNameError: false,
        isShoplotCoordinateError: false,
        latitude: "",
        longitude: "",
    }],
    Location: "",
    isShopModal: false,
    isMapAlert: false,
    isDeleteShop: false,

    searchKeywords: "",
    filteredProduct: [],
    isFiltered: false,

    height: window.innerHeight * 0.85
}

const tableHeadCells = [
    {
        id: "GridStorage",
        align: 'left',
        numeric: false,
        disablePadding: true,
        label: "Grid Code",
    }
];

class StoreDetailListing extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE
        this.ShoplotListing = []
        this.GridListing = []
        this.props.CallGridList({ ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID })
        this.props.CallBlockList({ ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID })
        this.props.CallShopList({ ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID })
        this.props.CallShopListByID({ ShoplotID: this.props.match.params.shoplotID })
    }

    componentDidMount() {
        if (this.props.shoplotByID !== null && this.props.shoplotByID.length > 0 && this.state.isShoplotSet === false) {
            if (parseInt(this.props.shoplotByID[0].ShoplotID) === parseInt(this.props.match.params.shoplotID))
                this.setShoplot(this.props.shoplotByID)
            else
                this.props.CallShopListByID({ ShoplotID: this.props.match.params.shoplotID })
        }
        if (this.props.grid !== null && this.props.grid.length > 0 && this.state.isGridtSet === false) {
            this.GridListing = this.props.grid.filter((x) => parseInt(x.ShoplotID) === parseInt(this.props.match.params.shoplotID))
            this.setState({ isGridtSet: true })
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.shoplotAction !== this.props.shoplotAction) {
            if (this.props.shoplotAction.length > 0 && this.props.shoplotAction[0].ReturnVal === 1) {
                toast.success("Data is uploaded")
                this.props.CallResetShopAction()
            }
            else {
                if (this.state.isDeleteShop === true)
                    setTimeout(() => {
                        history.push("/ecommerceCMSDev/shoplotList");
                        window.location.reload(false);
                    }, 1000)
                else
                    this.props.CallShopListByID({ ShoplotID: this.props.match.params.shoplotID })
            }
        }

        if (prevProps.gridAction !== this.props.gridAction) {
            if (this.props.gridAction.length > 0 && this.props.gridAction[0].ReturnVal === 1) {
                this.props.CallResetGridAction()
            }
            else
                this.props.CallGridList({ ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID })
        }

        if (prevProps.shoplotByID !== this.props.shoplotByID) {
            if (this.props.shoplotByID !== null && this.props.shoplotByID.length > 0 && this.state.isShoplotSet === false) {
                if (parseInt(this.props.shoplotByID[0].ShoplotID) === parseInt(this.props.match.params.shoplotID))
                    this.setShoplot(this.props.shoplotByID)
                else
                    this.props.CallShopListByID({ ShoplotID: this.props.match.params.shoplotID })
            }
        }
    }
    ///////////////////////////////////////////////////  Share Function ///////////////////////////////////////////////////

    handleFormInput = (e, name, index) => {
        let shopData = this.state.ShopModalData
        let gridData = this.state.GridModalData
        if (name === "Shoplot") {
            let shopLotListing = []
            shopLotListing = [{
                id: e.id,
                label: e.label,
                value: e.value,
            }]

            gridData[0] = {
                gridId: gridData[0].gridId,
                gridStorageCode: gridData[0].gridStorageCode,
                shopLot: shopLotListing,
                isStorageError: false,
            }
            this.setState({ GridModalData: gridData })
        }

        if (name === "GridStorage") {
            let isStorageError = false
            if (isStringNullOrEmpty(e.target.value))
                isStorageError = true

            gridData[0] = {
                gridId: gridData[0].gridId,
                gridStorageCode: e.target.value,
                shopLot: gridData[0].shopLot,
                isStorageError: isStorageError,
            }
            this.setState({ GridModalData: gridData })
        }

        if (name === "Block") {
            let block = []
            block = [{
                id: e.id,
                label: e.label,
                value: e.value,
            }]

            shopData[0] = {
                ShoplotID: shopData[0].ShoplotID,
                ShoplotName: shopData[0].ShoplotName,
                ContactNumber: shopData[0].ContactNumber,
                ShoplotCoordinate: shopData[0].ShoplotCoordinate,
                ShoplotPolygonString: shopData[0].ShoplotPolygonString,
                ShoplotBlock: block,
                isShoplotNameError: shopData[0].isShoplotNameError,
                isContactError: shopData[0].isContactError,
            }
            this.setState({ ShopModalData: shopData })
        }

        if (name === "ContactNumber") {
            let isContactError = false
            if (isStringNullOrEmpty(e.target.value) || !isContactValid(e.target.value))
                isContactError = true

            shopData[0] = {
                ShoplotID: shopData[0].ShoplotID,
                ShoplotName: shopData[0].ShoplotName,
                ContactNumber: e.target.value,
                ShoplotCoordinate: shopData[0].ShoplotCoordinate,
                ShoplotPolygonString: shopData[0].ShoplotPolygonString,
                ShoplotBlock: shopData[0].ShoplotBlock,
                isShoplotNameError: shopData[0].isShoplotNameError,
                isContactError: isContactError,
            }
            this.setState({ ShopModalData: shopData })
        }

        if (name === "ShoplotName") {
            let isShoplotNameError = false
            if (isStringNullOrEmpty(e.target.value))
                isShoplotNameError = true

            shopData[0] = {
                ShoplotID: shopData[0].ShoplotID,
                ShoplotName: e.target.value,
                ContactNumber: shopData[0].ContactNumber,
                ShoplotCoordinate: shopData[0].ShoplotCoordinate,
                ShoplotPolygonString: shopData[0].ShoplotPolygonString,
                ShoplotBlock: shopData[0].ShoplotBlock,
                isShoplotNameError: isShoplotNameError,
                isContactError: shopData[0].isContactError,
            }
            this.setState({ ShopModalData: shopData })
        }
    }

    errorChecking = (data) => {
        let error = false
        let gridListing = this.state.GridModalData
        let shopListing = this.state.ShopModalData

        if (gridListing.length > 0 && data === "grid") {
            if (gridListing.filter((data) => data.isStorageError === true || data.gridStorageCode === undefined).length > 0)
                error = true
            if (gridListing[0].shopLot[0].id === "")
                error = true
        }
        if (shopListing.length > 0 && data === "shop") {
            if (shopListing.filter((data) => data.isContactNoError === true || data.isShoplotNameError === true).length > 0)
                error = true
            if (shopListing.filter((data) => data.ContactNumber === undefined || data.ShoplotName === undefined).length > 0)
                error = true
            if (shopListing[0].ShoplotBlock[0].id === "")
                error = true
        }
        return error
    }

    searchSpace = (value) => {
        let DatabaseListing = this.props.grid.length > 0 && this.props.grid.filter((x) => parseInt(x.ShoplotID) === parseInt(this.props.match.params.shoplotID))
        this.setState({ searchKeywords: value })
        this.state.filteredProduct.splice(0, this.state.filteredProduct.length)

        if (DatabaseListing.length > 0) {
            DatabaseListing = DatabaseListing.filter((data) => data.GridStorageCode !== null && data.GridStorageCode.toLowerCase().includes(value.toLowerCase()));
            this.setState({ filteredProduct: DatabaseListing, isFiltered: true })
        }
        else toast.warning("No Listing Available for filter")
    }



    ///////////////////////////////////////////////////  Shop Function ///////////////////////////////////////////////////

    setShoplot = (shoplot) => {
        this.ShoplotListing = shoplot
        let shopLotListing = []
        let block = []

        let selectedBlock = this.props.block.length > 0 && this.props.block.filter((x) => parseInt(x.StorageBlockID) === parseInt(shoplot[0].StorageBlockID))
        let replacePolygon = shoplot[0].ShoplotPolygonString.replace("POLYGON((", '')
        let replacePolygon2 = replacePolygon.replace("POLYGON ((", '')
        let replacePolygon3 = replacePolygon2.replace("))", '')

        let coordinate = replacePolygon3.split(",")
        let ShopsCoordinate = []
        coordinate.length > 0 && coordinate.map((data) => {

            if (data.split(" ")[0] === "") {
                ShopsCoordinate.push({
                    lat: parseFloat(data.split(" ")[2]),
                    lng: parseFloat(data.split(" ")[1])
                })
            }
            else {
                ShopsCoordinate.push({
                    lat: parseFloat(data.split(" ")[1]),
                    lng: parseFloat(data.split(" ")[0])
                })
            }
        })

        block = [{
            id: selectedBlock[0].StorageBlockID,
            value: selectedBlock[0].StorageBlock,
            label: selectedBlock[0].StorageBlock,
        }]

        shopLotListing[0] = {
            ShoplotID: shoplot[0].ShoplotID,
            ShoplotName: shoplot[0].ShoplotName,
            ContactNumber: shoplot[0].ContactNumber,
            ShoplotPolygonString: shoplot[0].ShoplotPolygonString,
            ShoplotBlock: block,
            isShoplotNameError: false,
            isShoplotCoordinateError: false,
            isContactError: false,
            latitude: ShopsCoordinate[0].lat,
            longitude: ShopsCoordinate[0].lng,
            ShoplotCoordinate: ShopsCoordinate
        }
        this.setState({ ShopModalData: shopLotListing, isShoplotSet: true })
    }

    OnSubmitUpdateShoplot = () => {
        if (!this.errorChecking("shop")) {
            if (this.state.Location === "") {
                this.props.CallUpdateShopList({
                    ShoplotName: this.state.ShopModalData[0].ShoplotName,
                    ContactNo: this.state.ShopModalData[0].ContactNumber,
                    ShoplotID: this.state.ShopModalData[0].ShoplotID,
                    ShoplotBlock: this.state.ShopModalData[0].ShoplotBlock[0].value,
                    StorageBlockID: this.state.ShopModalData[0].ShoplotBlock[0].id,
                    ShoplotPolygon: this.state.ShopModalData[0].ShoplotPolygonString
                })
            }
            else {
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

                this.props.CallUpdateShopList({
                    ShoplotName: this.state.ShopModalData[0].ShoplotName,
                    ContactNo: this.state.ShopModalData[0].ContactNumber,
                    ShoplotID: this.state.ShopModalData[0].ShoplotID,
                    ShoplotBlock: this.state.ShopModalData[0].ShoplotBlock[0].value,
                    StorageBlockID: this.state.ShopModalData[0].ShoplotBlock[0].id,
                    ShoplotPolygon: this.state.Location
                })
                this.props.CallUpdateShoplotCoordinate({
                    ShoplotID: this.state.ShopModalData[0].ShoplotID,
                    Longitude: longitude,
                    Latitude: latitude
                })
            }
            this.setState(INITIAL_STATE)
            this.setState({ isShopModal: false })
        }
        else {
            toast.warning("Input Error: Please cross check on All Shoplot Details Input")
        }
    }

    setTheState = (value) => {
        this.setState({
            Location: value,
        });
    };

    ///////////////////////////////////////////////////  Grid Function ///////////////////////////////////////////////////

    renderTableRows = (data, index) => {
        return (
            <TableCell align="left"> {data.GridStorage}  </TableCell>
        )
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
            gridStorageCode: row.GridStorageCode,
            shopLot: shopLotListing,
            isStorageError: false,
        }
        this.setState({ GridModalData: gridData, isGridModal: true, isEditBlock: true })
    }

    addGridModal = () => {
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
            shopLot: shopLotListing,
            isStorageError: false,
        }
        this.setState({ GridModalData: gridData, isGridModal: true })
    }

    OnSubmitAddGridDatabase = () => {
        if (!this.errorChecking("grid")) {
            this.props.CallAddGridList({
                GridStorageCode: this.state.GridModalData[0].gridStorageCode,
                ShoplotID: this.state.GridModalData[0].shopLot[0].id,
                ShoplotName: this.state.GridModalData[0].shopLot[0].value,
                ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID
            })
            this.setState(INITIAL_STATE)
            this.setState({ isGridModal: false })
        }
        else {
            toast.warning("Input Error: Please cross check on All Grid Details Input")
        }
    }

    OnSubmitUpdateGridDatabase = () => {
        if (!this.errorChecking("grid")) {
            this.props.CallUpdateGridList({
                GridStorageID: this.state.GridModalData[0].gridId,
                GridStorageCode: this.state.GridModalData[0].gridStorageCode,
                ShoplotID: this.state.GridModalData[0].shopLot[0].id,
                ShoplotName: this.state.GridModalData[0].shopLot[0].value
            })
            this.setState(INITIAL_STATE)
            this.setState({ isGridModal: false })
        }
        else {
            toast.warning("Input Error: Please cross check on All Grid Details Input")
        }
    }

    onDeleteGrid = () => {
        let selectedID = []
        this.state.selectedListID.length > 0 && this.state.selectedListID.map((data) => {
            selectedID.push(data.GridStorageID)
        })
        this.props.CallDeleteGridList({ GridStorageID: selectedID })
    }

    render() {
        const productInfoLabelStyle = {
            fontSize: "14px",
            fontWeight: "bold",
        }

        const renderButtonOnTableTopRight = () => {
            return (
                <div className="d-flex">
                    <Tooltip title="Add New Grid">
                        <IconButton size="medium" sx={{ color: "#0074ea", marginRight: 1 }} onClick={() => this.addGridModal()}>
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
                        <div className="row" style={{ display: "flex", marginLeft: "1%", marginRight: "1%" }}>
                            <div className="col-6">
                                {/* <div> */}
                                <Button onClick={() => typeof this.props.backToList === "function" && this.handleBack()}>
                                    <ArrowRoundedLeft8x13Svg fontSize="inherit" />
                                    <Link style={{ paddingLeft: "10px", paddingRight: "10px", textDecoration: "none", color: "black" }} to={"/shoplotList"}>
                                        Back
                                    </Link>
                                </Button>
                                <label style={{ fontWeight: "BOLD", fontSize: "30px" }}>{typeof this.ShoplotListing !== "undefined" ? this.ShoplotListing[0].ShoplotName : "Shoplot Information"}</label>
                            </div>
                            <div className="col-6" style={{
                                textAlign: "right"
                            }} >
                                <Tooltip title="Delete Shoplot">
                                    <IconButton
                                        onClick={() =>
                                            <>
                                                {this.props.CallDeleteShopList({ ShoplotID: this.props.match.params.shoplotID })}
                                                {this.setState({ isDeleteShop: true })}
                                            </>
                                        }
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-6">
                                <div style={{ marginLeft: "2%", marginBottom: "2%" }}>
                                    <Card style={{ width: '100%', height: this.state.height }}>
                                        <CardBody>
                                            <CardText>
                                                <div className="row">
                                                    <div className="col-lg-10">
                                                        <h5 style={{ textAlign: "left" }} onClick={() => this.setState({ isShopModal: true, isMapAlert: true })} >Shop Information <label onClick={() => this.setState({ isShopModal: true, isMapAlert: true })} style={{ color: "blue", paddingTop: "8px", paddingLeft: "3px", fontSize: "9px" }}>Click to view Shop Info</label></h5>
                                                    </div>
                                                </div>
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
                                                            <div className="col-lg-3">
                                                                <label style={productInfoLabelStyle}>Block :</label>
                                                            </div>
                                                            <div className="col-lg-8">
                                                                {this.props.block.length > 0 && this.props.block.filter((x) => parseInt(x.StorageBlockID) === parseInt(this.ShoplotListing[0].StorageBlockID)).map((data) => {
                                                                    return (<label>{data.StorageBlock}</label>)
                                                                })}
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-3">
                                                                <label style={productInfoLabelStyle}>Contact :</label>
                                                            </div>
                                                            <div className="col-lg-8">
                                                                <label>{this.ShoplotListing[0].ContactNumber !== "" ? this.ShoplotListing[0].ContactNumber : "-"}</label>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-3">
                                                                <label style={productInfoLabelStyle}>Coordinate :</label>
                                                            </div>
                                                            <div className="col-lg-8">
                                                                <label>{this.ShoplotListing[0].ShoplotPolygonString !== "" ? this.ShoplotListing[0].ShoplotPolygonString : "-"}</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row" style={{ paddingTop: "20px" }}>
                                                    <div className="col-12">
                                                        {/* <GoogleMaps
                                                            zoom={16}
                                                            width="80%"
                                                            height="500"
                                                            longitude={this.state.ShopModalData[0].longitude}
                                                            latitude={this.state.ShopModalData[0].latitude}
                                                            polypath={this.state.ShopModalData}
                                                            markerLabel={this.state.ShopModalData[0].ShoplotName}
                                                            toView={true}
                                                        /> */}
                                                    </div>
                                                </div>
                                            </CardText>
                                        </CardBody>
                                    </Card>
                                </div>
                            </div>

                            <div className="col-6">
                                <div style={{ marginRight: "2%", marginBottom: "2%" }}>
                                    <Card style={{ width: '100%', height: this.state.height }}>
                                        <CardBody>
                                            <CardText>
                                                <div className="row">
                                                    <div className="col-lg-10">
                                                        <h5 style={{ textAlign: "left" }} >Grid Listing </h5>
                                                    </div>
                                                </div>
                                                <div className="col-12 d-inline-flex" style={{ paddingBottom: "20px" }}>
                                                    <SearchBar
                                                        id=""
                                                        placeholder="Enter Grid Code to search"
                                                        buttonOnClick={() => this.onSearch("", "")}
                                                        onChange={(e) => this.searchSpace(e.target.value)}
                                                        className="searchbar-input mb-auto"
                                                        disableButton={this.state.isDataFetching}
                                                        tooltipText="Search with current data"
                                                        value={this.state.searchKeywords}
                                                    />
                                                </div>
                                                <TableComponents
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
                                                    Data={
                                                        this.state.isFiltered === true ?
                                                            this.state.filteredProduct :
                                                            this.props.grid.length > 0 && this.props.grid.filter((x) => parseInt(x.ShoplotID) === parseInt(this.props.match.params.shoplotID))}
                                                    onSelectRow={(e) => this.setState({ selectedListID: e })}
                                                    onSelectAllRows={(e) => this.setState({ selectedListID: e })}
                                                    onTableRowClick={this.onTableRowClick}       // optional, onTableRowClick = (event, row) => { }. The function should follow the one shown, as it will return the data from the selected row
                                                    SelectionActionButtons={
                                                        <Tooltip title="Delete">
                                                            <IconButton aria-label="delete" onClick={() => { this.onDeleteGrid() }}   >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    }
                                                />

                                            </CardText>
                                        </CardBody>
                                    </Card>
                                </div>
                            </div>
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
                                <div className="container" style={{ padding: "10px" }}>
                                    <div className="row">
                                        <div className="col-4 col-md-4" style={{ paddingBottom: "10px" }}>
                                            {TextFieldData("text", "outlined", "Shoplot Name", "ShoplotName", this.state.ShopModalData[0].ShoplotName, this.state.ShopModalData[0].isShoplotNameError, 0)}
                                        </div>
                                        <div className="col-4 col-md-4" style={{ paddingBottom: "30px" }}>
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
                                        <div className="col-4 col-md-4" style={{ paddingBottom: "10px" }}>
                                            {TextFieldData("text", "outlined", "Contact Number", "ContactNumber", this.state.ShopModalData[0].ContactNumber, this.state.ShopModalData[0].isContactError, 0)}
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
                                                zoom={15}
                                                width="100%"
                                                height="500"
                                                data={this.state}
                                                setValue={this.setTheState}
                                                longitude={this.state.ShopModalData[0].longitude}
                                                latitude={this.state.ShopModalData[0].latitude}
                                                polypath={this.state.ShopModalData}
                                                markerLabel={this.state.ShopModalData[0].ShoplotName}
                                            /> */}
                                        </div>
                                    </div>
                                    {
                                        <div className="row">
                                            <div className="col-12 col-md-12" style={{ textAlign: "right" }}>
                                                <Button variant="contained" onClick={() => { this.OnSubmitUpdateShoplot() }} color="primary"  >
                                                    Update
                                                </Button>
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
                            <div className="container-fluid" style={{ height: "300px" }}>
                                <div className="container" style={{ padding: "10px" }}>
                                    <div className="col-12 col-md-12" style={{ paddingBottom: "10px" }}>
                                        {TextFieldData("text", "outlined", "Grid Storage", "GridStorage", this.state.GridModalData[0].gridStorageCode, this.state.GridModalData[0].isStorageError, 0)}
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
                                    </div>
                                    {
                                        <div className="row">
                                            <div className="col-12 col-md-12" style={{ textAlign: "right" }}>
                                                {
                                                    this.state.isEditBlock ?
                                                        <Button variant="contained" onClick={() => { this.OnSubmitUpdateGridDatabase() }} color="primary"  >
                                                            Update
                                                        </Button>
                                                        :
                                                        <Button variant="contained" onClick={() => { this.OnSubmitAddGridDatabase() }} color="primary"  >
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
                                        <label>Red polygon  is current shoplot's location</label>
                                        <label><label style={{ fontWeight: "bold" }}>Left Click</label> on the map to add <RoomIcon /> new coordinate point</label>
                                        <label><label style={{ fontWeight: "bold" }}>Right Click</label> on the marker to <label style={{ color: "red" }}>remove</label> the marker</label>
                                        <label><label style={{ fontWeight: "bold" }}>Scroll Up </label> to Zoom In</label>
                                        <label><label style={{ fontWeight: "bold" }}>Scroll Down </label> to Zoom Out</label>
                                    </div>
                                </div>
                            </div >
                        </AlertDialog>
                    </div >
                </div >
                : <LoadingPanel />
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoreDetailListing);