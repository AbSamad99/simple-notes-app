export enum StatusCodes {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorised = 401,
  Forbidden = 403,
  NotFound = 404,
  InternalServerError = 500,
}

export enum ErrorCodes {
  // Common Errors
  E00_01 = "E00_01", // Some error occured.
  E00_02 = "E00_02", // Not found
  E00_03 = "E00_03", // Not authorised
  E00_04 = "E00_04", // Admin permission required

  //   User/Auth Errors
  E01_01 = "E01_01", // Email cannot be empty.
  E01_02 = "E01_02", // Email provided is invalid.
  E01_03 = "E01_03", // Passwords cannot be empty.
  E01_04 = "E01_04", // Passwords length must be between 8 and 20 characters.
  E01_05 = "E01_05", // Passwords must contain at least 1 uppercase letter, 1 lowercase letter, a number and a special character.
  E01_06 = "E01_06", // First Name cannot be empty.
  E01_07 = "E01_07", // Last Name cannot be empty.
  E01_08 = "E01_08", // Email already in use.
  E01_09 = "E01_09", // User email verification pending.
  E01_10 = "E01_10", // Invalid verify email link provided.
  E01_11 = "E01_11", // User access revoked.
  E01_12 = "E01_12", // User does not exist.
  E01_13 = "E01_13", // Invalid credentials provided.
  E01_14 = "E01_14", // Invalid password provided (update user when user itself is updating information).
  E01_15 = "E01_15", // User status cannot be empty.
  E01_16 = "E01_16", // Invalid User status provided.
  E01_17 = "E01_17", // Cannot alter admin user.
  E01_18 = "E01_18", // Invalid user id provided.

  // JWT Refresh Errors
  E02_02 = "E02_02", // Invalid refresh token provided.

  // Email Errors
  E03_01 = "E03_01", // Error occured when sending email

  // Reset Password Errors
  E04_01 = "E04_01", // Invalid email provided (forgot password).
  E04_02 = "E04_02", // Invalid reset password key provided (forgot password).

  // Note Errors
  E05_01 = "E05_01", // Title cannot be empty.
  E05_02 = "E05_02", // Body cannot be empty.
  E05_03 = "E05_03", // Title cannot have more than 30 characters.
  E05_04 = "E05_04", // Body cannot have more than 500 characters.
  E05_05 = "E05_05", // Invalid note id provided.
}

export enum SuccessCodes {
  // User/Auth Success
  S01_01 = "S01_01", // Successfully signed up.
  S01_02 = "S01_02", // Successfully signed in.
  S01_03 = "S01_03", // Successfully retrieved current user.
  S01_04 = "S01_04", // Successfully retrieved all users.
  S01_05 = "S01_05", // Successfully retrieved user by id.
  S01_07 = "S01_07", // Successfully verified user email.
  S01_08 = "S01_08", // Successfully signed out.
  S01_09 = "S01_09", // Successfully created user.
  S01_10 = "S01_10", // Successfully updated user details.
  S01_11 = "S01_11", // Successfully updated user password.
  S01_12 = "S01_12", // Successfully deleted user.
  S01_13 = "S01_13", // Successfully updated user status.

  // Access Token Success
  S02_01 = "S02_01", // Successfully refreshed access token.

  // Reset Password Success
  S04_01 = "S04_01", // Successfully generated forgot password link.
  S04_02 = "S04_02", // Reset password link is valid.
  S04_03 = "S04_03", // Successfully reset password.

  // Note Success
  S05_01 = "S05_01", // Successfully created note.
  S05_02 = "S05_02", // Successfully updated note.
  S05_03 = "S05_03", // Successfully retrieved all notes belonging to a user.
  S05_04 = "S05_04", // Successfully retrieved note by id.
  S05_05 = "S05_05", // Successfully deleted note.
}
