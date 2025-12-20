# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListMenuItemsByCategory*](#listmenuitemsbycategory)
- [**Mutations**](#mutations)
  - [*CreateMenuItem*](#createmenuitem)
  - [*UpdateMenuItem*](#updatemenuitem)
  - [*DeleteMenuItem*](#deletemenuitem)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListMenuItemsByCategory
You can execute the `ListMenuItemsByCategory` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listMenuItemsByCategory(vars: ListMenuItemsByCategoryVariables): QueryPromise<ListMenuItemsByCategoryData, ListMenuItemsByCategoryVariables>;

interface ListMenuItemsByCategoryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListMenuItemsByCategoryVariables): QueryRef<ListMenuItemsByCategoryData, ListMenuItemsByCategoryVariables>;
}
export const listMenuItemsByCategoryRef: ListMenuItemsByCategoryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMenuItemsByCategory(dc: DataConnect, vars: ListMenuItemsByCategoryVariables): QueryPromise<ListMenuItemsByCategoryData, ListMenuItemsByCategoryVariables>;

interface ListMenuItemsByCategoryRef {
  ...
  (dc: DataConnect, vars: ListMenuItemsByCategoryVariables): QueryRef<ListMenuItemsByCategoryData, ListMenuItemsByCategoryVariables>;
}
export const listMenuItemsByCategoryRef: ListMenuItemsByCategoryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMenuItemsByCategoryRef:
```typescript
const name = listMenuItemsByCategoryRef.operationName;
console.log(name);
```

### Variables
The `ListMenuItemsByCategory` query requires an argument of type `ListMenuItemsByCategoryVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListMenuItemsByCategoryVariables {
  categoryId: UUIDString;
}
```
### Return Type
Recall that executing the `ListMenuItemsByCategory` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMenuItemsByCategoryData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListMenuItemsByCategory`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMenuItemsByCategory, ListMenuItemsByCategoryVariables } from '@dataconnect/generated';

// The `ListMenuItemsByCategory` query requires an argument of type `ListMenuItemsByCategoryVariables`:
const listMenuItemsByCategoryVars: ListMenuItemsByCategoryVariables = {
  categoryId: ..., 
};

// Call the `listMenuItemsByCategory()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMenuItemsByCategory(listMenuItemsByCategoryVars);
// Variables can be defined inline as well.
const { data } = await listMenuItemsByCategory({ categoryId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMenuItemsByCategory(dataConnect, listMenuItemsByCategoryVars);

console.log(data.menuItems);

// Or, you can use the `Promise` API.
listMenuItemsByCategory(listMenuItemsByCategoryVars).then((response) => {
  const data = response.data;
  console.log(data.menuItems);
});
```

### Using `ListMenuItemsByCategory`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMenuItemsByCategoryRef, ListMenuItemsByCategoryVariables } from '@dataconnect/generated';

// The `ListMenuItemsByCategory` query requires an argument of type `ListMenuItemsByCategoryVariables`:
const listMenuItemsByCategoryVars: ListMenuItemsByCategoryVariables = {
  categoryId: ..., 
};

// Call the `listMenuItemsByCategoryRef()` function to get a reference to the query.
const ref = listMenuItemsByCategoryRef(listMenuItemsByCategoryVars);
// Variables can be defined inline as well.
const ref = listMenuItemsByCategoryRef({ categoryId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMenuItemsByCategoryRef(dataConnect, listMenuItemsByCategoryVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.menuItems);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.menuItems);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateMenuItem
You can execute the `CreateMenuItem` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createMenuItem(vars: CreateMenuItemVariables): MutationPromise<CreateMenuItemData, CreateMenuItemVariables>;

interface CreateMenuItemRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateMenuItemVariables): MutationRef<CreateMenuItemData, CreateMenuItemVariables>;
}
export const createMenuItemRef: CreateMenuItemRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createMenuItem(dc: DataConnect, vars: CreateMenuItemVariables): MutationPromise<CreateMenuItemData, CreateMenuItemVariables>;

interface CreateMenuItemRef {
  ...
  (dc: DataConnect, vars: CreateMenuItemVariables): MutationRef<CreateMenuItemData, CreateMenuItemVariables>;
}
export const createMenuItemRef: CreateMenuItemRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createMenuItemRef:
```typescript
const name = createMenuItemRef.operationName;
console.log(name);
```

### Variables
The `CreateMenuItem` mutation requires an argument of type `CreateMenuItemVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateMenuItemVariables {
  menuId: UUIDString;
  categoryId: UUIDString;
  name: string;
  description?: string | null;
  price: number;
  isAvailable: boolean;
  displayOrder: number;
}
```
### Return Type
Recall that executing the `CreateMenuItem` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateMenuItemData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateMenuItemData {
  menuItem_insert: MenuItem_Key;
}
```
### Using `CreateMenuItem`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createMenuItem, CreateMenuItemVariables } from '@dataconnect/generated';

// The `CreateMenuItem` mutation requires an argument of type `CreateMenuItemVariables`:
const createMenuItemVars: CreateMenuItemVariables = {
  menuId: ..., 
  categoryId: ..., 
  name: ..., 
  description: ..., // optional
  price: ..., 
  isAvailable: ..., 
  displayOrder: ..., 
};

// Call the `createMenuItem()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createMenuItem(createMenuItemVars);
// Variables can be defined inline as well.
const { data } = await createMenuItem({ menuId: ..., categoryId: ..., name: ..., description: ..., price: ..., isAvailable: ..., displayOrder: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createMenuItem(dataConnect, createMenuItemVars);

console.log(data.menuItem_insert);

// Or, you can use the `Promise` API.
createMenuItem(createMenuItemVars).then((response) => {
  const data = response.data;
  console.log(data.menuItem_insert);
});
```

### Using `CreateMenuItem`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createMenuItemRef, CreateMenuItemVariables } from '@dataconnect/generated';

// The `CreateMenuItem` mutation requires an argument of type `CreateMenuItemVariables`:
const createMenuItemVars: CreateMenuItemVariables = {
  menuId: ..., 
  categoryId: ..., 
  name: ..., 
  description: ..., // optional
  price: ..., 
  isAvailable: ..., 
  displayOrder: ..., 
};

// Call the `createMenuItemRef()` function to get a reference to the mutation.
const ref = createMenuItemRef(createMenuItemVars);
// Variables can be defined inline as well.
const ref = createMenuItemRef({ menuId: ..., categoryId: ..., name: ..., description: ..., price: ..., isAvailable: ..., displayOrder: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createMenuItemRef(dataConnect, createMenuItemVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.menuItem_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.menuItem_insert);
});
```

## UpdateMenuItem
You can execute the `UpdateMenuItem` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateMenuItem(vars: UpdateMenuItemVariables): MutationPromise<UpdateMenuItemData, UpdateMenuItemVariables>;

interface UpdateMenuItemRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateMenuItemVariables): MutationRef<UpdateMenuItemData, UpdateMenuItemVariables>;
}
export const updateMenuItemRef: UpdateMenuItemRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateMenuItem(dc: DataConnect, vars: UpdateMenuItemVariables): MutationPromise<UpdateMenuItemData, UpdateMenuItemVariables>;

interface UpdateMenuItemRef {
  ...
  (dc: DataConnect, vars: UpdateMenuItemVariables): MutationRef<UpdateMenuItemData, UpdateMenuItemVariables>;
}
export const updateMenuItemRef: UpdateMenuItemRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateMenuItemRef:
```typescript
const name = updateMenuItemRef.operationName;
console.log(name);
```

### Variables
The `UpdateMenuItem` mutation requires an argument of type `UpdateMenuItemVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateMenuItemVariables {
  id: UUIDString;
  name?: string | null;
  description?: string | null;
  price?: number | null;
  isAvailable?: boolean | null;
  displayOrder?: number | null;
}
```
### Return Type
Recall that executing the `UpdateMenuItem` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateMenuItemData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateMenuItemData {
  menuItem_update?: MenuItem_Key | null;
}
```
### Using `UpdateMenuItem`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateMenuItem, UpdateMenuItemVariables } from '@dataconnect/generated';

// The `UpdateMenuItem` mutation requires an argument of type `UpdateMenuItemVariables`:
const updateMenuItemVars: UpdateMenuItemVariables = {
  id: ..., 
  name: ..., // optional
  description: ..., // optional
  price: ..., // optional
  isAvailable: ..., // optional
  displayOrder: ..., // optional
};

// Call the `updateMenuItem()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateMenuItem(updateMenuItemVars);
// Variables can be defined inline as well.
const { data } = await updateMenuItem({ id: ..., name: ..., description: ..., price: ..., isAvailable: ..., displayOrder: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateMenuItem(dataConnect, updateMenuItemVars);

console.log(data.menuItem_update);

// Or, you can use the `Promise` API.
updateMenuItem(updateMenuItemVars).then((response) => {
  const data = response.data;
  console.log(data.menuItem_update);
});
```

### Using `UpdateMenuItem`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateMenuItemRef, UpdateMenuItemVariables } from '@dataconnect/generated';

// The `UpdateMenuItem` mutation requires an argument of type `UpdateMenuItemVariables`:
const updateMenuItemVars: UpdateMenuItemVariables = {
  id: ..., 
  name: ..., // optional
  description: ..., // optional
  price: ..., // optional
  isAvailable: ..., // optional
  displayOrder: ..., // optional
};

// Call the `updateMenuItemRef()` function to get a reference to the mutation.
const ref = updateMenuItemRef(updateMenuItemVars);
// Variables can be defined inline as well.
const ref = updateMenuItemRef({ id: ..., name: ..., description: ..., price: ..., isAvailable: ..., displayOrder: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateMenuItemRef(dataConnect, updateMenuItemVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.menuItem_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.menuItem_update);
});
```

## DeleteMenuItem
You can execute the `DeleteMenuItem` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteMenuItem(vars: DeleteMenuItemVariables): MutationPromise<DeleteMenuItemData, DeleteMenuItemVariables>;

interface DeleteMenuItemRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteMenuItemVariables): MutationRef<DeleteMenuItemData, DeleteMenuItemVariables>;
}
export const deleteMenuItemRef: DeleteMenuItemRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteMenuItem(dc: DataConnect, vars: DeleteMenuItemVariables): MutationPromise<DeleteMenuItemData, DeleteMenuItemVariables>;

interface DeleteMenuItemRef {
  ...
  (dc: DataConnect, vars: DeleteMenuItemVariables): MutationRef<DeleteMenuItemData, DeleteMenuItemVariables>;
}
export const deleteMenuItemRef: DeleteMenuItemRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteMenuItemRef:
```typescript
const name = deleteMenuItemRef.operationName;
console.log(name);
```

### Variables
The `DeleteMenuItem` mutation requires an argument of type `DeleteMenuItemVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteMenuItemVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteMenuItem` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteMenuItemData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteMenuItemData {
  menuItem_delete?: MenuItem_Key | null;
}
```
### Using `DeleteMenuItem`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteMenuItem, DeleteMenuItemVariables } from '@dataconnect/generated';

// The `DeleteMenuItem` mutation requires an argument of type `DeleteMenuItemVariables`:
const deleteMenuItemVars: DeleteMenuItemVariables = {
  id: ..., 
};

// Call the `deleteMenuItem()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteMenuItem(deleteMenuItemVars);
// Variables can be defined inline as well.
const { data } = await deleteMenuItem({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteMenuItem(dataConnect, deleteMenuItemVars);

console.log(data.menuItem_delete);

// Or, you can use the `Promise` API.
deleteMenuItem(deleteMenuItemVars).then((response) => {
  const data = response.data;
  console.log(data.menuItem_delete);
});
```

### Using `DeleteMenuItem`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteMenuItemRef, DeleteMenuItemVariables } from '@dataconnect/generated';

// The `DeleteMenuItem` mutation requires an argument of type `DeleteMenuItemVariables`:
const deleteMenuItemVars: DeleteMenuItemVariables = {
  id: ..., 
};

// Call the `deleteMenuItemRef()` function to get a reference to the mutation.
const ref = deleteMenuItemRef(deleteMenuItemVars);
// Variables can be defined inline as well.
const ref = deleteMenuItemRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteMenuItemRef(dataConnect, deleteMenuItemVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.menuItem_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.menuItem_delete);
});
```

