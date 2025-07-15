export const capitalize = (text: string) => {
  const words = text.split("")
  words[0] = words[0].toUpperCase() 
  return words.join("")
}

export const decodeHtml = (text: string): string => {
  const txt = document.createElement("textarea");
  txt.innerHTML = text;
  return txt.value;
}