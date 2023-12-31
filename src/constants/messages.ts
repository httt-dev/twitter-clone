export const USERS_MESSAGE = {
  VALIDATION_ERROR: 'Validation error',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  NAME_IS_REQUIRED: 'Name is require',
  NAME_MUST_BE_A_STRING: 'Name must be a string',
  NAME_MUST_BE_FROM_1_TO_100: 'Name must be length from 1 to 100 characters',
  EMAIL_IS_INVALID: 'Email is invalid',
  EMAIL_IS_REQUIRED: 'Email is required',
  EMAIL_OR_PASSWORD_IS_INCORRECT: 'Email or password is incorrect',
  PASSWORD_IS_REQUIRED: 'Password is required',
  PASSWORD_MUST_BE_A_STRING: 'Password must be a string',
  PASSWORD_MUST_BE_FROM_6_TO_50: 'Password must be length from 6 to 50 characters',
  PASSWORD_MUST_MATCH: 'Passwords do not match',
  PASSWORD_MUST_BE_STRONG: 'Password must be strong',
  CONFIRM_PASSWORD_IS_REQUIRED: 'Confirm password is required',
  CONFIRM_PASSWORD_MUST_BE_A_STRING: 'Confirm password must be a string',
  CONFIRM_PASSWORD_MUST_BE_FROM_6_TO_50: 'Confirm password must be length from 6 to 50 characters',
  CONFIRM_PASSWORD_MUST_MATCH: 'Confirm passwords do not match',
  CONFIRM_PASSWORD_MUST_BE_STRONG: 'Confirm password must be strong',
  DATE_OF_BIRTH_MUST_BE_ISO_8601: 'Date of birth must be ISO 8601',
  LOGIN_SUCCESS: 'Login success',
  REGISTER_SUCCESS: 'Register success',
  ACCESS_TOKEN_IS_REQUIRED: 'Access token is required',
  REFRESH_TOKEN_IS_REQUIRED: 'Refresh token is required',
  REFRESH_TOKEN_IS_INVALID: 'Refresh token is invalid',
  USED_REFRESH_TOKEN_OR_NOT_EXIST: 'Used refresh token or not exist',
  LOGOUT_SUCCESS: 'Logout success',
  REFRESH_TOKEN_SUCCESS: 'Refresh token is successful',
  EMAIL_VERIFY_TOKEN_IS_REQUIRED: 'Email verify token is required',
  USER_NOT_FOUND: 'User not found',
  EMAIL_ALREADY_VERIFY_BEFORE: 'Email already verified',
  EMAIL_VERIFY_SUCCESS: 'Email verify successful',
  RESEND_VERIFY_EMAIL_SUCCESS: 'Resend verify email successful',
  CHECK_EMAIL_TO_RESET_PASSWORD: 'Check email to reset password',
  FORGOT_PASSWORD_TOKEN_IS_REQUIRED: 'Forgot password token is required',
  VERIFY_FORGOT_PASSWORD_SUCCESS: 'Verify forgot password token successfully',
  INVALID_FORGOT_PASSWORD_TOKEN: 'Invalid password token',
  RESET_PASSWORD_SUCCESS: 'Reset password successfully',
  GET_ME_SUCCESS: 'Get my profile information successfully'
} as const
