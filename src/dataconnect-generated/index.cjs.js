const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'exapp',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const createMenuItemRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateMenuItem', inputVars);
}
createMenuItemRef.operationName = 'CreateMenuItem';
exports.createMenuItemRef = createMenuItemRef;

exports.createMenuItem = function createMenuItem(dcOrVars, vars) {
  return executeMutation(createMenuItemRef(dcOrVars, vars));
};

const listMenuItemsByCategoryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMenuItemsByCategory', inputVars);
}
listMenuItemsByCategoryRef.operationName = 'ListMenuItemsByCategory';
exports.listMenuItemsByCategoryRef = listMenuItemsByCategoryRef;

exports.listMenuItemsByCategory = function listMenuItemsByCategory(dcOrVars, vars) {
  return executeQuery(listMenuItemsByCategoryRef(dcOrVars, vars));
};

const updateMenuItemRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateMenuItem', inputVars);
}
updateMenuItemRef.operationName = 'UpdateMenuItem';
exports.updateMenuItemRef = updateMenuItemRef;

exports.updateMenuItem = function updateMenuItem(dcOrVars, vars) {
  return executeMutation(updateMenuItemRef(dcOrVars, vars));
};

const deleteMenuItemRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteMenuItem', inputVars);
}
deleteMenuItemRef.operationName = 'DeleteMenuItem';
exports.deleteMenuItemRef = deleteMenuItemRef;

exports.deleteMenuItem = function deleteMenuItem(dcOrVars, vars) {
  return executeMutation(deleteMenuItemRef(dcOrVars, vars));
};
