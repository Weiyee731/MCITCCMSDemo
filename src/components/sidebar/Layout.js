import React, { useState } from 'react';
import Aside from './Aside';
import Main from './Main';
import { isUserLogon, getSidebaritems } from "../auth/AuthManagement";
import Login from "../../pages/Login/Login";
import sidebar_items from './data/SidebarConfiguration';
import "./styles/sidebar.css";
import { isArrayNotEmpty } from '../../tools/Helpers';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Route,
} from "react-router-dom";

// Product
import ViewProductComponent from "../../pages/Product/ProductListing/viewProduct.component";
import AddProductAllInOne from "../../pages/Product/addProduct/addProductAllInOne.component";


function Layout() {
  const [rtl, setRtl] = useState(false);
  const [toggled, setToggled] = useState(false);
  const [isLogon, setIsLogon] = useState(isUserLogon());
  const [sidebaritem, setSidebaritem] = useState(getSidebaritems());


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

  return (
    <div className={`app ${rtl ? 'rtl' : ''} ${toggled ? 'toggled' : ''}`}>
      <ToastContainer />
      {
        isLogon === true ?
          <>
            <Aside
              image={false} // can set the background image for the sidebar here
              rtl={rtl}
              sidebarItems={isArrayNotEmpty(renderSidebarItems()) ? renderSidebarItems() : sidebar_items}
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
            <Route path="/viewProduct" component={ViewProductComponent} />
            <Route path="/addProductsAllIn" component={AddProductAllInOne} />
          </>
          :
          <Login />
      }
    </div >
  )
}

export default Layout;