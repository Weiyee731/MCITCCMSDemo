import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { GitAction } from "../../store/action/gitAction";
import "../../app/App.scss";
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
import DeleteIcon from '@mui/icons-material/Delete';
import MaterialTable from "material-table";
import { toast } from "react-toastify";

function mapStateToProps(state) {
  return {
    productCategories: state.counterReducer["productCategories"], // with sub hierarchy item
  };
}

function mapDispatchToProps(dispatch) {
  return {
    CallAllProductCategoryListing: () =>
      dispatch(GitAction.CallAllProductCategoryListing()),
    CallAddProductCategory: (prod) =>
      dispatch(GitAction.CallAddProductCategory(prod)),
    CallUpdateProductCategory: (prod) =>
      dispatch(GitAction.CallUpdateProductCategory(prod)),
    CallDeleteProductCategory: (prodData) =>
      dispatch(GitAction.CallDeleteProductCategory(prodData)),
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
    id: "ProductCategoryName",
    numeric: false,
    disablePadding: false,
    label: "Product Category Name",
  },
  {
    id: "HierarchyID",
    numeric: false,
    disablePadding: false,
    label: "Hierarchy Level",
  },
  {
    id: "ParentProductCategoryID",
    numeric: false,
    disablePadding: false,
    label: "Parent Product Category",
  },
  {
    id: "Tag",
    numeric: false,
    disablePadding: false,
    label: "Tags",
  },
];

