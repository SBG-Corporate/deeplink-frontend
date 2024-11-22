import { AllAlias, IProfilePictures } from "/app/interfaces";

export const parseAllAliasAndProfilePictures = (allAliasApi: any) => {

  let allAlias: AllAlias = {};
  let allProfilePictures: IProfilePictures = {};

  allAlias = Object.entries(allAliasApi).reduce((acc, [alias, data]) => {
    return Object.assign(acc, { [(data as any)._id]: alias });
  }, {});
  allProfilePictures = Object.entries(allAliasApi).reduce((acc, [alias, data]) => {
    return Object.assign(acc, { [(data as any)._id]: (data as any).fotoPerfil });
  }, {});

  return { allAlias, allProfilePictures }
};
