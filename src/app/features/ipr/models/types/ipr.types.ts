import { IprStatus } from '../../enums/ipr-status.enum';

export type IprFilterState = {
  search: string;
  status: IprStatus | '';
};
