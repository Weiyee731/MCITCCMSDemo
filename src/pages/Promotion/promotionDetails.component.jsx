import React, { Component } from "react";
import { connect } from "react-redux";
import { Card, CardContent } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import { GitAction } from "../../store/action/gitAction";
//----------------------------------Table Things---------------------------------------------------
import { Table, TableBody, TableCell, TableRow } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import PropTypes from "prop-types";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import AddIcon from '@mui/icons-material/Add';
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import Input from "@mui/material/Input";
import Logo from "../../assets/logos/logo.png";
import TableSortLabel from "@mui/material/TableSortLabel";
import TableHead from "@mui/material/TableHead";
import InputLabel from "@mui/material/InputLabel";
import DeleteIcon from '@mui/icons-material/Delete';

// -------------------------------------------------ADD PRODUCT THINGS--------------------------------------------------------
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import InputAdornment from "@mui/material/InputAdornment";
import CardHeader from "@mui/material/CardHeader";
import createHistory from 'history/createBrowserHistory'
import { ThreeSixtyTwoTone, ThumbUpSharp } from "@mui/icons-material";
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const history = createHistory()

//----------------------------------------------------------------------------------------------------
function mapStateToProps(state) {
    return {
        // allstocks: state.counterReducer["products"],
        allproducts: state.counterReducer["productsListing"],
        allpromo: state.counterReducer["promotions"],
        updatepromo: state.counterReducer["newPromoObj"],
    };
}

// ------------------------------------------- Call call-----------------------------------------------
function mapDispatchToProps(dispatch) {
    return {
        CallViewPromotion: (promoData) =>
            dispatch(GitAction.CallViewPromotion(promoData)),
        CallUpdatePromotion: (promoData) =>
            dispatch(GitAction.CallUpdatePromotion(promoData)),

        CallAllProductsListing: (prodData) => dispatch(GitAction.CallAllProductsListing(prodData)), // To call Product List For Promotion Product
        // CallAllProductsByProductStatus: (prodData) =>
        //   dispatch(GitAction.CallAllProductsByProductStatus(prodData)), // To call Product List For Promotion Product
    };
}

// ------------------------------------- Add Product --------------------------------------------------
function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
    return [...a, ...not(b, a)];
}


//------------------------------------- Table Component ------------------------------------------------
function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

class PromotionDetailsComponent extends Component {
    state = {
        order: "asc",
        orderBy: "productName",
        ProductID: [],
        page: 0,
        dense: false,
        rowsPerPage: 5,
        searchFilter: "",
        Discount: null,

        isChecked: true,
        PromotionID: this.props.data.PromotionID,
        PromotionTitle: this.props.data.PromotionTitle,
        PromotionDesc: this.props.data.PromotionDesc,
        DiscountPercentage: this.props.data.DiscountPercentage,
        promoStart: new Date().toLocaleString(),
        promoEnd: new Date().toLocaleString(),
        PromotionStartDate: new Date(this.props.data.BeginDate),
        PromotionEndDate: new Date(this.props.data.EndDate),

        startDateNotSet: false,
        startDateInvalid: false,
        endDateNotSet: false,
        endDateInvalid: false,
        PromotionTitleEmpty: false,
        PromotionDescEmpty: false,

        toBeEdited: false,
        currentPage: 1,
        rowPerPage: 5,
        isAddOpen: false,

        unselectedListing: [],
        selectedListing: []
    };

