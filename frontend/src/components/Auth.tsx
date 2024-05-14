import axios from "axios";
import React, { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";

const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const [postInputs, setPostInputs] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  async function handleRequest() {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/user/${type}`,
        postInputs
      );
      const jwt = response.data;
      localStorage.setItem("jwtToken", jwt.jwt);
      navigate("/posts");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="h-screen  flex justify-center flex-col items-center">
      <div className="flex flex-col justify-center px-10">
        {" "}
        <div className="text-3xl font-bold px-10">Create an account</div>
        <div className="text-slate-400 px-10">
          {type === "signup"
            ? "Already have an account?"
            : "Don't have an account?"}
          <span className="underline cursor-pointer hover:text-slate-800">
            <Link to={type === "signup" ? "/signin" : "/signup"}>
              {" "}
              {type === "signup" ? "Signin" : "Signup"}
            </Link>
          </span>
        </div>
        <div className="grid gap-4 py-4">
          {" "}
          {type === "signup" ? (
            <LabelledInput
              label="Name"
              placeholder="Jhon Wick.."
              onChange={(e) => {
                setPostInputs({
                  ...postInputs, //existing state
                  name: e.target.value, //overwriting existing state
                });
              }}
            />
          ) : null}
          <LabelledInput
            label="Email"
            placeholder="batman@gautham.com"
            onChange={(e) => {
              setPostInputs({
                ...postInputs, //existing state
                email: e.target.value, //overwriting existing state
              });
            }}
          />
          <LabelledInput
            label="Password"
            placeholder="********"
            type="password"
            onChange={(e) => {
              setPostInputs({
                ...postInputs, //existing state
                password: e.target.value, //overwriting existing state
              });
            }}
          />
          <button
            type="button"
            className="text-white bg-gray-800 mt-6 hover:bg-gray-900 focus:outline-none focus:ring-4 w-full focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 "
            onClick={handleRequest}
          >
            {type === "signup" ? "Sign Up" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;

interface LabelledInputType {
  label: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

function LabelledInput({
  label,
  placeholder,
  onChange,
  type,
}: LabelledInputType) {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium ">{label} </label>
      <input
        type={type || "text"}
        onChange={onChange}
        id="first_name"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
        placeholder={placeholder}
        required
      />
    </div>
  );
}
