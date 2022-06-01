export default function (formula) {
  // let validSoloLiterals = "∧v→↔()";
  // let validLetters = "ABCDEGHIJKLMNOPQRSTUWXYZ";
  let formulaLimpa = formula.replaceAll(" ", "").trim();
  let partes = [];

  for (let i = 0; i < formulaLimpa.length; i++) {
    // dividir a formula
    let a = formulaLimpa.charAt(i);
    // if (validSoloLiterals.includes(a)) {
    //   if (a == "(") {
    //     if (i != 0 && formulaLimpa.charAt(i - 1) == "∼") {
    //       partes.push(formulaLimpa.charAt(i - 1) + a);
    //     } else {
    //       partes.push(a);
    //     }
    //   } else {
    //     partes.push(a);
    //   }
    // } else if (validLetters.includes(a)) {
    //   if (i != 0 && formulaLimpa.charAt(i - 1) == "∼") {
    //     partes.push(formulaLimpa.charAt(i - 1) + a);
    //   } else {
    //     partes.push(a);
    //   }
    // }
    partes.push(a);
  }

  let arvore = new BinarySearchTree(partes);
  let resultado = arvore.Tableaux();
  if (!resultado.valid) {
    return resultado;
  }

  return arvore.checarSeValida();
}

class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor(data) {
    // root of a binary search tree
    this.root = new Node(data);
  }
  Tableaux() {
    //enquanto as folhas não forem valores absolutos ou conterem um unico valor absoluto à esquerda
    while (!this.folhasSimplificadas()) {
      //pegue o proximo que não foi simplificado e simplifique ele
      let proximo = this.proxNaoSimplificado();
      let left = [];
      let right = [];
      let testes = [];
      //checar se tem virgula, se tiver fazer pra um e depois pro outro TODO
      if (proximo.data.join("").includes(",")) {
        //separar pelas virgulas
        let temp = proximo.data.join("").split(",");
        for (let x = 0; x < temp.length; x++) {
          let curCase = temp[x].split("");
          console.log(curCase);
          if (eLiteral(curCase.join(""))) {
            testes = [curCase].concat(testes);
          } else {
            testes.push(curCase);
          }
        }
      } else {
        testes.push(proximo.data);
      }
      // (P∧(∼Qv∼P))vC erro C
      // (P∧(∼Qv∼P))v(C∧(A→C)) erro C e C
      let maybeRight = [];
      let maybeLeft = [];
      let hasFinished = false;

      console.log("INICIANDO OPERAÇÃO - " + proximo.data.join(""));
      for (let t = 0; t < testes.length; t++) {
        let cur = testes[t];
        if (!eLiteral(cur.join(""))) {
          console.log(hasFinished);
          if (hasFinished) {
            if (maybeLeft.length > 0) maybeLeft.push(",");
            maybeLeft = maybeLeft.concat(cur);
            if (maybeRight.length > 0) maybeRight.push(",");
            maybeRight = maybeRight.concat(cur);
            continue;
          }
          console.log(hasFinished);
          hasFinished = true;
          //see tiver -- já subistitui logo
          for (let i = 0; i < cur.length; i++) {
            if (cur[i] == "∼" && cur[i + 1] == "∼") cur.splice(i, 2);
          }
          //identificar os elementos principais da operação
          //dividir eles em 2 lados, alem de descobrir qual a operação
          let TudoNegativo = false;
          let finalChecagem = cur.length;
          let elementos = [];
          let operacao = "";
          for (let i = 0; i < finalChecagem; i++) {
            //∼
            if (cur[i] == "∼") {
              //∼L
              if (eLetraValida(cur[i + 1])) {
                elementos.push([cur[i], cur[i + 1]]);
                i++;
                //∼(...);
              } else if (
                cur[i + 1] == "(" &&
                parentesisAteFinal(cur, i + 2) &&
                elementos.length <= 0
              ) {
                i++;
                finalChecagem--;
                TudoNegativo = true;
                //...∼(...)...;
              } else {
                let elemento = pegarElemento(cur, i);
                elementos.push(elemento);
                i += elemento.length - 1;
              }
              //(
            } else if (cur[i] == "(") {
              //(...)
              if (parentesisAteFinal(cur, i + 1) && elementos.length <= 0) {
                //remove os 2
                finalChecagem--;
              } else {
                let elemento = pegarElemento(cur, i);
                elementos.push(elemento);
                i += elemento.length - 1;
              }
              //L
            } else if (eLetraValida(cur[i])) {
              elementos.push([cur[i]]);
            } else {
              if (operacao != "")
                return {
                  valid: false,
                  msg: "Tem duas operações no mesmo escopo! tente colocar mais parentesis!",
                };
              operacao = cur[i];
            }
          }
          // console.log(
          //   "Concluiu a separação de " +
          //     cur.join("") +
          //     " que virou (" +
          //     elementos[0].join("") +
          //     ") e (" +
          //     elementos[1].join("") +
          //     ") do tipo de operação " +
          //     operacao +
          //     (TudoNegativo ? " e negativo" : "")
          // );

          //Regras tipo A:
          //A∧B => A,B
          if (operacao == "∧" && !TudoNegativo) {
            if (left.length > 0) left.push(",");
            left = left.concat([...elementos[0], ",", ...elementos[1]]);
          }
          //∼(AvB) => ∼A,∼B
          if (operacao == "v" && TudoNegativo) {
            if (left.length > 0) left.push(",");
            left = left.concat([
              "∼",
              ...elementos[0],
              ",",
              "∼",
              ...elementos[1],
            ]);
          }
          //∼(A→B) => A,∼B
          if (operacao == "→" && TudoNegativo) {
            if (left.length > 0) left.push(",");
            left = left.concat([...elementos[0], ",", "∼", ...elementos[1]]);
          }
          ///Regras tipo B:
          //"∧v→↔()"
          //AvB => A && B
          if (operacao == "v" && !TudoNegativo) {
            if (maybeLeft.length > 0 && left.length <= 0) {
              left = maybeLeft;
              maybeLeft = [];
            }
            if (
              !arrIncluiArr(left, elementos[0]) &&
              !arrIncluiArr(left, elementos[1])
            ) {
              if (left.length > 0) left.push(",");
              if (right.length > 0) right.push(",");
              left = left.concat(elementos[0]);
              right = right.concat(elementos[1]);
            }
          }
          //A→B => ∼A && B
          if (operacao == "→" && !TudoNegativo) {
            if (maybeLeft.length > 0 && left.length <= 0) {
              left = maybeLeft;
              maybeLeft = [];
            }
            if (
              !arrIncluiArr(left, elementos[0]) &&
              !arrIncluiArr(left, elementos[1])
            ) {
              if (left.length > 0) left.push(",");
              if (right.length > 0) right.push(",");
              left = left.concat(["∼", ...elementos[0]]);
              right = right.concat(elementos[1]);
              //se eu tenho A
            } else if (arrIncluiArr(left, elementos[0])) {
              //Só tenho que ter o B
              console.log("chegou porra");
              console.log(left);
              if (left.length > 0) left.push(",");
              left = left.concat(elementos[1]);
              console.log(left);
            }
          }
          //∼(A∧B) => ∼A && ∼B
          if (operacao == "∧" && TudoNegativo) {
            if (left.length > 0) left.push(",");
            if (right.length > 0) right.push(",");
            left = left.concat(["∼", ...elementos[0]]);
            right = right.concat(["∼", ...elementos[1]]);
          }
          //∼(A↔B) => ∼A∧B && A∧∼B
          if (operacao == "↔" && TudoNegativo) {
            if (left.length > 0) left.push(",");
            if (right.length > 0) right.push(",");
            left = left.concat(["∼", ...elementos[0], "∧", ...elementos[1]]);
            right = right.concat([...elementos[0], "∧", "∼", ...elementos[1]]);
          }
          //A↔B => A∧B && ∼A∧∼B
          if (operacao == "↔" && !TudoNegativo) {
            if (left.length > 0) left.push(",");
            if (right.length > 0) right.push(",");
            left = left.concat([...elementos[0], "∧", ...elementos[1]]);
            right = right.concat([
              "∼",
              ...elementos[0],
              "∧",
              "∼",
              ...elementos[1],
            ]);
          }
        } else {
          if (left.length > 0) {
            left.push(",");
            left = left.concat(cur);
          } else {
            if (maybeLeft.length > 0) maybeLeft.push(",");
            maybeLeft = maybeLeft.concat(cur);
          }
          if (right.length > 0) {
            right.push(",");
            right = right.concat(cur);
          } else {
            if (maybeRight.length > 0) maybeRight.push(",");
            maybeRight = maybeRight.concat(cur);
          }
        }
      }
      if (right.length > 0 && maybeRight.length > 0) {
        right.push(",");
        right = right.concat(maybeRight);
      }
      if (left.length > 0 && maybeLeft.length > 0) {
        left.push(",");
        left = left.concat(maybeLeft);
      }
      if (left.length > 0) {
        console.log(
          "OPERAÇÃO TERMINADA - ESQUERDO: " +
            left.join("") +
            " - DIREITO: " +
            right.join("") +
            " -"
        );
      }
      if (left.length > 0) proximo.left = new Node(left);
      if (right.length > 0) proximo.right = new Node(right);
    }
    //tudo esta simplificado, o tableaux esta completo
    return {
      valid: true,
    };
  }

  checarSeValida() {
    let pilha = [];
    pilha.push(this.root);
    while (pilha.length >= 1) {
      let cur = pilha.pop();
      if (cur.right === null && cur.left === null) {
        //aqui tem filhos nulos então tem que ser um literal
        if (eString(cur.data)) {
          let valores = cur.data.join("").split(",");
          let negativos = [];
          let positivos = [];
          valores.forEach((val) => {
            if (val.length === 1) {
              positivos.push(val);
            } else {
              negativos.push(val.split("")[1]);
            }
          });
          let motivo = "";
          positivos.forEach((positivo) => {
            negativos.forEach((negativo) => {
              if (positivo === negativo) {
                motivo = positivo;
              }
            });
          });
          if (motivo != "") {
            return {
              valid: false,
              msg: `Não é valido pois ao final do Tableaux, foram encontradas 2 folhas que se contradizem no valor ${motivo}`,
            };
          }
        }
      }

      if (cur.left) {
        pilha.push(cur.left);
      }
      if (cur.right) {
        pilha.push(cur.right);
      }
    }
    console.log("É Tautologicamente valido");
    return {
      valid: true,
    };
  }

  folhasSimplificadas() {
    //OBJETIVO:
    //Retornar falso se encontrar algum valor que não é um literal e que seus filhos são nulos
    //Retornar verdadeiro se tudo estiver simplificado
    let pilha = [];
    pilha.push(this.root);
    while (pilha.length >= 1) {
      let cur = pilha.pop();
      if (cur.right === null && cur.left === null) {
        //aqui tem filhos nulos então tem que ser um literal
        if (!eString(cur.data)) {
          return false;
        }
      }

      if (cur.left) {
        pilha.push(cur.left);
      }
      if (cur.right) {
        pilha.push(cur.right);
      }
    }
    return true;
  }

  proxNaoSimplificado() {
    //OBJETIVO:
    //Retornar o proximo valor que não foi simplificado
    let pilha = [];
    pilha.push(this.root);
    while (pilha.length >= 1) {
      let cur = pilha.pop();

      if (cur.right === null && cur.left === null && !eString(cur.data)) {
        return cur;
      }

      if (cur.left) {
        pilha.push(cur.left);
      }
      if (cur.right) {
        pilha.push(cur.right);
      }
    }
  }
}

