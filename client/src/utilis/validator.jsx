import { isValidUsername } from "6pp"

export const usernameValidator = (username) => {

    //  if(username.length === 0) return { isvalid: true, errorMessage: '' };

    const isValid = isValidUsername(username);
    return { isvalid: isValid, errorMessage: isValid ? '' : 'Username is Invalid' };
};
