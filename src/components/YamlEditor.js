import axios from 'axios';
import React, { useState, useEffect  } from 'react';
import { useCodeMirror } from '@uiw/react-codemirror';
import { yaml } from '@codemirror/lang-yaml';

const Editor = ({ customHeader, fileContent, setFileContent }) => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState({ started: false, pc: 0 });
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if(file != null){
        const reader = new FileReader();
        reader.onload = (e) => {
        setFileContent(e.target.result);
        };
        reader.readAsText(file);
        setMsg(null);
        setProgress(null);
    }
  }, [file]);

  const handleUpload = () => {
    if (!file) {
      setMsg("No file selected.");
      return;
    }
    const fd = new FormData();
    fd.append('file', file);
    setMsg("Uploading...");
    setProgress(prevState => ({ ...prevState, started: true }));

    axios.post('http://httpbin.org/post', fd, {
      onUploadProgress: (progressEvent) => {
        setProgress(prevState => ({
          ...prevState, pc: (progressEvent.loaded / progressEvent.total) * 100
        }));
      },
      headers: {
        "Custom-Header": "value",
      }
    })
      .then(res => {
        setMsg("Upload successful");
        const reader = new FileReader();
        reader.onload = (e) => {
          setFileContent(e.target.result);
        };
        reader.readAsText(file);
        setMsg(null);
        setProgress(null);
      })
      .catch(err => {
        setMsg("Upload failed");
        console.error(err);
      });
  };

  const handleChange = (value, viewUpdate) => {
    setFileContent(value);
    console.log(value);
  };

  const { setContainer } = useCodeMirror({
    value: fileContent,
    extensions: [yaml()],
    onChange: handleChange,
  });

  return (
    <div className="file-uploader" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginBottom: '20px' }}>
      <h1>{customHeader}</h1>
      <input onChange={(e) => { setFile(e.target.files[0]) }} type="file" />
      {progress?.started && <progress max="100" value={progress.pc}></progress>}
      {msg && <span>{msg}</span>}
      <div ref={setContainer} style={{ border: '1px solid black', height: '500px', textAlign: 'left', width:'100%' }}></div>
    </div>
  );
};

export default Editor;