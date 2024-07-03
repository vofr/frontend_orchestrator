import React, { useState } from 'react';

const FilesUploader = ({ customHeader, files, setFiles }) => {
  const [msg, setMsg] = useState(null);

  const handleUpload = () => {
    if (!files) {
      setMsg("No file selected.");
      return;
    }
    const fd = new FormData();
    for(let i=0; i < files.length; i++){
      fd.append(`file-${i}`, files[i]);
    }
    setMsg("Uploading...");
    fetch('http://localhost:8082/application/upload', {
      method: "POST",
      body: fd,
      headers: {
        "Custom-Header": "value",
      }
    })
    .then(res => {
      if(!res.ok){
        throw new Error("Bad response");
      }
      setMsg("Upload successful");
      setMsg(null);
      return res;
    })
    .then(data => console.log(data))
    .catch(err => {
      setMsg("Upload failed");
      console.error(err);
    });
  };

  const handleFileChange = (e) => {
    setFiles((prevFiles) => (prevFiles ? [...prevFiles, ...Array.from(e.target.files)] : Array.from(e.target.files)));
  };

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginBottom: '20px' }}>
      <h1>{customHeader}</h1>
      <input onChange={handleFileChange} type="file" multiple accept=".tar" />
      {msg && <span>{msg}</span>}
      { files && files.length > 0 && (
        <div style={{ marginTop: '20px', width: '100%' }}>
        <h2>Selected Files:</h2>
        {files.map((file, index) => (
          <div key={index} style={{ background: '#F3F8FF',border: '1px solid #ccc', borderRadius: '5px', padding: '10px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>{file.name}</span>
            <button 
                onClick={() => removeFile(index)} 
                style={{ 
                  marginLeft: '10px', 
                  backgroundColor: 'transparent', 
                  border: 'none', 
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease' // Smooth transition
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'red'; // Change background on hover
                  e.target.style.color = 'white'; // Change text color on hover
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent'; // Restore background on hover out
                  e.target.style.color = 'black'; // Restore text color on hover out
                }}
              >
                X
            </button>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};

export default FilesUploader;