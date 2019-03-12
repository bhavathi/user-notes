import React from 'react';
import { withRouter } from 'react-router-dom';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';

import './notes.scss';

const myHeaders = new Headers({
  'Content-Type': 'application/json'
});

class ViewNotes extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
      notesById: {},
      addNew: false,
      newNotes: '',
    };
  }

  setNotesState = (notesList) => {
    let notesById = {};
    notesList.forEach(item => {
      notesById[item.id] = item.notes;
    });
    this.setState({ notes: notesList, notesById });
  };

  componentDidMount() {
    fetch('/api/notes')
      .then(res => res.json())
      .then(res => this.setNotesState(res.data));
  }

  getNotes = (currentNoteIndex, attributes) => {
    const { notes } = this.state;
    return [
      ...notes.slice(0, currentNoteIndex),
      Object.assign({}, notes[currentNoteIndex], attributes),
      ...notes.slice(currentNoteIndex + 1)
    ]
  }

  handleNoteChange = (item, isNew) => (event) => {
    if (isNew) {
      this.setState({ newNotes: event.target.value });
      return;
    }
    const { notesById } = this.state;
    notesById[item.id] = event.target.value;
    this.setState({ notesById: Object.assign({}, notesById) });
  }

  handleCancel = (item, isNew) => () => {
    if (isNew) {
      this.setState({ addNew: false });
      return;
    }
    const { notesById, notes } = this.state;
    const currentNoteIndex = notes.findIndex(note => note.id === item.id);
    notesById[item.id] = notes[currentNoteIndex].notes;
    this.setState({
      notesById: Object.assign({}, notesById),
      notes: this.getNotes(currentNoteIndex, { onEditMode: false }),
    });
  }

  handleSaveNotes = (item, isNew) => () => {
    const { notesById, notes, newNotes } = this.state;
    if (isNew) {
      fetch(`/api/createnotes`, { method: 'POST', headers: myHeaders, body: JSON.stringify({ notes: newNotes }) })
        .then(res => res.json())
        .then(res => {
          const updatedNotes = [...notes, res];
          this.setNotesState(updatedNotes);
        })
      this.setState({ newNotes: '', addNew: false });
      return;
    }

    const currentNoteIndex = notes.findIndex(note => note.id === item.id);
    fetch(`/api/notes`, { method: 'PUT', headers: myHeaders, body: JSON.stringify({ id: item.id, notes: notesById[item.id] }) })
    this.setState({ notes: this.getNotes(currentNoteIndex, { notes: notesById[item.id], onEditMode: false }) });
  }

  handleEdit = item => () => {
    const { notes } = this.state;
    const currentNoteIndex = notes.findIndex(note => note.id === item.id);
    this.setState({ notes: this.getNotes(currentNoteIndex, { onEditMode: true }) });
  }

  addNotes = () => {
    this.setState({ addNew: true });
  }

  renderEditModeNotes = (item, addNew) => {
    const { notesById, newNotes } = this.state;
    const value = addNew ? newNotes : notesById[item.id]
    return (
      <div key={item && item.id} className="notes-wrapper">
        <div className="edit-notes">
          <TextField
            placeholder="Type here"
            value={value}
            required
            fullWidth
            onChange={this.handleNoteChange(item, addNew)}
            variant="outlined"
            margin="normal"
            multiline
          />
        </div>
        <IconButton onClick={this.handleCancel(item, addNew)}><CloseIcon /></IconButton>
        <IconButton onClick={this.handleSaveNotes(item, addNew)}><CheckIcon /></IconButton>
      </div>
    )
  }

  renderNotes = (item) => (
    <div key={item.id} className="notes-wrapper">
      <div className="notes-style">
        {item.notes}
      </div>
      <IconButton onClick={this.handleEdit(item)}><EditIcon /></IconButton>
    </div>
  )

  render() {
    const { notes, addNew } = this.state;
    return (<div className="notes-container">
      <h4>Notes</h4>
      {notes.map((item) => {
        const { onEditMode } = item;
        return onEditMode ? this.renderEditModeNotes(item) : this.renderNotes(item);
      }
      )}
      {addNew && this.renderEditModeNotes(null, addNew)}
      <Button color="primary" disabled={addNew} onClick={this.addNotes}>Add Notes</Button>
    </div>);
  }
}

export default withRouter(ViewNotes);
