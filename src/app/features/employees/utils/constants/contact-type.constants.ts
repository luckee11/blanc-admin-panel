import { ContactType } from '../../enums/contact-type.enum';

export const CONTACT_TYPE_LABELS: Record<ContactType, string> = {
  [ContactType.Internal]: 'Внутренний',
  [ContactType.External]: 'Внешний',
  [ContactType.Partner]: 'Партнёр',
};

export const CONTACT_TYPE_BADGE: Record<ContactType, string> = {
  [ContactType.Internal]: 'badge-info',
  [ContactType.External]: 'badge-neutral',
  [ContactType.Partner]: 'badge-warning',
};
