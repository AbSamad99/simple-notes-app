import { app } from "./app";
import mongoose from "mongoose";

// Helpers and Services
import { validateEnvVariables } from "./helpers/validation-helpers";
import { emailService } from "./services/email-service";

const startup = async () => {
  console.log("Running startup method.");
  try {
    validateEnvVariables();
    app.listen(process.env.PORT, () => {
      console.log(`Listening on port ${process.env.PORT}`);
    });
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connection to mongodb successful.`);
    emailService.initialize();
    console.log("Email service successfully initialized.");
  } catch (error) {
    console.error(error);
    console.log(
      "Please ensure all environment variables are declared and have proper values."
    );
    process.exit(1);
  }
};

startup();
