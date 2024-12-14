function cfdata(data, formData, level = 0, iKey = "") {
  // debugger;
  for (let key in data) {
    if (data[key] == null) continue;
    let tempKey;
    if (level == 0) tempKey = key;
    else tempKey += `[${iKey}]`;
    if (typeof data[key] == "object") {
      formData = cfdata(data[key], formData, ++level, tempKey);
    } else formData.append(tempKey, data[key]);
  }
  return formData;
}
export function convertToFormData(data) {
  let formData = new FormData();
  return cfdata(data, formData);
}
