// src/components/Register.jsx
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "antd";

const Register = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">Register to Track Your Shifts</h1>
      <Button type="primary" onClick={() => loginWithRedirect({ screen_hint: "signup" })}>Register</Button>
    </div>
  );
};

export default Register;
