const { Fragment } = require("react");

function AdminLogin() {
  return (
    <Fragment>
      <h1>Admin Login</h1>
      <form>
        <label htmlFor="user">Admin Username</label>
        <input id="user" placeholder="username"></input>
        <label htmlFor="user">Admin Password</label>
        <input id="password" placeholder="password"></input>
      </form>
    </Fragment>
  );
}

export default AdminLogin;
