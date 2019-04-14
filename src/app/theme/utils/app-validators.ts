import { FormGroup, FormControl } from '@angular/forms';

export function emailValidator(control: FormControl): {[key: string]: any} {
    var emailRegexp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;    
    if (control.value && !emailRegexp.test(control.value)) {
        return {invalidEmail: true};
    }
}

export function matchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
        let password= group.controls[passwordKey];
        let passwordConfirmation= group.controls[passwordConfirmationKey];
        if (password.value !== passwordConfirmation.value) {
            return passwordConfirmation.setErrors({mismatchedPasswords: true})
        }
    }
}

export function phoneValidator(control: FormControl): {[key: string]: any} {
    // var phoneRegexp = /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/    
    var phoneRegexp = /^0[0-9]{10}$/    
    if (control.value && !phoneRegexp.test(control.value)) {
        return {invalidPhone: true};
    }
}

export function selectedAddress(control: FormControl): {[key: string]: any} {
    var phoneRegexp = /^0[0-9]{10}$/    
    if (control.value && !phoneRegexp.test(control.value)) {
        return {invalidPhone: true};
    }
}

// export function validAddress(control: FormControl): {[key: string]: any} {
//     var phoneRegexp = /^0[0-9]{10}$/    
//     if (control.value && !phoneRegexp.test(control.value)) {
//         return {invalidPhone: true};
//     }
// }

