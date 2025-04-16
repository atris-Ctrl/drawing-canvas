import React, { useState } from "react";
import Button from "../styleComponent/Button";
import { FaFileUpload } from "react-icons/fa";
import "./fileupload.css";

const SingleFileUploader = ({ POST_URL }) => {
  const [file, setFile] = useState(null);
  const [fileStatus, setStatus] = useState("initial");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setStatus("initial");
      setFile(selectedFile);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setStatus("initial");
      setFile(droppedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setStatus("uploading");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(POST_URL, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setStatus("success");
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Upload failed:", error.message);
      setStatus("fail");
    }
  };

  return (
    <div className="rounded-lg mx-auto my-10 w-fit text-center">
      <div
        className="bg-white border-dashed rounded-lg border-4 border-gray-400 flex flex-col justify-center items-center p-6 hover:border-blue-500 transition duration-300"
        onDrop={handleDrag}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="file-upload flex flex-col text-gray-500 mb-4">
          <FaFileUpload size={45} />
          <p className="mt-2 text-sm font-medium">Drop your file here</p>
        </div>
        <div className="mb-4">
          <input
            type="file"
            hidden
            id="browse"
            onChange={handleFileChange}
            className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          ></input>
          <label
            htmlFor="browse"
            className="bg-blue-500 text-white py-2 px-4 rounded cursor-pointer hover:bg-blue-600 transition duration-300"
          >
            Browse
          </label>
        </div>
        {file && <Button onClick={handleUpload}>Upload File</Button>}
        {file && (
          <section className="mb-6">
            <p className="font-medium text-gray-700">File details:</p>
            <ul className="list-disc ml-6 text-sm text-gray-600">
              <li>
                <strong>Name:</strong> {file.name}
              </li>
              <li>
                <strong>Type:</strong> {file.type}
              </li>
              <li>
                <strong>Size:</strong> {file.size} bytes
              </li>
            </ul>
          </section>
        )}
        <Result status={fileStatus} />
      </div>
    </div>
  );
};

const Result = ({ status }) => {
  const statusMessages = {
    success: <p className="text-green-600">✅ File uploaded successfully!</p>,
    fail: <p className="text-red-600">❌ File upload failed!</p>,
    uploading: <p className="text-blue-600">⏳ Uploading selected file...</p>,
  };

  return statusMessages[status] || null;
};

export default SingleFileUploader;
