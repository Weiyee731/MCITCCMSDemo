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


import { Settings, Shop2Rounded, ShopOutlined } from '@mui/icons-material';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import StorefrontIcon from '@mui/icons-material/Storefront';


const sidebar_items = [

    {
        to: "",
        title: "Product",
        icon: "indeterminate_check_box",
        submenus: [
            {
                to: "/viewProduct",
                title: "Product Listing",
                icon: "inventory",
            },
            {
                to: "/viewProductEndorsement",
                title: "Product Endorsement",
                icon: "assignment_turned_in",
            },
            // {
            //     to: "/promotionList",
            //     title: "Product Promotion",
            //     icon: "assignment_turned_in",
            // },
        ]
    },
    {
        to: "/viewTransactions",
        title: "Transaction",
        icon: "money",
    },
    // {
    //     to: "",
    //     title: "User Management",
    //     icon: <AssignmentIndIcon />,
    //     submenus: [
    //         {
    //             to: "/viewMerchants",
    //             title: "Merchant",
    //             icon: <AssignmentIndIcon />,
    //         },
    //         {
    //             to: "/viewUser",
    //             title: "User",
    //             icon: <AssignmentIndIcon />,
    //         },
    //     ]
    // },
    {
        to: "/viewShopProfile",
        title: "Shop Profile",
        icon: "shop",
    },
    {
        to: "/stockList",
        title: "Stock Management",
        icon: "inventory",
    },
    {
        to: "/PromotionListing",
        title: "Promotion",
        icon: "inventory",
    },
    {
        to: "",
        title: "Setting",
        icon: <Settings />,
        submenus: [
            {
                to: "/shoplotList",
                title: "Shoplot",
                icon: <Shop2Rounded />,
            },
            {
                to: "/category",
                title: "Product Category",
                icon: <Shop2Rounded />,
            },
        ]
    },
    // {
    //     to: "",
    //     title: "Report",
    //     icon: <AssignmentIndIcon />,
    //     submenus: [
    //         {
    //             to: "/viewPurchaseOrderList",
    //             title: "Purchase Order Listing",
    //             icon: <AssignmentIndIcon />,
    //         },
    //         {
    //             to: "/viewQuotationList",
    //             title: "Quotation Listing",
    //             icon: <AssignmentIndIcon />,
    //         },
    //     ]
    // },
    {
        to: "https://myemporia.my",
        title: "Back to Market Place",
        icon: <StorefrontIcon />,
    },
    // console.log("row", row)

    // {
    //     to: "/quotationList",
    //     title: "Quotation",
    //     icon: "shop",
    // },
    // {
    //     to: "",
    //     title: "Stock Management",
    //     icon: "indeterminate_check_box",
    //     submenus: [
    //         {
    //             to: "/OverallStock",
    //             title: "Overall",
    //             icon: "all_inbox",
    //         },
    //         {
    //             to: "/StockGoods",
    //             title: "Stock Order Goods",
    //             icon: "assignment_turned_in",
    //         },
    //     ]
    // },
]


export default sidebar_items
