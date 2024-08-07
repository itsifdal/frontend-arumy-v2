import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { fetchHeader } from "../constants/fetchHeader";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/login/logout`, {
        headers: fetchHeader,
      })
      .then(() => {
        localStorage.clear();
        navigate("/login", { replace: true });
      });
  }, [navigate]);

  return <></>;
}
