import React, { useState, useEffect } from "react";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getDatabase, ref as dbRef, get, update } from "firebase/database";
import "./upload.css";

const CustomPage = () => {
  const [files, setFiles] = useState([]);
  const [uploadMessage, setUploadMessage] = useState("");
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [username, setUsername] = useState("");

  const auth = getAuth();

  useEffect(() => {
    const fetchUsernameAndProfilePic = async () => {
      if (auth.currentUser) {
        const db = getDatabase();
        const usernameRef = dbRef(db, `users/${auth.currentUser.uid}/username`);
        const snapshot = await get(usernameRef);
        if (snapshot.exists()) {
          setUsername(snapshot.val());
        }

        const storedProfilePicUrl = localStorage.getItem("profilePicUrl");
        if (storedProfilePicUrl) {
          setProfilePicUrl(storedProfilePicUrl);
        } else {
          const storage = getStorage();
          const profilePicRef = ref(
            storage,
            `profile-pics/${auth.currentUser.uid}`
          );

          try {
            const url = await getDownloadURL(profilePicRef);
            setProfilePicUrl(url);
            localStorage.setItem("profilePicUrl", url);
          } catch (error) {
            console.error("Error fetching profile picture:", error);
          }
        }
      }
    };

    if (auth.currentUser) {
      fetchUsernameAndProfilePic();
    }
  }, [auth.currentUser]);

  useEffect(() => {
    const fetchFiles = async () => {
      const storage = getStorage();
      const storageRef = ref(storage, "files/");

      try {
        const fileList = await listAll(storageRef);

        const fileDataPromises = fileList.items.map(async (fileRef) => {
          const fileName = fileRef.name;
          const url = await getDownloadURL(fileRef);

          return { file: fileName, url, type: fileRef.name.split(".").pop(), votes: 0, hasVoted: false };
        });

        const filesData = await Promise.all(fileDataPromises);
        setFiles(filesData);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, []);


  const handleUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    uploadedFiles.forEach((file) => {
      if (file.type.startsWith("image/") || file.type === "application/pdf") {
        const storage = getStorage();
        const storageRef = ref(storage, `files/${file.name}`);

        uploadBytes(storageRef, file).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            setFiles((prevFiles) => [
              ...prevFiles,
              { file: file.name, type: file.type, url: url, votes: 0, hasVoted: false },
            ]);

            setUploadMessage("File uploaded successfully!");
          });
        });
      }
    });
  };

  const handleProfilePicUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const storage = getStorage();
      const storageRef = ref(storage, `profile-pics/${auth.currentUser.uid}`);

      uploadBytes(storageRef, file).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          setProfilePicUrl(url);
          localStorage.setItem("profilePicUrl", url);
        });

        setUploadMessage("Profile picture uploaded successfully!");
      });
    }
  };

  const sanitizePath = (fileName) => {
    return fileName.replace(/[.#$[\]]/g, '_');
  };

  const toggleVote = (index) => {
    setFiles((prevFiles) => {
      const updatedFiles = prevFiles.map((file, i) => {
        if (i === index) {
          const newVoteCount = file.hasVoted ? file.votes - 1 : file.votes + 1;
          
          // Update vote count in Realtime Database
          const db = getDatabase();
          const fileRef = dbRef(db, `files/${sanitizePath(file.file)}`);
          update(fileRef, { votes: newVoteCount });

          return {
            ...file,
            votes: newVoteCount,
            hasVoted: !file.hasVoted,
            highlighted: true, // Highlight vote button
          };
        }
        return { ...file, highlighted: false };
      });

      setTimeout(() => {
        setFiles((files) =>
          files.map((file) => ({ ...file, highlighted: false }))
        );
      }, 2000); // Remove highlight after 2 seconds

      return updatedFiles;
    });
  };

  return (
    <div className="page-container">
      <div className="left-sidebar">
        <label htmlFor="file-upload" className="upload-button">
          Upload+
        </label>
        <input
          id="file-upload"
          type="file"
          multiple
          accept="image/*,.pdf"
          onChange={handleUpload}
          style={{ display: "none" }}
        />
      </div>

      <div className="main-content">
        {files.length > 0 && <h3>Available Data:</h3>}
        {files.map((file, index) => (
          <div key={index} className="file-preview">
            <div className="image-preview">
              {file.type === "pdf" ? (
                <iframe
                  src={file.url}
                  title={`Uploaded ${index}`}
                  width="100%"
                  height="500px"
                  style={{ border: "none" }}
                ></iframe>
              ) : (
                <img
                  src={file.url}
                  alt={`Uploaded ${index}`}
                  className="uploaded-image"
                />
              )}
            </div>
            <div className="vote-section">
              <button
                className={`vote-button ${file.hasVoted ? "voted" : ""}`}
                onClick={() => toggleVote(index)}
              >
                Vote
              </button>
              <p>Votes: {file.votes}</p>
            </div>
          </div>
        ))}
        {uploadMessage && <p className="upload-message">{uploadMessage}</p>}
      </div>

      <div className="right-sidebar">
        <div className="profile-info-container">
          <div className="profile-pic-container">
            <label htmlFor="profile-pic-upload" className="profile-pic">
              {profilePicUrl ? (
                <img
                  src={profilePicUrl}
                  alt="Profile"
                  className="profile-pic-image"
                />
              ) : (
                <span className="profile-pic-placeholder">+</span>
              )}
            </label>
            <input
              id="profile-pic-upload"
              type="file"
              accept="image/*"
              onChange={handleProfilePicUpload}
              style={{ display: "none" }}
            />
          </div>
          <p className="username">{username || "Loading..."}</p>
        </div>
      </div>
    </div>
  );
};

export default CustomPage;
