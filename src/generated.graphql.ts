import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `BigInt` scalar type represents non-fractional signed whole numeric values. */
  BigInt: any;
  /** The `Byte` scalar type represents byte value as a Buffer */
  Byte: any;
  /** A field whose value is a Currency: https://en.wikipedia.org/wiki/ISO_4217. */
  Currency: any;
  /** Date custom scalar type */
  Date: any;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
  /**
   *
   *     A string representing a duration conforming to the ISO8601 standard,
   *     such as: P1W1DT13H23M34S
   *     P is the duration designator (for period) placed at the start of the duration representation.
   *     Y is the year designator that follows the value for the number of years.
   *     M is the month designator that follows the value for the number of months.
   *     W is the week designator that follows the value for the number of weeks.
   *     D is the day designator that follows the value for the number of days.
   *     T is the time designator that precedes the time components of the representation.
   *     H is the hour designator that follows the value for the number of hours.
   *     M is the minute designator that follows the value for the number of minutes.
   *     S is the second designator that follows the value for the number of seconds.
   *
   *     Note the time designator, T, that precedes the time value.
   *
   *     Matches moment.js, Luxon and DateFns implementations
   *     ,/. is valid for decimal places and +/- is a valid prefix
   *
   */
  Duration: any;
  /** A field whose value conforms to the standard internet email address format as specified in RFC822: https://www.w3.org/Protocols/rfc822/. */
  EmailAddress: any;
  /** A field whose value is a generic Universally Unique Identifier: https://en.wikipedia.org/wiki/Universally_unique_identifier. */
  GUID: any;
  /** A field whose value is a CSS HSL color: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#hsl()_and_hsla(). */
  HSL: any;
  /** A field whose value is a CSS HSLA color: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#hsl()_and_hsla(). */
  HSLA: any;
  /** A field whose value is a hex color code: https://en.wikipedia.org/wiki/Web_colors. */
  HexColorCode: any;
  /** A field whose value is a hexadecimal: https://en.wikipedia.org/wiki/Hexadecimal. */
  Hexadecimal: any;
  /** A field whose value is an International Bank Account Number (IBAN): https://en.wikipedia.org/wiki/International_Bank_Account_Number. */
  IBAN: any;
  /** A field whose value is a IPv4 address: https://en.wikipedia.org/wiki/IPv4. */
  IPv4: any;
  /** A field whose value is a IPv6 address: https://en.wikipedia.org/wiki/IPv6. */
  IPv6: any;
  /** A field whose value is a ISBN-10 or ISBN-13 number: https://en.wikipedia.org/wiki/International_Standard_Book_Number. */
  ISBN: any;
  /**
   *
   *     A string representing a duration conforming to the ISO8601 standard,
   *     such as: P1W1DT13H23M34S
   *     P is the duration designator (for period) placed at the start of the duration representation.
   *     Y is the year designator that follows the value for the number of years.
   *     M is the month designator that follows the value for the number of months.
   *     W is the week designator that follows the value for the number of weeks.
   *     D is the day designator that follows the value for the number of days.
   *     T is the time designator that precedes the time components of the representation.
   *     H is the hour designator that follows the value for the number of hours.
   *     M is the minute designator that follows the value for the number of minutes.
   *     S is the second designator that follows the value for the number of seconds.
   *
   *     Note the time designator, T, that precedes the time value.
   *
   *     Matches moment.js, Luxon and DateFns implementations
   *     ,/. is valid for decimal places and +/- is a valid prefix
   *
   */
  ISO8601Duration: any;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: any;
  /** A field whose value is a JSON Web Token (JWT): https://jwt.io/introduction. */
  JWT: any;
  /** A field whose value is a valid decimal degrees latitude number (53.471): https://en.wikipedia.org/wiki/Latitude */
  Latitude: any;
  /** A local date string (i.e., with no associated timezone) in `YYYY-MM-DD` format, e.g. `2020-01-01`. */
  LocalDate: any;
  /** A local time string (i.e., with no associated timezone) in 24-hr `HH:mm[:ss[.SSS]]` format, e.g. `14:25` or `14:25:06` or `14:25:06.123`.  This scalar is very similar to the `LocalTime`, with the only difference being that `LocalEndTime` also allows `24:00` as a valid value to indicate midnight of the following day.  This is useful when using the scalar to represent the exclusive upper bound of a time block. */
  LocalEndTime: any;
  /** A local time string (i.e., with no associated timezone) in 24-hr `HH:mm[:ss[.SSS]]` format, e.g. `14:25` or `14:25:06` or `14:25:06.123`. */
  LocalTime: any;
  /** The `BigInt` scalar type represents non-fractional signed whole numeric values. */
  Long: any;
  /** A field whose value is a valid decimal degrees longitude number (53.471): https://en.wikipedia.org/wiki/Longitude */
  Longitude: any;
  /** A field whose value is a IEEE 802 48-bit MAC address: https://en.wikipedia.org/wiki/MAC_address. */
  MAC: any;
  /** Floats that will have a value less than 0. */
  NegativeFloat: any;
  /** Integers that will have a value less than 0. */
  NegativeInt: any;
  /** A string that cannot be passed as an empty value */
  NonEmptyString: any;
  /** Floats that will have a value of 0 or more. */
  NonNegativeFloat: any;
  /** Integers that will have a value of 0 or more. */
  NonNegativeInt: any;
  /** Floats that will have a value of 0 or less. */
  NonPositiveFloat: any;
  /** Integers that will have a value of 0 or less. */
  NonPositiveInt: any;
  /** A field whose value conforms with the standard mongodb object ID as described here: https://docs.mongodb.com/manual/reference/method/ObjectId/#ObjectId. Example: 5e5677d71bdc2ae76344968c */
  ObjectID: any;
  /** A field whose value conforms to the standard E.164 format as specified in: https://en.wikipedia.org/wiki/E.164. Basically this is +17895551234. */
  PhoneNumber: any;
  /** A field whose value is a valid TCP port within the range of 0 to 65535: https://en.wikipedia.org/wiki/Transmission_Control_Protocol#TCP_ports */
  Port: any;
  /** Floats that will have a value greater than 0. */
  PositiveFloat: any;
  /** Integers that will have a value greater than 0. */
  PositiveInt: any;
  /** A field whose value conforms to the standard postal code formats for United States, United Kingdom, Germany, Canada, France, Italy, Australia, Netherlands, Spain, Denmark, Sweden, Belgium, India, Austria, Portugal, Switzerland or Luxembourg. */
  PostalCode: any;
  /** A field whose value is a CSS RGB color: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#rgb()_and_rgba(). */
  RGB: any;
  /** A field whose value is a CSS RGBA color: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#rgb()_and_rgba(). */
  RGBA: any;
  /** The `SafeInt` scalar type represents non-fractional signed whole numeric values that are considered safe as defined by the ECMAScript specification. */
  SafeInt: any;
  /** A time string at UTC, such as 10:15:30Z, compliant with the `full-time` format outlined in section 5.6 of the RFC 3339profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Time: any;
  /** The javascript `Date` as integer. Type represents date and time as number of milliseconds from start of UNIX epoch. */
  Timestamp: any;
  /** A field whose value conforms to the standard URL format as specified in RFC3986: https://www.ietf.org/rfc/rfc3986.txt. */
  URL: any;
  /** A currency string, such as $21.25 */
  USCurrency: any;
  /** A field whose value is a generic Universally Unique Identifier: https://en.wikipedia.org/wiki/Universally_unique_identifier. */
  UUID: any;
  /** Floats that will have a value of 0 or more. */
  UnsignedFloat: any;
  /** Integers that will have a value of 0 or more. */
  UnsignedInt: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
  /** A field whose value is a UTC Offset: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones */
  UtcOffset: any;
  /** Represents NULL values */
  Void: any;
};

