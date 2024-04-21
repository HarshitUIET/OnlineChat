import validator from "validator";

export const passwordValidator = (password) => {
    if(validator.isStrongPassword(password,{
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    
    }) || password.length === 0){
        return {isValid: true, errorMessage: ''};
    }
    else{
        return {isValid: false, errorMessage: 'Password is Invalid'};
    }
}