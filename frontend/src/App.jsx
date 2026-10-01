import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import EquipmentGrid from './components/EquipmentGrid';
import EquipmentFormModal from './components/EquipmentFormModal';
import { fetchEquipamentos, createEquipamento, updateEquipamento, deleteEquipamento, fetchStatus } from './api';

export default function App() {
  const [equipamentos, setEquipamentos] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [uploadEnabled, setUploadEnabled] = useState(false);

  const loadEquipamentos = async () => {
    try {
      const data = await fetchEquipamentos();
      setEquipamentos(data);
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    loadEquipamentos();
    fetchStatus().then((s) => setUploadEnabled(s.uploadEnabled)).catch(() => {});
  }, []);

  const handleSave = async (formData) => {
    try {
      if (editing) {
        await updateEquipamento(editing.id, formData);
      } else {
        await createEquipamento(formData);
      }
      await loadEquipamentos();
      setShowModal(false);
      setEditing(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (eq) => {
    setEditing(eq);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja excluir este equipamento?')) {
      try {
        await deleteEquipamento(id);
        await loadEquipamentos();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleAdd = () => {
    setEditing(null);
    setShowModal(true);
  };

  const filtered = equipamentos.filter(
    (eq) =>
      eq.nome.toLowerCase().includes(search.toLowerCase()) ||
      eq.local.toLowerCase().includes(search.toLowerCase())
  );

  const exportarExcel = () => {
    if (equipamentos.length === 0) {
      alert('Nenhum equipamento cadastrado para exportar.');
      return;
    }
    const dados = equipamentos.map((eq) => ({
      Nome: eq.nome,
      Marca: eq.marca || '-',
      Modelo: eq.modelo || '-',
      'Nº Série': eq.serie || '-',
      Local: eq.local,
      Status: eq.status,
      'Data de Cadastro': eq.data_cadastro,
    }));
    const ws = XLSX.utils.json_to_sheet(dados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventário');
    XLSX.writeFile(wb, 'inventario_equipamentos.xls');
  };

  const exportarPDF = () => {
    if (equipamentos.length === 0) {
      alert('Nenhum equipamento cadastrado para exportar.');
      return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Inventário de Equipamentos', 14, 15);
    const dados = equipamentos.map((eq) => [
      eq.nome, eq.marca || '-', eq.modelo || '-', eq.serie || '-',
      eq.local, eq.status, eq.data_cadastro,
    ]);
    doc.autoTable({
      head: [['Nome', 'Marca', 'Modelo', 'Nº Série', 'Local', 'Status', 'Data']],
      body: dados,
      startY: 25,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
    });
    doc.save('inventario_equipamentos.pdf');
  };

  return (
    <>
      <Navbar />
      <div className="container my-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
          <h3 className="fw-bold">Equipamentos Cadastrados</h3>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar equipamento..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: '250px' }}
          />
          <div className="d-flex gap-2">
            <button className="btn btn-success" onClick={exportarExcel}>📊 Exportar Excel</button>
            <button className="btn btn-danger" onClick={exportarPDF}>📕 Exportar PDF</button>
            <button className="btn btn-primary" onClick={handleAdd}>➕ Adicionar</button>
          </div>
        </div>
        <EquipmentGrid equipamentos={filtered} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
      <EquipmentFormModal
        show={showModal}
        editing={editing}
        uploadEnabled={uploadEnabled}
        onSave={handleSave}
        onClose={() => { setShowModal(false); setEditing(null); }}
      />
    </>
  );
}
