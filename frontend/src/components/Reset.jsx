import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useRef, useEffect } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

function ResetPassword() {
  const { resetToken } = useParams();
  //console.log(resetToken);
  //console.log(`api/reset-password/${resetToken}`);

  //const [password, setPassword] = useState('');
  //const [confirmPassword, setConfirmPassword] = useState('');
  //var newPassword;
  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const result = PWD_REGEX.test(pwd);
    console.log(result);
    console.log(pwd);
    setValidPwd(result);
  }, [pwd]);

  const path = `api/reset-password/${resetToken}`;
  //console.log(path);

  const handleResetPassword = async (event) => {
    event.preventDefault();

    const v2 = PWD_REGEX.test(pwd);

    if (!v2) {
      setErrMsg("Please enter a valid Username or Password");
      return;
    }
    console.log(pwd);
    var obj = { password: pwd };
    console.log(obj);
    var js = JSON.stringify(obj);
    console.log(js);
    try {
      const response = await fetch(buildPath(path), {
        method: "POST",
        body: js,
        headers: { "Content-Type": "application/json" },
      });

      const res = await response.json();

      setPwd("");
      if (response.ok) {
        setPwd(
          "Password reset successful. You can now log in with your new password."
        );
      } else {
        setPwd(res.error || "Failed to reset password.");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      window.location.href = "/login";
    }
  };

  const app_name = "taskmanager-poosd-b45429dde588";
  function buildPath(route) {
    if (process.env.NODE_ENV === "production") {
      return "https://" + app_name + ".herokuapp.com/" + route;
    } else {
      return "http://localhost:5000/" + route;
    }
  }

  return (
    <div className="Composition">
      <div className="black_sideline"></div>
      <div className="card">
        <h1 className="card-title">Reset Password</h1>
        <hr />
        <form onSubmit={handleResetPassword}>
          <label className="buttonHeader" htmlFor="password">
            Password:
            <FontAwesomeIcon
              icon={faCheck}
              className={validPwd ? "valid" : "hide"}
            />
            <FontAwesomeIcon
              icon={faTimes}
              className={validPwd || !pwd ? "hide" : "invalid"}
            />
          </label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPwd(e.target.value)}
            value={pwd}
            required
            aria-invalid={validPwd ? "false" : "true"}
            aria-describedby="pwdnote"
            onFocus={() => setPwdFocus(true)}
            onBlur={() => setPwdFocus(false)}
          />
          <p
            id="pwdnote"
            className={
              pwdFocus && pwd && !validPwd ? "instructions" : "offscreen"
            }
          >
            <FontAwesomeIcon icon={faInfoCircle} />
            8 to 24 characters.
            <br />
            Must include uppercase and lowercase letters, a number and a special
            character.
            <br />
            Allowed special characters:{" "}
            <span aria-label="exclamation mark">!</span>{" "}
            <span aria-label="at symbol">@</span>{" "}
            <span aria-label="hashtag">#</span>{" "}
            <span aria-label="dollar sign">$</span>{" "}
            <span aria-label="percent">%</span>
          </p>
          <div className="space"></div>
          <input type="submit" className="loginButton" value="Reset Password" />
          {<p className="message"></p>}
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
