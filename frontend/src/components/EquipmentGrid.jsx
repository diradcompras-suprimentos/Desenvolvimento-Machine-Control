import EquipmentCard from './EquipmentCard';

export default function EquipmentGrid({ equipamentos, onEdit, onDelete }) {
  if (equipamentos.length === 0) {
    return <p className="text-muted text-center mt-4">Nenhum equipamento cadastrado.</p>;
  }
  return (
    <div className="row">
      {equipamentos.map((eq) => (
        <EquipmentCard key={eq.id} equipamento={eq} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
