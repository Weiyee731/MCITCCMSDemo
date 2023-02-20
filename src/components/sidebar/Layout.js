import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { GitAction } from "../../store/action/gitAction";
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


var CryptoJS = require("crypto-js");

function Layout() {
  const { userProfile } = useSelector(state => ({
    userProfile: state.counterReducer.userProfile,
  }));

  const dispatch = useDispatch()
  const [rtl, setRtl] = useState(false);
  const [toggled, setToggled] = useState(false);
  const [isProfileCheck, checkProfile] = useState(false);
  const [encryptData, setEncryptData] = useState("");
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

  const decryptData = (data) => {
    var bytes = CryptoJS.AES.decrypt(data, 'myemporia@123');
    var decryptedData = bytes.toString(CryptoJS.enc.Utf8);

    return decryptedData
  }

  useEffect(() => {
    let systemPath = path.split("/")
    let pathLength = systemPath.length

    if (systemPath !== undefined && isArrayNotEmpty(systemPath) && !isNaN(systemPath[pathLength - 1])) {
      setEncryptData({
        UserID: systemPath[pathLength - 1],
        UserName: systemPath[pathLength - 2],
      })
      localStorage.setItem("project", "myemporia")
      localStorage.setItem("projectURL", "CMS.myemporia.my")
      localStorage.setItem("projectDomain", "myemporia" + "." + "MY")
      dispatch(GitAction.CallUserProfile({
        TYPE: "UserProfile",
        TYPEVALUE: systemPath[pathLength - 1],
        USERID: systemPath[pathLength - 1],
        USERROLEID: 0,
        LISTPERPAGE: 999,
        PAGE: 1,
        ProjectID: 2
      }))
    }
    if (isNaN(systemPath[pathLength - 1]) || systemPath[pathLength - 3] !== "register")
      checkProfile("wrongpath")

  }, [])

  useEffect(() => {
    if (userProfile.length > 0 && isProfileCheck === false) {
      let username = decryptData(encryptData.UserName.split("_")[0].replace(/p1L2u3S/g, '+').replace(/s1L2a3S4h/g, '/').replace(/e1Q2u3A4l/g, '='))

      if (username === userProfile[0].Username) {
        localStorage.setItem("UserID", encryptData.UserID)
        localStorage.setItem("UserName", username)
        checkProfile(true)
      }
      else
        checkProfile("error")
    }
  }, [userProfile])

  const checkPathName = () => {
    let systemPath = path.split("/")
    let pathLength = systemPath.length
    let isRegister = false

    if (systemPath.filter((x) => x === "register").length > 0)
      isRegister = true

    return isRegister
  }

  return (
    <>
      {
        checkPathName() === true
          ?
          <RegisterMerchant isProfileCheck={isProfileCheck} userData={encryptData} />
          :
          <div className={`app ${rtl ? 'rtl' : ''} ${toggled ? 'toggled' : ''}`}>
            <ToastContainer />
            {
              isLogon === true ?
                // (path !== "/ecommerceCMSDev/register" || path !== "cms.myemporia.my") &&
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
                </>
                :
                <Login />

            }
          </div >
      }

    </>

  )
}

export default (Layout);