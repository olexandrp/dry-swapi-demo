import React from 'react';
import DataManager from '../../data/DataManager';
import BaseCollection from '../../data/BaseCollection';

export type SubscriptionsTarget = BaseCollection | typeof DataManager;

export interface SubscriptionsConfig {
  [key: string]: (arg0: any) => void;
}

class BaseComponent<P, S> extends React.Component<P, S> {
  protected mounted: boolean = false;
  protected subscriptionsTarget: SubscriptionsTarget | undefined;
  protected subscriptionsConfig: SubscriptionsConfig = {};

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
    this.unSubscribe();
  }

  updateState(newState: S) {
    if (!this.mounted) return;
    this.setState(newState);
  }

  initSubscriptions(target: SubscriptionsTarget, config: SubscriptionsConfig) {
    this.subscriptionsTarget = target;
    this.subscriptionsConfig = {...config};
    this.subscribe();
  }

  subscribe() {
    if (!this.subscriptionsTarget) return;
    for (let [eventName, callback] of Object.entries(this.subscriptionsConfig)) {
      this.subscriptionsTarget && this.subscriptionsTarget.on(eventName, callback);
    }
  }

  unSubscribe() {
    if (!this.subscriptionsTarget) return;
    for (let [eventName, callback] of Object.entries(this.subscriptionsConfig)) {
      this.subscriptionsTarget && this.subscriptionsTarget.off(eventName, callback);
    }
  }
}

export default BaseComponent;