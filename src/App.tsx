import React from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import CatalogDigest from './view/components/CatalogDigest/CatalogDigest';
import { makeStyles } from '@material-ui/core/styles';
import './App.css';

const useStyles = makeStyles({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  }
});

function App() {
  const classes = useStyles();
  return (
    <div className={`${classes.root} App`}>
      <Router>
        <Route path="/:collectionName?/:modelId?" component={CatalogDigest} />
      </Router>
    </div>
  );
}

export default App;
