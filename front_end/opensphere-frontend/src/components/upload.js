import React, { useState, useEffect } from "react";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
} from "firebase/storage"; // Firebase Storage utilities
import { getDatabase, ref as dbRef, set, get, update } from "firebase/database"; // Firebase Realtime Database utilities
import { getAuth } from "firebase/auth"; // Firebase Authentication
import "./upload.css";

const CustomPage = () => {
  const [files, setFiles] = useState([]); // Stores uploaded files and Firebase files
  const [uploadMessage, setUploadMessage] = useState(""); // For showing upload success message
  const [showModal, setShowModal] = useState(false);
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState(null);

  const auth = getAuth(); // Get current user authentication

  // Sanitize file name for Firebase path (to avoid invalid characters)
  const sanitizeFileName = (fileName) => {
    return fileName.replace(/[.#$[\]]/g, "_"); // Replace problematic characters
  };

  // Handle file upload (for Upload+ button)
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

  // Handle Browse button click (fetch files from Firebase Storage)
  const handleBrowse = async () => {
    // Fetch files from Firebase Storage
    const storage = getStorage();
    const storageRef = ref(storage, "files/"); // Reference to the folder where the files are stored

    try {
      // Get a list of all the files in the storage reference
      const fileList = await listAll(storageRef);

      // Clear the current files in the main scrollbar (if any)
      setFiles([]);

      // Fetch the download URL for each file and store in the state
      const fileDataPromises = fileList.items.map(async (fileRef) => {
        const fileName = fileRef.name;
        const url = await getDownloadURL(fileRef);

        // Retrieve the vote count directly from the "files" folder in the database
        const db = getDatabase();
        const voteRef = dbRef(db, `files/${sanitizeFileName(fileName)}`);
        const voteSnapshot = await get(voteRef);
        const voteCount = voteSnapshot.exists()
          ? voteSnapshot.val().voteCount
          : 0;

        return { file: fileName, url, voteCount };
      });

      // Wait for all file data to be retrieved
      const filesData = await Promise.all(fileDataPromises);

      // Update the local state with files data
      setFiles(filesData);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  // Handle vote button click (each account can vote only once per file)
  const handleVote = (index) => {
    const db = getDatabase();
    const fileToUpdate = files[index];

    // Get current user ID
    const userId = auth.currentUser ? auth.currentUser.uid : null;
    if (!userId) {
      alert("You need to be logged in to vote!");
      return;
    }

    // Check if the user has already voted for this file
    const userVoteRef = dbRef(
      db,
      `files/${sanitizeFileName(fileToUpdate.file)}/${userId}`
    );
    get(userVoteRef).then((snapshot) => {
      if (snapshot.exists()) {
        alert("You have already voted for this file!");
        return;
      }

      // If not voted, increment the vote count in the database
      const newVoteCount = fileToUpdate.voteCount + 1;
      update(dbRef(db, `files/${sanitizeFileName(fileToUpdate.file)}`), {
        voteCount: newVoteCount,
      });

      // Store the user's vote in the database to prevent multiple votes
      set(userVoteRef, { voted: true });

      // Update the local state to reflect the new vote count
      setFiles((prevFiles) =>
        prevFiles.map((file, i) =>
          i === index ? { ...file, voteCount: newVoteCount } : file
        )
      );
    });
  };

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
        {/* Browse Button placed below Upload+ Button */}
        <button onClick={handleBrowse} className="browse-button">
          Browse Files
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {files.length > 0 && <h3>Uploaded & Firebase Files:</h3>}
        {files.map((file, index) => (
          <div key={index} className="file-preview">
            {file.type === "application/pdf" ? (
              <div className="pdf-preview">
                <iframe
                  src={file.url}
                  width="600"
                  height="600" // Adjusted height for better display
                  title="PDF Preview"
                  frameBorder="0"
                />
              </div>
            ) : (
              <div className="image-preview">
                <img
                  src={file.url}
                  alt={`Uploaded ${index}`}
                  className="uploaded-image"
                />
              </div>
            )}
            <button onClick={() => handleVote(index)} className="vote-button">
              Vote
            </button>
            <p>Votes: {file.voteCount}</p>
          </div>
        ))}

        {uploadMessage && <p className="upload-message">{uploadMessage}</p>}
      </div>

      {/* Right Sidebar */}
      <div className="right-sidebar">
        <div className="profile-pic"></div>
        <p className="username">username:</p>
      </div>
    </div>
  );
};

export default CustomPage;
