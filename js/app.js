let equipamentos = JSON.parse(localStorage.getItem("equipamentos")) || [];

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
  const eq = equipamentos[index];
  alert(\`Nome: \${eq.nome}\nMarca: \${eq.marca}\nModelo: \${eq.modelo}\nSérie: \${eq.serie}\nLocal: \${eq.local}\nStatus: \${eq.status}\nData: \${eq.dataCadastro}\`);
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