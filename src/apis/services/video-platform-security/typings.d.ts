declare namespace API {
  type AuthDto = {
    auth?: string;
    type?: number;
  };

  type CommonResultString_ = {
    code?: number;
    data?: string;
    message?: string;
  };

  type LoginDto = {
    phone?: string;
    pswd?: string;
  };

  type logoutUsingGETParams = {
    /** token */
    token: string;
  };

  type RegisterDto = {
    email?: string;
    name?: string;
    phone?: string;
    pin?: string;
    pswd?: string;
    type?: number;
  };
}
