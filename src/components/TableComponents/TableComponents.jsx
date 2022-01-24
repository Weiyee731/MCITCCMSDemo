/***************************************
 * 
 * @required @param {array} Data |=> The list of the data that render in the table
 * @required @param {array} tableHeaders |=> The list of data header
 * @param {array} paginationOptions |=> by example value [5, 100, 250, { label: 'All', value: -1 }]. By default it will hide the table pagination. You should set settings for pagination options as in array,
 * @param {component} tableTopLeft |=> component for table top left
 * @param {component} tableTopRight |=> component for table top left
 * @param {component} SelectionActionButtons component for the top right, the rendered buttons when checkbox is selected
 * @param {component} SelectionExtraInfo component for the top left, text or info to be rendered when checkbox is selected
 * 
 * @required @param {object} tableRows |=> The list of data rows and columns
 * ** @required @param {component} tableRows.renderTableRows |=> This is how you design your table column in any form
 * ** @param {boolean} tableRows.checkbox |=> render checkbox at every row
 * ** @param {string} tableRows.checkboxColor |=> checkbox color, "primary | secondary"
 * ** @param {boolean} tableRows.onRowClickSelect |=> allow on row click
 * ** @param {boolean} tableRows.isCollapseOpen |=> 
 * ** @required @param {component} tableRows.renderTableCollapseRows 
 * 
 * @required @param {object} tableOptions |=> The options for table
 * ** @required @param {string} tableOptions.sortingIndex |=> This is the sorting index that used in table column, it is based on id. Read the example below
 * ** @param {boolean} tableOptions.dense |=> Remove table rows margin
 * ** @param {string} tableOptions.tableOrderBy |=> ascending or descending, "asc | desc"
 * ** @param {boolean} tableOptions.stickyTableHeader |=> the table header will stick on top when scrolling through the table data
 * ** @param {int} tableOptions.stickyTableHeight |=> to fix table height
 * ** @param {int} tableOptions.elevation |=> the shadow of the table
 * 
 * *** Method that can pass into this table with callback
 * @methods 
 * @param {function} onSelectRow(row) {  console.log(row) } :-> return selected row, trigger when selecting one row. **From Parents, you need to set state the selected values
 * @param {function} onSelectAllRows(rows) {  console.log(rows) } :-> return selected rows, trigger when selecting all row. **From Parents, you need to set state the selected values
 * @param {function} onTableRowClick(event, row) {  console.log(event, row) } :-> return selected row, trigger when selecting row.
 * 
 * Example:
 *  @method TableComponents
 *  <TableComponents
        // table settings 
        tableTopLeft={<h3 style={{ fontWeight: 600 }}>Table Name</h3>}  //components on table top left
        tableTopRight={<Button>OnClick</Button>}                        //components on table top right
        tableOptions={{
            dense: true,                // optional, default is false
            tableOrderBy: 'asc',        // optional, default is asc
            sortingIndex: "fat",        // require, it must the same as the desired table header
            stickyTableHeader: false,    // optional, default is true
            stickyTableHeight: 300,     // optional, default is 300px
            elevation: 1
        }}
        paginationOptions={[5, 100, 250, { label: 'All', value: -1 }]} // optional, by default it will hide the table pagination. You should set settings for pagination options as in array, eg.: [5, 100, 250, { label: 'All', value: -1 }]
        tableHeaders={headCells}        //required
        tableRows={{
            renderTableRows: this.renderTableRows,   // required, it is a function, please refer to the example I have done in Table Components
            checkbox: true,                          // optional, by default is true
            checkboxColor: "primary",                // optional, by default is primary, as followed the MUI documentation
            onRowClickSelect: false                  // optional, by default is false. If true, the ** onTableRowClick() ** function will be ignored
        }}
        Data={rows}                                  // required, the data that listing in the table
        onSelectRow={(e) => console.log(e)}
        onSelectAllRows={(e) => console.log(e)}
        onTableRowClick={this.onTableRowClick}       // optional, onTableRowClick = (event, row) => { }. The function should follow the one shown, as it will return the data from the selected row 
        SelectionActionButtons={<Button onClick={() => alert('hi')}>SelectionActionButtons</Button>}     // optional, onAddButtonClick = () => { }. The function should follow the one shown, as it will return the action that set in this page
        SelectionExtraInfo={<div>Hi</div>}  
    />
 *
    @method renderTableRows
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

    @param {array} headcells
        const headCells = [
            {
                id: 'name',
                align: 'left',
                disablePadding: false,
                label: 'Dessert ',
            },
            {
                id: 'calories',
                align: 'center',
                disablePadding: false,
                label: 'Calories',
            },
            {
                id: 'fat',
                align: 'center',
                disablePadding: false,
                label: 'Fat (g)',
            },
            {
                id: 'carbs',
                align: 'center',
                disablePadding: false,
                label: 'Carbs (g)',
            },
            {
                id: 'protein',
                align: 'center',
                disablePadding: false,
                label: 'Protein (g)',
            },
        ];

 *
 *
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Collapse from "@material-ui/core/Collapse";
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import { visuallyHidden } from '@mui/utils';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import AddIcon from '@mui/icons-material/Add';
import { isObjectUndefinedOrNull, isArrayNotEmpty, isStringNullOrEmpty } from "../../tools/Helpers"

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly

function stableSort(array, comparator) {
    if (isArrayNotEmpty(array)) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) {
                return order;
            }
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    } else return [];
}

function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, tableHeaders, renderCheckbox, checkboxColor, headerColor } = props;
    const createSortHandler = (property) => (event) => { onRequestSort(event, property); };

    return (
        <TableHead>
            <TableRow>
                {
                    renderCheckbox === true &&
                    <TableCell padding="checkbox" sx={{ bgcolor: headerColor }}>
                        <Checkbox
                            color={checkboxColor}
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={rowCount > 0 && numSelected === rowCount}
                            onChange={onSelectAllClick}
                            inputProps={{ 'aria-label': 'select all desserts', }}
                        />
                    </TableCell>
                }
                {
                    isArrayNotEmpty(tableHeaders) && tableHeaders.map((headCell) => (
                        <TableCell
                            key={headCell.id}
                            align={isStringNullOrEmpty(headCell.align) ? "left" : headCell.align}
                            padding={headCell.disablePadding ? 'none' : 'normal'}
                            sortDirection={orderBy === headCell.id ? order : false}
                            sx={{ bgcolor: headerColor, fontWeight: "medium", }}
                        >
                            <TableSortLabel
                                className="fw-bold"
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.label}
                                {
                                    orderBy === headCell.id ?
                                        <Box component="span" sx={visuallyHidden}>
                                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                        </Box>
                                        : null
                                }
                            </TableSortLabel>
                        </TableCell>
                    ))
                }
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
    /** 
     * @param {ReactElement} tableTopLeft :-> render any elements like <div></div> on the table top left side when there is no selected data
     * @param {ReactElement} tableTopRight :-> render any elements like <div></div> on the table top right side when there is no selected data
     * @param {ReactElement} SelectionActionButtons :-> render any elements like <div></div> or Buttons on the table top right side when there is selected data
    */
    const { selectedRows, tableTopLeft, tableTopRight, SelectionActionButtons, SelectionExtraInfo } = props;
    const numSelected = selectedRows.length

    return (
        <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 }, ...(numSelected > 0 && { bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity) }) }}>
            {
                numSelected > 0 ? (
                    <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div" >
                        {numSelected} selected
                        {SelectionExtraInfo}
                    </Typography>
                ) : (
                    <Typography sx={{ flex: '1 1 100%' }} id="tableTitle" component="div">
                        {tableTopLeft}
                    </Typography>
                )
            }
            {
                numSelected > 0 ? (
                    <div>
                        {SelectionActionButtons}
                    </div>
                ) : (
                    <div>
                        {tableTopRight}
                    </div>
                )
            }
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    selectedRows: PropTypes.array.isRequired,
};

