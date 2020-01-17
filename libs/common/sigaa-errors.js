/**
 * @enum {String} SigaaErrors
 * @description All errors have the same value as the name
 * @readonly
 */
const SigaaErrors = {
  SIGAA_USERTYPE_IS_NOT_A_VALID_VALUE: 'SIGAA_USERTYPE_IS_NOT_A_VALID_VALUE',
  SIGAA_DOMAIN_IS_NOT_A_STRING: 'SIGAA_DOMAIN_IS_NOT_A_STRING',
  SIGAA_TOKEN_IS_NOT_A_STRING: 'SIGAA_TOKEN_IS_NOT_A_STRING',
  SIGAA_FORM_LOGIN_ACTION_IS_NOT_A_STRING:
    'SIGAA_FORM_LOGIN_ACTION_IS_NOT_A_STRING',
  SIGAA_FORM_LOGIN_POST_VALUES_IS_NOT_A_OBJECT:
    'SIGAA_FORM_LOGIN_POST_VALUES_IS_NOT_A_OBJECT',
  SIGAA_INVALID_JSON_OBJECT: 'SIGAA_INVALID_JSON_OBJECT',
  SIGAA_URL_IS_NOT_A_STRING: 'SIGAA_URL_IS_NOT_A_STRING',
  SIGAA_USER_LOGIN_STATUS_IS_NOT_A_BOOLEAN:
    'SIGAA_USER_LOGIN_STATUS_IS_NOT_A_BOOLEAN',
  SIGAA_UNEXPECTED_RESPONSE: 'SIGAA_UNEXPECTED_RESPONSE',
  SIGAA_EXPIRED_PAGE: 'SIGAA_EXPIRED_PAGE',
  SIGAA_SESSION_EXPIRED: 'SIGAA_SESSION_EXPIRED',
  SIGAA_ALREADY_LOGGED_IN: 'SIGAA_ALREADY_LOGGED_IN',
  SIGAA_UNKNOWN_USER_TYPE: 'SIGAA_UNKNOWN_USER_TYPE',
  SIGAA_WRONG_CREDENTIALS: 'SIGAA_WRONG_CREDENTIALS',
  SIGAA_SESSION_IS_NECESSARY: 'SIGAA_SESSION_IS_NECESSARY',
  SIGAA_FILEPATH_NOT_EXISTS: 'SIGAA_FILEPATH_NOT_EXISTS',
  SIGAA_USER_HAS_NO_PICTURE: 'SIGAA_USER_HAS_NO_PICTURE',
  SIGAA_UNAVAILABLE_LOGIN: 'SIGAA_UNAVAILABLE_LOGIN',
  SIGAA_INSUFFICIENT_PASSWORD_COMPLEXITY:
    'SIGAA_INSUFFICIENT_PASSWORD_COMPLEXITY'
}
module.exports = SigaaErrors
