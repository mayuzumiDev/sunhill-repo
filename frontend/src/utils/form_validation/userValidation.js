export const validateUsername = (username) => {
  // Length validation
  if (username.length < 6) {
    return "Username must be at least 6 characters long";
  }
  if (username.length > 20) {
    return "Username cannot exceed 20 characters";
  }

  // Format validation
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return "Username can only contain letters, numbers, and underscores";
  }

  return "";
};

// Password validation
export const validatePassword = (password, confirmPassword) => {
  const errors = {};

  if (password || confirmPassword) {
    if (password.length < 8) {
      return { password: "Password must be at least 8 characters long" };
    }
    if (password.length > 30) {
      return { password: "Password cannot exceed 30 characters" };
    }
    if (password !== confirmPassword) {
      return { confirm_password: "Passwords do not match" };
    }
  }

  return errors;
};

export default { validateUsername, validatePassword };
