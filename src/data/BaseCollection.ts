import DataSource, { DataSourceResponse, DataSourceError } from '../transport/DataSource';
import BaseModel from '../data/BaseModel';
import EventEmmiter from 'eventemitter3';
import utils from '../utils';
import _ from 'lodash';

export interface BaseCollectionData {
  count: number;
  next?: string;
  previous?: string;
  results: BaseModel[]
}

class BaseCollection {
  private _name: string;
  private _url: string;
  private _data: BaseCollectionData;
  private _schema: any;
  private _error: any;
  private _events: EventEmmiter;

  constructor(name: string) {
    this._name = name;
    this._url = `/${name}/`;
    this._data = {
      count: 0,
      next: void 0,
      previous: void 0,
      results: []
    };
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

  get name() {
    return this._name;
  }

  get url() {
    return this._url;
  }

  get schema() {
    if (this._schema) {
      return this._schema;
    }
    this.fetchSchema();
    return void 0;
  }

  get data() {
    this.fetch();
    return this._data;
  }

  getModelById(id: number) {
    if (!this._data.results.length) { return void 0; }
    return _.find(this._data.results, (model) => model.id === id);
  }

  addModel(model: BaseModel) {
    let modelExist = false;
    if (this._data.results.length) {
      modelExist = this._data.results.some((entry) => entry.id === model.id);
      if (!modelExist) {
        this._data.results.push(model);
        this._data.count = this._data.results.length;
      }
    } else {
      this._data.results = [model];
      this._data.count = this._data.results.length;
    }
  }

  fetchSchema() {
    if (this._schema) { return; }
    DataSource.get({
      url: `${this._url}schema`
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
        data.results.forEach((entry: any) => {
          const modelId = utils.getIdFromUrl(entry.url);
          const modelData = {
            ...entry,
            id: modelId
          };
          const model = new BaseModel(this._name, modelId, modelData);
          this.addModel(model);
        });
        this._data.previous = data.previous;
        this._data.next = data.next;
        this._data.count = data.count;
        this.emitChange();
      },
      onError: (error: DataSourceError) => {
        this._error = error;
        this.emitError();
      }
    });
  }

  fetchModel(modelId: string | number) {
    DataSource.get({
      url: `${this._url}${modelId}`
    }, {
      onSuccess: ({ data }: DataSourceResponse) => {
        const modelId = utils.getIdFromUrl(data.url);
        const dataWrapped = {
          ...data,
          id: modelId
        };
        this.addModel(new BaseModel(this._name, modelId, dataWrapped));
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

export default BaseCollection;