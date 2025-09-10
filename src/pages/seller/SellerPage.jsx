import React, { useState } from "react";

export default function SellerPage() {

  const [files, setFiles] = useState([]);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFiles(e.target.files);
  }

  const uploadImage = async () => {
    if (files.length === 0) {
       return;
    }

    const formData = new FormData();

    try {
      let respone;
      if (files.length === 1) {
        formData.append("image", files[0]);
        respone = await fetch("http://localhost:5000/api/upload", {
          method: "POST",
          body: formData
        });
      } else {
        Array.from(files).forEach((file) => {
          formData.append("image", file);
        })
        respone = await fetch("http://localhost:5000/api/uploadd", {
          method: "POST",
          body: formData
        })
      }
      const data = await respone.json();
      setResult(data); 
    } catch (err) {
      console.log("Error: ", err);
    }
  }
  return (
    <div>
      <h1>Seller Page</h1>
      <p>It's for testing.</p>
      <input type="file" accept="image/*" onChange={handleChange} multiple></input>
      <button onClick={uploadImage}>Upload</button>
      {result && (
        <div>
          <h3>Result:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
