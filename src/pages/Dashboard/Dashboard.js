import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../store/action/gitAction";
import { browserHistory } from "react-router";
import SearchBar from "../../components/SearchBar/SearchBar";
function mapStateToProps(state) {
    return {
    };
}

function mapDispatchToProps(dispatch) {
    return {
    };
}


const INITIAL_STATE = {

}

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = INITIAL_STATE

    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState) {

    }

    render() {
        return (
            <div>
                <SearchBar
                    label="search"
                    placeholder="Enter Member No, Tracking No or Container No to search"
                    buttonOnClick={() => this.onSearch("", "")}
                    onChange={() => { }}
                    className="searchbar-input"
                    disableButton={this.state.isDataFetching}
                    tooltipText="Search with current data"
                    value={this.state.searchKeywords}
                    variant="standard"
                    hideButton={true}
                />
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);