import React from 'react';

export const UserWrapper: React.FC = (props) => {
  console.log('USER PROPS ', props)
  const name = props.user?.options?.product || ''
  const { sentence } = props

  const finalText = sentence ? sentence.replace('[[user]]', name) : ''

  return (
    <div>
      {
        finalText? (
          <span style={{ marginRight: 4 }} dangerouslySetInnerHTML={{__html: finalText }} />
        ) : null
      }
    </div>
  );
}