    handleChange(data, e) {
        if (data === "PromotionTitle") {
            this.setState({
                PromotionTitle: e.target.value,
            });
        } else if (data === "PromotionDesc") {
            this.setState({
                PromotionDesc: e.target.value,
            });
        } else if (data === "PromotionStartDate") {
            if (e !== null) {
                // if (moment(e, "MM/DD/YYYY", true).isValid()) {
                //     var StartDate =
                //         e.getFullYear() +
                //         "" +
                //         parseInt(e.getMonth() + 1) +
                //         "" +
                //         ((e.getDate() < 10 ? "0" : "") + e.getDate());

                //     this.setState({
                //         PromotionStartDate: e,
                //         promoStart: StartDate,
                //     });
                // } else {
                //     this.setState({
                //         PromotionEndDate: e,
                //         promoStart: "",
                //     });
                // }
            } else {
                this.setState({ promoStart: "", });
            }
            setTimeout(
                function () {
                    this.checkStartDate();
                }.bind(this),
                200
            );
            setTimeout(
                function () {
                    this.checkEndDate();
                }.bind(this),
                200
            );
        } else if (data === "PromotionEndDate") {
            if (e !== null) {
                // if (moment(e, "MM/DD/YYYY", true).isValid()) {
                //     var EndDate =
                //         e.getFullYear() +
                //         "" +
                //         parseInt(e.getMonth() + 1) +
                //         "" +
                //         ((e.getDate() < 10 ? "0" : "") + e.getDate());

                //     this.setState({
                //         PromotionEndDate: e,
                //         promoEnd: EndDate,
                //     });
                // } else {
                //     this.setState({
                //         PromotionEndDate: e,
                //         promoEnd: "",
                //     });
                // }
            } else {
                this.setState({
                    promoEnd: "",
                });
            }

            setTimeout(
                function () {
                    this.checkEndDate();
                }.bind(this),
                200
            );
            setTimeout(
                function () {
                    this.checkStartDate();
                }.bind(this),
                200
            );
        } else if (data === "DiscountPercentage") {
            this.setState({
                DiscountPercentage: e.target.value,
            });
        }
    }

    checkPromotionTitle = () => {
        if (
            this.state.PromotionTitle === "" ||
            this.state.PromotionTitle === null
        ) {
            this.setState({
                PromotionTitleEmpty: true,
            });
        } else {
            this.setState({
                PromotionTitleEmpty: false,
            });
        }
    };

    checkPromotionDesc = () => {
        if (this.state.PromotionDesc === "" || this.state.PromotionDesc === null) {
            this.setState({
                PromotionDescEmpty: true,
            });
        } else {
            this.setState({
                PromotionDescEmpty: false,
            });
        }
    };

    checkStartDate = () => {
        if (
            this.state.PromotionStartDate === "" ||
            this.state.PromotionStartDate === null
        ) {
            this.setState({
                startDateNotSet: true,
            });
        } else {
            this.setState({
                startDateNotSet: false,
            });
        }
        var currentDate = new Date(this.props.data.BeginDate);
        var currentDay = currentDate.getDate();
        var currentMonth = parseInt(currentDate.getMonth() + 1);

        var currentYear = currentDate.getFullYear();

        if (currentYear > this.state.PromotionStartDate.getFullYear()) {
        } else if (currentYear === this.state.PromotionStartDate.getFullYear()) {
            if (currentMonth > this.state.PromotionStartDate.getMonth() + 1) {
                this.setState({
                    startDateInvalid: true,
                });
            } else if (
                currentMonth ===
                this.state.PromotionStartDate.getMonth() + 1
            ) {
                if (currentDay > this.state.PromotionStartDate.getDate()) {
                    this.setState({
                        startDateInvalid: true,
                    });
                } else {
                    this.setState({
                        startDateInvalid: false,
                    });
                }
            } else {
                this.setState({
                    startDateInvalid: false,
                });
            }
        } else {
            this.setState({
                startDateInvalid: false,
            });
        }
    };

    checkEndDate = () => {
        if (
            this.state.PromotionEndDate === "" ||
            this.state.PromotionEndDate == null
        ) {
            this.setState({
                endDateNotSet: true,
            });
        } else {
            this.setState({
                endDateNotSet: false,
            });
        }

        var startDay = this.state.PromotionStartDate.getDate();
        var startMonth = parseInt(this.state.PromotionStartDate.getMonth() + 1);

        var startYear = this.state.PromotionStartDate.getFullYear();

        if (startYear > this.state.PromotionEndDate.getFullYear()) {
            this.setState({
                endDateInvalid: true,
            });
        } else if (startYear === this.state.PromotionEndDate.getFullYear()) {
            if (startMonth > this.state.PromotionEndDate.getMonth() + 1) {
                this.setState({
                    endDateInvalid: true,
                });
            } else if (startMonth === this.state.PromotionEndDate.getMonth() + 1) {
                if (startDay > this.state.PromotionEndDate.getDate()) {
                    this.setState({
                        endDateInvalid: true,
                    });
                } else {
                    this.setState({
                        endDateInvalid: false,
                    });
                }
            } else {
                this.setState({
                    startDateInvalid: false,
                });
            }
        } else {
            this.setState({
                startDateInvalid: false,
            });
        }
    };

    checkProductsAreChosen = () => {
        if (this.state.fullChosenProductsBackup.length > 0) {
            this.setState({
                productsAreNotChosen: false,
            });
        } else {
            this.setState({
                productsAreNotChosen: true,
            });
        }
    };

    checkDiscount = () => {
        if (this.state.Discount === "" || this.state.Discount === null) {
            this.setState({
                DiscountEmpty: true,
            });
        } else {
            this.setState({
                DiscountEmpty: false,
            });
        }
    };

    checkEverything = () => {
        this.checkPromotionTitle();
        this.checkPromotionDesc();
        this.checkStartDate();
        this.checkEndDate();
        this.checkProductsAreChosen();
        this.checkDiscount();

        setTimeout(
            function () {
                this.uploadFile();
            }.bind(this),
            500
        );
    };

    uploadFile = () => {
        if (
            !(
                this.state.PromotionTitleEmpty ||
                this.state.PromotionDescEmpty ||
                this.state.productsAreNotChosen ||
                this.state.DiscountEmpty ||
                this.state.startDateInvalid ||
                this.state.endDateInvalid ||
                this.state.startDateNotSet ||
                this.state.endDateNotSet
            )
        ) {
            var ProductIDOnly = [];
            this.state.fullChosenProductsBackup.map((product) => {
                ProductIDOnly.push(product.ProductID);
            });
            var EndDate =
                this.state.PromotionEndDate.getFullYear() +
                "" +
                (this.state.PromotionEndDate.getMonth() + 1 < 10 ? "0" : "") +
                (this.state.PromotionEndDate.getMonth() + 1) +
                "" +
                ((this.state.PromotionEndDate.getDate() < 10 ? "0" : "") +
                    this.state.PromotionEndDate.getDate());

            var StartDate =
                this.state.PromotionStartDate.getFullYear() +
                "" +
                (this.state.PromotionStartDate.getMonth() + 1 < 10 ? "0" : "") +
                (this.state.PromotionStartDate.getMonth() + 1) +
                "" +
                ((this.state.PromotionStartDate.getDate() < 10 ? "0" : "") +
                    this.state.PromotionStartDate.getDate());

            const promoInfo = {
                PromotionID: this.props.data.PromotionID,
                PromotionTitle: this.state.PromotionTitle,
                PromotionDesc: this.state.PromotionDesc,
                BannerImage: null,
                SlideOrder: null,
                promoStart: StartDate,
                promoEnd: EndDate,
                ProductID: ProductIDOnly,
                DiscountPercentage: this.state.DiscountPercentage,
            };

            setTimeout(
                function () {
                    alert("Submitted!");
                    this.props.CallUpdatePromotion(promoInfo);
                }.bind(this),
                500
            );
            setTimeout(
                function () {
                    // this.props.history.push("/viewProductPromotion");
                    //   browserHistory.push("/viewProductPromotion");
                    history.push("/ecommerceCMSDev/viewProductPromotion")
                    window.location.reload(false);
                }.bind(this),
                500
            );
        }
    };

    handlePageChange = (page) => {
        this.setState({ currentPage: page })
    };

    componentDidMount() {
        this.props.CallAllProductsListing({
            type: "Merchant",
            typeValue: JSON.parse(localStorage.getItem("loginUser")) !== undefined ? JSON.parse(localStorage.getItem("loginUser"))[0].UserID : 0,
            userId: JSON.parse(localStorage.getItem("loginUser")) !== undefined ? JSON.parse(localStorage.getItem("loginUser"))[0].UserID : 0,
            productPage: 999,
            page: 1,
            ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID
        })
    }




