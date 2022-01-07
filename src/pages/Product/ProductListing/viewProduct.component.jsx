import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Select,
  TableCell,
} from "@material-ui/core";
import { GitAction } from "../../../store/action/gitAction";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from '@mui/icons-material/Delete';
import Logo from "../../../assets/logos/logo.png";
import { toast } from "react-toastify";
import { url } from "../../../tools/Helpers";
import TableComponents from "../../../components/TableComponents/TableComponents";
import FormControl from "@material-ui/core/FormControl";
import SearchBar from "../../../components/SearchBar/SearchBar"
import GroupAddIcon from '@mui/icons-material/Add';


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
    align: 'center',
    numeric: false,
    disablePadding: false,
    label: "Product Name",
  },
  {
    id: "ProductPrice",
    align: 'center',
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
      type: 'Merchant',
      typeValue: '0',
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
          /></TableCell>
        <TableCell align="left"> {data.ProductName} </TableCell>
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

    let DataSet = JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID === 1 ? this.props.allstocks :
      JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID === 16 && this.props.allstocks !== undefined ? this.props.allstocks.filter((x) => parseInt(x.MerchantID) === parseInt(localStorage.getItem("loginUser")[0].UserID)) : []

    DataSet.filter((searchedItem) =>
      searchedItem.ProductName !== null && searchedItem.ProductName.toLowerCase().includes(
        value.toLowerCase()
      )
    ).map((filteredItem) => {
      this.state.filteredProduct.push(filteredItem);
    })
    this.setState({ isFiltered: true })
  }

  filterMerchantListing = (e) => {
    this.setState({ selectedMerchant: e.target.value })
    console.log("THIS IS VALUE", e.target.value)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.productMgmtResult !== this.props.productMgmtResult) {
      if (this.props.productMgmtResult.length > 0 && this.state.selectedListID.length > 0) {
        this.props.CallResetProductMgmtReturnVal()
        this.props.CallAllProducts({
          type: 'Merchant',
          typeValue: '0',
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
      JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID === 16 && this.props.allstocks !== undefined ? this.props.allstocks.filter((x) => parseInt(x.MerchantID) === parseInt(localStorage.getItem("loginUser")[0].UserID)) : []

    if (DataList.length > 0) {
      var generateOptions = []
      generateOptions = DataList.length > 0 &&
        DataList
          .filter((ele, ind) => ind === DataList.findIndex(elem => elem.MerchantID === ele.MerchantID))
          .map((data, i) => {
            return (
              <option value={data.MerchantID}>{data.MerchantShopName}</option>
            );
          });
    }

    const renderButtonOnTableTopRight = () => {
      return (
        <div className="d-flex">
          <Tooltip title="Add New Product">
            <IconButton size="medium" sx={{ border: "2px solid #0074ea", color: "#0074ea", marginRight: 1 }} onClick={() => window.location.href = "/addProduct"}>
              <GroupAddIcon />
            </IconButton>
          </Tooltip>
        </div>
      )
    }

    return (
      <div style={{ width: "100%" }}>
        <div style={{ margin: "2%" }}>
          <div className="row" style={{ marginBottom: "10px" }}>
            <div className="col-md-10 col-10 m-auto" >
              <SearchBar
                id=""
                placeholder="Enter Product Name"
                buttonOnClick={() => this.onSearch("", "")}
                onChange={(e) => this.searchSpace(e.target.value)}
                className="searchbar-input mb-auto"
                disableButton={this.state.isDataFetching}
                tooltipText="Search with current data"
                value={this.state.searchKeywords}
              />
            </div>

            <div className="col-md-2 col-2 m-auto" style={{ paddingTop: "10px" }}>
              <div className="selectContainer">
                <FormControl variant="outlined" size="small">
                  <Select
                    native
                    value={this.state.selectedMerchant}
                    onChange={this.filterMerchantListing.bind(this)}
                    className="select"
                  >
                    <option value={0}>All Merchant Shop</option>
                    {generateOptions}
                  </Select>
                </FormControl>
              </div>
            </div>
          </div>
          <TableComponents
            // table settings 
            tableTopLeft={<h3 style={{ fontWeight: 600 }}>Product Listing</h3>}
            tableTopRight={renderButtonOnTableTopRight()}                        //components on table top right
            tableOptions={{
              dense: true,                // optional, default is false
              tableOrderBy: 'asc',        // optional, default is asc
              sortingIndex: "ProductName",        // require, it must the same as the desired table header
              stickyTableHeader: false,    // optional, default is true
            }}
            paginationOptions={[5, 100, 250, { label: 'All', value: -1 }]} // optional, by default it will hide the table pagination. You should set settings for pagination options as in array, eg.: [5, 100, 250, { label: 'All', value: -1 }]
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
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewProductComponent);
