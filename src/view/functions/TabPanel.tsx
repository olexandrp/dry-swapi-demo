import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
  }
});

export interface TabPanelProps {
  value: any;
  index: any;
  children: React.ReactNode;
}

const TabPanel = ({ value, index, children }: TabPanelProps) => {
  const classes = useStyles();
  if (value !== index) {
    return null;
  }
  return (
    <div className={classes.root}>
      { value === index && children }
    </div>
  );
};

export default TabPanel;