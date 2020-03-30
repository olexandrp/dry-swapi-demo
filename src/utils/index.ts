import _ from 'lodash';

export function getIdFromUrl(url: string) {
  const urlPartsRaw = _.split(url, '/')
  const urlParts = _.compact(urlPartsRaw);
  const lastUrlPart = _.last(urlParts);
  return lastUrlPart ? _.parseInt(lastUrlPart) : void 0;
}

export default {
  getIdFromUrl
}