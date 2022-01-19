import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../store/action/gitAction";

import { Link } from "react-router-dom";

import { browserHistory } from "react-router";
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';

import { Button } from "@mui/material";
import ResponsiveDatePickers from "../../tools/datePicker";
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';

import SearchBar from "../../components/SearchBar/SearchBar"
import { isArrayNotEmpty } from "../../tools/Helpers";
import TableComponents from "../../components/TableComponents/TableComponents";


import "./OverallStock.css";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import GroupAddIcon from '@mui/icons-material/Add';
import Badge from '@mui/material/Badge';



function mapStateToProps(state) {
    return {
        foods: state.counterReducer["foods"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        CallTesting: () => dispatch(GitAction.CallTesting()),
    };
}

const headCells = [
    {
        id: 'StockInDate',
        align: 'left',
        disablePadding: false,
        label: 'Stock In Date ',
    },
    {
        id: 'ProductSKU',
        align: 'center',
        disablePadding: false,
        label: 'ProductSKU',
    },
    {
        id: 'ProductName',
        align: 'center',
        disablePadding: false,
        label: 'Product Name',
    },
    {
        id: 'Store',
        align: 'center',
        disablePadding: false,
        label: 'Store',
    },
    {
        id: 'StockInAmount',
        align: 'center',
        disablePadding: false,
        label: 'Stock In Amount',
    },
    {
        id: 'StockPrice',
        align: 'center',
        disablePadding: false,
        label: 'Stock Price(RM)',
    },
];

function createData(pid, name, calories, fat, carbs, protein) {
    return {
        pid,
        name,
        calories,
        fat,
        carbs,
        protein,
    };
}

const rows = [
    createData(1, 'Cupcake', 305, 3.7, 67, 4.3, 4.3),
    createData(2, 'Donut', 452, 25.0, 51, 4.9, 4.3),
    createData(3, 'Eclair', 262, 16.0, 24, 6.0, 4.3),
    createData(4, 'Frozen yoghurt', 159, 6.0, 24, 4.0, 4.3),
    createData(5, 'Gingerbread', 356, 16.0, 49, 3.9, 4.3),
    createData(6, 'Honeycomb', 408, 3.2, 87, 6.5, 4.3),
    createData(7, 'Ice cream sandwich', 237, 9.0, 37, 4.3, 4.3),
    createData(8, 'Jelly Bean', 375, 0.0, 94, 0.0, 4.3),
    createData(9, 'KitKat', 518, 26.0, 65, 7.0, 4.3),
    createData(10, 'Lollipop', 392, 0.2, 98, 0.0, 4.3),
    createData(11, 'Marshmallow', 318, 0, 81, 2.0, 4.3),
    createData(12, 'Nougat', 360, 19.0, 9, 37.0, 4.3),
    createData(13, 'Oreo', 437, 18.0, 63, 4.0, 4.3),
];


const INITIAL_STATE = {

}

class Stock extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState) {

    }

    renderTableRows = (data, index) => {
        return (
            <>
                <TableCell
                    component="th"
                    id={`enhanced-table-checkbox-${index}`}
                    scope="row"
                    padding="normal"
                >
                    {data.name}
                </TableCell>
                <TableCell align="center">{data.calories}</TableCell>
                <TableCell align="center">{data.fat}</TableCell>
                <TableCell align="center">{data.carbs}</TableCell>
                <TableCell align="center">{data.protein}</TableCell>
            </>
        )
    }

    renderTableActionButton = () => {
        return (
            <div className="d-flex">
                <Tooltip sx={{ marginLeft: 5 }} title="Add New Items">
                    <IconButton onClick={(event) => { this.onAddButtonClick() }}>
                        <AddIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Buton">
                    <IconButton onClick={(event) => { this.onAddButtonClick() }}>
                        <AddIcon />
                    </IconButton>
                </Tooltip>
            </div>
        )
    }

    onTableRowClick = (event, row) => {
        console.log(row)
    }

    onAddButtonClick = (item) => {
        console.log('add button')
    }

    onDeleteButtonClick = (items) => {
        console.log('delete button')
        console.log(items)
    }

    render() {
        return (
            <div className="container-fluid my-2">
                <div className="row">
                    <div className="col-md-12 col-12 mb-2 stock-date-range-picker d-flex">
                        <label className="my-auto" style={{ marginRight: '15px' }}>Packaging Date: </label>
                        <ResponsiveDatePickers
                            rangePicker
                            openTo="day"
                            title="FromDate"
                            value={this.state.datevalue ? this.state.datevalue : ""}
                            onChange={(e) => this.onDateChange(e)}
                            variant="outlined"
                            startPickerPropsOptions={{ placeholder: "From", className: "start-date-picker" }}
                            endPickerPropsOptions={{ placeholder: "To", className: "end-date-picker" }}
                        />
                        <Tooltip title="Search Date">
                            <IconButton
                                aria-label="Search Date"
                                size="small"
                                onClick={() => { this.onDatabaseSearch() }}
                                sx={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: '5px', border: '1px solid rgba(33, 33, 33, 0.6)' }}
                                disabled={this.state.isDataFetching}
                            >
                                <ManageSearchOutlinedIcon fontSize="medium" />
                            </IconButton>
                        </Tooltip>
                    </div>
                    <div className="row">
                        <div className="col-md-4 col-12 mb-2">
                            <div className="filter-down row">
                                <div className="d-inline-flex w-100">
                                    <label className="my-auto col-3">Filter By:</label>
                                    <Select
                                        labelId="search-filter-category"
                                        id="search-filter-category"
                                        // value={searchCategory}
                                        label="Search By"
                                        onChange={this.handleSearchCategory}
                                        size="small"
                                        IconComponent={FilterListOutlinedIcon}
                                        className="col-9"
                                        placeholder="filter by"
                                    >
                                        <MenuItem key="search_all" value="All">All</MenuItem>
                                        <MenuItem key="search_tracking" value="Tracking">Product SKU</MenuItem>
                                        <MenuItem key="search_member" value={"Member"}>Product Name</MenuItem>
                                        <MenuItem key="search_container" value={"Container"}>Store</MenuItem>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-12 d-flex">
                            <div className="pr-1 w-100">
                                <SearchBar
                                    id=""
                                    placeholder="Enter Product SKU, Product Name or Store to search"
                                    buttonOnClick={() => this.onSearch("", "")}
                                    onChange={this.handleSearchInput}
                                    className="searchbar-input mb-auto"
                                    disableButton={this.state.isDataFetching}
                                    tooltipText="Search with current data"
                                    value={this.state.searchKeywords}
                                />
                            </div>
                        </div>
                    </div>
                    <h1>Stock List</h1>
                    <div className="w-100 container-fluid">
                        <TableComponents
                            // detailed documentations is in this component js file. Please refer.
                            // tableTopLeft={<h3 style={{ fontWeight: 600 }}>Table Name</h3>}
                            tableTopRight={
                                <Tooltip title="Add Stock">
                                    <IconButton size="small" sx={{ color: "#0074ea", marginRight: 2 }}>
                                        <Badge badgeContent={4} color="primary">
                                            <Link className="nav-link" to={"/addStock"}>
                                                <GroupAddIcon />
                                            </Link>
                                        </Badge>
                                    </IconButton>
                                </Tooltip>
                            }
                            tableOptions={{
                                dense: true,
                                tableOrderBy: 'asc',
                                sortingIndex: "fat",
                                stickyTableHeader: false,
                                stickyTableHeight: 300,
                                elevation: 1
                            }}
                            paginationOptions={[5, 100, 250, { label: 'All', value: -1 }]}
                            tableHeaders={headCells}
                            tableRows={{
                                renderTableRows: this.renderTableRows,
                                checkbox: true,
                                checkboxColor: "primary",
                                onRowClickSelect: false
                            }}
                            Data={rows}
                            onSelectRow={(e) => console.log(e)}
                            onSelectAllRows={(e) => console.log(e)}
                            onTableRowClick={this.onTableRowClick}
                            SelectionActionButtons={<Button onClick={() => alert('hi')}>SelectionActionButtons</Button>}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Stock);