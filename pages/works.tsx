import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function WorksRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/content#works');
  }, [router]);
  return null;
}
