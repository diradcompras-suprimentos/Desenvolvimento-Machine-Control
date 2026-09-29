let equipamentos = JSON.parse(localStorage.getItem("equipamentos")) || [];
let detalheIndexAtual = null;

// Salvar ou atualizar equipamento
function salvarEquipamento(event) {
  event.preventDefault();

  const index = document.getElementById("editIndex").value;
  const fileInput = document.getElementById("imagem");
  const file = fileInput.files[0];

  function finalize(imagem) {
    const equipamento = {
      nome: document.getElementById("nome").value,
      marca: document.getElementById("marca").value,
      modelo: document.getElementById("modelo").value,
      serie: document.getElementById("serie").value,
      local: document.getElementById("local").value,
      status: document.getElementById("status").value,
      imagem: imagem,
      dataCadastro: new Date().toLocaleDateString()
    };

    if (index === "") {
      equipamentos.push(equipamento);
    } else {
      equipamento.historico = equipamentos[index].historico || [];
      equipamentos[index] = equipamento;
    }

    localStorage.setItem("equipamentos", JSON.stringify(equipamentos));
    renderizarEquipamentos();
    bootstrap.Modal.getInstance(document.getElementById("formModal")).hide();
    document.getElementById("equipamentoForm").reset();
    document.getElementById("editIndex").value = "";
  }

  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      finalize(e.target.result);
    };
    reader.readAsDataURL(file);
  } else {
    // Ao editar sem selecionar nova imagem, mantém a existente
    const existingImage = index !== "" ? equipamentos[index].imagem : null;
    finalize(existingImage);
  }
}

