import React from 'react';
import InputArea from 'components/InputArea';

export default function CommentInputArea({onSubmit}) {
  return (
    <div className="page-header">
      <h3>Comments</h3>
      <InputArea
        onSubmit={text => onSubmit(text)}
        rows={4}
        placeholder="Post your thoughts here"
      />
    </div>
  )
}