TableComponents.propTypes = {
    tableOptions: PropTypes.object.isRequired,
    paginationOptions: PropTypes.array.isRequired,
    tableHeaders: PropTypes.array.isRequired,
    tableRows: PropTypes.object.isRequired,
    Data: PropTypes.array.isRequired,
};

export default function TableComponents(props) {
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);

    // render from props
    // table settings
    const [stickyTableHeader, setTableHeaderSticky] = useState(isObjectUndefinedOrNull(props.tableOptions) && props.tableOptions.stickyTableHeader === null ? true : props.tableOptions.stickyTableHeader);
    const [stickyTableHeight, setTableStickyHeight] = useState(isObjectUndefinedOrNull(props.tableOptions) && props.tableOptions.stickyTableHeight === null ? 300 : props.tableOptions.stickyTableHeight);
    const [dense, setDense] = useState(isObjectUndefinedOrNull(props.tableOptions) && props.tableOptions.dense === null ? false : props.tableOptions.dense);
    const [tableTopLeft, setTableTopLeft] = useState(isObjectUndefinedOrNull(props.tableTopLeft) || props.tableTopLeft === null ? null : props.tableTopLeft);
    const [tableTopRight, setTableTopRight] = useState(isObjectUndefinedOrNull(props.tableTopRight) || props.tableTopRight === null ? null : props.tableTopRight);
    const [elevation, setElevation] = useState(isStringNullOrEmpty(props.tableOptions.elevation) ? 1 : props.tableOptions.elevation);
    const headerColor = !isObjectUndefinedOrNull(props.tableRows.headerColor) ? props.tableRows.headerColor : "";
    //pagination settings
    const [rowsPerPage, setRowsPerPage] = useState((isArrayNotEmpty(props.paginationOptions) ? props.paginationOptions[0] : 25));
    const [pagePaginationOptions, setPagePaginationOptions] = useState((isArrayNotEmpty(props.paginationOptions)) ? props.paginationOptions : []);

    //table and table data settings
    const [order, setOrder] = useState(isObjectUndefinedOrNull(props.tableOptions) && props.tableOptions.tableOrderBy === null ? 'asc' : props.tableOptions.tableOrderBy);
    const [orderBy, setOrderBy] = useState(isObjectUndefinedOrNull(props.tableOptions) && props.tableOptions.sortingIndex === null ? "" : props.tableOptions.sortingIndex);
    const [rows, setRows] = useState((isArrayNotEmpty(props.Data) ? props.Data : []));
    const [tableHeaders, setTableHeaders] = useState((isArrayNotEmpty(props.tableHeaders) ? props.tableHeaders : []));
    const [renderCheckbox, setRenderCheckbox] = useState(!isObjectUndefinedOrNull(props.tableRows.checkbox) ? props.tableRows.checkbox : true);
    const [onRowSelect, setOnRowSelect] = useState(!isObjectUndefinedOrNull(props.tableRows.onRowClickSelect) ? props.tableRows.onRowClickSelect : false);

    // the state in this component will update as the props update. CHANGE ONLY YOU HAVE TO
    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            setRows(props.Data);
            setTableHeaders(props.tableHeaders);
            setTableTopLeft(props.tableTopLeft);
            setTableTopRight(props.tableTopRight);
        }
        return () => {
            setRows([]);
            setTableHeaders([]);
            setTableTopLeft(null);
            setTableTopRight(null);
            isMounted = false;
        };
    }, [props]);

    useEffect(() => {
        setRenderCheckbox(props.tableRows.checkbox);
    }, [props.tableRows]);

    // This will reset the selected data
    useEffect(() => {
        if (props.CallResetSelected === true) //*
            setSelected([]);
    }, [props.CallResetSelected]);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n);
            setSelected(newSelecteds);
            typeof props.onSelectAllRows === "function" && props.onSelectAllRows(newSelecteds) //*
            return;
        } else {
            setSelected([]);
            typeof props.onSelectAllRows === "function" && props.onSelectAllRows([]) //*
        }
    };

    const handleSelectItem = (event, key) => {
        event.stopPropagation();
        const selectedIndex = selected.indexOf(key);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, key);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
        typeof props.onSelectRow === "function" && props.onSelectRow(newSelected);
    }

    const handleRowClick = (event, row) => { (onRowSelect) ? handleSelectItem(event, row) : typeof props.onTableRowClick === "function" && props.onTableRowClick(event, row) };
    const handleChangePage = (event, newPage) => { setPage(newPage); };
    const handleChangeRowsPerPage = (event) => { setRowsPerPage(parseInt(event.target.value, 10)); setPage(0); };
    const isSelected = (name) => selected.indexOf(name) !== -1;
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
    const TableData = (rowsPerPage !== -1) ? stableSort(rows, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : stableSort(rows, getComparator(order, orderBy))
    const checkboxColor = !isObjectUndefinedOrNull(props.tableRows.checkboxColor) ? props.tableRows.checkboxColor : "primary" //*
    const emptyRowColSpan = renderCheckbox ? tableHeaders.length + 1 : tableHeaders.length

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }} elevation={elevation}>
                <EnhancedTableToolbar
                    selectedRows={selected}
                    tableTopLeft={tableTopLeft}
                    tableTopRight={tableTopRight}
                    SelectionActionButtons={props.SelectionActionButtons}
                    SelectionExtraInfo={props.SelectionExtraInfo}
                />
                <TableContainer sx={(stickyTableHeader) ? { maxHeight: stickyTableHeight } : { maxHeight: '100%' }}>
                    <Table
                        stickyHeader={stickyTableHeader}
                        sx={{ width: "100%" }}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={isArrayNotEmpty(rows) ? rows.length : 0}
                            tableHeaders={tableHeaders}
                            renderCheckbox={renderCheckbox}
                            checkboxColor={checkboxColor}
                            headerColor={headerColor}

                        />
                        <TableBody>
                            {
                                !isObjectUndefinedOrNull(props.tableRows.isExpandable) && props.tableRows.isExpandable === true && props.carryDataFromChild(TableData)
                            }
                            {
                                isArrayNotEmpty(TableData) && TableData.map((row, index) => {
                                    const isItemSelected = isSelected(row);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <>
                                            {
                                                !isObjectUndefinedOrNull(props.tableRows.isExpandable) && props.tableRows.isExpandable === true ?
                                                    <>
                                                        <TableRow
                                                            hover
                                                            onClick={(event) => handleRowClick(event, row)}
                                                            aria-checked={isItemSelected}
                                                            tabIndex={-1}
                                                            key={"table_row__" + index}
                                                            selected={isItemSelected}
                                                        >
                                                            {
                                                                renderCheckbox &&
                                                                <TableCell padding="checkbox">
                                                                    <Checkbox
                                                                        color={checkboxColor}
                                                                        checked={isItemSelected}
                                                                        inputProps={{ 'aria-labelledby': labelId, }}
                                                                        onClick={(event) => handleSelectItem(event, row)}
                                                                    />
                                                                </TableCell>
                                                            }
                                                            {!isObjectUndefinedOrNull(props.tableRows.renderTableRows) && props.tableRows.renderTableRows(row, index)}
                                                        </TableRow>
                                                        <TableRow style={{ border: "none" }}>
                                                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
                                                                <Collapse in={props.tableRows.isCollapseOpen[index]} timeout="auto" unmountOnExit>
                                                                    {!isObjectUndefinedOrNull(props.tableRows.renderTableCollapseRows) && props.tableRows.renderTableCollapseRows(row, index)}
                                                                </Collapse>
                                                            </TableCell>
                                                        </TableRow>
                                                    </>
                                                    :
                                                    <TableRow
                                                        hover
                                                        onClick={(event) => handleRowClick(event, row)}
                                                        aria-checked={isItemSelected}
                                                        tabIndex={-1}
                                                        key={"table_row__" + index}
                                                        selected={isItemSelected}
                                                    >
                                                        {
                                                            renderCheckbox &&
                                                            <TableCell padding="checkbox">
                                                                <Checkbox
                                                                    color={checkboxColor}
                                                                    checked={isItemSelected}
                                                                    inputProps={{ 'aria-labelledby': labelId, }}
                                                                    onClick={(event) => handleSelectItem(event, row)}
                                                                />
                                                            </TableCell>
                                                        }
                                                        {!isObjectUndefinedOrNull(props.tableRows.renderTableRows) && props.tableRows.renderTableRows(row, index)}
                                                    </TableRow>
                                            }
                                        </>

                                        // <TableRow
                                        //     hover
                                        //     onClick={(event) => handleRowClick(event, row)}
                                        //     aria-checked={isItemSelected}
                                        //     tabIndex={-1}
                                        //     key={"table_row__" + index}
                                        //     selected={isItemSelected}
                                        // >
                                        //     {
                                        //         renderCheckbox &&
                                        //         <TableCell padding="checkbox">
                                        //             <Checkbox
                                        //                 color={checkboxColor}
                                        //                 checked={isItemSelected}
                                        //                 inputProps={{ 'aria-labelledby': labelId, }}
                                        //                 onClick={(event) => handleSelectItem(event, row)}
                                        //             />
                                        //         </TableCell>
                                        //     }
                                        //     {!isObjectUndefinedOrNull(props.tableRows.renderTableRows) && props.tableRows.renderTableRows(row, index)}
                                        // </TableRow>
                                    );
                                })
                            }
                            {
                                emptyRows > 0 && (
                                    <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }} >
                                        <TableCell colSpan={emptyRowColSpan} ></TableCell>
                                    </TableRow>
                                )
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                {
                    pagePaginationOptions.length !== 0 &&
                    <TablePagination
                        rowsPerPageOptions={pagePaginationOptions}
                        component="div"
                        colSpan={3}
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        ActionsComponent={TablePaginationActions}
                    />
                }
            </Paper>
        </Box>
    );
}


