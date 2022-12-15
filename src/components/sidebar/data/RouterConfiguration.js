// "user manual" : add your page in this configuration
/**
 *  sample:
 * 
    import Dashboard from "../../../pages/Dashboard/Dashboard";
 * 
 * const routes = [
    {
        path: "/",
        exact: true,
        element: <Dashboard />,
    },
    // if need to pass the params into the page, then follow the configuration below
    {
        path: "/UserDetail/:name/:fat",
        exact: true,
        element: <UserDetail />,
    },
]
 */
// import Dashboard from "../../../pages/Dashboard/Dashboard";
// import UserManagement from '../../../pages/UserManagement/UserManagement';
// import OverallStock from "../../../pages/Stock/OverallStock/OverallStock";
// import StockGoods from "../../../pages/Stock/StockGoods/StockGoods";
// import CreditNote from '../../../pages/Reporting/CreditNote/CreditNote';
// import DeliveryOrder from "../../../pages/Reporting/DeliveryOrder/DeliveryOrder";
// import Invoice from "../../../pages/Reporting/Invoice/Invoice";
// import DataManagement from "../../../pages/DataManagement/DataManagement";
// import AllPayments from "../../../pages/Payments/AllPayments/AllPayments";
// import BalanceSettlement from "../../../pages/Payments/BalanceSettlement/BalanceSettlement";
// import Statements from "../../../pages/Statements/Statements";
// import UserDetail from "../../../pages/UserManagement/UserDetail"
// import AddUser from "../../../pages/UserManagement/AddUser";

// Product
import ViewProductComponent from "../../../pages/Product/ProductListing/viewProduct.component";
import ViewProductGeneralInfo from "../../../pages/Product/ProductListing/viewProductGeneralInfo.component";
import ProductDetailsComponent from "../../../pages/Product/ProductListing/viewProductDetailsList";
// import viewProductEndorsementComponent from "../../../pages/Product/ProductEndorsement/ProductEndorsement";
import ViewProductEndorsementComponent from "../../../pages/Product/ProductEndorsement/ProductEndorsement";
import AddProductAllInOne from "../../../pages/Product/addProduct/addProductAllInOne.component";

// Transaction
import ViewTransactionsComponent from "../../../pages/Transaction/viewTransaction.component";
import TransactionDetailsComponent from "../../../pages/Transaction/transactionDetails.component";


// User Management
import ViewMerchantsComponent from "../../../pages/UserManagement/Merchant/viewMerchant.component";
import ViewUserComponent from "../../../pages/UserManagement/User/viewUser.component";
import EditShopProfile from "../../../pages/Shop/viewShopProfile";

// Promotion
import ViewProductPromotionComponent from "../../../pages/Promotion/viewProductPromotion.component";
import AddPromotionBannerComponent from "../../../pages/Promotion/addPromotion.component";

// Stock Management
import StockManagement from "../../../pages/Stock/OverallStock";
import NewStock from "../../../pages/Stock/addStock";
import StockDetail from "../../../pages/Stock/StockDetail";

import ShoplotListing from "../../../pages/Setting/StoreListing";
import {ProductCategory} from "../../../pages/ProductCategory/viewProductCategories.component";

import ShoplotDetailListing from "../../../pages/Setting/StoreDetailListing";
import ProductPurchaseOrder from "../../../pages/Report/ProductPurchaseOrder";
import QuotationListing from "../../../pages/Report/QuotationListing";
import { PromotionDetails } from "../../../pages/Promotion/PromotionDetails";
import { PromotionListing } from "../../../pages/Promotion/PromotionListing";