export type BlockchainState = {
  __typename?: 'BlockchainState';
  difficulty: Scalars['Int'];
  space: Scalars['BigInt'];
  sub_slot_iters: Scalars['Int'];
  sync: BlockchainStateSync;
  peak: BlockchainStatePeak;
};

export type BlockchainStatePeak = {
  __typename?: 'BlockchainStatePeak';
  height: Scalars['Int'];
  header_hash: Scalars['String'];
};

export type BlockchainStateSync = {
  __typename?: 'BlockchainStateSync';
  synced: Scalars['Boolean'];
  sync_mode: Scalars['Boolean'];
  sync_progress_height: Scalars['Int'];
  sync_tip_height: Scalars['Int'];
};

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE',
}

export type Constants = {
  __typename?: 'Constants';
  MIN_PLOT_SIZE: Scalars['Int'];
};

export type Harvester = {
  __typename?: 'Harvester';
  id: Scalars['Int'];
  harvester_key: Scalars['ID'];
  harvester_name: Scalars['String'];
  plots: Array<HarvesterPlot>;
  updated_at: Scalars['Date'];
  created_at: Scalars['Date'];
};

export type HarvesterPlot = {
  __typename?: 'HarvesterPlot';
  file_size: Scalars['BigInt'];
  filename: Scalars['String'];
  plot_seed: Scalars['String'];
  plot_public_key: Scalars['String'];
  pool_public_key: Scalars['String'];
  size: Scalars['Int'];
  updated_at: Scalars['Date'];
  created_at: Scalars['Date'];
};

export type InputPlot = {
  file_size: Scalars['BigInt'];
  filename: Scalars['String'];
  plot_seed: Scalars['String'];
  plot_public_key: Scalars['String'];
  pool_public_key: Scalars['String'];
  size: Scalars['Int'];
};

export type InputPlots = {
  harvester_key: Scalars['ID'];
  harvester_name: Scalars['String'];
  plots: Array<InputPlot>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addHarvesterPlots: Array<HarvesterPlot>;
};

export type MutationAddHarvesterPlotsArgs = {
  data: InputPlots;
};

export type NetworkInfo = {
  __typename?: 'NetworkInfo';
  network_name: Scalars['String'];
  network_prefix: Scalars['String'];
  success: Scalars['Boolean'];
  constants: Constants;
  branch_name: Scalars['String'];
  blockchain_state: BlockchainState;
};

/** See pool_config.py */
export type PoolInfo = {
  __typename?: 'PoolInfo';
  pool_url: Scalars['String'];
};

export type PoolState = {
  __typename?: 'PoolState';
  pool_state: Array<PoolInfo>;
  success: Scalars['Boolean'];
};

export type Query = {
  __typename?: 'Query';
  network: NetworkInfo;
  pool: PoolState;
  user: User;
};

export type Subscription = {
  __typename?: 'Subscription';
  onNewBlockchainState: BlockchainState;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  name: Scalars['String'];
  email: Scalars['String'];
  api_key: Scalars['String'];
  plots: Array<UserPlot>;
  harvesters: Array<Harvester>;
};

export type UserPlot = {
  __typename?: 'UserPlot';
  file_size: Scalars['BigInt'];
  plot_seed: Scalars['String'];
  plot_public_key: Scalars['String'];
  size: Scalars['Int'];
  updated_at: Scalars['Date'];
  created_at: Scalars['Date'];
};

export type AddHarvesterPlotsMutationVariables = Exact<{
  data: InputPlots;
}>;

export type AddHarvesterPlotsMutation = { __typename?: 'Mutation' } & {
  addHarvesterPlots: Array<
    { __typename?: 'HarvesterPlot' } & Pick<
      HarvesterPlot,
      'created_at' | 'file_size' | 'filename' | 'plot_public_key' | 'updated_at'
    >
  >;
};

export const AddHarvesterPlotsDocument = gql`
  mutation addHarvesterPlots($data: InputPlots!) {
    addHarvesterPlots(data: $data) {
      created_at
      file_size
      filename
      plot_public_key
      updated_at
    }
  }
`;

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string
) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (action, _operationName) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    addHarvesterPlots(
      variables: AddHarvesterPlotsMutationVariables,
      requestHeaders?: Dom.RequestInit['headers']
    ): Promise<AddHarvesterPlotsMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<AddHarvesterPlotsMutation>(AddHarvesterPlotsDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'addHarvesterPlots'
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
