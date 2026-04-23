const { cloudEnvId, uploadRoot } = require('./config');

function unwrapCloudResult(result) {
  const response = result && result.result ? result.result : result;

  if (!response) {
    throw new Error('云函数未返回结果');
  }

  if (response.success === false || response.ok === false) {
    throw new Error(response.message || '云函数调用失败');
  }

  return response.data !== undefined ? response.data : response;
}

function callCloudFunction(name, data = {}) {
  return wx.cloud
    .callFunction({
      name,
      config: {
        env: cloudEnvId
      },
      data
    })
    .then(unwrapCloudResult);
}

function callAction(name, action, payload = {}) {
  return callCloudFunction(name, {
    action,
    payload
  });
}

function uploadImageToCloud(filePath, folder = 'common') {
  const fileExtension = (filePath.match(/\.[^.]+$/) || ['.png'])[0];
  const cloudPath = `${uploadRoot}/${folder}/${Date.now()}_${Math.random()
    .toString(16)
    .slice(2)}${fileExtension}`;

  return wx.cloud.uploadFile({
    cloudPath,
    filePath
  });
}

function getTempFileURL(fileList = []) {
  if (!fileList.length) {
    return Promise.resolve([]);
  }

  return wx.cloud.getTempFileURL({
    fileList
  }).then((res) => res.fileList || []);
}

module.exports = {
  callFunction: callCloudFunction,
  callCloudFunction,
  callAction,
  uploadImageToCloud,
  getTempFileURL
};
