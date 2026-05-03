/** Configuration for {@link LocalValidator}. */
export interface ValidatorConfig {
  /**
   * Field names that must not appear anywhere inside a deterministic payload.
   * Defaults to {@link forbiddenDeterministicFields} when omitted.
   */
  forbiddenDeterministicFields?: readonly string[];
}