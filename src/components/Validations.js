import * as Yup from 'yup';
const emailRegex = /^[^\s@]+@[^\s@]+\.(com)$/;



export const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .matches(
      /^[a-zA-Z\s]+$/,
      "Name should contain only alphabetic characters"
    ),
  email: Yup.string()
    .required("Email is required")
    .matches(emailRegex, "Invalid email format"),
  mobile: Yup.string()
  .required("Mobile is required")
    .matches(/^\d{10}$/, "Mobile should contain 10 digits"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password should contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
    ),
  confirmPassword: Yup.string()
  .required("Confirm Password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

export const LoginSchema = Yup.object().shape({

  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format"),

  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long")
  ,

});
export const forgotPassSchema = Yup.object().shape({

  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format"),



});
export const PasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long"),
  newPassword: Yup.string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password should contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
    ),
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("newPassword")], "Passwords must match"),
});


export const resetPasswordSchema = Yup.object().shape({

  newPassword: Yup.string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password should contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
    ),
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("newPassword")], "Passwords must match"),
});
export const EditProfileSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .matches(
      /^[a-zA-Z\s]+$/,
      "Name should contain only alphabetic characters"
    ),

  mobile: Yup.string()
    .required("Mobile is required")
    .matches(/^\d{10}$/, "Mobile should contain 10 digits"),


});
export const CreatePostSchema = Yup.object().shape({
  title: Yup.string()
    .max(200, "Title must be less than or equal to 200 characters"),


  postImg: Yup.mixed()
    .required("Post image is required")

});
export const EmailSchema = Yup.object().shape({

  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format"),


});

export const modelSchema = Yup.object().shape({
  chatname: Yup.string()
    .required("Enter ChatName"),
 

    users: Yup.string()
    .required("Add users for create group")



});

