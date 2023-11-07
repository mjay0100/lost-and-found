import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { setDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import { firestore } from "../firebase";
import { updateEmail } from "firebase/auth";
import requireAuth from "../requireAuth";
import { getUser } from "../auth";
import { HiOutlineUser } from "react-icons/hi";
import { loginUser } from "../auth";
import { auth } from "../firebase";
import { FaArrowLeft } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import image from "../assests/images/upload.png";

function profilePage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  //const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [userNameError, setUserNameError] = useState("");

  const handleNameChange = (e) => {
    const nameValue = e.target.value;
    const nameRegex = /^[A-Za-z ]{3,20}$/;

    if (nameRegex.test(nameValue)) {
      setNameError("");
    } else {
      setNameError("Name must be 3-20 letters with no special characters");
    }

    setName(nameValue);
  };
  const handlePhoneChange = (e) => {
    const phoneValue = e.target.value;
    const phoneRegex = /^[0-9]{11}$/;

    if (phoneRegex.test(phoneValue)) {
      setPhoneError("");
    } else {
      setPhoneError("Phone number must be 11 digits");
    }

    setPhone(phoneValue);
  };

  const handleUserNameChange = (e) => {
    const userNameValue = e.target.value;
    const userNameRegex = /^[A-Za-z0-9_]{1,12}$/;

    if (userNameRegex.test(userNameValue)) {
      setUserNameError("");
    } else {
      setUserNameError("Username must be up to 12 characters with no spaces");
    }

    setUserName(userNameValue);
  };

  const { user } = getUser();
  const { userId } = getUser();
  const { userAuth } = getUser();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      console.log("User not found. Please log in.");
      return;
    }
    const updatedUserData = {};
    const userDocRef = doc(firestore, "users", userId);

    if (name !== "") {
      updatedUserData.name = name;
    } else {
      updatedUserData.name = user.name;
    }

    if (userName !== "") {
      updatedUserData.userName = userName;
    } else {
      updatedUserData.userName = user.userName;
    }
    if (phone !== "") {
      updatedUserData.phone = phone;
    } else {
      updatedUserData.phone = user.phone;
    }
    if (profilePicture == "" || profilePicture == null) {
      updatedUserData.profilePicture = user.profilePicture;
    }

    if (profilePicture) {
      const storage = getStorage();
      const storageRef = ref(storage, `profilePictures/${userId}`);
      try {
        const snapshot = await uploadBytes(storageRef, profilePicture);
        const downloadURL = await getDownloadURL(snapshot.ref);
        if (profilePicture !== "") {
          updatedUserData.profilePicture = downloadURL;
        } else {
          updatedUserData.profilePicture = user.profilePicture;
        }

        console.log("updated");
      } catch (error) {
        console.log("Error uploading image", error);
      }
    }
    try {
      await setDoc(userDocRef, updatedUserData, { merge: true });
      loginUser(updatedUserData, userId, userAuth);
      console.log("Updated");
      setOpen(false);
      // Clear  form fields
      setName("");
      setPhone("");
      setUserName("");
    } catch (error) {
      console.log("Error updating the user profile. Please try again.");
      console.log("Error updating profile:", error);
    }
  };

  return (
    <DashboardLayout>
      {open ? (
        <section className="max-w-md mx-auto mt-8 p-4 bg-white rounded-lg shadow-xl">
          <h1 className="text-2xl font-semibold text-primary text-center mb-4">
            User Details
          </h1>
          <div className="space-y-4">
            {user ? (
              <div>
                <img
                  src={user.user.profilePicture}
                  alt="Profile"
                  className="w-[60%] h-[25vh] mx-auto rounded-[100%]"
                />
              </div>
            ) : (
              <NavLink to="/profile" className="text-[#FB7E13]">
                <HiOutlineUser size={30} />
              </NavLink>
            )}
            <div>
              <p className="w-full px-4 py-2  rounded-lg bg-gray-100">
                {user ? user.user.name : "........."}
              </p>
            </div>
            <div>
              <p className="w-full px-4 py-2  rounded-lg bg-gray-100">
                {user ? user.user.userName : "........."}
              </p>
            </div>
            <div>
              <p className="w-full px-4 py-2  rounded-lg bg-gray-100">
                {user ? user.user.phone : "........."}
              </p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="bg-primary text-center text-white hover:bg-[#FB7E13]  transition-all hover:bg-[#FB7E13] transition-transform transform hover:scale-105  flex justify-center gap-[2px] rounded-xl w-full py-4 my-5"
          >
            Upadate profile
          </button>
        </section>
      ) : (
        <section className="max-w-md mx-auto mt-8 p-4 bg-white rounded-lg shadow-xl">
          <h1 className="text-2xl font-semibold text-secondary text-center mb-4">
            Profile Update
          </h1>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-legend">Name</label>
              <input
                type="text"
                className={`bg-gray-200 rounded-lg py-2 px-3 ${
                  nameError ? "border-red-500" : ""
                }`}
                placeholder={user.name}
                value={name}
                onChange={handleNameChange}
              />
              {nameError && <p className="text-red-500">{nameError}</p>}
            </div>
            <div className="md:flex my-5 gap-2">
              <label className="font-semibold m-2">Phone</label>
              <input
                className={`bg-gray-200 rounded-lg py-2 px-3 ${
                  phoneError ? "border-red-500" : ""
                }`}
                type="phone"
                placeholder={user.phone}
                value={phone}
                onChange={handlePhoneChange}
              />
              {phoneError && <p className="text-red-500">{phoneError}</p>}
            </div>
            <div className="md:flex my-5 gap-2">
              <label className="font-semibold m-2">UserName</label>
              <input
                className={`bg-gray-200 rounded-lg py-2 px-3 ${
                  userNameError ? "border-red-500" : ""
                }`}
                type="text"
                placeholder={user.userName ? user.userName : "enter userName"}
                value={userName}
                onChange={handleUserNameChange}
              />
              {userNameError && <p className="text-red-500">{userNameError}</p>}
            </div>
            <div className="flex block my-5 md:gap-5">
              <button
                className="w-[40%] block my-2 mx-auto text-center bg-primary text-white  transition-all hover:bg-[#FB7E13] transform hover:scale-105 rounded-xl py-4 my-5 p-5"
                type="submit"
              >
                Save
              </button>
              <button
                className="w-[40%] block text-center mx-auto bg-[#FB7E13] text-white  transition-all hover:bg-primary transform hover:scale-105 rounded-xl py-4 my-5 p-5"
                onClick={(e) => {
                  e.preventDefault();
                  setOpen(false);
                }}
                type="submit"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="my-10  w-[70%]">
            <div className="my-3 text-secondary">
              <h3 className="font-bold my-1">Name</h3>
              <p>{user.name}</p>
            </div>
            <div className="lowercase my-3 text-secondary">
              <h3 className="font-bold my-1">Email</h3>
              <p>{userAuth.email}</p>
            </div>
            <div className="my-3 text-secondary">
              <h3 className="font-bold my-1"> Phone</h3>
              <p>{user.phone}</p>
            </div>
            {user.userName ? (
              <div className="my-3 text-secondary">
                <h3 className="font-bold my-1">UserName</h3>
                <p>{user.userName}</p>
              </div>
            ) : (
              ""
            )}
            <button
              onClick={(e) => {
                e.preventDefault();
                setOpen(true);
              }}
              className=" md:w-full text-center bg-primary text-white  transition-all hover:bg-[#FB7E13]/80  transform hover:scale-105  flex justify-center gap-1 rounded-xl w-[50%] my-5 py-5"
            >
              Edit Profile
            </button>
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}

export default requireAuth(profilePage);
