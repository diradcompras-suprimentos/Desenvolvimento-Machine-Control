import { useState, useEffect } from 'react';
import { uploadImage } from '../api';

export default function EquipmentFormModal({ show, editing, uploadEnabled, onSave, onClose }) {
  const [form, setForm] = useState({
    nome: '', marca: '', modelo: '', serie: '', local: '', status: 'Ativo', imagem_url: '',
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (editing) {
      setForm({
        nome: editing.nome || '',
        marca: editing.marca || '',
        modelo: editing.modelo || '',
        serie: editing.serie || '',
        local: editing.local || '',
        status: editing.status || 'Ativo',
        imagem_url: editing.imagem_url || '',
      });
      setImagePreview(editing.imagem_url || null);
    } else {
      setForm({ nome: '', marca: '', modelo: '', serie: '', local: '', status: 'Ativo', imagem_url: '' });
      setImagePreview(null);
    }
  }, [editing, show]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const result = await uploadImage(file);
      setForm((prev) => ({ ...prev, imagem_url: result.url }));
    } catch (err) {
      alert(err.message);
      setImagePreview(form.imagem_url || null);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nome || !form.local) {
      alert('Preencha os campos obrigatórios: Nome e Local.');
      return;
    }
    onSave(form);
  };

  if (!show) return null;

  return (
    <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{editing ? 'Editar' : 'Adicionar'} Equipamento</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Nome</label>
                  <input type="text" id="nome" className="form-control" required value={form.nome} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Marca</label>
                  <input type="text" id="marca" className="form-control" value={form.marca} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Modelo</label>
                  <input type="text" id="modelo" className="form-control" value={form.modelo} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Nº de Série</label>
                  <input type="text" id="serie" className="form-control" value={form.serie} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Local</label>
                  <input type="text" id="local" className="form-control" required value={form.local} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Status</label>
                  <select id="status" className="form-select" value={form.status} onChange={handleChange}>
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                    <option value="Manutenção">Manutenção</option>
                  </select>
                </div>
                <div className="col-md-12">
                  <label className="form-label">Imagem</label>
                  {uploadEnabled ? (
                    <>
                      <input type="file" id="imagem" className="form-control" accept="image/*" onChange={handleFileChange} />
                      {imagePreview && (
                        <img src={imagePreview} className="mt-2 rounded" style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover' }} alt="Preview" />
                      )}
                      {uploading && <p className="text-muted mt-1">Enviando imagem...</p>}
                    </>
                  ) : (
                    <div className="alert alert-warning mt-1">
                      ⚠️ Upload de imagens desabilitado. Configure as credenciais AWS S3 para habilitar.
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={uploading}>
              {uploading ? 'Enviando...' : 'Salvar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
