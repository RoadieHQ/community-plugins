/*
 * Copyright 2024 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React from 'react';

import { parseEntityRef } from '@backstage/catalog-model';
import { Table, WarningPanel } from '@backstage/core-components';
import { usePermission } from '@backstage/plugin-permission-react';

import CachedIcon from '@mui/icons-material/Cached';
import Box from '@mui/material/Box';

import { policyEntityUpdatePermission } from '@backstage-community/plugin-rbac-common';

import { usePermissionPolicies } from '../../hooks/usePermissionPolicies';
import { filterTableData } from '../../utils/filter-table-data';
import EditRole from '../EditRole';
import { columns } from './PermissionsListColumns';

type PermissionsCardProps = {
  entityReference: string;
  canReadUsersAndGroups: boolean;
};

const getRefreshIcon = () => <CachedIcon />;
const getEditIcon = (isAllowed: boolean, roleName: string) => {
  const { kind, name, namespace } = parseEntityRef(roleName);

  return (
    <EditRole
      dataTestId={isAllowed ? 'update-policies' : 'disable-update-policies'}
      roleName={roleName}
      disable={!isAllowed}
      to={`../../role/${kind}/${namespace}/${name}?activeStep=${2}`}
    />
  );
};

export const PermissionsCard = ({
  entityReference,
  canReadUsersAndGroups,
}: PermissionsCardProps) => {
  const { data, loading, retry, error } =
    usePermissionPolicies(entityReference);
  const [searchText, setSearchText] = React.useState<string>();
  const permissionResult = usePermission({
    permission: policyEntityUpdatePermission,
    resourceRef: policyEntityUpdatePermission.resourceType,
  });

  const numberOfPolicies = React.useMemo(() => {
    const filteredPermissions = filterTableData({ data, columns, searchText });
    let policies = 0;
    filteredPermissions.forEach(p => {
      if (p.conditions) {
        policies++;
        return;
      }
      policies += p.policies.filter(pol => pol.effect === 'allow').length;
    });
    return policies;
  }, [data, searchText]);

  const actions = [
    {
      icon: getRefreshIcon,
      tooltip: 'Refresh',
      isFreeAction: true,
      onClick: () => {
        retry.permissionPoliciesRetry();
        retry.policiesRetry();
        retry.conditionalPoliciesRetry();
      },
    },
    {
      icon: () =>
        getEditIcon(
          permissionResult.allowed && canReadUsersAndGroups,
          entityReference,
        ),
      tooltip:
        permissionResult.allowed && canReadUsersAndGroups
          ? 'Edit'
          : 'Unauthorized to edit',
      isFreeAction: true,
      onClick: () => {},
    },
  ];

  return (
    <Box>
      {error?.name && error.name !== 404 && (
        <Box style={{ paddingBottom: '16px' }}>
          <WarningPanel
            message={error?.message}
            title="Something went wrong while fetching the permission policies"
            severity="error"
          />
        </Box>
      )}
      <Table
        title={
          !loading && data.length > 0
            ? `Permission Policies (${numberOfPolicies})`
            : 'Permission Policies'
        }
        actions={actions}
        options={{ padding: 'default', search: true, paging: true }}
        data={data}
        columns={columns}
        isLoading={loading}
        emptyContent={
          <Box
            data-testid="permission-table-empty"
            sx={{ display: 'flex', justifyContent: 'center', p: 2 }}
          >
            No records found
          </Box>
        }
        onSearchChange={setSearchText}
      />
    </Box>
  );
};
