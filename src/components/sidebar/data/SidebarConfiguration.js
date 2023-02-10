/**
 * "user manual": sidebar configuration 
 * Bsaic use of template for the sidebar configuration, 
 * if wish to pass the parameter such as 'page/Id',
 * you can use page/:Id, and the passing param can be accessed using "this.props.params.match.Id",
 * ** REMARK :-> You should configure in Router Configuration as well
 *   {
        to: "/",    //if you are rendering submenu, leave 'to:' option to be blank, else put the link
        title: "Dashboard",
        icon: <MenuOutlinedIcon />, //component or string from material design icon
        prefix: <span className="badge gray">3</span>,
        suffix: <span className="badge red">3</span>,
        submenus: [
            {
                to: "/Report",
                title: "Submenu1",
                icon: <MenuOutlinedIcon />,
                suffix: <span className="badge red"> 2.1 </span>,
                submenus: [
                    {
                        to: "/Report",
                        title: "Submenu1.1.1.1",
                        icon: <MenuOutlinedIcon />,
                        suffix: <span className="badge red"> 2.1 </span>,
                    }
                ]
            },
        ]
    }
 */


// import { Settings, Shop2Rounded, ShopOutlined } from '@mui/icons-material';
// import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
// import StorefrontIcon from '@mui/icons-material/Storefront';


// const SidebarConfiguration = [

//     {
//         to: "",
//         title: "Product",
//         icon: "indeterminate_check_box",
//         submenus: [
//             {
//                 to: "/viewProduct",
//                 title: "Product Listing",
//                 icon: "inventory",
//             },
//             {
//                 to: "/viewProductEndorsement",
//                 title: "Product Endorsement",
//                 icon: "assignment_turned_in",
//             },
//         ]
//     },

//     //Close for Live Purpose
//     {
//         to: "/viewTransactions",
//         title: "Transaction",
//         icon: "money",
//     },
//     {
//         to: "/OrderManagement",
//         title: "Order Management",
//         icon: "money",
//     },
//     {
//         to: "/TransactionManagement",
//         title: "Transaction Management",
//         icon: "money",
//     },
//     {
//         to: "/viewShopProfile",
//         title: "Shop Profile",
//         icon: "shop",
//     },

    
//     {
//         to: "/category",
//         title: "Product Category",
//         icon: <Shop2Rounded />,
//     },

//     //Close for Live Purpose
//     {
//         to: "/stockList",
//         title: "Stock Management",
//         icon: "inventory",
//     },
//     {
//         to: "/PromotionListing",
//         title: "Promotion",
//         icon: "inventory",
//     },
//     {
//         to: "",
//         title: "Setting",
//         icon: <Settings />,
//         submenus: [
//             {
//                 to: "/shoplotList",
//                 title: "Shoplot",
//                 icon: <Shop2Rounded />,
//             },
//             {
//                 to: "/category",
//                 title: "Product Category",
//                 icon: <Shop2Rounded />,
//             },
//         ]
//     },
// ]


// export default SidebarConfiguration

import React, { Component, useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { GitAction } from "../../../store/action/gitAction";
import { withRouter } from "react-router";

const SidebarConfiguration = () => {
    const { sidebars } = useSelector((state) => ({
        sidebars: state.counterReducer.sidebars,
    }));
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(
            GitAction.CallFetchSidebar({
                ROLEGROUPID: JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID,
                PROJECTID: 2,
            })
        );
    }, []);

    let overallListing = [];

    sidebars.length > 0 &&
        JSON.parse(localStorage.getItem("loginUser"))[0].UserTypeID !== 1 ?
            sidebars.filter((x)=> x.PageID !== 15).map((data) => {
        if (data.submenus !== null && data.submenus !== "[]") {
            let submenu = [];
            JSON.parse(data.submenus).map((x) => {
                let data = {
                    to: x.page,
                    title: x.title,
                    // icon: x.icon.replace("fa fa-", ""),
                    icon: x.icon,
                };
                submenu.push(data);
            });
            let listing = {
                to: data.page,
                title: data.title,
                icon: data.icon,
                submenus: submenu,
            };
            overallListing.push(listing);
        } else {
            let listing = {
                to: data.page,
                title: data.title,
                icon: data.icon,
            };
            overallListing.push(listing);
        }
                })
                :
            sidebars.map((data) => {
            if (data.submenus !== null && data.submenus !== "[]") {
                let submenu = [];
                JSON.parse(data.submenus).map((x) => {
                    let data = {
                        to: x.page,
                        title: x.title,
                        // icon: x.icon.replace("fa fa-", ""),
                        icon: x.icon,
                    };
                    submenu.push(data);
                });
                let listing = {
                    to: data.page,
                    title: data.title,
                    icon: data.icon,
                    submenus: submenu,
                };
                overallListing.push(listing);
            } else {
                let listing = {
                    to: data.page,
                    title: data.title,
                    icon: data.icon,
                };
                overallListing.push(listing);
            }
                });

    return overallListing;
};

export default SidebarConfiguration;
