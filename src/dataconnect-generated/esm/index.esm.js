import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'exapp',
  location: 'us-east4'
};

export const createMenuItemRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateMenuItem', inputVars);
}
createMenuItemRef.operationName = 'CreateMenuItem';

export function createMenuItem(dcOrVars, vars) {
  return executeMutation(createMenuItemRef(dcOrVars, vars));
}

export const listMenuItemsByCategoryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMenuItemsByCategory', inputVars);
}
listMenuItemsByCategoryRef.operationName = 'ListMenuItemsByCategory';

export function listMenuItemsByCategory(dcOrVars, vars) {
  return executeQuery(listMenuItemsByCategoryRef(dcOrVars, vars));
}

export const updateMenuItemRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateMenuItem', inputVars);
}
updateMenuItemRef.operationName = 'UpdateMenuItem';

export function updateMenuItem(dcOrVars, vars) {
  return executeMutation(updateMenuItemRef(dcOrVars, vars));
}

export const deleteMenuItemRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteMenuItem', inputVars);
}
deleteMenuItemRef.operationName = 'DeleteMenuItem';

export function deleteMenuItem(dcOrVars, vars) {
  return executeMutation(deleteMenuItemRef(dcOrVars, vars));
}

