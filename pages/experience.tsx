import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ExperienceRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/content#experience');
  }, [router]);
  return null;
}
