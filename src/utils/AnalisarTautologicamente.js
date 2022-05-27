export default function (formula) {
  let validSoloLiterals = "∧v→↔()";
  let validLetters = "ABCDEGHIJKLMNOPQRSTUWXYZ";
  let formulaLimpa = formula.replaceAll(" ", "").trim();
  let partes = [];

  for (let i = 0; i < formulaLimpa.length; i++) {
    //dividir a formula
    let a = formulaLimpa.charAt(i);
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

  let arvore = new BinarySearchTree(partes);
  arvore.Tableaux();

  console.log("É Tautologicamente valido");
  return true;
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
      console.log("rodando tableaux");
      //pegue o proximo que não foi simplificado e simplifique ele
      let cur = this.proxNaoSimplificado();

      // for (let i = 0; i < cur.length; i++) {}
      cur.left = "A";
      cur.right = "B";

      console.log(cur);
    }
    //tudo esta simplificado, o tableaux esta completo
  }

  eAbsoluta(cur) {
    if (!eLiteral(cur) || !cur.contais("final")) return false;
    return true;
  }

  folhasSimplificadas() {
    //OBJETIVO:
    //Retornar falso se encontrar algum valor que não é um literal e que seus filhos são nulos
    //Retornar verdadeiro se tudo estiver simplificado
    let pilha = [];
    pilha.push(this.root);
    console.log("cur root = ");
    console.log(this.root);
    while (pilha.length >= 1) {
      let cur = pilha.pop();
      if (cur.right === null && cur.left === null) {
        console.log("encontrou uma folha: " + cur.data);
        //aqui tem filhos nulos então tem que ser um literal
        if (!eLiteral(cur.data)) {
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

function eLiteral(a) {
  // let validos = "∼A∼B∼C∼D∼E∼G∼H∼I∼J∼K∼L∼M∼N∼O∼P∼Q∼R∼S∼T∼U∼W∼X∼Y∼Z";
  if (typeof a == "string") {
    return true;
  }
  return false;
}
