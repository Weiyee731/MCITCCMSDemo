import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { GitAction } from "../../../store/action/gitAction";
// import "../../app/App.scss";
// import "react-table/react-table.css";
// import ProductDetailsComponent from "./ProductInfo";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
import TableContainer from "@material-ui/core/TableContainer";
import TablePagination from "@material-ui/core/TablePagination";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import DoneAllIcon from '@mui/icons-material/DoneAll';
import Logo from "../../../assets/logos/logo.png";
// import SearchBox from "../../components/SearchBox/SearchBox";
import SearchBar from "../../../components/SearchBar/SearchBar"
import { toast } from "react-toastify";
// import { browserHistory } from "react-router";

function mapStateToProps(state) {
  return {
    allstocks: state.counterReducer["products"],
    endorsedProduct: state.counterReducer["endorsedProduct"],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    CallAllProducts: (prodData) => dispatch(GitAction.CallAllProducts(prodData)),
    CallEndorseProduct: (prodData) => dispatch(GitAction.CallEndorseProduct(prodData)),
    CallResetEndorseProduct: () => dispatch(GitAction.CallResetEndorseProduct()),
  };
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

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const useStyles = makeStyles((theme) => ({
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
  highlight:
    theme.palette.type === "light"
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
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
    disablePadding: false,
    label: "Product Name",
  },
  // {
  //   id: "ProductDescription",
  //   numeric: false,
  //   disablePadding: false,
  //   label: "Product Description",
  // },
  // { id: "Brand", numeric: false, disablePadding: false, label: "Brand" },
  // {
  //   id: "ProductWeight",
  //   numeric: true,
  //   disablePadding: false,
  //   label: "Product Weight",
  // },
  // {
  //   id: "ProductDimensionWidth",
  //   numeric: true,
  //   disablePadding: false,
  //   label: "Product Dimension",
  // },
  // {
  //   id: "ProductStockAmountInital",
  //   numeric: true,
  //   disablePadding: false,
  //   label: "Current Stock",
  // },
  {
    id: "ProductPrice",
    numeric: false,
    disablePadding: false,
    label: "Price Sold",
  },
];

function EndorseTableHead(props) {
  const {
    classes,
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

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all desserts" }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            style={{ width: headCell.id == "ProductImage" ? "140px" : "" }}
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
  const classes = useStyles();
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            style={{ width: headCell.id == "ProductImage" ? "140px" : "" }}
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

EndorseTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

DisplayTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const DeletableTableToolbar = (props) => {
  const classes = useStyles();

  const { numSelected } = props;

  const onEndorseProduct = () => {
    props.ProductProps.CallEndorseProduct({
      ProductID: props.selectedData,
      UserID: JSON.parse(localStorage.getItem("loginUser"))[0].UserID,
    })
    // props.callAllGridStorages();
  };

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          // variant="h6"
          id="tableTitle"
          component="div"
        >
          Please select the products that you want to endorse.
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Endorse">
          <IconButton
            aria-label="endorse"
            onClick={() => { onEndorseProduct(); }}
          >
            <DoneAllIcon />
          </IconButton>
        </Tooltip>
      ) : (
        ""
      )}
    </Toolbar>
  );
};

const DisplayTableToolbar = (props) => {
  const classes = useStyles();
  const { numSelected } = props;

  return <Toolbar className={clsx(classes.root)}></Toolbar>;
};

DeletableTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

DisplayTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

function DeletableTable(props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = props.Data.map((n) => n.ProductName);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(parseInt(event.target.value));
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, props.Data.length - page * rowsPerPage);

  props.Data.map((d, i) => {
    d.Picture = (
      <div>
        <img
          alt={i}
          height={50}
          src={
            d.ProductImage
              ? d.ProductImage
              : Logo
          }
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = Logo;
          }}
        />
      </div>
    );
  });

  return (
    <div>
      <Paper className={classes.paper}>
        <DeletableTableToolbar
          numSelected={selected.length}
          selectedData={selected}
          ProductProps={props.ProductProps}
        />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
            aria-label="enhanced table"
          >
            <EndorseTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={props.Data.length}
            />
            <TableBody>
              {stableSort(props.Data, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.ProductID);
                  // const isItemSelected = isSelectedID(row.ProductID);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.ProductID)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.ProductID}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </TableCell>
                      <TableCell align="center">{row.Picture}</TableCell>
                      <TableCell align="left">{row.ProductName}</TableCell>
                      {/* <TableCell align="left">
                        {row.ProductDescription}
                      </TableCell>
                      <TableCell align="left">{row.Brand}</TableCell>
                      <TableCell align="right">{row.ProductWeight}</TableCell>
                      <TableCell align="right">
                        {row.ProductDimensionWidth +
                          " x " +
                          row.ProductDimensionDeep +
                          " x " +
                          row.ProductDimensionHeight}
                      </TableCell>
                      <TableCell align="right">
                        {row.ProductStockAmountInital}
                      </TableCell> */}
                      <TableCell align="right">
                        {row.ProductPrice}
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={props.Data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}

class DisplayTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: "asc",
      orderBy: "productName",
      selected: [],
      page: 0,
      dense: false,
      rowsPerPage: 10,
      detailsShown: false,
      deleteActive: false,
      searchFilter: "",
    };

    this.ToggleDeletable = this.ToggleDeletable.bind(this);
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



  handleDetailShown = (value) => {
    this.setState({ detailsShown: value })
  }

  onRowClick = (event, row, index) => {
    this.setState({
      productID: row.ProductID,
      name: row.ProductName,
      category: row.ProductCategoryID,
      height: row.ProductDimensionHeight,
      weight: row.ProductWeight,
      depth: row.ProductDimensionDeep,
      width: row.ProductDimensionWidth,
      sku: row.SKU,
      productSupplier: row.SupplierID,
      productCategory: row.ProductCategoryID,
      description: row.ProductDescription,
      model: row.Model,
      brand: row.Brand,
      tags: row.ProductTag,
      supplier: row.SupplierID,
      grid: row.GridStorageID,
      shoplot: row.ShoplotID,
      picture: this.props.Data.ProductImage,
      row: index,
    });

    if (this.state.detailsShown) {
      this.setState({
        detailsShown: false,
      });
    } else {
      this.setState({
        detailsShown: true,
      });
    }
  };

  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 10) });

  };

  handleChangeDense = (event) => {
    this.setState({ dense: event.target.checked });
  };

  isSelected = (name) => {
    // this.state.selected.indexOf(name) !== -1;
  };

  ToggleDeletable() {
    this.setState((prevState, props) => {
      return { deleteActive: !prevState.deleteActive };
    });
  }

  handleSetDetailShown = () => {
    this.setState({ detailsShown: false })
  }

  render() {

    const { classes } = this.props;
    const emptyRows =
      this.state.rowsPerPage -
      Math.min(
        this.state.rowsPerPage,
        this.props.Data.length - this.state.page * this.state.rowsPerPage
      );
    this.props.Data.map((d, i) => {
      d.Picture = (
        <div>
          <img
            height={70}
            src={
              d.ProductImage
                ? d.ProductImage
                : Logo
            }
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = Logo;
            }}
          />
        </div>
      );
    });

    const divStyle = {
      width: "100%",
      margin: "auto",
      padding: "1%",
      // paddingRight: "1%",
      marginTop: "15px",
    };

    const table = {
      // margin: "20px",
      minWidth: 750,
    };

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

    var filteredProduct = [];

    return (
      <div style={{ margin: "2%" }}>
        {this.state.detailsShown ? (
          ""
          // <ProductDetailsComponent ProductID={this.state.productID} ProductName={this.state.name} backToList={this.handleDetailShown} />
        ) : this.state.deleteActive ? (
          <div>
            <h1>Product Endorsement List</h1>
            <div>
              {/* <Button>
                <i class="fa fa-plus" aria-hidden="true"></i>
                <Link className="nav-link" to={"/addProduct"}>
                  Create new Product
                </Link>
              </Button> */}

              <FormControlLabel
                control={<Switch checked={this.state.deleteActive} onChange={this.ToggleDeletable} color="primary" />}
                label="Endorse"
                style={{
                  float: "right",
                  marginRight: "3%",
                }}
              />
            </div>
            {/* <SearchBox
              style={divStyle}
              placeholder="Search123..."
              onChange={(e) => this.setState({ searchFilter: e.target.value })}
            /> */}
            {
              this.props.Data.filter((searchedItem) =>
                searchedItem.ProductName.toLowerCase().includes(this.state.searchFilter.toLowerCase()))
                .map((filteredItem) => { filteredProduct.push(filteredItem); })
            }
            <DeletableTable
              Data={filteredProduct}
              ProductProps={this.props.ProductProps}
            ></DeletableTable>
          </div>
        ) : (
          <div>
            <h1>Product Endorsement List</h1>
            <div>
              {/* <Button>
                <i class="fa fa-plus" aria-hidden="true"></i>
                <Link className="nav-link" to={"/addProduct"}>
                  Create new Product
                </Link>
              </Button> */}
              <FormControlLabel
                control={
                  <Switch
                    checked={this.state.deleteActive}
                    onChange={this.ToggleDeletable}
                  />
                }
                label="Endorse"
                style={{
                  float: "right",
                  marginRight: "3%",
                }}
              />
            </div>
            {/* <SearchBox
              style={divStyle}
              placeholder="Search..."
              onChange={(e) => this.setState({ searchFilter: e.target.value })}
            /> */}
            <div>
              <Paper style={divStyle}>
                {/* <DisplayTableToolbar numSelected={this.state.selected.length} /> */}
                <TableContainer>
                  <Table
                    className={table}
                    aria-labelledby="tableTitle"
                    size={this.state.dense ? "small" : "medium"}
                    aria-label="enhanced table"
                  >
                    <DisplayTableHead
                      classes={classes2}
                      numSelected={this.state.selected.length}
                      order={this.state.order}
                      orderBy={this.state.orderBy}
                      onRequestSort={this.handleRequestSort}
                      rowCount={this.props.Data.length}
                    />
                    {
                      this.props.Data.filter((searchedItem) => typeof searchedItem.ProductName !== "undefined" && searchedItem.ProductName.toLowerCase().includes(this.state.searchFilter.toLowerCase()))
                        .map((filteredItem) => { filteredProduct.push(filteredItem); })
                    }
                    <TableBody>
                      {stableSort(filteredProduct, getComparator(this.state.order, this.state.orderBy))
                        .slice(
                          this.state.page * this.state.rowsPerPage,
                          this.state.page * this.state.rowsPerPage +
                          this.state.rowsPerPage
                        )
                        .map((row, index) => {
                          const isItemSelected = this.isSelected(row.ProductName);
                          const labelId = `enhanced-table-checkbox-${index}`;

                          return (
                            <TableRow
                              hover
                              onClick={(event) => this.onRowClick(event, row, index)}
                              role="checkbox"
                              aria-checked={isItemSelected}
                              tabIndex={-1}
                              key={row.ProductName}
                              selected={isItemSelected}
                            >
                              <TableCell align="center"> {row.Picture} </TableCell>
                              <TableCell align="left"> {row.ProductName} </TableCell>
                              <TableCell align="left">{row.ProductPrice}</TableCell>
                            </TableRow>
                          );
                        })}
                      {emptyRows > 0 && (
                        <TableRow
                          style={{
                            height: (this.state.dense ? 33 : 53) * emptyRows,
                          }}
                        >
                          <TableCell colSpan={6} />
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 50]}
                  component="div"
                  count={filteredProduct.length}
                  rowsPerPage={this.state.rowsPerPage}
                  page={this.state.page}
                  onChangePage={this.handleChangePage}
                  onRowsPerPageChange={this.handleChangeRowsPerPage}
                />
              </Paper>
            </div>
          </div>
        )}
      </div>
    );
  }
}

class ViewProductEndorsementComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fixedHeader: true,
      fixedFooter: true,
      stripedRows: false,
      showRowHover: false,
      selectable: true,
      multiSelectable: false,
      enableSelectAll: false,
      deselectOnClickaway: true,
      showCheckboxes: true,
      selection: [],
      selectAll: false,
      height: "300px",
      detailsShown: false,
      index: null,
      name: null,
      category: null,
      supplier: null,
      height: null,
      width: null,
      depth: null,
      weight: null,
      description: null,
      sku: null,
      brand: null,
      model: null,
      tags: null,
      grid: null,
      shoplot: null,
      productCategory: null,
      productSupplier: null,
      productGrid: null,
      productShoplot: null,
      productStatus: "Pending",
      backPage: "viewProductEndorsement",
    };
    this.props.CallAllProducts({
      type: 'Status',
      typeValue: 'Pending',
      userId: JSON.parse(localStorage.getItem("loginUser"))[0].UserID,
      productPage: '999',
      page: '1',
      ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID,
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.endorsedProduct !== undefined && this.props.endorsedProduct.length > 0 && this.props.endorsedProduct[0].ReturnVal == "1") {
      this.props.CallResetEndorseProduct()
      this.props.CallAllProducts({
        type: 'Status',
        typeValue: 'Pending',
        userId: JSON.parse(localStorage.getItem("loginUser"))[0].UserID,
        productPage: '999',
        page: '1',
        ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID,

      });

      toast.success("This product endorsed successfully.", {
        autoClose: 3000
      })

      setTimeout(() => {
        // browserHistory.push("/viewProductEndorsement");
        window.location.reload(false);
      }, 3000);

      // console.log("THIS.PROPS", this.props)
      // if (this.props.endorsedProduct !== undefined && this.props.endorsedProduct.length > 0 && this.props.endorsedProduct[0].ReturnVal == "1") {
      //     setTimeout(() => {
      //         browserHistory.push("/viewProductEndorsement");
      //         window.location.reload(false);
      //     }, 3000);
      // }
    }
  }

  render() {

    console.log("this.props", this.props.endorsedProduct)
    return (
      <div style={{ width: "100%" }}>
        <DisplayTable
          Data={this.props.allstocks}
          ProductProps={this.props}
        ></DisplayTable>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewProductEndorsementComponent);
