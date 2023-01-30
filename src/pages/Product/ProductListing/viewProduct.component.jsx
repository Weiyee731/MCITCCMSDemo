import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../../store/action/gitAction";
import TableComponents from "../../../components/TableComponents/TableComponents";
import createHistory from 'history/createBrowserHistory'

// Share Component
import SearchBar from "../../../components/SearchBar/SearchBar"
import { url, isNumber } from "../../../tools/Helpers";
import Logo from "../../../assets/logos/logo.png";

// UI Component
import GroupAddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import TableCell from '@mui/material/TableCell';
import { Link } from "react-router-dom";
import PageviewIcon from '@mui/icons-material/Pageview';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const history = createHistory()

function mapStateToProps(state) {
  return {
    allstocks: state.counterReducer["products"],
    productMgmtResult: state.counterReducer["productMgmtResult"],
    productInfo: state.counterReducer["productsByID"],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    CallAllProducts: (prodData) => dispatch(GitAction.CallAllProducts(prodData)),
    CallResetProductMgmtReturnVal: () => dispatch(GitAction.CallResetProductMgmtReturnVal()),
    CallDeleteProduct: (prodData) =>
      dispatch(GitAction.CallDeleteProduct(prodData)),
    CallResetProductDetails: () =>
      dispatch(GitAction.CallResetProductDetails()),
  };
}

const tableHeadCells = [
  {
    id: "ProductImage",
    align: 'center',
    numeric: false,
    disablePadding: true,
    label: "Product Image",
  },
  {
    id: "ProductName",
    align: 'left',
    numeric: false,
    disablePadding: false,
    label: "Product Name",
  },
  {
    id: "ProductVariationSKU",
    align: 'left',
    numeric: false,
    disablePadding: false,
    label: "Product Variation SKU",
  },
  {
    id: "ProductPrice",
    align: 'left',
    numeric: false,
    disablePadding: false,
    label: "Price Sold (RM)",
  },
];

class ViewProductComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      productStatus: "Endorsed",

      selectedListID: [],
      searchKeywords: "",
      filteredProduct: [],
      isFiltered: false,
      selectedMerchant: 0
    };

    this.props.CallAllProducts({
      type: this.props.match !== undefined ? "Category" : "Merchant",
      typeValue: this.props.match !== undefined ? this.props.match.params.categoryId : '0',
      userId: JSON.parse(localStorage.getItem("loginUser"))[0].UserID,
      productPage: '999',
      page: '1',
      ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID,
    });
  }

  renderTableRows = (data, index) => {
    return (
      <>
        <TableCell align="center">
          <img height={50}
            alt={data.ProductImage}
            src={
              data.ProductImage
                ? data.ProductImage
                : ""
            }
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = Logo;
            }}
          />
        </TableCell>
        <TableCell align="left"> {data.ProductName} </TableCell>
        <TableCell align="left"> {data.ProductVariation !== null && data.ProductVariation !== undefined && JSON.parse(data.ProductVariation).map((x) => {
          return (
            <><label>{x.ProductVariationSKU}</label><br /></>
          )
        })} </TableCell>
        <TableCell align="left">{data.ProductPrice}</TableCell>

      </>
    )
  }

  onTableRowClick = (event, row) => {
    return (
      window.location = url.inventoryProduct(row.ProductID)
    )
  }

  onDelete = () => {
    let IDs = []
    this.state.selectedListID.length > 0 && this.state.selectedListID.map((row) => {
      IDs.push(row.ProductID)
    })
    this.props.CallDeleteProduct({
      ProductID: IDs,
      UserID: JSON.parse(localStorage.getItem("loginUser"))[0].UserID
    })
  }

  searchSpace = (value) => {
    this.setState({ searchKeywords: value })
    this.state.filteredProduct.splice(0, this.state.filteredProduct.length)
    let filteredListing = []

    let DataSet = JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID === 1 ? this.props.allstocks :
      JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID === 16 && this.props.allstocks !== undefined ? this.props.allstocks.filter((x) => parseInt(x.MerchantID) == parseInt( JSON.parse(localStorage.getItem("loginUser"))[0].UserID)) : []

    DataSet.length > 0 && DataSet.filter((searchedItem) =>
      searchedItem.ProductName !== null && searchedItem.ProductName.toLowerCase().includes(
        value.toLowerCase()
      )
    ).map((filteredItem) => {
      filteredListing.push(filteredItem);
    })

    DataSet.length > 0 && DataSet.map((x) => {
      x.ProductVariation !== null && x.ProductVariation !== undefined && JSON.parse(x.ProductVariation).filter((searchedItem) =>
        searchedItem.ProductVariationSKU !== null && searchedItem.ProductVariationSKU.toLowerCase().includes(
          value.toLowerCase()
        )
      ).map((filteredItem) => {
        filteredListing.push(x);
      })
    })

    let removeDuplicate = filteredListing.length > 0 ? filteredListing.filter((ele, ind) => ind === filteredListing.findIndex(elem => elem.ProductID === ele.ProductID)) : []
    this.setState({ isFiltered: true, filteredProduct: removeDuplicate })
  }

  filterMerchantListing = (e) => {
    this.setState({ selectedMerchant: e.target.value })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.productMgmtResult !== this.props.productMgmtResult) {
      if (this.props.productMgmtResult.length > 0 && this.state.selectedListID.length > 0) {
        this.props.CallResetProductMgmtReturnVal()
        this.props.CallAllProducts({
          type: this.props.match !== undefined ? "Category" : "Merchant",
          typeValue: this.props.match !== undefined ? this.props.match.params.categoryId : '0',
          userId: JSON.parse(localStorage.getItem("loginUser"))[0].UserID,
          productPage: '999',
          page: '1',
          ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID,
        });
        this.setState({ selectedListID: [] })
      }
    }
  }

  render() {
    const DataList = JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID === 1 ? this.props.allstocks :
      JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID === 16 && this.props.allstocks !== undefined ?
        this.props.allstocks.filter((x) => parseInt(x.MerchantID) == parseInt( JSON.parse(localStorage.getItem("loginUser"))[0].UserID))
        : []

    if (DataList.length > 0) {
      var generateOptions = []
      generateOptions = DataList.length > 0 &&
        DataList
          .filter((ele, ind) => ind === DataList.findIndex(elem => elem.MerchantID === ele.MerchantID))
          .map((data, i) => {
            return (
              <MenuItem value={data.MerchantID}>{data.MerchantShopName}</MenuItem>
            );
          });
    }

    const renderButtonOnTableTopRight = () => {
      return (
        <div className="d-flex">
          {
            this.props.match !== undefined &&
            <Tooltip title="View All Product">
              <IconButton size="medium" sx={{ color: "#0074ea", marginRight: 1 }}>
                <Link className="nav-link" to={{ pathname: "/viewProduct" }}>
                  <PageviewIcon />
                </Link>
              </IconButton>
            </Tooltip>
          }
          <Tooltip title="Add New Product">
            <IconButton size="medium" sx={{ color: "#0074ea", marginRight: 1 }}>
              <Link className="nav-link" to={"/addProductsAllIn"}>
                <GroupAddIcon />
              </Link>
            </IconButton>
          </Tooltip>
        </div>
      )
    }

    return (
      <div className="container-fluid my-2">
        <div className="row mb-3">
          <div className="col-10">
            <SearchBar
              id=""
              placeholder="Search By Product SKU, Product Name to search"
              buttonOnClick={() => this.onSearch("", "")}
              onChange={(e) => this.searchSpace(e.target.value)}
              className="searchbar-input mb-auto"
              disableButton={this.state.isDataFetching}
              tooltipText="Search with current data"
              value={this.state.searchKeywords}
            />
          </div>
          <div className="col-2">
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Shop</InputLabel>
                <Select
                  value={this.state.selectedMerchant}
                  onChange={this.filterMerchantListing.bind(this)}
                  className="select"
                  size="small"
                  label="Shop"
                >
                  <MenuItem value={0}>All Merchant Shop</MenuItem>
                  {generateOptions}
                </Select>
              </FormControl>
            </Box>
          </div>
        </div>

        <TableComponents
          // table settings 
          tableTopLeft={
            <div className="d-flex">
              <h3 style={{ fontWeight: 600 }}>Product Listing</h3>
              {this.props.match !== undefined &&
                <h4 style={{ fontWeight: 600, paddingLeft: "10px", paddingTop: "5px" }}> - {this.props.match.params.category}</h4>}
            </div>
          }
          tableTopRight={renderButtonOnTableTopRight()}                        //components on table top right
          tableOptions={{
            dense: true,                // optional, default is false
            tableOrderBy: 'asc',        // optional, default is asc
            sortingIndex: "ProductName",        // require, it must the same as the desired table header
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
          selectedIndexKey={"ProductID"}                    // required, as follow the data targetting key of the row, else the data will not be chosen when checkbox is click. 

          Data={
            this.state.isFiltered === false ?
              parseInt(this.state.selectedMerchant) === 0 ? DataList : DataList.length > 0 && DataList.filter((x) => parseInt(x.MerchantID) === parseInt(this.state.selectedMerchant))
              :
              parseInt(this.state.selectedMerchant) === 0 ? this.state.filteredProduct : this.state.filteredProduct.length > 0 && this.state.filteredProduct.filter((x) => parseInt(x.MerchantID) === parseInt(this.state.selectedMerchant))
          }                                 // required, the data that listing in the table
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
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewProductComponent);
