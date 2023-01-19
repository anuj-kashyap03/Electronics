import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import "./Profile.scss";
import { useRef } from "react";
import { useState } from "react";
import LogoutIcon from '@mui/icons-material/Logout';
import { Avatar, CircularProgress } from "@mui/material";
import TextField from "@mui/material/TextField";
import dateFormat from "dateformat";
import { GetRequest, PutRequest } from "../../Requests/Requests";
import { UpdateUser } from "../../Redux/Actions/UserAction";
import MetaData from "../layout/MetaData";
// import MyAlert from "../Alert/Alert";

const Profile = ({ history }) => {
  /* Using the useDispatch hook to get the dispatch function from the Redux store. */
  const dispatch = useDispatch();

  /* Using the useNavigate hook to navigate to a different page. */
  const navigate = useNavigate();

  /* Creating a state variable called runEffect and setting it to true. */
  const [runEffect, setrunEffect] = useState(true);

  //Redux State
  /* Destructuring the details and isAuthenticated from the state.User object. */
  const { details, isAuthenticated } = useSelector((state) => state.User);

  // account Image state
  /* Setting up the state for the component. */
  const [EditPicture, setEditPicture] = useState(false);
  const [EditForm, setEditForm] = useState(false);
  const [avatarAlt, setavatarAlt] = useState("A");
  const [avatarSrc, setavatarSrc] = useState("");
  const [disableButtons, setdisableButtons] = useState(false);
  const [resultMessage, setresultMessage] = useState(null);

  /* Creating a reference to the accountContainer div. */
  const accountContainer = useRef(null);

  /* Setting the state of the component. */
  const [firstname, setfirstname] = useState("");
  const [lastname, setlastname] = useState("");
  const [email, setemail] = useState("");
  const [phone, setphone] = useState("");
  const [address, setaddress] = useState("");
  const [avatarValue, setavatarValue] = useState(null);
  const [showLoadinginUpdae, setshowLoadinginUpdae] = useState(false);
  const [disableButtonsofaccountsetting, setdisableButtonsofaccountsetting] =
    useState(false);
  const [resultMessageforAccountsetting, setresultMessageforAccountsetting] =
    useState(null);

  // Form submit handlers
  /**
   * It's a function that is called when a form is submitted. It makes a request to the server, and if
   * the request is successful, it updates the state of the application.
   * @param e - the event object
   */
  const AccountSettingFormSubmitted = async (e) => {
    setdisableButtonsofaccountsetting(true);
    setresultMessageforAccountsetting(null);
    setshowLoadinginUpdae(true);
    e.preventDefault();
    const UserDetailsForm = new FormData();
    UserDetailsForm.set("firstname", firstname);
    UserDetailsForm.set("lastname", lastname);
    UserDetailsForm.set("email", email);
    UserDetailsForm.set("phone", phone);
    UserDetailsForm.set("address", address);
    const result = await PutRequest("/api/v1/me/update", true, UserDetailsForm);
    if (result.success === true) {
      setEditForm(false);
      setresultMessageforAccountsetting({ msg: "Updatd Successfully" });

      dispatch(UpdateUser({ details: result.data.user }));
    } else {
      setresultMessageforAccountsetting({
        error: true,
        msg: "Please try again",
      });
    }
    setdisableButtonsofaccountsetting(false);
    setshowLoadinginUpdae(false);
  };

  /**
   * It takes a file from the user, sends it to the server, and then updates the user's profile picture.
   * @param e - the event object
   */
  const updateProfilePicture = async (e) => {
    setresultMessage(null);

    e.preventDefault();
    setdisableButtons(true);
    const Imageform = new FormData();
    Imageform.set("avatar", avatarValue);
    // dispatch(updateProfileImage(Imageform));
    const url = "/api/v1/me/update/image";
    const result = await PutRequest(url, true, Imageform);
    if (result.success === true) {
      setEditPicture(false);
      setresultMessage({ error: false, message: "Updated Successfully" });

      dispatch(UpdateUser({ details: result.data.user }));
    } else {
      setresultMessage({
        error: true,
        message: "Not Updated, try again",
      });
    }
    setdisableButtons(false);
  };

  // On click handlers
  const EditPicturehandler = () => {
    setresultMessage(null);
    setEditPicture(true);
  };

  const CancelImageUpload = (e) => {
    setresultMessage(null);
    setEditPicture(false);
    setavatarSrc(details.avatar ? details.avatar.url : "anuj");
    setavatarValue(null);
  };

  /**
   * When the file is changed, read the file as a data URL and set the avatarSrc and avatarValue to the
   * result.
   * @param e - the event object
   */
  const FileIsChanged = (e) => {

    const reader = new FileReader();
    reader.onload = (evt) => {
      setavatarSrc(reader.result);
      setavatarValue(reader.result);
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  /**
   * When the user clicks the cancel button, the runEffect state is set to the opposite of what it was
   * before, the editForm state is set to false, and the resultMessageforAccountsetting state is set to
   * null.
   */
  const CancelButtonhandler = () => {
    setrunEffect(!runEffect);
    setEditForm(false);
    setresultMessageforAccountsetting(null);
  };

  /**
   * When the user clicks the edit button, the edit form will appear.
   */
  const EditAccountSetting = () => {
    setEditForm(true);
  };

  /**
   * This function is called when the user clicks the logout button. It makes a request to the server to
   * logout the user, and if the server responds with a success message, it updates the user's state to
   * be logged out and navigates to the home page.
   */

  const logoutUser = async () => {
    const result = await GetRequest("/api/v1/logout");
    if (result.success === true) {
      dispatch(UpdateUser({ isAuthenticated: false, details: {} }));
      navigate("/");
    }
  };

  /* Checking if the user is authenticated or not. If the user is authenticated, it is setting the state
of the component. */
  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/login");
    }
    if (isAuthenticated === true) {
      setfirstname(details.firstname ? details.firstname : "");
      setlastname(details.lastname ? details.lastname : "");
      setemail(details.email ? details.email : "");
      setphone(details.phone ? details.phone : "");
      setaddress(details.address ? details.address : "");
      setavatarAlt(details.firstname ? details.firstname : details.email);
      setavatarSrc(details.avatar ? details.avatar.url : "anuj");
    }
  }, [isAuthenticated, details, runEffect, navigate]);
  /* The above code is a React component that is responsible for displaying the user's profile. */
  return (
    <Fragment>
      
      <MetaData title="My Profile" />
      <section >
        <div className="container-xxl">
          <div className="accountInfo  p-0 rounded-lg">
            <div className="row">
              <div className="col-md-5 ">
                <div className="imagediv  bg-white shadow p-4 p-md-5 ">
                  <div className="avatar">
                    <Avatar
                      alt={avatarAlt.toUpperCase()}
                      src={avatarSrc}
                      sx={{ width: 200, height: 200 }}
                    />
                  </div>
                  <div className="updateimage">
                    {!EditPicture ? (
                      <Button
                        className="editimage"
                        fullWidth={true}
                        variant="outlined"
                        onClick={() => EditPicturehandler()}
                        disabled={disableButtons}
                      >
                        Edit Picture
                      </Button>
                    ) : (
                      <>
                        <form
                          encType="multipart/form-data"
                          onSubmit={updateProfilePicture}
                        >
                          <input
                            type="file"
                            accept="image/*"
                            onChange={FileIsChanged}
                            required
                          />
                          <span className="upload">
                            <Button
                              fullWidth={true}
                              type="submit"
                              variant="outlined"
                              className="mt-2"
                              disabled={disableButtons}
                            >
                              Upload
                            </Button>
                          </span>
                        </form>
                        <Button
                          fullWidth={true}
                          type="submit"
                          variant="contained"
                          onClick={CancelImageUpload}
                          color="error"
                          className="mt-2"
                          disabled={disableButtons}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                    {resultMessage && (
                      <p
                        style={{
                          color: resultMessage.error ? "red" : "green",
                          marginTop: "16px",
                        }}
                      >
                        {resultMessage.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-6 ">
                <div className="detailsdiv bg-white shadow p-4 ">
                  <div className="name">
                    <h1>
                      {`${details.firstname} ${details.lastname}` ||
                        details.email}
                    </h1>
                  </div>
                  <div className="join">
                    <h4>Joined On</h4>
                    <p> {dateFormat(details.createdAt, "fullDate")}</p>
                  </div>
                  <div className="links">
                    <div>
                      <Link className="link" to="/orders">
                        My Orders
                      </Link>
                    </div>
                    <div>
                      <Link className="link" to="/update/password">
                        Manage Passwords
                      </Link>
                    </div>
                    {details.role === "admin" && (
                      <div className="adminlink">
                        <Link className="link" to="/admin">
                          Go to Admin Dashboard
                        </Link>
                      </div>
                    )}
                    <div className="desktop">
                      <Button color="error" startIcon={<LogoutIcon />} onClick={logoutUser}>
                          log out
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg d-block d-sm-flex">
            <div className="tab-content p-4 p-md-5" id="v-pills-tabContent">
              <div
                ref={accountContainer}
                role="tabpanel"
                aria-labelledby="account-tab"
              >
                <h3 className="mb-4">Account Settings</h3>

                <form
                  onSubmit={AccountSettingFormSubmitted}
                  encType="multipart/form-data"
                >
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>First Name</label>
                        <TextField
                          disabled={!EditForm || disableButtonsofaccountsetting}
                          fullWidth={true}
                          type="text"
                          name="firstname"
                          required
                          value={firstname}
                          onChange={(e) => {
                            setfirstname(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Last Name</label>
                        <TextField
                          disabled={!EditForm || disableButtonsofaccountsetting}
                          fullWidth={true}
                          type="text"
                          name="lastname"
                          required
                          value={lastname}
                          onChange={(e) => {
                            setlastname(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Email</label>
                        <TextField
                          disabled={!EditForm || disableButtonsofaccountsetting}
                          fullWidth={true}
                          type="text"
                          name="email"
                          required
                          value={email}
                          onChange={(e) => {
                            setemail(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Phone number</label>
                        <TextField
                          disabled={!EditForm || disableButtonsofaccountsetting}
                          fullWidth={true}
                          type="text"
                          name="phone"
                          required
                          value={phone}
                          onChange={(e) => {
                            setphone(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label>Address</label>
                        <TextField
                          disabled={!EditForm || disableButtonsofaccountsetting}
                          multiline={true}
                          rows={4}
                          fullWidth={true}
                          value={address}
                          required
                          name="address"
                          onChange={(e) => {
                            setaddress(e.target.value);
                          }}
                        ></TextField>
                      </div>
                    </div>
                  </div>
                  <div className="form_buttons">
                    {EditForm && (
                      <Button
                        disabled={disableButtonsofaccountsetting}
                        type="submit"
                        variant="contained"
                      >
                        <span>
                          {showLoadinginUpdae ? "Updating..." : "Update"}
                        </span>
                        {showLoadinginUpdae && (
                          <CircularProgress
                            sx={{ color: "white", marginLeft: "30px" }}
                            size={20}
                            disableShrink
                          />
                        )}
                      </Button>
                    )}
                  </div>
                </form>
                {!EditForm && (
                  <Button
                    type="text"
                    disabled={disableButtonsofaccountsetting}
                    variant="contained"
                    onClick={EditAccountSetting}
                  >
                    Edit
                  </Button>
                )}
                {EditForm && !disableButtonsofaccountsetting && (
                  <Button
                    className="cancelbutton"
                    type="text"
                    disabled={disableButtonsofaccountsetting}
                    color="error"
                    variant="contained"
                    onClick={CancelButtonhandler}
                  >
                    Cancel
                  </Button>
                )}
                <div>
                  {resultMessageforAccountsetting && (
                    <p
                      style={{
                        color: resultMessageforAccountsetting.error
                          ? "red"
                          : "green",
                        marginTop: "16px",
                      }}
                    >
                      {resultMessageforAccountsetting.msg}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="logout">
          <Button color="error" startIcon={<LogoutIcon />} onClick={logoutUser}>
            log out
          </Button>
        </div>
      </section>
    </Fragment>
  );
};

export default Profile;
