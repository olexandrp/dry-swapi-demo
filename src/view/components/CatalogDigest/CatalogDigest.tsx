import React from 'react';
import BaseComponent from '../BaseComponent';
import CollectionComponent from '../CollectionComponent';
import ModelComponent from '../ModelComponent';
import DataManager from '../../../data/DataManager';
import BaseCollection from '../../../data/BaseCollection';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabPanel from '../../functions/TabPanel';
import Loading from '../../functions/Loading';
import { match } from 'react-router';
import { History } from 'history';
import _ from 'lodash';

export interface RouteParams {
  collectionName: string;
  modelId: string;
}

interface CatalogDigestProps {
  history: History;
  match: match<RouteParams>;
}

interface CatalogDigestState {
  data: BaseCollection[];
}

class CatalogDigest extends BaseComponent<CatalogDigestProps, CatalogDigestState> {
  protected collection: typeof DataManager = DataManager;
  protected tabs: React.ReactElement[] = [];

  state: CatalogDigestState = {
    data: []
  };

  constructor(props: CatalogDigestProps) {
    super(props);
    this.initSubscriptions(
      this.collection,
      {
        'change': this.updateData
      }
    );
    this.collection.init();
  }

  updateData = (data: any) => {
    this.updateState({ data });
  }

  handleTabChange = (event: React.ChangeEvent<{}>, newIndex: any) => {
    const newCollectionName = this.collection.getCollectionNameByIndex(newIndex);
    this.redirectToCollection(newCollectionName);
  }

  redirectToCollection(collectionName: string | number | null | undefined) {
    if (collectionName === null || this.collection === undefined) return;
    this.props.history.replace(`/${collectionName}`);
  }

  render() {
    const { match: { params: { collectionName, modelId }}} = this.props;
    const { data } = this.state;
    const loading = !data.length;
    if (loading) {
      return <Loading />;
    }
    const tabsExist = !!this.tabs.length;
    const tabPanels: React.ReactElement[] = [];
    let index = 0;
    let selected = this.collection.getCollectionIndexByName(collectionName) || 0;
    data.forEach((collection) => {
      const name = collection.name;
      !tabsExist && this.tabs.push(
        <Tab label={name} key={name} />
      );
      tabPanels.push(
        <TabPanel value={selected} index={index++} key={name}>
          {
            modelId
              ? <ModelComponent collectionName={name} modelId={_.parseInt(modelId)} />
              : <CollectionComponent collectionName={name} />
          }
        </TabPanel>
      );
    });
    if (!collectionName) {
      const firstCollectionName = this.tabs[0].key;
      _.delay(() => {
        this.redirectToCollection(firstCollectionName);
      }, 0)
    }
    return (
      <>
        <AppBar position="static">
          <Tabs value={selected} onChange={this.handleTabChange}>
            { this.tabs }
          </Tabs>
        </AppBar>
        { tabPanels }
      </>
    );
  }
};

export default CatalogDigest;