/**
 *   Pagination Buttons Props
 *   DO NOT TOUCH IT UNLESS THE NECESSARARY CHANGES REQUIRED!!
 */
TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;
    const handleFirstPageButtonClick = (event) => { onPageChange(event, 0); };
    const handleBackButtonClick = (event) => { onPageChange(event, page - 1); };
    const handleNextButtonClick = (event) => { onPageChange(event, page + 1); };
    const handleLastPageButtonClick = (event) => { onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1)); };
    return (
        <Box sx={{ flexShrink: 0, ml: 1 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}



/***************************************
 * Example:
 *
 *  <TableComponents
        // table settings 
        tableTopLeft={<h3 style={{ fontWeight: 600 }}>Table Name</h3>}  //components on table top left
        tableTopRight={<Button>OnClick</Button>}                        //components on table top right
        tableOptions={{
            dense: true,                // optional, default is false
            tableOrderBy: 'asc',        // optional, default is asc
            sortingIndex: "fat",        // require, it must the same as the desired table header
            stickyTableHeader: false,    // optional, default is true
            stickyTableHeight: 300,     // optional, default is 300px
            elevation: 1
        }}
        paginationOptions={[5, 100, 250, { label: 'All', value: -1 }]} // optional, by default it will hide the table pagination. You should set settings for pagination options as in array, eg.: [5, 100, 250, { label: 'All', value: -1 }]
        tableHeaders={headCells}        //required
        tableRows={{
            renderTableRows: this.renderTableRows,   // required, it is a function, please refer to the example I have done in Table Components
            checkbox: true,                          // optional, by default is true
            checkboxColor: "primary",                // optional, by default is primary, as followed the MUI documentation
            onRowClickSelect: false                  // optional, by default is false. If true, the ** onTableRowClick() ** function will be ignored
        }}
        selectedIndexKey={"pid"}                    // required, as follow the data targetting key of the row, else the data will not be chosen when checkbox is click. 
        Data={rows}                                  // required, the data that listing in the table
        onSelectRow={(e) => console.log(e)}
        onSelectAllRows={(e) => console.log(e)}
        onTableRowClick={this.onTableRowClick}       // optional, onTableRowClick = (event, row) => { }. The function should follow the one shown, as it will return the data from the selected row 
        SelectionActionButtons={<Button onClick={() => alert('hi')}>SelectionActionButtons</Button>}     // optional, onAddButtonClick = () => { }. The function should follow the one shown, as it will return the action that set in this page
        SelectionExtraInfo={<div>Hi</div>}  // required, onDeleteButtonClick = (items) => { }. The function should follow the one shown, as it will return the lists of selected items
    />
 *
 *
 *
 */