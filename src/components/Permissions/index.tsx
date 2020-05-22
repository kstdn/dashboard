import { getPermissions } from 'api';
import {
  ResourceActionsDto,
  ResourcePermissionDto,
} from 'api/modules/authorization/dto/resource-permission.dto';
import { PaginationData } from 'api/modules/shared/dto/Paginated';
import { GENERIC_ERROR } from 'messages';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'shared/components/Button';
import Loader from 'shared/components/Loader';
import { Route } from 'shared/UrlRoute';
import { normalize, Normalized } from 'util/normalize';
import { Status } from 'util/status';
import Permission from './Permission';
import * as Styled from './styled';

type State = {
  permissions: Normalized<ResourcePermissionDto>;
  paginationData: PaginationData | undefined;
  status: Status;
  error: string | undefined;
};

const Permissions = () => {
  const [state, setState] = useState<State>({
    permissions: {},
    paginationData: undefined,
    status: Status.Idle,
    error: undefined,
  });

  const { permissions, paginationData, status, error } = state;

  console.log('RERENDER PERMISSIONS');

  useEffect(() => {
    const load = async () => {
      setState({
        ...state,
        permissions: {},
        paginationData: undefined,
        status: Status.Loading,
        error: undefined,
      });

      try {
        const { items, ...paginationData } = await getPermissions();

        if (items) {
          setState({
            ...state,
            permissions: normalize('id', items),
            paginationData,
            status: Status.Resolved,
          });
        }
      } catch {
        setState({
          ...state,
          status: Status.Rejected,
          error: GENERIC_ERROR,
        });
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdate = async (id: string, changed: ResourceActionsDto) => {
    setState({
      ...state,
      permissions: {
        ...permissions,
        [id]: {
          ...permissions[id],
          ...changed,
        },
      },
    });
  };

  const handleDelete = (id: string) => {
    delete permissions[id];
    setState({
      ...state,
      permissions
    });
  };

  if (status === Status.Idle) return null;
  if (status === Status.Loading) return <Loader />;

  return (
    <Styled.Container>
      <Link to={Route.Dashboard.PermissionsNew}>
        <Button>Create new</Button>
      </Link>
      {Object.entries(permissions).map(([key, p]) => (
        <Permission
          permission={p}
          key={key}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        ></Permission>
      ))}
    </Styled.Container>
  );
};

export default Permissions;