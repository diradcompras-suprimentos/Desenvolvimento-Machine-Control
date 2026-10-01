export default function EquipmentCard({ equipamento, onEdit, onDelete }) {
  const eq = equipamento;

  const verDetalhes = () => {
    alert(
      `Nome: ${eq.nome}\nMarca: ${eq.marca}\nModelo: ${eq.modelo}\nSérie: ${eq.serie}\nLocal: ${eq.local}\nStatus: ${eq.status}\nData: ${eq.data_cadastro}`
    );
  };

  return (
    <div className="col-md-4 mb-3">
      <div className="card shadow-sm">
        <img
          src={eq.imagem_url || 'https://placehold.co/300x180?text=Sem+Imagem'}
          className="card-img-top"
          alt={eq.nome}
        />
        <div className="card-body">
          <h5 className="card-title">{eq.nome}</h5>
          <p className="card-text"><strong>Local:</strong> {eq.local}</p>
          <p className="card-text"><strong>Status:</strong> {eq.status}</p>
          <button className="btn btn-sm btn-info" onClick={verDetalhes}>Abrir</button>
          <button className="btn btn-sm btn-warning ms-1" onClick={() => onEdit(eq)}>Editar</button>
          <button className="btn btn-sm btn-danger ms-1" onClick={() => onDelete(eq.id)}>Excluir</button>
        </div>
      </div>
    </div>
  );
}
