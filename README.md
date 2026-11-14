# Marcia Hendler Bolos Finos

Aplicação web para precificar bolos sob encomenda e acompanhar os custos de produção do ateliê.

## Funcionalidades

- **Encomendas:** cliente, data de entrega, massa, até três recheios, adicional e peso. O preço é calculado na hora, comparado com o valor do cardápio, e o sistema mostra o ganho com o valor combinado.
- **Modelos de bolo:** combinações frequentes que servem de ponto de partida para uma encomenda.
- **Receitas:** massas, recheios e adicionais reaproveitáveis, com custo total, custo por kg e escala de rendimento.
- **Insumos:** categorias personalizáveis, histórico de compras e gráfico de preço pago comparado ao custo médio.
- **Método de custo:** preço da última compra (reposição) ou custo médio.
- **Custos opcionais:** gás e energia por tempo de forno e custos fixos rateados por mês.
- **Estoque:** baixa ao produzir um bolo, sem bloquear a produção.
- **A receber:** saldo de cada encomenda, aviso após 7 dias sem pagamento e lembrete pelo WhatsApp.
- **Ficha técnica:** ingredientes e custos do bolo, exportável em PDF.
- **Backup:** exporta e restaura todos os dados em um arquivo JSON.

## Como funciona

Site estático (HTML, CSS e JavaScript, sem dependências), publicado no GitHub Pages. Os dados ficam salvos no navegador do aparelho (`localStorage`, chave `mh-bolos-v2`). Por isso, o backup periódico é recomendado.

Pode ser instalado na tela inicial do celular pelo menu do navegador ("Adicionar à tela inicial").

## Arquivos

| Arquivo | Conteúdo |
|---|---|
| `index.html` | Estrutura da página e ícones SVG |
| `style.css` | Estilos e temas claro e escuro |
| `app.js` | Dados, cálculos e telas |
| `manifest.webmanifest`, `icon*` | Instalação na tela inicial |

## Licença

MIT. Veja [LICENSE](LICENSE).