function DeletableTableHead(props) {
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
            inputProps={{ "aria-label": "select all product categories" }}
          />
        </TableCell>
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

function DisplayTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
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

DeletableTableHead.propTypes = {
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
  const onDeleteProductCategory = () => {
    props.ProductCategoryProps.CallDeleteProductCategory(props.selectedData);
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
          Please select the product categories that you want to delete.
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton
            aria-label="delete"
            onClick={() => {
              onDeleteProductCategory();
            }}
          >
            <DeleteIcon />
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
      const newSelecteds = props.Data.map((n) => n.ProductCategory);
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
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, props.Data.length - page * rowsPerPage);

  return (
    <div>
      <Paper className={classes.paper}>
        <DeletableTableToolbar
          numSelected={selected.length}
          selectedData={selected}
          ProductCategoryProps={props.ProductCategoryProps}
        />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
            aria-label="enhanced table"
          >
            <DeletableTableHead
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
                  const isItemSelected = isSelected(row.ProductCategoryID);
                  // const isItemSelected = isSelectedID(row.ProductID);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) =>
                        handleClick(event, row.ProductCategoryID)
                      }
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
                      <TableCell align="left">{row.ProductCategory}</TableCell>
                      <TableCell align="left">{row.HierarchyID}</TableCell>
                      <TableCell align="left">
                        {row.ParentProductCategoryID}
                      </TableCell>
                      <TableCell align="left">{row.Tag}</TableCell>
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
        {/* <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={props.Data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> */}
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
      rowsPerPage: 5,
      detailsShown: false,
      deleteActive: false,
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

  onRowClick = (event, row) => {
    this.setState({
      ProductCategoryID: row.ProductCategoryID,
      ProductCategory: row.ProductCategory,
      ParentProductCategoryID: row.ParentProductCategoryID,
      Tags: row.Tag,
      HierarchyLevel: row.HierarchyID,
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
    this.setState({ page: 0 });
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

  addRowData = (newrow, tableContent) => {
    const alphaNumbericRegex = /[a-zA-z0-9#@-_.]/;
    if (newrow.name) {
      newrow.name = newrow.name.trim();
      if (newrow.name !== "" && alphaNumbericRegex.test(newrow.name)) {
        let formData = {
          ProductCategory: newrow.name,
          ProductCategoryImage: "NULL",
          HierarchyID: newrow.hierarchy,
          ParentProductCategoryID: newrow.parent,
          ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID,
          UserID: JSON.parse(localStorage.getItem("loginUser"))[0].UserID,
        };
        let returnVal = this.props.ProductCategoryProps.CallAddProductCategory(
          formData
        );
        if (returnVal.type === "ADD-PRODUCTCATEGORY") {
          toast.success("Product Category Added.");
          window.location.reload(false);
        }
      } else
        toast.error(
          "Name for the Product Category must contains alphanumeric characters"
        );
    } else {
      toast.error("Name for the Product Category is required.");
    }
  };

  updateRowData = (row) => {
    let updateData = {
      ProductCategoryID: row.ProductCategoryID,
      ProductCategory: row.ProductCategory,
    };
    let returnVal = this.props.ProductCategoryProps.CallUpdateProductCategory(
      updateData
    );
    toast.success(row.ProductCategory + " is updated.");
    window.location.reload(false);
  };

  deleteRowData = (deletedRow, item) => {
    let returnVal = this.props.ProductCategoryProps.CallDeleteProductCategory(
      deletedRow.ProductCategoryID
    );

    toast.success("The " + deletedRow.ProductCategory + " has been removed.");
    window.location.reload(false);
  };

  bindSubCategory = (row) => {
    console.log(row)
    let ParentProductCategoryID = row.ProductCategoryID;
    let ParentProductHierarchyID = row.HierarchyID ? row.HierarchyID : 0;
    try {
      row = JSON.parse(row.HierarchyItem);
      row = row && row.length > 0 ? row : [];
    } catch (error) {
      // toast.error( "error: " + error);
      row = [];
    }

    return (
      <div style={{ padding: "2%" }}>
        <MaterialTable
          title={row.ProductCategory}
          columns={[
            {
              title: "Sub Category",
              field: "ProductCategory",
            },
          ]}
          data={row}
          options={{
            paging: false,
            search: false,
          }}
          detailPanel={(rowData) => {
            return this.bindSubCategory(rowData);
          }}
          editable={{
            onRowAdd: (newData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  var newArr = {
                    parent: ParentProductCategoryID,
                    name: newData.ProductCategory,
                    hierarchy: ParentProductHierarchyID + 1,
                  };
                  // setData([...data, newData]);
                  this.addRowData(newArr, [...row]);
                  resolve();
                }, 1000);
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  const dataUpdate = [...row];
                  const index = oldData.tableData.id;
                  dataUpdate[index] = newData;
                  // setData([...dataUpdate]);
                  this.updateRowData(newData);
                  resolve();
                }, 1000);
              }),
            onRowDelete: (oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  const dataDelete = [...row];
                  const index = oldData.tableData.id;
                  dataDelete.slice(index, 1);
                  // setData([...dataDelete]);
                  this.deleteRowData(oldData, [...dataDelete]);
                  resolve();
                }, 1000);
              }),
          }}
        ></MaterialTable>
      </div>
    );
  };

  render() {
    const { classes } = this.props;
    const emptyRows =
      this.state.rowsPerPage -
      Math.min(
        this.state.rowsPerPage,
        this.props.Data.length - this.state.page * this.state.rowsPerPage
      );

    // this.props.Data.map((d, i) => {
    //   d.ProductCategoryImage = (
    //     <div>
    //       <img
    //         height={50}
    //         alt= {(d.ProductCategoryName) ? d.ProductCategoryName : 'Product Category'}
    //         src={d.ProductCategoryImage ? d.ProductCategoryImage : ""}
    //       />
    //     </div>
    //   );
    // });

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



    return (
      <div style={{ width: "100%" }}>
        {/* <DisplayTable
          Data={this.props.variations}
          VariationProps={this.props}
        ></DisplayTable> */}
        <div style={{ margin: "2%" }}>
          <div>
            <h1>Product Category List</h1>
            <div style={{ margin: "1%" }}>
              <MaterialTable
                title="Product Category"
                columns={[
                  {
                    title: "Product Category",
                    field: "ProductCategory",
                  },
                  {
                    title: "Tag",
                    field: "Tag",
                  },
                ]}
                data={this.props.ProductCategoryProps.productCategories}
                options={{
                  paging: true,
                  search: false,
                }}
                detailPanel={(rowData) => {
                  return this.bindSubCategory(rowData);
                }}
                editable={{
                  onRowAdd: (newData) =>
                    new Promise((resolve, reject) => {
                      setTimeout(() => {
                        // console.log(row)
                        var newArr = {
                          parent: 0,
                          name: newData.ProductCategory, 
                          hierarchy: 1,
                        };
                        // setData([...data, newData]);
                        this.addRowData(newArr, [...this.props.ProductCategoryProps.productCategories]);
                        resolve();
                      }, 1000);
                    }),
                  onRowUpdate: (newData, oldData) =>
                    new Promise((resolve, reject) => {
                      setTimeout(() => {
                        // const dataUpdate = [...row];
                        // const index = oldData.tableData.id;
                        // dataUpdate[index] = newData;
                        // // setData([...dataUpdate]);
                        // this.updateRowData(newData);
                        resolve();
                      }, 1000);
                    })
                }}
              ></MaterialTable>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class ViewProductCategoriesComponent extends Component {
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
      ProductCategoryID: null,
      ProductCategory: null,
      ParentProductCategoryID: null,
      Tags: null,
      HierarchyLevel: null,
      productStatus: "Endorsed",
      backPage: "viewProduct",
      anchorEl: null,
      selectedItem: "Choose a Category",
      menuPosition: null,
      buttonDisabled: true,
      // to navigate it sub category
      parent: [],
    };
    this.props.CallAllProductCategoryListing();
  }

  render() {
    return (
      <div style={{ width: "100%" }}>
        <DisplayTable
          Data={this.props.productCategories}
          ProductCategoryProps={this.props}
        ></DisplayTable>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewProductCategoriesComponent);
