export default function (formula) {
  // no function name
  //se tiver vazio ele já retorna falso
  if (formula == "") {
    console.log("Formula está vazia");
    return false;
  }
  //checa se os caracteres são validos
  let acceptedChars = "ABCDEGHIJKLMNOPQRSTUWXYZ∼∧v→↔()";
  let isValid = true;
  let invalidChar = "";
  for (let a of formula.replaceAll(" ", "").trim()) {
    let cur = false;
    for (let b of acceptedChars) {
      if (a == b) cur = true;
    }
    if (!cur) {
      isValid = false;
      invalidChar = a;
      break;
    }
  }

  if (isValid) {
    console.log("É Lexicalmente valido");
  } else {
    console.log("É invalido Lexicalmentte devido à (" + invalidChar + ")");
  }
  return isValid;
}
