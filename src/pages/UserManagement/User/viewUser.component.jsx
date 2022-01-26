import React, { Component } from "react";
import { connect } from "react-redux";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@material-ui/core";
import { GitAction } from "../../../store/action/gitAction";

// Share Components
import UserDetailsComponent from "./viewUserDetails.components";
import TableComponents from "../../../components/TableComponents/TableComponents";
import SearchBar from "../../../components/SearchBar/SearchBar"

function mapStateToProps(state) {
    return {
        allUser: state.counterReducer["currentUser"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        // CallAllUsers: () => dispatch(GitAction.CallAllUsers()),
        CallUserProfile: (prodData) => dispatch(GitAction.CallUserProfile(prodData)),
    };
}

class ViewUserComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            firstName: "",
            lastName: "",
            userContact: "",
            companyDesc: "",
            companyName: "",
            companyWebsite: "",
            companyAddressLine1: "",
            companyAddressLine2: "",
            companyPoscode: "",
            companyCity: "",
            companyState: "",

            filteredProduct: [],
            isFiltered: false,
            searchKeywords: "",
            isdetailsShown: false,
        };
    }

    componentDidMount() {
        this.props.CallUserProfile({
            TYPE: "Usertype",
            TYPEVALUE: 17,
            USERID: JSON.parse(localStorage.getItem("loginUser"))[0].UserID ? JSON.parse(localStorage.getItem("loginUser"))[0].UserID : 0,
            USERROLEID: JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID ? JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID : 0,
            LISTPERPAGE: 999,
            PAGE: 1,
            ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID
        });
    }

    componentWillUnmount() {
        clearImmediate(this.props.allUser)
    }

    renderTableRows = (data, index) => {
        return (
            <>
                <TableCell align="left"> {data.FirstName + " " + data.LastName} </TableCell>
                <TableCell align="left"> {data.UserContactNo} </TableCell>
                <TableCell align="left"> {data.UserEmailAddress} </TableCell>
                <TableCell align="left"> {data.ActiveInd === 1 ? "ACTIVE" : "NON-ACTIVE"} </TableCell>
            </>
        )
    }



    searchSpace = (value) => {
        this.setState({ searchKeywords: value })
        let DataSet = this.props.allUser.length > 0 ? this.props.allUser : []
        this.state.filteredProduct.splice(0, this.state.filteredProduct.length)


        DataSet.length > 0 && DataSet.filter((searchedItem) =>
            searchedItem.FirstName !== null && searchedItem.FirstName.toLowerCase().includes(
                value.toLowerCase()
            )
        ).map((filteredItem) => {
            this.state.filteredProduct.push(filteredItem);
        })

        DataSet.length > 0 && DataSet.filter((searchedItem) =>
            searchedItem.LastName !== null && searchedItem.LastName.toLowerCase().includes(
                value.toLowerCase()
            )
        ).map((filteredItem) => {
            this.state.filteredProduct.push(filteredItem);
        })

        DataSet.length > 0 && DataSet.filter((searchedItem) =>
            searchedItem.UserContactNo !== null && searchedItem.UserContactNo.toLowerCase().includes(
                value.toLowerCase()
            )
        ).map((filteredItem) => {
            this.state.filteredProduct.push(filteredItem);
        })

        DataSet.length > 0 && DataSet.filter((searchedItem) =>
            searchedItem.UserEmailAddress !== null && searchedItem.UserEmailAddress.toLowerCase().includes(
                value.toLowerCase()
            )
        ).map((filteredItem) => {
            this.state.filteredProduct.push(filteredItem);
        })

        let removeDuplicate = this.state.filteredProduct.length > 0 ? this.state.filteredProduct.filter((ele, ind) => ind === this.state.filteredProduct.findIndex(elem => elem.UserID === ele.UserID)) : []
        this.setState({ isFiltered: true, filteredProduct: removeDuplicate })
    }

    onTableRowClick = (event, row) => {

        this.setState({
            name: row,
            firstName: row.FirstName,
            lastName: row.LastName,
            userContact: row.UserContactNo,
            companyDesc: row.CompanyDescription,
            companyName: row.CompanyName,
            companyWebsite: row.CompanyWebsite,
            companyAddressLine1: row.CompanyAddressLine1,
            companyAddressLine2: row.CompanyAddressLine2,
            companyPoscode: row.CompanyPosCode,
            companyCity: row.CompanyCity,
            companyState: row.CompanyState
        });

        if (this.state.isdetailsShown) {
            this.setState({
                isdetailsShown: false,
            });
        } else {
            this.setState({
                isdetailsShown: true,
            });
        }
    }

    render() {

        const DataList = this.props.allUser.length > 0 &&
            this.props.allUser !== undefined &&
            this.props.allUser[0].ReturnVal !== "0" ? this.props.allUser : []


        const tableHeadCells = [
            {
                id: "Name",
                numeric: false,
                disablePadding: false,
                label: "Name",
            },
            {
                id: "UserContactNo",
                numeric: false,
                disablePadding: false,
                label: "Contact No.",
            },
            {
                id: "UserEmailAddress",
                numeric: false,
                disablePadding: false,
                label: "Email",
            },
            {
                id: "ActiveInd",
                numeric: true,
                disablePadding: false,
                label: "ACTIVE IND",
            },
        ];

        const setDetailsShown = (value) => {
            this.setState({
                isdetailsShown: value,
            });
        };

        return (
            <div className="container-fluid my-2">
                <div className="row">
                    {
                        this.state.isdetailsShown === true ?
                            <UserDetailsComponent
                                data={this.state}
                                setDetailsShown={setDetailsShown}
                            />
                            :
                            <>
                                <div className="col-md-12 col-12 mb-3 d-flex" >
                                    <SearchBar
                                        id=""
                                        placeholder="Search By Name, Phone and Email ..."
                                        buttonOnClick={() => this.onSearch("", "")}
                                        onChange={(e) => this.searchSpace(e.target.value)}
                                        className="searchbar-input mb-auto"
                                        disableButton={this.state.isDataFetching}
                                        tooltipText="Search with current data"
                                        value={this.state.searchKeywords}
                                    />
                                </div>
                                <TableComponents
                                    tableTopLeft={<h3 style={{ fontWeight: 600 }}>User List</h3>}
                                    tableOptions={{
                                        dense: true,                // optional, default is false
                                        tableOrderBy: 'asc',        // optional, default is asc
                                        sortingIndex: "UserID",        // require, it must the same as the desired table header
                                        stickyTableHeader: false,    // optional, default is true
                                    }}

                                    paginationOptions={[5, 10, 25, { label: 'All', value: -1 }]} // optional, by default it will hide the table pagination. You should set settings for pagination options as in array, eg.: [5, 100, 250, { label: 'All', value: -1 }]
                                    tableHeaders={tableHeadCells}        //required
                                    tableRows={{
                                        renderTableRows: this.renderTableRows,   // required, it is a function, please refer to the example I have done in Table Components
                                        checkbox: false,                          // optional, by default is true
                                        checkboxColor: "primary",                // optional, by default is primary, as followed the MUI documentation
                                        onRowClickSelect: false                  // optional, by default is false. If true, the ** onTableRowClick() ** function will be ignored
                                    }}
                                    selectedIndexKey={"UserID"}                    // required, as follow the data targetting key of the row, else the data will not be chosen when checkbox is click. 
                                    Data={
                                        this.state.isFiltered === false ?
                                            DataList : this.state.filteredProduct
                                    }                                 // required, the data that listing in the table
                                    onSelectRow={(e) => this.setState({ selectedListID: e })}
                                    onSelectAllRows={(e) => this.setState({ selectedListID: e })}
                                    onTableRowClick={this.onTableRowClick}       // optional, onTableRowClick = (event, row) => { }. The function should follow the one shown, as it will return the data from the selected row
                                />
                            </>
                    }


                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewUserComponent);
