import * as React from 'react';
import { cursorMention, CursorMention, mentionSuggestions } from './mention';
const Trix = require('trix');
interface TrixEditorState {
  editorDocument: string;
  editorSelection: string;
  editorSelectionRange: number[];
  editorLocation: { index: number; offset: number; }
  selectionString: string;
  mention: CursorMention;
  mentionSuggestionsStr: string;
  mentionSuggestions: string[];
}

const trixEditorStyle = {
  border: '1px gray solid',
  padding: '5px',
}

export default class TrixEditor extends React.Component<{}, TrixEditorState> {
  ref: HTMLElement;

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
    const editorSelectionRange = this.editor().getSelectedRange();
    const editorLocation = this.editor().getDocument().locationFromPosition(this.editor().getPosition());
    const selection = [editorSelectionRange, editorLocation];
    const selectionString = this.editor().getSelectedDocument().toString();

    const location = this.editor().getDocument().locationFromPosition(this.editor().getPosition());
    const text = this.editor().getDocument().getTextAtPosition(this.editor().getPosition());
    const mention = cursorMention(location.offset, text.toString());

    const suggestions = mentionSuggestions(mention);

    this.setState({
      editorSelection: JSON.stringify(selection),
      editorSelectionRange,
      editorLocation,
      selectionString, 
      mention: mention,
      mentionSuggestionsStr: JSON.stringify(suggestions),
      mentionSuggestions: suggestions,
    });
  }

  onPickRandomMention() {
    const {mention, mentionSuggestions, editorLocation} = this.state;

    if (!mention || !mentionSuggestions) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * mentionSuggestions.length);
    const namePicked = mentionSuggestions[randomIndex];
    console.log(namePicked);

    const mentionLocation = { index: editorLocation.index, offset: mention.index };
    const mentionPosition = this.editor().getDocument().positionFromLocation(mentionLocation);

    this.editor().setSelectedRange([mentionPosition, mention.length]);


    const html = `<mention>@${namePicked}</mention>`;

    const attachment = new Trix.Attachment({ content: html });
    attachment.getType = () => 'mention';
    this.editor().insertAttachment(attachment);

    // this.editor().insertHTML(html);
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
    const mention = this.state?.mention;
    const mentionSuggestionsStr = this.state?.mentionSuggestionsStr;

    return (
      <div>
        {React.createElement('trix-editor', {ref: (ref: HTMLElement) => { this.ref = ref }, style: trixEditorStyle})}

        { mentionSuggestionsStr && mentionSuggestionsStr.length > 2 && (
          <button onClick={this.onPickRandomMention.bind(this)}>
            {'Pick random mention'}
          </button>
        ) }

        <pre>
          {mentionSuggestionsStr}
         </pre>
        <pre>
          {JSON.stringify(mention)}
        </pre>
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
