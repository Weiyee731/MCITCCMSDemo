import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  TableCell,
} from "@material-ui/core";
import { GitAction } from "../../../store/action/gitAction";
import { toast } from "react-toastify";

// Shared Components
import ProductDetailsComponent from "./ProductInfo";
import TableComponents from "../../../components/TableComponents/TableComponents";
import Logo from "../../../assets/logos/logo.png";
import SearchBar from "../../../components/SearchBar/SearchBar"

// UI Components
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Endorse from '@mui/icons-material/DomainVerification';

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

class ViewProductEndorsementComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedListID: [],
      filteredProduct: [],
      isFiltered: false,
      searchSpace: "",
      isProductClick: false,
      ProductID: "",
      ProductName: ""
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
        window.location.reload(false);
      }, 3000);
    }
  }

  renderTableRows = (data, index) => {
    return (
      <>
        <TableCell align="center" width="10%">
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
        <TableCell align="left" width="40%"> {data.ProductName} </TableCell>
        <TableCell align="left" width="40%">{data.ProductPrice}</TableCell>
      </>
    )
  }

  handleDetailShown = (value) => {
    this.setState({ detailsShown: value })
  }


  onTableRowClick = (event, row) => {
    this.setState({
      isProductClick: true,
      ProductID: row.ProductID,
      ProductName: row.ProductName
    })
  }

  handleDetails = (value) => {
    this.setState({ isProductClick: value })
  }


  onEndorse = () => {
    let IDs = []
    this.state.selectedListID.length > 0 && this.state.selectedListID.map((row) => {
      IDs.push(row.ProductID)
    })
    this.props.CallEndorseProduct({
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


  render() {

    const DataList = JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID === 1 ? this.props.allstocks :
      JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID === 16 && this.props.allstocks !== undefined ? this.props.allstocks.filter((x) => parseInt(x.MerchantID) === parseInt(localStorage.getItem("loginUser")[0].UserID)) : []


    const tableHeadCells = [
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
      {
        id: "ProductPrice",
        numeric: false,
        disablePadding: false,
        label: "Price Sold",
      },
    ];

    return (
      <div style={{ width: "100%" }}>
        <div style={{ margin: "2%" }}>

          {
            this.state.isProductClick === false ?
              <>
                <div className="col-md-12 col-12 m-auto" >
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
                <br />
                <TableComponents
                  tableTopLeft={<h3 style={{ fontWeight: 600 }}>Product Endorsement List</h3>}
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
                      DataList
                      :
                      this.state.filteredProduct
                  }                                 // required, the data that listing in the table
                  onSelectRow={(e) => this.setState({ selectedListID: e })}
                  onSelectAllRows={(e) => this.setState({ selectedListID: e })}
                  onTableRowClick={this.onTableRowClick}       // optional, onTableRowClick = (event, row) => { }. The function should follow the one shown, as it will return the data from the selected row
                  SelectionActionButtons={
                    <Tooltip title="Endorse">
                      <IconButton aria-label="endorse" onClick={() => { this.onEndorse() }}   >
                        <Endorse />
                      </IconButton>
                    </Tooltip>
                  }
                />
              </>
              :
              < ProductDetailsComponent ProductID={this.state.ProductID} ProductName={this.state.ProductName} backToList={this.handleDetails} />
          }

        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewProductEndorsementComponent);
