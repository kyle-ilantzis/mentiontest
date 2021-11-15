import * as React from 'react';
// const pell = require('pell');

interface PellEditorState {
  pellHtml: string
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
        that.ref.innerHTML += `<p><mention contenteditable="false">@Kyle Ilantzis</mention>&nbsp;</p>`
      },
      1000
    )

    const ref = (this.ref as any);
    ref.contentEditable = true;
    ref.oninput = (event: any) => {
      
      if (event.target.firstChild && event.target.firstChild.nodeType === 3) exec('formatBlock', `<p>`)
      else if (ref.innerHTML === '<br>') ref.innerHTML = ''

      that.setState({ pellHtml: that.ref.innerText })
    };

    exec('defaultParagraphSeparator', 'p')
  }

  componentWillUnmount() {
  }

  render() {

    return (
      <div>
        <div ref={((ref: any) => {this.ref = ref}).bind(this)} style={pellEditorStyle} />

        { false && (
          <button >
            {'Pick random mention'}
          </button>
        ) }

        <pre>{this.state?.pellHtml}</pre>
      </div>
    )
  }
}
