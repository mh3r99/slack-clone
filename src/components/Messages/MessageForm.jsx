import React, { useState, useEffect } from "react";
import { Segment, Button, Input } from "semantic-ui-react";
import { push, child, serverTimestamp } from "firebase/database";
import FileModal from "./FileModal";
import { v4 as uuidv4 } from "uuid";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import ProgressBar from "./ProgressBar";

const MessageForm = ({
  messagesRef,
  currentChannel,
  currentUser,
  isProgressBarVisible,
}) => {
  const [message, setMessage] = useState("");
  const [uploadState, setUploadState] = useState("");
  const [percentUploaded, setPercentUploaded] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    isProgressBarVisible(percentUploaded);
  }, [percentUploaded]);

  const sendMessage = async (fileUrl = null) => {
    if (message || fileUrl) {
      setLoading(true);

      const newMessage = {
        user: {
          id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
        },
        timestamp: serverTimestamp(),
      };

      if (message) {
        newMessage["content"] = message;
      } else if (fileUrl) {
        newMessage["image"] = fileUrl;
      }

      await push(child(messagesRef, currentChannel.id), newMessage);

      setLoading(false);
      setMessage("");
      setUploadState("");
      setPercentUploaded(0);
    }
  };

  const uploadFile = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage();
      const storageRef = ref(storage, `chat/public/${uuidv4()}.jpg`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.floor(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setPercentUploaded(progress);
          switch (snapshot.state) {
            case "paused":
              setUploadState("Upload is paused");
              break;
            case "running":
              setUploadState("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // resolve(downloadURL)
            sendMessage(downloadURL);
          });
        }
      );
    });
  };

  return (
    <Segment className="message__form">
      <Input
        fluid
        name="message"
        style={{ marginBottom: "0.7em" }}
        label={<Button icon="add" />}
        labelPosition="left"
        placeholder="Write your message"
        onChange={(e) => setMessage(e.target.value)}
        value={message}
      />
      <Button.Group icon widths={2}>
        <Button
          color="orange"
          content="Add Reply"
          labelPosition="left"
          icon="edit"
          onClick={sendMessage}
          disabled={loading}
        />
        <Button
          color="teal"
          content="Upload media"
          labelPosition="right"
          icon="cloud upload"
          onClick={() => setModal(true)}
        />
      </Button.Group>
      <FileModal
        modal={modal}
        closeModal={() => setModal(false)}
        uploadFile={uploadFile}
      />
      <ProgressBar
        uploadState={uploadState}
        percentUploaded={percentUploaded}
      />
    </Segment>
  );
};

export default MessageForm;
