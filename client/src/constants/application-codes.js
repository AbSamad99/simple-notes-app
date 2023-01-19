export const ApplicationCodes = {
  //   ERROR CODES
  // Common Errors
  E00_01: "Some error occured.",
  E00_02: "Not found.",
  E00_03: "Not authorised.",
  E00_04: "Admin permission required.",
  E00_05: "Please ensure no errors are present in the input fields.",

  //   User/Auth Errors
  E01_01: "Email cannot be empty.",
  E01_02: "Email provided is invalid.",
  E01_03: "Passwords cannot be empty.",
  E01_04: "Passwords length must be between 8 and 20 characters.",
  E01_05:
    "Passwords must contain at least 1 uppercase letter, 1 lowercase letter, a number and a special character.",
  E01_06: "First Name cannot be empty.",
  E01_07: "Last Name cannot be empty.",
  E01_08: "Email already in use.",
  E01_09: "User email verification pending.",
  E01_10: "Invalid verify email link provided.",
  E01_11: "User access revoked.",
  E01_12: "User does not exist.",
  E01_13: "Invalid credentials provided.",
  E01_14: "Invalid password provided.",
  E01_15: "User status cannot be empty.",
  E01_16: "Invalid User status provided.",
  E01_17: "Cannot alter admin user.",
  E01_18: "Invalid user id provided.",
  E01_19: "Passwords do not match.",

  // JWT Refresh Errors
  E02_02: "Invalid refresh token provided.",

  // Email Errors
  E03_01: "Error occured when sending email",

  // Reset Password Errors
  E04_01: "Invalid email provided.",
  E04_02: "Invalid reset password key provided.",

  // Note Errors
  E05_01: "Title cannot be empty.",
  E05_02: "Body cannot be empty.",
  E05_03: "Title cannot have more than 30 characters.",
  E05_04: "Body cannot have more than 500 characters.",
  E05_05: "Invalid note id provided.",

  //   SUCCESS CODES
  // User/Auth Success
  S01_01: "Successfully signed up.",
  S01_02: "Successfully signed in.",
  S01_03: "Successfully retrieved current user.",
  S01_04: "Successfully retrieved all users.",
  S01_05: "Successfully retrieved user by id.",
  S01_07: "Successfully verified user email.",
  S01_08: "Successfully signed out.",
  S01_09: "Successfully created user.",
  S01_10: "Successfully updated user details.",
  S01_11: "Successfully updated user password.",
  S01_12: "Successfully deleted user.",
  S01_13: "Successfully updated user status.",

  // Access Token Success
  S02_01: "Successfully refreshed access token.",

  // Reset Password Success
  S04_01: "Kindly check your email for reset password link.",
  S04_02: "Reset password link is valid.",
  S04_03: "Successfully reset password.",

  // Note Success
  S05_01: "Successfully created note.",
  S05_02: "Successfully updated note.",
  S05_03: "Successfully retrieved all notes belonging to a user.",
  S05_04: "Successfully retrieved note by id.",
  S05_05: "Successfully deleted note",
};
