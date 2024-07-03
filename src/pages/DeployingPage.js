import FilesUploader from '../components/FilesUploader';

import React, { useState } from 'react';
import './DeployingPage.css';
import Editor from '../components/YamlEditor';

function DeployingPage() {

  const[images, setImages] = useState(null);
  const[dockerComposeFile, setDockerComposeFile] = useState('');
  const[requirementsFile, setRequirementsFile] = useState('');
  const [applicationName, setApplicationName] = useState('');

  const [progress, setProgress] = useState({ started: false, pc: 0 });
  const [msg, setMsg] = useState(null);

  const handleApplicationNameChange = (e) => {
    setApplicationName(e.target.value);
  };

  
  const handleDeployment = () => {
    if (!dockerComposeFile) {
      setMsg("No docker compose file selected");
      return;
    }
    if (!requirementsFile) {
      setMsg("No requirements file selected");
      return;
    }
    const fd = new FormData();
    if(images){
      for(let i=0; i < images.length; i++){
        fd.append('images', images[i]);
      }
    }

    const dockerComposeBlob = new Blob([dockerComposeFile], { type: 'text/yaml' });
    const requirementsBlob = new Blob([requirementsFile], { type: 'text/yaml' });

    // Append the Blob object to the FormData as "docker-compose.yml":
    fd.append('docker-compose.yml', dockerComposeBlob, 'docker-compose.yml');
    fd.append('requirements.yml', requirementsBlob, 'requirements.yml');

    fd.append('application_name', applicationName)

    setMsg("Uploading...");

    return new Promise((resolve, reject) => {
      setProgress(prevState => ({
        started: true,
        pc: 0,
        failed: false
      }));
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'http://localhost:8082/application/new_deployment', true);

      xhr.setRequestHeader("Custom-Header", "value");

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          console.log(`Progress: ${progress}%`);
          setProgress(prevState => ({
            ...prevState,
            pc: progress
          }));
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(xhr.response);
          setMsg("Uploaded succesfully");
        } else {
          reject(new Error(`Failed : ${xhr.response}`));
          setMsg("Failed to upload");
          setProgress(prevState => ({
            started: true,
            pc: null,
            failed: false
          }));
        }
      };

      xhr.onerror = () => reject(new Error('Network error'));
      xhr.send(fd);
    });
  }


  return (
    <div>

      <header>
        <h1> New Application Deployment</h1>
      </header>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
       <div className="text-box">
          <input
            type="text"
            placeholder="Application Name"
            value={applicationName}
            onChange={handleApplicationNameChange}
            style={{ width: '450px', padding: '10px' }} // Adjust width dynamically
          />
        </div>

        <div className="space-between-divs"></div> {/* Space between divs */}
        <div className="space-between-divs"></div> {/* Space between divs */}
       
        <div className="buttons-container">
          <button style={{ height: '30px', padding: '10px' }} onClick={handleDeployment}>
            Deployment
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <progress 
          max="100" 
          value={progress.pc}
        />

        {msg && <span>{msg}</span>}
      </div>

      <div className="space-between-divs"></div> {/* Space between divs */}
        
      <div className="grid-container">

        <div className="grid-item top">
          <FilesUploader 
            customHeader = {"Upload your docker images"}
            files = {images}
            setFiles = {setImages}
          />
        </div>

        <div className="grid-item bottom-left">
            <Editor 
              customHeader="Docker compose"
              fileContent={dockerComposeFile}
              setFileContent={setDockerComposeFile}
            />
        </div>
        <div className="grid-item bottom-right" >
            <Editor 
            customHeader="Container Requirements"
            fileContent={requirementsFile}
            setFileContent={setRequirementsFile}
            />
        </div>
      </div>

    </div>
  );
}

export default DeployingPage;
