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

  if (resultado.valid) {
    console.log("É Tautologicamente valido");
  }

  return resultado;
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
      let cur = proximo.data;

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
      console.log(
        "Concluiu a separação de " +
          cur.join("") +
          " que virou (" +
          elementos[0].join("") +
          ") e (" +
          elementos[1].join("") +
          ") do tipo de operação " +
          operacao +
          (TudoNegativo ? " e negativo" : "")
      );

      //Regras tipo A:
      //A∧B => A,B
      if (operacao == "∧" && !TudoNegativo) {
        let novoNode = [...elementos[0], ",", ...elementos[1]];
        proximo.left = new Node(novoNode);
      }
      //∼(AvB) => ∼A,∼B
      if (operacao == "v" && TudoNegativo) {
        let novoNode = ["∼", ...elementos[0], ",", "∼", ...elementos[1]];
        proximo.left = new Node(novoNode);
      }
      //∼(A→B) => A,∼B
      if (operacao == "→" && TudoNegativo) {
        let novoNode = [...elementos[0], ",", "∼", ...elementos[1]];
        proximo.left = new Node(novoNode);
      }
      ///Regras tipo B:
      //"∧v→↔()"
      //AvB => A && B
      if (operacao == "v" && !TudoNegativo) {
        proximo.left = new Node(elementos[0]);
        proximo.right = new Node(elementos[1]);
      }
      //A→B => ∼A && B
      if (operacao == "→" && !TudoNegativo) {
        proximo.left = new Node(["∼", ...elementos[0]]);
        proximo.right = new Node(elementos[1]);
      }
      //∼(A∧B) => ∼A && ∼B
      if (operacao == "∧" && TudoNegativo) {
        proximo.left = new Node(["∼", ...elementos[0]]);
        proximo.right = new Node(["∼", ...elementos[1]]);
      }
      //∼(A↔B) => ∼A∧B && A∧∼B
      if (operacao == "↔" && TudoNegativo) {
        proximo.left = new Node(["∼", ...elementos[0], "∧", ...elementos[1]]);
        proximo.right = new Node([...elementos[0], "∧", "∼", ...elementos[1]]);
      }
      //A↔B => A∧B && ∼A∧∼B
      if (operacao == "↔" && !TudoNegativo) {
        proximo.left = new Node([...elementos[0], "∧", ...elementos[1]]);
        proximo.right = new Node([
          "∼",
          ...elementos[0],
          "∧",
          "∼",
          ...elementos[1],
        ]);
      }
    }
    //tudo esta simplificado, o tableaux esta completo
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
          console.log(
            "encontrou uma formula não simplificada: " + cur.data.join("")
          );
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

      if (cur.right === null && cur.left === null) {
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
  return false;
}
