import { ContactType } from '../../enums/contact-type.enum';

export interface Contact {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  department: string;
  type: ContactType;
}
