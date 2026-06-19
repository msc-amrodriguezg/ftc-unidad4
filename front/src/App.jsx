import React, { useState, useEffect } from 'react';
import Spinner from './components/Spinner';
import ItemTable from './components/ItemTable';
import ItemModal from './components/ItemModal';

const API_URL = 'https://ftcu4-h2ahcna3hrgye2fu.canadacentral-01.azurewebsites.net' ?? '';

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Custom dialogs and notifications
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [toasts, setToasts] = useState([]);
  
  // Multiple selection state
  const [selectedIds, setSelectedIds] = useState([]);
  const [confirmDeleteSelected, setConfirmDeleteSelected] = useState(false);
  
  // Local search filter
  const [searchQuery, setSearchQuery] = useState('');

  // CSV File upload ref & handlers
  const fileInputRef = React.useRef(null);

  const handleCsvUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      showToast('Por favor, cargue únicamente archivos con extensión .csv', 'danger');
      e.target.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/items/loadFile`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'No fue posible procesar el archivo CSV.');
      }

      const result = await response.json();
      showToast(`Carga de CSV finalizada. Se procesaron ${result.length} estudiantes.`, 'success');
    } catch (error) {
      console.error('Error al subir el CSV:', error);
      showToast(error.message || 'Error al enviar el archivo CSV al servidor.', 'danger');
    } finally {
      e.target.value = '';
      await fetchItems();
    }
  };

  // Helper to show modern status toasts
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  };

  // Initial fetch findAll()
  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/items`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setItems(data);
      setSelectedIds([]);
    } catch (error) {
      console.error('Error fetching items:', error);
      showToast('Error al consultar la información del servidor.', 'danger');
    } finally {
      // Simulate delay if response is very fast to ensure spinner visibility and premium feel
      setTimeout(() => {
        setLoading(false);
      }, 800);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Open modal for creating a new record
  const handleCreateOpen = () => {
    setModalMode('create');
    setSelectedItem(null);
    setModalOpen(true);
  };

  // Open modal for editing a record
  const handleEditOpen = (item) => {
    setModalMode('edit');
    setSelectedItem(item);
    setModalOpen(true);
  };

  // Triggered when deleting a record
  const handleDeleteTrigger = (id) => {
    setConfirmDeleteId(id);
  };

  // Confirm and run delete
  const handleDeleteConfirm = async (id) => {
    setConfirmDeleteId(null);
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/items/${id}`, {
        method: 'DELETE',
      });
      
      if (response.status === 204 || response.status === 200 || response.ok) {
        showToast('Estudiante eliminado con éxito.', 'success');
        // Update local state instead of full reload to prevent flicker
        setItems((prev) => prev.filter((item) => item.id !== id));
        setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
      } else {
        throw new Error('No se pudo eliminar el estudiante.');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      showToast('Error al intentar eliminar el estudiante.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  // Toggle selection for a single student
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle selection for all visible/filtered students
  const handleToggleSelectAll = () => {
    const visibleIds = filteredItems.map((item) => item.id);
    const allVisibleSelected = visibleIds.every((id) => selectedIds.includes(id));

    if (allVisibleSelected) {
      // Deselect all visible students
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      // Select all visible students (merging with existing selection)
      setSelectedIds((prev) => {
        const newSelection = [...prev];
        visibleIds.forEach((id) => {
          if (!newSelection.includes(id)) {
            newSelection.push(id);
          }
        });
        return newSelection;
      });
    }
  };

  // Trigger delete selected confirmation
  const handleDeleteSelectedTrigger = () => {
    setConfirmDeleteSelected(true);
  };

  // Confirm delete selected students
  const handleDeleteSelectedConfirm = async () => {
    setConfirmDeleteSelected(false);
    setLoading(true);
    const idsToDelete = [...selectedIds];
    
    try {
      const results = await Promise.all(
        idsToDelete.map(async (id) => {
          try {
            const response = await fetch(`${API_URL}/api/items/${id}`, {
              method: 'DELETE',
            });
            return { id, ok: response.ok || response.status === 204 || response.status === 200 };
          } catch (err) {
            console.error(`Error deleting student ${id}:`, err);
            return { id, ok: false };
          }
        })
      );

      const successfulDeletes = results.filter((r) => r.ok).map((r) => r.id);
      const failedDeletes = results.filter((r) => !r.ok).map((r) => r.id);

      if (successfulDeletes.length > 0) {
        setItems((prev) => prev.filter((item) => !successfulDeletes.includes(item.id)));
        setSelectedIds((prev) => prev.filter((id) => !successfulDeletes.includes(id)));
      }

      if (failedDeletes.length > 0) {
        showToast(
          `Se eliminaron ${successfulDeletes.length} estudiantes, pero falló la eliminación de ${failedDeletes.length}.`,
          'danger'
        );
      } else {
        showToast(`Se eliminaron ${successfulDeletes.length} estudiantes con éxito.`, 'success');
      }
    } catch (error) {
      console.error('Error in bulk delete:', error);
      showToast('Error al intentar eliminar los estudiantes seleccionados.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  // Save changes (creates or updates)
  const handleSaveItem = async (formData) => {
    setModalOpen(false);
    setLoading(true);
    
    const isEdit = modalMode === 'edit';
    const url = isEdit ? `${API_URL}/api/items/${formData.id}` : `${API_URL}/api/items`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.message || `Error del servidor (${response.status})`;
        throw new Error(errorMsg);
      }

      const savedItem = await response.json();
      
      if (isEdit) {
        setItems((prev) => prev.map((item) => (item.id === savedItem.id ? savedItem : item)));
        showToast('Información del estudiante actualizada.', 'success');
      } else {
        setItems((prev) => [...prev, savedItem]);
        showToast('Estudiante registrado con éxito.', 'success');
      }
    } catch (error) {
      console.error('Error saving item:', error);
      showToast(error.message || 'Error al guardar los datos del estudiante.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  // Filtered items based on search query
  const filteredItems = items.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.id?.toLowerCase().includes(query) ||
      item.nombre?.toLowerCase().includes(query) ||
      item.apellido?.toLowerCase().includes(query) ||
      item.correo?.toLowerCase().includes(query) ||
      item.universidad?.toLowerCase().includes(query)
    );
  });

  return (
    <>
      {/* Navbar header */}
      <header className="navbar">
        <div className="navbar-brand">
          <svg className="navbar-logo" viewBox="0 0 24 24">
            <path d="M12 2L1 9l11 7 9-5.73V17h2V9L12 2z" />
            <path d="M17 14v4.5c0 1.93-2.24 3.5-5 3.5s-5-1.57-5-3.5V14l5 3 5-3z" />
          </svg>
          <h1>Fundamentos de Tecnología Cloud - Control Escolar</h1>
        </div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.875rem', opacity: 0.85 }}>Unidad 4</span>
          
          <button 
            className="btn btn-secondary" 
            onClick={handleCsvUploadClick} 
            style={{ 
              borderColor: 'var(--color-accent)', 
              color: 'var(--color-accent)' 
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            Cargar CSV
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv"
            style={{ display: 'none' }}
          />

          <button className="btn btn-accent" onClick={handleCreateOpen}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Nuevo Estudiante
          </button>
        </div>
      </header>

      {/* Main dashboard content */}
      <main className="container">
        <div className="dashboard-header">
          <div className="dashboard-title" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <h2>Listado de Estudiantes</h2>
            {selectedIds.length > 0 && (
              <button 
                className="btn btn-danger" 
                onClick={handleDeleteSelectedTrigger}
                style={{ 
                  textTransform: 'none', 
                  fontSize: '0.8rem', 
                  padding: '0.4rem 0.8rem',
                  animation: 'fadeIn 0.2s ease-out'
                }}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
                Eliminar seleccionados ({selectedIds.length})
              </button>
            )}
          </div>
          
          {/* Quick search input */}
          <div style={{ position: 'relative', width: '300px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nombre, ID, universidad..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                paddingLeft: '2.5rem',
                borderRadius: '50px',
                width: '100%',
                fontSize: '0.875rem'
              }}
            />
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="var(--color-secondary)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                position: 'absolute',
                left: '0.9rem',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none'
              }}
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>

        {/* Records card */}
        <div className="card">
          <ItemTable
            items={filteredItems}
            onEdit={handleEditOpen}
            onDelete={handleDeleteTrigger}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} MSC FTC Unidad 4 - Panel de Estudiantes. Todos los derechos reservados.</p>
      </footer>

      {/* Modals & Loader overlays */}
      {loading && <Spinner message="Consultando información, un momento por favor..." />}

      {modalOpen && (
        <ItemModal
          item={selectedItem}
          mode={modalMode}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveItem}
        />
      )}

      {/* Confirmation Dialog Modal */}
      {confirmDeleteId && (
        <div className="modal-overlay" id="confirm-modal">
          <div className="modal-content confirm-modal-content">
            <div className="confirm-modal-body">
              <div className="confirm-icon">⚠</div>
              <h3 style={{ marginBottom: '8px', color: 'var(--color-primary)' }}>¿Eliminar Estudiante?</h3>
              <p className="confirm-text">Esta acción es permanente y no se podrá recuperar de la base de datos.</p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button className="btn btn-secondary" onClick={() => setConfirmDeleteId(null)}>
                  Cancelar
                </button>
                <button className="btn btn-danger" onClick={() => handleDeleteConfirm(confirmDeleteId)}>
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Confirmation Dialog Modal */}
      {confirmDeleteSelected && (
        <div className="modal-overlay" id="confirm-bulk-modal">
          <div className="modal-content confirm-modal-content">
            <div className="confirm-modal-body">
              <div className="confirm-icon">⚠</div>
              <h3 style={{ marginBottom: '8px', color: 'var(--color-primary)' }}>¿Eliminar Estudiantes?</h3>
              <p className="confirm-text">Se eliminarán permanentemente <strong>{selectedIds.length}</strong> estudiantes de la base de datos.</p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button className="btn btn-secondary" onClick={() => setConfirmDeleteSelected(false)}>
                  Cancelar
                </button>
                <button className="btn btn-danger" onClick={handleDeleteSelectedConfirm}>
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
 
       {/* Toast Notification Container */}
      <div className="toast-container" id="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <span>
              {toast.type === 'success' && '✓ '}
              {toast.type === 'danger' && '✗ '}
              {toast.type === 'info' && '🛈 '}
              {toast.message}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
