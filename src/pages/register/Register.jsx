import React, { useState } from "react";
import { useForm } from "react-hook-form";
import background from "../../asset/image/bg-01.webp";
import { authActions } from "../../auth/auth.action";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
function Register() {
  const [error, setError] = useState("");
  const [visibalePass, setVisibalePass] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("data :: ", data);
    authActions()
      .register(data)
      .then((successfull) => {
        alert("Register Cuccessfull");
        navigate("/login");
      })
      .catch((err) => {
        console.log("error :: ", err);
        setError(err);
      });
  };
  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      className="w-full h-full flex justify-center items-center p-4 fixed top-0 left-0 right-0 bottom-0"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-[500px] rounded-[10px] bg-black h-[90%] sm:px-[55px] sm:pt-[30px] sm:pb-[54px]"
      >
        <p className="font-Popins font-bold text-[39px] text-[#333] leading-[1.2] text-center pb-[49px]">
          Register
        </p>

        {/* name */}

        <div className="flex  flex-wrap border-b-2 mb-5 pb-[2px] relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2px] after:bg-slate-600  after:transition-all after:ease-linear hover:after:w-full after:duration-500">
          <span className="text-sm text-[#333] font-Popins leading-[1.5]">
            Fullname
          </span>
          <div className="w-full flex justify-start items-center h-[55px]">
            <AccountCircleIcon className="text-white" />
            <input
              {...register("fullname", {
                required: "This field is required",
                minLength: {
                  value: 4,
                  message: "The name has at least 4 character",
                },
                pattern: {
                  value:
                    /^[a-zàáâãèéêìíòóôõùúăđĩũơưăạảấầẩẫậắằẳẵặẹẻẽềềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ ]{8,255}$/i,
                  message: "Invalid Full Name",
                },
              })}
              placeholder="Type Your Name"
              className="outline-none border-none text-base bg-transparent p-4 placeholder:font-Popins placeholder:font-semibold text-white w-full"
              type="text"
            />
          </div>
        </div>
        <div>
          {errors.fullname && (
            <span className="mb-2 text-red-600 block text-sm font-Popins tracking-wider">
              {errors.fullname.message}
            </span>
          )}
        </div>

        {/* username */}

        <div className="flex  flex-wrap border-b-2 mb-5 pb-[2px] relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2px] after:bg-slate-600  after:transition-all after:ease-linear hover:after:w-full after:duration-500">
          <span className="text-sm text-[#333] font-Popins leading-[1.5]">
            Email
          </span>
          <div className="w-full flex justify-start items-center h-[55px]">
            <EmailIcon className="text-white" />
            <input
              {...register("email", {
                required: "This field is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Must be an Email",
                },
              })}
              placeholder="Type Your Email"
              className="outline-none border-none text-base bg-transparent p-4 placeholder:font-Popins placeholder:font-semibold text-white w-full  "
              type="text"
            />
          </div>
        </div>
        <div>
          {errors.email && (
            <span className="mb-2 text-red-600 block text-sm font-Popins tracking-wider">
              {errors.email.message}
            </span>
          )}
        </div>

        {/* password */}

        <div className="flex flex-wrap border-b-2 mb-5 relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2px] after:bg-slate-600  after:transition-all after:ease-linear hover:after:w-full after:duration-500">
          <span className="text-sm text-[#333] font-Popins leading-[1.5]">
            Password
          </span>
          <div className="w-full flex justify-start items-center h-[55px]">
            <LockIcon className="text-white"></LockIcon>
            <input
              {...register("password", {
                required: "This field is required",
                pattern: {
                  value: /^(?=.*?[a-z])(?=.*[@$!%*#?&])(?=.*?[0-9]).{8,}$/,
                  message:
                    "Minimum eight characters, at least one letter, one number and one special character",
                },
              })}
              className="w-full outline-none border-none text-base bg-transparent p-4 placeholder:font-Popins placeholder:font-semibold text-white"
              placeholder="Type Your Password"
              type={visibalePass ? "text" : "password"}
            />
            <div
              className="cursor-pointer"
              onClick={() => setVisibalePass(!visibalePass)}
            >
              {visibalePass ? (
                <RemoveRedEyeOutlinedIcon className="text-white" />
              ) : (
                <VisibilityOffOutlinedIcon className="text-white" />
              )}
            </div>
          </div>
        </div>
        <div>
          {errors.password && (
            <span className="mb-2 text-red-600 block text-sm font-Popins tracking-wider">
              {errors.password.message}
            </span>
          )}
        </div>

        <div className="mt-10 cursor-pointer flex justify-center items-center rounded-[25px] bg-gradient-to-l from-[#00dbde] via-[#fc00ff] to-[#00dbde] bg-200% hover:bg-right transition-all ease-in-out duration-700">
          <button
            className="uppercase tracking-[2px] w-full p-4 text-white"
            type="submit"
          >
            Register
          </button>
        </div>

        {error && (
          <div className="text-center mt-3 text-red-600">
            <p>{error}</p>
          </div>
        )}
      </form>
    </div>
  );
}

export default Register;