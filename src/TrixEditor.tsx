import * as React from 'react';
import 'trix';

import NAMES from './names.json';

interface TrixEditorState {
  editorDocument: string;
  editorSelection: string;
  selectionString: string;
  mention: string;
  mentionSuggestions: string;
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
    const selection = [this.editor().getSelectedRange(), this.editor().getDocument().locationFromPosition(this.editor().getPosition())];
    const selectionString = this.editor().getSelectedDocument().toString();

    const location = this.editor().getDocument().locationFromPosition(this.editor().getPosition());
    const text = this.editor().getDocument().getTextAtPosition(this.editor().getPosition());
    const mention = cursorMention(location.offset, text.toString());

    const suggestions = mentionSuggestions(mention);

    this.setState({
      editorSelection: JSON.stringify(selection),
      selectionString, 
      mention: JSON.stringify(mention),
      mentionSuggestions: JSON.stringify(suggestions),
    });
  }

  pickRandomMention() {

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
    const mentionSuggestions = this.state?.mentionSuggestions;

    return (
      <div>
        {React.createElement('trix-editor', {ref: (ref: HTMLElement) => { this.ref = ref }, style: trixEditorStyle})}

        { mentionSuggestions && mentionSuggestions.length > 2 && (
          <button onClick={this.pickRandomMention.bind(this)}>
            {'Pick random mention'}
          </button>
        ) }

        <pre>
          {mentionSuggestions}
         </pre>
        <pre>
          {mention != null ? '@' : ''}{mention}
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

export function mentionSuggestions( mention: { name: string } ): Array<string> {
  if (!mention) {
    return [];
  }

  const pattern = mention.name.toLowerCase().replace(/\s/, '')

  const names = (NAMES.names as unknown as Array<string>);

  return names.filter( (name) => { return name.toLowerCase().replace(/\s/, '').indexOf(pattern) >= 0 });
}

const mention_re = /(?<before>.{0,1})@(?<name>\w*)(?<after>.{0,1})/g;
const space_re = /^\s$/;

export function cursorMention(cursorIndex: number, inputText: string): { name: string } {

  const matches = inputText.matchAll(mention_re);

  let cursorMatch;

  for (const match of matches) {

    const beforeIsEmpty = match.groups.before == null || match.groups.before === '' || space_re.test(match.groups.before);
    const cursorAfterMatchStart = match.index <= cursorIndex;
    const cursorBeforeMatchEnd = match.index + match[0].length >= cursorIndex;
    const afterIsEmpty = match.groups.after == null || match.groups.after === '' || space_re.test(match.groups.after);

    if ( beforeIsEmpty && cursorAfterMatchStart && cursorBeforeMatchEnd && afterIsEmpty) {
      cursorMatch = match;
      break;
    }
  }

  if (!cursorMatch) {
    return null;
  }
  
  const name = cursorMatch.groups.name;
    return { name };
}