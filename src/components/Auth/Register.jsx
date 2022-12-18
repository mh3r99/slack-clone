import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon,
} from "semantic-ui-react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import md5 from "md5";
import { db } from "../../firebase";

import { getDatabase, ref, set } from "firebase/database";

const Register = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { username, email, password, passwordConfirmation } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormValid()) {
      setLoading(true);

      try {
        const auth = getAuth();
        const database = getDatabase();

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const user = userCredential.user;

        await updateProfile(user, {
          displayName: username,
          photoURL: `http://gravatar.com/avatar/${md5(user.email)}?d=identicon`,
        });

        await set(ref(database, "users/" + user.uid), {
          name: user.displayName,
          avatar: user.photoURL,
        });
      } catch (error) {
        setError(error.message);
      }

      setLoading(false);
    }
  };

  const isFormValid = () => {
    if (isFormEmpty(formData)) {
      setError("Fill in all fields");
      return false;
    } else if (!isPasswordValid(password, passwordConfirmation)) {
      setError("Password is invalid");
      return false;
    } else {
      setError(null);
      return true;
    }
  };

  const isFormEmpty = ({ username, email, password, passwordConfirmation }) =>
    !username?.length ||
    !email?.length ||
    !password?.length ||
    !passwordConfirmation?.length;

  const isPasswordValid = (password, passwordConfirmation) => {
    if (password?.length < 6 || passwordConfirmation?.length < 6) {
      return false;
    } else if (password !== passwordConfirmation) {
      return false;
    } else {
      return true;
    }
  };

  const handelInputError = (error, inputName) =>
    error?.toLowerCase().includes(inputName) ? "error" : "";

  return (
    <Grid textAlign="center" verticalAlign="middle" className="app">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h1" icon color="orange" textAlign="center">
          <Icon name="puzzle piece" color="orange" />
          Register for DevChat
        </Header>
        <Form size="large" onSubmit={handleSubmit}>
          <Segment stacked>
            <Form.Input
              fluid
              name="username"
              icon="user"
              iconPosition="left"
              placeholder="Username"
              type="text"
              onChange={handleChange}
              value={username || ""}
            />

            <Form.Input
              fluid
              name="email"
              icon="mail"
              iconPosition="left"
              placeholder="Email Address"
              type="email"
              onChange={handleChange}
              value={email || ""}
              className={handelInputError(error, "email")}
            />

            <Form.Input
              fluid
              name="password"
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              type="password"
              onChange={handleChange}
              value={password || ""}
              className={handelInputError(error, "password")}
            />

            <Form.Input
              fluid
              name="passwordConfirmation"
              icon="repeat"
              iconPosition="left"
              placeholder="Password Confirmation"
              type="password"
              onChange={handleChange}
              value={passwordConfirmation || ""}
              className={handelInputError(error, "password")}
            />

            <Button
              disabled={loading}
              className={loading ? "loading" : ""}
              color="orange"
              fluid
              size="large"
            >
              Submit
            </Button>
          </Segment>
        </Form>
        {error && <Message error>{error}</Message>}
        <Message>
          Already a user? <Link to="/login">Login</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default Register;
