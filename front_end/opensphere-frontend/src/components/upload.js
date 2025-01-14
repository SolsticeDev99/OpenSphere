import React, { useState, useEffect } from "react";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getDatabase, ref as dbRef, get } from "firebase/database";
import "./upload.css";

const CustomPage = () => {
  const [files, setFiles] = useState([]);
  const [uploadMessage, setUploadMessage] = useState("");
  const [profilePicUrl, setProfilePicUrl] = useState(""); // State to store profile picture URL
  const [username, setUsername] = useState("");
  const [preview, setPreview] = useState(null);

  const auth = getAuth(); // Get current user authentication

  // Fetch username and profile pic on component load
  useEffect(() => {
    const fetchUsernameAndProfilePic = async () => {
      if (auth.currentUser) {
        // Fetch username from Realtime Database
        const db = getDatabase();
        const usernameRef = dbRef(db, `users/${auth.currentUser.uid}/username`);
        const snapshot = await get(usernameRef);
        if (snapshot.exists()) {
          setUsername(snapshot.val());
        }

        // Check if profile pic exists in localStorage first
        const storedProfilePicUrl = localStorage.getItem("profilePicUrl");
        if (storedProfilePicUrl) {
          setProfilePicUrl(storedProfilePicUrl);
        } else {
          // If no profile pic in localStorage, fetch from Firebase Storage
          const storage = getStorage();
          const profilePicRef = ref(
            storage,
            `profile-pics/${auth.currentUser.uid}`
          );

          try {
            const url = await getDownloadURL(profilePicRef);
            setProfilePicUrl(url); // Set profile picture URL in the state
            // Store the profile picture URL in localStorage
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
  }, [auth.currentUser]); // Depend on auth.currentUser to refetch when user is logged in

  // Fetch files from Firebase Storage when the page loads
  useEffect(() => {
    const fetchFiles = async () => {
      const storage = getStorage();
      const storageRef = ref(storage, "files/"); // Reference to the folder where the files are stored

      try {
        // Get a list of all the files in the storage reference
        const fileList = await listAll(storageRef);

        // Fetch the download URL for each file and store in the state
        const fileDataPromises = fileList.items.map(async (fileRef) => {
          const fileName = fileRef.name;
          const url = await getDownloadURL(fileRef);

          return { file: fileName, url, type: fileRef.name.split(".").pop() }; // Store file type
        });

        // Wait for all file data to be retrieved
        const filesData = await Promise.all(fileDataPromises);

        // Update the local state with files data
        setFiles(filesData);
        console.log("Files loaded successfully:", filesData);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles(); // Automatically fetch files when the page loads
  }, []); // Empty dependency array means it only runs once when the component mounts

  // Handle file upload (for general file upload, excluding profile pic)
  const handleUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    uploadedFiles.forEach((file) => {
      if (file.type.startsWith("image/") || file.type === "application/pdf") {
        // Create a reference to the file in Firebase Storage
        const storage = getStorage();
        const storageRef = ref(storage, `files/${file.name}`);

        // Upload the file to Firebase Storage
        uploadBytes(storageRef, file).then((snapshot) => {
          console.log("Uploaded a file!");

          // Get the download URL of the uploaded file
          getDownloadURL(snapshot.ref).then((url) => {
            // Add the file to the local state
            setFiles((prevFiles) => [
              ...prevFiles,
              { file: file.name, type: file.type, url: url, voteCount: 0 },
            ]);

            // Show upload success message
            setUploadMessage("File uploaded successfully!");
          });
        });
      }
    });
  };

  // Handle file upload (for profile picture upload)
  const handleProfilePicUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      // Create a reference to the profile picture in Firebase Storage
      const storage = getStorage();
      const storageRef = ref(storage, `profile-pics/${auth.currentUser.uid}`);

      // Upload the profile picture to Firebase Storage
      uploadBytes(storageRef, file).then((snapshot) => {
        console.log("Profile picture uploaded!");

        // Get the download URL of the uploaded file
        getDownloadURL(snapshot.ref).then((url) => {
          // Update the profilePicUrl state with the new image URL
          setProfilePicUrl(url);
          // Store the new profile picture URL in localStorage
          localStorage.setItem("profilePicUrl", url);
        });

        // Show upload success message
        setUploadMessage("Profile picture uploaded successfully!");
      });
    }
  };

  // Alert before refreshing
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "Are you sure you want to leave?"; // Default message for most browsers
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div className="page-container">
      {/* Left Sidebar */}
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

      {/* Main Content */}
      <div className="main-content">
        {files.length > 0 && <h3>Avilable Data:</h3>}
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
          </div>
        ))}
        {uploadMessage && <p className="upload-message">{uploadMessage}</p>}
      </div>

      {/* Right Sidebar */}
      <div className="right-sidebar">
        {/* Profile Info Container */}
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

          {/* Username */}
          <p className="username">{username || "Loading..."}</p>
        </div>
      </div>
    </div>
  );
};

export default CustomPage;
