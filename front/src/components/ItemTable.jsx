import React from 'react';

const ItemTable = ({ items, onEdit, onDelete, selectedIds = [], onToggleSelect, onToggleSelectAll }) => {
  const getJornadaClass = (jornada) => {
    if (!jornada) return 'badge-jornada-diurna';
    const cleanJornada = jornada
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    if (cleanJornada.includes('nocturna')) return 'badge-jornada-nocturna';
    if (cleanJornada.includes('virtual')) return 'badge-jornada-virtual';
    return 'badge-jornada-diurna';
  };

  const getSexoClass = (sexo) => {
    if (!sexo) return '';
    const firstChar = sexo.trim().charAt(0).toLowerCase();
    if (firstChar === 'f') return 'badge-sexo-f';
    if (firstChar === 'm') return 'badge-sexo-m';
    return '';
  };

  return (
    <div className="table-responsive">
      <table className="material-table">
        <thead>
          <tr>
            <th className="checkbox-col">
              <input
                type="checkbox"
                checked={items.length > 0 && items.every((item) => selectedIds.includes(item.id))}
                onChange={onToggleSelectAll}
                title="Seleccionar todos los estudiantes visibles"
              />
            </th>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Teléfono</th>
            <th>Edad</th>
            <th>Correo</th>
            <th>Dirección</th>
            <th>Universidad</th>
            <th>Semestre</th>
            <th>Jornada</th>
            <th>Sexo</th>
            <th style={{ textAlign: 'right', paddingRight: '2rem' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan="13" className="no-data">
                No se encontraron registros de estudiantes.
              </td>
            </tr>
          ) : (
            items.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              return (
                <tr key={item.id} className={isSelected ? 'selected-row' : ''}>
                  <td className="checkbox-col">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(item.id)}
                      title={`Seleccionar a ${item.nombre} ${item.apellido}`}
                    />
                  </td>
                  <td><strong>{item.id}</strong></td>
                  <td>{item.nombre}</td>
                  <td>{item.apellido}</td>
                  <td>{item.telefono}</td>
                  <td>{item.edad}</td>
                  <td>{item.correo}</td>
                  <td>{item.direccion}</td>
                  <td>{item.universidad}</td>
                  <td>{item.semestre}</td>
                  <td>
                    <span className={`badge ${getJornadaClass(item.jornada)}`}>
                      {item.jornada}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getSexoClass(item.sexo)}`}>
                      {item.sexo}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', paddingRight: '1.5rem' }}>
                    <div className="actions-cell">
                      <button
                        className="btn btn-icon-only edit-btn"
                        title="Editar Estudiante"
                        onClick={() => onEdit(item)}
                      >
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button
                        className="btn btn-icon-only delete-btn"
                        title="Eliminar Estudiante"
                        onClick={() => onDelete(item.id)}
                      >
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ItemTable;
