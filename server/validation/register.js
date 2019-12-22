const Validator = require("validator");
const validText = require("./valid-text");

module.exports = function validateInputs(data) {
  data.username = validText(data.username) ? data.username : "";

  if (Validator.isEmpty(data.username)) {
    return {
      message: "Username is required",
      isValid: false
    };
  }

  if (Validator.isEmpty(data.password)) {
    return {
      message: "Password is required",
      isValid: false
    };
  }

  if (!Validator.isLength(data.password, { min:6, max: undefined })) {
    return {
      message: "Password must at least 6 characters",
      isValid: false 
    };
  }

  return {
    message: "",
    isValid: true
  };
};