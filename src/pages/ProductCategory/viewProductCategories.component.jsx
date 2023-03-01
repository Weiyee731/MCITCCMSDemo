import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GitAction } from "../../store/action/gitAction";
import "../../app/App.scss";
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from "react-toastify";
import { isArrayNotEmpty } from "../../tools/Helpers";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Paper, Typography, TableRow, Box, TableHead, TextField, TableSortLabel, TableContainer, Tooltip, TableCell, TableBody, Table, IconButton, Collapse, TablePagination } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import LoadingPanel from "../../tools/LoadingPanel";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import SearchBar from "../../components/SearchBar/SearchBar"

export const ProductCategory = (props) => {
  const { categories, productCategories } = useSelector(state => ({
    productCategories: state.counterReducer.productCategories,
    categories: state.counterReducer.categories
  }));

  const dispatch = useDispatch()
  const [isHierachySet, setHierachy] = useState(false)
  const [categoryListingDetails, setListingDetails] = useState([])
  const [searchKeywords, setsearchKeywords] = useState("")
  const [filteredList, setfilteredList] = useState([])
  const [isFiltered, setisFiltered] = useState(false)
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    dispatch(GitAction.CallAllProductCategoryListing({ ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID }))
  }, [])

  useEffect(() => {
    let listing = []
    if (isArrayNotEmpty(productCategories) && isHierachySet === false) {
      let mainListing = {
        HierarchyID: "",
        ProductCategory: "",
        Tag: "",
        ProductCategoryID: "",
        isOpen: false,
        isEdit: false,
        SubDetails: []
      }
      productCategories.map((main, index) => {
        // hierarchy 1
        mainListing = {
          HierarchyID: 1,
          ProductCategory: main.ProductCategory,
          ProductCategoryID: main.ProductCategoryID,
          Tag: main.Tag,
          isOpen: false,
          isEdit: false,
          SubDetails: []
        }
        // hierarchy 2
        main.HierarchyItem !== undefined && main.HierarchyItem != "[]" && JSON.parse(main.HierarchyItem).map((details, detailsIndex) => {
          let detailsList = {
            HierarchyID: 2,
            ProductCategoryID: details.ProductCategoryID,
            ProductCategory: details.ProductCategory,
            ParentProductCategoryID: details.ParentProductCategoryID,
            Tag: details.Tag,
            isOpen: false,
            isEdit: false,
            SubDetails: []
          }
          // hierarchy 3
          details.HierarchyItem !== undefined && details.HierarchyItem != "[]" && JSON.parse(details.HierarchyItem).map((subdetails) => {
            let subDetailsList = {
              HierarchyID: 3,
              ProductCategoryID: subdetails.ProductCategoryID,
              ProductCategory: subdetails.ProductCategory,
              ParentProductCategoryID: subdetails.ParentProductCategoryID,
              GrandParentProductCategoryID: details.ParentProductCategoryID,
              Tag: subdetails.Tag,
              isOpen: false,
              isEdit: false,
            }
            detailsList.SubDetails.push(subDetailsList)
          })
          mainListing.SubDetails.push(detailsList)
        })
        listing.push(mainListing)
      })
      setListingDetails(listing)
      setHierachy(true)
    }
  }, [productCategories])

  useEffect(() => {
    dispatch(GitAction.CallAllProductCategoryListing({ ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID }))
    setHierachy(false)
  }, [categories])

  const headerLayout = () => {
    return (
      <TableHead>
        <TableRow>
          <TableCell width="5%" />
          <TableCell width="15%">Action</TableCell>
          <TableCell width="40%" align="left">Product Category</TableCell>
          <TableCell width="30%" align="left">Tag</TableCell>
        </TableRow>
      </TableHead>
    )
  }

  const clickCollapseOpen = (data, mainIndex, subindex, subdetailIndex) => {
    let listingData = [...categoryListingDetails]

    if (data.HierarchyID === 1) {
      listingData[mainIndex].isOpen = !listingData[mainIndex].isOpen
    }

    if (data.HierarchyID === 2) {
      listingData[mainIndex].SubDetails[subindex].isOpen = !listingData[mainIndex].SubDetails[subindex].isOpen
    }

    setListingDetails(listingData)
    // setfilteredList(listingData)
  }

  const checkCollapseOpen = (data, mainIndex, subindex, subdetailIndex) => {
    let listingData = [...categoryListingDetails]
    if (isArrayNotEmpty(listingData)) {
      if (data.HierarchyID === 1) {
        if (listingData[mainIndex] !== undefined)
          return listingData[mainIndex].isOpen
      } else if (data.HierarchyID === 2) {
        if (listingData[mainIndex].SubDetails[subindex] !== undefined)
          return listingData[mainIndex].SubDetails[subindex].isOpen
      } else {
        return false
      }
    }
  }

  const submitData = (type, HierarchyID, parentCategoryID, categoryID, Category, mainIndex, subIndex, subdetailIndex) => {
    // check duplication
    if (type !== 'delete') {
      if (categoryID !== "") {
        let data_Update = {
          ProductCategoryID: categoryID,
          ProductCategory: Category,
          UserID: JSON.parse(localStorage.getItem("loginUser"))[0].UserID,
        }
        dispatch(GitAction.CallUpdateProductCategory(data_Update))
        toast.success("Successfully updated product category")
      } else {
        const data_Create = {
          ProductCategoryImage: "NULL",
          ProductCategory: Category,
          HierarchyID: HierarchyID,
          ParentProductCategoryID: parentCategoryID,
          ProjectID: JSON.parse(localStorage.getItem("loginUser"))[0].ProjectID,
          UserID: JSON.parse(localStorage.getItem("loginUser"))[0].UserID,
        }
        dispatch(GitAction.CallAddProductCategory(data_Create))
        toast.success("Successfully added product category")
      }
    } else {
      const data_Delete = {
        ProductCategoryID: categoryID,
        UserID: JSON.parse(localStorage.getItem("loginUser"))[0].UserID,
      }
      dispatch(GitAction.CallDeleteProductCategory(data_Delete))
      toast.success("Successfully deleted product category")
    }
  }

  const clickIsEdit = (data, type, mainIndex, subindex, subdetailIndex) => {
    let listingData = !isFiltered ? [...categoryListingDetails] : filteredList
    setEdit(true)

    let target_data;

    if (data.HierarchyID === 1) {
      target_data = listingData.findIndex(x => x.ProductCategoryID === data.ProductCategoryID)
    } else if (data.HierarchyID === 2) {
      target_data = listingData.findIndex(x => x.ProductCategoryID === data.ParentProductCategoryID)
    }
    else if (data.HierarchyID === 3) {
      target_data = listingData.findIndex(x => x.ProductCategoryID === data.GrandParentProductCategoryID)
    }

    if (data.HierarchyID === 1) {
      let listing = listingData[target_data]

      if (type === "cancel") {
        if (listingData[target_data].ProductCategoryID === "") {
          listingData.splice(target_data, 1)
        } else {
          listingData[target_data] = productCategories[target_data]
          listing.isEdit = !listing.isEdit
        }
      }

      if (type === "done") {
        if (listing.ProductCategory !== "") {
          submitData(type, listing.HierarchyID, 0, listing.ProductCategoryID, listing.ProductCategory, target_data, subindex, subdetailIndex)
          listing.isEdit = !listing.isEdit
        } else {
          toast.warning("Product Category is required")
        }
      }

      if (type === "delete") {
        submitData(type, listing.HierarchyID, 0, listing.ProductCategoryID, listing.ProductCategory, target_data, subindex, subdetailIndex)
        listing.isEdit = !listing.isEdit
      }

      if (type === "edit") {
        listing.isEdit = !listing.isEdit
      }

    }

    if (data.HierarchyID === 2) {
      let listing = listingData[target_data].SubDetails[subindex]

      if (type === "cancel") {
        if (listingData[target_data].SubDetails[subindex].ProductCategoryID === "") {
          listingData[target_data].SubDetails.splice(subindex, 1)
        } else {
          listingData[target_data].SubDetails[subindex] = JSON.parse(productCategories[target_data].HierarchyItem)[0]
        }
        listing.isEdit = !listing.isEdit
      }

      if (type === "done") {
        if (listing.ProductCategory !== "") {
          submitData(type, listing.HierarchyID, listingData[target_data].ProductCategoryID, listing.ProductCategoryID, listing.ProductCategory, target_data, subindex, subdetailIndex)
          listing.isEdit = !listing.isEdit
        } else {
          toast.warning("Product Category is required")
        }
      }

      if (type === "delete") {
        submitData(type, listing.HierarchyID, listingData[target_data].ProductCategoryID, listing.ProductCategoryID, listing.ProductCategory, target_data, subindex, subdetailIndex)
        listing.isEdit = !listing.isEdit
      }

      if (type === "edit")
        listing.isEdit = !listing.isEdit
    }

    if (data.HierarchyID === 3) {
      let listing = listingData[target_data].SubDetails[subindex].SubDetails[subdetailIndex]

      if (type === "cancel") {
        if (listingData[target_data].SubDetails[subindex].SubDetails[subdetailIndex].ProductCategoryID === "") {
          listingData[target_data].SubDetails[subindex].SubDetails.splice(subdetailIndex, 1)
        } else {
          const SubDetailsHierarchyItem = JSON.parse(productCategories[target_data].HierarchyItem)[0]
          const subdetailshierarchyitem = JSON.parse(SubDetailsHierarchyItem.HierarchyItem)[0]

          listingData[target_data].SubDetails[subindex].SubDetails[subdetailIndex] = subdetailshierarchyitem
        }
        // let filterHierachy = listingData[mainIndex].SubDetails[subindex].SubDetails.filter((x) => x.ProductCategoryID !== "")
        // listingData[mainIndex].SubDetails[subindex].SubDetails = filterHierachy
        listing.isEdit = !listing.isEdit
      }

      if (type === "done") {
        if (listing.ProductCategory !== "") {
          submitData(type, listing.HierarchyID, listingData[target_data].SubDetails[subindex].ProductCategoryID, listing.ProductCategoryID, listing.ProductCategory, target_data, subindex, subdetailIndex)
          listing.isEdit = !listing.isEdit
        } else {
          toast.warning("Product Category is required")
        }
      }

      if (type === "delete") {
        submitData(type, listing.HierarchyID, listingData[target_data].SubDetails[subindex].ProductCategoryID, listing.ProductCategoryID, listing.ProductCategory, target_data, subindex, subdetailIndex)
        listing.isEdit = !listing.isEdit
      }

      if (type === "edit") {
        listing.isEdit = !listing.isEdit
      }
    }
    setListingDetails(listingData)
  }

  const checkEdit = (data, mainIndex, subindex, subdetailIndex) => {
    let listingData = isFiltered ? filteredList : [...categoryListingDetails]
    let isEdit = false

    let target_data;



    if (data.HierarchyID === 1) {
      target_data = listingData.findIndex(x => x.ProductCategoryID === data.ProductCategoryID)
    } else if (data.HierarchyID === 2) {
      target_data = listingData.findIndex(x => x.ProductCategoryID === data.ParentProductCategoryID)
    }
    else if (data.HierarchyID === 3) {
      target_data = listingData.findIndex(x => x.ProductCategoryID === data.GrandParentProductCategoryID)
    }

    if (isArrayNotEmpty(listingData)) {
      if (data.HierarchyID === 1) {
        if (listingData[target_data] !== undefined)
          isEdit = listingData[target_data].isEdit
      }

      if (data.HierarchyID === 2) {
        if (listingData[target_data].SubDetails[subindex] !== undefined && listingData[target_data].SubDetails[subindex].length !== 0)
          isEdit = listingData[target_data].SubDetails[subindex].isEdit
      }

      if (data.HierarchyID === 3) {
        if (listingData[target_data].SubDetails[subindex] !== undefined && listingData[target_data].SubDetails[subindex].SubDetails.length !== 0 &&
          listingData[target_data].SubDetails[subindex].SubDetails[subdetailIndex] !== undefined && listingData[target_data].SubDetails[subindex].SubDetails[subdetailIndex].length !== 0)
          isEdit = listingData[target_data].SubDetails[subindex].SubDetails[subdetailIndex].isEdit
      }
    }
    return isEdit
  }

  const handleChanges = (type, value, data, mainIndex, subindex, subdetailIndex) => {

    let listingData = [...categoryListingDetails]
    let target_data;

    if (data.HierarchyID === 1) {
      target_data = listingData.findIndex(x => x.ProductCategoryID === data.ProductCategoryID)
    } else if (data.HierarchyID === 2) {
      target_data = listingData.findIndex(x => x.ProductCategoryID === data.ParentProductCategoryID)
    }
    else if (data.HierarchyID === 3) {
      target_data = listingData.findIndex(x => x.ProductCategoryID === data.GrandParentProductCategoryID)
    }

    switch (type) {
      case "Category":

        if (data.HierarchyID === 1)
          listingData[target_data].ProductCategory = value

        if (data.HierarchyID === 2)
          listingData[target_data].SubDetails[subindex].ProductCategory = value

        if (data.HierarchyID === 3)
          listingData[target_data].SubDetails[subindex].SubDetails[subdetailIndex].ProductCategory = value
        break;

      case "Tag":
        if (data.HierarchyID === 1)
          listingData[target_data].Tag = value

        if (data.HierarchyID === 2)
          listingData[target_data].SubDetails[subindex].Tag = value

        if (data.HierarchyID === 3)
          listingData[target_data].SubDetails[subindex].SubDetails[subdetailIndex].Tag = value
        break;

      default:
        break;
    }
    setListingDetails(listingData)

  }

  const handleNewCategory = (hierachy, index, subIndex, data) => {
    let listingData = [...categoryListingDetails]
    setEdit(false)
    let mainListing = {
      HierarchyID: "",
      ParentProductCategoryID: "",
      GrandParentProductCategoryID: "",
      ProductCategory: "",
      Tag: "",
      ProductCategoryID: "",
      isOpen: false,
      isEdit: true,
      SubDetails: []
    }
    let target_data;

    if (hierachy === 2) {
      target_data = listingData.findIndex(x => x.ProductCategoryID === data.ProductCategoryID)
    } else if (hierachy === 3) {
      target_data = listingData.findIndex(x => x.ProductCategoryID === data.ParentProductCategoryID)
    }

    switch (hierachy) {
      case 1:
        mainListing.HierarchyID = 1
        listingData = [...listingData, mainListing]
        break;

      case 2:
        mainListing.HierarchyID = 2
        mainListing.ParentProductCategoryID = data.ProductCategoryID
        listingData[target_data].SubDetails.push(mainListing)
        break;

      case 3:
        mainListing.HierarchyID = 3
        mainListing.GrandParentProductCategoryID = listingData[target_data].ProductCategoryID
        mainListing.ParentProductCategoryID = listingData[target_data].SubDetails[subIndex].ProductCategoryID
        listingData[target_data].SubDetails[subIndex].SubDetails.push(mainListing)
        break;

      default:
        break;
    }
    setListingDetails(listingData)
  }

  const CollapseLayout = (data, index, subindex, subdetailIndex) => {
    return (
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          {
            data.HierarchyID < 3 &&
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => clickCollapseOpen(data, index, subindex, subdetailIndex)}
            >
              {checkCollapseOpen(data, index, subindex, subdetailIndex) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          }
        </TableCell>
        <TableCell component="th" scope="row">
          {
            checkEdit(data, index, subindex, subdetailIndex) ?
              <>
                <IconButton onClick={() => clickIsEdit(data, "done", index, subindex, subdetailIndex)}><DoneIcon /></IconButton>
                <IconButton onClick={() => clickIsEdit(data, "cancel", index, subindex, subdetailIndex)}><CloseIcon /></IconButton>
                {
                  data.ProductCategoryID !== "" &&
                  <IconButton onClick={() => clickIsEdit(data, "delete", index, subindex, subdetailIndex)}><DeleteIcon /></IconButton>
                }
              </>
              :
              <IconButton onClick={() => clickIsEdit(data, "edit", index, subindex, subdetailIndex)}><EditIcon /></IconButton>
          }
        </TableCell>
        <TableCell align="left">
          {
            checkEdit(data, index, subindex, subdetailIndex) ?
              <>
                <TextField
                  fullWidth
                  hiddenLabel
                  id="filled-hidden-label-small"
                  variant="filled"
                  placeholder="Product Category"
                  onChange={(e) => {
                    handleChanges("Category", e.target.value, data, index, subindex, subdetailIndex)
                  }}
                  value={data.ProductCategory}
                  size="small"
                />
                {data.ProductCategory === "" && <Typography style={{ color: "red" }}>Product Category is required</Typography>}
              </>
              :
              <Typography>{data.ProductCategory}</Typography>
          }
        </TableCell>
        <TableCell align="left">
          {
            checkEdit(data, index, subindex, subdetailIndex) ?
              <>
                <TextField
                  fullWidth
                  hiddenLabel
                  id="filled-hidden-label-small"
                  value={data.Tag}
                  variant="filled"
                  placeholder="Tag"
                  onChange={(e) => {
                    handleChanges("Tag", e.target.value, data, index, subindex, subdetailIndex)
                  }}
                  size="small"
                />
                {data.Tag === "" && <Typography style={{ color: "grey", opacity: 0.6 }}>Optional</Typography>}
              </>
              :
              <Typography>{data.Tag}</Typography>
          }
        </TableCell>
      </TableRow >
    )
  }

  const baseColor = "#c4c4c4"
  const highlightColor = "#ffffff"

  const searchSpace = () => {
    let searchString = searchKeywords.toLowerCase().split(' ')

    if (searchKeywords !== "") {
      return categoryListingDetails.filter(category =>
        searchString.some(searchString => category.ProductCategory.toLowerCase().includes(searchString)))
    } else {
      return categoryListingDetails
    }
  }


  return (
    <div style={{ width: "100%" }}>
      <h3>Product Category List</h3>
      <TableContainer component={Paper} style={{ overflow: "hidden" }}>
        <div className="row" style={{ padding: "10px" }}>
          <div className="col-4">
            <Typography variant="h6" gutterBottom component="div">
              Product Category
            </Typography>
          </div>
          <div className="col-7" style={{ display: "flex", alignItems: "center" }}>
            <SearchBar
              id=""
              placeholder="Enter Category Name"
              onChange={(e) => setsearchKeywords(e.target.value)}
              className="searchbar-input mb-auto"
              tooltipText="Search with current data"
              value={searchKeywords}
            />
          </div>
          <div className="col-1" style={{ display: "flex", justifyContent: "center" }}>
            <IconButton >
              <AddIcon onClick={() => handleNewCategory(1, 0, 0, "")} />
            </IconButton>
          </div>
        </div>
        {
          isHierachySet === true ?
            <Table aria-label="collapsible table">
              {headerLayout()}

              <TableBody>
                {searchSpace().length > 0 && searchSpace().map((data, index) => {
                  return (
                    <>
                      {CollapseLayout(data, index, 0, 0)}
                      <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                          <Collapse in={checkCollapseOpen(data, index, 0, 0)} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                              <div className="row">
                                <div className="col">
                                  <Typography variant="h6" gutterBottom component="div">
                                    Sub Category Level 1
                                  </Typography>
                                </div>
                                <div className="col" style={{ textAlign: "right" }}>
                                  <IconButton>
                                    <AddIcon onClick={() => handleNewCategory(2, index, 0, data)} />
                                  </IconButton>
                                </div>
                              </div>
                              {
                                typeof data.SubDetails !== 'undefined' && data.SubDetails.length > 0 ?
                                  <Table size="small" aria-label="purchases">
                                    {headerLayout()}
                                    <TableBody>
                                      {
                                        typeof data.SubDetails !== 'undefined' && data.SubDetails.length > 0 && data.SubDetails.map((details, detailIndex) => {
                                          return (
                                            <>
                                              {CollapseLayout(details, index, detailIndex, 0)}
                                              <TableRow>
                                                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                                  <Collapse in={checkCollapseOpen(details, index, detailIndex, 0)} timeout="auto" unmountOnExit>
                                                    {

                                                      <Box sx={{ margin: 1 }}>
                                                        <div className="row" >
                                                          <div className="col">
                                                            <Typography variant="h6" gutterBottom component="div">
                                                              Sub Category Level 2
                                                            </Typography>
                                                          </div>
                                                          <div className="col" style={{ textAlign: "right" }}>
                                                            <IconButton>
                                                              <AddIcon onClick={() => handleNewCategory(3, index, detailIndex, details)} />
                                                            </IconButton>
                                                          </div>
                                                        </div>
                                                        {
                                                          typeof details.SubDetails !== 'undefined' && details.SubDetails.length > 0 ?
                                                            <Table size="small" aria-label="purchases">
                                                              {headerLayout()}
                                                              <TableBody>
                                                                {
                                                                  details.SubDetails.length > 0 && details.SubDetails.map((subdetails, subdetailIndex) => {
                                                                    return (
                                                                      <>
                                                                        {CollapseLayout(subdetails, index, detailIndex, subdetailIndex)}
                                                                        <TableRow>
                                                                          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                                                            <Collapse in={checkCollapseOpen(subdetails, index, detailIndex, 0)} timeout="auto" unmountOnExit>
                                                                              <Box sx={{ margin: 1 }}>
                                                                                <Typography variant="h6" gutterBottom component="div">
                                                                                  Sub Category3
                                                                                </Typography>
                                                                                <Table size="small" aria-label="purchases">
                                                                                  {headerLayout()}
                                                                                  <TableBody>
                                                                                    {CollapseLayout(subdetails, index, detailIndex, subdetailIndex)}
                                                                                  </TableBody>
                                                                                </Table>
                                                                              </Box>
                                                                            </Collapse>
                                                                          </TableCell>
                                                                        </TableRow>
                                                                      </>
                                                                    )
                                                                  })
                                                                }
                                                              </TableBody>
                                                            </Table>
                                                            :
                                                            <Typography>There is no subcategory in this hierachy</Typography>
                                                        }
                                                      </Box>
                                                    }
                                                  </Collapse>
                                                </TableCell>
                                              </TableRow>
                                            </>
                                          )
                                        })
                                      }
                                    </TableBody>
                                  </Table>
                                  :
                                  <Typography>There is no subcategory in this hierachy</Typography>
                              }
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </>
                  )
                }
                )}
              </TableBody>
            </Table>
            :
            // <LoadingPanel />
            <div>
              <Skeleton height={40} baseColor={baseColor} highlightColor={highlightColor} count={categoryListingDetails.length} style={{ width: '100%' }} />
            </div>
        }
      </TableContainer>
    </div>
  );
}

