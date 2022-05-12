import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../store/action/gitAction";
import FormHelperText from "@material-ui/core/FormHelperText";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import { Card, CardContent, CardActions } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import { lighten, makeStyles } from "@material-ui/core/styles";
import CardHeader from "@material-ui/core/CardHeader";
import InputAdornment from "@material-ui/core/InputAdornment";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
// import SearchBox from "../../components/SearchBox/SearchBox";
import TableSortLabel from "@material-ui/core/TableSortLabel";
// import logo from "../../assets/logo.svg";

import SearchBar from "../../components/SearchBar/SearchBar"
import SupplierResponseComponent from "./supplierResponse.component";

function mapStateToProps(state) {
    return {
        allpromos: state.counterReducer["promos"],
        allproducts: state.counterReducer["products"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        // callGetPromos: () => dispatch(GitAction.CallGetPromo()),
        CallAllProductsByProductStatus: (prodData) =>
            dispatch(GitAction.CallAllProductsByProductStatus(prodData)),
        // CallUpdatePromoCode: (promoCodeData) =>
        //   dispatch(GitAction.CallUpdatePromoCode(promoCodeData)),
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        margin: "auto",
    },
    cardHeader: {
        padding: theme.spacing(1, 2),
    },
    list: {
        width: 300,
        height: 230,
        backgroundColor: theme.palette.background.paper,
        overflow: "auto",
    },
    button: {
        margin: theme.spacing(0.5, 0),
    },
}));

function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
    return [...a, ...not(b, a)];
}

function TransferList(props) {
    const classes = useStyles();
    const [checked, setChecked] = React.useState([]);
    const [left, setLeft] = React.useState(
        props.allProducts.map((product) => product.ProductName)
    );
    const [right, setRight] = React.useState(props.productsListFromProps);
    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);
    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);
    };

    const numberOfChecked = (items) => intersection(checked, items).length;

    const handleToggleAll = (items) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const updateSearch = (title, e) => {
        if (title == "Products Left") {
            props.setSearchValue(e.target.value, "add");
        } else if (title == "Chosen Products") {
            props.setSearchValue(e.target.value, "remove");
        }
    };

    React.useEffect(() => {
        const timeOutId = setTimeout(() => props.search("add"), 0);
        return () => clearTimeout(timeOutId);
    }, [props.searchWordAdd]);

    React.useEffect(() => {
        const timeOutId = setTimeout(() => props.search("remove"), 0);
        return () => clearTimeout(timeOutId);
    }, [props.searchWordRemove]);

    React.useEffect(() => {
        const timeOutId = setTimeout(() => props.setChosenProducts(right, left), 0);
        return () => clearTimeout(timeOutId);
    }, [right]);

    React.useEffect(() => {
        const timeOutId = setTimeout(
            () => setLeft(props.allProducts.map((product) => product.ProductName)),
            0
        );
        return () => clearTimeout(timeOutId);
    }, [props.allProducts]);

    React.useEffect(() => {
        const timeOutId = setTimeout(
            () =>
                setRight(
                    props.fullChosenProducts.map((product) => product.ProductName)
                ),
            500
        );
        return () => clearTimeout(timeOutId);
    }, [props.fullChosenProducts]);

    const customList = (title, items, valueToBeUsed, allItems) => (
        <Card>
            <div style={{ width: "100%", textAlign: "center" }}>
                <Input
                    style={{ width: "80%", marginBottom: "5px" }}
                    id="input-with-icon-adornment"
                    value={valueToBeUsed}
                    onChange={updateSearch.bind(this, title)}
                    startAdornment={
                        <InputAdornment position="start">
                            {/* <SearchIcon /> */}
                        </InputAdornment>
                    }
                />
            </div>
            <CardHeader
                className={classes.cardHeader}
                avatar={
                    <Checkbox
                        onClick={handleToggleAll(items)}
                        checked={
                            numberOfChecked(items) === items.length && items.length !== 0
                        }
                        indeterminate={
                            numberOfChecked(items) !== items.length &&
                            numberOfChecked(items) !== 0
                        }
                        disabled={items.length === 0}
                        inputProps={{ "aria-label": "all items selected" }}
                    />
                }
                title={title}
                subheader={`${numberOfChecked(items)}/${items.length} selected`}
            />

            <Divider />

            <List className={classes.list} dense component="div" role="list">
                {items.map((value, i) => {
                    const labelId = `transfer-list-all-item-${value}-label`;

                    return (
                        <ListItem
                            key={value}
                            role="listitem"
                            button
                            onClick={handleToggle(value)}
                        >
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ "aria-labelledby": labelId }}
                                />

                                <img
                                    style={{ margin: "10px" }}
                                    height={50}
                                    //   src={JSON.parse(allItems[i].ProductImages)[0].ProductMediaUrl}
                                    src={allItems[i]}
                                />
                            </ListItemIcon>

                            <ListItemText id={labelId} primary={value} />
                        </ListItem>
                    );
                })}
                <ListItem />
            </List>
        </Card>
    );

    return (
        <Grid
            container
            spacing={2}
            justify="center"
            alignItems="center"
            className={classes.root}
        >
            <Grid item>
                {customList(
                    "Products Left",
                    left,
                    props.searchWordAdd,
                    props.imagesLeft
                )}
            </Grid>
            <Grid item>
                <Grid container direction="column" alignItems="center">
                    <Button
                        variant="outlined"
                        size="small"
                        className={classes.button}
                        onClick={handleCheckedRight}
                        disabled={leftChecked.length === 0}
                        aria-label="move selected right"
                    >
                        &gt;
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        className={classes.button}
                        onClick={handleCheckedLeft}
                        disabled={rightChecked.length === 0}
                        aria-label="move selected left"
                    >
                        &lt;
                    </Button>
                </Grid>
            </Grid>
            <Grid item>
                {customList(
                    "Chosen Products",
                    right,
                    props.searchWordRemove,
                    props.imagesChosen
                )}
            </Grid>
        </Grid>
    );
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

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

