export default function (formula) {
  let parentesisCount = 0;
  let validSoloLiterals = "∧v→↔()";
  let validLetters = "ABCDEGHIJKLMNOPQRSTUWXYZ";
  let validIfSequenced = "∧v→↔";
  let formulaLimpa = formula.replaceAll(" ", "").trim();
  let partes = [];

  for (let i = 0; i < formulaLimpa.length; i++) {
    //checar parentesis
    let a = formulaLimpa.charAt(i);
    if (a == "(") {
      parentesisCount++;
    } else if (a == ")") {
      if (parentesisCount > 0) {
        parentesisCount--;
      } else {
        return {
          valid: false,
          msg: "Tem um parenteses fechando a mais! não é valido sinteticamente!",
        };
      }
    }
    if (validSoloLiterals.includes(a)) {
      if (a == "(") {
        if (i != 0 && formulaLimpa.charAt(i - 1) == "∼") {
          partes.push(formulaLimpa.charAt(i - 1) + a);
        } else {
          partes.push(a);
        }
      } else {
        partes.push(a);
      }
    } else if (validLetters.includes(a)) {
      if (i != 0 && formulaLimpa.charAt(i - 1) == "∼") {
        partes.push(formulaLimpa.charAt(i - 1) + a);
      } else {
        partes.push(a);
      }
    }
  }

  //checar duas letras juntas
  let anterior = false;
  for (let i = 0; i < partes.length; i++) {
    let atual = eLiteral(partes[i]);

    if (atual && anterior) {
      return {
        valid: false,
        msg: "Sintaticamente invalido porque tem 2 literais juntos!",
      };
    }

    anterior = atual;
  }

  //checar se tem equaçoes incompletas
  anterior = false;
  console.log(partes);
  for (let i = 0; i < partes.length; i++) {
    //se a atual for um desses = "∧v→↔"
    if (validIfSequenced.includes(partes[i])) {
      //e o anterior ou o proximo for falso (não é literal nem parenteses)
      if (
        !anterior ||
        i + 1 == partes.length ||
        !eLiteralOuParenteses(partes[i + 1], false)
      ) {
        return {
          valid: false,
          msg:
            "Sinteticamente invalido tem algum " +
            partes[i] +
            " que não tem literais em ambos os lados!",
        };
      }
    }

    anterior = eLiteralOuParenteses(partes[i], true);
  }

  if (parentesisCount > 0) {
    return {
      valid: false,
      msg: "Tem um parenteses abrindo a mais! não é valido sinteticamente!",
    };
  }
  console.log("É Sinteticamente valido");
  return { valid: true };
}

function eLiteral(a) {
  let validos = "∼A∼B∼C∼D∼E∼G∼H∼I∼J∼K∼L∼M∼N∼O∼P∼Q∼R∼S∼T∼U∼W∼X∼Y∼Z";
  if (validos.includes(a)) {
    return true;
  }
  return false;
}

function eLiteralOuParenteses(a, comeco) {
  let validos = "∼A∼B∼C∼D∼E∼G∼H∼I∼J∼K∼L∼M∼N∼O∼P∼Q∼R∼S∼T∼U∼W∼X∼Y∼Z";
  validos += comeco ? ")" : "(";
  if (validos.includes(a)) {
    return true;
  }
  return false;
}
