import { CreateMenuItemData, CreateMenuItemVariables, ListMenuItemsByCategoryData, ListMenuItemsByCategoryVariables, UpdateMenuItemData, UpdateMenuItemVariables, DeleteMenuItemData, DeleteMenuItemVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateMenuItem(options?: useDataConnectMutationOptions<CreateMenuItemData, FirebaseError, CreateMenuItemVariables>): UseDataConnectMutationResult<CreateMenuItemData, CreateMenuItemVariables>;
export function useCreateMenuItem(dc: DataConnect, options?: useDataConnectMutationOptions<CreateMenuItemData, FirebaseError, CreateMenuItemVariables>): UseDataConnectMutationResult<CreateMenuItemData, CreateMenuItemVariables>;

export function useListMenuItemsByCategory(vars: ListMenuItemsByCategoryVariables, options?: useDataConnectQueryOptions<ListMenuItemsByCategoryData>): UseDataConnectQueryResult<ListMenuItemsByCategoryData, ListMenuItemsByCategoryVariables>;
export function useListMenuItemsByCategory(dc: DataConnect, vars: ListMenuItemsByCategoryVariables, options?: useDataConnectQueryOptions<ListMenuItemsByCategoryData>): UseDataConnectQueryResult<ListMenuItemsByCategoryData, ListMenuItemsByCategoryVariables>;

export function useUpdateMenuItem(options?: useDataConnectMutationOptions<UpdateMenuItemData, FirebaseError, UpdateMenuItemVariables>): UseDataConnectMutationResult<UpdateMenuItemData, UpdateMenuItemVariables>;
export function useUpdateMenuItem(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateMenuItemData, FirebaseError, UpdateMenuItemVariables>): UseDataConnectMutationResult<UpdateMenuItemData, UpdateMenuItemVariables>;

export function useDeleteMenuItem(options?: useDataConnectMutationOptions<DeleteMenuItemData, FirebaseError, DeleteMenuItemVariables>): UseDataConnectMutationResult<DeleteMenuItemData, DeleteMenuItemVariables>;
export function useDeleteMenuItem(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteMenuItemData, FirebaseError, DeleteMenuItemVariables>): UseDataConnectMutationResult<DeleteMenuItemData, DeleteMenuItemVariables>;
