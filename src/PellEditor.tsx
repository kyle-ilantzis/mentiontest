import * as React from 'react';
import { cursorMention, CursorMention, mentionSuggestions } from './mention';

interface PellEditorState {
  contentEditableHTML: string
  mention: CursorMention;
  mentionSuggestionsStr: string;
  mentionSuggestions: string[];
}

const pellEditorStyle = {
  border: '1px gray solid',
  padding: '5px',
};


const exec = (command: string, value: string) => document.execCommand(command, false, value)

export default class TinyEditor extends React.Component<{}, PellEditorState> {
  ref: HTMLElement;

  componentDidMount() {
    const that = this;
    // pell.init({
    //   element: this.ref,
    //   defaultParagraphSeparator: 'p',
    //   actions: [],
    //   onChange: () => {
    //     that.setState({ pellHtml: that.ref.innerText })
    //   }
    // });

    setTimeout(
      () => {
        // that.ref.innerHTML += `<p><mention contenteditable="false">@Kyle Ilantzis</mention>&nbsp;</p>`
      },
      1000
    )

    const ref = (this.ref as any);
    ref.contentEditable = true;
    ref.oninput = (event: any) => {
      
      if (event.target.firstChild && event.target.firstChild.nodeType === 3) exec('formatBlock', `<p>`)
      else if (ref.innerHTML === '<br>') ref.innerHTML = ''

      that.setState({ contentEditableHTML: that.ref.innerText })
    };

    document.onselectionchange = () => {

      const selection = window.getSelection();

      if (selection.anchorNode != selection.focusNode) {
        return;
      }
      if (selection.anchorOffset != selection.focusOffset) {
        return;
      }
      const anchorNode = selection.anchorNode;
      if (anchorNode.nodeType != 3) {
        return;
      }
      let node = anchorNode;
      for(;node != that.ref && node.parentNode;) {
        node = node.parentNode;
      }
      if (node != that.ref) {
        return;
      }

      console.log(anchorNode.textContent, selection.anchorOffset, anchorNode.textContent[selection.anchorOffset]);

      const mention = cursorMention(selection.anchorOffset, anchorNode.textContent);
      if (!mention) {
        return;
      }

      const suggestions = mentionSuggestions(mention);
      this.setState({ mention, mentionSuggestions: suggestions })
    };

    exec('defaultParagraphSeparator', 'p')
  }
  
  onPickRandomMention() {
    const {mention, mentionSuggestions} = this.state;

    if (!mention || !mentionSuggestions) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * mentionSuggestions.length);
    const namePicked = mentionSuggestions[randomIndex];
    console.log(namePicked);

    const html = `<mention contenteditable="false">@${namePicked}</mention>`;
    const mentionElement = createElementFromHTML(html);

    const selection = window.getSelection();

    const nextSibling = selection.anchorNode.nextSibling;

    const beforeText = selection.anchorNode.textContent.slice(0, mention.index);
    const afterText = selection.anchorNode.textContent.slice(mention.index + mention.length);
    const afterElement = document.createTextNode(afterText || ' ');

    selection.anchorNode.textContent = beforeText;
    selection.anchorNode.parentNode.insertBefore(mentionElement, nextSibling);
    selection.anchorNode.parentNode.insertBefore(afterElement, nextSibling);

    selection.removeAllRanges();

    const range = document.createRange()
    range.setStart(afterElement, 1);
    selection.addRange(range);
  }

  componentWillUnmount() {
  }

  render() {

    return (
      <div>
        <div ref={((ref: any) => {this.ref = ref}).bind(this)} style={pellEditorStyle} />

        { this.state?.mentionSuggestions && this.state?.mentionSuggestions.length > 0 && (
          <button onClick={this.onPickRandomMention.bind(this)}>
            {'Pick random mention'}
          </button>
        ) }

        <pre>{JSON.stringify( this.state?.mention )}</pre>

        <pre>{JSON.stringify( this.state?.mentionSuggestions )}</pre>

        <pre>{this.state?.contentEditableHTML}</pre>
      </div>
    )
  }
}

function createElementFromHTML(htmlString: string): ChildNode {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes
  return div.firstChild; 
}
