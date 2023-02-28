import 'rxjs'

import { GitAction } from "../action/gitAction";
import { toast } from "react-toastify";
import axios from "axios";
import { ServerConfiguration } from "../serverConf";
const { filter, map } = require('rxjs/operators');
const url = ServerConfiguration.DevServerUrl;
const loginUrl = ServerConfiguration.LoginUrl;
const LiveServerLoginUrl = ServerConfiguration.LiveServerLoginUrl;

// const project = 'emporia'
const project = window.localStorage.getItem("project")

export class GitEpic {
  ///////////////////////////////////////////////////  user account credentials ///////////////////////////////////////////////////

  User_Login = action$ =>
    action$.pipe(filter(action => action.type === GitAction.Login), map(action => {
      return dispatch => {
        try {
          console.log(url + project + "/" +
            // url + project + "/" +
            "User_Login?username=" +
            action.payload.username +
            "&password=" +
            action.payload.password +
            "&ProjectDomainName=" +
            action.payload.ProjectDomainName)
          return fetch(
            url + project + "/" +
            // url + project + "/" +
            "User_Login?username=" +
            action.payload.username +
            "&password=" +
            action.payload.password +
            "&ProjectDomainName=" +
            action.payload.ProjectDomainName)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.LoginSuccess, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.LoginSuccess, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: User_Login. Please check on URL")
          return dispatch({ type: GitAction.LoginSuccess, payload: [] });
        }
      }
    }));


