import { grantPermissionToRole, grantPermissionToUser } from 'api';
import { ResourceActionsDto } from 'api/modules/authorization/dto/resource-permission.dto';
import { ResourceDto } from 'api/modules/authorization/dto/resource.dto';
import { RoleDto } from 'api/modules/authorization/dto/role.dto';
import { UserDto } from 'api/modules/users/dto/user.dto';
import { push } from 'connected-react-router';
import { GENERIC_ERROR } from 'messages';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import ActionButton from 'shared/components/ActionButton';
import PanelContainer from 'shared/components/Container/PanelContainer';
import { Divider } from 'shared/components/Divider';
import { Flex } from 'shared/components/Flex';
import { Label } from 'shared/components/Label';
import { Select } from 'shared/components/Select';
import { Stack } from 'shared/components/Stack';
import { Tile } from 'shared/components/Tile';
import { Route } from 'shared/UrlRoute';
import { Status } from 'util/status';
import SelectResource from '../../../shared/components/SelectResource';
import SelectRole from '../../../shared/components/SelectRole';
import SelectUser from '../../../shared/components/SelectUser';
import { createEmptyActionsSet, mergeChanges } from '../util';
import * as Styled from './styled';

type AssigneeType = 'User' | 'Role';
const assigneeOptions: AssigneeType[] = ['User', 'Role'];

const CreatePermission = () => {
  const dispatch = useDispatch();

  const [status, setStatus] = useState(Status.Idle);
  const [resource, setResource] = useState<ResourceDto>();
  const [assigneeType, setAssigneeType] = useState<AssigneeType>('User');
  const [userId, setUserId] = useState<string>();
  const [roleId, setRoleId] = useState<string>();
  const [actions, setActions] = useState(createEmptyActionsSet());

  const assigneeTypeIsUser = assigneeType === 'User';
  const assigneeTypeIsRole = assigneeType === 'Role';

  const hasValidUserFormData = assigneeTypeIsUser && !!userId && !!resource;
  const hasValidRoleFormData = assigneeTypeIsRole && !!roleId && !!resource;
  const formValid = hasValidUserFormData || hasValidRoleFormData;

  const handleAssigneeTypeChange = (assigneeType: AssigneeType) => {
    setAssigneeType(assigneeType);
  };

  const handleResourceChange = (resource: ResourceDto) => {
    setResource(resource);
  };

  const handleUserChange = (user: UserDto) => {
    setUserId(user.id);
  };

  const handleRoleChange = (role: RoleDto) => {
    setRoleId(role.id);
  };

  const handleActionValueChange = (
    actionsChange: Partial<ResourceActionsDto>,
  ) => {
    setActions(mergeChanges(actions, actionsChange));
  };

  const handleCreate = async () => {
    if (!formValid) return;

    setStatus(Status.Loading);
    try {
      if (hasValidUserFormData) {
        await grantPermissionToUser(userId!, resource!.id, actions);
      } else if (hasValidRoleFormData) {
        await grantPermissionToRole(roleId!, resource!.id, actions);
      }

      dispatch(push(Route.Dashboard.Permissions));
    } catch {
      setStatus(Status.Rejected);
    }
  };

  return (
    <PanelContainer>
      <Styled.Card
        content={
          <>
            <Stack gap={true} gapSize={3} alignItems='flex-start'>
              <Stack gap={true}>
                <Label>Resource</Label>
                <SelectResource onChange={handleResourceChange} />
              </Stack>
              <Stack gap={true}>
                <Label>Assignee type</Label>
                <Select
                  name='type'
                  onChange={e =>
                    handleAssigneeTypeChange(e.target.value as AssigneeType)
                  }
                >
                  {assigneeOptions.map(ao => (
                    <option value={ao} key={ao}>
                      {ao}
                    </option>
                  ))}
                </Select>
              </Stack>
              <Stack gap={true}>
                <Label>Assignee</Label>
                {assigneeTypeIsUser && (
                  <SelectUser onChange={handleUserChange} />
                )}
                {assigneeTypeIsRole && (
                  <SelectRole onChange={handleRoleChange} />
                )}
              </Stack>
              <Styled.CrudTable
                actions={actions}
                onChange={actionsChange =>
                  handleActionValueChange(actionsChange)
                }
              />
            </Stack>
            {status === Status.Rejected && (
              <Tile color='danger'>{GENERIC_ERROR}</Tile>
            )}
          </>
        }
        footer={
          <Flex gap={true}>
            <Divider />
            <ActionButton
              disabled={!formValid}
              onClick={handleCreate}
              isLoading={status === Status.Loading}
            >
              Save
            </ActionButton>
          </Flex>
        }
      />
    </PanelContainer>
  );
};

export default CreatePermission;
