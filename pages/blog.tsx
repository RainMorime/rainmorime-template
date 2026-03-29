import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function BlogRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/content#blog');
  }, [router]);
  return null;
}
