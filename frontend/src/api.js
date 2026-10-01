const API_URL = '/api';

export async function fetchEquipamentos() {
  const res = await fetch(`${API_URL}/equipamentos`);
  if (!res.ok) throw new Error('Erro ao buscar equipamentos');
  return res.json();
}

export async function createEquipamento(data) {
  const res = await fetch(`${API_URL}/equipamentos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Erro ao criar equipamento');
  return res.json();
}

export async function updateEquipamento(id, data) {
  const res = await fetch(`${API_URL}/equipamentos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Erro ao atualizar equipamento');
  return res.json();
}

export async function deleteEquipamento(id) {
  const res = await fetch(`${API_URL}/equipamentos/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Erro ao excluir equipamento');
}

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('imagem', file);
  const res = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Erro ao fazer upload da imagem');
  }
  return res.json();
}

export async function fetchStatus() {
  const res = await fetch(`${API_URL}/status`);
  if (!res.ok) throw new Error('Erro ao buscar status');
  return res.json();
}
