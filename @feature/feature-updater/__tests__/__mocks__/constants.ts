import { gTime } from './gTime'

export const VERSIONS = {
  created: gTime(1000),
  modified: gTime(2001),
  '1.0.0': gTime(1000),
  '1.0.1-alpha.1': gTime(1010),
  '1.0.1': gTime(1011),
  '1.1.0-alpha.1': gTime(1010),
  '1.1.0': gTime(1101),
  '1.1.1-alpha.1': gTime(1110),
  '1.1.1': gTime(1111),
  '1.2.0-alpha.1': gTime(1200),
  '1.2.0': gTime(1201),
  '2.0.0-alpha.1': gTime(2000),
  '2.0.0': gTime(2001),
}
