import { FC, ReactNode, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFriendsListInfo, setUser } from '/app/store/slices/user/userSlice';
import { MessagesContext } from '/app/context/messages';
import { getMyUserData } from '/app/utils/api/apiUsuarios';
import { parseUser } from '/app/utils/api/parseApiData';

export const AppFetcher: FC<{ children: ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.persisted?.user);
  const token = useSelector((state: any) => state.persisted?.token);
  const { allAlias, allProfilePictures } = useContext(MessagesContext);

  const getFriendsInfo = async () => {
    if (allAlias === undefined || allAlias === null || allProfilePictures === undefined || allProfilePictures === null) return
    if (Object.keys(allAlias).length === 0 || Object.keys(allProfilePictures).length === 0) return
    const friendsListInfo = Object.keys(allAlias)
      .filter(_id => user.friendsIds.includes(_id))
      .map(_id => ({
        _id,
        alias: allAlias[_id],
        profilePicture: allProfilePictures[_id]
      }));
    dispatch(setFriendsListInfo(friendsListInfo));
  };

  useEffect(() => {
    if (user === null) return
    if (user._id === undefined) return
    if (allAlias === null) return

    getFriendsInfo();
  }, [allAlias, user, allProfilePictures]);




  useEffect(() => {
    if (user === null) return
    if (user.estado === 0) return
    if (token === null) return
    const getUserData = async () => {
      const { status, data } = await getMyUserData({ token })
      if (status === 200) {
        const parsedUser = parseUser(data)
        dispatch(setUser({ user: parsedUser }));
        return;
      }
    };

    getUserData()
  }, []);

  return <>{children}</>;
};

export default AppFetcher;
