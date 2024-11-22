import { IApiGetGroup, IGetGroup } from "/app/interfaces/Groups";

export const parseGroupsData = ({ allGroups }: { allGroups: IApiGetGroup[] }) => {
  const allGroupsParsed = allGroups.map((group: IApiGetGroup) => {
    const parsedGroup: IGetGroup = {
      _id: group._id,
      name: group.nombre,
      creator: group.creador,
      created: group.created,
      active: group.activo,
    }
    return parsedGroup
  })
  return allGroupsParsed
}