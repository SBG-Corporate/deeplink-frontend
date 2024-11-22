import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';

export const CheckTokenExpiresLayout = () => {
  const router = useRouter();
  const tokenExpire = useSelector((state: any) => state.persisted.tokenExpire);
  const user = useSelector((state: any) => state.persisted.user);

  useEffect(() => {
    if (user === null) {
      toast.error("Please login to access");
      router.push('/');
    }
    if (tokenExpire === null) return
    if (tokenExpire < Number(new Date())) {
      toast.error("Session timed out, please log in again");
      router.push('/');
    }
  }, [tokenExpire]);

  return (
    <> </>
  )
}
