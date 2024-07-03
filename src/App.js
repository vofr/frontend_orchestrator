import './App.css';
import Infrastructure from './pages/Infrastructure';
import DeployingPage from './pages/DeployingPage';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';

function App() {
return (
  <Router>
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box  sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-start' }}>
            <Button color="inherit" component={Link} to='/'>Infrastructure</Button>
            <Button color="inherit" component={Link} to="/about">Applications</Button>
            <Button color="inherit" component={Link} to="/deployment">Deployment</Button>
          </Box>
          <Typography variant="h6" component="div">
            Edge-Cloud Orchestrator
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ padding: 3 }}>
        <Routes>
          <Route exact path='/' element={<Infrastructure/>} />
          <Route exact path='/deployment' element={<DeployingPage/>} />
        </Routes>
      </Box>
    </Box>
  </Router>
);
}
export default App;
