import React, { useState, useEffect } from 'react';

const ItemModal = ({ item, mode, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    apellido: '',
    telefono: '',
    edad: '',
    correo: '',
    direccion: '',
    universidad: '',
    semestre: '',
    jornada: 'Diurna',
    sexo: 'Masculino'
  });

  useEffect(() => {
    if (item && mode === 'edit') {
      setFormData({
        id: item.id || '',
        nombre: item.nombre || '',
        apellido: item.apellido || '',
        telefono: item.telefono || '',
        edad: item.edad !== undefined ? item.edad : '',
        correo: item.correo || '',
        direccion: item.direccion || '',
        universidad: item.universidad || '',
        semestre: item.semestre !== undefined ? item.semestre : '',
        jornada: item.jornada || 'Diurna',
        sexo: item.sexo || 'Masculino'
      });
    } else {
      setFormData({
        id: '',
        nombre: '',
        apellido: '',
        telefono: '',
        edad: '',
        correo: '',
        direccion: '',
        universidad: '',
        semestre: '',
        jornada: 'Diurna',
        sexo: 'Masculino'
      });
    }
  }, [item, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'edad' || name === 'semestre'
        ? (value === '' ? '' : parseInt(value, 10))
        : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay" id="item-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{mode === 'edit' ? 'Editar Estudiante' : 'Nuevo Estudiante'}</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar modal">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              
              <div className="form-group">
                <label className="form-label" htmlFor="id">Identificación (ID)</label>
                <input
                  type="text"
                  id="id"
                  name="id"
                  className="form-control"
                  value={formData.id}
                  onChange={handleChange}
                  disabled={mode === 'edit'}
                  required
                  placeholder="Ej. EST-102030"
                  pattern="[a-zA-Z0-9_\-]+"
                  title="El ID solo puede contener letras, números, guiones y guiones bajos."
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  className="form-control"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  placeholder="Ej. Juan Carlos"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="apellido">Apellido</label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  className="form-control"
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                  placeholder="Ej. Pérez Gómez"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="telefono">Teléfono</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  className="form-control"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                  placeholder="Ej. 3001234567"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="edad">Edad</label>
                <input
                  type="number"
                  id="edad"
                  name="edad"
                  className="form-control"
                  value={formData.edad}
                  onChange={handleChange}
                  required
                  min="1"
                  max="120"
                  placeholder="Ej. 20"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="correo">Correo Electrónico</label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  className="form-control"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label" htmlFor="direccion">Dirección</label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  className="form-control"
                  value={formData.direccion}
                  onChange={handleChange}
                  required
                  placeholder="Ej. Calle 123 # 45-67"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="universidad">Universidad</label>
                <input
                  type="text"
                  id="universidad"
                  name="universidad"
                  className="form-control"
                  value={formData.universidad}
                  onChange={handleChange}
                  required
                  placeholder="Ej. Politecnico Grancolombiano"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="semestre">Semestre</label>
                <input
                  type="number"
                  id="semestre"
                  name="semestre"
                  className="form-control"
                  value={formData.semestre}
                  onChange={handleChange}
                  required
                  min="1"
                  max="16"
                  placeholder="Ej. 5"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="jornada">Jornada</label>
                <select
                  id="jornada"
                  name="jornada"
                  className="form-control"
                  value={formData.jornada}
                  onChange={handleChange}
                  required
                >
                  <option value="Diurna">Diurna</option>
                  <option value="Nocturna">Nocturna</option>
                  <option value="Virtual">Virtual</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="sexo">Sexo</label>
                <select
                  id="sexo"
                  name="sexo"
                  className="form-control"
                  value={formData.sexo}
                  onChange={handleChange}
                  required
                >
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {mode === 'edit' ? 'Guardar Cambios' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemModal;
