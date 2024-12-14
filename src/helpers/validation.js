// Check if the input is alphabet, number , _ ,- and space only
const isValidFormat = (value) => /^[A-Za-z][A-Za-z0-9_ -]*$/.test(value);
// Check if the input is alphabet, number only
const isValidString = (value) => /^[A-Za-z0-9]*$/.test(value);

const isValidStringWithUnderscore = (value) => /^[A-Za-z0-9_]*$/.test(value);

// Check if the input is email
const isValidEmail = (value) =>
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);

// Validate Password
const isValidPassword = (value) =>
  /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9\s]).{8,16}$/.test(value);

//Only Space not accepted
const isNotEmpty = (value) => value.trim() !== "";
//Alphabets only
const onlyAlphabet = (value) => /^[A-Za-z]+$/.test(value);
//Alphabets and Space only
const onlySpaceAlphabet = (value) => /^[A-Za-z][A-Za-z ]*$/.test(value);
//Numbers only
const onlyNumber = (value) => /^[0-9]+$/.test(value);
//Decimal
const onlyDecimal = (value) => /^[0-9]+(\.[0-9]+)?$/.test(value);

// const PhoneNumber = () => /^\+(?:[0-9] ?){6,14}[0-9]$/.test(value) ;

export const validateName = (_, value) => {
  if (value) {
    if (isNotEmpty(value) && isValidFormat(value)) {
      return Promise.resolve();
    } else {
      return Promise.reject(
        new Error(
          "Alphabets, spaces, underscores, and hyphens are allowed. Empty input is not allowed."
        )
      );
    }
  } else {
    return Promise.reject();
  }
};
// export const validatePassword = (_, value) => {
//   // if (value) {
//   //   if (isNotEmpty(value) && isValidPassword(value)) {
//   //     return Promise.resolve();
//   //   } else {
//   //     return Promise.reject(
//   //       new Error(
//   //         "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character (@$!%*?&). Length should be between 8 and 12 characters."
//   //       )
//   //     );
//   //   }
//   // } else {
//   //   return Promise.reject(new Error("Please enter a password"));
//   // }
// };

const hasLowerCase = (value) => /[a-z]/.test(value);
const hasUpperCase = (value) => /[A-Z]/.test(value);
const hasDigit = (value) => /\d/.test(value);
const hasSpecialCharacter = (value) => /[@$!%*?&]/.test(value);

export const validateString = (_, value) => {
  if (value) {
    if (isNotEmpty(value) && isValidString(value)) {
      return Promise.resolve();
    } else {
      return Promise.reject(
        new Error(
          "Alphabets and numbers are allowed. Empty input is not allowed."
        )
      );
    }
  } else {
    return Promise.reject();
  }
};
export const validateStringWithUnderscore = (_, value) => {
  if (value) {
    if (isNotEmpty(value) && isValidStringWithUnderscore(value)) {
      return Promise.resolve();
    } else {
      return Promise.reject(
        new Error(
          "Alphabets , numbers and underscore are allowed. Empty input is not allowed."
        )
      );
    }
  } else {
    return Promise.reject();
  }
};
export const validateEmail = (_, value) => {
  if (value) {
    if (isNotEmpty(value) && isValidEmail(value)) {
      return Promise.resolve();
    } else {
      return Promise.reject(
        new Error("Not in valid email format. Empty input is not allowed.")
      );
    }
  } else {
    return Promise.reject();
  }
};
export const validatePassword = (_, value) => {
  if (value) {
    if (isNotEmpty(value) && isValidPassword(value)) {
      return Promise.resolve();
    } else {
      return Promise.reject(
        new Error(
          "Password must contain at least one uppercase letter, one number, one special character, and be 8-16 characters in length."
        )
      );
    }
  } else {
    return Promise.reject();
  }
};

export const validateAlphabet = (_, value) => {
  if (value) {
    if (isNotEmpty(value) && onlyAlphabet(value)) {
      return Promise.resolve();
    } else {
      return Promise.reject(new Error("Alphabets Only Allowed"));
    }
  } else {
    return Promise.reject();
  }
};

export const validateNumber = (_, value) => {
  if (value) {
    if (isNotEmpty(String(value)) && onlyNumber(value)) {
      return Promise.resolve();
    } else {
      return Promise.reject(new Error("Numbers Only Allowed"));
    }
  } else {
    return Promise.reject();
  }
};
export const validateDecimal = (_, value) => {
  if (value) {
    if (isNotEmpty(String(value)) && onlyDecimal(value)) {
      return Promise.resolve();
    } else {
      return Promise.reject(new Error("Numbers and Decimal Only Allowed"));
    }
  } else {
    return Promise.reject();
  }
};
export const validateSpaceAlphabet = (_, value) => {
  if (value) {
    if (isNotEmpty(value) && onlySpaceAlphabet(value)) {
      return Promise.resolve();
    } else {
      return Promise.reject(new Error("Alphabets and Space Only Allowed"));
    }
  } else {
    return Promise.reject();
  }
};
