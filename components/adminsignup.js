import { Fragment, useState } from "react";


function AdminSignup() {
 
  return (
    <Fragment>
      <div>
        <form>
          <div>
            <label htmlFor="username">Username</label>
            <input type="text" name="username" placeholder="username" id="username" />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input type="password" name="password" placeholder="password" id="password" />
          </div>
          <div>
            <label htmlFor="confirm">Confirm Password</label>
            <input type="password" name="confirm-password" placeholder="confirm password" id="confirm-password" />
          </div>
        </form>
      </div>
    </Fragment>
  );
}

export default AdminSignup;