async function buscarCEP() {
    const cep = document.getElementById("cepInput").value.trim();
    const resultadoDiv = document.getElementById("resultado");
  
    // Limpa o resultado anterior
    resultadoDiv.innerHTML = "";
  
    // Validação básica do tamanho do CEP
    if (cep.length !== 8 || isNaN(cep)) {
      resultadoDiv.style.color = "purple";
      resultadoDiv.innerText = "Por favor, digite um CEP válido com 8 dígitos.";
      return;
    }
  
    const url = `https://viacep.com.br/ws/${cep}/json/`;
  
    try {
      const resposta = await fetch(url);
  
      // Verifica erro HTTP (status fora da faixa 200-299)
      if (!resposta.ok) {
        throw new Error("Erro na conexão com o servidor.");
      }
  
      const dados = await resposta.json();
  
      // A API ViaCEP retorna { erro: true } quando o CEP não existe no banco deles
      if (dados.erro) {
        resultadoDiv.style.color = "purple";
        resultadoDiv.innerText = "CEP não encontrado.";
        return;
      }
  
      // Exibe os dados retornados
      resultadoDiv.style.color = "pink";
      resultadoDiv.innerHTML = `
        <p><strong>Logradouro:</strong> ${dados.logradouro}</p>
        <p><strong>Bairro:</strong> ${dados.bairro}</p>
        <p><strong>Cidade:</strong> ${dados.localidade}</p>
        <p><strong>Estado:</strong> ${dados.uf}</p>
      `;
  
    } catch (erro) {
      resultadoDiv.style.color = "purple";
      resultadoDiv.innerText = "Ocorreu um erro ao buscar o CEP. Tente novamente mais tarde.";
    }
  }