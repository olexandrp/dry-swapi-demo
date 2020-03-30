import DataSource, { DataSourceResponse, DataSourceError } from '../transport/DataSource';
import EventEmmiter from 'eventemitter3';
import utils from '../utils';

class BaseModel {
  private _id?: number;
  private _collectionName: string;
  private _url: string;
  private _data?: {[key: string]: any};
  private _schema: any;
  private _error: any;
  private _events: EventEmmiter;

  constructor(collectionName: string, modelId?: number, data?: {}) {
    this._id = modelId;
    this._url = `/${collectionName}/${modelId}`;
    this._collectionName = collectionName;
    this._data = data;
    this._schema = void 0;
    this._error = void 0;
    this._events = new EventEmmiter();
  }

  on(eventName: string, callback: () => void) {
    this._events.on(eventName, callback);
  }

  off(eventName: string, callback?: () => void) {
    this._events.off(eventName, callback);
  }

  emitChange() {
    this._events.emit('change', this._data);
  }

  emitChangeSchema() {
    this._events.emit('change:schema', this._schema);
  }

  emitError() {
    this._events.emit('error', this._error);
  }

  get id() {
    return this._id;
  }

  get url() {
    return this._url;
  }

  get collectionName() {
    return this._collectionName;
  }

  get schema() {
    if (this._schema) {
      return this._schema;
    }
    this.fetchSchema();
    return void 0;
  }

  get data() {
    if (this._data) {
      return this._data;
    }
    this.fetch();
    return void 0;
  }

  fetchSchema() {
    if (this._schema) { return; }
    DataSource.get({
      url: `/${this._collectionName}/schema`
    }, {
      onSuccess: ({ data }: DataSourceResponse) => {
        this._schema = data;
        this.emitChangeSchema();
      },
      onError: (error: DataSourceError) => {
        this._error = error;
        this.emitError();
      }
    });
  }

  fetch() {
    DataSource.get({
      url: this._url
    }, {
      onSuccess: ({ data }: DataSourceResponse) => {
        const dataWrapped = {
          ...data,
          results: data.results.map((entry: any) => {
            return {
              ...entry,
              id: utils.getIdFromUrl(entry.url)
            };
          })
        };
        this._data = dataWrapped;
        this.emitChange();
      },
      onError: (error: DataSourceError) => {
        this._error = error;
        this.emitError();
      }
    });
  }

  /*
  validate() {
    validateSync();
    validateAsync();
  }

  getRelatedDataBySchemaInfo() {}

  destroy() {}

  and so on
  */
}

export default BaseModel;