    render() {
        const { data, data2 } = this.props;
        const back = () => {
            window.location.reload(false);
        };

        // ------------------------------------------------------------ Edit Component ---------------------------------------------------
        const edit = (e) => {
            if (this.state.toBeEdited) {
                this.setState({ toBeEdited: false, });
            } else {
                this.setState({ toBeEdited: true, });
            }
        };

        const classes = {
            root: {
                width: "100%",
            },
            paper: {
                width: "100%",
                margin: "1% auto",
                padding: "1%",
            },
            submitBtn: {
                float: "right",
            },
            table: {
                minWidth: 750,
            },
            visuallyHidden: {
                border: 0,
                clip: "rect(0 0 0 0)",
                height: 1,
                margin: -1,
                overflow: "hidden",
                padding: 0,
                position: "absolute",
                top: 20,
                width: 1,
            },
            title: {
                flex: "1 1 100%",
            },
            height: "700px"
        };

        // ------------------------------------------------------- Add Product -------------------------------------------------------


        const checkPromo = () => {
            let listing = []

            listing = this.props.allpromo.length > 0 && this.props.allpromo.filter((x) => x.PromotionID === this.props.data.PromotionID)

            // else
            //   listing = this.props.allproducts.length > 0 && this.props.allproducts.filter((x) => x.ProductID !== this.props.data.PromotionID)
            return listing

        }

        const checkSelected = (data) => {
            let allProductListing = []

            allProductListing = this.props.allproducts
            let filteredListing = []
            let selectedID = [1, 3, 5]
            selectedID.length > 0 && selectedID.map((data) => {

                if (filteredListing.length === 0) {
                    allProductListing.length > 0 && allProductListing.filter((x) => x.ProductID !== data).map((filteredData) => {
                        filteredListing.push(filteredData)
                    })
                }
                else
                    filteredListing = filteredListing.filter((x) => x.ProductID !== data)
            })

            // this.setState({ unselectedListing: filteredListing })
            return filteredListing

        }

        const handleSelectedProduct = (productID, index) => {
            let tempArray = this.state.selectedListing
            if (this.state.selectedListing.length > 0) {

                // if (tempArray.length > 0) {
                //   this.state.unselectedListing.map((X) => {

                //     if (X === productID) {
                //       let tempIndex = selectedProductIndex
                //       let tempID = selectedRowID

                //       tempIndex = selectedProductIndex.filter((x) => selectedProductIndex.indexOf(x) !== selectedProductDetailsID.indexOf(X))
                //       tempID = selectedProductDetailsID.filter((x) => parseInt(x) !== parseInt(product.OrderProductDetailID))
                //       setSelectedProductDetailsID(tempID)
                //     }
                //   })
                // }
                // else {
                //   setSelectedProductDetailsID(selectedProductDetailsID => [...selectedProductDetailsID, product.OrderProductDetailID])
                // }
            }
            else {
                // this.setState({selectedListing: })
                // setSelectedProductDetailsID(selectedProductDetailsID => [...selectedProductDetailsID, product.OrderProductDetailID])
            }
        }


        const TablePromoListing = (tableData) => {
            return (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ fontWeight: "bold" }} align="center" >Product Name</TableCell>
                                <TableCell style={{ fontWeight: "bold" }} align="right">Stock</TableCell>
                                <TableCell style={{ fontWeight: "bold" }} align="right">Original Price&nbsp;(RM)</TableCell>
                                <TableCell style={{ fontWeight: "bold" }} align="right">Discounted Price&nbsp;(RM)</TableCell>
                                <TableCell style={{ fontWeight: "bold" }} align="right">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableData.map((row) => (
                                <TableRow
                                    key={row.ProductID}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        <div className="row">
                                            <div style={{ paddingLeft: "5px" }}>
                                                <img src={row.ProductImage !== undefined && row.ProductImage !== null ? row.ProductImage : Logo}
                                                    height={50}
                                                    width={50}
                                                    alt={row.ProductName} onError={(e) => (e.target.src = Logo)} />
                                            </div>
                                            <div style={{ padding: "10px" }}><label> {row.ProductName}</label></div>
                                        </div>
                                    </TableCell>
                                    <TableCell align="right"><label> {row.ProductStockAmount}</label></TableCell>
                                    <TableCell align="right"><label> {row.ProductPrice}</label></TableCell>
                                    <TableCell align="right"><label> {row.ProductPrice}</label></TableCell>
                                    <TableCell align="right"> <DeleteIcon fontSize="small" /></TableCell>
                                </TableRow>
                            ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            )
        }

        return (
            <div>
                {" "}
                <div className="App" style={{ width: "100%", alignContent: "center" }}   >
                    <div className="App-header">
                        <h1 style={{ margin: "10px" }}>Promotion Details</h1>
                        <Button onClick={back}>
                            <i className="fas fa-chevron-left"></i>Back
                        </Button>
                    </div>
                    <Card style={classes} >
                        <CardContent>
                            <div className="row">
                                <div className="col-2">
                                    <label>Promotion Title : </label>
                                </div>
                                <div className="col-4">
                                    <TextField
                                        id="outlined-size-small" size="small"
                                        width="100%"
                                        className="font"
                                        variant="outlined"
                                        value={this.state.PromotionTitle}
                                        disabled={this.state.toBeEdited === false ? true : false}
                                        onChange={(x) => this.handleChange("PromotionTitle", x)}
                                    />
                                </div>
                                <div className="col-6" style={{ float: "right" }}>
                                    <Button variant="outlined" onClick={edit} style={{ float: "right" }} >
                                        {this.state.toBeEdited ? "Cancel" : "Edit"}
                                    </Button>
                                    {this.state.toBeEdited &&
                                        <Button variant="outlined" style={{ backgroundColor: "#28a745", color: "white", float: "right" }}
                                            onClick={() => console.log("SAVE")}>
                                            Save
                                        </Button>
                                    }
                                </div>
                            </div>
                            <br />
                            <div className="row">
                                <div className="col-2">
                                    <label>Percentage Discount : </label>
                                </div>
                                <div className="col-4">
                                    <TextField
                                        id="outlined-size-small" size="small"
                                        width="100%"
                                        className="font"
                                        type="number"
                                        variant="outlined"
                                        value={this.state.DiscountPercentage}
                                        disabled={this.state.toBeEdited === false ? true : false}
                                        onChange={(x) => this.handleChange("DiscountPercentage", x)}
                                    />
                                </div>
                            </div>
                            <br />
                            <div className="row">
                                <div className="col-2">
                                    <label>Promotion Description : </label>
                                </div>
                                <div className="col-10">
                                    <TextField
                                        id="outlined-size-small" size="small"
                                        width="100%"
                                        className="font"
                                        multiline
                                        rows={4}
                                        variant="outlined"
                                        value={this.state.PromotionDesc}
                                        disabled={this.state.toBeEdited === false ? true : false}

                                        onChange={(x) => this.handleChange("PromotionDesc", x)}
                                    />
                                </div>
                            </div>
                            <br />
                            <div style={{ display: "flex", justifyContent: "space-around" }}   >
                                <div style={{ width: "100%", paddingRight: "20px" }}>

                                    <div className="row">
                                        <div className="col-2">
                                            <label>Promotion Start Date: </label>
                                        </div>
                                        <div className="col-4">
                                            {/* <DatePicker
                                                size="small"
                                                value={this.state.PromotionStartDate}
                                                format="dd/MM/yyyy"
                                                onChange={this.handleChange.bind(this, "PromotionStartDate")}
                                                className={`w-100`}
                                                disabled={this.state.toBeEdited === false ? true : false}
                                            /> */}
                                            {this.state.startDateNotSet ||
                                                this.state.startDateInvalid ? (
                                                <FormHelperText style={{ color: "red" }}>
                                                    Please enter a valid start date.
                                                </FormHelperText>
                                            ) : null}
                                        </div>

                                        <div className="col-2">
                                            <label>Promotion End Date: </label>
                                        </div>
                                        <div className="col-4">
                                            {/* <DatePicker
                                                size="small"
                                                placeholderText="End Date"
                                                onChange={this.handleChange.bind(this, "PromotionEndDate")}
                                                format="dd/MM/yyyy"
                                                value={this.state.PromotionEndDate}
                                                className={`w-100`}
                                                disabled={this.state.toBeEdited === false ? true : false}
                                            /> */}
                                            {this.state.endDateNotSet || this.state.endDateInvalid ? (
                                                <FormHelperText style={{ color: "red" }}>
                                                    Please enter a valid end date.
                                                </FormHelperText>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <br />
                            <div className="row">
                                <div className="col-2">
                                    <label>Choosen Products ({checkPromo()[0].PromotionDetail !== null ? JSON.parse(checkPromo()[0].PromotionDetail).length : 0})</label>
                                </div>
                                <div className="col-10" style={{ textAlign: "right" }}>
                                    <Button variant="outlined" onClick={() => this.setState({ isAddOpen: true })} style={{ float: "right" }} >
                                        Add More Product
                                    </Button>
                                </div>
                            </div>
                            <br />
                            {
                                this.props.data.PromotionDetail !== null ?
                                    TablePromoListing(checkPromo()[0].PromotionDetail !== null && JSON.parse(checkPromo()[0].PromotionDetail))
                                    :
                                    <div style={{ textAlign: "center" }}>
                                        <label>Temporarily there is no products for this promotion</label>
                                    </div>
                            }
                            {/* <Pagination
                                current={this.state.currentPage}
                                total={
                                    checkPromo()[0].PromotionDetail !== null ? JSON.parse(checkPromo()[0].PromotionDetail).length / this.state.rowPerPage : 0
                                    // this.state.variationTypeList.length > 0 ?
                                    //   Math.ceil(this.state.variationTypeList.length / this.state.variationRowsPerPage)
                                    //   : 0
                                }
                                onPageChange={this.handlePageChange}
                            /> */}
                        </CardContent>
                    </Card>
                </div>


                <Dialog
                    maxWidth={'md'}
                    open={this.state.isAddOpen}
                // TransitionComponent={Transition}
                // onClose={handleClose}
                // aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle>Select Product to Add Into Promotion</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">


                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                <Checkbox
                                                // checked={
                                                //   selectedProductDetailsID.length > 0 ?
                                                //     selectedProductDetailsID.filter(x => x === product.OrderProductDetailID).length > 0 ?
                                                //       true : false : false
                                                // }
                                                // onClick={() => handleSelectedProduct(product, i)}
                                                />
                                            </TableCell>

                                            <TableCell style={{ fontWeight: "bold" }} align="center" >Product Name</TableCell>
                                            <TableCell style={{ fontWeight: "bold" }} align="right">Stock</TableCell>
                                            <TableCell style={{ fontWeight: "bold" }} align="right">Original Price&nbsp;(RM)</TableCell>
                                            <TableCell style={{ fontWeight: "bold" }} align="right">Discounted Price&nbsp;(RM)</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {checkSelected(checkPromo()[0].PromotionDetail !== null && JSON.parse(checkPromo()[0].PromotionDetail)).length > 0 &&
                                            checkSelected(checkPromo()[0].PromotionDetail !== null && JSON.parse(checkPromo()[0].PromotionDetail)).map((row, i) => (
                                                <TableRow
                                                    key={row.ProductID}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell>
                                                        <Checkbox
                                                            // checked={
                                                            //   selectedProductDetailsID.length > 0 ?
                                                            //     selectedProductDetailsID.filter(x => x === product.OrderProductDetailID).length > 0 ?
                                                            //       true : false : false
                                                            // }
                                                            onClick={() => handleSelectedProduct(row.ProductID, i)}
                                                        />
                                                    </TableCell>
                                                    <TableCell component="th" scope="row">
                                                        <div className="row">
                                                            <div style={{ paddingLeft: "5px" }}>
                                                                <img src={row.ProductImage !== undefined && row.ProductImage !== null ? row.ProductImage : Logo}
                                                                    height={50}
                                                                    width={50}
                                                                    alt={row.ProductName} onError={(e) => (e.target.src = Logo)} />
                                                            </div>
                                                            <div style={{ padding: "10px" }}><label> {row.ProductName}</label></div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell align="right"><label> {row.ProductStockAmount}</label></TableCell>
                                                    <TableCell align="right"><label> {row.ProductPrice}</label></TableCell>
                                                    <TableCell align="right"><label> {row.ProductPrice}</label></TableCell>
                                                </TableRow>
                                            ))
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>


                            {/* } */}
                            {/* {
                this.props.allproducts !== null ?
                  TablePromoListing(checkPromo()[0].PromotionDetail !== null && JSON.parse(checkPromo()[0].PromotionDetail))
                  :
                  <div style={{ textAlign: "center" }}>
                    <label>All available products has been added into the promo</label>
                  </div>
              } */}
                            {/* Let Google help apps determine location. This means sending anonymous
              location data to Google, even when no apps are running. */}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        {/* <Button onClick={handleClose}>Disagree</Button>
            <Button onClick={handleClose}>Agree</Button> */}
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PromotionDetailsComponent);
