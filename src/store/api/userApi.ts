import { baseApi } from './baseApi';

export interface UserDetail {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  email?: string;
}

export interface UserDropdownItem {
  userId: number;
  username: string;
  fkCustId: number;
  tenantId: string;
}

export interface MenuItem {
  menuId: number;
  menuName: string;
  status: 'Active' | 'Hidden' | 'Disabled';
  modules?: MenuModule[];
}

export interface MenuModule {
  menuId: number;
  menuName: string;
  status: 'Active' | 'Hidden' | 'Disabled';
  subModules?: SubMenuItem[];
}

export interface SubMenuItem {
  menuId: number;
  menuName: string;
  status: 'Active' | 'Hidden' | 'Disabled';
}

export interface MeDetailsResponse {
  id: string;
  username: string;
  email: string;
  company: string;
  role: string;
  accessibleModules: string[];
  menus: MenuItem[];
  defaultLandingPage: string;
  inactivityTimeout: string;
  passwordPolicy: string;
  users?: UserDetail[];
  usersDropdown?: UserDropdownItem[];
}

export interface EffectiveSubMenuItem {
  menuId: number;
  menuName: string;
  effectiveStatus: 'Active' | 'Hidden' | 'Disabled';
  source: string;
  roleStatus: string;
  statusAfterTenantFeatures: string;
  overrideStatus?: string;
}

export interface EffectiveMenuModule {
  menuId: number;
  menuName: string;
  effectiveStatus: 'Active' | 'Hidden' | 'Disabled';
  source: string;
  roleStatus: string;
  statusAfterTenantFeatures: string;
  overrideStatus?: string;
  subModules?: EffectiveSubMenuItem[];
}

export interface EffectiveMenuItem {
  menuId: number;
  menuName: string;
  effectiveStatus: 'Active' | 'Hidden' | 'Disabled';
  source: string;
  roleStatus: string;
  statusAfterTenantFeatures: string;
  overrideStatus?: string;
  modules?: EffectiveMenuModule[];
}

export interface EffectiveMenuResponse {
  targetUserId: string;
  tenantId: string;
  customMenuEnabled: boolean;
  effectiveRole: string;
  menus: EffectiveMenuItem[];
}

export interface MenuOverride {
  menuId: number;
  status: 'Active' | 'Hidden' | 'Disabled';
}

export interface UpdateMenuConfigRequest {
  userId: string;
  customMenuEnabled: boolean;
  overrides: MenuOverride[];
}

export interface UpdatePreferencesRequest {
  defaultLandingPage: string;
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMeDetails: builder.query<MeDetailsResponse, void>({
      query: () => '/me/details',
      transformResponse: (response: { data: MeDetailsResponse } | MeDetailsResponse) => {
        return 'data' in response && response.data ? (response.data as MeDetailsResponse) : (response as MeDetailsResponse);
      },
      providesTags: ['Auth', 'UserPermissions'],
    }),
    getUserMenuConfig: builder.query<EffectiveMenuResponse, { userId: string; effectiveRole?: string }>({
      query: ({ userId, effectiveRole = 'admin' }) => ({
        url: `/admin/users/${userId}/menu-config`,
        params: { effectiveRole },
      }),
      transformResponse: (response: { data: EffectiveMenuResponse } | EffectiveMenuResponse) => {
        return 'data' in response && response.data ? (response.data as EffectiveMenuResponse) : (response as EffectiveMenuResponse);
      },
      providesTags: (result, error, { userId }) => [{ type: 'Auth', id: `MENU_${userId}` }, 'UserPermissions'],
    }),
    updateUserMenuConfig: builder.mutation<void, UpdateMenuConfigRequest>({
      query: ({ userId, ...body }) => ({
        url: `/admin/users/${userId}/menu-config`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { userId }) => [{ type: 'Auth', id: `MENU_${userId}` }, 'UserPermissions'],
    }),
    updateMePreferences: builder.mutation<void, UpdatePreferencesRequest>({
      query: (body) => ({
        url: `/me/preferences`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['UserPermissions', 'Auth'],
    }),
  }),
});

export const {
  useGetMeDetailsQuery,
  useGetUserMenuConfigQuery,
  useUpdateUserMenuConfigMutation,
  useUpdateMePreferencesMutation,
} = userApi;
