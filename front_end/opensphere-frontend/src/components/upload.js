import React, { useState, useEffect } from "react";
import {
  getStorage,
  ref as storageRef, // Renamed to avoid conflict with dbRef
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
  const db = getDatabase();
  const storage = getStorage();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) return;

      const currentUserId = auth.currentUser.uid;
      try {
        const usersRef = dbRef(db, "users");
        const usersSnapshot = await get(usersRef);

        if (!usersSnapshot.exists()) {
          console.warn("No users found");
          return;
        }
        const userData = usersSnapshot.val();

        const picsFolderRef = storageRef(
          storage,
          `profile-pics/${currentUserId}`
        );
        const firstPicRef = (await listAll(picsFolderRef)).items[0]; // Get the first item in the list

        if (userData[currentUserId]) {
          setUsername(userData[currentUserId].username);
        }

        const cachedUrl = localStorage.getItem("profilePicUrl");
        if (cachedUrl) {
          setProfilePicUrl(cachedUrl);
        } else if (firstPicRef) {
          const url = await getDownloadURL(firstPicRef);
          setProfilePicUrl(url);
          localStorage.setItem("profilePicUrl", url);
        } else {
          // If no specific profile pic for the user, check for a general one (less likely but possible)
          const generalPicsFolderRef = storageRef(storage, "profile-pics");
          const generalPicList = await listAll(generalPicsFolderRef);
          // You might want a more specific logic here to pick a default if needed
          if (generalPicList.items.length > 0) {
            const defaultPicUrl = await getDownloadURL(generalPicList.items[0]);
            setProfilePicUrl(defaultPicUrl);
            localStorage.setItem("profilePicUrl", defaultPicUrl);
          } else {
            console.warn("No matching or default profile picture found");
          }
        }
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUserData();
  }, [auth, db, storage]);

  useEffect(() => {
    const fetchFiles = async () => {
      const filesStorageRef = storageRef(storage, "files/");
      const uploader = dbRef(db, "files/uploaderusername");

      try {
        const fileList = await listAll(filesStorageRef);

        const fileDataPromises = fileList.items.map(async (fileRef) => {
          const fileName = fileRef.name;
          const url = await getDownloadURL(fileRef);
          const metaRef = dbRef(db, `files/${sanitizePath(fileName)}`);
          const metaSnap = await get(metaRef);

          let uploaderUsername = "";
          let profilePic = "";

          if (metaSnap.exists()) {
            uploaderUsername = metaSnap.val().uploaderUsername || "";
            profilePic = await fetchProfilePicByUsername(uploaderUsername);
          }

          return {
            file: fileName,
            url,
            type: fileRef.name.split(".").pop(),
            votes: metaSnap.exists() ? metaSnap.val().votes || 0 : 0,
            hasVoted: false, // Client-side only state
            uploaderUsername,
            profilePic,
            caption: metaSnap.exists() ? metaSnap.val().caption || "" : "",
          };
        });

        const filesData = await Promise.all(fileDataPromises);
        setFiles(filesData);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, [db, storage]);

  const handleFileSelection = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
    setUploadMessage("");
  };

  const [selectedFiles, setSelectedFiles] = useState(null);
  const handlePost = async () => {
    if (selectedFiles.length === 0) {
      setUploadMessage("Please select a file first.");
      return;
    }

    for (const file of selectedFiles) {
      if (file.type.startsWith("image/") || file.type === "application/pdf") {
        const fileStorageRef = storageRef(storage, `files/${file.name}`);

        try {
          const snapshot = await uploadBytes(fileStorageRef, file);
          const url = await getDownloadURL(snapshot.ref);
          const sanitizedFileName = sanitizePath(file.name);
          const fileDbRef = dbRef(db, `files/${sanitizedFileName}`);

          const newFileData = {
            url,
            type: file.type,
            votes: 0,
            uploaderUsername: username,
            caption,
          };
          await update(fileDbRef, newFileData);

          setFiles((prevFiles) => [
            {
              file: file.name,
              type: file.type,
              url: url,
              votes: 0,
              hasVoted: false,
              uploaderUsername: username,
              profilePic: profilePicUrl,
              caption,
            },
            ...prevFiles, // Add to the top
          ]);

          setUploadMessage(`${file.name} posted successfully!`);
          setCaption("");
          setSelectedFiles([]); // Clear file selection
        } catch (err) {
          console.error("Error posting file:", err);
          setUploadMessage(`Post failed: ${file.name}`);
        }
      } else {
        setUploadMessage(`File type ${file.type} not supported.`);
      }
    }
  };

  const handleProfilePicUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const profilePicStorageRef = storageRef(
        storage,
        `profile-pics/${auth.currentUser.uid}`
      );

      uploadBytes(profilePicStorageRef, file)
        .then((snapshot) => {
          return getDownloadURL(snapshot.ref);
        })
        .then((url) => {
          setProfilePicUrl(url);
          localStorage.setItem("profilePicUrl", url);
          setUploadMessage("Profile picture updated successfully!");
        })
        .catch((error) => {
          console.error("Error uploading profile picture:", error);
          setUploadMessage("Failed to update profile picture.");
        });
    }
    event.target.value = null; // Reset the input
  };

  const sanitizePath = (fileName) => {
    return fileName.replace(/[.#$[\]]/g, "_");
  };

  const toggleVote = (index) => {
    setFiles((prevFiles) => {
      return prevFiles.map((file, i) => {
        if (i === index) {
          const newVoteCount = file.hasVoted ? file.votes - 1 : file.votes + 1;
          const fileRef = dbRef(db, `files/${sanitizePath(file.file)}`);
          update(fileRef, { votes: newVoteCount }).catch((error) => {
            console.error("Error updating vote count:", error);
          });
          return {
            ...file,
            votes: newVoteCount,
            hasVoted: !file.hasVoted,
            highlighted: true,
          };
        }
        return { ...file, highlighted: false };
      });
    });

    setTimeout(() => {
      setFiles((files) =>
        files.map((file) => ({ ...file, highlighted: false }))
      );
    }, 2000);
  };

  const fetchProfilePicByUsername = async (username) => {
    const usersRef = dbRef(db, "users");
    try {
      const snapshot = await get(usersRef);
      if (snapshot.exists()) {
        const users = snapshot.val();
        for (const uid in users) {
          if (users[uid]?.username === username) {
            const picsFolderRef = storageRef(storage, `profile-pics/${uid}`);
            try {
              const listResult = await listAll(picsFolderRef);
              if (listResult.items.length > 0) {
                return await getDownloadURL(listResult.items[0]); // First pic
              }
            } catch (error) {
              return null; // Couldn't get pic
            }
          }
        }
      }
      return null;
    } catch (error) {
      console.error("Error fetching profile pic by username:", error);
      return null;
    }
  };

  const [caption, setCaption] = useState("");
  return (
    <div className="page-container">
      <div className="left-sidebar">
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Enter a caption.."
          className="caption-input"
        />

        {/* Show selected file name with cancel button */}
        {selectedFiles && selectedFiles.length > 0 && (
          <div className="selected-file-info">
            <span>Selected: {selectedFiles[0].name}</span>
            <button
              onClick={() => setSelectedFiles([])} // Clear selected file
              className="cancel-file-button"
              title="Clear selected file"
            >
              ❌
            </button>
          </div>
        )}

        {/* Buttons in horizontal row */}
        <div className="upload-controls">
          <label htmlFor="file-upload" className="upload-button">
            Select File
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileSelection}
            style={{ display: "none" }}
          />

          <button onClick={handlePost} className="post-button">
            Post
          </button>
        </div>

        {uploadMessage && <p className="upload-message">{uploadMessage}</p>}
      </div>

      <div className="main-content">
        {files.length > 0 && <h3>Available Data:</h3>}
        {files.map((file, index) => (
          <div
            key={index}
            className={`file-preview ${file.highlighted ? "highlighted" : ""}`}
          >
            <div className="uploader-info">
              <img
                src={
                  file.profilePic || "https://www.gravatar.com/avatar/?d=mp&f=y"
                } // Default placeholder
                alt="Uploader PFP"
                className="uploader-pfp"
              />
              <span className="uploader-username">
                {file.uploaderUsername || "Unknown"}
              </span>
            </div>

            {file.caption && (
              <div className="caption-text">
                <p>{file.caption}</p>
              </div>
            )}

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
                {file.hasVoted ? "Unvote" : "Vote"}
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
