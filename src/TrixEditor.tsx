import * as React from 'react';
import 'trix';

interface TrixEditorState {
  editorDocument: string;
  editorSelection: string;
  selectionString: string;
}

const trixEditorStyle = {
  border: '1px gray solid',
  padding: '5px',
}

export default class TrixEditor extends React.Component<{}, TrixEditorState> {
  ref: HTMLElement;
  // trixEditor: any;

  componentDidMount() {
    this.ref.addEventListener('trix-change', this.trixChange.bind(this));
    this.editor().insertString("Hello")

    this.ref.addEventListener('keydown', this.trixKeyDown.bind(this));
    // this.ref.addEventListener('paste', this.trixOnPaste.bind(this));

    this.ref.addEventListener('trix-selection-change', this.trixSelectionChange.bind(this));
  }

  componentWillUnmount() {
  }

  editor(): any {
    return (this.ref as any).editor;
  }

  trixChange() {
    const editorDocument = this.editor().getDocument().toJSONString();
    const documentObject = JSON.parse(editorDocument);
    const prettyEditorDocument = JSON.stringify(documentObject,null,2);
    this.setState({editorDocument: prettyEditorDocument})

    this.editor().getPosition()
  }

  trixSelectionChange() {
    // trix BOM (block object model)
    // each thing is a block
    // a block has text
    // you have a selection range (start,end) in the document
    // you have a position in the document (start)
    // location is (indexBlock, indexString) the block index, the index in the block string (called offset in trix code)
    //
    // Thus we can determine the cursor position and grab text around it (to know you are doing an at)
    const selection = [this.editor().getSelectedRange(), this.editor().getDocument().locationFromPosition(this.editor().getPosition())];
    const selectionString = this.editor().getSelectedDocument().toString();
    this.setState({editorSelection: JSON.stringify(selection), selectionString})
  }

  trixKeyDown(event: KeyboardEvent) {
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
    }
  }

  trixOnPaste(event: ClipboardEvent) {
    console.log("onpaste");
    event.preventDefault();
  }

  render() {
    const editorDocument = this.state?.editorDocument;
    const editorSelection = this.state?.editorSelection;
    const selectionString = this.state?.selectionString;

    return (
      <div>
        {React.createElement('trix-editor', {ref: (ref: HTMLElement) => { this.ref = ref }, style: trixEditorStyle})}

        <pre>
          {editorSelection}
        </pre>
        <pre>
          {selectionString}
        </pre>
        <pre>
          {editorDocument}
        </pre>
      </div>
    )
  }
}
