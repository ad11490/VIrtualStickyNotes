const addNoteButton = document.getElementById('addNote');
const board = document.getElementById('board');


const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];


function renderNotes() {
  board.innerHTML = '';
  savedNotes.forEach((note, index) => createNote(note, index));
}

function createNote(noteData = {}, index = null) {
  const note = document.createElement('div');
  note.className = 'note';
  note.style.left = noteData.x || '50px';
  note.style.top = noteData.y || '50px';

  const textarea = document.createElement('textarea');
  textarea.value = noteData.content || '';
  textarea.addEventListener('input', () => {
    if (index !== null) {
      savedNotes[index].content = textarea.value;
      saveNotes();
    }
  });

  note.appendChild(textarea);
  board.appendChild(note);


  note.addEventListener('mousedown', (e) => dragStart(e, note, index));
}


function saveNotes() {
  localStorage.setItem('notes', JSON.stringify(savedNotes));
}


addNoteButton.addEventListener('click', () => {
  const newNote = { x: '50px', y: '50px', content: '' };
  savedNotes.push(newNote);
  createNote(newNote, savedNotes.length - 1);
  saveNotes();
});


let activeNote = null;
function dragStart(e, note, index) {
  activeNote = { note, index, offsetX: e.offsetX, offsetY: e.offsetY };
  document.addEventListener('mousemove', dragMove);
  document.addEventListener('mouseup', dragEnd);
}

function dragMove(e) {
  if (!activeNote) return;
  const { note, index, offsetX, offsetY } = activeNote;
  note.style.left = `${e.pageX - offsetX}px`;
  note.style.top = `${e.pageY - offsetY}px`;
  if (index !== null) {
    savedNotes[index].x = note.style.left;
    savedNotes[index].y = note.style.top;
    saveNotes();
  }
}

function dragEnd() {
  activeNote = null;
  document.removeEventListener('mousemove', dragMove);
  document.removeEventListener('mouseup', dragEnd);
}

renderNotes();
