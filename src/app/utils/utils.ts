import { RouterPath } from '../../models/enums';

export function getPageLinkPath(page: RouterPath, key: string, value: string): string {
  return `${page}?${key}=${value}`;
}