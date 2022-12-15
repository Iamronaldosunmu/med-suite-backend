const environmentVariablesList = [
  "MONGO_URI",
  "JWT_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

export default () => {
  for (let variable of environmentVariablesList) {
    if (!process.env[variable]) {
      throw new Error(`FATAL ERROR: ${variable} is not defined`);
    }
  }
};