  User_CheckEmail_Dupe = action$ =>
    action$.pipe(filter(action => action.type === GitAction.CheckMail_Dupe), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "User_CheckDuplicate?email=" +
            action.payload.email +
            "&ProjectID=" +
            action.payload.ProjectID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.CheckedMail_Dupe, payload: JSON.parse(json[0].ReturnData) });
              } else {
                toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.CheckedMail_Dupe, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: Check email duplication. Please check on URL")
          return dispatch({ type: GitAction.CheckedMail_Dupe, payload: [] });
        }
      }
    }));

  SendEmail_OTP = action$ =>
    action$.pipe(filter(action => action.type === GitAction.Send_OTPVerification), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "User_SentOTPVerification?USERID=" +
            action.payload.UserID +
            "&TYPE=" +
            action.payload.Type +
            "&VALIDATIONFIELD=" +
            action.payload.ValidationField)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.Sent_OTPVerification, payload: JSON.parse(json[0].ReturnData) });
              } else {
                toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.Sent_OTPVerification, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: OTP Verification error. Please check on URL")
          return dispatch({ type: GitAction.Sent_OTPVerification, payload: [] });
        }
      }
    }));


  UpdateForgotten_Pass = action$ =>
    action$.pipe(filter(action => action.type === GitAction.Update_ForgotPassword), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "User_UpdateProfileSpecificField?USERID=" +
            action.payload.UserID +
            "&TYPE=" +
            action.payload.Type +
            "&OTP=" +
            action.payload.OTP +
            "&UPDATEDFIELD=" +
            action.payload.UpdatedField
          )
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.Updated_ForgotPassword, payload: JSON.parse(json[0].ReturnData) });
              } else {
                toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.Updated_ForgotPassword, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: OTP Verification error. Please check on URL")
          return dispatch({ type: GitAction.Updated_ForgotPassword, payload: [] });
        }
      }
    }));

  User_LoginServer = action$ =>
    action$.pipe(filter(action => action.type === GitAction.LoginServer), map(action => {
      return dispatch => {
        try {
          return fetch(LiveServerLoginUrl + action.payload.ProjectDomainName + "/" +
            "User_Login?username=" +
            action.payload.username +
            "&password=" +
            action.payload.password +
            "&ProjectDomainName=" +
            action.payload.ProjectDomainName)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.LoginServerSuccess, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.LoginServerSuccess, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: User_LoginServer. Please check on URL")
          return dispatch({ type: GitAction.LoginServerSuccess, payload: [] });
        }
      }
    }));

  User_Logout = action$ =>
    action$.pipe(filter(action => action.type === GitAction.Logout), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "User_Logout?UserId=" + action.payload.UserId)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.LoggedOutSuccess, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.LoggedOutSuccess, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: User_Logout. Please check on URL")
          return dispatch({ type: GitAction.LoggedOutSuccess, payload: [] });
        }
      }
    }));

  User_Register = action$ =>
    action$.pipe(filter(action => action.type === GitAction.RegisterUser), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "User_Register?" +
            "userFirstName=" + action.payload.userFirstName +
            "&userLastName=" + action.payload.userLastName +
            "&username=" + action.payload.username +
            "&userEmail=" + action.payload.userEmail +
            "&password=" + action.payload.password)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.UserRegistered, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.UserRegistered, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: User_Register. Please check on URL")
          return dispatch({ type: GitAction.UserRegistered, payload: [] });
        }
      }
    }));

  User_ViewProfile = action$ =>
    action$.pipe(filter(action => action.type === GitAction.GetUserProfile), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "User_ProfileListByType?TYPE=" + action.payload.TYPE +
            "&TYPEVALUE=" + action.payload.TYPEVALUE +
            "&USERID=" + action.payload.USERID +
            "&UserRoleID=" + action.payload.USERROLEID +
            "&LISTPERPAGE=" + action.payload.LISTPERPAGE +
            "&PAGE=" + action.payload.PAGE +
            "&ProjectID=" + action.payload.ProjectID
          )
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.GotUserProfile, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.GotUserProfile, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: User_ViewProfile. Please check on URL")
          return dispatch({ type: GitAction.GotUserProfile, payload: [] });
        }
      }
    }));

  User_UpdateProfileStatus = action$ =>
    action$.pipe(filter(action => action.type === GitAction.UpdateUserStatus), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "User_UpdateProfileStatus?USERID=" + action.payload.USERID +
            "&USERSTATUS=" + action.payload.USERSTATUS)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.UpdatedUserStatus, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.UpdatedUserStatus, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: User_UpdateProfileStatus. Please check on URL")
          return dispatch({ type: GitAction.UpdatedUserStatus, payload: [] });
        }
      }
    }));

  ///////////////////////////////////////////////////  Shop  ///////////////////////////////////////////////////

  Shop_UpdateDetails = action$ =>
    action$.pipe(filter(action => action.type === GitAction.UpdateShopDetails), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "User_UpdateShopDetail?USERID=" + action.payload.USERID +
            "&SHOPNAME=" + action.payload.SHOPNAME +
            "&SHOPDESC=" + action.payload.SHOPDESC +
            "&SHOPPOSCODE=" + action.payload.SHOPPOSCODE +
            "&SHOPCITY=" + action.payload.SHOPCITY +
            "&SHOPSTATE=" + action.payload.SHOPSTATE +
            "&SHOPCOUNTRYID=" + action.payload.SHOPCOUNTRYID +
            "&SHOPIMAGE=" + action.payload.SHOPIMAGE +
            "&SHOPCOVERIMAGE=" + action.payload.SHOPCOVERIMAGE
          )
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.UpdatedShopDetails, payload: JSON.parse(json[0].ReturnData) });
              } else {
                toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.UpdatedShopDetails, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: Shop_UpdateDetails. Please check on URL")
          return dispatch({ type: GitAction.UpdatedShopDetails, payload: [] });
        }
      }
    }));

  ///////////////////////////////////////////////////  Address  ///////////////////////////////////////////////////

  Address_ViewAll = action$ =>
    action$.pipe(filter(action => action.type === GitAction.GetAllAddress), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "User_ViewAllAddressBook?ProjectID=" + action.payload.ProjectID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.GotAllAddress, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.GotAllAddress, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: User_UpdateProfileStatus. Please check on URL")
          return dispatch({ type: GitAction.GotAllAddress, payload: [] });
        }
      }
    }));

  ///////////////////////////////////////////////////  Order  ///////////////////////////////////////////////////

  // Order_Add = (action$) =>
  //   action$.ofType(GitAction.AddOrder).switchMap(async ({ payload }) => {
  //     try {
  //       const response = await fetch(
  //         url + project + "/" +
  //         "Order_AddOrder?USERID=" + payload.UserID +
  //         "&USERADDRESSID=" + payload.UserAddressID +
  //         "&PROMOTIONID=0&PROMOTIONCODEID=0&PAYMENTMETHODID=" + payload.PaymentMethodID +
  //         "&USERPAYMENTMETHODID=" + payload.UserPaymentMethodID +
  //         "&ORDERTOTALAMOUNT=" + payload.OrderTotalAmount +
  //         "&ORDERPAIDAMOUNT=" + payload.OrderPaidAmount +
  //         "&PRODUCTID=" + payload.ProductID +
  //         "&PRODUCTQUANTITY=" + payload.ProductQuantity +
  //         "&PRODUCTVARIATIONDETAILID=" + payload.ProductVariationDetailID +
  //         "&TRACKINGSTATUSID=" + payload.TrackingStatusID +
  //         "&PickUpInd=" + payload.PickUpInd +
  //         "&ProjectID=" + payload.ProjectID
  //       );
  //       let json = await response.json();
  //       json = JSON.parse(json);
  //       if (json[0].ReturnVal === 1) {
  //         toast.success("Order is successfully created ORDERID : " + json[0].OrderID);
  //       }
  //       try {
  //         const response_1 = await fetch(
  //           url +
  //           "Product_DeleteProductCart?USERCARTID=" +
  //           payload.UserCartID
  //         );
  //         let json_1 = await response_1.json();
  //         json_1 = json_1
  //         return {
  //           type: GitAction.AddedOrder,
  //           payload: json,
  //         };
  //       } catch (error) {
  //         alert('deleteProductCart: ' + error);
  //         return {
  //           type: GitAction.AddedOrder,
  //           payload: [],
  //         };
  //       }
  //     }
  //     catch (error) {
  //       alert('AddOrder: ' + error);
  //       return {
  //         type: GitAction.AddedOrder,
  //         payload: [],
  //       };
  //     }
  //   });

  Order_ViewAll = action$ =>
    action$.pipe(filter(action => action.type === GitAction.GetTransactions), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Order_ViewOrder?TRACKINGSTATUS=" + action.payload.TrackingStatus +
            "&UserID=" + action.payload.UserID +
            "&ProjectID=" + action.payload.ProjectID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.GotTransactions, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.GotTransactions, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: Order_ViewAll. Please check on URL")
          return dispatch({ type: GitAction.GotTransactions, payload: [] });
        }
      }
    }));

  Order_CreateOrderShipment = action$ =>
    action$.pipe(filter(action => action.type === GitAction.OrderCreateShipment), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Order_CreateOrderShipment?PACKAGETYPE=" + action.payload.PACKAGETYPE +
            "&WEIGHT=" + action.payload.WEIGHT +
            "&LENGTH=" + action.payload.LENGTH +
            "&WIDTH=" + action.payload.WIDTH +
            "&HEIGHT=" + action.payload.HEIGHT +
            "&SENDER_CONTACTPERSON=" + action.payload.SENDER_CONTACTPERSON +
            "&SENDER_COMPANY=" + action.payload.SENDER_COMPANY +
            "&SENDER_CONTACTNO=" + action.payload.SENDER_CONTACTNO +
            "&SENDER_ADDLINE1=" + action.payload.SENDER_ADDLINE1 +
            "&SENDER_ADDLINE2=" + action.payload.SENDER_ADDLINE2 +
            "&SENDER_CITY=" + action.payload.SENDER_CITY +
            "&SENDER_STATE=" + action.payload.SENDER_STATE +
            "&SENDER_POSCODE=" + action.payload.SENDER_POSCODE +
            "&RECEIVER_FULLNAME=" + action.payload.RECEIVER_FULLNAME +
            "&RECEIVER_CONTACTNO=" + action.payload.RECEIVER_CONTACTNO +
            "&RECEIVER_ADDLINE1=" + action.payload.RECEIVER_ADDLINE1 +
            "&RECEIVER_ADDLINE2=" + action.payload.RECEIVER_ADDLINE2 +
            "&RECEIVER_CITY=" + action.payload.RECEIVER_CITY +
            "&RECEIVER_STATE=" + action.payload.RECEIVER_STATE +
            "&RECEIVER_POSCODE=" + action.payload.RECEIVER_POSCODE +
            "&RECEIVER_COUNTRYCODE=" + action.payload.RECEIVER_COUNTRYCODE +
            "&PARCELQUANTITY=" + action.payload.PARCELQUANTITY +
            "&LOGISTICID=" + action.payload.LOGISTICID +
            "&ORDERNAME=" + action.payload.ORDERNAME +
            "&ORDERPRODUCTDETAILSID=" + action.payload.ORDERPRODUCTDETAILSID +
            "&PROJECTID=" + action.payload.PROJECTID)
            .then(response => response.json())
            .then(json => {


              json = JSON.parse(json)

              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.OrderedCreateShipment, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.OrderedCreateShipment, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: OrderedCreateShipment. Please check on URL")
          return dispatch({ type: GitAction.OrderedCreateShipment, payload: [] });
        }
      }
    }));

  Order_RequestOrderShipmentStatus = action$ =>
    action$.pipe(filter(action => action.type === GitAction.OrderRequestShipmentStatus), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Order_RequestOrderStatus?TRACKINGNUMBER=" + action.payload.TRACKINGNUMBER +
            "&TYPE=" + action.payload.TYPE +
            "&PROJECTID=" + action.payload.PROJECTID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 0) {
                return dispatch({ type: GitAction.OrderRequestedShipmentStatus, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.OrderRequestedShipmentStatus, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: OrderRequestedShipmentStatus. Please check on URL")
          return dispatch({ type: GitAction.OrderRequestedShipmentStatus, payload: [] });
        }
      }
    }));

  Order_UpdateTrackingStatus = action$ =>
    action$.pipe(filter(action => action.type === GitAction.OrderTrackingStatusUpdate), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Order_UpdateTrackingStatus?OrderID=" + action.payload.OrderID +
            "&TrackingStatusID=" + action.payload.TrackingStatusID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.OrderTrackingStatusUpdated, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.OrderTrackingStatusUpdated, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: OrderTrackingStatusUpdated. ")
          return dispatch({ type: GitAction.OrderTrackingStatusUpdated, payload: [] });
        }
      }
    }));

  Order_UpdateUserDetails = action$ =>
    action$.pipe(filter(action => action.type === GitAction.OrderUserDetailsUpdate), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Order_UpdateOrderUserDetails?OrderID=" + action.payload.OrderID +
            "&FirstName=" + action.payload.FirstName +
            "&LastName=" + action.payload.LastName +
            "&UserContactNo=" + action.payload.UserContactNo +
            "&PickUpInd=" + action.payload.PickUpInd +
            "&UserEmailAddress=" + action.payload.UserEmailAddress +
            "&UserAddressLine1=" + action.payload.UserAddressLine1 +
            "&UserAddressLine2=" + action.payload.UserAddressLine2 +
            "&UserPoscode=" + action.payload.UserPoscode +
            "&UserState=" + action.payload.UserState +
            "&UserCity=" + action.payload.UserCity +
            "&CountryID=" + action.payload.CountryID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.OrderUserDetailsUpdated, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.OrderUserDetailsUpdated, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: Order_UpdateUserDetails. Please check on URL")
          return dispatch({ type: GitAction.OrderUserDetailsUpdated, payload: [] });
        }
      }
    }));

  Transaction_ViewStatus = action$ =>
    action$.pipe(filter(action => action.type === GitAction.GetTransactionStatus), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Order_ViewOrderStatus")
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.GotTransactionStatus, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.GotTransactionStatus, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: Transaction_ViewStatus. Please check on URL")
          return dispatch({ type: GitAction.GotTransactionStatus, payload: [] });
        }
      }
    }));

  Order_UpdateTrackingNumber = action$ =>
    action$.pipe(filter(action => action.type === GitAction.updateTrackingNumber), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Order_UpdateTrackingNumber?ORDERTRACKINGNUMBER=" + action.payload.ORDERTRACKINGNUMBER +
            "&LOGISTICID=" + action.payload.LOGISTICID +
            "&PDFLABEL=" + action.payload.PDFLABEL +
            "&ORDERPRODUCTDETAILSID=" + action.payload.ORDERPRODUCTDETAILSID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.updatedTrackingNumber, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.updatedTrackingNumber, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: Order_UpdateTrackingNumber. Please check on URL")
          return dispatch({ type: GitAction.updatedTrackingNumber, payload: [] });
        }
      }
    }));

  ///////////////////////////////////////////////////  Merchant  ///////////////////////////////////////////////////

  Merchants_ViewProfile = action$ =>
    action$.pipe(filter(action => action.type === GitAction.GetMerchants), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "User_ProfileListByType?TYPE=" + action.payload.type +
            "&TYPEVALUE=" + action.payload.typeValue +
            "&USERID=" + action.payload.USERID +
            "&UserRoleID=" + action.payload.userRoleID +
            "&LISTPERPAGE=" + action.payload.productPage +
            "&PAGE=" + action.payload.page +
            "&ProjectID=" + action.payload.ProjectID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.GotMerchants, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.GotMerchants, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: Merchants_ViewProfile. Please check on URL")
          return dispatch({ type: GitAction.GotMerchants, payload: [] });
        }
      }
    }));

  Merchants_ViewAllOrder = action$ =>
    action$.pipe(filter(action => action.type === GitAction.GetMerchantOrders), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Order_ViewOrderByUserID?TRACKINGSTATUS=" +
            action.payload.trackingStatus +
            "&USERID=" +
            action.payload.UserID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.GotMerchantOrders, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // // toast.error(json[0].ReturnMsg)
                toast("The current user has no purchase history at the moment")
                return dispatch({ type: GitAction.GotMerchantOrders, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: Merchants_ViewAllOrder. Please check on URL")
          return dispatch({ type: GitAction.GotMerchantOrders, payload: [] });
        }
      }
    }));


  User_UpdateMerchantProfile = action$ =>
    action$.pipe(filter(action => action.type === GitAction.GetUpdateMerchantProfile), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "User_UpdateMerchantProfile?USERID=" +
            action.payload.USERID +
            "&FIRSTNAME=" +
            action.payload.FIRSTNAME +
            "&LASTNAME=" +
            action.payload.LASTNAME +
            "&USEREMAIL=" +
            action.payload.USEREMAIL +
            "&USERGENDER=" +
            action.payload.USERGENDER +
            "&USERCONTACTNO=" +
            action.payload.USERCONTACTNO +
            "&USERDOB=" +
            action.payload.USERDOB +
            "&USERNRIC=" +
            action.payload.USERNRIC +
            "&SHOPBANK=" +
            action.payload.SHOPBANK +
            "&SHOPBANKACCOUNTNAME=" +
            action.payload.SHOPBANKACCOUNTNAME +
            "&SHOPBANKACCOUNTNO=" +
            action.payload.SHOPBANKACCOUNTNO +
            "&SHOPBANKACCOUNTHEADER=" +
            action.payload.SHOPBANKACCOUNTHEADER)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.GotUpdateMerchantProfile, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                toast("The current user has no purchase history at the moment")
                return dispatch({ type: GitAction.GotUpdateMerchantProfile, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: Merchants_ViewAllOrder. Please check on URL")
          return dispatch({ type: GitAction.GotUpdateMerchantProfile, payload: [] });
        }
      }
    }));

  ///////////////////////////////////////////////////  Products  ///////////////////////////////////////////////////

  Product_Add = action$ =>
    action$.pipe(filter(action => action.type === GitAction.AddProduct), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/Product_AddProductByPost"
            , {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                PRODUCTNAME: action.payload.name,
                PROJECTID: action.payload.ProjectID,
                MERCHANT: action.payload.productSupplier,
                PRODUCTDESC: action.payload.description,
                PRODUCTCATEGORYID: action.payload.productCategory,
                PRODUCTHEIGHT: action.payload.height,
                PRODUCTWIDTH: action.payload.width,
                PRODUCTDEPTH: action.payload.depth,
                PRODUCTWEIGHT: action.payload.weight,
                PRODUCTSKU: action.payload.sku,
                PRODUCTBRAND: action.payload.brand,
                PRODUCTMODEL: action.payload.model,
                PRODUCTTAG: action.payload.tags,
                USERID: action.payload.UserID
              })
            })
            .then(response => response.json())
            .then(json => {
              // json = JSON.parse(json)

              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.AddedProduct, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.AddedProduct, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: Product_Add. Please check on URL")
          return dispatch({ type: GitAction.AddedProduct, payload: [] });
        }
      }
    }));

  Product_Update = action$ =>
    action$.pipe(filter(action => action.type === GitAction.UpdateProduct), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/Product_UpdateProductByPost"
            , {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                PRODUCTID: action.payload.ProductID,
                PRODUCTNAME: action.payload.name,
                PROJECTID: action.payload.ProjectID,
                MERCHANT: action.payload.productSupplier,
                PRODUCTDESC: action.payload.description,
                PRODUCTCATEGORYID: action.payload.productCategory,
                PRODUCTHEIGHT: action.payload.height,
                PRODUCTWIDTH: action.payload.width,
                PRODUCTDEPTH: action.payload.depth,
                PRODUCTWEIGHT: action.payload.weight,
                PRODUCTSKU: action.payload.sku,
                PRODUCTBRAND: action.payload.brand,
                PRODUCTMODEL: action.payload.model,
                PRODUCTTAG: action.payload.tags,
                USERID: action.payload.UserID
              })
            })
            .then(response => response.json())
            .then(json => {

              // json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.UpdatedProduct, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.UpdatedProduct, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: Product_Update. Please check on URL")
          return dispatch({ type: GitAction.UpdatedProduct, payload: [] });
        }
      }
    }));

  Product_Delete = action$ =>
    action$.pipe(filter(action => action.type === GitAction.DeleteProduct), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Product_DeleteProducts?ProductIDs=" + action.payload.ProductID +
            "&USERID=" + action.payload.UserID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.DeletedProduct, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.DeletedProduct, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: Product_Delete. Please check on URL")
          return dispatch({ type: GitAction.DeletedProduct, payload: [] });
        }
      }
    }));

  Product_ViewAll = action$ =>
    action$.pipe(filter(action => action.type === GitAction.GetProduct), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Product_ItemListByType?Type=" + action.payload.type +
            "&TypeValue=" + action.payload.typeValue +
            "&USERID=" + action.payload.userId +
            "&PLATFORMTYPE=CMS" +
            "&PRODUCTPERPAGE=" + action.payload.productPage +
            "&PAGE=" + action.payload.page +
            "&ProjectID=" + action.payload.ProjectID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.GotProduct, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.GotProduct, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: Product_ViewAll. Please check on URL")
          return dispatch({ type: GitAction.GotProduct, payload: [] });
        }
      }
    }));

  Product_ViewListing = action$ =>
    action$.pipe(filter(action => action.type === GitAction.GetProductListing), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Product_ItemListByType?Type=" + action.payload.type +
            "&TypeValue=" + action.payload.typeValue +
            "&USERID=" + action.payload.userId +
            "&PLATFORMTYPE=CMS" +
            "&PRODUCTPERPAGE=" + action.payload.productPage +
            "&PAGE=" + action.payload.page +
            "&ProjectID=" + action.payload.ProjectID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.GotProductListing, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.GotProductListing, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: Product_ViewListing. Please check on URL")
          return dispatch({ type: GitAction.GotProductListing, payload: [] });
        }
      }
    }));

  Product_ViewDetail = action$ =>
    action$.pipe(filter(action => action.type === GitAction.GetProductDetail), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Product_ItemDetailByProductID?ProductID=" + action.payload.productId +
            "&USERID=" + action.payload.userId +
            "&PLATFORMTYPE=CMS" +
            "&ProjectID=" + action.payload.ProjectID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.GotProductDetail, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.GotProductDetail, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: Product_ViewDetail. Please check on URL")
          return dispatch({ type: GitAction.GotProductDetail, payload: [] });
        }
      }
    }));

  Product_Endorse = action$ =>
    action$.pipe(filter(action => action.type === GitAction.EndorseProduct), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Product_EndorseProducts?ProductIDs=" + action.payload.ProductID +
            "&USERID=" + action.payload.UserID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.ProductEndorsed, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.ProductEndorsed, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: Product_Endorse. Please check on URL")
          return dispatch({ type: GitAction.ProductEndorsed, payload: [] });
        }
      }
    }));

  Product_CheckDuplicateName = action$ =>
    action$.pipe(filter(action => action.type === GitAction.CheckProduct), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Product_CheckDuplication?PRODUCTNAME=" + action.payload.ProductName +
            "&ProjectID=" + action.payload.ProjectID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.ProductChecked, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.ProductChecked, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: Product_Endorse. Please check on URL")
          return dispatch({ type: GitAction.ProductChecked, payload: [] });
        }
      }
    }));

  Product_CheckDuplicateSKU = action$ =>
    action$.pipe(filter(action => action.type === GitAction.CheckProductSKU), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Product_CheckDuplicationBySKU?PRODUCTSKU=" + action.payload.ProductSKU +
            "&USERID=" + action.payload.UserID +
            "&PROJECTID=" + action.payload.ProjectID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.ProductCheckedSKU, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.ProductCheckedSKU, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: Product_Endorse. Please check on URL")
          return dispatch({ type: GitAction.ProductCheckedSKU, payload: [] });
        }
      }
    }));

  ///////////////////////////////////////////////////  Product Variation  ///////////////////////////////////////////////////

  ProductVariation_Add = action$ =>
    action$.pipe(filter(action => action.type === GitAction.AddProductVariation), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Product_AddProductVariation?PRODUCTVARIATION=" + action.payload.ProductVariation +
            "&PRODUCTCATEGORYID=" + action.payload.ProductCategoryID +
            "&CUSTOMIZABLE=" + action.payload.CustomizableIndicator +
            "&USERID=" + action.payload.UserID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.AddedProductVariation, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.AddedProductVariation, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: ProductVariation_Add. Please check on URL")
          return dispatch({ type: GitAction.AddedProductVariation, payload: [] });
        }
      }
    }));

  ProductVariation_Update = action$ =>
    action$.pipe(filter(action => action.type === GitAction.UpdateProductVariation), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Product_UpdateProductVariation?PRODUCTVARIATIONID=" + action.payload.ProductVariationID +
            "&PRODUCTVARIATION=" + action.payload.ProductVariation +
            "&PRODUCTCATEGORYID=" + action.payload.ProductCategoryID +
            "&CUSTOMIZABLE=" + action.payload.Customizable +
            "&USERID=" + action.payload.UserID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.UpdatedProductVariation, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.UpdatedProductVariation, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: ProductVariation_Update. Please check on URL")
          return dispatch({ type: GitAction.UpdatedProductVariation, payload: [] });
        }
      }
    }));

  ProductVariation_Delete = action$ =>
    action$.pipe(filter(action => action.type === GitAction.DeleteProductVariation), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Product_DeleteProductVariation?PRODUCTVARIATIONID=" + action.payload.ProductVariationID +
            "&USERID=" + action.payload.UserID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.DeletedProductVariation, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.DeletedProductVariation, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: ProductVariation_Delete. Please check on URL")
          return dispatch({ type: GitAction.DeletedProductVariation, payload: [] });
        }
      }
    }));



  ///////////////////////////////////////////////////  Product Variation Details  ///////////////////////////////////////////////////

  ProductVariationDetail_Add = action$ =>
    action$.pipe(filter(action => action.type === GitAction.AddProductVariationDetail), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Product_AddProductVariationDetail?PRODUCTVARIATIONID=" + action.payload.ProductVariation +
            "&PRODUCTID=" + action.payload.ProductID +
            "&CUSTOMIZABLE=" + action.payload.Customizable +
            "&VALUE=" + action.payload.Value +
            "&PRODUCTSTOCK=" + action.payload.stock +
            "&PRODUCTVARIATIONSKU=" + action.payload.sku +
            "&PRODUCTVARIATIONPRICE=" + action.payload.price +
            "&USERID=" + action.payload.UserID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.AddedProductVariationDetail, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.AddedProductVariationDetail, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: ProductVariation_Delete. Please check on URL")
          return dispatch({ type: GitAction.AddedProductVariationDetail, payload: [] });
        }
      }
    }));

  ProductVariationDetail_Update = action$ =>
    action$.pipe(filter(action => action.type === GitAction.UpdateProductVariationDetail), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Product_UpdateProductVariationDetails?PRODUCTVARIATIONDETAILID=" + action.payload.ProductVariationDetailID +
            "&CUSTOMIZABLE=" + action.payload.Customizable +
            "&VALUE=" + action.payload.Value +
            "&PRODUCTSTOCK=" + action.payload.stock +
            "&PRODUCTVARIATIONSKU=" + action.payload.sku +
            "&PRODUCTVARIATIONPRICE=" + action.payload.price +
            "&USERID=" + action.payload.UserID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.UpdatedProductVariationDetail, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.UpdatedProductVariationDetail, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: ProductVariationDetail_Update. Please check on URL")
          return dispatch({ type: GitAction.UpdatedProductVariationDetail, payload: [] });
        }
      }
    }));

  ProductVariationDetail_Delete = action$ =>
    action$.pipe(filter(action => action.type === GitAction.DeleteProductVariationDetail), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Product_DeleteProductVariationDetails?PRODUCTVARIATIONDETAILID=" + action.payload.ProductVariationDetailID +
            "&USERID=" + action.payload.UserID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.DeletedProductVariationDetail, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.DeletedProductVariationDetail, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: ProductVariationDetail_Delete. Please check on URL")
          return dispatch({ type: GitAction.DeletedProductVariationDetail, payload: [] });
        }
      }
    }));

  ProductVariationDetail_ViewAllByCategoryID = action$ =>
    action$.pipe(filter(action => action.type === GitAction.GetProductVariationByCategoryID), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Product_ViewProductVariationByCategoryID?PRODUCTCATEGORYID=" + action.payload)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.GotProductVariationByCategoryID, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.GotProductVariationByCategoryID, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: ProductVariationDetail_ViewAllByCategoryID. Please check on URL")
          return dispatch({ type: GitAction.GotProductVariationByCategoryID, payload: [] });
        }
      }
    }));


  ///////////////////////////////////////////////////  Product Stock  ///////////////////////////////////////////////////

  ProductVariationStock_Add = action$ =>
    action$.pipe(filter(action => action.type === GitAction.AddProductVariationStock), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Product_AddProductVariationStock?COINTAINERID=" + action.payload.ContainerID +
            "&USERID=" + action.payload.UserID +
            "&PRODUCTVARIATIONDETAILID=" + action.payload.ProductVariationDetailsID +
            "&PRODUCTSTOCK=" + action.payload.ProductStock +
            "&PRODUCTVARIATIONCOST=" + action.payload.ProductVariationCost +
            "&GRIDSTORAGEID=" + action.payload.GridStorageID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.AddedProductVariationStock, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.AddedProductVariationStock, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: ProductVariationStock_Add. Please check on URL")
          return dispatch({ type: GitAction.AddedProductVariationStock, payload: [] });
        }
      }
    }));

  ProductVariationStock_View = action$ =>
    action$.pipe(filter(action => action.type === GitAction.ViewProductVariationStock), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Product_ItemListWithVariation?PROJECTID=" + action.payload.ProjectID +
            "&PRODUCTPERPAGE=" + action.payload.ProductPerPage +
            "&PAGE=" + action.payload.Page)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.ViewedProductVariationStock, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.ViewedProductVariationStock, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: ProductVariationStock_View. Please check on URL")
          return dispatch({ type: GitAction.ViewedProductVariationStock, payload: [] });
        }
      }
    }));

  ProductVariationStock_ViewAll = action$ =>
    action$.pipe(filter(action => action.type === GitAction.ViewProductVariationStockWithID), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Product_ItemListWithProductVariationStock?PROJECTID=" + action.payload.ProjectID +
            "&PRODUCTID=" + action.payload.ProductID +
            "&USERID=" + action.payload.UserID +
            "&PRODUCTPERPAGE=" + action.payload.ProductPerPage +
            "&PAGE=" + action.payload.Page)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.ViewedProductVariationStockWithID, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.ViewedProductVariationStockWithID, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: ProductVariationStock_ViewAll. Please check on URL")
          return dispatch({ type: GitAction.ViewedProductVariationStockWithID, payload: [] });
        }
      }
    }));

  ProductVariationStock_ViewWithVariationDetailsID = action$ =>
    action$.pipe(filter(action => action.type === GitAction.ViewProductVariationStockWithVariationDetailsID), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Product_ItemListWithProductVariationStockDetailList?PRODUCTVARIATIONDETAILID=" + action.payload.ProductVariationDetailID
            + "&PROJECTID=" + action.payload.ProjectID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.ViewedProductVariationStockWithVariationDetailsID, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.ViewedProductVariationStockWithVariationDetailsID, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: ProductVariationStock_ViewWithVariationDetailsID. Please check on URL")
          return dispatch({ type: GitAction.ViewedProductVariationStockWithVariationDetailsID, payload: [] });
        }
      }
    }));

  ProductVariationStock_UpdateDetails = action$ =>
    action$.pipe(filter(action => action.type === GitAction.UpdateProductVariationStockDetails), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Product_UpdateProductVariationStock?PRODUCTVARIATIONSTOCKID=" + action.payload.ProductVariationStockID +
            "&USERID=" + action.payload.UserID +
            "&APPROVEDBY=" + action.payload.ApprovedBy +
            "&PRODUCTSTOCK=" + action.payload.ProductStock +
            "&PRODUCTVARIATIONCOST=" + action.payload.ProductVariationCost +
            "&GRIDSTORAGEID=" + action.payload.GridStorage)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.UpdatedProductVariationStockDetails, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.UpdatedProductVariationStockDetails, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: ProductVariationStock_ViewWithVariationDetailsID. Please check on URL")
          return dispatch({ type: GitAction.UpdatedProductVariationStockDetails, payload: [] });
        }
      }
    }));

  ProductVariationStock_Delete = action$ =>
    action$.pipe(filter(action => action.type === GitAction.DeleteProductVariationStock), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Product_DeleteProductVariationStock?PRODUCTVARIATIONSTOCKID=" + action.payload.ProductVariationStockID +
            "&USERID=" + action.payload.UserID +
            "&APPROVEDBY=" + action.payload.ApprovedBy)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.DeletedProductVariationStock, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.DeletedProductVariationStock, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: ProductVariationStock_Delete. Please check on URL")
          return dispatch({ type: GitAction.DeletedProductVariationStock, payload: [] });
        }
      }
    }));


  ///////////////////////////////////////////////////  Product Specification Details  //////////////////////////////////////////////////

  ProductSpecsDetail_Add = action$ =>
    action$.pipe(filter(action => action.type === GitAction.AddProductSpecsDetail), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Product_AddProductSpecificationDetail?PRODUCTVARIATIONID=" + action.payload.ProductVariation +
            "&PRODUCTID=" + action.payload.ProductID +
            "&PRODUCTSPECIFICATIONVALUE=" + action.payload.value +
            "&USERID=" + action.payload.UserID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.AddedProductSpecsDetail, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.AddedProductSpecsDetail, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: ProductSpecsDetail_Add. Please check on URL")
          return dispatch({ type: GitAction.AddedProductSpecsDetail, payload: [] });
        }
      }
    }));

  ProductSpecsDetail_Update = action$ =>
    action$.pipe(filter(action => action.type === GitAction.UpdateProductSpecsDetail), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Product_UpdateProductSpecificationDetail?PRODUCTVARIATIONID=" + action.payload.ProductVariation +
            "&PRODUCTID=" + action.payload.ProductID +
            "&PRODUCTSPECIFICATIONVALUE=" + action.payload.value +
            "&PRODUCTSPECIFICATIONDETAILID=" + action.payload.specificationDetailID +
            "&USERID=" + action.payload.UserID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.UpdatedProductSpecsDetail, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.UpdatedProductSpecsDetail, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: ProductSpecsDetail_Update. Please check on URL")
          return dispatch({ type: GitAction.UpdatedProductSpecsDetail, payload: [] });
        }
      }
    }));

  ProductSpecsDetail_Delete = action$ =>
    action$.pipe(filter(action => action.type === GitAction.DeleteProductSpecsDetail), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Product_DeleteProductSpecificationDetail?PRODUCTSPECIFICATIONDETAILID=" + action.payload.specificationDetailID +
            "&USERID=" + action.payload.UserID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.DeletedProductSpecsDetail, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.DeletedProductSpecsDetail, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: ProductSpecsDetail_Delete. Please check on URL")
          return dispatch({ type: GitAction.DeletedProductSpecsDetail, payload: [] });
        }
      }
    }));

  ///////////////////////////////////////////////////  Product Media ///////////////////////////////////////////////////

  ProductMedia_Add = action$ =>
    action$.pipe(filter(action => action.type === GitAction.AddProductMedia), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Product_AddProductMedia?" +
            "PRODUCTID=" + action.payload.ProductID +
            "&PRODUCTVARIATIONDETAILID=" + action.payload.variationID +
            "&PRODUCTSLIDEORDER=" + action.payload.sliderOrder +
            "&TYPE=" + action.payload.mediaType +
            "&WIDTH=" + action.payload.imageWidth +
            "&HEIGHT=" + action.payload.imageHeight +
            "&IMAGENAME=" + action.payload.imageName +
            "&USERID=" + action.payload.UserID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.ProductMediaAdded, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.ProductMediaAdded, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: ProductMedia_Add. Please check on URL")
          return dispatch({ type: GitAction.ProductMediaAdded, payload: [] });
        }
      }
    }));

  ProductMedia_Delete = action$ =>
    action$.pipe(filter(action => action.type === GitAction.deleteProductMedia), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Product_DeleteProductMedia?" +
            "PRODUCTMEDIAID=" + action.payload.imageID +
            "&USERID=" + action.payload.UserID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.deletedProductMedia, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.deletedProductMedia, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: ProductMedia_Delete. Please check on URL")
          return dispatch({ type: GitAction.deletedProductMedia, payload: [] });
        }
      }
    }));

  ///////////////////////////////////////////////////  Product Category ///////////////////////////////////////////////////

  ProductCategory_Add = action$ =>
    action$.pipe(filter(action => action.type === GitAction.AddProductCategory), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Product_AddProductCategory?PRODUCTCATEGORY=" + action.payload.ProductCategory +
            "&PRODUCTCATEGORYIMAGE=" + action.payload.ProductCategoryImage +
            "&HIERARCHYID=" + action.payload.HierarchyID +
            "&PARENTPRODUCTCATEGORYID=" + action.payload.ParentProductCategoryID +
            "&PROJECTID=" + action.payload.ProjectID +
            "&USERID=" + action.payload.UserID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.AddedProductCategory, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.AddedProductCategory, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: ProductCategory_Add. Please check on URL")
          return dispatch({ type: GitAction.AddedProductCategory, payload: [] });
        }
      }
    }));

  ProductCategory_Update = action$ =>
    action$.pipe(filter(action => action.type === GitAction.UpdateProductCategory), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Product_UpdateProductCategory?PRODUCTCATEGORYID=" + action.payload.ProductCategoryID +
            "&PRODUCTCATEGORY=" + action.payload.ProductCategory +
            "&USERID=" + action.payload.UserID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.UpdatedProductCategory, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.UpdatedProductCategory, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: ProductCategory_Update. Please check on URL")
          return dispatch({ type: GitAction.UpdatedProductCategory, payload: [] });
        }
      }
    }));

  ProductCategory_Delete = action$ =>
    action$.pipe(filter(action => action.type === GitAction.DeleteProductCategory), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Product_DeleteProductCategory?PRODUCTCATEGORYID=" + action.payload.ProductCategoryID +
            "&USERID=" + action.payload.UserID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.DeletedProductCategory, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.DeletedProductCategory, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: ProductCategory_Delete. Please check on URL")
          return dispatch({ type: GitAction.DeletedProductCategory, payload: [] });
        }
      }
    }));

  ProductCategory_ViewAll = action$ =>
    action$.pipe(filter(action => action.type === GitAction.GetProductCategory), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Product_CategoryListByAll?ProjectID=" + action.payload.ProjectID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.GotProductCategory, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.GotProductCategory, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: ProductCategory_ViewAll. Please check on URL")
          return dispatch({ type: GitAction.GotProductCategory, payload: [] });
        }
      }
    }));

  ProductCategory_ViewAllWithParent = action$ =>
    action$.pipe(filter(action => action.type === GitAction.GetProductCategoryListing), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Product_CategoryListing?ProjectID=" + action.payload.ProjectID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.GotProductCategoryListing, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.GotProductCategoryListing, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: ProductCategory_ViewAllWithParent. Please check on URL")
          return dispatch({ type: GitAction.GotProductCategoryListing, payload: [] });
        }
      }
    }));


  ///////////////////////////////////////////////////  Product Review ///////////////////////////////////////////////////

  ProductReview_ViewByID = action$ =>
    action$.pipe(filter(action => action.type === GitAction.GetProductReviewByProductID), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Product_ViewReviewByProductID?PRODUCTID=" +
            action.payload.ProductID +
            "&PARENTPRODUCTREVIEWID=" +
            action.payload.ParentProductReviewID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.GotProductReviewByProductID, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.GotProductReviewByProductID, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: ProductReview_ViewByID. Please check on URL")
          return dispatch({ type: GitAction.GotProductReviewByProductID, payload: [] });
        }
      }
    }));

  // ProductReview_Add = (action$) =>
  //   action$.ofType(GitAction.addProductReview).switchMap(async ({ payload }) => {
  //     try {
  //       const response = await fetch(
  //         url + project + "/" +
  //         "Product_AddReview?PARENTPRODUCTREVIEWID=" + payload.parentProductReviewID
  //         + "&PRODUCTID=" + payload.productID
  //         + "&USERID=" + payload.UserID
  //         + "&PRODUCTREVIEWRATING=" + payload.productReviewRating
  //         + "&PRODUCTREVIEWCOMMENT=" + payload.productReviewComment
  //         + "&REPLYPARENTID=" + payload.replyParentID
  //       );
  //       let json = await response.json();
  //       json = JSON.parse(json);
  //       if (json[0].ReturnVal === 1) {
  //         toast.success("Sucessfully send a review");
  //       }
  //       try {
  //         const response_1 = await fetch(
  //           url + project + "/" +
  //           "Product_ViewReviewByProductID?PRODUCTID=" + payload.productID +
  //           "&PARENTPRODUCTREVIEWID=0"
  //         );
  //         let json_1 = await response_1.json();
  //         return {
  //           type: GitAction.addedProductReview,
  //           payload: json_1,
  //           payload2: json,
  //         };
  //       } catch (error) {
  //         alert('viewProductReviewByProductID: ' + error);
  //         return {
  //           type: GitAction.addedProductReview,
  //           payload: [],
  //         };
  //       }
  //     } catch (error) {
  //       alert('addProductReview: ' + error);
  //       return {
  //         type: GitAction.addedProductReview,
  //         payload: [],
  //       };
  //     }
  //   });


  ProductReview_Add = action$ =>
    action$.pipe(filter(action => action.type === GitAction.addProductReview), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Product_AddReview?PARENTPRODUCTREVIEWID=" + action.payload.parentProductReviewID
            + "&PRODUCTID=" + action.payload.productID
            + "&USERID=" + action.payload.UserID
            + "&PRODUCTREVIEWRATING=" + action.payload.productReviewRating
            + "&PRODUCTREVIEWCOMMENT=" + action.payload.productReviewComment
            + "&REPLYPARENTID=" + action.payload.replyParentID

          )
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.addedProductReview, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.addedProductReview, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: addedProductReview. Please check on URL")
          return dispatch({ type: GitAction.addedProductReview, payload: [] });
        }
      }
    }));

  ///////////////////////////////////////////////////  Promotion  ///////////////////////////////////////////////////

  Promotion_ViewAll = action$ =>
    action$.pipe(filter(action => action.type === GitAction.GetPromotion), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Promo_ViewPromotion?ACTIVEIND=" + action.payload.ActiveInd +
            "&PROJECTID=" + action.payload.ProjectID +
            "&USERID=" + action.payload.UserID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.GotPromotion, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.GotPromotion, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: Promotion_ViewAll. Please check on URL")
          return dispatch({ type: GitAction.GotPromotion, payload: [] });
        }
      }
    }));

  Promotion_ViewByPromotionID = action$ =>
    action$.pipe(filter(action => action.type === GitAction.GetPromotionByID), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Promo_ViewPromotionByID?PromotionID=" + action.payload.PromotionID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.GotPromotionByID, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.GotPromotionByID, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: Promotion_ViewByPromotionID. Please check on URL")
          return dispatch({ type: GitAction.GotPromotionByID, payload: [] });
        }
      }
    }));

  Promotion_Add = action$ =>
    action$.pipe(filter(action => action.type === GitAction.AddPromotion), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Promo_AddPromotion?PROMOTIONTITLE=" + action.payload.PromotionTitle +
            "&PROJECTID=" + + action.payload.ProjectID +
            "&PROMOTIONDESC=" + action.payload.PromotionDesc +
            "&PROMOTIONSTARTDATE=" + action.payload.PromotionStartDate +
            "&BANNERIMAGE=" + action.payload.BannerImage +
            "&SLIDEORDER=" + action.payload.SlideOrder +
            "&PROMOTIONENDDATE=" + action.payload.PromotionEndDate +
            "&PRODUCTID=" + action.payload.ProductID +
            "&PRODUCTDISCOUNT=" + action.payload.ProductDiscount +
            "&PRODUCTSTOCKLIMIT=" + action.payload.ProductStockLimit +
            "&PRODUCTVARIATIONDETAILID=" + action.payload.ProductVariationDetailID +
            "&PRODUCTPURCHASELIMIT=" + action.payload.ProductPurchaseLimit +
            "&ACTIVEIND=" + action.payload.ActiveInd +
            "&USERID=" + action.payload.UserID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.AddedPromotion, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.AddedPromotion, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: ProductReview_ViewByID. Please check on URL")
          return dispatch({ type: GitAction.AddedPromotion, payload: [] });
        }
      }
    }));


  Promotion_Update = action$ =>
    action$.pipe(filter(action => action.type === GitAction.UpdatePromotion), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Promo_UpdatePromotion?PROMOTIONID=" + action.payload.PromotionID +
            "&PROMOTIONTITLE=" + action.payload.PromotionTitle +
            "&PROMOTIONDESC=" + action.payload.PromotionDesc +
            "&BANNERIMAGE=" + action.payload.BannerImage +
            "&SLIDEORDER=" + action.payload.SlideOrder +
            "&PROMOTIONSTARTDATE=" + action.payload.PromotionStartDate +
            "&PROMOTIONENDDATE=" + action.payload.PromotionEndDate +
            "&DELETEDPROMOTIONPRODUCTID=" + action.payload.DeletedPromotionProductID +
            "&PRODUCTID=" + action.payload.ProductID +
            "&UPDATEDPROMOTIONPRODUCTID=" + action.payload.UpdatedPromotionProductID +
            "&PRODUCTDISCOUNT=" + action.payload.ProductDiscount +
            "&PRODUCTSTOCKLIMIT=" + action.payload.ProductStockLimit +
            "&PRODUCTVARIATIONDETAILID=" + action.payload.ProductVariationDetailID +
            "&PRODUCTPURCHASELIMIT=" + action.payload.ProductPurchaseLimit +
            "&ACTIVEIND=" + action.payload.ActiveInd +
            "&USERID=" + action.payload.UserID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.UpdatedPromotion, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.UpdatedPromotion, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: UpdatePromotion. Please check on URL")
          return dispatch({ type: GitAction.UpdatedPromotion, payload: [] });
        }
      }
    }));

  Promotion_UpdateStatusInd = action$ =>
    action$.pipe(filter(action => action.type === GitAction.UpdatePromotionInd), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Promo_UpdatePromotionActiveInd?PROMOTIONID=" + action.payload.PromotionID +
            "&ACTIVEIND=" + action.payload.ActiveInd +
            "&USERID=" + action.payload.UserID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.UpdatedPromotionInd, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.UpdatedPromotionInd, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: ProductReview_ViewByID. Please check on URL")
          return dispatch({ type: GitAction.DeletedPromotion, payload: [] });
        }
      }
    }));


  Promotion_Delete = action$ =>
    action$.pipe(filter(action => action.type === GitAction.DeletePromotion), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Promo_DeletePromotion?PROMOTIONID=" + action.payload.PromotionID +
            "&USERID=" + action.payload.UserID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.DeletedPromotion, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.DeletedPromotion, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: ProductReview_ViewByID. Please check on URL")
          return dispatch({ type: GitAction.DeletedPromotion, payload: [] });
        }
      }
    }));

  ///////////////////////////////////////////////////  General   ///////////////////////////////////////////////////

  CourierService_ViewAll = action$ =>
    action$.pipe(filter(action => action.type === GitAction.GetCourierService), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "User_ViewCourierService")
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.GotCourierService, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.GotCourierService, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: CourierService_ViewAll. Please check on URL")
          return dispatch({ type: GitAction.GotCourierService, payload: [] });
        }
      }
    }));

  Country_ViewAll = action$ =>
    action$.pipe(filter(action => action.type === GitAction.GetCountry), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "General_CountryList")
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.GotCountry, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.GotCountry, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: Country_ViewAll. Please check on URL")
          return dispatch({ type: GitAction.GotCountry, payload: [] });
        }
      }
    }));

  General_ViewState = action$ =>
    action$.pipe(filter(action => action.type === GitAction.GetState), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "General_ViewState")
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.GotState, payload: JSON.parse(json[0].ReturnData) });
              } else {
                toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.GotState, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: Country_ViewAll. Please check on URL")
          return dispatch({ type: GitAction.GotState, payload: [] });
        }
      }
    }));

  getAllPaymentMethod = action$ =>
    action$.pipe(filter(action => action.type === GitAction.GetPaymentMethod), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "General_ViewPaymentMethod")
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.GotPaymentMethod, payload: JSON.parse(json[0].ReturnData) });
              } else {
                //toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.GotPaymentMethod, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: getAllPaymentMethod. Please check on URL")
          return dispatch({ type: GitAction.GotPaymentMethod, payload: [] });
        }
      }
    }));

  ///////////////////////////////////////////////////  ShopLot  ///////////////////////////////////////////////////

  Shoplot_ShopListing = action$ =>
    action$.pipe(filter(action => action.type === GitAction.GetShopListing), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Storage_ShoplotList?PROJECTID=" + action.payload.ProjectID
            + "&USERID=" + action.payload.USERID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.GotShopListing, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.GotShopListing, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: Country_ViewAll. Please check on URL")
          return dispatch({ type: GitAction.GotShopListing, payload: [] });
        }
      }
    }));


  Shoplot_ShopListingByID = action$ =>
    action$.pipe(filter(action => action.type === GitAction.GetShopListingByID), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Storage_ShoplotListByShoplotID?SHOPLOTID=" + action.payload.ShoplotID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.GotShopListingByID, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.GotShopListingByID, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: Country_ViewAll. Please check on URL")
          return dispatch({ type: GitAction.GotShopListingByID, payload: [] });
        }
      }
    }));

  Shoplot_AddShoplot = action$ =>
    action$.pipe(filter(action => action.type === GitAction.AddShoplot), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Storage_AddShoplot?SHOPLOTNAME=" + action.payload.ShoplotName +
            "&CONTACTNO=" + action.payload.ContactNo +
            "&SHOPLOTBLOCK=" + action.payload.ShoplotBlock +
            "&STORAGEBLOCKID=" + action.payload.StorageBlockID +
            "&PROJECTID=" + action.payload.ProjectID +
            "&SHOPLOTPOLYGONSTRING=" + action.payload.ShoplotPolygon +
            "&LONGITUDE=" + action.payload.Longitude +
            "&LATITUDE=" + action.payload.Latitude
            + "&USERID=" + action.payload.USERID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.AddedShoplot, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.AddedShoplot, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: Shoplot_AddShoplot. Please check on URL")
          return dispatch({ type: GitAction.AddedShoplot, payload: [] });
        }
      }
    }));

  Shoplot_UpdateShoplot = action$ =>
    action$.pipe(filter(action => action.type === GitAction.UpdateShoplot), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Storage_UpdateShoplot?SHOPLOTNAME=" + action.payload.ShoplotName +
            "&SHOPLOTID=" + action.payload.ShoplotID +
            "&CONTACTNO=" + action.payload.ContactNo +
            "&SHOPLOTBLOCK=" + action.payload.ShoplotBlock +
            "&STORAGEBLOCKID=" + action.payload.StorageBlockID +
            "&SHOPLOTPOLYGONSTRING=" + action.payload.ShoplotPolygon
            + "&USERID=" + action.payload.USERID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.UpdatedShoplot, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.UpdatedShoplot, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: Shoplot_UpdateShoplot. Please check on URL")
          return dispatch({ type: GitAction.UpdatedShoplot, payload: [] });
        }
      }
    }));

  Shoplot_DeleteShoplot = action$ =>
    action$.pipe(filter(action => action.type === GitAction.DeleteShoplot), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Storage_DeleteShoplot?SHOPLOTID=" + action.payload.ShoplotID
            + "&USERID=" + action.payload.USERID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.DeletedShoplot, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.DeletedShoplot, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: Shoplot_DeleteShoplot. Please check on URL")
          return dispatch({ type: GitAction.DeletedShoplot, payload: [] });
        }
      }
    }));

  ///////////////////////////////////////////////////  Shoplot Coordinate  ///////////////////////////////////////////////////

  Storage_AddShoplotCoordinate = action$ =>
    action$.pipe(filter(action => action.type === GitAction.AddShoplotCoordinateListing), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Storage_AddShoplotCoordinate?SHOPLOTID=" + action.payload.ShoplotID
            + "&LONGITUDE=" + action.payload.Longitude
            + "&LATITUDE=" + action.payload.Latitude
            + "&USERID=" + action.payload.USERID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.AddedShoplotCoordinateListing, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.AddedShoplotCoordinateListing, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: Storage_AddShoplotCoordinate. Please check on URL")
          return dispatch({ type: GitAction.AddedShoplotCoordinateListing, payload: [] });
        }
      }
    }));

  Storage_UpdateShoplotCoordinate = action$ =>
    action$.pipe(filter(action => action.type === GitAction.UpdateShoplotCoordinateListing), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Storage_UpdateShoplotCoordinate?SHOPLOTID=" + action.payload.ShoplotID
            + "&LONGITUDE=" + action.payload.Longitude
            + "&LATITUDE=" + action.payload.Latitude
            + "&USERID=" + action.payload.USERID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.UpdatedShoplotCoordinateListing, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.UpdatedShoplotCoordinateListing, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: Storage_UpdateShoplotCoordinate. Please check on URL")
          return dispatch({ type: GitAction.UpdatedShoplotCoordinateListing, payload: [] });
        }
      }
    }));

  ///////////////////////////////////////////////////  Block List ///////////////////////////////////////////////////

  Shoplot_BlockListing = action$ =>
    action$.pipe(filter(action => action.type === GitAction.GetBlockListing), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Storage_BlockList?PROJECTID=" + action.payload.ProjectID
            + "&USERID=" + action.payload.USERID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.GotBlockListing, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.GotBlockListing, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: Shoplot_BlockListing. Please check on URL")
          return dispatch({ type: GitAction.GotBlockListing, payload: [] });
        }
      }
    }));

  Storage_AddBlock = action$ =>
    action$.pipe(filter(action => action.type === GitAction.AddBlockListing), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Storage_AddBlock?PROJECTID=" + action.payload.ProjectID
            + "&BLOCKNAME=" + action.payload.BlockName
            + "&USERID=" + action.payload.USERID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.AddedBlockListing, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.AddedBlockListing, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: Storage_AddBlock. Please check on URL")
          return dispatch({ type: GitAction.AddedBlockListing, payload: [] });
        }
      }
    }));

  Storage_UpdateBlock = action$ =>
    action$.pipe(filter(action => action.type === GitAction.UpdateBlockListing), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Storage_UpdateBlock?STORAGEBLOCKID=" + action.payload.StorageBlockID +
            "&BLOCKNAME=" + action.payload.BlockName
            + "&USERID=" + action.payload.USERID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.UpdatedBlockListing, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.UpdatedBlockListing, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: Storage_UpdateBlock. Please check on URL")
          return dispatch({ type: GitAction.UpdatedBlockListing, payload: [] });
        }
      }
    }));

  Storage_DeleteBlock = action$ =>
    action$.pipe(filter(action => action.type === GitAction.DeleteBlockListing), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Storage_DeleteBlock?STORAGEBLOCKID=" + action.payload.StorageBlockID
            + "&USERID=" + action.payload.USERID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.DeletedBlockListing, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.DeletedBlockListing, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: Storage_DeleteBlock. Please check on URL")
          return dispatch({ type: GitAction.DeletedBlockListing, payload: [] });
        }
      }
    }));

  ///////////////////////////////////////////////////  Grid  ///////////////////////////////////////////////////

  Storage_GridStorageList = action$ =>
    action$.pipe(filter(action => action.type === GitAction.GetStorage), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Storage_GridStorageList?PROJECTID=" + action.payload.ProjectID
            + "&USERID=" + action.payload.USERID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.GotStorage, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.GotStorage, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: Storage_DeleteBlock. Please check on URL")
          return dispatch({ type: GitAction.GotStorage, payload: [] });
        }
      }
    }));

  Storage_AddGrid = action$ =>
    action$.pipe(filter(action => action.type === GitAction.AddGridListing), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Storage_AddGrid?PROJECTID=" + action.payload.ProjectID
            + "&GRIDSTORAGECODE=" + action.payload.GridStorageCode
            + "&SHOPLOTID=" + action.payload.ShoplotID
            + "&SHOPLOTNAME=" + action.payload.ShoplotName
            + "&USERID=" + action.payload.USERID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.AddedGridListing, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.AddedGridListing, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: Storage_AddGrid. Please check on URL")
          return dispatch({ type: GitAction.AddedGridListing, payload: [] });
        }
      }
    }));

  Storage_UpdateGrid = action$ =>
    action$.pipe(filter(action => action.type === GitAction.UpdateGridListing), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Storage_UpdateGrid?GRIDSTORAGEID=" + action.payload.GridStorageID
            + "&GRIDSTORAGECODE=" + action.payload.GridStorageCode
            + "&SHOPLOTID=" + action.payload.ShoplotID
            + "&SHOPLOTNAME=" + action.payload.ShoplotName
            + "&USERID=" + action.payload.USERID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.UpdatedGridListing, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.UpdatedGridListing, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: Storage_UpdateGrid. Please check on URL")
          return dispatch({ type: GitAction.UpdatedGridListing, payload: [] });
        }
      }
    }));

  Storage_DeleteGrid = action$ =>
    action$.pipe(filter(action => action.type === GitAction.DeleteGridListing), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Storage_DeleteGrid?GRIDSTORAGEID=" + action.payload.GridStorageID
            + "&USERID=" + action.payload.USERID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.DeletedGridListing, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.DeletedGridListing, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: Storage_DeleteGrid. Please check on URL")
          return dispatch({ type: GitAction.DeletedGridListing, payload: [] });
        }
      }
    }));

  ///////////////////////////////////////////////////  sidebar configurations ///////////////////////////////////////////////////

  User_ViewPage = action$ =>
    action$.pipe(filter(action => action.type === GitAction.FetchSidebar), map(action => {
      return dispatch => {
        try {

          return fetch(url + project + "/" +
            "User_ViewPage?" +
            "ROLEGROUPID=" + action.payload.ROLEGROUPID +
            "&PROJECTID=" + action.payload.PROJECTID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.SidebarFetched, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.SidebarFetched, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: User_ViewPage. Please check on URL")
          return dispatch({ type: GitAction.SidebarFetched, payload: [] });
        }
      }
    }));

  ///////////////////////////////////////////////////  Dashboard  ///////////////////////////////////////////////////

  Reporting_MainDashboard = action$ =>
    action$.pipe(filter(action => action.type === GitAction.GetMainDashboard), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Reporting_MainDashboard")
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.GotMainDashboard, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.GotMainDashboard, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: MainDashboard. Please check on URL")
          return dispatch({ type: GitAction.GotMainDashboard, payload: [] });
        }
      }
    }));

  Reporting_MerchantDashboard = action$ =>
    action$.pipe(filter(action => action.type === GitAction.GetMerchantDashboard), map(action => {
      return dispatch => {
        try {
          return fetch(url + project + "/" +
            "Reporting_MerchantDashboard?USERID=" + action.payload.USERID)
            .then(response => response.json())
            .then(json => {
              json = JSON.parse(json)
              if (json[0].ReturnVal === 1) {
                return dispatch({ type: GitAction.GotMerchantDashboard, payload: JSON.parse(json[0].ReturnData) });
              } else {
                // toast.error(json[0].ReturnMsg)
                return dispatch({ type: GitAction.GotMerchantDashboard, payload: [] });
              }
            });
        } catch (error) {
          toast.error("Error Code: MainDashboard. Please check on URL")
          return dispatch({ type: GitAction.GotMerchantDashboard, payload: [] });
        }
      }
    }));


  ///////////////////////////////////////////////////  Purchase Order  ///////////////////////////////////////////////////

  // PurchaseOrder_UpdateStatus = (action$) =>
  //   action$.ofType(GitAction.UpdatePurchaseOrderStatus).switchMap(async ({ payload }) => {
  //     try {
  //       const response = await fetch(
  //         // url + project + "/" +
  //         "https://tourism.denoo.my/MCITCApi/api/MCITC/" +
  //         "Product_UpdatePurchaseOrderStatus?PRODUCTPURCHASEORDERID=" +
  //         payload.ProductPurchaseOrderID +
  //         "&PRODUCTPURCHASEORDERSTATUS=Payable"
  //       );

  //       let json = await response.json();
  //       json = JSON.parse(json)
  //       return {
  //         type: GitAction.UpdatedPurchaseOrderStatus,
  //         payload: json,
  //       };
  //     }
  //     catch (error) {
  //       toast.error("Error Code: UpdatedPurchaseOrderStatus")
  //       return {
  //         type: GitAction.UpdatedPurchaseOrderStatus,
  //         payload: [],
  //       };
  //     }
  //   });

  // PurchaseOrder_ViewAll = (action$) =>
  //   action$.ofType(GitAction.GetPurchaseOrders).switchMap(async ({ payload }) => {

  //     console.log("https://tourism.denoo.my/MCITCApi/api/MCITC/" +
  //       "Product_ViewPurchaseOrder?USERID=" +
  //       payload)
  //     try {
  //       const response = await fetch(
  //         // url + project + "/" +
  //         "https://tourism.denoo.my/MCITCApi/api/MCITC/" +
  //         "Product_ViewPurchaseOrder?USERID=" +
  //         payload
  //       );

  //       let json = await response.json();
  //       if (json != "fail") {
  //         json = JSON.parse(json);
  //       } else {
  //         json = [];
  //       }
  //       return {
  //         type: GitAction.GotPurchaseOrders,
  //         payload: json,
  //       };
  //     }
  //     catch (error) {
  //       toast.error("Error Code: GotPurchaseOrders")
  //       return {
  //         type: GitAction.GotPurchaseOrders,
  //         payload: [],
  //       };
  //     }
  //   });

  // PurchaseOrder_Delete = (action$) =>
  //   action$.ofType(GitAction.DeletePurchaseOrder).switchMap(async ({ payload }) => {
  //     try {
  //       const response = await fetch(
  //         // url + project + "/" +
  //         "https://tourism.denoo.my/MCITCApi/api/MCITC/" +
  //         "Product_DeletePurchaseOrder?PRODUCTPURCHASEORDERID=" +
  //         payload.purchaseOderID
  //       );

  //       let json = await response.json();
  //       if (json != "fail") {
  //         json = JSON.parse(json);
  //       } else {
  //         json = [];
  //       }
  //       return {
  //         type: GitAction.DeletedPurchaseOrder,
  //         payload: json,
  //       };
  //     }
  //     catch (error) {
  //       toast.error("Error Code: DeletedPurchaseOrder")
  //       return {
  //         type: GitAction.DeletedPurchaseOrder,
  //         payload: [],
  //       };
  //     }

  //   });

  // ProductListing_ByStatus = (action$) =>
  //   action$.ofType(GitAction.GetProductByStatus).switchMap(async ({ payload }) => {
  //     try {
  //       const response = await fetch(
  //         "https://tourism.denoo.my/MCITCApi/api/MCITC/" +
  //         "Product_ItemListByProductStatus?PRODUCTSTATUS=" +
  //         payload.ProductStatus +
  //         "&USERID=" +
  //         payload.UserID
  //       );
  //       let json = await response.json();
  //       if (json != "fail") {
  //         json = JSON.parse(json);
  //       } else {
  //         json = [];
  //       }
  //       return {
  //         type: GitAction.GotProductByStatus,
  //         payload: json,
  //       };
  //     } catch (error) {
  //       alert('getAllProductsByStatus: ' + error);
  //       return {
  //         type: GitAction.GotProductByStatus,
  //         payload: [],
  //       };
  //     }
  //   });

  // SalesOrder_Add = (action$) =>
  //   action$.ofType(GitAction.SendSalesOrder).switchMap(async ({ payload }) => {

  //     try {
  //       const response = await fetch(
  //         "https://tourism.denoo.my/MCITCApi/api/MCITC/" +
  //         "Product_ReplyPurchaseOrderWithSaleOrder?PRODUCTPURCHASEORDERID=" +
  //         payload.ProductPurchaseOrderID +
  //         "&SALEORDERNO=" +
  //         payload.salesOrderNo +
  //         "&SALEORDERFILE=" +
  //         payload.file +
  //         "&REMARK=" +
  //         payload.remark
  //       );

  //       let json = await response.json();
  //       if (json != "fail") {
  //         json = JSON.parse(json);
  //       } else {
  //         json = [];
  //       }

  //       return {
  //         type: GitAction.SentSalesOrder,
  //         payload: json,
  //       };
  //     } catch (error) {
  //       alert('SentSalesOrder: ' + error);
  //       return {
  //         type: GitAction.SentSalesOrder,
  //         payload: [],
  //       };
  //     }
  //   });


  ///////////////////////////////////////////////////  Quotation ///////////////////////////////////////////////////

  // Quotation_Add = (action$) =>
  //   action$.ofType(GitAction.AddProductQuotation).switchMap(async ({ payload }) => {

  //     try {
  //       const response = await fetch(
  //         "https://tourism.denoo.my/MCITCApi/api/MCITC/" +
  //         "Product_AddQuotation?PRODUCTIDS=" +
  //         payload.ProductIDs +
  //         "&PRODUCTQUANTITYS=" +
  //         payload.ProductQuantities +
  //         "&PRODUCTPRICES=" +
  //         payload.ProductPrices +
  //         "&SUPPLIERID=1"
  //       );

  //       let json = await response.json();
  //       if (json != "fail") {
  //         json = JSON.parse(json);
  //       } else {
  //         json = [];
  //       }
  //       return {
  //         type: GitAction.AddedProductQuotation,
  //         payload: json,
  //       };
  //     } catch (error) {
  //       alert('AddedProductQuotation: ' + error);
  //       return {
  //         type: GitAction.AddedProductQuotation,
  //         payload: [],
  //       };
  //     }
  //   });


  // Quotation_View = (action$) =>
  //   action$.ofType(GitAction.GetProductQuotation).switchMap(async ({ payload }) => {

  //     console.log()
  //     try {
  //       const response = await fetch(
  //         "https://tourism.denoo.my/MCITCApi/api/MCITC/" +
  //         "Product_ViewQuotation?USERID=" +
  //         payload
  //       );

  //       let json = await response.json();
  //       if (json != "fail") {
  //         json = JSON.parse(json);
  //       } else {
  //         json = [];
  //       }
  //       return {
  //         type: GitAction.GotProductQuotation,
  //         payload: json,
  //       };
  //     } catch (error) {
  //       alert('GotProductQuotation: ' + error);
  //       return {
  //         type: GitAction.GotProductQuotation,
  //         payload: [],
  //       };
  //     }
  //   });

  // Quotation_Delete = (action$) =>
  //   action$.ofType(GitAction.DeleteQuotation).switchMap(async ({ payload }) => {

  //     try {
  //       const response = await fetch(
  //         "https://tourism.denoo.my/MCITCApi/api/MCITC/" +
  //         "Product_DeleteQuotation?PRODUCTQUOTATIONID=" + payload.QuotationID
  //       );

  //       let json = await response.json();
  //       if (json != "fail") {
  //         json = JSON.parse(json);
  //       } else {
  //         json = [];
  //       }
  //       return {
  //         type: GitAction.DeletedQuotation,
  //         payload: json,
  //       };
  //     } catch (error) {
  //       alert('DeletedQuotation: ' + error);
  //       return {
  //         type: GitAction.DeletedQuotation,
  //         payload: [],
  //       };
  //     }
  //   });


  ///////////////////////////////////////////////////  sidebar configurations ///////////////////////////////////////////////////



  ///////////////////////////////////////////////////    product details   ///////////////////////////////////////////////////



}
export let gitEpic = new GitEpic();


