export interface ISchedule {
  /**
   * The date of outage
   */
  date: Date;

  /**
   * The date and time of outage start
   */
  from: Date;

  /**
   * The date and time of outage end
   */
  to: Date;

  /**
   * The town where outage is happening
   */
  town: string;

  /**
   * The substation where outage is happening
   */
  subStation: string;

  /**
   * The feeder where the type of work is happening
   */
  feeder: string;

  /**
   * Affected locations
   */
  location: string;

  /**
   * The type of work being done
   */
  typeOfWork: string;
}