const routes = [
    // {
    //     path: "/",
    //     exact: true,
    //     element: <Dashboard />,
    // },
    // {
    //     path: "/UserManagement",
    //     exact: true,
    //     element: <UserManagement />,
    // },
    // {
    //     path: "/OverallStock",
    //     exact: true,
    //     element: <OverallStock />,
    // },
    // {
    //     path: "/StockGoods",
    //     exact: true,
    //     element: <StockGoods />,
    // },
    // {
    //     path: "/Invoice",
    //     exact: true,
    //     element: <Invoice />,
    // },
    // {
    //     path: "/DeliveryOrder",
    //     exact: true,
    //     element: <DeliveryOrder />,
    // },
    // {
    //     path: "/CreditNote",
    //     exact: true,
    //     element: <CreditNote />,
    // },
    // {
    //     path: "/ImportExcelData",
    //     exact: true,
    //     element: <DataManagement />,
    // },
    // {
    //     path: "/AllPayments",
    //     exact: true,
    //     element: <AllPayments />,
    // },
    // {
    //     path: "/BalanceSettlement",
    //     exact: true,
    //     element: <BalanceSettlement />,
    // },
    // {
    //     path: "/Statements",
    //     exact: true,
    //     element: <Statements />,
    // },
    // {
    //     path: "/UserDetail/:name/:fat",
    //     exact: true,
    //     element: <UserDetail />,
    // },
    // {
    //     path: "/AddUser",
    //     exact: true,
    //     element: <AddUser />,
    // },

    {
        path: "/viewProduct",
        exact: true,
        element: <ViewProductComponent />,
    },
    {
        path: "/addProductsAllIn",
        exact: true,
        element: <AddProductAllInOne />,
    },
    {
        path: "/viewProduct",
        exact: true,
        element: <ViewProductComponent />,
    },

    {
        path: "/viewProduct/:category/:categoryId/",
        exact: true,
        element: (props) => (
            <>
                <ViewProductComponent
                    {...props}
                    layout="standard"
                    categoryId={props.match.params.categoryId}
                    category={props.match.params.category}
                />
            </>
        ),
    },
    {
        path: "/viewProductEndorsement",
        exact: true,
        element: <ViewProductEndorsementComponent />,
    },
    {
        path: "/viewProductDetail/:productId",
        exact: true,
        element: (props) => (
            <>
                <ViewProductGeneralInfo
                    {...props}
                    layout="standard"
                    productId={props.match.params.productId}
                />
            </>
        ),
    },
    {
        path: "/viewProductDetailList/:productId",
        exact: true,
        element: (props) => (
            <>
                <ProductDetailsComponent
                    {...props}
                    layout="standard"
                    productId={props.match.params.productId}
                />
            </>
        ),
    },

    {
        path: "/viewTransactions",
        exact: true,
        element: <ViewTransactionsComponent />,
    },
    {
        path: "/viewMerchants",
        exact: true,
        element: <ViewMerchantsComponent />,
    },
    {
        path: "/viewUser",
        exact: true,
        element: <ViewUserComponent />,
    },
    {
        path: "/viewTransactioDetails",
        exact: true,
        element: <TransactionDetailsComponent />,
    },
    {
        path: "/viewShopProfile",
        exact: true,
        element: <EditShopProfile />,
    },
    {
        path: "/PromotionDetails/:promotionID",
        exact: true,
        element: (props) => (
            <>
                <PromotionDetails
                    {...props}
                    layout="standard"
                    productId={props.match.params.promotionID}
                />
            </>
        ),
    },
    {
        path: "/PromotionListing",
        exact: true,
        element: <PromotionListing />,
    },
    {
        path: "/promotionList",
        exact: true,
        element: <ViewProductPromotionComponent />,
    },
    {
        path: "/addPromotion",
        exact: true,
        element: <AddPromotionBannerComponent />,
    },

    {
        path: "/stockList",
        exact: true,
        element: <StockManagement />,
    },
    {
        path: "/addStock",
        exact: true,
        element: <NewStock />,
    },
    {
        path: "/viewStockDetailList/:ProductVariationDetailID",
        exact: true,
        element: (props) => (
            <>
                <StockDetail
                    {...props}
                    layout="standard"
                    productId={props.match.params.ProductVariationDetailID}
                />
            </>
        ),
    },

    {
        path: "/shoplotList",
        exact: true,
        element: <ShoplotListing />,
    },
    {
        path: "/category",
        exact: true,
        element: <ProductCategory />,
    },

    {
        path: "/viewShoplotDetailList/:shoplotID",
        exact: true,
        element: (props) => (
            <>
                <ShoplotDetailListing
                    {...props}
                    layout="standard"
                    shoplotID={props.match.params.shoplotID}
                />
            </>
        ),
    },

    {
        path: "/viewPurchaseOrderList",
        exact: true,
        element: <ProductPurchaseOrder />,
    },

    {
        path: "/viewQuotationList",
        exact: true,
        element: <QuotationListing />,
    },

]

export default routes