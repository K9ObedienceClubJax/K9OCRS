
/**
 * Takes the files array you get from an html file input and makes it
 * into FormData so it can be sent to the API
 * @param {FormFileCollection} files
 * @returns FormData
 */
export const filesToFormData = files => {
  var formData = new FormData();

  // This is how you would upload multiple files
  for(let i = 0; i < files.length; i++) {
    formData.append('files', files[i], files[i].name);
  }

  return formData;
};
