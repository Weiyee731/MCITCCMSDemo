export class GitAction {
  ///////////////////////////////////////////////////  user account credentials ///////////////////////////////////////////////////

  static Login = "USERLOGIN";
  static LoginSuccess = "USERLOGINSUCCESS";
  static CallUserLogin(propsData) {
    return {
      type: GitAction.UserLogin,
      payload: propsData
    };
  }

  static Logout = "USERLOGOUT";
  static LoggedOutSuccess = "USERLOGGEDOUTSUCCESS";
  static CallUserLogout(propsData) {
    return {
      type: GitAction.Logout,
      payload: propsData
    };
  }

}