// "user manual": adding the api call backs here

// by get API
// User_ViewPage = action$ =>
//   action$.ofType(GitAction.FetchSidebar).switchMap(async ({ payload }) => {
//     // console.log(url +
//     //   double_click_and_paste_url_here
//     // )
//     try {
//       const response = await fetch(url +
//         "User_ViewPage?" +
//         "ROLEGROUPID=" + payload.ROLEGROUPID +
//         "&USERID=" + payload.USERID
//       );

//       let json = await response.json();
//       json = JSON.parse(json)
//       return {
//         type: GitAction.SidebarFetched,
//         payload: json,
//       };
//     }
//     catch (error) {
//       toast.error("Error Code: FetchSidebar")
//       return {
//         type: GitAction.SidebarFetched,
//         payload: [],
//       };
//     }
//   });

// by post API
// Inventory_UpdateStockDetailByPost = action$ =>
// action$.ofType(GitAction.UpdateStockDetailByPost).switchMap(async ({ payload }) => {

//   return fetch(
//     url + "Inventory_UpdateStockDetailByPost"
//     , {
//       method: 'POST',
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         STOCKID: payload.StockID,
//         USERCODE: payload.UserCode,
//         TRACKINGNUMBER: payload.TrackingNumber,
//         PRODUCTWEIGHT: payload.ProductWeight,
//         PRODUCTHEIGHT: payload.ProductDimensionHeight,
//         PRODUCTWIDTH: payload.ProductDimensionWidth,
//         PRODUCTDEEP: payload.ProductDimensionDeep,
//         AREACODE: payload.AreaCode,
//         ITEM: payload.Item,
//         TRACKINGSTATUSID: payload.TRACKINGSTATUSID,
//         CONTAINERNAME: payload.ContainerName,

//         CONTAINERDATE: payload.ContainerDate,
//         REMARK: payload.Remark,
//         EXTRACHARGE: payload.AdditionalCharges
//       })
//     }
//   )
//     .then(response => response.json())
//     .then(json => {
//       if (json !== "fail") {
//         json = json;
//         toast.success("Successfully update stock. Fetching the latest data..", { autoClose: 3000 })
//       } else {
//         json = [];
//       }
//       return {
//         type: GitAction.UpdatedStockDetailByPost,
//         payload: json,
//       };
//     })
//     .catch(error => toast.error("Error code: 8003"));
// });