// src/components/Login.jsx
import { useAuth0, User } from "@auth0/auth0-react";
import { Button } from "antd";
import { useEffect } from "react";
const Login = () => {
  const { loginWithRedirect , isAuthenticated, User } = useAuth0();
useEffect(() => {
  console.log(User)

}, [])

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">Welcome to Healthcare Shift Tracker</h1>
      <Button type="primary" onClick={() => {loginWithRedirect()
        console.log(User)
      }}>Login with Auth0</Button>
    </div>
  );
};

export default Login;
