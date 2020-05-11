class mockUser {
  constructor() {
    return {
      set: () => { },
      signUp: () => Promise.resolve({
        getUsername: () => "fakeUsernameSignUp",
        getSessionToken: () => "fakeSessionTokenSignUp",
        authenticated: () => true
      })
    };
  }

  static logIn() {
    return Promise.resolve({
      getUsername: () => "fakeUsernameLogIn",
      getSessionToken: () => "fakeSessionTokenLogIn",
      authenticated: () => true
    });
  }

  static logOut() { }

  static current() { return null; }
}

export default mockUser;