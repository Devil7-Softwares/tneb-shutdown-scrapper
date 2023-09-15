/**
 * Interface for holding TNEB circle data
 */
export interface ICircle {
  /**
   * Circle ID from TNEB
   *
   * @example "0402"
   */
  value: string;

  /**
   * Circle name from TNEB
   *
   * @example "CHENNAI - CENTRAL"
   */
  name: string;
}
