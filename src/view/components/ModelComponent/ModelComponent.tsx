import React from 'react';
import BaseComponent from '../BaseComponent';
import BaseCollection from '../../../data/BaseCollection';
import BaseModel from '../../../data/BaseModel';
import DataManager from '../../../data/DataManager';
import {
  Grid,
  Typography,
  Button
} from '@material-ui/core';
import {
  ArrowBack
} from '@material-ui/icons';
import Loading from '../../functions/Loading';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import _ from 'lodash';

const styles = {
  root: {
    width: '100%',
    height: '100%',
    padding: '1rem'
  },
  gridCell: {
    padding: '1rem'
  }
};

export interface ModelComponentProps {
  collectionName: string;
  modelId: number;
  classes: any;
}

export interface ModelComponentState {
  data?: {[key: string]: any}
}

class ModelComponent extends BaseComponent<ModelComponentProps, ModelComponentState> {
  collection?: BaseCollection;
  model?: BaseModel;

  constructor(props: ModelComponentProps) {
    super(props);
    this.collection = DataManager.getCollectionByName(props.collectionName);
    this.model = this.collection && this.collection.getModelById(props.modelId);
    this.collection && this.initSubscriptions(this.collection, {
      'change': this.updateData
    });
    this.state = {
      data: this.model ? this.model.data : void 0
    }
  }

  updateData = (data: any) => {
    if (this.model) return;
    this.model = this.collection && this.collection.getModelById(this.props.modelId);
    this.model && this.updateState({ data: this.model.data });
  }

  componentDidMount() {
    super.componentDidMount();
    !this.model && this.collection && this.collection.fetchModel(this.props.modelId);
  }

  render() {
    const { classes } = this.props;
    const { data } = this.state;
    const schema = this.collection && this.collection.schema;
    const loading = !data || !schema;
    if (loading) {
      return <Loading />;
    }
    const rows: React.ReactElement[] = [];
    const collectionUrl = this.collection && this.collection.url;
    _.mapKeys(schema.properties, (entry, dataKey) => {
      if (entry.type !== 'string') {
        return;
      }
      rows.push(
        <Grid item xs={6} key={dataKey}>
          <Grid container className={classes.gridCell}>
            <Grid item xs={12}><Typography variant={'subtitle2'}>{ entry.description }</Typography></Grid>
            <Grid item xs={12}>{ data && data[dataKey] }</Grid>
          </Grid>
        </Grid>
      );
    })
    return (
      <div className={classes.root}>
        { collectionUrl && (
          <Link to={collectionUrl}>
            <Button startIcon={<ArrowBack />}>
              back
            </Button>
          </Link>
        )}
        <Grid container>
          { rows }
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(ModelComponent);