import React, { Component } from "react";
import { connect } from "react-redux";
import { GitAction } from "../../store/action/gitAction";

function mapStateToProps(state) {
    return {
        productCategories: state.counterReducer["productCategories"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        CallAllProductCategoryListing: () => dispatch(GitAction.CallAllProductCategoryListing()),
    };
}

class CategoryHierachy extends Component {
    constructor(props) {
        super(props);

        this.state = {
            CategoryHierachyListing: [],
            CategoryHierachyID: [],
            categoryHierachy: 0,
        };
        this.props.CallAllProductCategoryListing()
    }

    getCategoryListing(productInfo, categoryInfo) {

        console.log("INSDIE")
        console.log("INSDIE", productInfo)
        console.log("INSDIE", categoryInfo)
        let tempCategoryHierachy = 0
        this.state.CategoryHierachyListing.splice(0, this.state.CategoryHierachyListing.length)

        // Check if category in Heirachy 1
        if (categoryInfo !== null && productInfo.ProductCategoryID !== null && this.state.categoryHierachy === 0) {
            categoryInfo.map((category) => {
                if (category.ProductCategoryID == productInfo.ProductCategoryID) {
                    this.setState({ categoryHierachy: 1 })
                    this.state.CategoryHierachyListing.push(category.ProductCategory)
                    this.state.CategoryHierachyID.push(category.ProductCategoryID)
                    tempCategoryHierachy = 1
                }
            })

            // Check if category in Heirachy 2
            if (tempCategoryHierachy === 0 && tempCategoryHierachy !== 1) {
                categoryInfo.map((categoryList) => {
                    categoryList.HierarchyItem !== null && categoryList.HierarchyItem !== undefined &&
                        JSON.parse(categoryList.HierarchyItem).map((category) => {
                            if (category.ProductCategoryID == productInfo.ProductCategoryID) {
                                this.setState({ categoryHierachy: 2 })
                                this.state.CategoryHierachyListing.push(categoryList.ProductCategory, category.ProductCategory)
                                this.state.CategoryHierachyID.push(categoryList.ProductCategoryID, category.ProductCategoryID)
                                tempCategoryHierachy = 2
                            }
                        })
                })
            }

            // Check if category in Heirachy 3
            if (tempCategoryHierachy === 0 && tempCategoryHierachy !== 1 && tempCategoryHierachy !== 2) {
                categoryInfo.map((categoryListing) => {
                    categoryListing.HierarchyItem !== null && categoryListing.HierarchyItem !== undefined &&
                        JSON.parse(categoryListing.HierarchyItem).map((categoryList) => {
                            categoryList.HierarchyItem !== null && categoryList.HierarchyItem !== undefined &&
                                JSON.parse(categoryList.HierarchyItem).map((category) => {
                                    if (category.ProductCategoryID == productInfo.ProductCategoryID) {
                                        this.setState({ categoryHierachy: 3 })
                                        this.state.CategoryHierachyListing.push(categoryListing.ProductCategory, categoryList.ProductCategory, category.ProductCategory)
                                        this.state.CategoryHierachyID.push(categoryListing.ProductCategoryID, categoryList.ProductCategoryID, category.ProductCategoryID)
                                        tempCategoryHierachy = 3
                                    }
                                })
                        })
                })
            }

            // Check if category in Heirachy 4
            if (tempCategoryHierachy === 0 && tempCategoryHierachy !== 1 && tempCategoryHierachy !== 2 && tempCategoryHierachy !== 4) {
                categoryInfo.map((mainCategory) => {
                    mainCategory.HierarchyItem !== null && mainCategory.HierarchyItem !== undefined &&
                        JSON.parse(mainCategory.HierarchyItem).map((categoryListing) => {
                            categoryListing.HierarchyItem !== null && categoryListing.HierarchyItem !== undefined &&
                                JSON.parse(categoryListing.HierarchyItem).map((categoryList) => {
                                    categoryList.HierarchyItem !== null && categoryList.HierarchyItem !== undefined &&
                                        JSON.parse(categoryList.HierarchyItem).map((category) => {
                                            if (category.ProductCategoryID == productInfo.ProductCategoryID) {
                                                this.setState({ categoryHierachy: 4 })
                                                this.state.CategoryHierachyListing.push(mainCategory.ProductCategory, categoryListing.ProductCategory, categoryList.ProductCategory, category.ProductCategory)
                                                this.state.CategoryHierachyID.push(mainCategory.ProductCategoryID, categoryListing.ProductCategoryID, categoryList.ProductCategoryID, category.ProductCategoryID)
                                                tempCategoryHierachy = 4
                                            }
                                        })
                                })
                        })
                })
            }
        }
        if (this.state.CategoryHierachyListing.length > 0) {
            this.props.getCategoryHierachyListing(this.state.CategoryHierachyListing, this.state.CategoryHierachyID)
        }
    }

    render() {
        return (
            <div>
                {
                    this.props.productCategories !== undefined && this.props.productInfo !== undefined &&
                    this.props.productCategories.length > 0 && this.props.productInfo.length > 0 && this.state.categoryHierachy === 0 &&
                    this.getCategoryListing(this.props.productInfo[0], this.props.productCategories)
                }

            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryHierachy);