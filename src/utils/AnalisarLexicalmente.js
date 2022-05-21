export default function (formula) {
  // no function name
  //se tiver vazio ele já retorna falso
  if (formula == "") {
    return { valid: false, msg: "Formula está vazia" };
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
    return { valid: isValid };
  } else {
    return {
      valid: isValid,
      msg: "É invalido Lexicalmente devido à (" + invalidChar + ")!",
    };
  }
}
