export class RecurringTransaction {
  id: string = '';
  title: string;
  description: string = null;
  frequency: Frequency;
  start: Date = new Date();
  end?: Date;
  amount: number;
  expense = true;
  categoryId: string;
  budgetId: string;
  createdBy: string;
}

export class Frequency {
  unit: FrequencyUnit;
  count: number;
  time: Time;
  amount?: (void | Set<DayOfWeek> | DayOfMonth | DayOfYear);

  private constructor(unit: FrequencyUnit, count: number, time: Time, amount?: (void | Set<DayOfWeek> | DayOfMonth | DayOfYear) = null) {
    this.unit = unit;
    this.count = count;
    this.time = time;
    this.amount = amount;
  }

  static Daily(count: number, time: Time): Frequency {
    return new Frequency(FrequencyUnit.DAILY, count, time);
  }

  static Weekly(count: number, time: Time, daysOfWeek: Set<DayOfWeek>): Frequency {
    return new Frequency(FrequencyUnit.WEEKLY, count, time, daysOfWeek)
  }

  static Monthly(count: number, time: Time, dayOfMonth: DayOfMonth): Frequency {
    return new Frequency(FrequencyUnit.MONTHLY, count, time, dayOfMonth)
  }

  static Yearly(count: number, time: Time, dayOfYear: DayOfYear): Frequency {
    return new Frequency(FrequencyUnit.YEARLY, count, time, dayOfYear)
  }

  static parse(s: string): Frequency {
    const parts = s.split(';');
    let count: number, time: Time;
    switch (parts[0]) {
      case 'D':
        count = Number.parseInt(parts[1]);
        time = Time.parse(parts[2]);
        return this.Daily(count, time);
      case 'W':
        count = Number.parseInt(parts[1]);
        time = Time.parse(parts[3]);
        const daysOfWeek = new Set(parts[2].split(',').map(day => DayOfWeek[day]));
        return this.Weekly(count, time, daysOfWeek);
      case 'M':
        count = Number.parseInt(parts[1]);
        time = Time.parse(parts[3]);
        const dayOfMonth = DayOfMonth.parse(parts[2]);
        return this.Monthly(count, time, dayOfMonth);
      case 'Y':
        count = Number.parseInt(parts[1]);
        time = Time.parse(parts[3]);
        const dayOfYear = DayOfYear.parse(parts[2]);
        return this.Yearly(count, time, dayOfYear);
      default:
        throw new Error(`Invalid Frequency format: ${s}`);
    }
  }
}

export enum FrequencyUnit {
  DAILY = 'D',
  WEEKLY = 'W',
  MONTHLY = 'M',
  YEARLY = 'Y',
}

export class Time {
  hours: number;
  minutes: number;
  seconds: number;

  constructor(hours: number, minutes: number, seconds: number) {
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
  }

  toString(): string {
    return [
      String(this.hours).padStart(2, '0'),
      String(this.minutes).padStart(2, '0'),
      String(this.seconds).padStart(2, '0'),
    ].join(':')
  }

  static parse(s: string): Time {
    if (!s.match(/[0-9]{2}:[0-9]{2}:[0-9]{2}/) {
      throw new Error('Invalid time format. Time must be formatted as HH:mm:ss');
    }
    const parts = s.split(':').map(part => Number.parseInt(part));
    return new Time(parts[0], parts[1], parts[2]);
  }
}

export enum Position {
  DAY = 'DAY',
  FIRST = 'FIRST',
  SECOND = 'SECOND',
  THIRD = 'THIRD',
  FOURTH = 'FOURTH',
  LAST = 'LAST',
}

export enum DayOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export class DayOfMonth {
  position: Position;
  day: (number | DayOfWeek);

  private constructor(position: Position, day: (number | DayOfWeek)) {
    this.position = position;
    this.day = day;
  }

  static Each(day: number): DayOfMonth {
    if (day < 1 || day > 31) {
      throw new Error('Day must be between 1 and 31');
    }
    return new DayOfMonth(Position.DAY, day);
  }

  static PositionalDayOfWeek(position: Position, day: DayOfWeek): DayOfMonth {
    if (position === Position.DAY) {
      throw new Error('Use DayOfMonth.Each() to create a monthly recurring transaction on the same calendar day');
    }
    return new DayOfMonth(position, day)
  }

  static parse(s: string): DayOfMonth {
    const parts = s.split('-');
    const position = Position[parts[0]];
    if (position === Position.DAY) {
      return DayOfMonth.Each(Number.parseInt(parts[1]));
    } else {
      return DayOfMonth.PositionalDayOfWeek(position, DayOfWeek[parts[1]]);
    }
  }
}

export class DayOfYear {
  month: number;
  day: number;

  constructor(month: number, day: number) {
    this.month = month;
    this.day = day;
  }

  static parse(s: string): DayOfYear {
    if (!s.match(/[0-9]{2}-[0-9]{2}/)) {
      throw new Error(`Invalid format for DayOfYear: ${s}`)
    }
    const parts = s.split('-').map(part => Number.parseInt(part));
    if (parts[0] < 1 || parts[0] > 12) {
      throw new Error(`Invalid month for DayOfYear: ${parts[0]}`);
    }
    let maxDay: number;
    switch (parts[0]) {
      case 2:
        maxDay = 29;
        break;
      case 4:
      case 6:
      case 9:
      case 11:
        maxDay = 30;
        break;
      default:
        maxDay = 31;
    }
    if (parts[1] < 1 || parts[1] > maxDay) {
      throw new Error(`Invalid day for DayOfYear: ${parts[0]}`);
    }
    return new DayOfYear(parts[0], parts[1]);
  }
}