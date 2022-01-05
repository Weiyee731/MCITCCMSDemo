import React, { useEffect } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { isObjectUndefinedOrNull, isStringNullOrEmpty } from "../../tools/Helpers";
import Tooltip from '@mui/material/Tooltip';
import PropTypes from "prop-types";
import "./Searchbar.css"

/**
 * @param {object} props 
 * @required @param {string} props.value // pass the state value into this field so you can update the value in searchbox 
 * @required @param {string} props.onChange    // a callback function when the value is change 
 * @param {string} props.className      // you can import class via this props
 * @param {string} props.variant      // you can import class via this props
 * @param {string} props.label          // label for the text field
 * @param {string} props.placeholder    // placeholder
 * @param {string} props.helperText     // helperText that placed under the searchbar
 * @param {string} props.autoFocus      // autofocus to the textfield 
 * @param {string} props.tooltipText    // tooltip text for the search button  
 * @param {string} props.disableButton  // disabled the button 
 * @param {string} props.buttonOnClick  // button onclick function
 *
 */
const SearchBox = (props) => {
    const [searchKeywords, setSearchKeywords] = React.useState(props.value)
    useEffect(() => {
        setSearchKeywords(isStringNullOrEmpty(props.value) ? "" : props.value)
    }, [props.value])
    return (
        <TextField
            className={(isStringNullOrEmpty(props.className)) ? "searchbar-input" : props.className}
            fullWidth
            label={isStringNullOrEmpty(props.label) ? "" : props.label}
            id="search-bar"
            placeholder={isStringNullOrEmpty(props.placeholder) ? "Type to search" : props.placeholder}
            helperText={isStringNullOrEmpty(props.helperText) ? "" : props.helperText}
            onChange={(e) => typeof props.onChange === "function" ? props.onChange(e) : {}}
            onKeyDown={(e) => (e.key === 'Enter' || e.keyCode === 13) && typeof props.onChange === "function" ? props.onChange(e) : {}}
            autoFocus={props.autoFocus ? props.autoFocus : false}
            size="small"
            margin="normal"
            variant={isStringNullOrEmpty(props.variant) ? "outlined" : props.variant }
            value={searchKeywords}
            InputProps={{
                endAdornment: (
                    props.hideButton === true ? <></> :
                    <InputAdornment position="end">
                        <Tooltip title={isStringNullOrEmpty(props.tooltipText) ? "Search" : props.tooltipText}>
                            <IconButton onClick={() => typeof props.buttonOnClick === "function" ? props.buttonOnClick() : {}} disabled={typeof props.disableButton !== "undefined" && typeof props.disableButton === "boolean" ? props.disableButton : false}>
                                <SearchIcon />
                            </IconButton>
                        </Tooltip>
                    </InputAdornment>
                ),
            }}
        />
    );
};
SearchBox.propTypes = {
    placeholder: PropTypes.string,
    helperText: PropTypes.string,
    onChange: PropTypes.func,
    className: PropTypes.string,
}
export default SearchBox;
