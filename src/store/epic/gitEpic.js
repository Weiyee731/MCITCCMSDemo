/* eslint-disable no-unused-vars */
/* eslint-disable no-self-assign */
import { Observable } from "rxjs";
import { ActionsObservable } from "redux-observable";
import { GitAction } from "../action/gitAction";
import { toast } from "react-toastify";
import axios from "axios";
import { ServerConfiguration } from "../serverConf";


/**
 * ** IMPORTANT! Never do any file uploads or save data to the local storage here!! This Git EPIC is highly focus on call APIs to communicate to the server 
 * 
 * ** you can set your server url by switch the option as below 
 */
//           options          //
//   1. testing server url    //
//   2. live server url       // 
const url = ServerConfiguration.testingServerUrl;
export class GitEpic {
  ///////////////////////////////////////////////////  user account credentials ///////////////////////////////////////////////////

  UserLogin = action$ =>
    action$.ofType(GitAction.Login).switchMap(async ({ payload }) => {
      try {
        const response = await fetch(url +
          "User_Login?username=" + payload.Username +
          "&Password=" + payload.Password
        );

        let json = await response.json();
        json = JSON.parse(json)
        return {
          type: GitAction.LoginSuccess,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: 1001.1 => UserLogin")
        return {
          type: GitAction.LoginSuccess,
          payload: [],
        };
      }
    });

  UserLogout = action$ =>
    action$.ofType(GitAction.Logout).switchMap(async ({ payload }) => {
      try {
        const response = await fetch(url +
          "User_Logout?UserId=" + payload.UserId
        );

        let json = await response.json();
        json = JSON.parse(json)
        return {
          type: GitAction.LoggedOutSuccess,
          payload: json,
        };
      }
      catch (error) {
        toast.error("Error Code: 1001.2 => UserLogout")
        return {
          type: GitAction.LoggedOutSuccess,
          payload: [],
        };
      }
    });

  ///////////////////////////////////////////////////  user account credentials ///////////////////////////////////////////////////
}
export let gitEpic = new GitEpic();