// Renderizar cards
function renderizarEquipamentos() {
  const grid = document.getElementById("equipamentosGrid");
  grid.innerHTML = "";

  equipamentos.forEach((eq, index) => {
    const card = document.createElement("div");
    card.className = "col-md-4 mb-3";
    card.innerHTML = `
      <div class="card shadow-sm">
        <img src="${eq.imagem || "https://via.placeholder.com/300x180?text=Sem+Imagem"}" class="card-img-top">
        <div class="card-body">
          <h5 class="card-title">${eq.nome}</h5>
          <p class="card-text"><strong>Local:</strong> ${eq.local}</p>
          <p class="card-text"><strong>Status:</strong> ${eq.status}</p>
          <button class="btn btn-sm btn-info" onclick="verDetalhes(${index})" data-bs-toggle="modal" data-bs-target="#detalhesModal">Abrir</button>
          <button class="btn btn-sm btn-warning" onclick="editar(${index})" data-bs-toggle="modal" data-bs-target="#formModal">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="excluir(${index})">Excluir</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Ver detalhes
function verDetalhes(index) {
  detalheIndexAtual = index;
  const eq = equipamentos[index];
  document.getElementById("detalhesConteudo").innerHTML = `
    <div class="row g-3">
      <div class="col-md-4">
        <img src="${eq.imagem || "https://via.placeholder.com/300x180?text=Sem+Imagem"}" class="img-fluid rounded">
      </div>
      <div class="col-md-8">
        <h4 class="fw-bold">${eq.nome}</h4>
        <p class="mb-1"><strong>Marca:</strong> ${eq.marca || "-"}</p>
        <p class="mb-1"><strong>Modelo:</strong> ${eq.modelo || "-"}</p>
        <p class="mb-1"><strong>Nº de Série:</strong> ${eq.serie || "-"}</p>
        <p class="mb-1"><strong>Local:</strong> ${eq.local}</p>
        <p class="mb-1"><strong>Status:</strong> ${eq.status}</p>
        <p class="mb-0"><strong>Data de Cadastro:</strong> ${eq.dataCadastro}</p>
      </div>
    </div>
  `;
  renderizarHistorico(index);
}

// Salvar registro de manutenção
function salvarHistorico(event) {
  event.preventDefault();
  const index = detalheIndexAtual;
  if (index === null) return;

  const registro = {
    pecas: document.getElementById("histPecas").value,
    data: document.getElementById("histData").value,
    empresa: document.getElementById("histEmpresa").value,
    observacao: document.getElementById("histObs").value
  };

  if (!equipamentos[index].historico) {
    equipamentos[index].historico = [];
  }
  equipamentos[index].historico.push(registro);
  localStorage.setItem("equipamentos", JSON.stringify(equipamentos));
  renderizarHistorico(index);
  document.getElementById("historicoForm").reset();
}

// Renderizar histórico de manutenção
function renderizarHistorico(index) {
  const container = document.getElementById("historicoLista");
  const historico = equipamentos[index].historico || [];

  if (historico.length === 0) {
    container.innerHTML = "<p class='text-muted'>Nenhum registro de manutenção cadastrado.</p>";
    return;
  }

  container.innerHTML = historico.map(h => `
    <div class="card mb-2">
      <div class="card-body">
        <div class="d-flex justify-content-between">
          <strong>${h.pecas || "Sem peças especificadas"}</strong>
          <span class="text-muted">${h.data || "-"}</span>
        </div>
        <p class="mb-1"><strong>Empresa:</strong> ${h.empresa || "-"}</p>
        <p class="mb-0 text-muted">${h.observacao || ""}</p>
      </div>
    </div>
  `).join("");
}

// Editar
function editar(index) {
  const eq = equipamentos[index];
  document.getElementById("editIndex").value = index;
  document.getElementById("nome").value = eq.nome;
  document.getElementById("marca").value = eq.marca;
  document.getElementById("modelo").value = eq.modelo;
  document.getElementById("serie").value = eq.serie;
  document.getElementById("local").value = eq.local;
  document.getElementById("status").value = eq.status;
}

// Excluir
function excluir(index) {
  if (confirm("Tem certeza que deseja excluir este equipamento?")) {
    equipamentos.splice(index, 1);
    localStorage.setItem("equipamentos", JSON.stringify(equipamentos));
    renderizarEquipamentos();
  }
}

// Filtrar
function filtrarEquipamentos() {
  const termo = document.getElementById("busca").value.toLowerCase();
  const grid = document.getElementById("equipamentosGrid");
  grid.innerHTML = "";

  equipamentos
    .filter(eq => eq.nome.toLowerCase().includes(termo) || eq.local.toLowerCase().includes(termo))
    .forEach((eq, index) => {
      const card = document.createElement("div");
      card.className = "col-md-4 mb-3";
      card.innerHTML = `
        <div class="card shadow-sm">
          <img src="${eq.imagem || "https://via.placeholder.com/300x180?text=Sem+Imagem"}" class="card-img-top">
          <div class="card-body">
            <h5 class="card-title">${eq.nome}</h5>
            <p class="card-text"><strong>Local:</strong> ${eq.local}</p>
            <p class="card-text"><strong>Status:</strong> ${eq.status}</p>
            <button class="btn btn-sm btn-info" onclick="verDetalhes(${index})" data-bs-toggle="modal" data-bs-target="#detalhesModal">Abrir</button>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
}

// Exportar para Excel (.xls)
function exportarExcel() {
    if (equipamentos.length === 0) {
        alert("Nenhum equipamento cadastrado para exportar.");
        return;
    }

    const dados = equipamentos.map(eq => ({
        Nome: eq.nome,
        Marca: eq.marca || "-",
        Modelo: eq.modelo || "-",
        "Nº Série": eq.serie || "-",
        Local: eq.local,
        Status: eq.status,
        "Data de Cadastro": eq.dataCadastro
    }));

    const ws = XLSX.utils.json_to_sheet(dados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventário");

    XLSX.writeFile(wb, "inventario_equipamentos.xls");
}

// Exportar para PDF
function exportarPDF() {
    if (equipamentos.length === 0) {
        alert("Nenhum equipamento cadastrado para exportar.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text("Inventário de Equipamentos", 14, 15);

    const dados = equipamentos.map(eq => [
        eq.nome,
        eq.marca || "-",
        eq.modelo || "-",
        eq.serie || "-",
        eq.local,
        eq.status,
        eq.dataCadastro
    ]);

    doc.autoTable({
        head: [["Nome", "Marca", "Modelo", "Nº Série", "Local", "Status", "Data"]],
        body: dados,
        startY: 25,
        theme: "grid",
        headStyles: { fillColor: [41, 128, 185] },
    });

    doc.save("inventario_equipamentos.pdf");
}

renderizarEquipamentos();