const useStyles2 = makeStyles((theme) => ({
    root: {
        width: "100%",
    },
    paper: {
        width: "100%",
        margin: "auto",
        padding: "1%",
        // paddingRight: "1%",
        marginTop: "15px",
    },
    table: {
        // margin: "20px",
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
    // highlight:
    //   theme.palette.type === "light"
    //     ? {
    //         color: theme.palette.secondary.main,
    //         backgroundColor: lighten(theme.palette.secondary.light, 0.85),
    //       }
    //     : {
    //         color: theme.palette.text.primary,
    //         backgroundColor: theme.palette.secondary.dark,
    //       },
    title: {
        flex: "1 1 100%",
    },
}));

const headCells = [
    {
        id: "ProductImage",
        numeric: false,
        disablePadding: true,
        label: "Product Image",
    },
    {
        id: "ProductName",
        numeric: false,
        // disablePadding: true,
        label: "Product Name",
    },
];
function DisplayTableHead(props) {
    const {
        onSelectAllClick,
        order,
        orderBy,
        numSelected,
        rowCount,
        onRequestSort,
    } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };
    const classes = useStyles2();
    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? "right" : "left"}
                        padding={headCell.disablePadding ? "none" : "default"}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : "asc"}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === "desc" ? "sorted descending" : "sorted ascending"}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}
class DisplayTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            order: "asc",
            orderBy: "OrderID",
            selected: [],
            page: 0,
            dense: false,
            rowsPerPage: 5,
            detailsShown: false,
            deleteActive: false,
            searchFilter: "",
            searchKeywords: ""
        };
        this.handleRequestSort = this.handleRequestSort.bind(this);
        this.onRowClick = this.onRowClick.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeDense = this.handleChangeDense.bind(this);
        this.isSelected = this.isSelected.bind(this);
    }

    handleRequestSort = (event, property) => {
        const isAsc = this.state.orderBy === property && this.state.order === "asc";
        this.setState({ order: isAsc ? "desc" : "asc" });
        this.setState({ orderBy: property });
    };

    onRowClick = (event, row, index) => {
        this.setState({
            name: row.ProductName,
            orderProductDetail: row.OrderProductDetail,
            orderID: row.OrderID,
            row: index,
            fullName: row.UserFullName,
            phoneNumber: row.UserContactNo,
            email: row.UserEmailAddress,
            address: row.UserAddressLine1,
            detailsShown: false,
        });

        if (this.state.detailsShown) {
            this.setState({
                detailsShown: false,
            });
            //   this.props.setTabsHidden(false);
        } else {
            this.setState({
                detailsShown: true,
            });
            //   this.props.setTabsHidden(true);
        }
    };

    handleChangePage = (event, newPage) => {
        this.setState({ page: newPage });
    };

    handleChangeRowsPerPage = (event) => {
        this.setState({ rowsPerPage: parseInt(event.target.value, 10) });
        this.setState({ page: 0 });
    };

    handleChangeDense = (event) => {
        this.setState({ dense: event.target.checked });
    };

    isSelected = (name) => {
        // this.state.selected.indexOf(name) !== -1;
    };

    render() {
        const { classes } = this.props;
        if (this.props.Data) {
            const emptyRows =
                this.state.rowsPerPage -
                Math.min(
                    this.state.rowsPerPage,
                    this.props.Data.length - this.state.page * this.state.rowsPerPage
                );
        }

        const divStyle = {
            width: "100%",
            margin: "auto",
            padding: "1%",
            marginTop: "15px",
        };

        const table = {
            minWidth: 750,
        };

        var filteredProduct = [];

        const classes2 = {
            border: 0,
            clip: "rect(0 0 0 0)",
            height: 1,
            margin: -1,
            overflow: "hidden",
            padding: 0,
            position: "absolute",
            top: 20,
            width: 1,
        };

        if (this.props.Data) {
            this.props.Data.map((d, i) => {
                d.Picture = (
                    <div>
                        <img height={50} src={d.ProductImage} />
                    </div>
                );
            });
        }

        return (
            <div style={{ margin: "2%" }}>
                <div>
                    {/* <SearchBox
            style={divStyle}
            placeholder="Search..."
            onChange={(e) => this.setState({ searchFilter: e.target.value })}
          /> */}
                    <SearchBar
                        id=""
                        placeholder="Search.."
                        buttonOnClick={() => this.onSearch("", "")}
                        onChange={(e) => this.setState({ searchKeywords: e.target.value })}
                        className="searchbar-input mb-auto"
                        disableButton={this.state.isDataFetching}
                        tooltipText="Search with current data"
                        value={this.state.searchKeywords}
                    />
                    <div>
                        <Paper style={divStyle}>
                            <TableContainer style={{ maxHeight: "300px" }}>
                                <Table
                                    className={table}
                                    aria-labelledby="tableTitle"
                                    size={this.state.dense ? "small" : "medium"}
                                    aria-label="enhanced table"
                                    stickyHeader
                                >
                                    <DisplayTableHead
                                        classes={classes2}
                                        numSelected={this.state.selected.length}
                                        order={this.state.order}
                                        orderBy={this.state.orderBy}
                                        onRequestSort={this.handleRequestSort}
                                        rowCount={this.props.Data ? this.props.Data.length : 0}
                                    />

                                    {this.props.Data
                                        ? this.props.Data.filter((searchedItem) =>
                                            searchedItem.ProductName.toLowerCase().includes(
                                                this.state.searchFilter
                                            )
                                        ).map((filteredItem) => {
                                            filteredProduct.push(filteredItem);
                                        })
                                        : null}
                                    <TableBody>
                                        {stableSort(
                                            filteredProduct,
                                            getComparator(this.state.order, this.state.orderBy)
                                        )
                                            .slice(
                                                this.state.page * this.state.rowsPerPage,
                                                this.state.page * this.state.rowsPerPage +
                                                this.state.rowsPerPage
                                            )
                                            .map((row, index) => {
                                                const isItemSelected = this.isSelected(row.Quantity);
                                                const labelId = `enhanced-table-checkbox-${index}`;
                                                return (
                                                    <TableRow
                                                        hover
                                                        // onClick={(event) =>
                                                        //   this.onRowClick(event, row, index)
                                                        // }
                                                        role="checkbox"
                                                        aria-checked={isItemSelected}
                                                        tabIndex={-1}
                                                        key={row.Quantity}
                                                        selected={isItemSelected}
                                                    >
                                                        <TableCell align="center">{row.Picture}</TableCell>
                                                        <TableCell align="left">
                                                            {row.ProductName}
                                                        </TableCell>
                                                        {/* <TableCell align="left">{row.Quantity}</TableCell>
                              <TableCell align="left">
                                {row.ProductSellingPrice}
                              </TableCell>*/}
                                                        <TableCell align="left">{row.Quantity}</TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        {/* {emptyRows > 0 && (
                      <TableRow
                        style={{
                          height: (this.state.dense ? 33 : 53) * emptyRows,
                        }}
                      >
                        <TableCell colSpan={6} />
                      </TableRow>
                    )} */}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={this.props.Data ? this.props.Data.length : 0}
                                rowsPerPage={this.state.rowsPerPage}
                                page={this.state.page}
                                onChangePage={this.handleChangePage}
                                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                            />
                        </Paper>
                    </div>
                </div>
            </div>
        );
    }
}
class ProductPurchaseOrderDetails extends Component {
    constructor(props) {
        super(props);
        // this.props.callGetPromos();
        this.props.CallAllProductsByProductStatus({
            ProductStatus: "Endorsed",
            UserID: window.localStorage.getItem("id"),
        });
    }

    state = {
        ProductPurchaseOrderID: this.props.data.ProductPurchaseOrderID,
        ProductPurchaseOrderCode: this.props.data.ProductPurchaseOrderCode,
        ProductPurchaseOrderStatus: this.props.data.ProductPurchaseOrderStatus,
        CreatedDate: this.props.data.CreatedDate,
        MerchantID: this.props.data.MerchantID,
        CompanyName: this.props.data.CompanyName,
        CompanyContactNo: this.props.data.CompanyContactNo,
        CompanyWebsite: this.props.data.CompanyWebsite,
        CompanyAddressLine1: this.props.data.CompanyAddressLine1,
        CompanyAddressLine2: this.props.data.CompanyAddressLine2,
        CompanyPoscode: this.props.data.CompanyPoscode,
        CompanyCity: this.props.data.CompanyCity,
        CompanyState: this.props.data.CompanyState,
        CompanyCountryID: this.props.data.CompanyCountryID,
        ProductPurchaseOrderDetail: this.props.data.ProductPurchaseOrderDetail,
        showForm: false,
    };

    onAccept = () => {
        this.setState({
            showForm: true,
        });
    };

    render() {
        let allProductsData = this.props.allproducts
            ? Object.keys(this.props.allproducts).map((key) => {
                return this.props.allproducts[key];
            })
            : {};

        let allpromosData = this.props.allpromos
            ? Object.keys(this.props.allpromos).map((key) => {
                return this.props.allpromos[key];
            })
            : {};
        if (allpromosData.length > 0) {
            var createMenusForDropDownPromos = allpromosData.map((d, i) => {
                return <option value={d.PromotionID}>{d.PromotionTitle}</option>;
            });
        }

        const Search = (type) => {
            var newList = [];
            if (type == "add") {
                newList = allProductsData;

                newList.map((productLeft) => {
                    this.state.fullChosenProducts.map((chosen) => {
                        if (productLeft.ProductName != chosen.ProductName) {
                            newList = newList.filter(
                                (item) => item.ProductName != chosen.ProductName
                            );
                        }
                    });
                });

                var items = [];
                newList.map((product) => {
                    if (
                        product.ProductName.toLowerCase().includes(
                            this.state.searchWordAdd.toLowerCase()
                        )
                    ) {
                        items.push(product);
                    }
                });

                var newItemsImages = items.map(
                    (images) => JSON.parse(images.ProductImages)[0].ProductMediaUrl
                );
                this.setState({
                    productsDisplayed: items,
                    imagesLeft: newItemsImages,
                });
            } else if (type == "remove") {
                var chosenItems = allProductsData;
                this.state.productsLeft.map((product) => {
                    chosenItems = chosenItems.filter(
                        (listItem) => listItem.ProductName != product
                    );
                });
                chosenItems.map((product) => {
                    if (
                        product.ProductName.toLowerCase().includes(
                            this.state.searchWordRemove.toLowerCase()
                        )
                    ) {
                        newList.push(product);
                    }
                });

                var newProductListImages = newList.map(
                    (images) => JSON.parse(images.ProductImages)[0].ProductMediaUrl
                );
                this.setState({
                    fullChosenProducts: newList,
                    fullChosenProductsBackup: chosenItems,
                    imagesChosen: newProductListImages,
                });
            }
        };

        const setSearchValue = (value, type) => {
            if (type == "add") {
                this.setState({
                    searchWordAdd: value,
                });
            } else if (type == "remove") {
                this.setState({
                    searchWordRemove: value,
                });
            }
        };

        const setChosenProducts = (chosen, left) => {
            this.setState({
                chosenProductsNames: chosen,
                productsLeft: left,
            });
            setFullChosenProduct();
        };

        const setFullChosenProduct = () => {
            var newProductList = [];
            this.state.chosenProductsNames.map((chosenProduct) => {
                allProductsData.map((product) => {
                    if (product.ProductName == chosenProduct) {
                        newProductList.push(product);
                    }
                });
            });
            var newList = [];
            var chosenItems = allProductsData;
            this.state.productsLeft.map((product) => {
                chosenItems = chosenItems.filter(
                    (listItem) => listItem.ProductName != product
                );
            });
            chosenItems.map((product) => {
                if (
                    product.ProductName.toLowerCase().includes(
                        this.state.searchWordRemove.toLowerCase()
                    )
                ) {
                    newList.push(product);
                }
            });
            var newProductListImages = newProductList.map(
                (images) => JSON.parse(images.ProductImages)[0].ProductMediaUrl
            );
            var ItemsLeft = allProductsData;
            newProductList.map((productItem) => {
                ItemsLeft = ItemsLeft.filter(
                    (items) => items.ProductName !== productItem.ProductName
                );
            });

            var leftImages = ItemsLeft.map(
                (images) => JSON.parse(images.ProductImages)[0].ProductMediaUrl
            );

            this.setState({
                fullChosenProducts: newProductList,
                fullChosenProductsBackup: newList,
                imagesChosen: newProductListImages,
                imagesLeft: leftImages,
            });
            if (this.state.productsAreNotChosen) {
                setTimeout(
                    function () {
                        this.checkProductsAreChosen();
                    }.bind(this),
                    200
                );
            }
        };

        const back = () => {
            window.location.reload(false);
        };

        const edit = (e) => {
            if (this.state.toBeEdited) {
                this.setState({
                    toBeEdited: false,
                });
            } else {
                this.setState({
                    toBeEdited: true,
                });
            }
        };

        return (
            <div>
                {this.state.showForm ? (
                    <SupplierResponseComponent data={this.state} />
                ) : (
                    <div>
                        {" "}
                        <h2 style={{ margin: "10px" }}>{this.props.pageTitle}</h2>
                        <Button onClick={back}>
                            <i class="fas fa-chevron-left"></i>Back
                        </Button>
                        <Card style={{ width: "80%", margin: "0 auto" }}>
                            <CardContent>
                                <FormControl style={{ width: "100%", marginTop: "5px" }}>
                                    <InputLabel htmlFor="component-simple">
                                        Product Purchase Order Code
                                    </InputLabel>
                                    <Input
                                        id="component-simple"
                                        value={this.state.ProductPurchaseOrderCode}
                                        readOnly
                                    />
                                </FormControl>
                                <div style={{ width: "100%", display: "flex" }}>
                                    <FormControl
                                        style={{
                                            width: "100%",
                                            marginTop: "5px",
                                            marginRight: "5px",
                                        }}
                                    >
                                        <InputLabel htmlFor="component-simple">
                                            Product Purchase Order Status
                                        </InputLabel>
                                        <Input
                                            id="component-simple"
                                            value={this.state.ProductPurchaseOrderStatus}
                                            readOnly
                                        />
                                    </FormControl>
                                    <div style={{ display: "flex", width: "100%" }}>
                                        <FormControl
                                            style={{
                                                width: "100%",
                                                marginTop: "5px",
                                                marginLeft: "5px",
                                            }}
                                        >
                                            <InputLabel htmlFor="component-simple">
                                                Created Date
                                            </InputLabel>
                                            <Input
                                                id="component-simple"
                                                value={this.state.CreatedDate}
                                                readOnly
                                            />
                                        </FormControl>
                                    </div>
                                </div>
                                <FormControl style={{ width: "100%", marginTop: "5px" }}>
                                    <InputLabel htmlFor="component-simple">
                                        Company Name
                                    </InputLabel>
                                    <Input
                                        id="component-simple"
                                        value={this.state.CompanyName}
                                        readOnly
                                    />
                                </FormControl>
                                <div style={{ width: "100%", display: "flex" }}>
                                    <FormControl
                                        style={{
                                            width: "100%",
                                            marginTop: "5px",
                                            marginRight: "5px",
                                        }}
                                    >
                                        <InputLabel htmlFor="component-simple">
                                            Company Contact No.
                                        </InputLabel>
                                        <Input
                                            id="component-simple"
                                            value={this.state.CompanyContactNo}
                                            readOnly
                                        />
                                    </FormControl>

                                    <FormControl
                                        style={{
                                            width: "100%",
                                            marginTop: "5px",
                                            marginleft: "5px",
                                        }}
                                    >
                                        <InputLabel htmlFor="component-simple">
                                            Company Website
                                        </InputLabel>
                                        <Input
                                            id="component-simple"
                                            value={this.state.CompanyWebsite}
                                            readOnly
                                        />
                                    </FormControl>
                                </div>
                                <FormControl style={{ width: "100%", marginTop: "5px" }}>
                                    <InputLabel htmlFor="component-simple">
                                        Company Address Line 1
                                    </InputLabel>
                                    <Input
                                        id="component-simple"
                                        value={this.state.CompanyAddressLine1}
                                        readOnly
                                    />
                                </FormControl>
                                <FormControl style={{ width: "100%", marginTop: "5px" }}>
                                    <InputLabel htmlFor="component-simple">
                                        Company Address Line 2
                                    </InputLabel>
                                    <Input
                                        id="component-simple"
                                        value={this.state.CompanyAddressLine2}
                                        readOnly
                                    />
                                </FormControl>
                                <div style={{ width: "100%", display: "flex" }}>
                                    <FormControl
                                        style={{
                                            width: "100%",
                                            marginTop: "5px",
                                            marginRigth: "5px",
                                        }}
                                    >
                                        <InputLabel htmlFor="component-simple">
                                            Company Postcode
                                        </InputLabel>
                                        <Input
                                            id="component-simple"
                                            value={this.state.CompanyPoscode}
                                            readOnly
                                        />
                                    </FormControl>
                                    <FormControl
                                        style={{
                                            width: "100%",
                                            marginTop: "5px",
                                            marginRigth: "5px",
                                            marginLeft: "5px",
                                        }}
                                    >
                                        <InputLabel htmlFor="component-simple">
                                            Company City
                                        </InputLabel>
                                        <Input
                                            id="component-simple"
                                            value={this.state.CompanyCity}
                                            readOnly
                                        />
                                    </FormControl>
                                    <FormControl
                                        style={{
                                            width: "100%",
                                            marginTop: "5px",
                                            marginLeft: "5px",
                                        }}
                                    >
                                        <InputLabel htmlFor="component-simple">
                                            Company State
                                        </InputLabel>
                                        <Input
                                            id="component-simple"
                                            value={this.state.CompanyState}
                                            readOnly
                                        />
                                    </FormControl>
                                </div>

                                <InputLabel style={{ marginTop: "20px" }}>
                                    Chosen Products
                                </InputLabel>
                                <DisplayTable
                                    Data={JSON.parse(this.props.data.ProductPurchaseOrderDetail)}
                                />
                                <div style={{ width: "100%", textAlign: "center" }}>
                                    <Button
                                        style={{
                                            width: "60%",
                                            padding: "8px",
                                            borderRadius: "5px",
                                            borderColor: "#828282",
                                            fontWeight: "bold",
                                        }}
                                        variant="contained"
                                        onClick={this.onAccept.bind(this)}
                                    >
                                        Accept {this.props.pageTitle}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProductPurchaseOrderDetails);
