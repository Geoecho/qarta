import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Category_Key {
  id: UUIDString;
  __typename?: 'Category_Key';
}

export interface CreateMenuItemData {
  menuItem_insert: MenuItem_Key;
}

export interface CreateMenuItemVariables {
  menuId: UUIDString;
  categoryId: UUIDString;
  name: string;
  description?: string | null;
  price: number;
  isAvailable: boolean;
  displayOrder: number;
}

export interface DeleteMenuItemData {
  menuItem_delete?: MenuItem_Key | null;
}

export interface DeleteMenuItemVariables {
  id: UUIDString;
}

export interface ListMenuItemsByCategoryData {
  menuItems: ({
    id: UUIDString;
    name: string;
    description?: string | null;
    price: number;
    isAvailable: boolean;
    displayOrder: number;
  } & MenuItem_Key)[];
}

export interface ListMenuItemsByCategoryVariables {
  categoryId: UUIDString;
}

export interface MenuItem_Key {
  id: UUIDString;
  __typename?: 'MenuItem_Key';
}

export interface Menu_Key {
  id: UUIDString;
  __typename?: 'Menu_Key';
}

export interface UpdateMenuItemData {
  menuItem_update?: MenuItem_Key | null;
}

export interface UpdateMenuItemVariables {
  id: UUIDString;
  name?: string | null;
  description?: string | null;
  price?: number | null;
  isAvailable?: boolean | null;
  displayOrder?: number | null;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateMenuItemRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateMenuItemVariables): MutationRef<CreateMenuItemData, CreateMenuItemVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateMenuItemVariables): MutationRef<CreateMenuItemData, CreateMenuItemVariables>;
  operationName: string;
}
export const createMenuItemRef: CreateMenuItemRef;

export function createMenuItem(vars: CreateMenuItemVariables): MutationPromise<CreateMenuItemData, CreateMenuItemVariables>;
export function createMenuItem(dc: DataConnect, vars: CreateMenuItemVariables): MutationPromise<CreateMenuItemData, CreateMenuItemVariables>;

interface ListMenuItemsByCategoryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListMenuItemsByCategoryVariables): QueryRef<ListMenuItemsByCategoryData, ListMenuItemsByCategoryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListMenuItemsByCategoryVariables): QueryRef<ListMenuItemsByCategoryData, ListMenuItemsByCategoryVariables>;
  operationName: string;
}
export const listMenuItemsByCategoryRef: ListMenuItemsByCategoryRef;

export function listMenuItemsByCategory(vars: ListMenuItemsByCategoryVariables): QueryPromise<ListMenuItemsByCategoryData, ListMenuItemsByCategoryVariables>;
export function listMenuItemsByCategory(dc: DataConnect, vars: ListMenuItemsByCategoryVariables): QueryPromise<ListMenuItemsByCategoryData, ListMenuItemsByCategoryVariables>;

interface UpdateMenuItemRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateMenuItemVariables): MutationRef<UpdateMenuItemData, UpdateMenuItemVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateMenuItemVariables): MutationRef<UpdateMenuItemData, UpdateMenuItemVariables>;
  operationName: string;
}
export const updateMenuItemRef: UpdateMenuItemRef;

export function updateMenuItem(vars: UpdateMenuItemVariables): MutationPromise<UpdateMenuItemData, UpdateMenuItemVariables>;
export function updateMenuItem(dc: DataConnect, vars: UpdateMenuItemVariables): MutationPromise<UpdateMenuItemData, UpdateMenuItemVariables>;

interface DeleteMenuItemRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteMenuItemVariables): MutationRef<DeleteMenuItemData, DeleteMenuItemVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteMenuItemVariables): MutationRef<DeleteMenuItemData, DeleteMenuItemVariables>;
  operationName: string;
}
export const deleteMenuItemRef: DeleteMenuItemRef;

export function deleteMenuItem(vars: DeleteMenuItemVariables): MutationPromise<DeleteMenuItemData, DeleteMenuItemVariables>;
export function deleteMenuItem(dc: DataConnect, vars: DeleteMenuItemVariables): MutationPromise<DeleteMenuItemData, DeleteMenuItemVariables>;

