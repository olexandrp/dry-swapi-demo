import React from 'react';
import DataManager from '../../../data/DataManager';
import BaseComponent from '../BaseComponent';
import BaseCollection, { BaseCollectionData } from '../../../data/BaseCollection';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Button
} from '@material-ui/core';
import Loading from '../../functions/Loading';
import { withStyles } from '@material-ui/core/styles';
import utils from '../../../utils';
import { Link } from 'react-router-dom';
import _ from 'lodash';

const styles = {
  root: {
    width: '100%',
    height: '100%',
    padding: '1rem'
  }
};

export interface SubscriptionsConfig {
  [key: string]: (arg0: any) => void;
}

interface CollectionComponentProps {
  collectionName: string;
  classes: any;
}

interface CollectionComponentState {
  data?: BaseCollectionData;
  schema?: any;
}

class CollectionComponent extends BaseComponent<CollectionComponentProps, CollectionComponentState> {
  protected collection?: BaseCollection;

  state: CollectionComponentState = {
    data: void 0,
    schema: void 0
  };

  constructor(props: CollectionComponentProps) {
    super(props);
    this.collection = DataManager.getCollectionByName(this.props.collectionName);
    this.collection && this.initSubscriptions(this.collection, {
      change: this.updateData,
      'change:schema': this.updateSchema
    });

  }

  updateData = (data: BaseCollectionData | undefined) => {
    this.updateState({ data });
  }

  updateSchema = (schema: {} | undefined) => {
    this.updateState({ schema });
  }

  componentDidMount() {
    super.componentDidMount();
    if (!this.collection) {
      return;
    }
    this.updateSchema(this.collection.schema);
    this.updateData(this.collection.data);
  }

  render() {
    const { classes } = this.props;
    const { data, schema } = this.state;
    const loading = !data || !schema || !this.collection;
    if (loading) {
      return <Loading />;
    }
    const importantFields: string[] = _.slice(schema.required, 0, 3);
    const baseUrl = this.collection && this.collection.url;
    return (
      <div className={classes.root}>
        <Typography variant={"h4"}>{ schema.description }</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {
                  importantFields.map((field) => (
                    <TableCell key={field}>{ field }</TableCell>
                  ))
                }
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                data
                  ? data.results.map((entry) => {
                      const entryId = utils.getIdFromUrl(entry.url);
                      return (
                        <TableRow key={entry.url}>
                          {
                            importantFields.map((field) => (
                              <TableCell key={field}>{ entry.data && entry.data[field] }</TableCell>
                            ))
                          }
                          <TableCell key="details">
                            <Link to={`${baseUrl}${entryId}`}>
                              <Button>details</Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  : <Loading />
              }
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
}

export default withStyles(styles)(CollectionComponent);