import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const {
  Link: LocalizedLink,
  usePathname,
  useRouter,
  getPathname,
  redirect,
  permanentRedirect
} = createNavigation(routing);
