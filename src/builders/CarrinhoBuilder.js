import { Carrinho } from '../../src/domain/Carrinho.js';
import { Item } from '../../src/domain/Item.js';
import { UserMother } from './UserMother.js';


export class CarrinhoBuilder {
constructor() {
// Valores padrão: usuário padrão e 1 item de R$100
this.user = UserMother.umUsuarioPadrao();
this.itens = [new Item('Item Padrão', 100)];
}


comUser(user) {
this.user = user;
return this;
}


comItens(itens) {
// itens: array de objetos { nome, preco } ou instâncias de Item
// Se elementos não forem instâncias de Item, convertemos para Item
this.itens = itens.map(i => (i instanceof Item ? i : new Item(i.nome, i.preco)));
return this;
}


vazio() {
this.itens = [];
return this;
}


build() {
return new Carrinho(this.user, this.itens);
}
}