import DataSource from '../transport/DataSource';
import BaseCollection from '../data/BaseCollection';
import EventEmmiter from 'eventemitter3';

class DataManager {
  protected rootStore: BaseCollection[];
  protected events: EventEmmiter;

  constructor() {
    this.rootStore = [];
    this.events = new EventEmmiter();
  }

  on(eventName: string, callback: (data?: any) => void) {
    this.events.on(eventName, callback);
  }

  off(eventName: string, callback?: (error?: any) => void) {
    this.events.off(eventName, callback);
  }

  init() {
    DataSource.get({ url: '/' }, {
      onSuccess: (response) => {
        for (let [collectionName] of Object.entries<string>(response.data)) {
          this.rootStore.push(new BaseCollection(collectionName));
        }
        this.events.emit('change', this.rootStore);

      },
      onError: (error) => {
        this.events.emit('error', error);
      }
    });
  }

  getCollectionByName(collectionName: string) {
    let foundCollection: BaseCollection | undefined;
    this.rootStore.some((collection) => {
      const result = collection.name === collectionName;
      if (result) {
        foundCollection = collection;
      }
      return result;
    });
    return foundCollection;
  }

  getCollectionIndexByName(collectionName: string) {
    let foundIndex: number | undefined;
    this.rootStore.some((collection, index) => {
      const result = collection.name === collectionName;
      if (result) {
        foundIndex = index;
      }
      return result;
    });
    return foundIndex;
  }

  getCollectionNameByIndex(collectionIndex: number) {
    let foundCollectionName: string | undefined;
    this.rootStore.some((collection, index) => {
      const result = collectionIndex === index;
      if (result) {
        foundCollectionName = collection.name;
      }
      return result;
    });
    return foundCollectionName;
  }

  // getModelBy
}

// fake singleton
export default new DataManager();