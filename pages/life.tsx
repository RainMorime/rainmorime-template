import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function LifeRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/content#life');
  }, [router]);
  return null;
}
