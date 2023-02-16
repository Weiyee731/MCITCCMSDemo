import React, { useState } from 'react';
import Aside from './Aside';
import Main from './Main';
import { isUserLogon, getSidebaritems } from "../auth/AuthManagement";
import Login from "../../pages/Login/Login";
import SidebarConfiguration from './data/SidebarConfiguration';
import "./styles/sidebar.css";
import { isArrayNotEmpty } from '../../tools/Helpers';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Route,
} from "react-router-dom";

// Product
import ViewProductComponent from "../../pages/Product/ProductListing/viewProduct.component";
import ViewProductGeneralInfo from "../../pages/Product/ProductListing/viewProductGeneralInfo.component";
import ProductDetailsComponent from "../../pages/Product/ProductListing/viewProductDetailsList";
import viewProductEndorsementComponent from "../../pages/Product/ProductEndorsement/ProductEndorsement";
import AddProductAllInOne from "../../pages/Product/addProduct/addProductAllInOne.component";

// Transaction
import ViewTransactionsComponent from "../../pages/Transaction/viewTransaction.component";
import TransactionDetailsComponent from "../../pages/Transaction/transactionDetails.component";


// User Management
import ViewMerchantsComponent from "../../pages/UserManagement/Merchant/viewMerchant.component";
import ViewUserComponent from "../../pages/UserManagement/User/viewUser.component";
import EditShopProfile from "../../pages/Shop/viewShopProfile";
import RegisterMerchant from '../../pages/Register/RegisterMerchant';



function Layout() {
  const [rtl, setRtl] = useState(false);
  const [toggled, setToggled] = useState(false);
  const [isLogon, setIsLogon] = useState(isUserLogon());
  const [sidebaritem, setSidebaritem] = useState(getSidebaritems());
  const [path, setPath] = useState(window.location.pathname);

  // set sidebar to the right
  const handleRtlChange = (checked) => {
    setRtl(checked);
  };

  const handleToggleSidebar = (value) => {
    setToggled(value);
  };

  const renderSidebarItems = () => {
    try {
      return JSON.parse(sidebaritem)
    }
    catch (e) {
      return [];
    }
  }

  const setPromptedUserID = () => {

  };

  return (
    <>
      {
        isLogon === true && (path === "/ecommerceCMSDev/register" || path === "/cms.myemporia.my/register") ?
            <RegisterMerchant />
            :
        <div className={`app ${rtl ? 'rtl' : ''} ${toggled ? 'toggled' : ''}`}>
        <ToastContainer />
        {
          isLogon === true ?
            (path !== "/ecommerceCMSDev/register" || path !== "cms.myemporia.my" )&&
              <>
                <Aside
                  image={false} // can set the background image for the sidebar here
                  rtl={rtl}
                  sidebarItems={isArrayNotEmpty(renderSidebarItems()) ? renderSidebarItems() : SidebarConfiguration()}
                  toggled={toggled}
                  handleToggleSidebar={handleToggleSidebar}
                />
                <Main
                  image={false} // can set the background image for the sidebar here
                  toggled={toggled}
                  rtl={rtl}
                  handleToggleSidebar={handleToggleSidebar}
                  handleRtlChange={handleRtlChange}
                />
                {/* <Route path="/viewProduct" component={ViewProductComponent} />
            <Route path="/addProductsAllIn" component={AddProductAllInOne} />
            <Route
              exact
              path="/viewProductDetail/:productId"
              render={(props) => (
                <>
                  <ViewProductGeneralInfo
                    {...props}
                    layout="standard"
                    productId={props.match.params.productId}
                  />
                </>
              )}
            />
            <Route
              exact
              path="/viewProductDetailList/:productId"
              render={(props) => (
                <>
                  <ProductDetailsComponent
                    {...props}
                    layout="standard"
                    productId={props.match.params.productId}
                  />
                </>
              )}
            />

            <Route
              path="/viewProductEndorsement"
              component={viewProductEndorsementComponent}
            />

            <Route path="/viewTransactions" component={ViewTransactionsComponent} />

            <Route path="/viewMerchants" component={ViewMerchantsComponent} />
            <Route path="/viewUser" component={ViewUserComponent} />

            <Route
              path="/viewTransactioDetails"
              component={TransactionDetailsComponent}
            />

            <Route path="/viewShopProfile" component={EditShopProfile} /> */}

              </>
            :
            <Login />

        }
      </div >   
      }
      
    </>

  )
}

export default Layout;