import { darkOrange } from "./Colors";

export default {
  person: {
    type: "material",
    name: "person",
    color: darkOrange,
  },
  email: {
    type: "material",
    name: "email",
    color: darkOrange,
  },
  password: {
    type: "material",
    name: "lock",
    color: darkOrange,
  },
} as const;
