import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StatusBar as RNStatusBar
} from 'react-native';

import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// Obtener dimensiones de la pantalla para el diseño responsivo
const { width } = Dimensions.get('window');
const cardWidth = (width - 40) / 2; // Dos columnas con espaciado óptimo

export default function App() {
  // Estado de las notas
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeFilter, setActiveFilter] = useState('Todo'); // Todo - Pendiente - Listas
  
  // Notas iniciales default
  const [notes, setNotes] = useState([
    {
      id: '1',
      title: 'Lista de compras',
      content: '• 1 kilo de papas\n• 1 Confort\n• 2 cajas de leche',
      date: '24/05/2026',
      category: 'Listas',
      color: '#FCE38A', // Amarillo pastel
    },
    {
      id: '2',
      title: 'Prueba de S.O',
      content: '• Fecha: 30/05/2026\n• Llevar hojas cuadriculadas\n• Calculadora\n• Sala: m3 - 101 a las 9:40',
      date: '24/05/2026',
      category: 'Pendiente',
      color: '#FAD0C4', // Rosado pastel
    },
    {
      id: '3',
      title: 'Revisión medica',
      content: '• Fecha: 30/05/2026\nLLevar:\n  - Carnet y papeles.\n• Dirección: Maipú\n• Hora: 2:00 pm',
      date: '24/05/2026',
      category: 'Pendiente',
      color: '#A0C4FF', // Azul pastel
    },
    {
      id: '4',
      title: 'Nota Vacía',
      content: 'Presiona prolongadamente para editar o cambiar sección.',
      date: '24/05/2026',
      category: 'Todo',
      color: '#FFB74D', // Naranja pastel
    },
  ]);

  // Modales de interacción
  const [selectedNote, setSelectedNote] = useState(null);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const [isAddVisible, setIsAddVisible] = useState(false);

  // Formulario para una nueva nota
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('Pendiente');
  const [newColor, setNewColor] = useState('#FCE38A');

  // Mensajes en pantalla
  const [toastMessage, setToastMessage] = useState('');

  // Controladores
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 2500);
  };

  const handleCreateNote = () => {
    if (!newTitle.trim()) {
      showToast('Por favor, ingresa un título');
      return;
    }

    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;

    const newNote = {
      id: Math.random().toString(),
      title: newTitle,
      content: newContent || 'Sin contenido',
      date: formattedDate,
      category: newCategory,
      color: newColor,
    };

    setNotes([newNote, ...notes]);
    setIsAddVisible(false);
    // Limpiar campos
    setNewTitle('');
    setNewContent('');
    setNewCategory('Pendiente');
    setNewColor('#FCE38A');
    showToast('¡Nota agregada correctamente!');
  };

  const changeNoteCategory = (noteId, targetCategory) => {
    setNotes(notes.map(note => 
      note.id === noteId ? { ...note, category: targetCategory } : note
    ));
    setIsOptionsVisible(false);
    showToast(`Nota movida a "${targetCategory}"`);
  };

  const deleteNote = (noteId) => {
    setNotes(notes.filter(note => note.id !== noteId));
    setIsOptionsVisible(false);
    showToast('Nota eliminada correctamente');
  };

  // Filtrado de Notas
  const filteredNotes = notes.filter(note => {
    if (activeFilter === 'Todo') return true;
    return note.category === activeFilter;
  });

  // Colores Disponibles para las notas
  const availableColors = ['#FCE38A', '#FAD0C4', '#A0C4FF', '#FFB74D'];

  // Temas de la app (Light/Dark)
  const theme = {
    background: isDarkMode ? '#121212' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    subtext: isDarkMode ? '#CCCCCC' : '#555555',
    pillBackground: '#F9D371',
    pillText: '#000000',
    navBackground: '#F9D371',
    navIcon: '#000000',
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      {/* Header - Opcion del tema */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Mis Notas</Text>
        <TouchableOpacity 
          style={[styles.themeToggle, { borderColor: theme.text }]}
          onPress={() => setIsDarkMode(!isDarkMode)}
          activeOpacity={0.7}
        >
          <View style={[styles.themeKnob, { 
            alignSelf: isDarkMode ? 'flex-end' : 'flex-start',
            backgroundColor: isDarkMode ? '#FFFFFF' : '#000000'
          }]}>
            <Ionicons 
              name={isDarkMode ? 'moon' : 'sunny'} 
              size={14} 
              color={isDarkMode ? '#000000' : '#FFFFFF'} 
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* Filtro por categorías */}
      <View style={styles.filterContainer}>
        {['Todo', 'Pendiente', 'Listas'].map((filter) => {
          const isActive = activeFilter === filter;
          return (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterPill, 
                { backgroundColor: theme.pillBackground },
                isActive ? styles.filterPillActive : null
              ]}
              onPress={() => setActiveFilter(filter)}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.filterText, 
                { color: theme.pillText },
                isActive ? styles.filterTextActive : null
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Contenedor de notas */}
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.gridContainer}>
          {filteredNotes.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="documents-outline" size={60} color={theme.subtext} />
              <Text style={[styles.emptyText, { color: theme.subtext }]}>
                No hay notas en "{activeFilter}"
              </Text>
            </View>
          ) : (
            filteredNotes.map((note) => (
              <TouchableOpacity
                key={note.id}
                style={[styles.noteCard, { backgroundColor: note.color }]}
                onPress={() => {
                  setSelectedNote(note);
                  setIsDetailVisible(true);
                }}
                onLongPress={() => {
                  setSelectedNote(note);
                  setIsOptionsVisible(true);
                }}
                activeOpacity={0.9}
              >
                <Text style={styles.noteTitle} numberOfLines={1}>{note.title}</Text>
                <Text style={styles.noteContent} numberOfLines={5}>{note.content}</Text>
                <Text style={styles.noteDate}>{note.date}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Mensajes en pantalla */}
      {toastMessage !== '' ? (
        <View style={styles.toastContainer}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      ) : null}

      {/* Barra de navegación */}
      <View style={[styles.bottomBar, { backgroundColor: theme.navBackground }]}>
        {/* Icono de creación de notas con lapiz (Inactivo) */}
        <TouchableOpacity style={styles.navButton} activeOpacity={1}>
          <Ionicons name="create-outline" size={28} color={theme.navIcon} />
        </TouchableOpacity>
        
        {/* Icono de agregar notas (Único activo) */}
        <TouchableOpacity style={styles.navButtonMain} onPress={() => setIsAddVisible(true)} activeOpacity={0.7}>
          <Ionicons name="add" size={32} color={theme.navIcon} />
        </TouchableOpacity>
        
        {/* Icono de creación de notas con micrófono (Inactivo) */}
        <TouchableOpacity style={styles.navButton} activeOpacity={1}>
          <Ionicons name="mic-outline" size={28} color={theme.navIcon} />
        </TouchableOpacity>
      </View>

      {/* MODAL 1: Detalle completo de la nota */}
      <Modal visible={isDetailVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.detailModalContainer, { backgroundColor: selectedNote?.color || '#FFFFFF' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalCategoryBadge}>
                {selectedNote?.category}
              </Text>
              <TouchableOpacity onPress={() => setIsDetailVisible(false)}>
                <Ionicons name="close-circle" size={30} color="#000000" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll}>
              <Text style={styles.detailTitle}>{selectedNote?.title}</Text>
              <Text style={styles.detailContent}>{selectedNote?.content}</Text>
            </ScrollView>
            <View style={styles.detailFooter}>
              <Text style={styles.detailDate}>Creado: {selectedNote?.date}</Text>
              <TouchableOpacity 
                style={styles.modalActionButton}
                onPress={() => {
                  setIsDetailVisible(false);
                  setIsOptionsVisible(true);
                }}
              >
                <Text style={styles.modalActionButtonText}>Organizar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL 2: Menu de acciones para la nota seleccionada */}
      <Modal visible={isOptionsVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlayBottom}>
          <View style={[styles.optionsContainer, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
            <View style={styles.dragIndicator} />
            <Text style={[styles.optionsTitle, { color: theme.text }]}>
              Opciones para: "{selectedNote?.title}"
            </Text>
            
            <TouchableOpacity 
              style={styles.optionRow} 
              onPress={() => changeNoteCategory(selectedNote?.id, 'Pendiente')}
            >
              <Ionicons name="time-outline" size={24} color="#F5C043" />
              <Text style={[styles.optionText, { color: theme.text }]}>Marcar como Pendiente</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.optionRow} 
              onPress={() => changeNoteCategory(selectedNote?.id, 'Listas')}
            >
              <Ionicons name="list-outline" size={24} color="#4A90E2" />
              <Text style={[styles.optionText, { color: theme.text }]}>Mover a Listas</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.optionRow} 
              onPress={() => changeNoteCategory(selectedNote?.id, 'Todo')}
            >
              <Ionicons name="folder-open-outline" size={24} color="#5C6BC0" />
              <Text style={[styles.optionText, { color: theme.text }]}>Mover a General (Todo)</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.optionRow, styles.optionRowDanger]} 
              onPress={() => deleteNote(selectedNote?.id)}
            >
              <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
              <Text style={styles.optionTextDanger}>Eliminar Nota</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.optionCloseButton, { backgroundColor: theme.pillBackground }]} 
              onPress={() => setIsOptionsVisible(false)}
            >
              <Text style={styles.optionCloseButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL 3: Crear nueva nota */}
      <Modal visible={isAddVisible} animationType="slide" transparent={true}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.modalOverlay}
        >
          <View style={[styles.addModalContainer, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
            <View style={styles.addModalHeader}>
              <Text style={[styles.addModalTitle, { color: theme.text }]}>Nueva Nota</Text>
              <TouchableOpacity onPress={() => setIsAddVisible(false)}>
                <Ionicons name="close" size={28} color={theme.text} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.addModalScroll}>
              <Text style={[styles.label, { color: theme.text }]}>Título de la Nota</Text>
              <TextInput
                style={[styles.input, { color: theme.text, borderColor: theme.subtext }]}
                placeholder="Ej. Lista de compras"
                placeholderTextColor={theme.subtext}
                value={newTitle}
                onChangeText={setNewTitle}
              />

              <Text style={[styles.label, { color: theme.text }]}>Contenido</Text>
              <TextInput
                style={[styles.inputMultiline, { color: theme.text, borderColor: theme.subtext }]}
                placeholder="Escribe los detalles aquí..."
                placeholderTextColor={theme.subtext}
                multiline={true}
                numberOfLines={6}
                value={newContent}
                onChangeText={setNewContent}
              />

              {/* Selector de categoría */}
              <Text style={[styles.label, { color: theme.text }]}>Sección destino</Text>
              <View style={styles.categorySelector}>
                {['Pendiente', 'Listas'].map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categorySelButton,
                      newCategory === cat ? { backgroundColor: theme.pillBackground } : null
                    ]}
                    onPress={() => setNewCategory(cat)}
                  >
                    <Text style={[
                      styles.categorySelText,
                      newCategory === cat ? { fontWeight: 'bold' } : null
                    ]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Selector de colores pastel */}
              <Text style={[styles.label, { color: theme.text }]}>Elige un color de tarjeta</Text>
              <View style={styles.colorContainer}>
                {availableColors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorBubble,
                      { backgroundColor: color },
                      newColor === color ? styles.colorBubbleSelected : null
                    ]}
                    onPress={() => setNewColor(color)}
                  />
                ))}
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.saveButton} onPress={handleCreateNote}>
              <Text style={styles.saveButtonText}>Guardar Nota</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </View>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Espaciado seguro sin depender de librerías externas
    paddingTop: Platform.OS === 'ios' ? 44 : (RNStatusBar.currentHeight || 0),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  themeToggle: {
    width: 66,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 2,
    justifyContent: 'center',
  },
  themeKnob: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 15,
    gap: 12,
  },
  filterPill: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  filterPillActive: {
    borderWidth: 2,
    borderColor: '#000000',
  },
  filterText: {
    fontSize: 16,
    fontWeight: '500',
  },
  filterTextActive: {
    fontWeight: 'bold',
  },
  scrollContainer: {
    paddingHorizontal: 15,
    paddingBottom: 40,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  emptyContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    opacity: 0.7,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
  },
  noteCard: {
    width: cardWidth,
    minHeight: 180,
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 6,
  },
  noteContent: {
    fontSize: 13,
    color: '#333333',
    lineHeight: 18,
    flex: 1,
  },
  noteDate: {
    fontSize: 11,
    color: '#777777',
    marginTop: 10,
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 25,
    left: '12%',
    right: '12%',
    height: 60,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  navButton: {
    padding: 10,
  },
  navButtonMain: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Modales Estilos generales
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalOverlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  // Modal Detalles
  detailModalContainer: {
    width: '90%',
    maxHeight: '75%',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalCategoryBadge: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 12,
    fontWeight: '600',
    color: '#000000',
  },
  modalScroll: {
    marginVertical: 10,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 15,
  },
  detailContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#111111',
  },
  detailFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  detailDate: {
    fontSize: 12,
    color: '#555555',
    fontWeight: '600',
  },
  modalActionButton: {
    backgroundColor: '#000000',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 15,
  },
  modalActionButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  // Modal de opciones (Long Press)
  optionsContainer: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 25,
    paddingBottom: Platform.OS === 'ios' ? 40 : 25,
  },
  dragIndicator: {
    width: 40,
    height: 5,
    backgroundColor: '#CCCCCC',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 15,
  },
  optionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#E0E0E0',
    gap: 15,
  },
  optionRowDanger: {
    borderBottomWidth: 0,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  optionTextDanger: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  optionCloseButton: {
    marginTop: 15,
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
  },
  optionCloseButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  // Modal Agregar Nota
  addModalContainer: {
    width: '95%',
    maxHeight: '85%',
    borderRadius: 25,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  addModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  addModalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  addModalScroll: {
    paddingBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  inputMultiline: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    height: 120,
    textAlignVertical: 'top',
  },
  categorySelector: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  categorySelButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#CCCCCC',
    borderRadius: 15,
    paddingVertical: 10,
    alignItems: 'center',
  },
  categorySelText: {
    fontSize: 14,
  },
  colorContainer: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 5,
  },
  colorBubble: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  colorBubbleSelected: {
    borderWidth: 3,
    borderColor: '#000000',
  },
  saveButton: {
    backgroundColor: '#F5C043',
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 15,
  },
  saveButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Toast
  toastContainer: {
    position: 'absolute',
    top: 50,
    left: '10%',
    right: '10%',
    backgroundColor: 'rgba(0,0,0,0.85)',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    zIndex: 999,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});