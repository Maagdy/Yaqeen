declare module 'moment-hijri' {
  import * as moment from 'moment';

  interface MomentHijri extends moment.Moment {
    iYear(): number;
    iMonth(): number;
    iDate(): number;
    iDay(): number;
    iDayOfYear(): number;
    iWeek(): number;
    iWeekYear(): number;
    format(format: string): string;
  }

  function momentHijri(date?: Date | string | number): MomentHijri;
  function momentHijri(date: string, format: string): MomentHijri;

  export = momentHijri;
}
