import Version from "./version.json";

export const Config = {
  baseUrl: window.location.origin.replace("digitalicebreakers.com", "ibk.rs"),
  version: Version.simpleVersion,
};
