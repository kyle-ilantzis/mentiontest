import * as React from 'react';
const tiny = require('tinymce/tinymce.min.js');

interface TinyEditorState {

}

const tinyEditorStyle = {
  border: '1px gray solid',
  padding: '5px',
};


export default class TinyEditor extends React.Component<{}, TinyEditorState> {
  ref: HTMLElement;

  componentDidMount() {
    tiny.init({
      target: this.ref,
      inline: true,
      toolbar: false,
      menubar: false,
    });
  }

  componentWillUnmount() {
  }

  render() {

    return (
      <div>
        <div ref={((ref: any) => {this.ref = ref}).bind(this)} style={tinyEditorStyle} />

        { false && (
          <button >
            {'Pick random mention'}
          </button>
        ) }

        <pre></pre>
      </div>
    )
  }
}
