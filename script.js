async function buscarCEP() {
  const cep = document.getElementById("cepInput").value.trim();
  const resultadoDiv = document.getElementById("resultado");

  // Limpa o resultado anterior
  resultadoDiv.innerHTML = "";
  resultadoDiv.classList.remove("show", "mensagem-sucesso", "mensagem-erro", "mensagem-aviso");

  // Validação básica do tamanho do CEP
  if (cep.length !== 8 || isNaN(cep)) {
    resultadoDiv.classList.add("mensagem-aviso", "show");
    resultadoDiv.innerText = "⚠️ Por favor, digite um CEP válido com 8 dígitos.";
    return;
  }

  try {
    // Busca principal via ViaCEP
    const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

    // Verifica erro HTTP (status fora da faixa 200-299)
    if (!resposta.ok) {
      throw new Error("Erro na conexão com o servidor.");
    }

    const dados = await resposta.json();

    // A API ViaCEP retorna { erro: true } quando o CEP não existe no banco deles
    if (dados.erro) {
      resultadoDiv.classList.add("mensagem-erro", "show");
      resultadoDiv.innerText = "❌ CEP não encontrado.";
      return;
    }

    // Busca o DDD da cidade via BrasilAPI
    let ddd = "—";
    try {
      const respostaDdd = await fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`);
      if (respostaDdd.ok) {
        const dadosDdd = await respostaDdd.json();
        ddd = dadosDdd.ddd || "—";
      }
    } catch (e) {
      // Se a BrasilAPI falhar, mostramos "—" para o DDD
    }

    // Exibe os dados retornados com mensagem colorida de sucesso
    resultadoDiv.classList.add("mensagem-sucesso", "show");
    resultadoDiv.innerHTML = `
      <h3>✅ CEP encontrado!</h3>
      <p><strong>Logradouro:</strong> ${dados.logradouro}</p>
      <p><strong>Complemento:</strong> ${dados.complemento || "—"}</p>
      <p><strong>Bairro:</strong> ${dados.bairro}</p>
      <p><strong>Cidade:</strong> ${dados.localidade}</p>
      <p><strong>Estado:</strong> ${dados.uf}</p>
      <p><strong>DDD:</strong> (${ddd})</p>
    `;

  } catch (erro) {
    resultadoDiv.classList.add("mensagem-erro", "show");
    resultadoDiv.innerText = "❌ Ocorreu um erro ao buscar o CEP. Tente novamente mais tarde.";
  }
}