function eString(a) {
  // let validos = "∼A∼B∼C∼D∼E∼G∼H∼I∼J∼K∼L∼M∼N∼O∼P∼Q∼R∼S∼T∼U∼W∼X∼Y∼Z";
  //A,A∧B
  if (eLiteral(a)) return true;
  let str = a.join("").split(",");
  for (let i = 0; i < str.length; i++) {
    if (!eLiteral(str[i])) {
      return false;
    }
  }
  return true;
}

function eLetraValida(a) {
  let validos = "ABCDEGHIJKLMNOPQRSTUWXYZ";
  if (validos.includes(a)) {
    return true;
  }
  return false;
}
//checa se dado caso a partir da pos fica aberto até o final da equação
function parentesisAteFinal(a, pos) {
  let abertos = 1;
  for (let y = pos; y < a.length - 1; y++) {
    if (a[y] == "(") {
      abertos++;
    }
    if (a[y] == ")") {
      abertos--;
    }
    if (abertos <= 0) {
      return false;
    }
  }
  return true;
}

//recebe um caso e posição que começa um elemento composto (), retorna o elemento
function pegarElemento(cur, i) {
  let result = [];
  let abertos = 0;
  for (let y = i; y < cur.length; y++) {
    result.push(cur[y]);
    if (cur[y] == "(") abertos++;
    if (cur[y] == ")") abertos--;
    if (abertos === 0 && cur[y] != "∼") return result;
  }
  return result;
}

function eLiteral(a) {
  let validos =
    "∼A ∼B ∼C ∼D ∼E ∼G ∼H ∼I ∼J ∼K ∼L ∼M ∼N ∼O ∼P ∼Q ∼R ∼S ∼T ∼U ∼W ∼X ∼Y ∼Z";
  if (validos.includes(a)) {
    return true;
  }
}

function arrIncluiArr(arr, insideArr) {
  arr = arr.join("").split(",");
  insideArr = insideArr.join("");
  console.log("CHECANDO ARR E ARR INSIDE");
  console.log(arr);
  console.log(insideArr);
  //arr de arrays inclui arr
  for (let i = 0; i <= arr.length; i++) {
    if (arr[i] == insideArr) {
      console.log("foi encontrado");
      return true;
    }
  }
  console.log("nao foi encontrado");
  return false;
}
