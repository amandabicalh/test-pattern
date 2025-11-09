import { jest } from '@jest/globals';
import { CheckoutService } from '../../src/services/CheckoutService.js';
import { Pedido } from '../../src/domain/Pedido.js';
import { CarrinhoBuilder } from '../../src/builders/CarrinhoBuilder.js';
import { UserMother } from '../../src/builders/UserMother.js';

//
// ============================================================
// Testes do CheckoutService usando STUBS e MOCKS
// ============================================================
//

describe('CheckoutService - testes usando Stubs e Mocks', () => {
  // ==========================================================
  // TESTE 1 – Cenário de falha no pagamento (Stub)
  // ==========================================================
  describe('quando o pagamento falha', () => {
    it('deve retornar null', async () => {
      // Arrange
      const carrinho = new CarrinhoBuilder().build();

      // Stub: simula falha no pagamento
      const gatewayStub = { cobrar: jest.fn().mockResolvedValue({ success: false }) };

      // Dublês de objetos (não usados, só pra preencher as dependências)
      const pedidoRepoDummy = { salvar: jest.fn() };
      const emailDummy = { enviarEmail: jest.fn() };

      const checkoutService = new CheckoutService(gatewayStub, pedidoRepoDummy, emailDummy);

      // Act
      const pedido = await checkoutService.processarPedido(carrinho, '1111-2222-3333-4444');

      // Assert
      expect(pedido).toBeNull();
    });
  });

  // ==========================================================
  // TESTE 2 – Cenário de sucesso no pagamento (Mock)
  // ==========================================================
  describe('quando o pagamento é bem-sucedido', () => {
    it('deve criar o pedido e enviar e-mail', async () => {
      // Arrange
      const user = UserMother.umUsuarioPremium();
      const carrinho = new CarrinhoBuilder().comUser(user).build();

      // Mock: simula sucesso no pagamento
      const gatewayMock = { cobrar: jest.fn().mockResolvedValue({ success: true }) };

      // Mock para o repositório e e-mail
      const pedidoRepoMock = { 
        salvar: jest.fn().mockImplementation(pedido => {
          pedido.id = 1; // Simula a atribuição de ID pelo banco
          return pedido;
        })
      };
      const emailMock = { enviarEmail: jest.fn() };

      const checkoutService = new CheckoutService(gatewayMock, pedidoRepoMock, emailMock);

      // Act
      const pedido = await checkoutService.processarPedido(carrinho, '1111-2222-3333-4444');

      // Assert
      expect(pedido).toBeInstanceOf(Pedido);
      expect(pedidoRepoMock.salvar).toHaveBeenCalledTimes(1);
      expect(emailMock.enviarEmail).toHaveBeenCalledTimes(1);
    });
  });
});
