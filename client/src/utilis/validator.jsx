
const isValidUsername = (username) => {
     if(!username) return false;

     if(/\s/.test(username)) return false;

    if(username.length < 3) return false;

    return true;
}

export const usernameValidator = (username) => {

    //  if(username.length === 0) return { isvalid: true, errorMessage: '' };

    const isValid = isValidUsername(username);
    return { isvalid: isValid, errorMessage: isValid ? '' : 'Username is Invalid' };
};
