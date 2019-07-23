import { FlowRouter } from 'meteor/kadira:flow-router';

let lastPath = '';

export function updatePathToGA() {
  const { path } = FlowRouter.current();
  if (path === lastPath) {
    return;
  }
  lastPath = path;

  const gaTrackingId = 'UA-143586675-1';
  gtag('config', gaTrackingId, { 'page_path': path });
}

function gtag() {
  const dataLayer = window.dataLayer;
  if (isPathData(dataLayer[dataLayer.length - 1])) {
    // 避免陣列太大
    dataLayer.pop();
  }
  // GA一定要直接丟 arguments 進去，用其他方式放進去沒有反應
  dataLayer.push(arguments); // eslint-disable-line prefer-rest-params
}

function isPathData(data) {
  if (typeof data !== 'object') {
    return false;
  }
  if (data[0] !== 'config') {
    return false;
  }
  if (typeof data[2] !== 'object' || typeof data[2].page_path !== 'string') {
    return false;
  }

  return true;
}

